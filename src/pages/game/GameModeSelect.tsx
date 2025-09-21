import NavWithExit from "../../components/common/NavWithExit";
import BackgroundDecorations from "../../components/game/game_mode/BackgroundDecorations";
import GameModeContent from "../../components/game/game_mode/GameModeContent";
import { useCountdownTimer } from "../../components/game/game_mode/hooks/useCountdownTimer";
import { useGameCleanup } from "../../components/game/game_mode/hooks/useGameCleanup";
import { useInitialSetup } from "../../components/game/game_mode/hooks/useInitialSetup";
import { useAuthStore } from "../../stores/authStore";

export default function GameModeSelect() {
  const user = useAuthStore((state) => state.user);
  
  const { count, startCountdown } = useCountdownTimer("/game/single");
  
  useGameCleanup(user?.id);
  useInitialSetup();

  const handleSingleModeSelect = () => {
    startCountdown(3);
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center px-20 pt-[14px] relative">
      <NavWithExit />
      <div className="flex flex-col justify-center items-center gap-10 absolute inset-0">
        <GameModeContent
          count={count} 
          onSingleModeSelect={handleSingleModeSelect} 
        />
      </div>
      <BackgroundDecorations />
    </div>
  );
}