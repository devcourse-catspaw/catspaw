import SingleModeHeader from "../../components/game/SingleModeHeader";
import DrawingPropmt from "../../components/game/DrawingPropmt";
import { useDrawingStore } from "../../stores/drawingStore";
import { useUserData } from "../../components/game/singlemode/hooks/useUserData";
import { useImageList } from "../../components/game/singlemode/hooks/useImageList";
import { useScoreCalculation } from "../../components/game/singlemode/hooks/useScoreCalculation";
import { useGameExit } from "../../components/game/singlemode/hooks/useGameExit";
import { useSwiperControls } from "../../components/game/singlemode/hooks/useSwiperControls";
import { usePageProtection } from "../../components/game/singlemode/hooks/usePageProtection";
import pawsMouse from "../../assets/images/paw_mouse_big.svg";
import ResultCarousel from "../../components/game/singlemode/ResultCarousel";
import ScoreDisplay from "../../components/game/singlemode/ScoreDisplay";

export default function SingleModeResultPage() {
  const { usedTopic, aiAnswerList } = useDrawingStore();

  const { nickName, user } = useUserData();
  const { answerList } = useImageList(user?.id);
  const { correctCount } = useScoreCalculation(usedTopic, aiAnswerList);
  const { handleExitRoom } = useGameExit(user?.id, correctCount);
  const { handlePrev, handleNext, onSwiper } = useSwiperControls();

  usePageProtection();

  return (
    <div className="w-full min-h-screen flex flex-col items-center px-20 pt-[14px] relative">
      <SingleModeHeader disable={true} />
      <div className="flex absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 gap-[62px] w-[1008px]">
        <div className="flex flex-col gap-7 items-center justify-center">
          <DrawingPropmt topic="결과 발표" className="w-[700px] h-[62px]" />
          <ResultCarousel
            usedTopic={usedTopic}
            answerList={answerList}
            aiAnswerList={aiAnswerList}
            onPrev={handlePrev}
            onNext={handleNext}
            onSwiper={onSwiper}
          />
        </div>
        <ScoreDisplay
          nickName={nickName}
          usedTopicLength={usedTopic.length}
          correctCount={correctCount}
          onExitRoom={handleExitRoom}
        />
      </div>
      <img
        src={pawsMouse}
        alt="마우스 잡은 고양이 손 그림"
        className="absolute bottom-0 -z-50 right-[36px]"
      />
    </div>
  );
}
