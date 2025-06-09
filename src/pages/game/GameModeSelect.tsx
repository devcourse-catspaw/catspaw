import NavWithExit from "../../components/common/NavWithExit";
import GameModeSelectCard from "../../components/game/GameModeSelectCard";

export default function GameModeSelect() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center px-20 pt-[14px]">
      <NavWithExit />
      <GameModeSelectCard />
    </div>
  );
}
