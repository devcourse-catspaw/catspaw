import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useGameTimerStore } from "../../../stores/gameTimerStore";

export const useGameTimerEffects = () => {
  const navigate = useNavigate();
  const { timeLeft, setTime, startTimer } = useGameTimerStore();

  useEffect(() => {
    if (timeLeft === 0) {
      setTime(180);
    }

    startTimer();
  }, [timeLeft, setTime, startTimer]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (timeLeft <= 0) {
        navigate("/game/score-result");
      }
    }, 100);

    return () => clearTimeout(timeout);
  }, [timeLeft, navigate]);
};