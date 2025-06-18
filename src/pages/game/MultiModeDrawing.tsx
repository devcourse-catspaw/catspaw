import { useEffect, useRef, useState } from "react";
import send from "../../assets/images/icon_send.svg";
import NavWithExit from "../../components/common/NavWithExit";
import DrawingCanvas from "../../components/game/DrawingCanvas";
import { useNavigate } from "react-router";
import { useGameTimerStore } from "../../stores/gameTimerStore";
import GameTimer from "../../components/game/GameTimer";
import ChatMessage from "../../components/common/ChatMessage";
import BaseInput from "../../components/common/BaseInput";
import Button from "../../components/common/Button";
import supabase from "../../utils/supabase";
import { useAuthStore } from "../../stores/authStore";
import { useGameRoomStore } from "../../stores/gameRoomStore";
import Chat from "../../components/game/Chat";

export default function MultiModeDrawing({ step }: { step: string }) {
  const { user } = useAuthStore();
  const { game, turn } = useGameRoomStore();
  const { timeLeft, setTime, decrease, reset } = useGameTimerStore();

  const navigate = useNavigate();

  const [words, setWords] = useState("");
  const [drawingUrl, setDrawingUrl] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  let lastEnterTime = 0;
  const keyDownHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const now = Date.now();
      if (now - lastEnterTime < 500) return;

      lastEnterTime = now;

      e.preventDefault();
      sendMessageHandler();
    }
  };

  const getMessages = async () => {
    setShouldScrollToBottom(true);
  };

  const sendMessageHandler = () => {
    if (msg.trim() === "") return;
    setReloadTrigger((reloadTrigger) => reloadTrigger + 1);
    setShouldScrollToBottom(true);
    inputRef.current?.focus();
  };

  const getWords = async () => {
    if (!game || !user) {
      console.log("game이나 user 없음... game:", game);
      console.log("game이나 user 없음... user:", user);
      return;
    }
    const { data, error } = await supabase
      .from("turns")
      .select(
        `
          content
        `
      )
      .eq("game_id", game.id)
      .eq("turn_number", turn - 1)
      .eq("receiver_id", user.id);

    if (data) {
      console.log("제시어 가져오기 성공:", data);
      setWords(data[0].content!);
    }
    if (error) {
      console.log("제시어 가져오기 실패");
      console.error(error);
    }
  };

  const getDrawings = async () => {
    if (!game || !user) {
      console.log("game이나 user 없음... game:", game);
      console.log("game이나 user 없음... user:", user);
      return;
    }
    const { data, error } = await supabase
      .from("turns")
      .select(
        `
          content
        `
      )
      .eq("game_id", game.id)
      .eq("turn_number", turn - 1)
      .eq("receiver_id", user.id);

    if (data) {
      console.log("그림 가져오기 성공:", data);
      setDrawingUrl(data[0].content!);
    }
    if (error) {
      console.log("그림 가져오기 실패");
      console.error(error);
    }
  };

  const sendWordsHandler = async (answer: string) => {
    if (!game || !user) return;
    const { data, error } = await supabase
      .from("turns")
      .update({
        content: answer,
      })
      .eq("game_id", game.id)
      .eq("turn_number", turn)
      .eq("sender_id", user.id)
      .select();

    if (data) {
      console.log("저장 완료:", data);

      const { data: dataGame, error: errorGame } = await supabase
        .from("games")
        .update({
          complete_players: game.complete_players + 1,
        })
        .eq("id", game.id)
        .select();

      if (dataGame) {
        console.log("complete players 업데이트 완료:", dataGame);
        setIsComplete(true);
      }
      if (errorGame) {
        console.log("complete players 업데이트 실패");
        console.error(errorGame);
      }
    }
    if (error) {
      console.log("저장 실패");
      console.error(error);
    }
  };

  const sendDrawingHandler = async (imageDataUrl: string) => {
    const filename = `drawing-${Date.now()}.png`;
    const fileData = await fetch(imageDataUrl);
    const blob = await fileData.blob();

    const file = new File([blob], filename, { type: "image/png" });

    const { error: uploadError } = await supabase.storage
      .from("multimode-images")
      .upload(`${game?.id}/${filename}`, file);

    if (uploadError) {
      console.error(uploadError);
      return;
    }

    const { data: publicData } = supabase.storage
      .from("multimode-images")
      .getPublicUrl(`${game?.id}/${filename}`);

    const publicUrl = publicData.publicUrl;

    if (!game || !user) return;
    const { data: updateData, error: updateError } = await supabase
      .from("turns")
      .update({
        content: publicUrl,
      })
      .eq("game_id", game.id)
      .eq("turn_number", turn)
      .eq("sender_id", user.id)
      .select();

    if (updateData) {
      console.log("publicUrl 업데이트 완료:", updateData);

      const { data: dataGame, error: errorGame } = await supabase
        .from("games")
        .update({
          complete_players: game.complete_players + 1,
        })
        .eq("id", game.id)
        .select();

      if (dataGame) {
        console.log("complete players 업데이트 완료:", dataGame);
        setIsComplete(true);
      }
      if (errorGame) {
        console.log("complete players 업데이트 실패");
        console.error(errorGame);
      }
    }
    if (updateError) {
      console.log("publicUrl 업데이트 실패");
      console.error(updateError);
    }
  };

  const moveToNextTurn = async () => {
    if (!game) return;
    const { data: dataGame, error: errorGame } = await supabase
      .from("games")
      .update({
        complete_players: 0,
      })
      .eq("id", game?.id)
      .select();

    if (dataGame) {
      console.log("complete players 초기화 완료:", dataGame);
      useGameRoomStore
        .getState()
        .updateGame({ complete_players: dataGame[0].complete_players });
      console.log("useGameRoomStore:", useGameRoomStore.getState().game);
    }
    if (errorGame) {
      console.log("complete players 초기화 실패");
      console.error(errorGame);
    }

    console.log("turn:", turn);
    console.log("game.current_players:", game.current_players);

    if (turn === game.current_players) {
      // if (turn > game.current_players) {
      console.log("결과화면으로 이동합니당");
      navigate("/game/multi/result");
      return;
    }

    useGameRoomStore.getState().changeTurn(turn + 1);
    console.log("useGameRoomStore Turn:", useGameRoomStore.getState().turn);

    if (step === "DRAWING") {
      navigate("/game/multi/words");
      return;
    } else if (step === "WORDS") {
      navigate("/game/multi/drawing");
      return;
    }
  };

  useEffect(() => {
    const channel = supabase
      .channel(`room-complete-${game?.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "games",
          filter: `id=eq.${game?.id}`,
        },
        (payload) => {
          const newStatus = payload.new;

          useGameRoomStore
            .getState()
            .updateGame({ complete_players: newStatus.complete_players });
          console.log("useGameRoomStore:", useGameRoomStore.getState().game);

          if (newStatus.complete_players === newStatus.current_players) {
            console.log("전원 제출해서 넘어감");
            moveToNextTurn();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [game?.id]);

  useEffect(() => {
    useGameRoomStore.getState().loadGameFromSession();
    useGameRoomStore.getState().loadPlayerFromSession();
    useGameRoomStore.getState().loadTurnFromSession();

    if (step === "DRAWING") getWords();
    else if (step === "WORDS") getDrawings();

    setTime(180);
    const timer = setInterval(() => {
      decrease();
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      console.log("시간 다 돼서 넘어감");
      reset();
      // moveToNextTurn();
    }
  }, [timeLeft]);

  useEffect(() => {
    getMessages();
  }, [reloadTrigger]);

  useEffect(() => {
    if (bottomRef && shouldScrollToBottom) {
      bottomRef.current?.scrollIntoView({ behavior: "auto", block: "end" });
      setShouldScrollToBottom(false);
    }
  }, [reloadTrigger, bottomRef, messages, shouldScrollToBottom]);

  return (
    <div className="w-full min-h-screen flex flex-col items-center px-20 pt-[14px] relative">
      <NavWithExit title={game?.room_name} />
      <div className="flex gap-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col gap-5 items-end">
          <div className="mr-3">
            <div className="w-[595px] h-[62px] relative flex justify-center items-center text-[18px] font-semibold bg-[var(--white)] rounded-[6px] border-2 border-[var(--black)]">
              <div>{step === "DRAWING" ? words : "그림을 맞혀보세요!"}</div>
              <div className="absolute top-2 right-4 font-semibold text-[16px] p-2">
                {game?.complete_players} / {game?.current_players}
              </div>
            </div>
          </div>
          {step === "DRAWING" ? (
            <DrawingCanvas
              step={step}
              isComplete={isComplete}
              onSubmitDrawing={sendDrawingHandler}
              moveToNextTurn={moveToNextTurn}
            />
          ) : (
            <DrawingCanvas
              step={step}
              isComplete={isComplete}
              drawingUrl={drawingUrl}
              onSubmitWords={sendWordsHandler}
              moveToNextTurn={moveToNextTurn}
            />
          )}
        </div>
        <div className="flex items-center mt-3">
          <GameTimer totalTime={180} />
        </div>
        {/* h-[480px]  */}
        <Chat size="small" />
      </div>
    </div>
  );
}
