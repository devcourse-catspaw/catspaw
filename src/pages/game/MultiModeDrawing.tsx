import { useEffect, useState } from 'react';
import NavWithExit from '../../components/common/NavWithExit';
import DrawingCanvasMulti from '../../components/game/DrawingCanvasMulti';
import { useNavigate } from 'react-router';
import { useGameMultiTimerStore } from '../../stores/gameMultiTimerStore';
import GameMultiTimer from '../../components/game/GameMultiTimer';
import supabase from '../../utils/supabase';
import { useAuthStore } from '../../stores/authStore';
import { useGameRoomStore } from '../../stores/gameRoomStore';
import Chat from '../../components/game/Chat';

export default function MultiModeDrawing({ step }: { step: string }) {
  const { user } = useAuthStore();
  const { game, turn } = useGameRoomStore();
  const { timeLeft, setTime, decrease, reset } = useGameMultiTimerStore();

  const navigate = useNavigate();

  const [words, setWords] = useState('');
  const [drawingUrl, setDrawingUrl] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [trigger, setTrigger] = useState(false);

  const getWords = async () => {
    if (!game || !user) {
      return;
    }
    const { data, error } = await supabase
      .from('turns')
      .select(
        `
          content
        `
      )
      .eq('game_id', game.id)
      .eq('turn_number', turn - 1)
      .eq('receiver_id', user.id);

    if (data) {
      setWords(data[0].content!);
    }
    if (error) {
      console.log('제시어 가져오기 실패');
      console.error(error);
    }
  };

  const getDrawings = async () => {
    if (!game || !user) {
      return;
    }
    const { data, error } = await supabase
      .from('turns')
      .select(
        `
          content
        `
      )
      .eq('game_id', game.id)
      .eq('turn_number', turn - 1)
      .eq('receiver_id', user.id);

    if (data) {
      setDrawingUrl(data[0].content!);
    }
    if (error) {
      console.log('그림 가져오기 실패');
      console.error(error);
    }
  };

  const sendWordsHandler = async (answer: string, isOver: boolean) => {
    if (!game || !user) return;
    const { data, error } = await supabase
      .from('turns')
      .update({
        content: answer,
      })
      .eq('game_id', game.id)
      .eq('turn_number', turn)
      .eq('sender_id', user.id)
      .select();

    if (data) {
      if (!isOver) {
        const { data: dataGame, error: errorGame } = await supabase
          .from('games')
          .update({
            complete_players: game.complete_players + 1,
          })
          .eq('id', game.id)
          .select();

        if (dataGame) {
          setIsComplete(true);
        }
        if (errorGame) {
          console.log('complete players 업데이트 실패');
          console.error(errorGame);
        }
      }
    }
    if (error) {
      console.log('저장 실패');
      console.error(error);
    }
  };

  const sendDrawingHandler = async (imageDataUrl: string, isOver: boolean) => {
    const filename = `drawing-${Date.now()}.png`;
    const fileData = await fetch(imageDataUrl);
    const blob = await fileData.blob();

    const file = new File([blob], filename, { type: 'image/png' });

    const { error: uploadError } = await supabase.storage
      .from('multimode-images')
      .upload(`${game?.id}/${filename}`, file);

    if (uploadError) {
      console.error(uploadError);
      return;
    }

    const { data: publicData } = supabase.storage
      .from('multimode-images')
      .getPublicUrl(`${game?.id}/${filename}`);

    const publicUrl = publicData.publicUrl;

    if (!game || !user) return;
    const { data: updateData, error: updateError } = await supabase
      .from('turns')
      .update({
        content: publicUrl,
      })
      .eq('game_id', game.id)
      .eq('turn_number', turn)
      .eq('sender_id', user.id)
      .select();

    if (updateData) {
      if (!isOver) {
        const { data: dataGame, error: errorGame } = await supabase
          .from('games')
          .update({
            complete_players: game.complete_players + 1,
          })
          .eq('id', game.id)
          .select();

        if (dataGame) {
          setIsComplete(true);
        }
        if (errorGame) {
          console.log('complete players 업데이트 실패');
          console.error(errorGame);
        }
      }
    }
    if (updateError) {
      console.log('publicUrl 업데이트 실패');
      console.error(updateError);
    }
  };

  const moveToNextTurn = async () => {
    if (!game) return;

    if (!isComplete) {
      setTrigger(true);
    }

    if (turn >= game.current_players) {
      navigate('/game/result');
      return;
    }

    const { data: dataGame, error: errorGame } = await supabase
      .from('games')
      .update({
        complete_players: 0,
        timeout_players: 0,
      })
      .eq('id', game?.id)
      .select();

    if (dataGame) {
      useGameRoomStore.getState().updateGame({
        complete_players: dataGame[0].complete_players,
        timeout_players: dataGame[0].timeout_players,
      });
    }
    if (errorGame) {
      console.log('complete players, timeout_players 초기화 실패');
      console.error(errorGame);
    }

    useGameRoomStore.getState().changeTurn(turn + 1);

    if (step === 'DRAWING') {
      navigate('/game/multi/words');
      return;
    } else if (step === 'WORDS') {
      navigate('/game/multi/drawing');
      return;
    }
  };

  useEffect(() => {
    useGameRoomStore.getState().loadGameFromSession();
    useGameRoomStore.getState().loadPlayerFromSession();
    useGameRoomStore.getState().loadTurnFromSession();

    if (!game) return;
    const channel = supabase
      .channel(`room-complete-${game?.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'games',
          filter: `id=eq.${game?.id}`,
        },
        (payload) => {
          const newStatus = payload.new;

          useGameRoomStore.getState().updateGame({
            complete_players: newStatus.complete_players,
            timeout_players: newStatus.timeout_players,
          });

          if (newStatus.complete_players === newStatus.current_players) {
            moveToNextTurn();
            return;
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [game?.id]);

  useEffect(() => {
    if (step === 'DRAWING') {
      getWords();
      setTime(90);
    } else if (step === 'WORDS') {
      getDrawings();
      setTime(60);
    }

    const timer = setInterval(() => {
      decrease();
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      reset();
    }
  }, [timeLeft]);

  useEffect(() => {
    if (!game || !user) return;
    let pollingInterval: NodeJS.Timeout;
    let pollingCount = 0;
    let pollingCountWords = 0;

    const poll = async () => {
      const { data, error } = await supabase
        .from('turns')
        .select('content')
        .eq('game_id', game.id)
        .eq('turn_number', turn - 1)
        .eq('receiver_id', user.id);

      if (step === 'DRAWING') {
        pollingCount += 1;

        if (data && data[0]?.content) {
          setWords(data[0].content);
        }

        if (pollingCount >= 7) {
          clearInterval(pollingInterval);
        }
      }

      if (step === 'WORDS') {
        pollingCountWords += 1;

        if (data && data[0]?.content) {
          setDrawingUrl(data[0].content);
        }

        if (pollingCountWords >= 7) {
          clearInterval(pollingInterval);
        }
      }

      if (error) {
        console.error('polling 실패:', error);
      }
    };

    if (step === 'DRAWING' || step === 'WORDS') {
      pollingInterval = setInterval(poll, 2000);
    }

    return () => {
      clearInterval(pollingInterval);
    };
  }, [game?.id, turn, step, user?.id]);

  return (
    <div className="w-full min-h-screen flex flex-col items-center px-20 pt-[14px] relative">
      <NavWithExit title={game?.room_name} />
      <div className="flex gap-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col gap-5 items-end">
          <div className="mr-3">
            <div className="w-[595px] h-[62px] relative flex justify-center items-center text-[18px] font-semibold bg-[var(--white)] rounded-[6px] border-2 border-[var(--black)]">
              <div>{step === 'DRAWING' ? words : '그림을 맞혀보세요!'}</div>
              <div className="absolute top-2 right-4 font-semibold text-[16px] p-2">
                {game?.complete_players} / {game?.current_players}
              </div>
            </div>
          </div>
          {step === 'DRAWING' ? (
            <DrawingCanvasMulti
              step={step}
              isComplete={isComplete}
              timeLeft={timeLeft}
              trigger={trigger}
              onSubmitDrawing={sendDrawingHandler}
              moveToNextTurn={moveToNextTurn}
            />
          ) : (
            <DrawingCanvasMulti
              step={step}
              isComplete={isComplete}
              timeLeft={timeLeft}
              trigger={trigger}
              drawingUrl={drawingUrl}
              onSubmitWords={sendWordsHandler}
              moveToNextTurn={moveToNextTurn}
            />
          )}
        </div>
        <div className="flex items-center mt-3">
          {step === 'DRAWING' ? (
            <GameMultiTimer totalTime={90} />
          ) : (
            <GameMultiTimer totalTime={60} />
          )}
        </div>
        <Chat size="small" />
      </div>
    </div>
  );
}
