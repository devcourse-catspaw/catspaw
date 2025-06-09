import manyKisu from "../../../assets/images/kisu_many.svg";
import justKisu from "../../../assets/images/kisu_.svg";

type GameModeSelectCardProp = {
  mode: string;
};
export default function GameModeSelectCard({ mode }: GameModeSelectCardProp) {
  return (
    <div className="group w-[298px] h-[392px] [perspective:1000px]">
      <div className="relative w-full h-full transition-transform duration-600 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
        <div className="absolute inset-0 flex flex-col px-16 py-[62px] gap-[30px] border-[3px] rounded-[10px] shadow-[0px_6.59px_0px_#000000] bg-white [backface-visibility:hidden]">
          <img
            src={mode === "single" ? justKisu : manyKisu}
            alt="싱글모드 아이콘"
          />
          <h1 className="text-lg font-extrabold text-center">
            {mode === "single" ? "싱글모드" : "멀티모드"}
          </h1>
          <p className="text-sm font-medium text-center">
            {mode === "single"
              ? "내 그림, AI가 맞출까?"
              : "누가 더 잘 그릴까? 대결 시작!"}
          </p>
        </div>
        <div className="absolute inset-0 flex flex-col px-16 py-[62px] gap-[30px] border-[3px] rounded-[10px] shadow-[0px_6.59px_0px_#000000] bg-[color:var(--red)] [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <div className="flex">
            <img
              src={mode === "single" ? justKisu : manyKisu}
              alt="기수 아이콘"
              className="invert w-[45px]"
            />
            <div>
              <h1 className="font-extrabold text-lg text-[color:var(--white)]">
                {mode === "single" ? "싱글 모드" : "멀티 모드"}
              </h1>
              <p className="font-extrabold text-xs text-[#ffbbbb]">
                {mode === "single"
                  ? "내 그림, AI가 맞출까?"
                  : "누가 더 잘 그릴까? 대결 시작!"}
              </p>
            </div>
          </div>

          <div className="text-[color:var(--white)] font-medium text-xs text-start">
            {mode === "single" ? (
              <div>
                <p>1. 제시어 랜점 제공</p>
                <p>2. 그림을 그림</p>
                <p>3. AI가 정답을 맞춤</p>
              </div>
            ) : (
              <div>
                <p>1. 다른 플레이어가 그릴 제시어 설정</p>
                <p>2. 랜덤으로 제시어 받아 그림 그리기</p>
                <p>3. 각자 그린 그림 다른 플레이어에게 전달</p>
                <p>4. 해당 그림 맞추기</p>
                <p>5. 4번 맞춘 내용으로 다시 랜덤 제시어 돌리기</p>
                <p>6. 받은 제시어 그림 그리기</p>
                <p>7. 결과 확인하기! (이 부분이 꿀잼)</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
