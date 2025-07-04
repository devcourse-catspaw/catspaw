import Button from '../../components/common/Button';
import WaitingRoom, {
  type PlayerUserProps,
} from '../../components/common/WaitingRoom';
import NavWithExit from '../../components/common/NavWithExit';
import type { Database } from '../../types/supabase';
import supabase from '../../utils/supabase';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WaitingRoomSkeleton from '../../components/game/WaitingRoomSkeleton';
import { useAuthStore } from '../../stores/authStore';
import { useGameRoomStore } from '../../stores/gameRoomStore';
import Chat from '../../components/game/Chat';
import toast from 'react-hot-toast';
import { debounce } from 'lodash';

export type UserProps = Database['public']['Tables']['users']['Row'];
export type PlayerProps = Database['public']['Tables']['players']['Row'];

export default function GameWaitingRoom() {
  const navigate = useNavigate();

  const { user } = useAuthStore();
  const { game, player } = useGameRoomStore();

  const [count, setCount] = useState<number | null>(null);
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

  const clickStartHandler = useCallback(
    debounce(async () => {
      if (!game) return;

      await supabase
        .from('games')
        .update({ status: 'PLAYING' })
        .eq('id', game.id);

      useGameRoomStore.getState().updateGame({ status: 'PLAYING' });
    }, 1000),
    [game]
  );

  const clickReadyHandler = useCallback(
    debounce(async () => {
      if (!user || !game) return;
      const { data: dataP, error } = await supabase
        .from('players')
        .update({
          is_ready: true,
        })
        .eq('user_id', user?.id)
        .select();

      if (dataP) {
        useGameRoomStore.getState().updatePlayer({ is_ready: true });

        const { data, error } = await supabase
          .from('games')
          .update({
            ready_players: game.ready_players + 1,
          })
          .eq('id', game.id)
          .select();

        if (data) {
          useGameRoomStore.getState().setGame(data[0]);
        }
        if (error) {
          console.error('Ready Count error:', error.message);
        }
      }

      if (error) {
        console.error('Ready error:', error.message);
      }
    }, 1000),
    [user, game]
  );

  const clickExitHandler = useCallback(
    debounce(async () => {
      if (!user || !game || !player) return;

      if (player.is_leader) {
        const { error } = await supabase
          .from('games')
          .delete()
          .eq('id', game.id);

        if (error) {
          console.error('삭제 실패:', error.message);
        } else {
          useGameRoomStore.getState().resetGame();
          useGameRoomStore.getState().resetPlayer();
          navigate('/game/list');
        }
      } else {
        const { error } = await supabase
          .from('players')
          .delete()
          .eq('user_id', user?.id);

        if (error) {
          console.error('삭제 실패:', error.message);
        } else {
          useGameRoomStore.getState().resetPlayer();

          if (player?.is_ready) {
            const { data, error } = await supabase
              .from('games')
              .update({
                current_players: game.current_players - 1,
                ready_players: game.ready_players - 1,
              })
              .eq('id', game.id)
              .select();

            if (error) {
              console.error('카운트 실패:', error.message);
            } else {
              useGameRoomStore.getState().setGame(data[0]);
              navigate('/game/list');
            }
          } else {
            const { data, error } = await supabase
              .from('games')
              .update({ current_players: game.current_players - 1 })
              .eq('id', game.id)
              .select();

            if (error) {
              console.error('카운트 실패:', error.message);
            } else {
              useGameRoomStore.getState().setGame(data[0]);
              navigate('/game/list');
            }
          }
        }
      }
    }, 500),
    [user, game, player]
  );

  const getPlayerList = async () => {
    if (!game) {
      return;
    }
    if (game) {
      try {
        const { data } = await supabase
          .from('players')
          .select(
            `
            *,
            users(
              *
            )
          `
          )
          .eq('game_id', game.id)
          .order('joined_at', { ascending: true });
        if (data) {
          setPlayers(data);
          setIsLoading(false);
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  useEffect(() => {
    if (count === null) return;
    if (count === 0) {
      navigate('/game/multi');
      return;
    }
    const timer = setTimeout(() => {
      setCount((prev) => (prev ?? 0) - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [count, navigate]);

  useEffect(() => {
    useGameRoomStore.getState().loadGameFromSession();
    useGameRoomStore.getState().loadPlayerFromSession();

    getPlayerList();
    checkLeader();
    checkAllReady();

    if (!game?.id) return;
    const playersChannel = supabase
      .channel(`change_players_${game?.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'players',
          filter: `game_id=eq.${game?.id}`,
        },
        async (payload) => {
          const { eventType, new: newPlayer } = payload;

          if (!newPlayer) return;

          const player = newPlayer as PlayerProps;
          let final: PlayerUserProps[];

          const { data: user } = await supabase
            .from('users')
            .select('*')
            .eq('id', player.user_id)
            .maybeSingle();

          setPlayers((prevPlayers) => {
            switch (eventType) {
              case 'INSERT':
                final = [
                  ...prevPlayers,
                  {
                    ...player,
                    users: {
                      avatar: user?.avatar ?? '',
                      created_at: user?.created_at ?? '',
                      email: user?.email ?? '',
                      id: user?.id ?? '',
                      nickname: user?.nickname ?? '',
                    },
                  },
                ];

                useGameRoomStore.getState().updateGame({
                  ready_players: [...final].filter((p) => p.is_ready).length,
                  current_players: final.length,
                });

                return final;
              case 'UPDATE':
                final = prevPlayers.map((p) =>
                  p.id === player.id
                    ? {
                        ...player,
                        users: {
                          avatar: user?.avatar ?? '',
                          created_at: user?.created_at ?? '',
                          email: user?.email ?? '',
                          id: user?.id ?? '',
                          nickname: user?.nickname ?? '',
                        },
                      }
                    : p
                );

                useGameRoomStore.getState().updateGame({
                  ready_players: [...final].filter((p) => p.is_ready).length,
                  current_players: final.length,
                });

                return final;
              default:
                useGameRoomStore.getState().updateGame({
                  ready_players: [...prevPlayers].filter((p) => p.is_ready)
                    .length,
                  current_players: prevPlayers.length,
                });
                console.log(
                  'useGameRoomStore:',
                  useGameRoomStore.getState().game
                );
                return prevPlayers;
            }
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'players',
        },
        async (payload) => {
          const { old: oldPlayer } = payload;

          let final: PlayerUserProps[];

          setPlayers((prevPlayers) => {
            final = prevPlayers.filter(
              (p) => p.id !== (oldPlayer as PlayerProps).id
            );

            useGameRoomStore.getState().updateGame({
              ready_players: [...final].filter((p) => p.is_ready).length,
              current_players: final.length,
            });

            return final;
          });
        }
      )
      .subscribe();

    const gamesChannel = supabase
      .channel(`room-${game?.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'games',
          filter: `id=eq.${game?.id}`,
        },
        async (payload) => {
          const newStatus = payload.new;
          if (newStatus.status === 'PLAYING') {
            useGameRoomStore
              .getState()
              .updateGame({ status: newStatus.status });

            if (
              newStatus.leader_id === user?.id ||
              newStatus.leader_id === player?.user_id
            ) {
              const res = await fetch(
                'https://neddelxefvltdmbkyymh.supabase.co/functions/v1/createTurns',
                {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    game_id: game?.id,
                  }),
                }
              );
              const data = await res.json();
              console.log('성공:', data);

              useGameRoomStore.getState().changeTurn(1);

              setCount(3);
            } else {
              useGameRoomStore.getState().changeTurn(1);

              setTimeout(() => {
                setCount(3);
              }, 1000);
            }
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'games',
          filter: `id=eq.${game?.id}`,
        },
        () => {
          useGameRoomStore.getState().resetGame();
          useGameRoomStore.getState().resetPlayer();
          navigate('/game/list');
          toast('방장이 방을 폭파시켰습니다!');
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(playersChannel);
      supabase.removeChannel(gamesChannel);
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
        {count === null ? (
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
                    'repeating-linear-gradient(to right, black 0 12px, transparent 12px 24px)',
                }}
              ></div>
              {isLeader ? (
                isAllReady ? (
                  <Button
                    className="text-[28px] w-[320px] h-[82px] bg-[var(--blue)]"
                    onClick={clickStartHandler}
                  >
                    Start
                  </Button>
                ) : (
                  <Button
                    disabled
                    className="text-[28px] w-[320px] h-[82px] bg-[var(--grey-100)] cursor-not-allowed"
                  >
                    Start
                  </Button>
                )
              ) : player?.is_ready ? (
                <Button className="text-[28px] w-[320px] h-[82px] bg-[var(--grey-100)] cursor-not-allowed">
                  Ready
                </Button>
              ) : (
                <Button
                  className="text-[28px] w-[320px] h-[82px] bg-[var(--blue)]"
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
        ) : (
          <div className="text-[134px] font-gloria font-extrabold text-[color:var(--black)] animate-pulse z-50">
            {count}
          </div>
        )}
      </div>
    </div>
  );
}
