import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

export const useCountdownTimer = (targetRoute: string) => {
  const navigate = useNavigate();
  const [count, setCount] = useState<number | null>(null);

  const startCountdown = (initialCount: number) => {
    setCount(initialCount);
  };

  useEffect(() => {
    if (count === null) return;
    
    if (count === 0) {
      navigate(targetRoute);
      return;
    }
    
    const timer = setTimeout(() => {
      setCount((prev) => (prev ?? 0) - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [count, navigate, targetRoute]);

  return { count, startCountdown };
};