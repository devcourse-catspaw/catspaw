export default function GameRoomSkeleton() {
  return (
    <>
      <div className="w-full h-[61px] bg-[var(--white)] rounded-[6px] flex justify-between items-center px-[30px] border-2 border-[var(--black)] shrink-0 animate-pulse">
        <div className="w-[50px] h-[20px] rounded bg-gray-200"></div>
        <div className="w-[200px] h-[20px] rounded bg-gray-200"></div>
        <div className="w-[50px] h-[20px] rounded bg-gray-200"></div>
      </div>
    </>
  );
}
