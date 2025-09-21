import { useNavigate } from "react-router";
import GameModeSelectCard from "./GameModeSelectCard";

interface GameModeContentProps {
  count: number | null;
  onSingleModeSelect: () => void;
}

export default function GameModeContent({
  count,
  onSingleModeSelect,
}: GameModeContentProps) {
  const navigate = useNavigate();

  if (count !== null) {
    return (
      <div className="text-[134px] font-gloria font-extrabold text-[color:var(--black)] animate-pulse z-50">
        {count}
      </div>
    );
  }

  return (
    <>
      <p className="font-extrabold text-[39px]">게임 모드를 골라보세요!</p>
      <div className="flex gap-[81px]">
        <div onClick={onSingleModeSelect} className="z-50 cursor-pointer">
          <GameModeSelectCard mode="single" />
        </div>
        <div onClick={() => navigate("/game/list")} className="z-50">
          <GameModeSelectCard mode="multi" />
        </div>
      </div>
    </>
  );
}
