import DrawingPropmt from "../components/game/DrawingPropmt";
import SingleModeHeader from "../components/game/SingleModeHeader";
import sketchBook from "../assets/images/sketchbook.svg";
import aiThinking from "../assets/images/ai_answering.svg";
import aiAnswering from "../assets/images/ai_answering3.svg";
import correctAnswer from "../assets/images/answer_correct_blue.svg";
import wrongAnswer from "../assets/images/answer_wrong_red.svg";
import { useDrawingStore } from "../stores/drawingStore";
import { useEffect, useRef, useState } from "react";
import * as tmImage from "@teachablemachine/image";
import supabase from "../utils/supabase";
import { useNavigate } from "react-router";
import { useGameTimerStore } from "../stores/gameTimerStore";
import { useAuthStore } from "../stores/authStore";
import SneakyCat from "../components/game/SneakyCat";

export default function AiAnswering() {
  const { currentTopic, setAiAnswer, filename } = useDrawingStore();
  const { timeLeft } = useGameTimerStore();
  const [prediction, setPrediction] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageReady, setImageReady] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchImage = async () => {
      if (!filename) return;

      const { data } = supabase.storage
        .from("singlemode-images")
        .getPublicUrl(`private/${user?.id}/${filename}`);

      setImageUrl(data.publicUrl);
    };

    fetchImage();
  }, [filename]);

  useEffect(() => {
    if (!imageUrl || !imageReady) return;

    const predict = async () => {
      const URL = "https://teachablemachine.withgoogle.com/models/SolSQBa_D/";
      const modelURL = URL + "model.json";
      const metadataURL = URL + "metadata.json";

      const model = await tmImage.load(modelURL, metadataURL);

      if (imgRef.current) {
        const predictions = await model.predict(imgRef.current);
        const sorted = predictions.sort(
          (a, b) => b.probability - a.probability
        );
        const best = sorted[0];

        setPrediction(best.className);
        setAiAnswer(best.className);
      }
    };

    predict();
  }, [imageUrl, imageReady]);

  useEffect(() => {
    if (prediction) {
      const timer = setTimeout(() => {
        navigate("/game/single");
      }, 1000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [prediction]);

  useEffect(() => {
    if (timeLeft <= 0) {
      navigate("/game/single-result");
    }
  }, [timeLeft]);

  useEffect(() => {
    const errorHadleTimer = setTimeout(() => {
      setIsError(true);
    }, 10000);
    return () => {
      clearTimeout(errorHadleTimer);
    };
  }, []);

  return (
    <div className="w-full min-h-screen flex flex-col items-center px-20 pt-[14px] relative">
      <SingleModeHeader disable={true} />
      {isError && (
        <div className="w-[700px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <SneakyCat setIsError={setIsError} />
        </div>
      )}

      {!isError && prediction && (
        <>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <DrawingPropmt topic={currentTopic} className="w-107" />
            <div className="relative">
              <img
                src={sketchBook}
                alt="스케치북"
                className="w-[438px] h-[294px]"
              />
              {imageUrl && (
                <img
                  ref={imgRef}
                  src={imageUrl}
                  alt="사용자 그림"
                  crossOrigin="anonymous"
                  onLoad={() => setImageReady(true)}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[420px]"
                />
              )}
              <div className="absolute top-[-70px] right-[-140px]">
                {prediction === currentTopic ? (
                  <img src={correctAnswer} alt="정답 아이콘" />
                ) : (
                  <img
                    src={wrongAnswer}
                    alt="오답 아이콘"
                    className="text-[color:var(--red)]"
                  />
                )}
              </div>
              <div className="w-[266px] h-[133px] absolute left-[-280px] bottom-[150px] border-[2px] border-[color:var(--black)] flex justify-center items-center text-[28px] font-extrabold rounded-[6px]">
                "{prediction}"
              </div>

              <img
                src={aiAnswering}
                alt="생각하는 AI"
                className="absolute left-[-280px] bottom-[-100px]"
              />
            </div>
          </div>
        </>
      )}

      {!isError && !prediction && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <img src={aiThinking} alt="생각하는 AI 그림" />
          {imageUrl && (
            <img
              src={imageUrl}
              alt=""
              className="hidden"
              ref={imgRef}
              crossOrigin="anonymous"
              onLoad={() => {
                setImageReady(true);
              }}
            />
          )}
        </div>
      )}
      {/* {prediction ? (
        <>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <DrawingPropmt topic={currentTopic} className="w-107" />
            <div className="relative">
              <img
                src={sketchBook}
                alt="스케치북"
                className="w-[438px] h-[294px]"
              />
              {imageUrl && (
                <img
                  ref={imgRef}
                  src={imageUrl}
                  alt="사용자 그림"
                  crossOrigin="anonymous"
                  onLoad={() => setImageReady(true)}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[420px]"
                />
              )}
              <div className="absolute top-[-70px] right-[-140px]">
                {prediction === currentTopic ? (
                  <img src={correctAnswer} alt="정답 아이콘" />
                ) : (
                  <img
                    src={wrongAnswer}
                    alt="오답 아이콘"
                    className="text-[color:var(--red)]"
                  />
                )}
              </div>
              <div className="w-[266px] h-[133px] absolute left-[-280px] bottom-[150px] border-[2px] border-[color:var(--black)] flex justify-center items-center text-[28px] font-extrabold rounded-[6px]">
                "{prediction}"
              </div>

              <img
                src={aiAnswering}
                alt="생각하는 AI"
                className="absolute left-[-280px] bottom-[-100px]"
              />
            </div>
          </div>
        </>
      ) : (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <img src={aiThinking} alt="생각하는 AI 그림" />
          {imageUrl && (
            <img
              src={imageUrl}
              alt=""
              className="hidden"
              ref={imgRef}
              crossOrigin="anonymous"
              onLoad={() => {
                setImageReady(true);
              }}
            />
          )}
        </div>
      )} */}
    </div>
  );
}
