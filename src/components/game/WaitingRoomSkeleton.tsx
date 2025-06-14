export default function WaitingRoomSkeleton() {
  return (
    <>
      <div className="w-full h-[77px] px-7 bg-[var(--white)] flex justify-between items-center text-[16px] font-bold rounded-md border-2 border-[var(--black)] animate-pulse">
        <div className="flex items-center gap-[7px]">
          <div className="w-[49px] h-[49px] flex items-center">
            <div className="w-[40px] h-[40px] rounded-[50%] bg-gray-200"></div>
          </div>
          <div className="w-[140px] h-[20px]">
            <div className="w-[100px] h-[20px] rounded bg-gray-200"></div>
          </div>
        </div>
        <div className="w-[60px] h-[20px] rounded bg-gray-200"></div>
      </div>
    </>
  );
}
