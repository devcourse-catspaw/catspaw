import send from '../../assets/images/icon_send.svg';
import Button from '../../components/common/Button';
import WaitingRoom from '../../components/common/WaitingRoom';
import BaseInput from '../../components/common/BaseInput';
import ChatMessage from '../../components/common/ChatMessage';
import NavWithExit from '../../components/common/NavWithExit';

export default function GameWaitingRoom() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center px-20 pt-[14px] relative">
      <NavWithExit />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
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
      </div>
    </div>
  );
}
