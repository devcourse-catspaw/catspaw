import sketchBook from "../../../assets/images/sketchbook.svg";
import aiAnswering from "../../../assets/images/ai_answering3.svg";
import correctAnswer from "../../../assets/images/answer_correct_blue.svg";
import wrongAnswer from "../../../assets/images/answer_wrong_red.svg";
import DrawingPropmt from "../DrawingPropmt";

interface AiResultDisplayProps {
  currentTopic: string | null;
  imageUrl: string | null;
  imgRef: React.RefObject<HTMLImageElement | null>;
  setImageReady: (ready: boolean) => void;
  prediction: string;
}

export default function AiResultDisplay({
  currentTopic,
  imageUrl,
  imgRef,
  setImageReady,
  prediction,
}: AiResultDisplayProps) {
  if (!currentTopic) {
    return null;
  }

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <DrawingPropmt topic={currentTopic} className="w-107" />
      <div className="relative">
        <img src={sketchBook} alt="스케치북" className="w-[438px] h-[294px]" />
        {imageUrl && (
          <img
            ref={imgRef}
            src={imageUrl}
            alt="사용자 그림"
            crossOrigin="anonymous"
            onLoad={() => {
              setImageReady(true);
            }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[420px]"
          />
        )}
        <div className="absolute top-[-70px] right-[-140px]">
          {prediction === currentTopic ? (
            <img src={correctAnswer} alt="정답 아이콘" />
          ) : (
            <img
              src={wrongAnswer}
              alt="오답 아이콘"
              className="text-[color:var(--red)]"
            />
          )}
        </div>
        <div className="w-[266px] h-[133px] absolute left-[-280px] bottom-[150px] border-[2px] border-[color:var(--black)] flex justify-center items-center text-[28px] font-extrabold rounded-[6px]">
          "{prediction}"
        </div>

        <img
          src={aiAnswering}
          alt="생각하는 AI"
          className="absolute left-[-280px] bottom-[-100px]"
        />
      </div>
    </div>
  );
}
