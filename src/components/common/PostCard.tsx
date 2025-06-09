import { twMerge } from "tailwind-merge";
import spring from "../../assets/images/spring_small.svg";
import like from "../../assets/images/icon_like.svg";
import likeFilled from "../../assets/images/icon_like_filled.svg";
import thumbnail from "../../assets/images/post_default_thumbnail.svg";
import kisu from "../../assets/images/kisu_.svg";

type PostCardProps = {
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
  const cardLayout =
    "w-[240px] h-[324px] border-[3px] border-[var(--black)] shadow-[0px_7px_0px_var(--black)] rounded-[11px] flex";
  const titleStyle =
    "text-[var(--black)]  text-base font-bold block w-100% overflow-hidden overflow-ellipsis whitespace-nowrap";
  const contentStyle =
    "text-[var(--black)] text-sm font-medium block w-100% overflow-hidden overflow-ellipsis whitespace-nowrap";
  const dateStyle = "text-[#999999] text-xs  font-medium";
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
          <div className="w-[240px] h-[200px] justify-center items-center flex pt-4">
            {image ? (
              <img
                className="w-[208px] h-[150px] object-cover"
                src={image}
                alt=""
              />
            ) : (
              <img src={thumbnail} alt="기본섬네일" />
            )}
          </div>
          <div className="w-[240px] h-[124px] border-t-[2px] border-[var(--black)] rounded-b-[11px] absolute -bottom-1 left-0 z-10 p-4 flex flex-col gap-2">
            <div className="flex w-full justify-between items-center gap-1">
              <span className={twMerge(titleStyle)}>{postTitle}</span>
              <span className={dateStyle}>{date}</span>
            </div>
            <div className="flex">
              <div className={twMerge(contentStyle)}>{contents}</div>
            </div>
            <div className="flex justify-between">
              <div className="flex justify-between items-center">
                <img
                  className="w-[32px]"
                  src={!avatar ? `${kisu}` : `${avatar}`}
                  alt=""
                />
                <span className={contentStyle}>{userName}</span>
              </div>
              <div className="flex gap-1 items-center">
                <img
                  className="w-6 h-6"
                  src={isLiked ? `${likeFilled}` : `${like}`}
                  alt={isLiked ? "채워진 하트" : "빈 하트"}
                />
                <span className={likeCountStyle}>{likeCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
