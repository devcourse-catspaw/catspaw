import { useEffect } from "react";
import { useDrawingStore } from "../../../../stores/drawingStore";

export const useTopicInitialization = () => {
  const { getRandomTopic } = useDrawingStore();

  useEffect(() => {
    getRandomTopic();
  }, [getRandomTopic]);
};
