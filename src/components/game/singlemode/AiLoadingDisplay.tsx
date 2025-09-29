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
  const { currentMessage, isTransitioning, progress } = useAILoadingMessage();

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-6">
      <img src={aiThinking} alt="생각하는 AI 그림" />
      
      <div className="flex flex-col items-center gap-4 w-96">
        <div className="relative h-8 flex items-center w-full justify-center">
          <p 
            className={`text-lg font-semibold text-[#1D1D1F] transition-opacity duration-300 ${
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
        
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
          <div 
            className="h-full bg-gradient-to-r from-gray-700 to-[#1D1D1F] transition-all duration-500 ease-out rounded-full shadow-sm"
            style={{ width: `${progress}%` }}
          />
        </div>
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