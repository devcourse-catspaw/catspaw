import kisu from '../../assets/images/kisu_.svg';
import Crown from '../..//assets/images/crown.svg?react';

type WaitingRoomProps = {
  avatar?: string;
  name: string;
  isReady?: boolean;
  isLeader: boolean;
};

export default function WaitingRoom({
  avatar,
  name,
  isReady,
  isLeader,
}: WaitingRoomProps) {
  return (
    <>
      <div className="w-[321px] h-[77px] px-7 bg-[var(--white)] flex justify-between items-center text-[16px] font-bold rounded-md border-2 border-[var(--black)]">
        <div className="flex items-center gap-[7px]">
          <img
            src={avatar ? avatar : kisu}
            alt="캐릭터"
            className="w-[49px] h-[49px]"
          />
          <div className="flex items-center gap-[7px] w-[140px]">
            <div className="truncate">{name}</div>
            {isLeader && <Crown className="w-[18px] h-[15px] text-[#F4EC5A]" />}
          </div>
        </div>
        {!isLeader &&
          (isReady ? (
            <div className="text-[var(--blue)] w-[50px]">READY</div>
          ) : (
            <div className="text-[var(--red)] w-[60px]">waiting</div>
          ))}
      </div>
    </>
  );
}
