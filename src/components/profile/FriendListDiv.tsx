import BaseInput from '../common/BaseInput'
import FriendList from '../common/FriendList'

export default function FriendListDiv() {
  return (
    <>
      <BaseInput className="w-full h-[40px]" placeholder="친구 검색" />
      <div className="w-full flex flex-col divide-y-1 divide-[var(--grey-100)]">
        <FriendList />
        <FriendList />
        <FriendList />
      </div>
    </>
  )
}
