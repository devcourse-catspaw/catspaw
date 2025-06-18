import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin)

export function useDrawSVG(
  pathRef: React.RefObject<SVGPathElement | null>,
  options: {
    start: string
    end?: string
    scrub: number
  }
) {
  useEffect(() => {
    const path = pathRef.current
    if (!path) return

    gsap.set(path, { drawSVG: '0%' })

    gsap.to(path, {
      drawSVG: '100%',
      scrollTrigger: {
        trigger: path,
        start: options?.start || 'top bottom',
        end: options?.end || 'bottom-=500 top',
        scrub: options?.scrub ?? 1,
      },
      ease: 'none',
    })
  }, [pathRef, options])
}
