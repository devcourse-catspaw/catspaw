import { create } from "zustand";

export const topicListData = [
  "비행기",
  "구급차",
  "천사",
  "책가방",
  "농구공",
  "해변",
  "곰",
  "생일케이크",
  "팔찌",
  "선인장",
  "계산기",
  "캠프파이어",
  "당근",
  "고양이",
  "컴퓨터",
  "게",
  "오리",
  "코끼리",
  "수코딩",
  "아이스크림",
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
