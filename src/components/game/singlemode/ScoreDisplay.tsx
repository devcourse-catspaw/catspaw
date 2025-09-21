import Button from "../../common/Button";

interface ScoreDisplayProps {
  nickName: string;
  usedTopicLength: number;
  correctCount: number;
  onExitRoom: () => void;
}

export default function ScoreDisplay({
  nickName,
  usedTopicLength,
  correctCount,
  onExitRoom,
}: ScoreDisplayProps) {
  return (
    <div className="flex flex-col gap-5 items-center">
      <div className="px-[32px] py-[25px] flex flex-col justify-center items-center border-[2px] border-[color:var(--black)] rounded-[6px] bg-[color:var(--white)]">
        <div className="border-b border-[color:var(--black)] w-[147px] pb-6 mb-6 ">
          <div className="flex flex-col gap-[6px] items-center justify-center">
            <h1 className="text-center text-lg font-extrabold flex gap-2">
              <span>"</span>
              {nickName}
              <span>"</span>
            </h1>
            <h2 className="text-center text-sm font-extrabold">님의 점수</h2>
          </div>
          <div className="flex flex-col gap-3 mt-[24px]">
            <p className="text-start font-semibold text-sm">
              {usedTopicLength}개 그림
            </p>
            <p className="text-start font-semibold text-sm">
              {correctCount}개 그림
            </p>
          </div>
        </div>
        <div className="w-[147px] flex flex-col gap-[24px]">
          <p className="text-start font-semibold text-sm">
            {correctCount}개 x 1점 = {correctCount}점
          </p>
          <h1 className="text-center font-extrabold text-lg">
            점수 : {correctCount}점
          </h1>
        </div>
      </div>
      <Button
        onClick={onExitRoom}
        className="w-[134px] h-[44px] font-semibold text-[18px] p-0 bg-[color:var(--white)]"
      >
        방 나가기
      </Button>
    </div>
  );
}
