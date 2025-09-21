import { useRef } from "react";
import type { Swiper as SwiperType } from "swiper";

export const useSwiperControls = () => {
  const swiperRef = useRef<SwiperType | null>(null);

  const handlePrev = () => {
    swiperRef.current?.slidePrev();
  };

  const handleNext = () => {
    swiperRef.current?.slideNext();
  };

  const onSwiper = (swiper: SwiperType) => {
    swiperRef.current = swiper;
  };

  return { handlePrev, handleNext, onSwiper };
};
