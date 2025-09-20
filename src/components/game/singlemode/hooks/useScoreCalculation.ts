import { useMemo } from "react";

export const useScoreCalculation = (usedTopic: string[], aiAnswerList: string[]) => {
  const correctCount = useMemo(() => {
    return aiAnswerList.filter((answer, i) => answer === usedTopic[i]).length;
  }, [aiAnswerList, usedTopic]);

  return { correctCount };
};