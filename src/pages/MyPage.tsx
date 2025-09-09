import icon_change_profile from '../assets/images/icon_change_profile.svg'
import icon_pencil from '../assets/images/icon_pencil.svg'
import PostList from '../components/common/PostList'
import { useCallback, useEffect, useRef, useState } from 'react'
import MyPageCharacterModal from '../components/profile/MyPageCharacterModal'
import MyPageNameModal from '../components/profile/MyPageNameModal'
import TabButton from '../components/profile/TabButton'
import FriendListDiv from '../components/profile/FriendListDiv'
import FriendRequestDiv from '../components/profile/FriendRequestDiv'
import supabase from '../utils/supabase.ts'
import UserListDiv from '../components/profile/UserListDiv.tsx'
import NavBar from '../components/common/NavBar.tsx'
import Doodle1 from '../assets/images/doodle_small1.svg?react'
import Doodle2 from '../assets/images/doodle_small2.svg?react'
import Doodle3 from '../assets/images/doodle_small7.svg?react'
import Doodle4 from '../assets/images/doodle_small4.svg?react'
import Doodle5 from '../assets/images/doodle_small5.svg?react'
import Doodle6 from '../assets/images/doodle_small6.svg?react'

export default function MyPage() {
  type UserInfo = {
    id: string
    nickname: string
    avatar: string
    email: string | null
  }
  type PostInfo = {
    id: number
    title: string
    created_at: string
    comments: { count: number }[]
  }

  const [user, setUser] = useState<UserInfo | null>(null)
  const [postList, setPostList] = useState<PostInfo[]>([])
  const [isCharacterModalOpen, setIsCharacterModalOpen] = useState(false)
  const [isNameModalOpen, setIsNameModalOpen] = useState(false)
  const [selectedCharacter, setSelectedCharacter] = useState<string>()
  const [changedName, setChangedName] = useState<string>()
  const [activeTab, setActiveTab] = useState('tab1')
  const avatarUrl = selectedCharacter
    ? `${
        import.meta.env.VITE_SUPABASE_URL
      }/storage/v1/object/public/avatar-image/${selectedCharacter}`
    : user?.avatar
    ? `${import.meta.env.VITE_SUPABASE_URL}/
storage/v1/object/public/avatar-image/${user.avatar}`
    : ''

  const [page, setPage] = useState(0)
  const pageSize = 6
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const observerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const { data, error } = await supabase
        .from('users')
        .select('id, nickname, avatar, email')
        .eq('id', user.id)
        .single()

      if (!error) {
        setUser(data)
      }
    }

    fetchUser()
  }, [])

  const handleCharacterChange = async (selectedImageName: string) => {
    if (!user) return

    const { error } = await supabase
      .from('users')
      .update({ avatar: selectedImageName })
      .eq('id', user.id)

    if (error) {
      console.error('캐릭터 업데이트 실패:', error)
      return
    }
    setSelectedCharacter(selectedImageName)

    setUser((prev) => prev && { ...prev, avatar: selectedImageName })
  }

  const handleNameChange = async (newName: string) => {
    if (!user) return

    const { error } = await supabase
      .from('users')
      .update({ nickname: newName })
      .eq('id', user.id)

    if (error) {
      console.error('닉네임 업데이트 실패:', error)
      return
    }

    setChangedName(newName)
    setUser((prev) => prev && { ...prev, nickname: newName })
  }

  const loadMorePosts = useCallback(async () => {
    if (isLoading || !hasMore || !user) return
    setIsLoading(true)

    const { data, error } = await supabase
      .from('posts')
      .select('id, title, created_at, comments(count)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(page * pageSize, page * pageSize + pageSize - 1)

    if (error) {
      console.error('게시글 로딩 오류:', error)
      setIsLoading(false)
      return
    }

    if (data.length === 0) {
      console.log('게시글 없음')
      setHasMore(false)
      setIsLoading(false)
      return
    }

    if (data.length < pageSize) {
      setHasMore(false)
    }

    setPostList((prev) => {
      const existingIds = new Set(prev.map((p) => p.id))
      const filtered = data.filter((post) => !existingIds.has(post.id))
      return [...prev, ...filtered]
    })
    setPage((prev) => prev + 1)
    setIsLoading(false)
  }, [isLoading, hasMore, page, user])

  useEffect(() => {
    if (!observerRef.current || !hasMore || !user) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadMorePosts()
        }
      },
      { root: document.querySelector('#scrollableDiv'), threshold: 0.1 }
    )

    observer.observe(observerRef.current)
    return () => observer.disconnect()
  }, [loadMorePosts, hasMore, user])

  return (
    <>
      {isCharacterModalOpen && (
        <MyPageCharacterModal
          onSubmit={handleCharacterChange}
          onClose={() => setIsCharacterModalOpen(false)}
        />
      )}
      {isNameModalOpen && (
        <MyPageNameModal
          onSubmit={handleNameChange}
          onClose={() => setIsNameModalOpen(false)}
        />
      )}
      <div className="w-screen h-screen flex flex-col">
        <NavBar />
        <div className="relative flex-1 flex justify-center items-center">
          <Doodle1 className="absolute left-[24px] bottom-[20px] w-[152px] text-gray-300 -z-10" />
          <Doodle2 className="absolute left-[80px] top-[10px] w-[152px] rotate-[-34deg]  text-gray-300 -z-10" />
          <Doodle3 className="absolute bottom-[50px] left-1/2 -translate-x-[240px] w-[152px] rotate-[55deg] -z-10 text-gray-300" />
          <Doodle4 className="absolute top-[-30px] right-[115px] w-[152px]  text-gray-300 -z-10" />
          <Doodle5 className="absolute right-1 bottom-[68px] w-[152px] text-gray-300 -z-10" />
          <Doodle6 className="absolute top-[-90px] left-1/2 -translate-x-[100px] w-[152px] rotate-[55deg] -z-10 text-gray-300" />
          <div className="flex gap-[37px] items-end mx-auto">
            <div className="flex flex-col gap-0 items-end bg-white">
              <div className="flex gap-0 items-end pr-[4px]">
                <TabButton
                  isActive={activeTab === 'tab1'}
                  onClick={() => setActiveTab('tab1')}
                >
                  친구목록
                </TabButton>
                <TabButton
                  isActive={activeTab === 'tab2'}
                  onClick={() => setActiveTab('tab2')}
                >
                  친구신청
                </TabButton>
                <TabButton
                  isActive={activeTab === 'tab3'}
                  onClick={() => setActiveTab('tab3')}
                >
                  유저목록
                </TabButton>
              </div>
              <div className="flex flex-col gap-[27px] items-center px-[15px] py-[26px] w-[287px] h-[565px] border-2 rounded-[6px] overflow-y-auto overflow-x-hidden">
                {activeTab == 'tab1' && <FriendListDiv />}
                {activeTab == 'tab2' && <FriendRequestDiv />}
                {activeTab == 'tab3' && <UserListDiv />}
              </div>
            </div>
            <div className=" flex flex-col gap-[29px] px-[30px] py-[39px] w-[728px] h-[570px] border-2 rounded-[6px] bg-white">
              <div className="flex items-center gap-[17px]">
                <div className="relative ">
                  <img
                    className="size-[92px]"
                    src={avatarUrl}
                    alt="character"
                  />
                  <img
                    onClick={() => setIsCharacterModalOpen(true)}
                    className="absolute bottom-[6px] left-[70px] size-[17px] cursor-pointer"
                    src={icon_change_profile}
                    alt="change character icon"
                  />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-[8px]">
                    <span className="font-semibold text-[18px]">
                      {changedName ?? user?.nickname}
                    </span>
                    <img
                      onClick={() => setIsNameModalOpen(true)}
                      className="size-[14px] cursor-pointer"
                      src={icon_pencil}
                      alt="icon_pencil"
                    />
                  </div>
                  <span className="font-medium text-[12px] text-[var(--grey-100)]">
                    {user?.email}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-0 overflow-hidden flex-1">
                <TabButton>게시글</TabButton>
                <div
                  id="scrollableDiv"
                  className="flex-1 min-h-0 border-t-2 w-full divide-y divide-[var(--grey-100)] overflow-y-auto"
                >
                  {postList.map((post) => (
                    <PostList
                      key={post.id}
                      postId={post.id}
                      postTitle={post.title}
                      comments={post.comments?.[0]?.count ?? 0}
                      date={post.created_at}
                    />
                  ))}
                  {hasMore && <div ref={observerRef} className="h-[1px]" />}
                  {!hasMore && (
                    <p className="text-center text-sm py-2 text-gray-400">
                      모든 게시글을 불러왔습니다
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
