import Button from "../../components/common/Button";
import WaitingRoom, {
  type PlayerUserProps,
} from "../../components/common/WaitingRoom";
import NavWithExit from "../../components/common/NavWithExit";
import type { Database } from "../../types/supabase";
import supabase from "../../utils/supabase";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import WaitingRoomSkeleton from "../../components/game/WaitingRoomSkeleton";
import { useAuthStore } from "../../stores/authStore";
import { useGameRoomStore } from "../../stores/gameRoomStore";
import Chat from "../../components/game/Chat";

export type UserProps = Database["public"]["Tables"]["users"]["Row"];
export type PlayerProps = Database["public"]["Tables"]["players"]["Row"];

export default function GameWaitingRoom() {
  const navigate = useNavigate();

  const { user } = useAuthStore();
  const { game, player } = useGameRoomStore();

  const [isLoading, setIsLoading] = useState(true);
  const [isLeader, setIsLeader] = useState(false);
  const [isAllReady, setIsAllReady] = useState(false);
  const [players, setPlayers] = useState<PlayerUserProps[]>([]);

  const checkLeader = () => {
    const leader = players.find(
      (player) => player.is_leader && player.user_id === user?.id
    );
    setIsLeader(!!leader);
  };

  const checkAllReady = () => {
    if (players.length === 1) {
      setIsAllReady(false);
      return;
    }
    const allReady = players
      .filter((player) => !player.is_leader)
      .every((player) => player.is_ready);
    setIsAllReady(allReady);
  };

  const clickStartHandler = async () => {
    if (!game) return;

    await supabase
      .from("games")
      .update({ status: "PLAYING" })
      .eq("id", game.id);

    console.log("게임을 시작합니다!");
    useGameRoomStore.getState().updateGame({ status: "PLAYING" });
    console.log("useGameRoomStore:", useGameRoomStore.getState().game);
  };

  const clickReadyHandler = async () => {
    if (!user || !game) return;
    const { data: dataP, error } = await supabase
      .from("players")
      .update({
        is_ready: true,
      })
      .eq("user_id", user?.id)
      .select();

    if (dataP) {
      console.log("READY 성공!");
      useGameRoomStore.getState().updatePlayer({ is_ready: true });
      console.log(
        "useGameRoomStore Player:",
        useGameRoomStore.getState().player
      );

      const { data, error } = await supabase
        .from("games")
        .update({
          ready_players: game.ready_players + 1,
        })
        .eq("id", game.id)
        .select();

      if (data) {
        console.log("레디 카운트 성공!");
        useGameRoomStore.getState().setGame(data[0]);
        console.log("useGameRoomStore:", useGameRoomStore.getState().game);
      }
      if (error) {
        console.log("레디 카운트 에러");
        console.error("Ready Count error:", error.message);
      }
    }

    if (error) {
      console.log("READY 에러");
      console.error("Ready error:", error.message);
    }
  };

  const clickExitHandler = async () => {
    if (!user || !game) return;
    const { error } = await supabase
      .from("players")
      .delete()
      .eq("user_id", user?.id);

    if (error) {
      console.error("삭제 실패:", error.message);
    } else {
      console.log("삭제 성공");
      useGameRoomStore.getState().resetPlayer();
      console.log(
        "useGameRoomStore Player:",
        useGameRoomStore.getState().player
      );

      const { data, error } = await supabase
        .from("games")
        .update({ current_players: game.current_players - 1 })
        .eq("id", game.id)
        .select();

      if (error) {
        console.error("카운트 실패:", error.message);
      } else {
        console.log("카운트 성공");
        useGameRoomStore.getState().setGame(data[0]);
        console.log("useGameRoomStore:", useGameRoomStore.getState().game);
        navigate("/game/list");
      }
    }
  };

  const getPlayerList = async () => {
    if (!game) {
      console.log("game이 없음... :", game);
      return;
    }
    if (game) {
      console.log("game 있음~! :", game);
      try {
        const { data } = await supabase
          .from("players")
          .select(
            `
            *,
            users(
              *
            )
          `
          )
          .eq("game_id", game.id)
          .order("joined_at", { ascending: true });
        if (data) {
          console.log(data);
          setPlayers(data);
          setIsLoading(false);
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  useEffect(() => {
    useGameRoomStore.getState().loadGameFromSession();
    useGameRoomStore.getState().loadPlayerFromSession();

    getPlayerList();
    checkLeader();
    checkAllReady();

    const channel = supabase
      .channel("change_players")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "players",
          filter: `game_id=eq.${game?.id}`,
        },
        async (payload) => {
          console.log(payload);

          const { eventType, new: newPlayer, old: oldPlayer } = payload;

          if (!newPlayer) return;

          const player = newPlayer as PlayerProps;
          let final: PlayerUserProps[];

          const { data: user } = await supabase
            .from("users")
            .select("*")
            .eq("id", player.user_id)
            .maybeSingle();
          // .single();

          console.log("player.user_id:", player.user_id);
          console.log("user:", user);

          setPlayers((prevPlayers) => {
            switch (eventType) {
              case "INSERT":
                final = [
                  ...prevPlayers,
                  {
                    ...player,
                    users: {
                      avatar: user?.avatar ?? "",
                      created_at: user?.created_at ?? "",
                      email: user?.email ?? "",
                      id: user?.id ?? "",
                      nickname: user?.nickname ?? "",
                    },
                  },
                ];

                useGameRoomStore.getState().updateGame({
                  ready_players: [...final].filter((p) => p.is_ready).length,
                  current_players: final.length,
                });
                console.log(
                  "useGameRoomStore:",
                  useGameRoomStore.getState().game
                );

                return final;
              case "UPDATE":
                final = prevPlayers.map((p) =>
                  p.id === player.id
                    ? {
                        ...player,
                        users: {
                          avatar: user?.avatar ?? "",
                          created_at: user?.created_at ?? "",
                          email: user?.email ?? "",
                          id: user?.id ?? "",
                          nickname: user?.nickname ?? "",
                        },
                      }
                    : p
                );

                useGameRoomStore.getState().updateGame({
                  ready_players: [...final].filter((p) => p.is_ready).length,
                  current_players: final.length,
                });
                console.log(
                  "useGameRoomStore:",
                  useGameRoomStore.getState().game
                );

                return final;
              case "DELETE":
                final = prevPlayers.filter(
                  (p) => p.id !== (oldPlayer as PlayerProps).id
                );

                useGameRoomStore.getState().updateGame({
                  ready_players: [...final].filter((p) => p.is_ready).length,
                  current_players: final.length,
                });
                console.log(
                  "useGameRoomStore:",
                  useGameRoomStore.getState().game
                );

                return final;
              default:
                useGameRoomStore.getState().updateGame({
                  ready_players: [...prevPlayers].filter((p) => p.is_ready)
                    .length,
                  current_players: prevPlayers.length,
                });
                console.log(
                  "useGameRoomStore:",
                  useGameRoomStore.getState().game
                );
                return prevPlayers;
            }
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel(`room-${game?.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "games",
          filter: `id=eq.${game?.id}`,
        },
        async (payload) => {
          const newStatus = payload.new;
          if (newStatus.status === "PLAYING") {
            useGameRoomStore
              .getState()
              .updateGame({ status: newStatus.status });
            console.log("useGameRoomStore:", useGameRoomStore.getState().game);

            console.log("리더 아이디:", newStatus.leader_id);
            console.log("내 아이디:", user?.id);
            if (newStatus.leader_id === user?.id) {
              const res = await fetch(
                "https://neddelxefvltdmbkyymh.supabase.co/functions/v1/createTurns",
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    game_id: game?.id,
                  }),
                }
              );
              const data = await res.json();
              console.log("성공:", data);
            }

            useGameRoomStore.getState().changeTurn(1);
            console.log(
              "useGameRoomStore Turn:",
              useGameRoomStore.getState().turn
            );

            navigate("/game/multi");
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [game?.id]);

  useEffect(() => {
    checkLeader();
  }, [players, user?.id]);

  useEffect(() => {
    checkAllReady();
  }, [players]);

  return (
    <div className="w-full min-h-screen flex flex-col items-center px-20 pt-[14px] relative">
      <NavWithExit title={game?.room_name} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex justify-center items-center gap-[56px] px-[138px]">
          <div className="flex flex-col items-center gap-[23px] w-[321px]">
            <div className="flex flex-col gap-[14px] h-[352px]">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <WaitingRoomSkeleton key={i} />
                ))
              ) : (
                <>
                  {players.map((player) => (
                    <WaitingRoom key={player.id} {...player} />
                  ))}
                </>
              )}
            </div>
            <div
              className="w-[256px] h-[3px] rounded-full"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(to right, black 0 12px, transparent 12px 24px)",
              }}
            ></div>
            {isLeader ? (
              <Button
                className={`text-[28px] w-[320px] h-[82px] bg-[var(--blue)] ${
                  !isAllReady && "bg-[var(--grey-100)] cursor-not-allowed"
                }`}
                onClick={clickStartHandler}
              >
                Start
              </Button>
            ) : (
              <Button
                className={`text-[28px] w-[320px] h-[82px] bg-[var(--blue)] ${
                  player?.is_ready && "bg-[var(--grey-100)] cursor-not-allowed"
                }`}
                onClick={clickReadyHandler}
              >
                Ready
              </Button>
            )}

            <Button
              className="text-[28px] w-[320px] h-[82px]"
              onClick={clickExitHandler}
            >
              Exit
            </Button>
          </div>
          <Chat />
        </div>
      </div>
    </div>
  );
}
