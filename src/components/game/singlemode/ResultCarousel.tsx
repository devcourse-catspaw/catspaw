import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Grid } from "swiper/modules";
import prevIcon from "../../../assets/images/icon_slide_left.svg";
import nextIcon from "../../../assets/images/icon_slide_right.svg";
import SingleModeResultCard from "../SingleModeResultCard";

interface ResultCarouselProps {
  usedTopic: string[];
  answerList: string[];
  aiAnswerList: string[];
  onPrev: () => void;
  onNext: () => void;
  onSwiper: (swiper: SwiperType) => void;
}

export default function ResultCarousel({
  usedTopic,
  answerList,
  aiAnswerList,
  onPrev,
  onNext,
  onSwiper,
}: ResultCarouselProps) {
  return (
    <div className="flex justify-center items-center w-[828px]">
      <img
        src={prevIcon}
        onClick={onPrev}
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
          onSwiper={onSwiper}
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
        onClick={onNext}
        alt="다음 슬라이드"
        className="cursor-pointer"
      />
    </div>
  );
}
