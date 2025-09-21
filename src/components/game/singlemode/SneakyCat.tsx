import AnimatedCatImage from "./AnimatedCatImage";
import ErrorMessageDisplay from "./ErrorMessageDisplay";
import { useErrorRecovery } from "./hooks/useErrorRecovery";
import { useGsapAnimation } from "./hooks/useGsapAnimation";

interface SneakyCatProps {
  setIsError: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SneakyCat({ setIsError }: SneakyCatProps) {
  const { imageRef } = useGsapAnimation();
  
  useErrorRecovery(setIsError, 5000, "/game");

  return (
    <ErrorMessageDisplay
      title="앗! 도둑 고양이 등장!"
      message="그림을 낚아채 도망가버렸어요!\n다시 멋지게 그려볼까요?"
    >
      <AnimatedCatImage imageRef={imageRef} />
    </ErrorMessageDisplay>
  );
}