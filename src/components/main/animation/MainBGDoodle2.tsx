import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef } from 'react'

gsap.registerPlugin(ScrollTrigger)

export default function MainBGDoodle2() {
  const drawRef = useRef<SVGPathElement>(null)

  useEffect(() => {
    const drawPath = drawRef.current
    if (!drawPath) return

    const length = drawPath.getTotalLength()

    gsap.set(drawPath, {
      strokeDasharray: length,
      strokeDashoffset: length,
    })

    gsap.to(drawPath, {
      strokeDashoffset: 0,
      scrollTrigger: {
        trigger: drawPath,
        start: 'top bottom',
        end: 'bottom-=500 top',
        scrub: 2,
      },
      ease: 'none',
    })
  }, [])
  return (
    <>
      <svg
        className="w-full"
        viewBox="0 0 1257 937"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          ref={drawRef}
          strokeWidth={15}
          stroke="black"
          strokeLinecap="round"
          d="M6.79492 6.22266C11.4761 8.52776 30.3424 29.7702 78.4659 68.5313C116.353 99.0479 185.103 147.082 230.603 177.669C276.102 208.256 300.499 222.862 324 235C387.34 267.715 423.5 272.5 436 272.5C456.35 272.5 476.038 272.675 499 265.635C535.5 254.446 538.5 253 553 240.5C567.586 227.926 584 194.5 584 177.669C584 162.933 579 137 568 123C560.017 112.84 546 97 513 91.5C473.685 84.9476 429.288 115.974 414.5 132.5C395.172 154.099 387.147 169.155 375.5 194.5C354.686 239.791 320 334.5 320 406.5C320 469 324 490 336.5 537C342.392 559.155 367.5 639 414.5 683C441.527 708.302 489.508 733.109 520 746C541.79 755.212 580.048 761.954 609.5 765.5C645.732 769.863 689.5 769.46 744.622 755.15C774.947 747.278 788.118 742.685 803.403 737.401C830.995 727.862 915.328 700.314 949 669C993.146 627.946 1008.43 580.601 1008.5 548.666C1008.52 539 1013.26 495.824 977.5 480.5C963.5 474.5 932.877 478.159 920.5 480.5C877.339 488.662 843.5 545 851 621.5C853.616 648.184 866.964 710.166 895 765.5C914 803 931.5 835.182 969.5 859.5C997.5 877.418 1015 890 1081 910C1124.76 923.26 1232.64 927.433 1255 928"
        />
      </svg>
    </>
  )
}
