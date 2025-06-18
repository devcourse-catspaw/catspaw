import { useEffect } from 'react'
import supabase from '../utils/supabase'
import toast from 'react-hot-toast'
import NavBar from '../components/main/NavBar'
import main_catdoodle from '../assets/images/main_catdoodle.gif'
import MainBGDoodle1 from '../components/main/animation/MainBGDoodle1'
import MainBGDoodle2 from '../components/main/animation/MainBGDoodle2'
import MainBGDoodle3 from '../components/main/animation/MainBGDoodle3'
import MainBGDoodle4 from '../components/main/animation/MainBGDoodle4'
import MainLank from '../components/main/animation/MainLank'
import AboutUs from '../components/main/animation/AboutUs'
import main_speech_bubble from '../assets/images/main_speech_bubble.svg'
import main_cat_lightmode from '../assets/images/main_cat_lightmode.PNG'
import gsap from 'gsap'
import { ScrollSmoother, ScrollTrigger } from 'gsap/all'
import HotPost from '../components/main/HotPost'
import Button from '../components/common/Button'
import Fire from '../components/main/animation/Fire'
import { useNavigate } from 'react-router-dom'

gsap.registerPlugin(ScrollTrigger, ScrollSmoother)

export default function Home() {
  const navigate = useNavigate()
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        toast('로그인 성공')
      } else {
        toast.error('유저 정보를 불러오기 실패')
      }
    })

    ScrollSmoother.create({
      wrapper: '#smooth-wrapper',
      content: '#smooth-content',
      smooth: 1.5,
    })
  }, [])

  return (
    <>
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <NavBar />
          <div className="flex flex-col justify-center w-full ">
            <div
              className="relative w-full aspect-[16/9] bg-cover bg-no-repeat "
              style={{ backgroundImage: `url(${main_catdoodle})` }}
            >
              <img
                className="absolute right-[3vw] top-[10vh] w-[35vw] aspect-[483/384]"
                src={main_speech_bubble}
                alt="speech_bubble"
              />
              <img
                className="absolute bottom-[10vw] left-1/2 -translate-x-[81%] size-[5vw] cursor-pointer"
                src={main_cat_lightmode}
                alt="main_cat_lightmode"
              />
              <Button
                onClick={() => navigate('/game')}
                className="w-[305px] h-[46px] absolute bottom-[20px] left-1/2 -translate-x-1/2 bg-[var(--red)] cursor-pointer"
              >
                Start To Draw
              </Button>
            </div>
            <MainBGDoodle1 />
            <MainLank />
            <MainBGDoodle2 />
            <div className=" w-full aspect-[1156/613] px-[80px] my-[100px]">
              <div className=" flex flex-col gap-[5vh] w-full h-[80%] px-[40px] py-[20px] bg-[var(--grey-200)] rounded-[24px]">
                <div className="flex justify-center items-end gap-[54px] -translate-y-[50px]">
                  <Fire />
                  <span className="text-[var(--white)] text-[5vw] font-bold pb-[27px]">
                    What's Hot
                  </span>
                  <Fire />
                </div>
                <div className="relative">
                  <HotPost />
                </div>
              </div>
            </div>
            <MainBGDoodle3 />
            <AboutUs />
            <MainBGDoodle4 />
          </div>
        </div>
      </div>
    </>
  )
}
