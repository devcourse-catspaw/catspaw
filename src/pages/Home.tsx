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
import gsap from 'gsap'
import { ScrollSmoother, ScrollTrigger } from 'gsap/all'

gsap.registerPlugin(ScrollTrigger, ScrollSmoother)

export default function Home() {
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        toast.success('로그인 성공')
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
          <div className="flex flex-col justify-center w-full relative">
            <img src={main_catdoodle} className="w-full" />
            <MainBGDoodle1 />
            <MainLank />
            <MainBGDoodle2 />
            <div className="w-full aspect-[1156/613] px-[80px] my-[100px]">
              <div className="w-full h-[80%] bg-[var(--grey-200)] rounded-[24px]"></div>
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
