import NavWithExit from "../../components/common/NavWithExit";
import GameModeSelectCard from "../../components/game/game_mode/GameModeSelectCard";
import pawPencil from "../../assets/images/paw_pencil_big.svg";
import doodle from "../../assets/images/doodle_loading.svg";

export default function GameModeSelect() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center px-20 pt-[14px]">
      <NavWithExit />
      <div className="flex flex-col justify-center items-center mt-[180px] gap-10">
        <p className="font-extrabold text-[39px]">게임 모드를 골라보세요!</p>
        <div className="flex gap-[81px]">
          <GameModeSelectCard mode="single" />
          <GameModeSelectCard mode="multi" />
        </div>
      </div>
      <img
        src={pawPencil}
        alt="paw pencil 이미지"
        className="fixed bottom-25 right-0"
      />
      <img src={doodle} alt="그림 이미지" className="fixed bottom-[-60px] right-[26px] rotate-150" />
    </div>
  );
}
