import { useEffect, useState } from 'react'
import BaseInput from '../common/BaseInput'
import supabase from '../../utils/supabase'
import FriendList from '../common/FriendList'
import type { Database } from '../../types/supabase'

type FriendTable = Database['public']['Tables']['friends']['Row']
type UserTable = Database['public']['Tables']['users']['Row']

type FriendFiltered = {
  id: string
  user_id_1: string
  user_id_2: string
  friend: Pick<
    {
      avatar: string
      created_at: string
      email: string | null
      id: string
      nickname: string
    },
    'id' | 'nickname' | 'avatar'
  >
}

export default function FriendListDiv({ userIdProp }: { userIdProp?: string }) {
  const [userId, setUserId] = useState<string | undefined>(userIdProp)
  const [friends, setFriends] = useState<FriendFiltered[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchUser = async () => {
      if (!userIdProp) {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (user) {
          setUserId(user.id)
        }
      }
    }
    fetchUser()
  }, [userIdProp])

  const fetchFriends = async () => {
    if (!userId) return

    const { data } = (await supabase.from('friends').select(
      `
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
      `
    )) as unknown as {
      data:
        | (FriendTable & {
            user1: Pick<UserTable, 'id' | 'nickname' | 'avatar'>
            user2: Pick<UserTable, 'id' | 'nickname' | 'avatar'>
          })[]
    }
    if (data) {
      const filtered = data
        .filter((f) => f.user_id_1 === userId || f.user_id_2 === userId)
        .map((f) => {
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
    fetchFriends()

    const channel = supabase.channel('friends-realtime')

    channel.on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'friends',
      },
      (payload) => {
        const newRow = payload.new as FriendFiltered
        const oldRow = payload.old as FriendFiltered
        if (
          newRow.user_id_1 === userId ||
          newRow.user_id_2 === userId ||
          oldRow.user_id_1 === userId ||
          oldRow.user_id_2 === userId
        ) {
          console.log('실시간 반영됨:', payload)
          fetchFriends()
        }
      }
    )

    channel.on(
      'postgres_changes',
      {
        event: 'DELETE',
        schema: 'public',
        table: 'friends',
      },
      (payload) => {
        const oldRow = payload.old as FriendFiltered
        if (oldRow.user_id_1 === userId || oldRow.user_id_2 === userId) {
          console.log('Delete 감지됨:', payload)
          fetchFriends()
        }
      }
    )

    channel.subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId])

  const filteredFriends = friends.filter((f) =>
    f.friend?.nickname.toLowerCase().includes(searchTerm.toLowerCase())
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
            userId={friend.friend?.id}
            userCharacter={friend.friend?.avatar}
            userName={friend.friend?.nickname}
          />
        ))}
      </div>
    </>
  )
}
