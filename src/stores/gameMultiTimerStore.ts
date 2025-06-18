import { create } from "zustand";

interface GameMultiTimerState {
  timeLeft: number;
  setTime: (seconds: number) => void;
  decrease: () => void;
  reset: () => void;
}

export const useGameMultiTimerStore = create<GameMultiTimerState>((set, get) => ({
  timeLeft: 1,
  setTime: (seconds) => set({ timeLeft: seconds }),
  decrease: () => {
    const current = get().timeLeft;
    if (current > 0) set({ timeLeft: current - 1 });
  },
  reset: () => set({ timeLeft: 1 }),
}));
