import { useNavigate } from 'react-router-dom'
import supabase from '../../utils/supabase'
import toast from 'react-hot-toast'
import { useAuthStore } from '../../stores/authStore'

export default function NavBarDropBox() {
  const { setUser } = useAuthStore()
  const navigate = useNavigate()
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
      <div className="flex flex-col justify-between w-[130px] h-[80px] border-2 rounded-[6px] divide-y-2 divide-[var(--gray-100)]">
        <div
          onClick={() => navigate('/mypage')}
          className="text-[14px] font-bold flex items-center justify-center w-full h-1/2 cursor-pointer hover:bg-[var(--red)]"
        >
          마이페이지
        </div>
        <div
          onClick={logout}
          className="text-[14px] font-bold flex items-center justify-center w-full h-1/2 cursor-pointer hover:bg-[var(--red)]"
        >
          로그아웃
        </div>
      </div>
    </>
  )
}
