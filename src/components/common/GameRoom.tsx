import iconLock from '../../assets/images/icon_lock.svg';

type GameRoomProps = {
  status: string;
  name: string;
  password?: string;
  players: number;
};

export default function GameRoom({
  status,
  name,
  password,
  players,
}: GameRoomProps) {
  return (
    <>
      <div className="w-[520px] h-[61px] bg-[var(--white)] rounded-[6px] font-semibold text-[18.3px] flex items-center gap-[145.5px] px-[30px] py-[18px] relative border-2 border-[var(--black)] cursor-pointer hover:bg-[var(--grey-100)]/15">
        {status === 'WAITING' ? (
          <div className="text-[var(--blue)]">대기중</div>
        ) : (
          <div className="text-[var(--red)]">게임중</div>
        )}
        {password && (
          <img
            src={iconLock}
            alt="자물쇠"
            className="absolute top-[19px] left-[93px] w-[16.5px] h-[19.95px]"
          />
        )}
        <div className="">{name}</div>
        <div className="font-medium opacity-60">{players}/4</div>
      </div>
    </>
  );
}
