import aiThinking from "../../../assets/images/ai_answering.gif";
import { useAILoadingMessage } from "./hooks/useAILoadingMessage";

interface AiLoadingDisplayProps {
  imageUrl: string | null;
  imgRef: React.RefObject<HTMLImageElement | null>;
  setImageReady: (ready: boolean) => void;
}

export default function AiLoadingDisplay({
  imageUrl,
  imgRef,
  setImageReady,
}: AiLoadingDisplayProps) {
  const { currentMessage } = useAILoadingMessage();

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-6">
      <img src={aiThinking} alt="생각하는 AI 그림" />
      
      <p className="text-lg font-medium text-gray-700">
        {currentMessage}
      </p>
      
      {imageUrl && (
        <img
          src={imageUrl}
          alt=""
          className="hidden"
          ref={imgRef}
          crossOrigin="anonymous"
          onLoad={() => {
            setImageReady(true);
          }}
        />
      )}
    </div>
  );
}