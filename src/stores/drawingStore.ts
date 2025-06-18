import { create } from "zustand";

export const topicListData = [
  "천사",
  "자전거",
  "고양이",
  "물고기",
  "나무",
  "악어",
  "드럼",
  "코끼리",
  "소방차",
  "헬리콥터",
  "모나리자",
  "트럼펫",
  "말",
  "잠수함",
  "기타",
  "수코딩",
];

type DrawingState = {
  topicList: string[];
  currentTopic: string;
  filename: string | null;
  usedTopic: string[];
  aiAnswerList: string[];
  getRandomTopic: () => void;
  resetTopicList: () => void;
  setFilename: (filename: string) => void;
  setAiAnswer: (answer: string) => void;
};

export const useDrawingStore = create<DrawingState>((set, get) => ({
  topicList: [...topicListData],
  currentTopic: "",
  filename: null,
  usedTopic: [],
  aiAnswerList: [],

  getRandomTopic: () => {
    const { topicList } = get();
    if (topicList.length === 0) return;

    const randomIndex = Math.floor(Math.random() * topicList.length);
    const selectedTopic = topicList[randomIndex];

    set((state) => ({
      currentTopic: selectedTopic,
      usedTopic: [...state.usedTopic, selectedTopic],
      topicList: state.topicList.filter((topic) => topic !== selectedTopic),
    }));
  },

  setAiAnswer: (answer) =>
    set((state) => ({
      aiAnswerList: [...state.aiAnswerList, answer],
    })),

  resetTopicList: () => {
    set({
      topicList: [...topicListData],
      currentTopic: "",
      usedTopic: [],
      aiAnswerList: [],
    });
  },
  setFilename: (filename) => set({ filename: filename }),
}));
