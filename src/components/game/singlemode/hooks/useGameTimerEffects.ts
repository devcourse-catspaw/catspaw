import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useGameTimerStore } from "../../../../stores/gameTimerStore";

export const useGameTimerEffects = () => {
  const navigate = useNavigate();
  const { timeLeft, setTime, startTimer, isRunning } = useGameTimerStore();
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    if (timeLeft === 0 && !isRunning && !hasInitialized) {
      setTime(180);
      startTimer();
      setHasInitialized(true);
    } else if (timeLeft > 0 && !isRunning) {
      startTimer();
      setHasInitialized(true);
    } else if (timeLeft > 0 && isRunning) {
      setHasInitialized(true);
    }
  }, [timeLeft, setTime, startTimer, isRunning, hasInitialized]);

  useEffect(() => {
    if (hasInitialized && timeLeft <= 0 && !isRunning) {
      navigate("/game/score-result");
    }
  }, [timeLeft, isRunning, navigate, hasInitialized]);
};
