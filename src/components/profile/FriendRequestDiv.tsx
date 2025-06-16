import { useState } from 'react'
import FriendList from '../common/FriendList'
import SubnavItem from '../common/SubnavItem'

export default function FriendRequsetDiv() {
  const [activeTab, setActiveTab] = useState('tab1')
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
          <FriendList />
          <FriendList />
          <FriendList />
        </div>
      )}
      {activeTab == 'tab2' && (
        <div className="w-full flex flex-col divide-y-1 divide-[var(--grey-100)]">
          <FriendList request />
          <FriendList request />
          <FriendList request />
        </div>
      )}
    </>
  )
}
