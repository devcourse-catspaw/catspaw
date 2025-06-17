import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/swiper-bundle.css'
import PostCard from '../common/PostCard'

export default function HotPost() {
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
        <SwiperSlide>
          <PostCard
            postId={1234}
            postTitle="테스트용 post 카드"
            date="2025.06.28"
            contents="내뇽내ㅛㅇ내ㅛㅇ내요내ㅛㅇㅇㄴ"
            userName="예빈테스트"
            likeCount={0}
            isLiked
            springImg="no"
          />
        </SwiperSlide>
        <SwiperSlide>
          <PostCard
            postId={1234}
            postTitle="테스트용 post 카드"
            date="2025.06.28"
            contents="내뇽내ㅛㅇ내ㅛㅇ내요내ㅛㅇㅇㄴ"
            userName="예빈테스트"
            likeCount={0}
            isLiked
            springImg="no"
          />
        </SwiperSlide>
        <SwiperSlide>
          <PostCard
            postId={1234}
            postTitle="테스트용 post 카드"
            date="2025.06.28"
            contents="내뇽내ㅛㅇ내ㅛㅇ내요내ㅛㅇㅇㄴ"
            userName="예빈테스트"
            likeCount={0}
            isLiked
            springImg="no"
          />
        </SwiperSlide>
        <SwiperSlide>
          <PostCard
            postId={1234}
            postTitle="테스트용 post 카드"
            date="2025.06.28"
            contents="내뇽내ㅛㅇ내ㅛㅇ내요내ㅛㅇㅇㄴ"
            userName="예빈테스트"
            likeCount={0}
            isLiked
            springImg="no"
          />
        </SwiperSlide>
        <SwiperSlide>
          <PostCard
            postId={1234}
            postTitle="테스트용 post 카드"
            date="2025.06.28"
            contents="내뇽내ㅛㅇ내ㅛㅇ내요내ㅛㅇㅇㄴ"
            userName="예빈테스트"
            likeCount={0}
            isLiked
            springImg="no"
          />
        </SwiperSlide>
        <SwiperSlide>
          <PostCard
            postId={1234}
            postTitle="테스트용 post 카드"
            date="2025.06.28"
            contents="내뇽내ㅛㅇ내ㅛㅇ내요내ㅛㅇㅇㄴ"
            userName="예빈테스트"
            likeCount={0}
            isLiked
            springImg="no"
          />
        </SwiperSlide>
        <SwiperSlide>
          <PostCard
            postId={1234}
            postTitle="테스트용 post 카드"
            date="2025.06.28"
            contents="내뇽내ㅛㅇ내ㅛㅇ내요내ㅛㅇㅇㄴ"
            userName="예빈테스트"
            likeCount={0}
            isLiked
            springImg="no"
          />
        </SwiperSlide>
        <SwiperSlide>
          <PostCard
            postId={1234}
            postTitle="테스트용 post 카드"
            date="2025.06.28"
            contents="내뇽내ㅛㅇ내ㅛㅇ내요내ㅛㅇㅇㄴ"
            userName="예빈테스트"
            likeCount={0}
            isLiked
            springImg="no"
          />
        </SwiperSlide>
      </Swiper>
    </>
  )
}
