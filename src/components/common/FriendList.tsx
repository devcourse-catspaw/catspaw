import { useNavigate } from 'react-router-dom'
import icon_accept from '../../assets/images/icon_accept.svg'
import icon_cancel from '../../assets/images/icon_cancel.svg'
import supabase from '../../utils/supabase'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

type FriendListProps = {
  userId: string
  userCharacter: string
  userName: string
  type?: 'sent' | 'received'
  status?: string
  onStatusChange?: () => void
}

export default function FriendList({
  userId,
  userCharacter,
  userName,
  type,
  status,
  onStatusChange,
}: FriendListProps) {
  const characterUrl = `${
    import.meta.env.VITE_SUPABASE_URL
  }/storage/v1/object/public/avatar-image/${userCharacter}`

  const [isLoggedUser, setIsLoggedUser] = useState<string>()

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const { data, error } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .single()

      if (!error) {
        setIsLoggedUser(data.id)
      }
    }

    fetchUser()
  }, [])

  const navigate = useNavigate()

  const handleNavigate = () => {
    if (userId !== isLoggedUser) {
      navigate(`/user/${userId}`)
    } else navigate('/mypage')
  }

  const handleAccept = async () => {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      toast('사용자 인증 오류')
      return
    }

    const { error } = await supabase
      .from('friend_requests')
      .update({ status: 'accepted' })
      .eq('sender_id', userId)
      .eq('receiver_id', user.id)
      .eq('status', 'pending')

    if (error) {
      console.error(error)
      toast('친구 요청 수락 중 에러 발생')
    } else {
      toast('친구 요청을 수락했어요!')
      onStatusChange?.()
    }
  }

  const handleReject = async () => {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      toast('사용자 인증 오류')
      return
    }

    const { error } = await supabase
      .from('friend_requests')
      .update({ status: 'rejected' })
      .eq('sender_id', userId)
      .eq('receiver_id', user.id)
      .eq('status', 'pending')

    if (error) {
      console.error(error)
      toast('친구 요청 거절 중 에러 발생')
    } else {
      toast('친구 요청을 거절했어요!')
      onStatusChange?.()
    }
  }
  return (
    <>
      <div className="w-full h-[57px] flex justify-between items-center px-[16px] py-[8px]">
        <div
          onClick={handleNavigate}
          className="flex gap-[10px] items-center cursor-pointer"
        >
          <img src={characterUrl} alt="userCharacter" className="size-[35px]" />
          <span className="font-semibold text-[16px]">{userName}</span>
        </div>
        {type === 'received' && (
          <div className="w-[54px] h-[24px] flex gap-[8px] items-center">
            <img
              src={icon_accept}
              alt="accept icon"
              onClick={handleAccept}
              className="cursor-pointer"
            />
            <img
              src={icon_cancel}
              alt="cancel icon"
              onClick={handleReject}
              className="cursor-pointer"
            />
          </div>
        )}
        {type === 'sent' && (
          <span className="w-[54px] h-[24px] flex justify-center items-center text-[12px] text-[var(--grey-100)]">
            {status}
          </span>
        )}
      </div>
    </>
  )
}
