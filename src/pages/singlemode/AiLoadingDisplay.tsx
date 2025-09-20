import aiThinking from "../../assets/images/ai_answering.gif";

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
  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <img src={aiThinking} alt="생각하는 AI 그림" />
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