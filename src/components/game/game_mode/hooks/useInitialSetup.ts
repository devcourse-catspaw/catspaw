import { useEffect } from "react";
import toast from "react-hot-toast";
import { useGameTimerStore } from "../../../../stores/gameTimerStore";

export const useInitialSetup = () => {
  const reset = useGameTimerStore((state) => state.reset);

  useEffect(() => {
    toast("좌측 하단의 버튼을 통해 BGM을 켜보세요!");
    reset();
  }, [reset]);
};