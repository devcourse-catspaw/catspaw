import { useState } from "react";
import { useDrawingStore } from "../../stores/drawingStore";
import { useGameTimerStore } from "../../stores/gameTimerStore";
import { useAuthStore } from "../../stores/authStore";
import { useImageFetch } from "../../components/game/singlemode/hooks/useImageFetch";
import { useAIPrediction } from "../../components/game/singlemode/hooks/useAIPrediction";
import { useNavigationEffects } from "../../components/game/singlemode/hooks/useNavigationEffects";
import SingleModeHeader from "../../components/game/SingleModeHeader";
import SneakyCat from "../../components/game/SneakyCat";
import AiResultDisplay from "../../components/game/singlemode/AiResultDisplay";
import AiLoadingDisplay from "../../components/game/singlemode/AiLoadingDisplay";

export default function AiAnswering() {
  const { currentTopic, setAiAnswer, filename } = useDrawingStore();
  const { timeLeft } = useGameTimerStore();
  const user = useAuthStore((state) => state.user);

  const [isError, setIsError] = useState(false);
  const [imageReady, setImageReady] = useState(false);

  const { imageUrl } = useImageFetch(filename, user?.id, setIsError);

  const { prediction, imgRef } = useAIPrediction(
    imageUrl,
    currentTopic,
    setAiAnswer,
    setIsError,
    imageReady
  );

  useNavigationEffects(prediction, timeLeft, setIsError);

  return (
    <div className="w-full min-h-screen flex flex-col items-center px-20 pt-[14px] relative">
      <SingleModeHeader disable={true} />

      {isError && (
        <div className="w-[700px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <SneakyCat setIsError={setIsError} />
        </div>
      )}

      {!isError && prediction && currentTopic && (
        <AiResultDisplay
          currentTopic={currentTopic}
          imageUrl={imageUrl}
          imgRef={imgRef}
          setImageReady={setImageReady}
          prediction={prediction}
        />
      )}

      {!isError && !prediction && (
        <AiLoadingDisplay
          imageUrl={imageUrl}
          imgRef={imgRef}
          setImageReady={setImageReady}
        />
      )}
    </div>
  );
}
