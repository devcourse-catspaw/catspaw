import jungyu from '../../../assets/images/aboutus_jungyu.gif'
import yebin from '../../../assets/images/aboutus_yebin.gif'
import yubin from '../../../assets/images/aboutus_yubin.gif'
import suji from '../../../assets/images/aboutus_suji.gif'
import { createRef, useEffect, useMemo, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/all'

gsap.registerPlugin(ScrollTrigger)

export default function AboutUs() {
  const nameLeftRef = useMemo(
    () =>
      Array(4)
        .fill(null)
        .map(() => createRef<HTMLSpanElement>()),
    []
  )
  const nameRightRef = useMemo(
    () =>
      Array(4)
        .fill(null)
        .map(() => createRef<HTMLSpanElement>()),
    []
  )
  const imgRef = useMemo(
    () =>
      Array(4)
        .fill(null)
        .map(() => createRef<HTMLImageElement>()),
    []
  )
  const divRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    nameLeftRef.forEach((ref, i) => {
      if (!ref.current) return
      gsap.fromTo(
        ref.current,
        { x: '-30px', opacity: 0 },
        {
          x: '0px',
          opacity: 1,
          scrollTrigger: {
            trigger: ref.current,
            start: `top+=${i * 50} center`,
            end: 'bottom bottom',
            scrub: 1,
          },
        }
      )
    })

    nameRightRef.forEach((ref, i) => {
      if (!ref.current) return
      gsap.fromTo(
        ref.current,
        { x: '30px', opacity: 0 },
        {
          x: '0px',
          opacity: 1,
          scrollTrigger: {
            trigger: ref.current,
            start: `top+=${i * 50} center`,
            end: 'bottom bottom',
            scrub: 1,
          },
        }
      )
    })

    imgRef.forEach((ref, i) => {
      if (!ref.current) return
      gsap.fromTo(
        ref.current,
        { y: '100px', opacity: 0 },
        {
          y: '0px',
          opacity: 1,
          scrollTrigger: {
            trigger: ref.current,
            start: `top+=${i * 50} center`,
            end: 'bottom bottom',
            scrub: 1,
          },
        }
      )
    })
  }, [])

  return (
    <>
      <div
        ref={divRef}
        className="flex flex-col justify-center gap-[40px] w-full font-patrickHand"
      >
        <div className="flex justify-center items-center gap-[10px]">
          <span
            ref={nameLeftRef[0]}
            className="text-[171px] w-[230px] flex justify-center"
          >
            YU
          </span>
          <img ref={imgRef[0]} className="h-[164px]" src={yubin} alt="yubin" />
          <span
            ref={nameRightRef[0]}
            className="text-[171px] w-[248px] flex justify-center"
          >
            BIN
          </span>
        </div>
        <div className="flex justify-center items-center gap-[10px]">
          <span ref={nameLeftRef[1]} className="text-[171px] w-[248px]">
            JUN
          </span>
          <img ref={imgRef[1]} className="h-[164px]" src={jungyu} alt="" />
          <span ref={nameRightRef[1]} className="text-[171px] w-[248px]">
            GYU
          </span>
        </div>
        <div className="flex justify-center items-center gap-[10px]">
          <span
            ref={nameLeftRef[2]}
            className="text-[171px] w-[248px] flex justify-center"
          >
            SU
          </span>
          <img ref={imgRef[2]} className="h-[164px]" src={suji} alt="suji" />
          <span
            ref={nameRightRef[2]}
            className="text-[171px] w-[248px] flex justify-center"
          >
            JI
          </span>
        </div>
        <div className="flex justify-center items-center gap-[10px]">
          <span
            ref={nameLeftRef[3]}
            className="text-[171px] w-[248px] flex justify-center"
          >
            YE
          </span>
          <img ref={imgRef[3]} className="h-[164px]" src={yebin} alt="" />
          <span
            ref={nameRightRef[3]}
            className="text-[171px] w-[248px] flex justify-center"
          >
            BIN
          </span>
        </div>
      </div>
    </>
  )
}
