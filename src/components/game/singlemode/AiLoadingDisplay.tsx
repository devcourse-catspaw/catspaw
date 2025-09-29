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
  const { currentMessage, isTransitioning } = useAILoadingMessage();

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-6">
      <img src={aiThinking} alt="생각하는 AI 그림" />
      
      <div className="relative h-8 flex items-center">
        <p 
          className={`text-lg font-medium text-gray-700 transition-opacity duration-300 ${
            isTransitioning ? 'opacity-0' : 'opacity-100'
          }`}
        >
          {currentMessage}
          <span className="inline-flex ml-1">
            <span className="animate-bounce">.</span>
            <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
            <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>.</span>
          </span>
        </p>
      </div>
      
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