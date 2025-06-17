import { useCallback, useState } from 'react';
import iconLock from '../../assets/images/icon_lock.svg';
import FullPlayersModal from '../game/FullPlayersModal';
import PlayingModal from '../game/PlayingModal';
import RoomPasswordModal from '../game/RoomPasswordModal';
import { useNavigate } from 'react-router-dom';
import supabase from '../../utils/supabase';
import { useAuthStore } from '../../stores/authStore';
import type { Database } from '../../types/supabase';
import { useGameRoomStore } from '../../stores/gameRoomStore';
import { debounce } from 'lodash';

export type GameRoomProps = Database['public']['Tables']['games']['Row'];

export default function GameRoom({
  id,
  status,
  room_name,
  room_password,
  current_players,
}: GameRoomProps) {
  const navigate = useNavigate();

  const { user } = useAuthStore();

  // const [disabled, setDisabled] = useState(false);
  const [isFullPlayersModalOpen, setIsFullPlayersModalOpen] = useState(false);
  const [isPlayingModalOpen, setIsPlayingModalOpen] = useState(false);
  const [isRoomPasswordModalOpen, setIsRoomPasswordModalOpen] = useState(false);

  // // const clickHandler = async () => {
  // const clickHandler = () => {
  //   // if (disabled) return;

  //   // setDisabled(true);
  //   if (status === 'PLAYING') {
  //     setIsPlayingModalOpen(true);
  //     return;
  //   }
  //   if (current_players >= 4) {
  //     setIsFullPlayersModalOpen(true);
  //     return;
  //   }
  //   if (room_password) {
  //     setIsRoomPasswordModalOpen(true);
  //     return;
  //   }

  //   dataHandler();
  //   // setTimeout(() => setDisabled(false), 500);
  // };

  const clickHandler = useCallback(
    debounce(() => {
      if (status === 'PLAYING') {
        setIsPlayingModalOpen(true);
        return;
      }
      if (current_players >= 4) {
        setIsFullPlayersModalOpen(true);
        return;
      }
      if (room_password) {
        setIsRoomPasswordModalOpen(true);
        return;
      }

      dataHandler();
    }, 500),
    [status, current_players, room_password, user]
  );

  const dataHandler = async () => {
    if (!user) {
      console.log('사용자 정보 없음');
      return;
    }
    const { data: dataP, error } = await supabase
      .from('players')
      .insert([
        {
          game_id: id,
          user_id: user?.id,
          is_ready: false,
          is_leader: false,
        },
      ])
      .select();

    if (dataP) {
      useGameRoomStore.getState().setPlayer(dataP[0]);
      // console.log(
      //   'useGameRoomStore Player:',
      //   useGameRoomStore.getState().player
      // );

      const { data: dataG, error } = await supabase
        .from('games')
        .update({
          current_players: current_players + 1,
        })
        .eq('id', id)
        .select();

      if (dataG) {
        // console.log('인원 수 증가 성공! :', dataG);
        // console.log('입장합니다.');

        useGameRoomStore.getState().setGame(dataG[0]);
        // console.log('useGameRoomStore:', useGameRoomStore.getState().game);
        navigate('/game/room');
      }

      if (error) {
        console.log('인원 수 증가 에러가 발생했습니다.');
        console.error('Players count error:', error.message);
      }
    }

    if (error) {
      console.log('에러가 발생했습니다.');
      console.error('Players insert error:', error.message);
    }
  };

  const closeFullPlayersModalHandler = () => {
    setIsFullPlayersModalOpen(false);
  };

  const closePlayingModalHandler = () => {
    setIsPlayingModalOpen(false);
  };

  const closeRoomPasswordModalHandler = () => {
    setIsRoomPasswordModalOpen(false);
  };

  return (
    <>
      <div
        className="w-full h-[61px] bg-[var(--white)] rounded-[6px] font-semibold text-[18px] flex justify-between items-center px-[30px] relative border-2 border-[var(--black)] shrink-0 cursor-pointer hover:bg-[var(--grey-100)]/15"
        onClick={clickHandler}
      >
        {status === 'WAITING' ? (
          <div className="text-[var(--blue)] w-[70px]">대기중</div>
        ) : (
          <div className="text-[var(--red)] w-[70px]">게임중</div>
        )}
        {room_password && (
          <img
            src={iconLock}
            alt="자물쇠"
            className="absolute top-[19px] left-[93px] w-[16px] h-[19px]"
          />
        )}
        <div className="w-[200px] text-center truncate">{room_name}</div>
        <div className="w-[70px] text-right font-medium opacity-60">
          {current_players}/4
        </div>
      </div>
      {isFullPlayersModalOpen && (
        <FullPlayersModal
          closeFullPlayersModalHandler={closeFullPlayersModalHandler}
        />
      )}
      {isPlayingModalOpen && (
        <PlayingModal closePlayingModalHandler={closePlayingModalHandler} />
      )}
      {isRoomPasswordModalOpen && (
        <RoomPasswordModal
          password={room_password}
          dataHandler={dataHandler}
          closeRoomPasswordModalHandler={closeRoomPasswordModalHandler}
        />
      )}
    </>
  );
}
