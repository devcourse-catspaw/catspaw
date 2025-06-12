import { useState } from "react";
import Cancel from "../../assets/images/answer_wrong_2.svg?react";
import Ellipsis from "../../assets/images/icon_ellipsis.svg?react";

type WriterType = {
  avatar: string;
  userName: string;
  date: string;
};
const moreTextStyle =
  "text-xs font-normal text-[var(--grey-100)] hover:underline-offset-2 cursor-pointer";

export default function Writer({ avatar, userName, date }: WriterType) {
  const [showMore, setShowMore] = useState(false);
  const handleToggle = () => setShowMore((prev) => !prev);
  return (
    <div className="flex flex-col w-[840px]">
      <div className="flex justify-between items-center pr-6">
        <div className="flex justify-start items-center p-0">
          <img
            className="w-[41px] mr-[5px] color-[var(--black)]"
            src={avatar}
            alt="프로필 사진"
          />
          <div className="flex flex-col justify-center">
            <span className="font-bold text-base mr-[16px]">{userName}</span>
            <span className="font-medium text-xs text-[var(--black)]">
              {date}
            </span>
          </div>
        </div>
        {/* 더보기 토글 */}
        <div>
          {showMore ? (
            <div className="flex items-center gap-x-2">
              <div className="flex gap-x-1">
                <span className={moreTextStyle}>수정</span>
                <span className={moreTextStyle}>|</span>
                <span className={moreTextStyle}>삭제</span>
              </div>
              <span>
                <Cancel
                  className="w-[8px] cursor-pointer text-[var(--grey-100)]"
                  onClick={() => setShowMore(false)}
                />
              </span>
            </div>
          ) : (
            <span
              onClick={handleToggle}
              className="cursor-pointer text-[var(--black)] inline-flex items-center">
              <Ellipsis className="w-[16px] h-[16px] fill-current" />
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
