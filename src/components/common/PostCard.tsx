import { twMerge } from "tailwind-merge";
import spring from "../../assets/images/spring_small.svg";
import like from "../../assets/images/icon_like.svg";
import likeFilled from "../../assets/images/icon_like_filled.svg";
import thumbnail from "../../assets/images/post_default_thumbnail.svg";
import kisu from "../../assets/images/kisu_.svg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type PostCardProps = {
  postId: string;
  postTitle: string;
  date: string;
  contents: string;
  userName: string;
  image?: string;
  likeCount: number;
  isLiked?: boolean;
  avatar?: string;
  springImg: "yes" | "no";
};
export default function PostCard({
  postId,
  postTitle,
  date,
  contents,
  userName,
  image,
  likeCount,
  isLiked,
  avatar,
  springImg,
}: PostCardProps) {
  const [liked, setLiked] = useState(isLiked);
  const [count, setCount] = useState(likeCount);
  const navigate = useNavigate();

  //CHECK
  const goToDetail = () => {
    navigate(`/lounge/${postId}`);
    console.log("go to");
  };

  // 좋아요 핸들러
  const handleLikeClick = () => {
    setLiked((prev) => !prev);
    setCount((prev) => prev + (liked ? -1 : +1));
  };

  const cardLayout =
    "w-[240px] h-[324px] border-[3px] border-[var(--black)] shadow-[0px_7px_0px_var(--black)] rounded-[11px] flex";
  const titleStyle =
    "text-[var(--black)]  text-base font-bold block w-100% overflow-hidden overflow-ellipsis whitespace-nowrap";
  const contentStyle =
    "text-[var(--black)] text-sm font-medium block w-100% overflow-hidden overflow-ellipsis whitespace-nowrap";
  const dateStyle = "text-[var(--grey-100)] text-xs  font-medium";
  const likeCountStyle = "text-[var(--black)] text-sm font-bold";
  return (
    <>
      <div className="relative leading-[24px] overflow-visible">
        {springImg === "yes" && (
          <img
            className="absolute -top-3  z-10"
            src={spring}
            alt="스케치북 스프링"
          />
        )}
        <div className={twMerge(cardLayout)}>
          {/* 카드 이미지 */}
          <div
            className="w-[240px] h-[200px] justify-center items-center flex pt-4 cursor-pointer"
            onClick={goToDetail}>
            {image ? (
              <img
                className="w-[208px] h-[150px] object-cover"
                src={image}
                alt=""
              />
            ) : (
              <img src={thumbnail} alt="기본썸네일" />
            )}
          </div>

          {/* 이미지 하단 정보 : 제목, 날짜, 내용, 유저프로필, 유저 이름, 좋아요 버튼, 좋아요수  */}
          <div className="w-[240px] h-[124px] border-t-[2px] border-[var(--black)] rounded-b-[11px] absolute -bottom-1 left-0 z-10 p-4 flex flex-col gap-2">
            {/* 제목, 날짜 */}
            <div
              className="flex w-full justify-between items-center gap-1 cursor-pointer"
              onClick={goToDetail}>
              <span className={twMerge(titleStyle)}>{postTitle}</span>
              <span className={dateStyle}>{date}</span>
            </div>
            {/* 내용 */}
            <div className="flex">
              <div
                className={twMerge(contentStyle, "cursor-pointer")}
                onClick={goToDetail}>
                {contents}
              </div>
            </div>
            {/* 프로필 사진 + 유저 이름 */}
            <div className="flex justify-between">
              <div className="flex justify-between items-center">
                <img
                  className="w-[32px]"
                  src={avatar || kisu}
                  alt="프로필사진"
                />
                <span className={contentStyle}>{userName}</span>
              </div>
              {/* 좋아요 */}
              <div className="flex gap-1 items-center">
                <img
                  className="w-6 h-6 cursor-pointer"
                  src={liked ? likeFilled : like}
                  alt={liked ? "좋아요 취소" : "좋아요"}
                  onClick={handleLikeClick}
                />
                <span className={likeCountStyle}>{count}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
