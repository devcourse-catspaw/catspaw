import Button from "../../components/common/Button";
import pawPencil from "../../assets/images/paw_pencil_big.svg";
import doodle from "../../assets/images/background_doodle4.svg";
import NavWithExit from "../../components/common/NavWithExit";
import LabeledInput from "../../components/common/LabeledInput";
import { useEffect, useRef, useState } from "react";
import { useGameTimerStore } from "../../stores/gameTimerStore";
import { useNavigate } from "react-router-dom";
import GameTimer from "../../components/game/GameTimer";
import supabase from "../../utils/supabase";
import { useAuthStore } from "../../stores/authStore";
import { useGameRoomStore } from "../../stores/gameRoomStore";

export default function MultiModeWords() {
  const { user } = useAuthStore();
  const { game, turn } = useGameRoomStore();
  const { timeLeft, setTime, decrease, reset } = useGameTimerStore();

  const navigate = useNavigate();

  const [disabled, setDisabled] = useState(false);
  const [word, setWord] = useState("");
  const [invalid, setInvalid] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // const saveWords = useCallback(
  //   async (isClick: boolean) => {
  const saveWords = async (isClick: boolean) => {
    if (!game || !user) return;
    const { data, error } = await supabase
      .from("turns")
      .update({
        content: word,
      })
      .eq("game_id", game.id)
      .eq("turn_number", turn)
      .eq("sender_id", user.id)
      .select();

    if (data) {
      // console.log('저장 완료:', data);

      if (isClick) {
        const { data: dataGame, error: errorGame } = await supabase
          .from("games")
          .update({
            complete_players: game.complete_players + 1,
          })
          .eq("id", game.id)
          .select();

        if (dataGame) {
          // console.log('complete players 업데이트 완료:', dataGame);
          setIsComplete(true);
        }
        if (errorGame) {
          console.log("complete players 업데이트 실패");
          console.error(errorGame);
        }
      }
    }
    if (error) {
      console.log("저장 실패");
      console.error(error);
    }
  };
  //   },
  //   [game, user, turn, word]
  // );

  let lastEnterTime = 0;
  const keyDownHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const now = Date.now();
      if (now - lastEnterTime < 500) return;

      lastEnterTime = now;

      e.preventDefault();
      checkValidation();
    }
  };

  // const checkValidation = useCallback(() => {
  const checkValidation = () => {
    if (disabled) return;

    setDisabled(true);
    if (word.trim() !== "") {
      // console.log('이동합니당');
      saveWords(true);
    } else setInvalid(true);

    setTimeout(() => setDisabled(false), 500);
  };
  // }, [word, saveWords]);

  // const isZero = async () => {
  //   if (!game) return;

  //   if (!isComplete) await saveWords(false);
  //   //

  //   const { data: dataGame, error: errorGame } = await supabase
  //     .from('games')
  //     .update({
  //       timeout_players: game.timeout_players + 1,
  //     })
  //     .eq('id', game?.id)
  //     .select();

  //   if (dataGame) {
  //     console.log('timeout players 업데이트 완료:', dataGame);
  //   }
  //   if (errorGame) {
  //     console.log('timeout players 업데이트 실패');
  //     console.error(errorGame);
  //   }
  // };

  const moveToNextTurn = async () => {
    if (!game) return;

    const { data: dataGame, error: errorGame } = await supabase
      .from("games")
      .update({
        complete_players: 0,
        timeout_players: 0,
      })
      .eq("id", game?.id)
      .select();

    if (dataGame) {
      // console.log('complete players, timeout_players 초기화 완료:', dataGame);
      useGameRoomStore.getState().updateGame({
        complete_players: dataGame[0].complete_players,
        timeout_players: dataGame[0].timeout_players,
      });
      // console.log('useGameRoomStore:', useGameRoomStore.getState().game);
    }
    if (errorGame) {
      console.log("complete players, timeout_players 초기화 실패");
      console.error(errorGame);
    }

    useGameRoomStore.getState().changeTurn(turn + 1);
    // console.log('useGameRoomStore Turn:', useGameRoomStore.getState().turn);

    navigate("/game/multi/drawing");
  };

  useEffect(() => {
    useGameRoomStore.getState().loadGameFromSession();
    useGameRoomStore.getState().loadPlayerFromSession();
    useGameRoomStore.getState().loadTurnFromSession();

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

          useGameRoomStore.getState().updateGame({
            complete_players: newStatus.complete_players,
            timeout_players: newStatus.timeout_players,
          });
          // console.log('useGameRoomStore:', useGameRoomStore.getState().game);

          if (newStatus.complete_players === newStatus.current_players) {
            // console.log('전원 제출해서 넘어감');
            moveToNextTurn();
            return;
            // } else if (newStatus.timeout_players >= newStatus.current_players) {
            //   console.log('전원 타이머 끝나서 넘어감');
            //   if (!isComplete) saveWords(false);
            //   moveToNextTurn();

            // (async () => {
            //   if (!isComplete) await saveWords(false);
            //   await moveToNextTurn();
            // })();

            // return;
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [game?.id]);

  useEffect(() => {
    setTime(60);
    const timer = setInterval(() => {
      decrease();
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      // isZero();

      (async () => {
        if (!isComplete) await saveWords(false);

        await moveToNextTurn();
      })();
      reset();
    }
  }, [timeLeft]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="w-full min-h-screen flex flex-col items-center px-20 pt-[14px] relative">
      <NavWithExit title={game?.room_name} />
      <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex items-center gap-5">
          <div className="relative flex flex-col justify-center items-center gap-[22px] rounded-[6px] w-[711px] h-[291px] py-11 bg-[var(--white)] border-2 border-[var(--black)]">
            <div className="absolute top-3 right-4 font-semibold text-[16px] p-2">
              {game?.complete_players} / {game?.current_players}
            </div>
            <div className="font-semibold text-[22px]">
              다른 플레이어가 그릴 제시어를 설정해주세요.
            </div>
            <LabeledInput
              ref={inputRef}
              value={word}
              readOnly={isComplete}
              onChange={(e) => {
                setWord(e.target.value);
                setInvalid(false);
              }}
              title=""
              invalidMessage="한 글자 이상 입력해주세요."
              isInvalid={invalid}
              onKeyDown={keyDownHandler}
              placeholder="제시어 입력"
              className="w-[500px] h-[50px] pr-[50px]"
            />
            {isComplete ? (
              <Button
                disabled
                className="w-30 h-11 px-0 py-0 cursor-not-allowed"
              >
                제출 완료
              </Button>
            ) : (
              <Button onClick={checkValidation} className="w-30 h-11 px-0 py-0">
                제출
              </Button>
            )}
          </div>
          <GameTimer totalTime={60} />
        </div>
      </div>
      <img
        src={pawPencil}
        alt="paw pencil 이미지"
        className="fixed bottom-25 right-0 -z-10"
      />
      <img
        src={doodle}
        alt="그림 이미지"
        className="fixed bottom-[-150px] right-[150px] w-[3000px] h-[1000px] -z-10"
      />
    </div>
  );
}
