import pawPencil from "../../../assets/images/paw_pencil_big.svg";
import doodle from "../../../assets/images/doodle_loading.svg";

export default function BackgroundDecorations() {
  return (
    <>
      <img
        src={pawPencil}
        alt="paw pencil 이미지"
        className="fixed bottom-25 right-0"
      />
      <img
        src={doodle}
        alt="그림 이미지"
        className="fixed bottom-[-60px] right-[26px] rotate-150 -z-10"
      />
    </>
  );
}
