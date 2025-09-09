import { useEffect, useRef } from 'react'
import fire from '../../../assets/images/main_hot.png'
import gsap from 'gsap'

export default function Fire() {
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (!imgRef.current) return

    gsap.from(imgRef.current, {
      rotate: -10,
    })
    gsap.to(imgRef.current, {
      rotate: 10,
      duration: 0.3,
      yoyo: true,
      repeat: -1,
      ease: 'power1.inOut',
    })
  }, [])
  return (
    <>
      <img ref={imgRef} src={fire} alt="fire" />
    </>
  )
}
