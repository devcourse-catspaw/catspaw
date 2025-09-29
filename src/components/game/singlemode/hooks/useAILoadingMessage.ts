import { useState, useEffect } from "react";

const AI_MESSAGES = [
  { text: "AI가 그림을 분석하는 중...", duration: 2000 },
  { text: "색깔과 모양을 확인하고 있어요...", duration: 2000 },
  { text: "비슷한 그림들과 비교중...", duration: 2000 },
  { text: "거의 다 됐어요!", duration: 2000 },
  { text: "AI가 고민에 빠졌어요... 조금만 더!", duration: Infinity }
];

export const useAILoadingMessage = () => {
  const [messageIndex, setMessageIndex] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(AI_MESSAGES[0].text);

  useEffect(() => {
    if (messageIndex >= AI_MESSAGES.length - 1) {
      return;
    }

    const timer = setTimeout(() => {
      const nextIndex = messageIndex + 1;
      setMessageIndex(nextIndex);
      setCurrentMessage(AI_MESSAGES[nextIndex].text);
    }, AI_MESSAGES[messageIndex].duration);

    return () => clearTimeout(timer);
  }, [messageIndex]);

  return { currentMessage };
};