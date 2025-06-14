import { create } from "zustand";

interface GameTimerState {
  timeLeft: number;
  setTime: (seconds: number) => void;
  decrease: () => void;
  reset: () => void;
}

export const useGameTimerStore = create<GameTimerState>((set, get) => ({
  timeLeft: 1,
  setTime: (seconds) => set({ timeLeft: seconds }),
  decrease: () => {
    const current = get().timeLeft;
    if (current > 0) set({ timeLeft: current - 1 });
  },
  reset: () => set({ timeLeft: 0 }),
}));
