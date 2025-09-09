import gsap from 'gsap'
import thanks_to from '../../../assets/images/thanks_to.gif'
import { ScrollTrigger } from 'gsap/all'
import { useEffect, useRef } from 'react'

gsap.registerPlugin(ScrollTrigger)
export default function ThanksTo() {
  const imgRef = useRef<HTMLImageElement>(null)
  const divRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const imgArea = imgRef.current
    const divArea = divRef.current
    gsap.set([imgArea], {
      opacity: 0,
      scale: 0.5,
      transformOrigin: 'center center',
    })
    gsap.to([imgArea], {
      scrollTrigger: {
        trigger: divArea,
        start: 'top top',
        end: 'top bottom',
        scrub: 3,
      },
      opacity: 1,
      scale: 1,
    })
  }, [])
  return (
    <>
      <div
        ref={divRef}
        className="w-full h-auto flex justify-center items-end py-[10vw]"
      >
        <img
          ref={imgRef}
          className="h-[80vh]"
          src={thanks_to}
          alt="thank to sucoding~"
        />
      </div>
    </>
  )
}
