import { create } from "zustand";

type GameTimerState = {
  timeLeft: number;
  isRunning: boolean;
  setTime: (seconds: number) => void;
  decrease: () => void;
  reset: () => void;
  startTimer: () => void;
};

export const useGameTimerStore = create<GameTimerState>((set, get) => {
  let interval: NodeJS.Timeout | null = null;

  return {
    timeLeft: 0,
    isRunning: false,
    setTime: (seconds) => set({ timeLeft: seconds }),
    decrease: () => {
      const current = get().timeLeft;
      if (current > 0) {
        set({ timeLeft: current - 1 });
      } else {
        if (interval) {
          clearInterval(interval);
          interval = null;
          set({ isRunning: false });
        }
      }
    },
    reset: () => {
      if (interval) clearInterval(interval);
      interval = null;
      set({ timeLeft: 0, isRunning: false });
    },
    startTimer: () => {
      if (get().isRunning) return;
      interval = setInterval(() => {
        get().decrease();
      }, 1000);
      set({ isRunning: true });
    },
  };
});
