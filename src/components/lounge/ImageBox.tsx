import deleteIcon from "../../assets/images/icon_cancel.svg";

type Props = {
  image: string;
  onDelete: () => void;
};
export default function ImageBox({ image, onDelete }: Props) {
  return (
    <div className="relative w-[143px] h-[141px] border-[2px] border-[var(--black)] flex-shrink-0 rounded-[6px]">
      <img
        src={image}
        alt="업로드되는 이미지"
        className="w-[142px] h-[137px] object-cover rounded-[4px]"
      />
      {/* 업로드 사진 삭제 버튼 */}
      <img
        src={deleteIcon}
        alt="삭제버튼"
        className="absolute top-1 right-1 w-5 h-5 cursor-pointer"
        onClick={onDelete}
      />
    </div>
  );
}
