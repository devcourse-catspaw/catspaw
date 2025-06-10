import { useState } from "react";
import ellipsis from "../../assets/images/icon_ellipsis.svg";
import Cancel from "../../assets/images/answer_wrong.svg?react";
import cancel from "../../assets/images/answer_wrong.svg";

type WriterType = {
  avatar: string;
  userName: string;
  date: string;
};
const moreTextStyle =
  "text-xs font-normal text-[var(--grey-100)] hover:underline-offset-2 cursor-pointer";

export default function Writer({ avatar, userName, date }: WriterType) {
  const [showMore, setShowMore] = useState(false);
  const handleToggle = () => {
    if (!showMore) {
      setShowMore(true);
    }
  };
  return (
    <div className="flex flex-col w-[840px] h-[50px]">
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
        <div onClick={handleToggle}>
          {showMore ? (
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <span className={moreTextStyle}>수정</span>
                <span className={moreTextStyle}>|</span>
                <span className={moreTextStyle}>삭제</span>
              </div>
              <span>
                {/* <img
                  className="w-[12px] cursor-pointer text-[var(--grey-100)]"
                  src={cancel}
                  alt="취소"
                /> */}
                <Cancel
                  className="inline w-[12px] cursor-pointer text-[var(--grey-100)] fill-current"
                  onClick={handleToggle}
                />
              </span>
            </div>
          ) : (
            <img className="color-[var(--black)]" src={ellipsis} alt="더보기" />
          )}
        </div>
      </div>
    </div>
  );
}
