import { useState } from 'react'
import FriendList from '../common/FriendList'
import SubnavItem from '../common/SubnavItem'
import { useEffect } from 'react'
import supabase from '../../utils/supabase'

export default function FriendRequsetDiv() {
  const [activeTab, setActiveTab] = useState('tab1')
  const [userId, setUserId] = useState<string | null>(null)
  const [requests, setRequests] = useState<any[]>([])

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
    const { data, error } = await supabase
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
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    if (!error) {
      setRequests(data)
    }
  }

  useEffect(() => {
    fetchFriendRequests()
  }, [userId])

  useEffect(() => {
    if (!userId) return
    console.log(userId)
    const receiveChannel = supabase
      .channel('friend-requests')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'friend_requests',
          filter: `receiver_id=eq.${userId}`,
        },
        (payload) => {
          console.log('받은 요청 변경:', payload)
          fetchFriendRequests()
        }
      )
      .subscribe()

    const sendChannel = supabase
      .channel('friend-requests-send')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'friend_requests',
          filter: `sender_id=eq.${userId}`,
        },
        (payload) => {
          console.log('보낸 요청 변경', payload)
          fetchFriendRequests()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(receiveChannel)
      supabase.removeChannel(sendChannel)
    }
  }, [userId])

  return (
    <>
      <div className="flex gap-[21px]">
        <SubnavItem
          active={activeTab === 'tab1'}
          onClick={() => setActiveTab('tab1')}
        >
          보낸신청
        </SubnavItem>
        <SubnavItem
          active={activeTab === 'tab2'}
          onClick={() => setActiveTab('tab2')}
        >
          받은신청
        </SubnavItem>
      </div>
      {activeTab == 'tab1' && (
        <div className="w-full flex flex-col divide-y-1 divide-[var(--grey-100)]">
          {requests
            .filter((r) => r.sender_id === userId)
            .map((req) => (
              <FriendList
                key={req.id}
                userId={req.receiver_id}
                userCharacter={req.receiver?.avatar}
                userName={req.receiver?.nickname}
                status={req.status}
                type="sent" // 예: 보낸 요청이라는 의미로 prop 전달
              />
            ))}
        </div>
      )}
      {activeTab == 'tab2' && (
        <div className="w-full flex flex-col divide-y-1 divide-[var(--grey-100)]">
          {requests
            .filter((r) => r.receiver_id === userId)
            .map((req) => (
              <FriendList
                key={req.id}
                userId={req.sender_id}
                userCharacter={req.sender?.avatar}
                userName={req.sender?.nickname}
                type="received"
              />
            ))}
        </div>
      )}
    </>
  )
}
