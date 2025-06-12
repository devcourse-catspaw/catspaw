import DrawingPropmt from "./DrawingPropmt";
import sketchBook from "../../assets/images/sketchbook.svg";
import correctAnswer from "../../assets/images/answer_correct_blue.svg";
import wrongAnswer from "../../assets/images/answer_wrong_red.svg";

export default function SingleModeResultCard({
  topic,
  draw,
  aiAnswer,
}: {
  topic: string;
  draw: string;
  aiAnswer: string;
}) {
  return (
    <div className="relative flex flex-col gap-2 w-[212px] h-[195px]">
      <DrawingPropmt topic={aiAnswer} className="w-[206px] h-[47px]" />
      <div className="relative">
        <img
          src={sketchBook}
          alt="스케치북"
          className="w-[206px] absolute inset-0"
        />
        {draw ? (
          <img
            src={draw}
            alt="유저 그림"
            className="w-[180px] h-[120px] absolute inset-0 "
          />
        ) : (
          ""
        )}
        {aiAnswer === topic ? (
          <img
            src={correctAnswer}
            className="w-[62px] h-[69px] absolute top-[-36px] right-[-10px]"
          />
        ) : (
          <img
            src={wrongAnswer}
            className="w-[59px] absolute top-[-32px] right-[-10px]"
          />
        )}
      </div>
    </div>
  );
}
