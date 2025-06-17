import { useNavigate, useParams } from 'react-router-dom'
import logo_catpaw from '../assets/images/logo_catpaw.svg'
import PostList from '../components/common/PostList'
import TabButton from '../components/profile/TabButton'
import { useCallback, useEffect, useRef, useState } from 'react'
import supabase from '../utils/supabase'
import FriendListDiv from '../components/profile/FriendListDiv'
import Button from '../components/common/Button'
import toast from 'react-hot-toast'
import UserListDiv from '../components/profile/UserListDiv'

type UserInfo = {
  id: string
  nickname: string
  email: string | null
  avatar: string | null
}
type PostInfo = {
  id: number
  title: string
  created_at: string
  comments: { count: number }[]
}

type FriendRequestStatus = 'none' | 'pending' | 'accepted' | 'rejected'

export default function UserPage() {
  const { id: userIdFromParams } = useParams<{ id: string | undefined }>()
  const [userInfo, setUserInfo] = useState<UserInfo>()
  const [character, setCharacter] = useState<string | null>(null)
  const [postList, setPostList] = useState<PostInfo[]>([])
  const [friendRequestStatus, setFriendRequestStatus] =
    useState<FriendRequestStatus>('none')
  const navigate = useNavigate()
  const characterUrl = `${
    import.meta.env.VITE_SUPABASE_URL
  }/storage/v1/object/public/avatar-image/${character}`

  const [page, setPage] = useState(0)
  const pageSize = 6
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const observerRef = useRef<HTMLDivElement | null>(null)

  const [activeTab, setActiveTab] = useState('tab1')

  useEffect(() => {
    setUserInfo(undefined)
    setCharacter(null)
    setPostList([])
    setPage(0)
    setHasMore(true)

    const fetchUserInfo = async () => {
      if (!userIdFromParams) return
      const { data, error } = await supabase
        .from('users')
        .select('id, nickname, email, avatar')
        .eq('id', userIdFromParams)
        .single()

      if (!error) {
        setUserInfo(data)
        setCharacter(data.avatar)
      }
    }

    if (userIdFromParams) {
      fetchUserInfo()
    }
  }, [userIdFromParams])

  const loadMorePosts = useCallback(async () => {
    if (isLoading || !hasMore || !userInfo) return
    setIsLoading(true)

    const { data, error } = await supabase
      .from('posts')
      .select('id, title, created_at, comments(count)')
      .eq('user_id', userInfo.id)
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
  }, [isLoading, hasMore, page, userInfo])

  useEffect(() => {
    if (!observerRef.current || !hasMore || !userInfo) return
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
  }, [loadMorePosts, hasMore, userInfo])

  const handleFriendRequest = async () => {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user || !userIdFromParams) {
      toast('요청 실패')
      return
    }

    if (friendRequestStatus === 'accepted') {
      const { error } = await supabase
        .from('friends')
        .delete()
        .or(
          `and(user_id_1.eq.${user.id},user_id_2.eq.${userIdFromParams}),and(user_id_1.eq.${userIdFromParams},user_id_2.eq.${user.id})`
        )

      if (!error) {
        setFriendRequestStatus('none')
        toast('친구를 끊었습니다.')
      }
      return
    }

    const { error } = await supabase.from('friend_requests').insert([
      {
        sender_id: user.id,
        receiver_id: userIdFromParams,
        status: 'pending',
      },
    ])

    if (error) {
      console.error(error)
      toast('친구 요청 실패')
    } else {
      setFriendRequestStatus('pending')
      toast('친구 요청을 보냈습니다!')
    }
  }

  const checkFriendStatus = async (currentUserId: string) => {
    if (!userIdFromParams) return

    const { data: friendsData } = await supabase
      .from('friends')
      .select('*')
      .or(
        `and(user_id_1.eq.${currentUserId},user_id_2.eq.${userIdFromParams}),and(user_id_1.eq.${userIdFromParams},user_id_2.eq.${currentUserId})`
      )

    if (friendsData && friendsData.length > 0) {
      setFriendRequestStatus('accepted')
      return
    }

    const { data: requestData } = await supabase
      .from('friend_requests')
      .select('status')
      .or(
        `and(sender_id.eq.${currentUserId},receiver_id.eq.${userIdFromParams}),and(sender_id.eq.${userIdFromParams},receiver_id.eq.${currentUserId})`
      )
      .limit(1)
      .maybeSingle()

    if (requestData) {
      setFriendRequestStatus(requestData.status as FriendRequestStatus)
    } else {
      setFriendRequestStatus('none')
    }
  }

  useEffect(() => {
    const fetchUserAndCheckStatus = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user && userIdFromParams) {
        checkFriendStatus(user.id)
      }
    }

    fetchUserAndCheckStatus()
  }, [userIdFromParams])

  if (!userInfo) return <div>로딩 중...</div>

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
          <span className="text-[18px] font-semibold">
            {userInfo.nickname}님의 페이지
          </span>
        </div>
        <div className="flex items-end gap-[37px] mx-auto">
          <div className="flex flex-col gap-0 items-end">
            <div className="flex gap-0 items-end">
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
                유저목록
              </TabButton>
            </div>
            <div className="flex flex-col gap-[27px] items-center px-[15px] py-[26px] w-[287px] h-[565px] border-2 rounded-[6px] overflow-y-auto overflow-x-hidden">
              {activeTab == 'tab1' && (
                <FriendListDiv
                  key={`${friendRequestStatus}-${userIdFromParams}`}
                  userIdProp={userIdFromParams}
                />
              )}
              {activeTab == 'tab2' && <UserListDiv />}
            </div>
          </div>
          <div className=" flex flex-col gap-[29px] px-[30px] py-[39px] w-[728px] h-[570px] border-2 rounded-[6px]">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img
                  className="size-[92px]"
                  src={characterUrl}
                  alt="character"
                />
                <div className="flex flex-col">
                  <div className="flex items-center gap-[8px]">
                    <span className="font-semibold text-[18px]">
                      {userInfo.nickname}
                    </span>
                  </div>
                  <span className="font-medium text-[12px] text-[var(--grey-100)]">
                    {userInfo.email}
                  </span>
                </div>
              </div>
              <Button
                className="w-[134px] h-[44px] text-[18px] px-0"
                onClick={handleFriendRequest}
                disabled={friendRequestStatus === 'pending'}
              >
                {
                  {
                    none: '친구신청',
                    pending: '신청됨',
                    accepted: '친구끊기',
                    rejected: '친구신청',
                  }[friendRequestStatus]
                }
              </Button>
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
    </>
  )
}
