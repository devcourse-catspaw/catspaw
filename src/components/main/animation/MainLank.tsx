import gsap from 'gsap'
import main_rank from '../../../assets/images/main_rank.svg'
import sparklers from '../../../assets/images/birthday_sparklers.svg'
import { ScrollTrigger } from 'gsap/all'
import { useEffect, useRef } from 'react'

gsap.registerPlugin(ScrollTrigger)

export default function MainLank() {
  const divRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const sparklerLeftRef = useRef<HTMLImageElement>(null)
  const sparklerRightRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const divArea = divRef.current
    const imgPosition = imgRef.current
    const sparklerLeft = sparklerLeftRef.current
    const sparklerRight = sparklerRightRef.current

    gsap.to(imgPosition, {
      scrollTrigger: {
        trigger: divArea,
        start: 'top center',
        end: 'bottom bottom',
        scrub: 1,
      },
      y: '-300px',
    })

    gsap.set([sparklerLeft], {
      x: '-10vw',
      y: '-50vh',
      // opacity: 0,
    })
    gsap.set([sparklerRight], {
      x: '10vw',
      y: '-50vh',
      // opacity: 0,
    })
    gsap.to(sparklerLeft, {
      scrollTrigger: {
        trigger: divArea,
        start: 'top center',
        end: 'bottom bottom',
        scrub: 1,
      },
      x: '8vw',
      y: '0',
      // opacity: 1,
    })
    gsap.to(sparklerRight, {
      scrollTrigger: {
        trigger: divArea,
        start: 'top center',
        end: 'bottom bottom',
        scrub: 1,
      },
      x: '-5vw',
      y: '0',
      opacity: 1,
    })
  }, [])
  return (
    <>
      <div
        ref={divRef}
        className="relative w-full h-[80vh] flex justify-center items-center "
      >
        <img
          ref={sparklerLeftRef}
          src={sparklers}
          className="absolute w-[10vw] top-[30vh] left-0"
        />
        <img
          ref={sparklerRightRef}
          src={sparklers}
          className="absolute w-[10vw] top-[20vh] right-0 -scale-x-100"
        />

        <img
          ref={imgRef}
          src={main_rank}
          alt="rank"
          className="w-[50vw] absolute bottom-[-200px]"
        />
      </div>
    </>
  )
}
