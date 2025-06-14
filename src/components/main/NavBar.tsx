import logo_catpaw from '../../assets/images/logo_catpaw.svg'
import logo_typo from '../../assets/images/logo_typo.svg'
import Button from '../common/Button'
import { useAuthStore } from '../../stores/authStore'
import { useNavigate } from 'react-router-dom'
import kisu from '../../assets/images/kisu_.svg'
import supabase from '../../utils/supabase'
import toast from 'react-hot-toast'

export default function NavBar() {
  const { user, setUser } = useAuthStore()
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
      <div className="w-full px-[80px] py-[14px] flex justify-between items-center">
        <div className="flex items-center gap-[10px]">
          <img src={logo_catpaw} alt="cat's paw logo" className="size-[60px]" />
          <img src={logo_typo} alt="logo text" className="h-[56px]" />
        </div>
        <div className="flex items-center gap-[12px]">
          <Button
            onClick={() => navigate('/')}
            className="w-[140px] h-[38px] text-[14px]"
          >
            Lounge
          </Button>
          {!user && (
            <Button
              onClick={() => navigate('/login')}
              className="w-[140px] h-[38px] text-[14px] px-[27px]"
            >
              Join to Draw
            </Button>
          )}
          {user && (
            <img
              src={kisu}
              onClick={logout}
              className="size-[50px] cursor-pointer mt-[5px] ml-[20px]"
            />
          )}
        </div>
      </div>
    </>
  )
}
