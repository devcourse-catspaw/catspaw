import { useState } from 'react';
import iconLock from '../../assets/images/icon_lock.svg';
import FullPlayersModal from '../game/FullPlayersModal';
import PlayingModal from '../game/PlayingModal';
import RoomPasswordModal from '../game/RoomPasswordModal';

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
  const [isFullPlayersModalOpen, setIsFullPlayersModalOpen] = useState(false);
  const [isPlayingModalOpen, setIsPlayingModalOpen] = useState(false);
  const [isRoomPasswordModalOpen, setIsRoomPasswordModalOpen] = useState(false);

  const clickHandler = () => {
    if (status === 'PLAYING') {
      setIsPlayingModalOpen(true);
      return;
    }
    if (players >= 4) {
      setIsFullPlayersModalOpen(true);
      return;
    }
    if (password) {
      setIsRoomPasswordModalOpen(true);
    }
  };

  const closeFullPlayersModalHanlder = () => {
    setIsFullPlayersModalOpen(false);
  };

  const closePlayingModalHanlder = () => {
    setIsPlayingModalOpen(false);
  };

  const closeRoomPasswordModalHanlder = () => {
    setIsRoomPasswordModalOpen(false);
  };

  return (
    <>
      <div
        className="w-[520px] h-[61px] bg-[var(--white)] rounded-[6px] font-semibold text-[18px] flex justify-between items-center px-[30px] relative border-2 border-[var(--black)] cursor-pointer hover:bg-[var(--grey-100)]/15"
        onClick={clickHandler}
      >
        {status === 'WAITING' ? (
          <div className="text-[var(--blue)] w-[70px]">대기중</div>
        ) : (
          <div className="text-[var(--red)] w-[70px]">게임중</div>
        )}
        {password && (
          <img
            src={iconLock}
            alt="자물쇠"
            className="absolute top-[19px] left-[93px] w-[16px] h-[19px]"
          />
        )}
        <div className="w-[200px] text-center truncate">{name}</div>
        <div className="w-[70px] text-right font-medium opacity-60">
          {players}/4
        </div>
      </div>
      {isFullPlayersModalOpen && (
        <FullPlayersModal
          closeFullPlayersModalHanlder={closeFullPlayersModalHanlder}
        />
      )}
      {isPlayingModalOpen && (
        <PlayingModal closePlayingModalHanlder={closePlayingModalHanlder} />
      )}
      {isRoomPasswordModalOpen && (
        <RoomPasswordModal
          closeRoomPasswordModalHanlder={closeRoomPasswordModalHanlder}
        />
      )}
    </>
  );
}
