export default function RoomPasswordModal({
  closeRoomPasswordModalHanlder,
}: {
  closeRoomPasswordModalHanlder: () => void;
}) {
  return (
    <>
      <div
        className="fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.5)] flex justify-center items-center z-[1000]"
        onClick={closeRoomPasswordModalHanlder}
      >
        <div
          className="rounded-[6.1px] text-center w-[519px] h-[251px] flex flex-col justify-center gap-10 bg-[var(--white)] border-2 border-[var(--black)]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="font-semibold text-[22px]">
            게임방의 비밀번호를 입력해주세요.
          </div>
        </div>
      </div>
    </>
  );
}
