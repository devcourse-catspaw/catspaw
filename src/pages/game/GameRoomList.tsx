import { useEffect, useState } from 'react';
import SubnavItem from '../../components/common/SubnavItem';
import Button from '../../components/common/Button';
import GameRoom, { type GameRoomProps } from '../../components/common/GameRoom';
import pawPencil from '../../assets/images/paw_pencil_big.svg';
import doodle from '../../assets/images/doodle_loading.svg';
import CreateRoomModal from '../../components/game/CreateRoomModal';
import NavWithExit from '../../components/common/NavWithExit';
import supabase from '../../utils/supabase';
import GameRoomSkeleton from '../../components/game/GameRoomSkeleton';

export default function GameRoomList() {
  const [isLoading, setIsLoading] = useState(true);
  const [gameRooms, setGameRooms] = useState<GameRoomProps[]>([]);
  const [isActive, setIsActive] = useState([true, false, false]);
  const [isCreateRoomModalOpen, setIsCreateRoomModalOpen] = useState(false);

  const clickButtonHandler = () => {
    setIsCreateRoomModalOpen(true);
  };

  const closeCreateRoomModalHandler = () => {
    setIsCreateRoomModalOpen(false);
  };

  const clickSubnavHandler = (index: number) => {
    const newArr = [false, false, false];
    for (let i = 0; i < newArr.length; i++) {
      if (i === index) newArr[i] = true;
    }
    setIsActive(newArr);
  };

  const getFilteringlist = (activeArr: boolean[]): GameRoomProps[] => {
    if (activeArr[1]) {
      return gameRooms.filter((v) => v.status === 'WAITING');
    } else if (activeArr[2]) {
      return gameRooms.filter((v) => v.status === 'PLAYING');
    }
    return gameRooms;
  };

  const getGameRoomList = async () => {
    try {
      const { data } = await supabase
        .from('games')
        .select(
          `
            *
          `
        )
        .order('created_at', { ascending: false });
      if (data) {
        setGameRooms(data);
        setIsLoading(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    getGameRoomList();

    const channel = supabase
      .channel('change_games')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'games',
        },
        (payload) => {
          console.log(payload);
          setGameRooms((prevGames) => {
            const { eventType, new: newGame, old: oldGame } = payload;

            switch (eventType) {
              case 'INSERT':
                return [newGame as GameRoomProps, ...prevGames];
              case 'UPDATE':
                return prevGames.map((game) =>
                  game.id === (newGame as GameRoomProps).id
                    ? (newGame as GameRoomProps)
                    : game
                );
              case 'DELETE':
                return prevGames.filter(
                  (game) => game.id !== (oldGame as GameRoomProps).id
                );
              default:
                return prevGames;
            }
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="w-full min-h-screen flex flex-col items-center px-20 pt-[14px] relative">
      <NavWithExit />
      <div className="flex flex-col items-center gap-[34px]">
        <div>
          <SubnavItem
            active={isActive[0]}
            onClick={() => clickSubnavHandler(0)}
          >
            전체
          </SubnavItem>
          <SubnavItem
            active={isActive[1]}
            onClick={() => clickSubnavHandler(1)}
          >
            대기중
          </SubnavItem>
          <SubnavItem
            active={isActive[2]}
            onClick={() => clickSubnavHandler(2)}
          >
            게임중
          </SubnavItem>
        </div>
        <div className="flex flex-col gap-3 h-[calc(100dvh-282px)] w-[520px] overflow-hidden">
          <div className="flex justify-end">
            <Button
              onClick={clickButtonHandler}
              className="text-[16px] w-[100px] h-[36px] px-[18px]"
            >
              방 만들기
            </Button>
          </div>
          {isLoading ? (
            Array.from({ length: 10 }).map((_, i) => (
              <GameRoomSkeleton key={i} />
            ))
          ) : (
            <>
              {getFilteringlist(isActive) &&
              getFilteringlist(isActive).length !== 0 ? (
                <div className="flex flex-col gap-1 overflow-y-auto scroll-custom">
                  {getFilteringlist(isActive).map((data) => (
                    <GameRoom key={data.id} {...data} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col justify-center items-center gap-5 text-lg font-semibold w-full h-full pb-10">
                  <div>현재 입장 가능한 게임방이 없습니다!</div>
                  <div>새로운 방을 만들어 보세요!</div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <img
        src={pawPencil}
        alt="paw pencil 이미지"
        className="fixed bottom-25 right-0 -z-10"
      />
      <img
        src={doodle}
        alt="그림 이미지"
        className="fixed bottom-[-60px] right-[26px] rotate-150 -z-10"
      />
      {isCreateRoomModalOpen && (
        <CreateRoomModal
          closeCreateRoomModalHandler={closeCreateRoomModalHandler}
        />
      )}
    </div>
  );
}
