import { useEffect, useRef, useState } from "react";
import { useDrawingStore } from "../stores/drawingStore";
import SingleModeHeader from "../components/game/SingleModeHeader";
import Button from "../components/common/Button";
import { useNavigate } from "react-router";
import SingleModeResultCard from "../components/game/SingleModeResultCard";
import supabase from "../utils/supabase";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Grid } from "swiper/modules";
import DrawingPropmt from "../components/game/DrawingPropmt";
import pawsMouse from "../assets/images/paw_mouse_big.svg";
import type { FileObject } from "@supabase/storage-js";
import prevIcon from "../assets/images/icon_slide_left.svg";
import nextIcon from "../assets/images/icon_slide_right.svg";
import { useAuthStore } from "../stores/authStore";

interface StorageResponse {
  data: FileObject[] | null;
  error: Error | null;
}

export default function SingleModeResultPage() {
  const user = useAuthStore((state) => state.user);
  const { usedTopic, resetTopicList, aiAnswerList } = useDrawingStore();
  const navigate = useNavigate();
  const swiperRef = useRef<SwiperType | null>(null);
  const [answerList, setAnswerList] = useState<string[]>([]);
  const correctCount = aiAnswerList.filter(
    (answer, i) => answer === usedTopic[i]
  ).length;

  useEffect(() => {
    const fetchImage = async () => {
      const { data, error }: StorageResponse = await supabase.storage
        .from("singlemode-images")
        .list(`private/${user?.id}`, {
          limit: 100,
          offset: 0,
          sortBy: { column: "name", order: "asc" },
        });

      const imageUrls = data!.map((file: FileObject) => {
        const { data } = supabase.storage
          .from("singlemode-images")
          .getPublicUrl(`private/${user?.id}/${file.name}`);
        return data.publicUrl;
      });

      if (error) {
        console.error(error);
        return;
      }

      setAnswerList(imageUrls);
    };

    fetchImage();
  }, []);

  const saveScoreToDatabase = async () => {
    await supabase
      .from("game_scores")
      .insert([{ user_id: user?.id, score: correctCount }]);
  };

  const handleExitRoom = async () => {
    resetTopicList();

    const { data, error } = await supabase.storage
      .from("singlemode-images")
      .list(`private/${user?.id}`);

    saveScoreToDatabase();

    if (error) {
      console.error(error);
      return;
    }

    const fileNames = data.map((file) => `private/${user?.id}/${file.name}`);

    if (fileNames.length > 0) {
      const { error } = await supabase.storage
        .from("singlemode-images")
        .remove(fileNames);
      if (error) {
        console.error(error);
      }
    }
    requestAnimationFrame(() => {
      navigate("/game");
    });
  };

  const handlePrev = () => {
    swiperRef.current?.slidePrev();
  };
  const handleNext = () => {
    swiperRef.current?.slideNext();
  };

  const preventClose = (e: BeforeUnloadEvent) => {
    e.preventDefault();
  };
  useEffect(() => {
    (() => {
      window.addEventListener("beforeunload", preventClose);
    })();
    return () => {
      window.removeEventListener("beforeunload", preventClose);
    };
  }, []);

  return (
    <>
      <div className="w-full min-h-screen flex flex-col items-center px-20 pt-[14px] relative">
        <SingleModeHeader disable={true} />
        <div className="flex absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 gap-[62px] w-[1008px]">
          <div className="flex flex-col gap-7 items-center justify-center">
            <DrawingPropmt topic="결과 발표" className="w-[700px] h-[62px]" />
            <div className="flex justify-center items-center w-[828px]">
              <img
                src={prevIcon}
                onClick={handlePrev}
                alt="이전 슬라이드"
                className="cursor-pointer"
              />
              <div className="ml-[18px]">
                <Swiper
                  slidesPerView={3}
                  grid={
                    usedTopic.length <= 3
                      ? { rows: 1, fill: "row" }
                      : { rows: 2, fill: "row" }
                  }
                  spaceBetween={22}
                  modules={[Grid]}
                  className="w-[720px] h-[420px] overflow-hidden"
                  loop={false}
                  onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                  }}
                >
                  {usedTopic.map((topic, i) => (
                    <SwiperSlide key={i}>
                      <div className="h-[195px] w-[212px]">
                        <SingleModeResultCard
                          topic={topic}
                          draw={answerList[i]}
                          aiAnswer={aiAnswerList[i]}
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
              <img
                src={nextIcon}
                onClick={handleNext}
                alt="다음 슬라이드"
                className="cursor-pointer"
              />
            </div>
          </div>
          <div className="flex flex-col gap-5 items-center">
            <div className="px-[32px] py-[25px] flex flex-col justify-center items-center border-[2px] border-[color:var(--black)] rounded-[6px]">
              <div className="border-b border-[color:var(--black)] w-[147px] pb-6 mb-6">
                <div className="flex flex-col gap-[6px] items-center justify-center">
                  <h1 className="text-center text-lg font-extrabold flex gap-2">
                    <span>"</span>
                    {user?.user_metadata.full_name}
                    <span>"</span>
                  </h1>
                  <h2 className="text-center text-sm font-extrabold">
                    님의 점수
                  </h2>
                </div>
                <div className="flex flex-col gap-3 mt-[24px]">
                  <p className="text-start font-semibold text-sm">
                    {usedTopic.length}개 그림
                  </p>
                  <p className="text-start font-semibold text-sm">
                    {correctCount}개 그림
                  </p>
                </div>
              </div>
              <div className="w-[147px] flex flex-col gap-[24px]">
                <p className="text-start font-semibold text-sm">
                  {correctCount}개 x 1점 = {correctCount}점
                </p>
                <h1 className="text-center font-extrabold text-lg">
                  점수 : {correctCount}점
                </h1>
              </div>
            </div>
            <Button
              onClick={handleExitRoom}
              className="w-[134px] h-[44px] font-semibold text-[18px] p-0"
            >
              방 나가기
            </Button>
          </div>
        </div>
        <img
          src={pawsMouse}
          alt="마우스 잡은 고양이 손 그림"
          className="absolute bottom-0 -z-50 right-[36px]"
        />
      </div>
    </>
  );
}
