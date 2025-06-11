import { useEffect, useRef, useState } from 'react';
import send from '../../assets/images/icon_send.svg';
import NavWithExit from '../../components/common/NavWithExit';
import DrawingCanvas from '../../components/game/DrawingCanvas';
import { useNavigate } from 'react-router';
import { useGameTimerStore } from '../../stores/gameTimerStore';
import GameTimer from '../../components/game/GameTimer';
import ChatMessage from '../../components/common/ChatMessage';
import BaseInput from '../../components/common/BaseInput';
import Button from '../../components/common/Button';

export default function MultiModeDrawing({ step }: { step: string }) {
  const { timeLeft, setTime, decrease } = useGameTimerStore();
  const navigate = useNavigate();

  const [msg, setMsg] = useState('');
  const [messages, setMessages] = useState([]);
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  let lastEnterTime = 0;
  const keyDownHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const now = Date.now();
      if (now - lastEnterTime < 500) return;

      lastEnterTime = now;

      e.preventDefault();
      sendMessageHandler();
    }
  };

  const sendMessageHandler = () => {
    if (msg.trim() === '') return;
    setReloadTrigger((reloadTrigger) => reloadTrigger + 1);
    setShouldScrollToBottom(true);
    inputRef.current?.focus();
  };

  const sendDrawingHandler = () => {};

  const getMessages = async () => {
    setShouldScrollToBottom(true);
  };

  // 페이지 진입 시 타이머 설정
  useEffect(() => {
    setTime(180);
    const timer = setInterval(() => {
      decrease();
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 시간이 0이 되면 페이지 이동
  useEffect(() => {
    if (timeLeft && timeLeft <= 0) {
      navigate('/game/multi/result');
    }
  }, [timeLeft]);

  useEffect(() => {
    getMessages();
  }, [reloadTrigger]);

  useEffect(() => {
    if (bottomRef && shouldScrollToBottom) {
      bottomRef.current?.scrollIntoView({ behavior: 'auto', block: 'end' });
      setShouldScrollToBottom(false);
    }
  }, [reloadTrigger, bottomRef, messages, shouldScrollToBottom]);

  return (
    <div className="w-full min-h-screen flex flex-col items-center px-20 pt-[14px] relative">
      <NavWithExit title="같이 할 사람~" />
      <div className="flex gap-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col gap-5 items-end">
          <div className="mr-3">
            <div className="w-[595px] h-[62px] flex justify-center items-center text-[18px] font-semibold bg-[var(--white)] rounded-[6px] border-2 border-[var(--black)]">
              제시어
            </div>
          </div>
          <DrawingCanvas step={step} onSubmit={sendDrawingHandler} />
        </div>
        <div className="flex items-center mt-3">
          <GameTimer totalTime={90} />
        </div>
        <div className="flex flex-col w-[287px] bg-[var(--white)] rounded-[6px] border-2 border-[var(--black)] shadow-[0_4px_4px_rgba(0,0,0,0.25)] overflow-hidden">
          <div className="h-15 font-bold text-[18px] flex justify-center items-center">
            채팅
          </div>

          <div className="h-[416px] flex flex-col gap-2 px-4  border-y-2 border-[var(--black)] overflow-y-auto">
            <div className="py-2 space-y-2">
              <ChatMessage
                userName="유코딩"
                message="안녕하세욥!"
                isMine={false}
                size="small"
              />
              <ChatMessage
                userName="유코딩"
                message="그림 잘 그리세요? 사실 전 그림 못 그리는 사람과는 하고 싶지 않거든요"
                isMine={false}
                size="small"
              />
              <ChatMessage
                userName="Yubin"
                message="네"
                isMine={true}
                size="small"
              />
              <ChatMessage
                userName="유코딩"
                message="ㅎㅎ"
                isMine={false}
                size="small"
              />
              <ChatMessage
                userName="Yubin"
                message="네네네네네네네네ㅔㄴ네네네ㅔㄴ네ㅔㅔ네네ㅔ네네네네네ㅔ네"
                isMine={true}
                size="small"
              />
              <ChatMessage
                userName="Yubin"
                message="네네네ㅔㄴ네네ㅔㅔ네ㅔ네네ㅔ네ㅔ"
                isMine={true}
                size="small"
              />
            </div>
            <div ref={bottomRef}></div>
          </div>
          <div className="flex justify-between gap-[10px] px-4 py-4">
            <BaseInput
              ref={inputRef}
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              onKeyDown={keyDownHandler}
              placeholder="메시지 입력"
              className="text-[14px] h-10"
            />
            <Button
              onClick={sendMessageHandler}
              className="w-[46px] h-[35px] px-2 py-0"
            >
              <img src={send} alt="전송" className="w-[20px] h-[20px]"></img>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
