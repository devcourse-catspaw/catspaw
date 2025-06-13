import { useState } from "react";
import BaseInput from "../common/BaseInput";
import Cancel from "../../assets/images/answer_wrong_2.svg?react";
import Ellipsis from "../../assets/images/icon_ellipsis.svg?react";
import { twMerge } from "tailwind-merge";

type CommentCardProps = {
  id: number;
  userName: string;
  avatar: string;
  date: string;
  comment: string;
  onDelete: (id: number) => void;
};
const moreTextStyle =
  "text-xs font-normal text-[var(--grey-100)] hover:underline-offset-2 cursor-pointer";

export default function CommentCard({
  id,
  userName,
  avatar,
  date,
  comment,
  onDelete,
}: CommentCardProps) {
  const [showMore, setShowMore] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [commentText, setCommentText] = useState(comment);
  const [editValue, setEditValue] = useState(comment);

  const handleToggle = () => {
    setShowMore((prev) => !prev);
  };

  //수정
  const handleEditClick = () => {
    setIsEditing(true);
    setShowMore(false);
  };

  // 수정 완료/취소
  const handleComplete = () => {
    setCommentText(editValue);
    setIsEditing(false);
  };
  // 더보기 및 수정 취소
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditValue(commentText);
  };
  return (
    <div className="flex flex-col w-[840px] px-[20px] py-[12px]">
      <div className="flex justify-between items-center">
        <div className="flex justify-start items-center">
          <img
            className="w-[41px] mr-[10px] color-[var(--black)]"
            src={avatar}
            alt="프로필 사진"
          />
          <span className="font-semibold text-base mr-[16px] ">{userName}</span>
          <span className="font-medium text-xs text-[var(--grey-100)]">
            {date}
          </span>
        </div>

        {/* 더보기 토글 */}
        <div>
          {!showMore && !isEditing && (
            <span
              onClick={handleToggle}
              className="cursor-pointer text-[var(--black)] inline-flex items-center">
              <Ellipsis className="w-[16px] h-[16px] fill-current" />
            </span>
          )}
          {showMore && !isEditing && (
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <span className={moreTextStyle} onClick={handleEditClick}>
                  수정
                </span>
                <span className={moreTextStyle}>|</span>
                <span className={moreTextStyle} onClick={() => onDelete(id)}>
                  삭제
                </span>
              </div>
              <span>
                <Cancel
                  className="inline w-[8px] cursor-pointer text-[var(--grey-100)]"
                  onClick={() => setShowMore(false)}
                />
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 댓글 내용 & 댓글 수정 입력칸 */}
      {isEditing ? (
        <div className="flex pl-[51px] justify-between items-center">
          <BaseInput
            className="w-[609px] h-[26px] text-sm font-medium  border-[1px] border-[var(--grey-100)] "
            placeholder="댓글을 입력해주세요."
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
          />
          <div className="flex justify-center items-center gap-2">
            <span
              className={twMerge(moreTextStyle, "cursor-pointer")}
              onClick={handleComplete}>
              완료
            </span>
            <span className="cursor-pointer" onClick={handleCancelEdit}>
              <Cancel className="w-[8px]  text-[var(--grey-100)]" />
            </span>
          </div>
        </div>
      ) : (
        <div className="pl-[51px] w-[660px] min-h-[32px]  flex items-center font-medium text-sm overflow-wrap">
          {comment}
        </div>
      )}
    </div>
  );
}
