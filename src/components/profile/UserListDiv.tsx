import { useEffect, useState } from 'react'
import BaseInput from '../common/BaseInput'
import FriendList from '../common/FriendList'
import supabase from '../../utils/supabase'

type UserInfo = {
  id: string
  nickname: string
  avatar: string | null
}[]
export default function UserListDiv() {
  const [searchTerm, setSearchTerm] = useState('')
  const [userList, setUserList] = useState<UserInfo>([])

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('id, nickname, avatar, email')
      if (!error && data) {
        const realNameUsers = data.filter((user) => user.email !== null)
        setUserList(realNameUsers)
      }
    }
    fetchUsers()
  }, [])

  const filteredList = userList.filter((user) =>
    user.nickname?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <>
      <BaseInput
        className="w-full h-[40px]"
        placeholder="유저 검색"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="w-full flex flex-col divide-y-1 divide-[var(--grey-100)]">
        {filteredList.map((user) => (
          <FriendList
            key={user.id}
            userId={user.id}
            userCharacter={user.avatar}
            userName={user.nickname}
          />
        ))}
      </div>
    </>
  )
}
