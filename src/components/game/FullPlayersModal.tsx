export default function FullPlayersModal({
  closeFullPlayersModalHanlder,
}: {
  closeFullPlayersModalHanlder: () => void;
}) {
  return (
    <>
      <div
        className="fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.5)] flex justify-center items-center z-[1000]"
        onClick={closeFullPlayersModalHanlder}
      >
        <div
          className="rounded-[6.1px] text-center w-[400px] h-[300px] flex flex-col justify-center gap-10 bg-[var(--white)] border-2 border-[var(--black)]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="font-semibold text-[22px]">인원이 가득 찼습니다.</div>
        </div>
      </div>
    </>
  );
}
