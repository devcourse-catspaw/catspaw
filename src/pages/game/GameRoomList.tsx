import { useState } from 'react';
import SubnavItem from '../../components/common/SubnavItem';
import Button from '../../components/common/Button';
import GameRoom from '../../components/common/GameRoom';
import pawPencil from '../../assets/images/paw_pencil_big.svg';
import doodle from '../../assets/images/doodle_loading.svg';
import CreateRoomModal from '../../components/game/CreateRoomModal';
import NavWithExit from '../../components/common/NavWithExit';

interface propsDataType {
  status: string;
  name: string;
  password: string;
  players: number;
}

export default function GameRoomList() {
  const [isActive, setIsActive] = useState([true, false, false]);
  const [isCreateRoomModalOpen, setIsCreateRoomModalOpen] = useState(false);

  const clickButtonHandler = () => {
    setIsCreateRoomModalOpen(true);
  };

  const clickSubnavHandler = (index: number) => {
    const newArr = [false, false, false];
    for (let i = 0; i < newArr.length; i++) {
      if (i === index) newArr[i] = true;
    }
    setIsActive(newArr);
  };

  const getFilteringlist = (activeArr: boolean[]): propsDataType[] => {
    if (activeArr[1]) {
      return propsData.filter((v) => v.status === 'WAITING');
    } else if (activeArr[2]) {
      return propsData.filter((v) => v.status === 'PLAYING');
    }
    return propsData;
  };

  const closeCreateRoomModalHandler = () => {
    setIsCreateRoomModalOpen(false);
  };

  const propsData = [
    {
      status: 'WAITING',
      name: '같이 할 사람 있나?',
      password: '1',
      players: 1,
    },
    {
      status: 'PLAYING',
      name: '드루오삼',
      password: '',
      players: 4,
    },
    {
      status: 'PLAYING',
      name: 'ㄱㄱ',
      password: '1234',
      players: 2,
    },
    {
      status: 'WAITING',
      name: '다른 사람이 알아볼 정도는 그려야 함',
      password: 'gsdfs',
      players: 4,
    },
    {
      status: 'WAITING',
      name: '못 그려도 ㄱㅊ',
      password: '',
      players: 4,
    },
    {
      status: 'PLAYING',
      name: 'ㄱㄱ',
      password: '1234',
      players: 2,
    },
    {
      status: 'WAITING',
      name: '다른 사람이 알아볼 정도는 그려야 함',
      password: 'gsdfs',
      players: 4,
    },
    {
      status: 'WAITING',
      name: '못 그려도 ㄱㅊ',
      password: '',
      players: 4,
    },
    {
      status: 'PLAYING',
      name: 'ㄱㄱ',
      password: '1234',
      players: 2,
    },
    {
      status: 'WAITING',
      name: '다른 사람이 알아볼 정도는 그려야 함',
      password: 'gsdfs',
      players: 4,
    },
    {
      status: 'WAITING',
      name: '못 그려도 ㄱㅊ',
      password: '',
      players: 4,
    },
  ];

  return (
    // <div className="w-full h-full">
    <div className="w-full min-h-screen flex flex-col items-center px-20 pt-[14px] relative">
      {/* <nav className="flex justify-between items-center px-20 py-[14px]">
        <img src={logo} alt="로고" className="w-15 h-15 cursor-pointer" />
        <img
          src={exit}
          alt="나가기"
          className="w-[41px] h-[41px] cursor-pointer"
        />
      </nav> */}
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
          <div className="flex flex-col gap-1 overflow-y-auto scroll-custom">
            {getFilteringlist(isActive).map((data) => (
              <GameRoom
                // key={data.id}
                status={data.status}
                name={data.name}
                password={data.password}
                players={data.players}
              />
            ))}
          </div>
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
