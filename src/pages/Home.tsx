import { useEffect } from 'react'
import supabase from '../utils/supabase'
import toast from 'react-hot-toast'
import { useAuthStore } from '../stores/authStore'
import { useNavigate } from 'react-router-dom'
import Button from '../components/common/Button'

export default function Home() {
  const { user, setUser } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        toast.success('로그인 성공')
      } else {
        toast.error('유저 정보를 불러오기 실패')
      }
    })
  }, [])

  const logout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error('로그아웃 실패')
      return
    }
    setUser(null)
    toast.success('로그아웃 되었습니다!')
    navigate('/')
  }

  return (
    <>
      <h1>Home</h1>
      {user && <Button onClick={logout}>로그아웃</Button>}
      {!user && <Button onClick={() => navigate('/login')}>로그인</Button>}
    </>
  )
}
