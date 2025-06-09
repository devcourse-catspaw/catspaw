type WriterType = {
  avatar: string;
  userName: string;
  date: string;
};

export default function Writer({ avatar, userName, date }: WriterType) {
  return (
    <div>
      {/* 이미지 */}
      <div>
        <img src="" alt="" />
      </div>
      {/* 유저네임, 작성일자 */}
      <div></div>
      {/* ellipsis 수정, 삭제 */}
      <div></div>
    </div>
  );
}
