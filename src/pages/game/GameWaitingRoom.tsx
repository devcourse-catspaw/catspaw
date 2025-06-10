import logo from '../../assets/images/logo_catpaw.svg';
import exit from '../../assets/images/icon_exit.svg';
import bgmYes from '../../assets/images/icon_sound_bgm_yes.svg';
import bgmNo from '../../assets/images/icon_sound_bgm_no.svg';
import effectYes from '../../assets/images/icon_sound_effect_yes.svg';
import effectNo from '../../assets/images/icon_sound_effect_no.svg';
import send from '../../assets/images/icon_send.svg';
import { useState } from 'react';
import Button from '../../components/common/Button';
import pawPencil from '../../assets/images/paw_pencil.svg';
import doodle from '../../assets/images/doodle_loading.svg';
import WaitingRoom from '../../components/common/WaitingRoom';
import BaseInput from '../../components/common/BaseInput';
import ChatMessage from '../../components/common/ChatMessage';

export default function GameWaitingRoom() {
  const [isPlayingEffect, setIsPlayingEffect] = useState(true);
  const [isPlayingBgm, setIsPlayingBgm] = useState(true);

  const clickEffectHandler = () => {
    setIsPlayingEffect(!isPlayingEffect);
  };

  const clickBgmHandler = () => {
    setIsPlayingBgm(!isPlayingBgm);
  };

  return (
    <div className="w-full h-full">
      <nav className="flex justify-between items-center px-20 py-[14px]">
        <img src={logo} alt="로고" className="w-15 h-15 cursor-pointer" />
        <img
          src={exit}
          alt="나가기"
          className="w-[41px] h-[41px] cursor-pointer"
        />
      </nav>
      <div className="flex justify-center items-center gap-[56px] px-[138px]">
        <div className="flex flex-col items-center gap-[23px] w-[321px]">
          <div className="flex flex-col gap-[14px]">
            <WaitingRoom name="유yubin123" isLeader={true} />
            <WaitingRoom name="유빈유빈유빈유빈" />
            <WaitingRoom name="Yubinnnnnn" isReady={true} />
            <WaitingRoom name="유빈" />
          </div>
          <div
            className="w-[256px] h-[3px] rounded-full"
            style={{
              backgroundImage:
                'repeating-linear-gradient(to right, black 0 12px, transparent 12px 24px)',
            }}
          ></div>
          <Button className="text-[28px] w-[320px] h-[82px] bg-[var(--blue)]">
            Ready
          </Button>
          <Button className="text-[28px] w-[320px] h-[82px]">Exit</Button>
        </div>
        <div className="flex flex-col w-[627px] bg-[var(--white)] rounded-[6px] border-2 border-[var(--black)] shadow-[0_4px_4px_rgba(0,0,0,0.25)] overflow-hidden">
          <div className="h-15 font-bold text-[18px] flex justify-center items-center">
            채팅
          </div>
          <div className="h-[416px] flex flex-col gap-2 px-7 py-5 border-y-2 border-[var(--black)] overflow-y-auto">
            <ChatMessage
              userName="유코딩"
              message="안녕하세욥!"
              isMine={false}
              size="large"
            />
            <ChatMessage
              userName="유코딩"
              message="그림 잘 그리세요? 사실 전 그림 못 그리는 사람과는 하고 싶지 않거든요"
              isMine={false}
              size="large"
            />
            <ChatMessage
              userName="Yubin"
              message="네"
              isMine={true}
              size="large"
            />
            <ChatMessage
              userName="유코딩"
              message="ㅎㅎ"
              isMine={false}
              size="large"
            />
            <ChatMessage
              userName="Yubin"
              message="네네네네네네네네ㅔㄴ네네네ㅔㄴ네ㅔㅔ네네ㅔ네네네네네ㅔ네"
              isMine={true}
              size="large"
            />
            <ChatMessage
              userName="Yubin"
              message="네네네ㅔㄴ네네ㅔㅔ네ㅔ네네ㅔ네ㅔ"
              isMine={true}
              size="large"
            />
          </div>
          <div className="flex justify-between gap-[10px] px-5 py-5">
            <BaseInput placeholder="메시지 입력" className="text-[14px]" />
            <Button className="w-[66px] h-[50px] px-[18px]">
              <img src={send} alt="전송" className="w-[29px] h-[29px]"></img>
            </Button>
          </div>
        </div>
      </div>
      <div className="absolute left-20 bottom-[50px] flex flex-col gap-[10px]">
        <img
          src={isPlayingBgm ? bgmYes : bgmNo}
          alt="배경음악"
          onClick={clickBgmHandler}
          className="w-[21px] h-[21px] cursor-pointer"
        />
        <img
          src={isPlayingEffect ? effectYes : effectNo}
          alt="효과음"
          onClick={clickEffectHandler}
          className="w-6 h-6 cursor-pointer"
        />
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
    </div>
  );
}
