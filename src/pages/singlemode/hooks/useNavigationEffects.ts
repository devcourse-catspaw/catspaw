import { useEffect } from "react";
import { useNavigate } from "react-router";

export const useNavigationEffects = (
  prediction: string | null,
  timeLeft: number,
  setIsError: (isError: boolean) => void
) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (prediction) {
      const timer = setTimeout(() => {
        navigate("/game/single");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [prediction, navigate]);

  useEffect(() => {
    if (timeLeft <= 0) {
      navigate("/game/score-result");
    }
  }, [timeLeft, navigate]);

  useEffect(() => {
    const errorHadleTimer = setTimeout(() => {
      setIsError(true);
    }, 20000);
    return () => clearTimeout(errorHadleTimer);
  }, [setIsError]);
};