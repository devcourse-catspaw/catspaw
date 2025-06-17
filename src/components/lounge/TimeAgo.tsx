import { twMerge } from "tailwind-merge";

interface TimeAgoProps {
  timestamp: string | number | Date;
  className?: string;
}
const dateStyle =
  " text-end min-w-[46px] text-[var(--grey-100)] text-xs  font-medium"; // 기본 폰트 클래스

// 사용법: <TimeAgo timestamp={post.created_at /> props로 api를 통해 받은 created_at을 넘겨준다
// api 예시 created_at: "2021-10-15T20:48:19.816Z",
export default function TimeAgo({
  timestamp,
  className, // 생성 날짜
}: TimeAgoProps) {
  const now = new Date();
  const time = new Date(timestamp);
  const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return <span className={dateStyle}>{`${diffInSeconds}초 전`}</span>;
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return <span className={dateStyle}>{`${diffInMinutes}분 전`}</span>;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return <span className={dateStyle}>{`${diffInHours}시간 전`}</span>;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 2) {
    return <span className={dateStyle}>{`${diffInDays}일 전`}</span>;
  }

  // 1일 이상일 때는 년월일 출력
  const year = time.getFullYear();
  const yearStr = String(year);
  const shortYear = yearStr.slice(-2);
  const month = time.getMonth() + 1;
  const day = time.getDate();

  return <span className={dateStyle}>{`${shortYear}. ${month}. ${day}`}</span>;
}
