import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/swiper-bundle.css'
import PostCard from '../common/PostCard'
import supabase from '../../utils/supabase'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

type HotPostType = {
  id: number
  title: string
  content: string
  created_at: string
  updated_at: string
  user_id: string
  images: string[] | null
  likeCount: number
  commentCount: number
  users: {
    nickname: string
    avatar: string | null
  }
}

export default function HotPost() {
  const [hotPosts, setHotPosts] = useState<HotPostType[]>([])
  useEffect(() => {
    const fetchHotPosts = async () => {
      const { data, error } = await supabase.from('posts').select(`
          *,
          users (
            nickname,
            avatar
          ),
          likes(count),
          comments(count)
        `)

      if (error) {
        toast.error('인기 게시글 불러오기 실패')
        console.log(error)
        return
      }

      const sorted = data
        .map((post) => ({
          ...post,
          likeCount: post.likes?.[0]?.count || 0,
          commentCount: post.comments?.[0]?.count || 0,
        }))
        .sort((a, b) => {
          if (b.likeCount !== a.likeCount) {
            return b.likeCount - a.likeCount
          } else {
            return b.commentCount - a.commentCount
          }
        })
        .slice(0, 8)

      setHotPosts(sorted)
    }

    fetchHotPosts()
  }, [])

  return (
    <>
      <Swiper
        slidesPerView={4}
        spaceBetween={30}
        centeredSlides={true}
        centeredSlidesBounds={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        navigation={false}
        modules={[Autoplay, Pagination, Navigation]}
        className="w-full flex justify-center"
      >
        {hotPosts?.map((post) => {
          return (
            <SwiperSlide>
              <PostCard
                postId={post.id}
                postTitle={post.title}
                date={post.created_at.slice(0, 10)}
                contents={post.content}
                userName={post.users?.nickname}
                image={post.images?.[0]}
                likeCount={post.likeCount}
                isLiked={false}
                avatar={`${
                  import.meta.env.VITE_SUPABASE_URL
                }/storage/v1/object/public/avatar-image/${post.users?.avatar}`}
                springImg="no"
              />
            </SwiperSlide>
          )
        })}
      </Swiper>
    </>
  )
}
