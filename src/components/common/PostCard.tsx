import { twMerge } from 'tailwind-merge'
import Spring from '../../assets/images/spring_small.svg?react'
import like from '../../assets/images/icon_like.svg'
import likeFilled from '../../assets/images/icon_like_filled.svg'
import Paw from '../../assets/images/logo_catpaw.svg?react'
import Typo from '../../assets/images/logo_typo_sm.svg?react'
import kisu from '../../assets/images/kisu_.svg'
// import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'
import TimeAgo from '../lounge/TimeAgo'
import { useAuthStore } from '../../stores/authStore'

type PostCardProps = {
  postId: number
  userId: string
  postTitle: string
  date: string
  contents: string
  userName: string
  image?: string
  likeCount: number
  isLiked: boolean
  avatar: string
  springImg: 'yes' | 'no'
  onLike?: () => void
}

const cardLayout =
  'w-[240px] h-[324px] border-[3px] border-[var(--black)] shadow-[0px_7px_0px_var(--black)] bg-[var(--white)] rounded-[11px] flex'
const titleStyle =
  'min-w-[150px] text-[var(--black)] text-base font-bold block w-100% overflow-hidden overflow-ellipsis whitespace-nowrap'
const contentStyle =
  'text-[var(--black)] text-sm font-medium block w-100% overflow-hidden overflow-ellipsis whitespace-nowrap'
const likeCountStyle =
  'text-[var(--black)] text-sm font-bold min-w-[27px] text-center'

export default function PostCard({
  postId,
  userId,
  postTitle,
  date,
  contents,
  userName,
  image,
  likeCount,
  isLiked,
  avatar,
  springImg,
  onLike,
}: PostCardProps) {
  const navigate = useNavigate()
  const loginUser = useAuthStore((state) => state.user)

  const goToDetail = () => {
    navigate(`/lounge/${postId}`)
  }

  const goToUserPage = () => {
    if (userId === loginUser?.id) return navigate('/mypage')
    navigate(`/user/${userId}`)
  }

  return (
    <>
      <div className="relative leading-[24px] overflow-visible">
        {springImg === 'yes' && (
          <Spring className="absolute -top-3  z-10 text-[var(--black)]" />
        )}
        <div className={twMerge(cardLayout)}>
          {/* 카드 이미지 */}
          <div
            className="w-[240px] h-[200px] justify-center items-center flex pt-4 cursor-pointer"
            onClick={goToDetail}
          >
            {image ? (
              <img
                className="w-[208px] h-[150px] object-cover"
                src={image}
                alt="사용자 이미지 섬네일"
              />
            ) : (
              <div className="flex flex-col w-[208px] h-[140px] justify-center items-center">
                <Paw className="w-[84px] text-[var(--black)]" />
                {/* <Typo className="w-[60px] text-[var(--black)]" /> */}
              </div>
            )}
          </div>
          {/* 이미지 하단 정보 : 제목, 날짜, 내용, 유저프로필, 유저 이름, 좋아요 버튼, 좋아요수  */}
          <div className="w-[240px] h-[124px] border-t-[2px] border-[var(--black)] rounded-b-[11px] absolute -bottom-1 left-0 z-10 p-4 flex flex-col gap-2">
            {/* 제목, 날짜 */}
            <div
              className="flex w-full justify-between items-center gap-1 cursor-pointer"
              onClick={goToDetail}
            >
              <span className={twMerge(titleStyle)}>{postTitle}</span>
              <TimeAgo timestamp={date} />
            </div>
            {/* 내용 */}
            <div className="flex">
              <div
                className={twMerge(contentStyle, 'cursor-pointer')}
                onClick={goToDetail}
              >
                {contents}
              </div>
            </div>
            {/* 프로필 사진 + 유저 이름 */}
            <div className="flex justify-between">
              <div
                onClick={goToUserPage}
                className="flex justify-between items-center gap-1 cursor-pointer"
              >
                <img className="w-[28px]" src={avatar} alt="프로필사진" />
                <span className={contentStyle}>{userName}</span>
              </div>
              {/* 좋아요 */}
              <div className="flex gap-1 items-center">
                <img
                  className="w-6 h-6 cursor-pointer"
                  src={isLiked ? likeFilled : like}
                  alt={isLiked ? '좋아요 취소' : '좋아요'}
                  onClick={onLike}
                />

                <span className={likeCountStyle}>{likeCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
