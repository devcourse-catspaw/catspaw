import DrawingCanvas from "./DrawingCanvas";
import DrawingPropmt from "./DrawingPropmt";
import GameTimer from "./GameTimer";

interface DrawingGameLayoutProps {
  currentTopic: string | null;
  onSubmit: (imageDataUrl: string) => Promise<void>;
}

export default function DrawingGameLayout({
  currentTopic,
  onSubmit,
}: DrawingGameLayoutProps) {
  if (!currentTopic) {
    return (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center items-center">
        <div className="text-lg">토픽을 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center items-center">
      <div className="translate-x-7 -translate-y-2">
        <DrawingPropmt topic={currentTopic} />
      </div>
      <div className="flex">
        <DrawingCanvas onSubmit={onSubmit} />
        <div className="translate-x-5 translate-y-4">
          <GameTimer totalTime={180} />
        </div>
      </div>
    </div>
  );
}