interface TimeAgoProps {
  timestamp: string | number | Date;
}

// 사용법: <TimeAgo timestamp={post.created_at /> props로 api를 통해 받은 created_at을 넘겨준다
// api 예시 created_at: "2021-10-15T20:48:19.816Z",
export default function TimeAgo({
  timestamp, // 생성 날짜
}: TimeAgoProps) {
  const now = new Date();
  const time = new Date(timestamp);
  const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000);

  const dateStyle = "text-[var(--grey-100)] text-xs  font-medium"; // 기본 폰트 클래스

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

  // 7일 이상일 때는 년월일 출력
  const year = time.getFullYear();
  const month = time.getMonth() + 1;
  const day = time.getDate();

  return <span className={dateStyle}>{`${year}년 ${month}월 ${day}일`}</span>;
}
