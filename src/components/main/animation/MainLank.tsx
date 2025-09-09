import gsap from 'gsap'
import main_rank from '../../../assets/images/main_rank.svg'
import sparklers from '../../../assets/images/birthday_sparklers.svg'
import { ScrollTrigger } from 'gsap/all'
import { useEffect, useRef, useState } from 'react'
import supabase from '../../../utils/supabase'
import Crown from '../../../assets/images/crown.svg?react'

gsap.registerPlugin(ScrollTrigger)

type rankingInfo = {
  user_id: string
  score: number
  nickname: string
  avatar: string
}[]

export default function MainLank() {
  const divRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const sparklerLeftRef = useRef<HTMLImageElement>(null)
  const sparklerRightRef = useRef<HTMLImageElement>(null)
  const rankerNameRef = useRef<HTMLDivElement>(null)
  const rankerAvatarRef = useRef<HTMLDivElement>(null)
  const crownRef = useRef<HTMLDivElement>(null)
  const [ranking, setRanking] = useState<rankingInfo>([])
  const customOrder = [1, 0, 2]

  useEffect(() => {
    const fetchRanking = async () => {
      const { data, error } = await supabase.rpc('get_top_3_user_scores')

      if (error) {
        console.error(error)
      } else {
        setRanking(data)
        console.log(data)
      }
    }

    fetchRanking()
  }, [])

  useEffect(() => {
    const divArea = divRef.current
    const imgPosition = imgRef.current
    const sparklerLeft = sparklerLeftRef.current
    const sparklerRight = sparklerRightRef.current
    const rankerNameArea = rankerNameRef.current
    const rankerAvatarArea = rankerAvatarRef.current
    const crownArea = crownRef.current

    gsap.to(imgPosition, {
      scrollTrigger: {
        trigger: divArea,
        start: 'top center',
        end: 'bottom bottom',
        scrub: 1,
      },
      y: '-80vh',
    })
    gsap.to(rankerNameArea, {
      scrollTrigger: {
        trigger: divArea,
        start: 'top center',
        end: 'bottom bottom',
        scrub: 3,
      },
      y: '-80vh',
    })

    gsap.set([rankerAvatarArea, crownArea], {
      opacity: 0,
    })
    gsap.to([rankerAvatarArea, crownArea], {
      scrollTrigger: {
        trigger: divArea,
        start: 'top bottom',
        end: 'bottom bottom',
        scrub: 3,
      },
      opacity: 1,
      y: '40vh',
    })

    gsap.set([sparklerLeft], {
      x: '-10vw',
      y: '-50vh',
    })
    gsap.set([sparklerRight], {
      x: '10vw',
      y: '-50vh',
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
        <div
          ref={crownRef}
          className="w-[50vw] absolute top-[-45vh] flex justify-center "
        >
          <Crown className="size-[5vh] text-[#F4EC5A]" />
        </div>
        <div
          ref={rankerAvatarRef}
          className="w-[50vw] absolute top-[-50vh] flex justify-between "
        >
          {customOrder.map((i) => {
            const ranker = ranking[i]
            if (!ranker) return null
            const avatarUrl = `${
              import.meta.env.VITE_SUPABASE_URL
            }/storage/v1/object/public/avatar-image/${ranker.avatar}`

            const avatarClass = [
              'size-[10vw] relative translate-y-[5vw]',
              'size-[10vw] relative translate-y-[10vw]',
              'size-[10vw] relative translate-y-[15vw]',
            ][i]

            return <img key={i} src={avatarUrl} className={avatarClass} />
          })}
        </div>

        <img
          ref={imgRef}
          src={main_rank}
          alt="rank"
          className="w-[50vw] absolute bottom-[-50vh]"
        />
        <div
          ref={rankerNameRef}
          className="w-[50vw] absolute bottom-[-60vh] flex justify-between"
        >
          {customOrder.map((i) => {
            const ranker = ranking[i]
            if (!ranker) return null

            return (
              <span
                key={i}
                className="font-semibold text-[30px] text-center w-1/3"
              >
                {ranker.nickname}
              </span>
            )
          })}
        </div>
      </div>
    </>
  )
}
