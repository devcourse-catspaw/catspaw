import { useEffect } from "react";
import DrawingCanvas from "../components/game/DrawingCanvas";
import DrawingPropmt from "../components/game/DrawingPropmt";
import GameTimer from "../components/game/GameTimer";
import SingleModeHeader from "../components/game/SingleModeHeader";
import { useDrawingStore } from "../stores/drawingStore";

export default function SingleModePage() {
  const { currentTopic, getRandomTopic } = useDrawingStore();

  useEffect(() => {
    getRandomTopic();
  }, []);

  return (
    <>
      <div className="w-full min-h-screen flex flex-col items-center px-20 pt-[14px] relative">
        <SingleModeHeader />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center items-center">
          <div className="translate-x-7 -translate-y-2">
            <DrawingPropmt topic={currentTopic} />
          </div>
          <div className="flex">
            <DrawingCanvas />
            <div className="translate-x-5 translate-y-4">
              <GameTimer />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
