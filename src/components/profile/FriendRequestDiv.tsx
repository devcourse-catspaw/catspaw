import { useState } from 'react'
import FriendList from '../common/FriendList'
import SubnavItem from '../common/SubnavItem'
import { useEffect } from 'react'
import supabase from '../../utils/supabase'
import type { Database } from '../../types/supabase'

type UserTable = Database['public']['Tables']['users']['Row']
type FriendRequestsTable =
  Database['public']['Tables']['friend_requests']['Row']

type FriendRequest = {
  created_at: string | null
  id: string
  receiver_id: string
  sender_id: string
  status: string
} & {
  sender: Pick<UserTable, 'id' | 'nickname' | 'avatar'>
  receiver: Pick<UserTable, 'id' | 'nickname' | 'avatar'>
}

export default function FriendRequestDiv() {
  const [activeTab, setActiveTab] = useState('tab1')
  const [userId, setUserId] = useState<string>()
  const [requests, setRequests] = useState<FriendRequest[]>([])

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

  const fetchFriendRequests = async () => {
    if (!userId) return
    const { data } = (await supabase
      .from('friend_requests')
      .select(
        `
        id,
        sender_id,
        receiver_id,
        status,
        sender:sender_id (
          id,
          nickname,
          avatar
        ),
        receiver:receiver_id (
          id,
          nickname,
          avatar
        )
      `
      )
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)) as unknown as {
      data:
        | (FriendRequestsTable & {
            sender: Pick<UserTable, 'id' | 'nickname' | 'avatar'>
            receiver: Pick<UserTable, 'id' | 'nickname' | 'avatar'>
          })[]
    }
    if (data) {
      setRequests(data)
    }
  }

  useEffect(() => {
    fetchFriendRequests()
  }, [userId])

  useEffect(() => {
    if (!userId) return

    const channel = supabase
      .channel('friend-requests-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'friend_requests',
        },
        (payload) => {
          const newRow = payload.new as FriendRequest
          const oldRow = payload.old as FriendRequest
          if (
            newRow.sender.id === userId ||
            newRow.receiver.id === userId ||
            oldRow.sender.id === userId ||
            oldRow.receiver.id === userId
          ) {
            console.log('요청 변경 감지됨:', payload)
            fetchFriendRequests()
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId])

  return (
    <>
      <div className="flex gap-[21px]">
        <SubnavItem
          active={activeTab === 'tab1'}
          onClick={() => setActiveTab('tab1')}
          className="mx-0 border-0 text-[14px] w-[50px]"
        >
          보낸신청
        </SubnavItem>
        <SubnavItem
          active={activeTab === 'tab2'}
          onClick={() => setActiveTab('tab2')}
          className="mx-0 border-0 text-[14px] w-[50px]"
        >
          받은신청
        </SubnavItem>
      </div>
      {activeTab == 'tab1' && (
        <div className="w-full flex flex-col divide-y-1 divide-[var(--grey-100)]">
          {requests
            .filter((r) => r.sender.id === userId)
            .map((req) => (
              <FriendList
                key={req.id}
                userId={req.receiver?.id}
                userCharacter={req.receiver?.avatar}
                userName={req.receiver?.nickname}
                status={req.status}
                type="sent"
              />
            ))}
        </div>
      )}
      {activeTab == 'tab2' && (
        <div className="w-full flex flex-col divide-y-1 divide-[var(--grey-100)]">
          {requests
            .filter((r) => r.receiver.id === userId)
            .map((req) => (
              <FriendList
                key={req.id}
                userId={req.sender.id}
                userCharacter={req.sender.avatar}
                userName={req.sender.nickname}
                type="received"
                onStatusChange={fetchFriendRequests}
              />
            ))}
        </div>
      )}
    </>
  )
}
