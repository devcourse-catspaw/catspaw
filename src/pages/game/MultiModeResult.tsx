import { useEffect, useRef, useState } from 'react';
import send from '../../assets/images/icon_send.svg';
import sketchBook from '../../assets/images/sketchbook_big.svg';
import loading from '../../assets/images/doodle_loading.svg';
import pawPencil from '../../assets/images/paw_pencil.svg';
import Kisu from '../../assets/images/kisu_.svg?react';
import NavWithExit from '../../components/common/NavWithExit';
import { useNavigate } from 'react-router';
import ChatMessage from '../../components/common/ChatMessage';
import BaseInput from '../../components/common/BaseInput';
import Button from '../../components/common/Button';
import ResultChat from '../../components/game/ResultChat';
import ResultPlayerIndex from '../../components/game/ResultPlayerIndex';
import ResultShareModal from '../../components/game/ResultShareModal';
import html2canvas from 'html2canvas';
import ScrollItem from '../../components/common/ScrollItem';
import supabase from '../../utils/supabase';
import { useGameRoomStore } from '../../stores/gameRoomStore';
import type { PlayerUserProps } from '../../components/common/WaitingRoom';
import type { Database } from '../../types/supabase';

type TurnType = Database['public']['Tables']['turns']['Row'];

type ChainItem = {
  turn: number;
  by: string;
  content: string | null;
};

export default function MultiModeResult() {
  const { game, resetGame, resetPlayer, resetTurn } = useGameRoomStore();

  const navigate = useNavigate();

  const [players, setPlayers] = useState<PlayerUserProps[]>([]);
  const [playerResults, setPlayerResults] = useState<ChainItem[][]>([]);
  const [isActive, setIsActive] = useState(0);
  const [imageUrl, setImageUrl] = useState('');
  const [isCapturing, setIsCapturing] = useState(false);
  const [isResultShareModalOpen, setIsResultShareModalOpen] = useState(false);

  const [msg, setMsg] = useState('');
  const [messages, setMessages] = useState([]);
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const divRef = useRef<HTMLDivElement | null>(null);
  const divModifyRef = useRef<HTMLDivElement | null>(null);

  const clickPlayerIndexHandler = (index: number) => {
    setIsActive(index);
  };

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

  const getMessages = async () => {
    setShouldScrollToBottom(true);
  };

  const sendMessageHandler = () => {
    if (msg.trim() === '') return;
    setReloadTrigger((reloadTrigger) => reloadTrigger + 1);
    setShouldScrollToBottom(true);
    inputRef.current?.focus();
  };

  const getResults = async () => {
    if (!game) return;

    const { data: turns } = await supabase
      .from('turns')
      .select('*')
      .eq('game_id', game.id)
      .order('turn_number');

    const { data: players } = await supabase
      .from('players')
      .select('*, users(*)')
      .eq('game_id', game.id)
      .order('joined_at', { ascending: true });

    if (!players) return;

    const nicknameMap: Record<string, string> = {};
    players?.forEach((player) => {
      nicknameMap[player.user_id] = player.users?.nickname || 'Unknown';
    });

    const chainsByUserId = makeChains(turns!, nicknameMap);

    setPlayers(players);
    setPlayerResults(players.map((p) => chainsByUserId[p.user_id] ?? []));
  };

  const makeChains = (
    turns: TurnType[],
    nicknameMap: Record<string, string>
  ): Record<string, ChainItem[]> => {
    const chains: Record<string, ChainItem[]> = {};

    const firstTurns = turns.filter(
      (t) => t.turn_number === 1 && t.type === 'WORD'
    );

    for (const first of firstTurns) {
      const chain: ChainItem[] = [
        {
          turn: first.turn_number,
          by: nicknameMap[first.sender_id] || 'Unknown',
          content: first.content,
        },
      ];

      let currentReceiver = first.receiver_id;

      for (let turnNum = 2; turnNum <= firstTurns.length; turnNum++) {
        const next = turns.find(
          (t) => t.turn_number === turnNum && t.sender_id === currentReceiver
        );

        if (next) {
          chain.push({
            turn: next.turn_number,
            by: nicknameMap[next.sender_id] || 'Unknown',
            content: next.content,
          });
          currentReceiver = next.receiver_id;
        }
      }

      chains[first.sender_id] = chain;
    }

    return chains;
  };

  const clickExitHandler = async () => {
    const { data, error } = await supabase.storage
      .from('multimode-images')
      .list(`${game?.id}`);

    if (error) {
      console.error(error);
      return;
    }

    if (data) {
      const fileNames = data.map((file) => `${game?.id}/${file.name}`);

      if (fileNames.length > 0) {
        const { error } = await supabase.storage
          .from('multimode-images')
          .remove(fileNames);
        if (error) {
          console.error(error);
        }
      }

      if (game) {
        const { error } = await supabase
          .from('games')
          .delete()
          .eq('id', game?.id);

        if (error) {
          console.error('삭제 실패:', error.message);
        } else {
          console.log('삭제 성공');

          resetGame();
          resetPlayer();
          resetTurn();

          navigate('/');
        }
      }
    }
  };

  const clickShareHandler = async () => {
    const div = divRef.current;
    const divModify = divModifyRef.current;
    if (!div || !divModify) return;

    div.classList.remove('overflow-hidden');
    div.classList.add('h-full');
    divModify.classList.remove('overflow-y-auto');
    divModify.classList.add('h-full');

    // const originalHeight = divModify.style.height;
    // divModify.style.height = divModify.scrollHeight + 'px';

    try {
      setIsCapturing(true);
      const canvas = await html2canvas(div, {
        useCORS: true,
        allowTaint: true,
        scale: 2,
      });

      const dataUrl = canvas.toDataURL('image/png');
      setImageUrl(dataUrl);
      setIsResultShareModalOpen(true);
    } catch (e) {
      console.error('캡처 실패:', e);
    } finally {
      div.classList.add('overflow-hidden');
      div.classList.remove('h-full');
      divModify.classList.add('overflow-y-auto');
      divModify.classList.remove('h-full');
      setIsCapturing(false);

      // divModify.style.height = originalHeight;
    }
  };

  const closeResultShareModalHandler = () => {
    setIsResultShareModalOpen(false);
  };

  useEffect(() => {
    useGameRoomStore.getState().loadGameFromSession();
    useGameRoomStore.getState().loadPlayerFromSession();
    useGameRoomStore.getState().loadTurnFromSession();

    getResults();
  }, []);

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
      <NavWithExit title={game?.room_name} />
      {isCapturing ? (
        <div className="relative w-full min-h-screen">
          <img
            src={loading}
            alt="라인"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          />
          <img
            src={pawPencil}
            alt="연필"
            className="absolute top-[37%] left-[65%] -translate-x-1/2 -translate-y-1/2"
          />
        </div>
      ) : (
        <div className="flex flex-col gap-[55px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          {/* absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 */}
          <div className="flex gap-7 ">
            <div className="flex flex-col gap-5 items-end">
              <div className="w-[629px] h-[62px] flex justify-center items-center text-[18px] font-semibold bg-[var(--white)] rounded-[6px] border-2 border-[var(--black)]">
                결과 발표
              </div>
              <div className="flex relative bg-[var(--white)]">
                {/* flex flex-col justify-end items-end */}
                <div className="absolute top-0 -left-[58px] flex flex-col items-end w-[64px] mt-5 -z-10">
                  {players.map((player, index) => (
                    <ResultPlayerIndex
                      key={player.user_id}
                      avatar={Kisu}
                      name={player.users!.nickname}
                      isActive={isActive === index}
                      onClick={() => clickPlayerIndexHandler(index)}
                    />
                  ))}
                </div>
                <div
                  // id="scroll-container"
                  ref={divRef}
                  // h-full overflow-hidden
                  className="flex relative w-[629px] h-[495px] justify-center items-center pt-9 pr-2 overflow-hidden"
                >
                  {/* h-full overflow-y-auto */}
                  <div
                    id="scroll-container"
                    ref={divModifyRef}
                    className="w-[610px] h-[440px] p-5 overflow-y-auto scroll-custom"
                  >
                    {playerResults[isActive] &&
                      playerResults[isActive].map((result, index) => (
                        <ScrollItem delay={0.5 * (index + 1)}>
                          <ResultChat
                            userName={result.by}
                            message={result.content!}
                            isDrawing={index % 2 === 1}
                          />
                        </ScrollItem>
                      ))}
                  </div>
                  <img
                    src={sketchBook}
                    alt="스케치북"
                    className="absolute right-[1.5px] bottom-0 w-full h-full "
                    // inset-0 -z-50
                    // -right-8 bottom-0
                  />
                </div>
              </div>
            </div>
            {/* h-[480px]  */}
            <div className="flex flex-col w-[287px] bg-[var(--white)] rounded-[6px] border-2 border-[var(--black)] shadow-[0_4px_4px_rgba(0,0,0,0.25)] overflow-hidden">
              <div className="h-15 font-bold text-[18px] flex justify-center items-center">
                채팅
              </div>
              <div className="h-[440px] flex flex-col gap-2 px-4 border-y-2 border-[var(--black)] overflow-y-auto">
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
                  <img
                    src={send}
                    alt="전송"
                    className="w-[20px] h-[20px]"
                  ></img>
                </Button>
              </div>
            </div>
          </div>
          <div className="flex justify-center items-center gap-[39px]">
            <Button
              onClick={clickShareHandler}
              className="w-[134px] h-[44px] px-0 py-0 text-[18px] z-10"
            >
              결과 공유
            </Button>
            <Button
              onClick={clickExitHandler}
              className="w-[134px] h-[44px] px-0 py-0 text-[18px]"
            >
              방 나가기
            </Button>
          </div>
        </div>
      )}
      {isResultShareModalOpen && (
        <ResultShareModal
          imageUrl={imageUrl}
          closeResultShareModalHandler={closeResultShareModalHandler}
        />
      )}
    </div>
  );
}
