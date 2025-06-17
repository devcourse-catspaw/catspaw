import { useEffect } from 'react'
import supabase from '../utils/supabase'
import toast from 'react-hot-toast'
import NavBar from '../components/common/NavBar'

export default function Home() {
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        toast.success('로그인 성공')
      } else {
        toast.error('유저 정보를 불러오기 실패')
      }
    })
  }, [])

  return (
    <>
      <h1>Home</h1>
      <NavBar />
    </>
  )
}
