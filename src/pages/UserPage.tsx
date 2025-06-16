import { useNavigate } from 'react-router-dom'
import logo_catpaw from '../assets/images/logo_catpaw.svg'
import BaseInput from '../components/common/BaseInput'
import FriendList from '../components/common/FriendList'
import kisu from '../assets/images/kisu_.svg'
import icon_pencil from '../assets/images/icon_pencil.svg'
import PostList from '../components/common/PostList'
import TabButton from '../components/profile/TabButton'
export default function UserPage() {
  const navigate = useNavigate()
  return (
    <>
      <div className="flex flex-col gap-[20px] px-[80px] pt-[32px] w-[100vw] h-[100vh]">
        <div className="flex items-center gap-[28px]">
          <img
            onClick={() => navigate('/')}
            className="size-[87px] cursor-pointer"
            src={logo_catpaw}
            alt="logo_catpaw"
          />
          <span className="text-[18px] font-semibold">마이 페이지</span>
        </div>
        <div className="flex gap-[37px] mx-auto">
          <div className="flex flex-col gap-[27px] items-center px-[15px] py-[26px] w-[287px] h-[565px] border-2 rounded-[6px]">
            <BaseInput className="w-full h-[40px]" placeholder="친구 검색" />
            <div className="w-full flex flex-col divide-y-1 divide-[var(--grey-100)]">
              <FriendList />
              <FriendList />
              <FriendList />
            </div>
          </div>
          <div className=" flex flex-col gap-[29px] px-[30px] py-[39px] w-[728px] h-[570px] border-2 rounded-[6px]">
            <div className="flex items-center">
              <img className="size-[92px]" src={kisu} alt="character" />
              <div className="flex flex-col">
                <div className="flex items-center gap-[8px]">
                  <span className="font-semibold text-[18px]">user name</span>
                  <img
                    className="size-[14px] cursor-pointer"
                    src={icon_pencil}
                    alt="icon_pencil"
                  />
                </div>
                <span className="font-medium text-[12px] text-[var(--grey-100)]">
                  user email
                </span>
              </div>
            </div>
            <TabButton>게시글</TabButton>
            <div className="border-t-2 w-full divide-y divide-[var(--grey-100)]">
              <PostList />
              <PostList />
              <PostList />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
