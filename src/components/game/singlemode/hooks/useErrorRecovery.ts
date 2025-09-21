import { useEffect } from "react";
import { useNavigate } from "react-router";

export const useErrorRecovery = (
  setIsError: React.Dispatch<React.SetStateAction<boolean>>,
  delay: number = 5000,
  redirectPath: string = "/game"
) => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsError(false);
      navigate(redirectPath);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [navigate, setIsError, delay, redirectPath]);
};