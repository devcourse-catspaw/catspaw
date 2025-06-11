import { create } from "zustand";

export const topicListData = [
  "cat",
  "dog",
  "bird",
  "fish",
  "elephant",
  "tiger",
  "bear",
  "cow",
  "horse",
  "sheep",
  "car",
  "house",
  "tree",
  "flower",
  "sun",
  "moon",
  "star",
  "apple",
  "banana",
  "umbrella",
  "cup",
  "scissors",
  "guitar",
  "piano",
  "clock",
  "book",
  "chair",
  "table",
  "airplane",
  "bicycle",
];

type DrawingState = {
  topicList: string[];
  currentTopic: string;
  getRandomTopic: () => void;
  resetTopicList: () => void;
};

export const useDrawingStore = create<DrawingState>((set, get) => ({
  topicList: [...topicListData],
  currentTopic: "",

  getRandomTopic: () => {
    const { topicList } = get();
    if (topicList.length === 0) return;

    const randomIndex = Math.floor(Math.random() * topicList.length);
    const selectedTopic = topicList[randomIndex];

    set((state) => ({
      currentTopic: selectedTopic,
      topicList: state.topicList.filter((topic) => topic !== selectedTopic),
    }));
  },

  resetTopicList: () => {
    set({
      topicList: [...topicListData],
      currentTopic: "",
    });
  },
}));
