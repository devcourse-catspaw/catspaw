import { useState } from "react";
import like from "../../assets/images/icon_like.svg";
import likeFilled from "../../assets/images/icon_like_filled.svg";
import { twMerge } from "tailwind-merge";
import { useAuthStore } from "../../stores/authStore";
import { addLike, removeLike } from "../../routes/loader/post.loader";

type ContentsType = {
  title: string;
  content: string;
  isLiked: boolean;
  likeCount: number;
  commentsCount: number;
  postId: number;
  images?: string[];
};

export default function Contents({
  title,
  content,
  isLiked,
  likeCount,
  commentsCount,
  postId,
  images,
}: ContentsType) {
  const user = useAuthStore((state) => state.user);

  const [liked, setLiked] = useState(isLiked);
  const [count, setCount] = useState(likeCount);

  // 좋아요 핸들러
  const handleLikeClick = async (postId: number) => {
    if (!user) return;

    if (liked) {
      await removeLike(postId, user.id);
    } else {
      await addLike(postId, user.id);
    }

    setLiked((prev) => !prev);
    setCount((prev) => prev + (liked ? -1 : +1));
  };

  const likeCountStyle = "text-[var(--black)] text-sm font-bold";

  return (
    <>
      <div className="flex flex-col gap-[80px]">
        {/* title + content */}
        <div className="w-[840px] flex flex-col px-[16px] gap-[24px]">
          <div className="w-[808px] h-[25px] text-xl font-bold">{title}</div>
          <ul>
            {images &&
              images.map((img) => (
                <li key={img}>
                  {" "}
                  <img src={img} alt="" />
                </li>
              ))}
          </ul>
          <div className="w-[808px] font-medium text-sm overflow-wrap">
            {content}
          </div>
        </div>

        {/* 좋아요 클릭+좋아요 수 / 댓글 수  */}
        <div className="w-[840px] h-[25px] px-4 flex justify-between">
          <div className="w-[52px] flex gap-[10px]">
            <img
              className="w-[24px] h-[24px] cursor-pointer"
              src={liked ? likeFilled : like}
              alt={liked ? "좋아요 취소" : "좋아요"}
              onClick={() => handleLikeClick(postId)}
            />
            <span className={twMerge(likeCountStyle)}>{count}</span>
          </div>
          <span className={twMerge(likeCountStyle)}>
            {commentsCount}개의 댓글
          </span>
        </div>
      </div>
    </>
  );
}
