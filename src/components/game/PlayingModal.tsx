import close from '../../assets/images/icon_close.svg';
import Button from '../common/Button';

export default function PlayingModal({
  closePlayingModalHandler,
}: {
  closePlayingModalHandler: () => void;
}) {
  return (
    <>
      <div
        className="fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.5)] flex justify-center items-center z-[1000]"
        onClick={closePlayingModalHandler}
      >
        <div
          className="rounded-[6px] w-[400px] pb-8 flex flex-col gap-10 bg-[var(--white)] border-2 border-[var(--black)]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-end pt-5 pr-6">
            <img
              src={close}
              alt="닫기"
              onClick={closePlayingModalHandler}
              className="cursor-pointer"
            />
          </div>
          <div className="flex flex-col justify-center items-center gap-10">
            <div className="font-semibold text-[18px]">
              이미 게임 중인 방입니다.
            </div>
            <Button onClick={closePlayingModalHandler}>확인</Button>
          </div>
        </div>
      </div>
    </>
  );
}
