import { useState, useEffect, useRef, useCallback } from "react";
import * as tmImage from "@teachablemachine/image";

type Prediction = {
  className: string;
  probability: number;
};

let cachedModel: tmImage.CustomMobileNet | null = null;
let isLoadingModel = false;

export const useAIPrediction = (
  imageUrl: string | null,
  setAiAnswer: (answer: string) => void,
  setIsError: React.Dispatch<React.SetStateAction<boolean>>,
  imageReady: boolean
) => {
  const [prediction, setPrediction] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const retryCountRef = useRef(0);
  const hasStartedRef = useRef(false);

  const loadModel = async () => {
    if (cachedModel) {
      return cachedModel;
    }

    if (isLoadingModel) {
      while (isLoadingModel) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      return cachedModel;
    }

    isLoadingModel = true;

    try {
      const URL = "https://teachablemachine.withgoogle.com/models/SolSQBa_D/";
      const modelURL = URL + "model.json";
      const metadataURL = URL + "metadata.json";

      const modelPromise = tmImage.load(modelURL, metadataURL);
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("모델 로딩 타임아웃")), 10000)
      );

      const model = (await Promise.race([
        modelPromise,
        timeoutPromise,
      ])) as tmImage.CustomMobileNet;

      cachedModel = model;
      isLoadingModel = false;
      return model;
    } catch (error) {
      isLoadingModel = false;
      throw error;
    }
  };

  const runPrediction = useCallback(async () => {
    const currentAttempt = retryCountRef.current + 1;
    retryCountRef.current = currentAttempt;

    try {
      const model = await loadModel();

      if (!model) {
        throw new Error("모델 로드 실패");
      }

      if (!imgRef.current) {
        throw new Error("이미지 참조가 없음");
      }

      const predictionPromise = model.predict(imgRef.current);
      const predictionTimeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("예측 타임아웃")), 10000)
      );

      const predictions = (await Promise.race([
        predictionPromise,
        predictionTimeoutPromise,
      ])) as Prediction[];

      if (!predictions || predictions.length === 0) {
        throw new Error("예측 결과가 없음");
      }

      const sorted = predictions.sort((a, b) => b.probability - a.probability);
      const best = sorted[0];

      setPrediction(best.className);
      setAiAnswer(best.className);
      retryCountRef.current = 0;
    } catch {
      if (currentAttempt < 3) {
        setTimeout(() => {
          runPrediction();
        }, 5000);
      } else {
        retryCountRef.current = 0;
        setIsError(true);
      }
    }
  }, [setAiAnswer, setIsError]);

  useEffect(() => {
    if (!imageUrl || !imageReady || prediction || hasStartedRef.current) {
      return;
    }

    hasStartedRef.current = true;
    runPrediction();

    return () => {
      hasStartedRef.current = false;
      retryCountRef.current = 0;
    };
  }, [imageUrl, imageReady, prediction, runPrediction]);

  return {
    prediction,
    imgRef,
  };
};
