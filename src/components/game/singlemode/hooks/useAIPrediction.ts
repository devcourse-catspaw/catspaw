import { useState, useEffect, useRef } from "react";
import * as tmImage from "@teachablemachine/image";

type Prediction = {
  className: string;
  probability: number;
};

let cachedModel: tmImage.CustomMobileNet | null = null;
let isLoadingModel = false;

export const useAIPrediction = (
  imageUrl: string | null,
  currentTopic: string | null,
  setAiAnswer: (answer: string) => void,
  setIsError: React.Dispatch<React.SetStateAction<boolean>>,
  imageReady: boolean
) => {
  const [prediction, setPrediction] = useState<string | null>(null);
  const [predictionCount, setPredictionCount] = useState(0);
  const imgRef = useRef<HTMLImageElement | null>(null);
  
  const performanceStartRef = useRef<number | null>(null);

  const loadModel = async () => {
    if (cachedModel) {
      console.log("[개선 후] 캐시된 모델 사용");
      return cachedModel;
    }

    if (isLoadingModel) {
      while (isLoadingModel) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return cachedModel;
    }

    isLoadingModel = true;
    const modelLoadStart = performance.now();

    try {
      const URL = "https://teachablemachine.withgoogle.com/models/SolSQBa_D/";
      const modelURL = URL + "model.json";
      const metadataURL = URL + "metadata.json";

      const modelPromise = tmImage.load(modelURL, metadataURL);
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("모델 로딩 타임아웃")), 30000)
      );

      const model = (await Promise.race([
        modelPromise,
        timeoutPromise,
      ])) as tmImage.CustomMobileNet;

      const modelLoadEnd = performance.now();
      const loadTime = ((modelLoadEnd - modelLoadStart) / 1000).toFixed(2);
      
      console.log(`[개선 후] 모델 로딩: ${loadTime}초`);

      cachedModel = model;
      isLoadingModel = false;
      return model;
    } catch (error) {
      isLoadingModel = false;
      throw error;
    }
  };

  useEffect(() => {
    if (!imageUrl || !imageReady) {
      return;
    }

    if (prediction) {
      return;
    }

    const predict = async () => {
      const tryNumber = predictionCount + 1;
      setPredictionCount(tryNumber);

      if (tryNumber === 1) {
        performanceStartRef.current = performance.now();
        console.log("[개선 후] 시작");
      }

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
          setTimeout(() => reject(new Error("예측 타임아웃")), 15000)
        );

        const predictions = (await Promise.race([
          predictionPromise,
          predictionTimeoutPromise,
        ])) as Prediction[];

        if (!predictions || predictions.length === 0) {
          throw new Error("예측 결과가 없음");
        }

        const sorted = predictions.sort(
          (a, b) => b.probability - a.probability
        );
        const best = sorted[0];

        setPrediction(best.className);
        setAiAnswer(best.className);

        if (performanceStartRef.current) {
          const totalTime = ((performance.now() - performanceStartRef.current) / 1000).toFixed(2);
          console.log(`[개선 후] 완료: ${totalTime}초 (${tryNumber}회 시도)`);
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "알 수 없는 오류";
        console.log(`[개선 후] 시도 ${tryNumber} 실패: ${errorMessage}`);

        if (tryNumber < 3) {
          setTimeout(() => {
            predict();
          }, 5000);
        } else {
          console.log("[개선 후] 최대 재시도 초과");
          setIsError(true);
        }
      }
    };

    if (predictionCount > 0) {
      const timer = setTimeout(predict, 1000);
      return () => clearTimeout(timer);
    } else {
      predict();
    }
  }, [imageUrl, imageReady, currentTopic, setAiAnswer, setIsError, predictionCount, prediction]);

  return {
    prediction,
    imgRef,
  };
};