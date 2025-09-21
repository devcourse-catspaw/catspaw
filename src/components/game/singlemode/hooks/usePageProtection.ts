import { useEffect } from "react";

export const usePageProtection = () => {
  const preventClose = (e: BeforeUnloadEvent) => {
    e.preventDefault();
  };

  useEffect(() => {
    window.addEventListener("beforeunload", preventClose);
    
    return () => {
      window.removeEventListener("beforeunload", preventClose);
    };
  }, []);
};