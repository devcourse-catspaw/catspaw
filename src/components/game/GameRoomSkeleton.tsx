export default function GameRoomSkeleton() {
  return (
    <>
      <div className="w-full h-[61px] bg-[var(--white)] rounded-[6px] font-semibold text-[18px] flex justify-between items-center px-[30px] relative border-2 border-[var(--black)] shrink-0 cursor-pointer hover:bg-[var(--grey-100)]/15 animate-pulse">
        <div className="w-[50px] h-[20px] rounded bg-gray-200"></div>
        <div className="w-[200px] h-[20px] rounded bg-gray-200"></div>
        <div className="w-[50px] h-[20px] rounded bg-gray-200"></div>
      </div>
    </>
  );
}
