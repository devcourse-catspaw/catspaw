import logo_catpaw from '../../assets/images/logo_catpaw.svg'
import logo_typo from '../../assets/images/logo_typo.svg'
import Button from './Button'
import { useAuthStore } from '../../stores/authStore'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import supabase from '../../utils/supabase'
import { useEffect, useRef, useState } from 'react'
import NavBarDropBox from './NavBarDropBox'

export default function NavBar() {
  const { user } = useAuthStore()
  const [avatarUrl, setAvatarUrl] = useState<string>()
  const navigate = useNavigate()
  const location = useLocation()
  const { id: userIdFromParams } = useParams()
  const [userNickname, setUserNickname] = useState('')
  const [isDropBox, setIsDropBox] = useState(false)
  const dropBoxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchNickname = async () => {
      if (location.pathname.startsWith('/user/') && userIdFromParams) {
        const { data, error } = await supabase
          .from('users')
          .select('nickname')
          .eq('id', userIdFromParams)
          .single()
        if (!error && data) setUserNickname(data.nickname)
      }
    }
    fetchNickname()
  }, [location.pathname, userIdFromParams])

  useEffect(() => {
    const fetchAvatar = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('users')
          .select('avatar')
          .eq('id', user.id)
          .single()

        if (!error && data?.avatar) {
          setAvatarUrl(
            `${
              import.meta.env.VITE_SUPABASE_URL
            }/storage/v1/object/public/avatar-image/${data.avatar}`
          )
        }
      }
    }

    fetchAvatar()
  }, [user])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropBoxRef.current && !dropBoxRef.current.contains(event.target)) {
        setIsDropBox(false)
      }
    }

    if (isDropBox) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropBox])

  return (
    <>
      <div className="w-full px-[80px] py-[14px] flex justify-between items-center">
        <div className="flex items-center gap-[10px]">
          <img
            onClick={() => navigate('/')}
            src={logo_catpaw}
            alt="cat's paw logo"
            className="size-[60px] cursor-pointer"
          />

          {location.pathname === '/' && (
            <img
              onClick={() => navigate('/')}
              src={logo_typo}
              alt="logo text"
              className="h-[56px] cursor-pointer"
            />
          )}
          {location.pathname === '/mypage' && (
            <span className="text-[18px] font-semibold">마이 페이지</span>
          )}
          {location.pathname.startsWith('/user/') && userNickname && (
            <span className="text-[18px] font-semibold">
              {userNickname}님의 페이지
            </span>
          )}
        </div>
        <div className="flex items-center gap-[12px]">
          <Button
            onClick={() => navigate('/lounge')}
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
            <div className="relative" ref={dropBoxRef}>
              <img
                src={avatarUrl}
                onClick={() => setIsDropBox((prev) => !prev)}
                className="size-[50px] cursor-pointer mt-[5px] ml-[20px] rounded-full object-cover"
              />
              {isDropBox && (
                <div className="absolute right-0 mt-[10px] z-50">
                  <NavBarDropBox />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
