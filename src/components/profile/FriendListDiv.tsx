import { useEffect, useState } from 'react'
import BaseInput from '../common/BaseInput'
import supabase from '../../utils/supabase'
import FriendList from '../common/FriendList'

type FriendRow = {
  id: number
  user_id_1: string
  user_id_2: string
  friend: UserSummary
}
type UserSummary = {
  id: string
  nickname: string
  avatar: string
}

export default function FriendListDiv() {
  const [userId, setUserId] = useState<string | null>(null)
  const [friends, setFriends] = useState<FriendRow[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
      }
    }
    fetchUser()
  }, [])

  const fetchFriends = async () => {
    if (!userId) return

    const { data, error } = await supabase.from('friends').select(`
        id,
        user_id_1,
        user_id_2,
        created_at,
        user1:user_id_1 (
          id,
          nickname,
          avatar
        ),
        user2:user_id_2 (
          id,
          nickname,
          avatar
        )
      `)

    if (!error && data) {
      const filtered = data
        .filter((f: any) => f.user_id_1 === userId || f.user_id_2 === userId)
        .map((f: any) => {
          const isUser1 = f.user_id_1 === userId
          const friendInfo = isUser1 ? f.user2 : f.user1
          return {
            id: f.id,
            user_id_1: f.user_id_1,
            user_id_2: f.user_id_2,
            friend: friendInfo,
          }
        })
      setFriends(filtered)
    }
  }

  useEffect(() => {
    console.log('🟢 friends 업데이트됨:', friends)
  }, [friends])

  useEffect(() => {
    if (!userId) return

    fetchFriends()

    const channel = supabase
      .channel('friends-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'friends',
          filter: `user_id_1=eq.${userId},user_id_2=eq.${userId}`,
        },
        (payload) => {
          console.log('친구 목록 실시간 변경:', payload)

          fetchFriends()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId])

  const filteredFriends = friends.filter((f) =>
    f.friend.nickname.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <>
      <BaseInput
        className="w-full h-[40px]"
        placeholder="친구 검색"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="w-full flex flex-col divide-y-1 divide-[var(--grey-100)]">
        {filteredFriends.map((friend) => (
          <FriendList
            key={friend.id}
            userId={friend.friend.id}
            userCharacter={friend.friend.avatar}
            userName={friend.friend.nickname}
          />
        ))}
      </div>
    </>
  )
}
