import deleteIcon from "../../../assets/images/icon_cancel.svg";

export default function ImageBox({ image }: { image: string }) {
  return (
    <div className="relative w-[142px] h-[140px] border-[1px] border-[var(--black)] flex-shrink-0">
      <img
        src={image}
        alt="업로드되는 이미지"
        className="w-[142px] h-[140px] object-cover"
      />
      {/* 업로드 사진 삭제 버튼 */}
      <img
        src={deleteIcon}
        alt="삭제버튼"
        className="absolute top-1 right-1 w-5 h-5 cursor-pointer"
      />
    </div>
  );
}
