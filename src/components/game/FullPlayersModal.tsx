import close from '../../assets/images/icon_close.svg';
import Button from '../common/Button';

export default function FullPlayersModal({
  closeFullPlayersModalHandler,
}: {
  closeFullPlayersModalHandler: () => void;
}) {
  return (
    <>
      <div
        className="fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.5)] flex justify-center items-center z-[1000]"
        onClick={closeFullPlayersModalHandler}
      >
        <div
          className="rounded-[6px] w-[400px] pb-8 flex flex-col gap-10 bg-[var(--white)] border-2 border-[var(--black)]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-end pt-5 pr-6">
            <img
              src={close}
              alt="닫기"
              onClick={closeFullPlayersModalHandler}
              className="cursor-pointer"
            />
          </div>
          <div className="flex flex-col justify-center items-center gap-10">
            <div className="font-semibold text-[18px]">
              인원이 가득 찼습니다.
            </div>
            <Button onClick={closeFullPlayersModalHandler}>확인</Button>
          </div>
        </div>
      </div>
    </>
  );
}
