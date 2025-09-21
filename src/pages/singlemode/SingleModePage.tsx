import SingleModeHeader from "../../components/game/SingleModeHeader";
import DrawingGameLayout from "../../components/game/DrawingGameLayout";
import { useDrawingStore } from "../../stores/drawingStore";
import { useDrawingSubmit } from "../../components/game/singlemode/hooks/useDrawingSubmit";
import { useGameTimerEffects } from "../../components/game/singlemode/hooks/useGameTimerEffects";
import { usePageProtection } from "../../components/game/singlemode/hooks/usePageProtection";
import { useTopicInitialization } from "../../components/game/singlemode/hooks/useTopicInitialization";

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
