import { useEffect } from "react";
import DrawingCanvas from "../components/game/DrawingCanvas";
import DrawingPropmt from "../components/game/DrawingPropmt";
import GameTimer from "../components/game/GameTimer";
import SingleModeHeader from "../components/game/SingleModeHeader";
import { useDrawingStore } from "../stores/drawingStore";
import { useNavigate } from "react-router";
import supabase from "../utils/supabase";
import { useGameTimerStore } from "../stores/gameTimerStore";
import { useAuthStore } from "../stores/authStore.ts";

export default function SingleModePage() {
  const { currentTopic, getRandomTopic, setFilename } = useDrawingStore();
  const navigate = useNavigate();
  const { timeLeft, setTime, startTimer } = useGameTimerStore();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    getRandomTopic();
  }, []);

  const handleSubmit = async (imageDataUrl: string) => {
    const filename = `drawing_${Date.now()}.jpg`;
    const data = await fetch(imageDataUrl);
    const blob = await data.blob();

    const file = new File([blob], filename, { type: 'image/jpeg' });
    setFilename(filename);

    const { error } = await supabase.storage
      .from('singlemode-images')
      .upload(`private/${user?.id}/${filename}`, file);

    if (error) {
      console.error(error);
      return;
    }

    navigate('/game/ai-answering');
  };

  useEffect(() => {
    if (timeLeft === 0) {
      setTime(180);
    }

    startTimer();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (timeLeft <= 0) {
        navigate("/game/score-result");
      }
    }, 100);

    return () => clearTimeout(timeout);
  }, [timeLeft]);

  const preventClose = (e: BeforeUnloadEvent) => {
    e.preventDefault();
  };
  useEffect(() => {
    (() => {
      window.addEventListener('beforeunload', preventClose);
    })();
    return () => {
      window.removeEventListener('beforeunload', preventClose);
    };
  }, []);

  return (
    <>
      <div className="w-full min-h-screen flex flex-col items-center px-20 pt-[14px] relative">
        <SingleModeHeader disable={true} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center items-center">
          <div className="translate-x-7 -translate-y-2">
            <DrawingPropmt topic={currentTopic} />
          </div>
          <div className="flex">
            <DrawingCanvas onSubmit={handleSubmit} />
            <div className="translate-x-5 translate-y-4">
              <GameTimer totalTime={180} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
