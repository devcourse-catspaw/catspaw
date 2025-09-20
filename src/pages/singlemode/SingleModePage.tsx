import SingleModeHeader from "../../components/game/SingleModeHeader";
import DrawingGameLayout from "../../components/game/DrawingGameLayout";
import { useDrawingStore } from "../../stores/drawingStore";
import { useDrawingSubmit } from "./hooks/useDrawingSubmit";
import { useGameTimerEffects } from "./hooks/useGameTimerEffects";
import { usePageProtection } from "./hooks/usePageProtection";
import { useTopicInitialization } from "./hooks/useTopicInitialization";

export default function SingleModePage() {
  const { currentTopic } = useDrawingStore();

  const { handleSubmit } = useDrawingSubmit();

  useTopicInitialization();
  useGameTimerEffects();
  usePageProtection();

  return (
    <div className="w-full min-h-screen flex flex-col items-center px-20 pt-[14px] relative">
      <SingleModeHeader disable={true} />
      <DrawingGameLayout currentTopic={currentTopic} onSubmit={handleSubmit} />
    </div>
  );
}
