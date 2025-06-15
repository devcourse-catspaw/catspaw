import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/swiper-bundle.css'
import kisu from '../../assets/images/kisu_.svg'
import kisu_cap from '../../assets/images/kisu_cap.svg'
import kisu_pipi from '../../assets/images/kisu_pippi.svg'
import kisu_ribbon from '../../assets/images/kisu_ribbon.svg'
import kisu_sunglasses from '../../assets/images/kisu_sunglasses.svg'
import kisu_tie from '../../assets/images/kisu_tie.svg'
import slide_left from '../../assets/images/icon_slide_left.svg'
import slide_right from '../../assets/images/icon_slide_right.svg'
import { useEffect, useRef, useState } from 'react'
import { Navigation } from 'swiper/modules'

export default function ChracterSwiper({
  onChange,
}: {
  onChange: (src: string) => void
}) {
  const kisuArray = [
    kisu,
    kisu_cap,
    kisu_pipi,
    kisu_ribbon,
    kisu_sunglasses,
    kisu_tie,
  ]
  const [activeIndex, setActiveIndex] = useState(0)
  const prevRef = useRef(null)
  const nextRef = useRef(null)

  useEffect(() => {
    onChange(kisuArray[activeIndex])
  }, [activeIndex])

  return (
    <>
      <div className="relative w-full ">
        <div className=" absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-[130px] z-10">
          <div ref={prevRef} className="cursor-pointer size-[35px] ">
            <img src={slide_left} alt="slide left" />
          </div>
          <div ref={nextRef} className="cursor-pointer size-[35px] ">
            <img src={slide_right} alt="slide right" />
          </div>
        </div>
        <Swiper
          centeredSlides={true}
          slidesPerView={3}
          spaceBetween={20}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          modules={[Navigation]}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          onBeforeInit={(swiper) => {
            if (
              typeof swiper.params.navigation === 'object' &&
              swiper.params.navigation !== null
            ) {
              swiper.params.navigation.prevEl = prevRef.current
              swiper.params.navigation.nextEl = nextRef.current
            }
          }}
          className="mySwiper absolute w-full flex justify-center items-center"
        >
          {kisuArray.map((src, i) => (
            <SwiperSlide key={i} className="size-[117px]">
              <img
                src={src}
                className={`w-full ease-in-out ${
                  activeIndex === i
                    ? 'opacity-100 scale-100'
                    : 'opacity-40 scale-60 blur-sm'
                }`}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  )
}
