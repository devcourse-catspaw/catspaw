import manyKisu from "../../../assets/images/kisu_many.svg";
import justKisu from "../../../assets/images/kisu_.svg";

type GameModeSelectCardProp = {
  mode: string;
};
export default function GameModeSelectCard({ mode }: GameModeSelectCardProp) {
  return (
    <div
      className="flex flex-col w-[298px] h-[392px] px-16 py-[62px] gap-[30px] border-[3px] rounded-[10px] shadow-[0px_6.59px0px
#000000]"
    >
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
  );
}
