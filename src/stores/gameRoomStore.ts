import { create } from "zustand";
import type { GameRoomProps } from "../components/common/GameRoom";
import type { PlayerUserProps } from "../components/common/WaitingRoom";

interface GameRoomState {
  game: GameRoomProps | null;
  setGame: (game: GameRoomProps) => void;
  updateGame: (game: Partial<GameRoomProps>) => void;
  resetGame: () => void;
  loadGameFromSession: () => void;

  player: PlayerUserProps | null;
  setPlayer: (player: PlayerUserProps) => void;
  updatePlayer: (player: Partial<PlayerUserProps>) => void;
  resetPlayer: () => void;
  loadPlayerFromSession: () => void;

  turn: number;
  changeTurn: (turn: number) => void;
  resetTurn: () => void;
  loadTurnFromSession: () => void;

  complete: number;
  changeComplete: (complete: number) => void;
  resetComplete: () => void;
  loadCompleteFromSession: () => void;
}

export const useGameRoomStore = create<GameRoomState>((set, get) => ({
  game: null,

  setGame: (game) => {
    set({ game });
    sessionStorage.setItem("game", JSON.stringify(game));
  },

  updateGame: (game) => {
    const currentGame = get().game;
    if (currentGame) {
      const newGame = { ...currentGame, ...game };
      set({ game: newGame });
      sessionStorage.setItem("game", JSON.stringify(newGame));
    }
  },

  resetGame: () => {
    set({ game: null });
    sessionStorage.removeItem("game");
  },

  loadGameFromSession: () => {
    const gameStr = sessionStorage.getItem("game");
    if (gameStr) {
      try {
        const game: GameRoomProps = JSON.parse(gameStr);
        set({ game });
        console.log('세션스토리지로부터 게임 데이터 불러오기 성공:', game)
      } catch (e) {
        console.error("세션스토리지로부터 게임 데이터 불러오기 실패:", e);
      }
    }
  },

  player: null,

  setPlayer: (player) => {
    set({ player });
    sessionStorage.setItem("player", JSON.stringify(player));
  },

  updatePlayer: (player) => {
    const currentPlayer = get().player;
    if (currentPlayer) {
      const newPlayer = { ...currentPlayer, ...player };
      set({ player: newPlayer });
      sessionStorage.setItem("player", JSON.stringify(newPlayer));
    }
  },

  resetPlayer: () => {
    set({ player: null });
    sessionStorage.removeItem("player");
  },

  loadPlayerFromSession: () => {
    const playerStr = sessionStorage.getItem("player");
    if (playerStr) {
      try {
        const player: PlayerUserProps = JSON.parse(playerStr);
        set({ player });
        console.log('세션스토리지로부터 플레이어 데이터 불러오기 성공:', player)
      } catch (e) {
        console.error("세션스토리지로부터 플레이어 데이터 불러오기 실패:", e);
      }
    }
  },

  turn: 0,

  changeTurn: (turn) => {
    set({ turn })
    sessionStorage.setItem("turn", JSON.stringify(turn));
  },

  resetTurn: () => {
    set({ turn: 0 });
    sessionStorage.removeItem("turn");
  },

  loadTurnFromSession: () => {
    const turnStr = sessionStorage.getItem("turn");
    if (turnStr) {
      try {
        const turn: number = JSON.parse(turnStr);
        set({ turn });
        console.log('세션스토리지로부터 turn 데이터 불러오기 성공:', turn)
      } catch (e) {
        console.error("세션스토리지로부터 turn 데이터 불러오기 실패:", e);
      }
    }
  },

  complete: 0,

  changeComplete: (complete) => {
    set({ complete })
    sessionStorage.setItem("complete", JSON.stringify(complete));
  },

  resetComplete: () => {
    set({ complete: 0 });
    sessionStorage.removeItem("complete");
  },

  loadCompleteFromSession: () => {
    const completeStr = sessionStorage.getItem("complete");
    if (completeStr) {
      try {
        const complete: number = JSON.parse(completeStr);
        set({ complete });
        console.log('세션스토리지로부터 complete 데이터 불러오기 성공:', complete)
      } catch (e) {
        console.error("세션스토리지로부터 complete 데이터 불러오기 실패:", e);
      }
    }
  },
}));
