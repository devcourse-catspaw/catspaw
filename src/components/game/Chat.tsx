import BaseInput from '../common/BaseInput';
import Button from '../common/Button';
import ChatMessage from '../common/ChatMessage';
import send from '../../assets/images/icon_send.svg';
import { useGameRoomStore } from '../../stores/gameRoomStore';
import { useAuthStore } from '../../stores/authStore';
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react';
import supabase from '../../utils/supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';

type Message = {
  userName: string;
  message: string;
  isMine: boolean;
};

type PrevMessage = {
  id: number;
  game_id: number;
  player_id: string;
  content: string;
  nickname: string | null;
  created_at: string;
};

type ChatSize = 'small' | 'medium' | 'large';

type ChatProps = {
  size?: ChatSize;
};

type ChatMessageData = Message | PrevMessage;

export default function Chat({ size = 'large' }: ChatProps) {
  const game = useGameRoomStore((state) => state.game);
  const user = useAuthStore();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [prevMessages, setPrevMessages] = useState<PrevMessage[]>([]);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const [userName, setUserName] = useState<string>('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const sizeStyles = {
    small: {
      container:
        'flex flex-col w-[287px] h-[480px] bg-[var(--white)] rounded-[6px] border-2 border-[var(--black)] shadow-[0_4px_4px_rgba(0,0,0,0.25)] overflow-hidden',
      chatArea:
        'h-[342px] flex flex-col gap-2 px-4 border-y-2 border-[var(--black)] overflow-y-auto scroll-custom',
      inputContainer: 'flex justify-between px-4 py-4',
      formGap: 'gap-[10px]',
      input: 'text-[14px] h-10',
      button: 'w-[46px] h-[35px] px-2 py-0',
      sendIcon: 'w-[20px] h-[20px]',
      messageSize: 'small' as const,
    },
    medium: {
      container:
        'flex flex-col w-[287px] h-[577px] bg-[var(--white)] rounded-[6px] border-2 border-[var(--black)] shadow-[0_4px_4px_rgba(0,0,0,0.25)] overflow-hidden',
      chatArea:
        'h-[440px] flex flex-col gap-2 px-4 border-y-2 border-[var(--black)] overflow-y-auto scroll-custom',
      inputContainer: 'flex justify-between px-4 py-4',
      formGap: 'gap-[10px]',
      input: 'text-[14px] h-10',
      button: 'w-[46px] h-[35px] px-2 py-0',
      sendIcon: 'w-[20px] h-[20px]',
      messageSize: 'small' as const,
    },
    large: {
      container:
        'flex flex-col w-[627px] bg-[var(--white)] rounded-[6px] border-2 border-[var(--black)] shadow-[0_4px_4px_rgba(0,0,0,0.25)] overflow-hidden',
      chatArea:
        'h-[434px] flex flex-col gap-2 px-7 py-5 border-y-2 border-[var(--black)] overflow-y-auto scroll-custom',
      inputContainer: 'flex justify-between px-5 py-5',
      formGap: 'gap-[10px]',
      input: 'text-[14px]',
      button: 'w-[66px] h-[50px] px-[18px]',
      sendIcon: 'w-[29px] h-[29px]',
      messageSize: 'large' as const,
    },
  };

  const currentStyles = sizeStyles[size];

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const shouldShowProfile = (currentIndex: number) => {
    if (currentIndex === 0) return true;

    const allMessages = [...prevMessages, ...messages];
    const currentMsg = allMessages[currentIndex];
    const prevMsg = allMessages[currentIndex - 1];

    if (!prevMsg || !currentMsg) return true;

    const getCurrentAuthor = (msg: ChatMessageData, index: number): string => {
      if (index >= prevMessages.length) {
        return (msg as Message).userName;
      } else {
        return (msg as PrevMessage).nickname || '';
      }
    };

    const currentAuthor = getCurrentAuthor(currentMsg, currentIndex);
    const prevAuthor = getCurrentAuthor(prevMsg, currentIndex - 1);

    return currentAuthor !== prevAuthor;
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, prevMessages]);

  useEffect(() => {
    const fetchUserName = async () => {
      if (!user.user?.id) return;

      try {
        const { data: users, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.user.id)
          .single();

        if (error) {
          console.error('사용자 정보 불러오기 에러:', error.message);
        } else if (users?.nickname) {
          setUserName(users.nickname);
        }
      } catch (error) {
        console.error('사용자 정보 불러오기 실패:', error);
      }
    };

    const fetchMessages = async () => {
      if (!game?.id) return;

      try {
        const { data: messagesData, error } = await supabase
          .from('messages')
          .select('*')
          .eq('game_id', game.id)
          .order('created_at', { ascending: true });

        if (error) {
          console.error('메시지 불러오기 에러:', error.message);
        } else if (messagesData) {
          setPrevMessages(messagesData);
        }
      } catch (error) {
        console.error('메시지 불러오기 실패:', error);
      }
    };

    fetchMessages();
    fetchUserName();
  }, [user.user?.id, game?.id]);

  useEffect(() => {
    if (!game?.id || !userName) return;

    const gameChannel = supabase.channel(`chat-${game.id}`);

    gameChannel
      .on('broadcast', { event: 'shout' }, (payload) => {
        const res = payload.payload;
        setMessages((prev) => [
          ...prev,
          {
            userName: res.userName,
            message: res.message,
            isMine: res.userName === userName,
          },
        ]);
      })
      .subscribe();

    channelRef.current = gameChannel;

    return () => {
      gameChannel.unsubscribe();
      try {
        supabase.removeChannel(gameChannel);
      } catch (error) {
        console.error('채널 제거 실패:', error);
      }
    };
  }, [game?.id, userName]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!message.trim() || !user.user?.id || !game?.id) return;

    const newMessage = {
      message: message.trim(),
      userName: userName,
    };

    setMessages((prev) => [
      ...prev,
      {
        userName: newMessage.userName,
        message: newMessage.message,
        isMine: true,
      },
    ]);

    channelRef.current?.send({
      type: 'broadcast',
      event: 'shout',
      payload: newMessage,
    });

    setMessage('');

    try {
      const { error } = await supabase.from('messages').insert([
        {
          game_id: game.id,
          player_id: user.user.id,
          content: newMessage.message,
          nickname: newMessage.userName,
        },
      ]);

      if (error) {
        console.error('메시지 전송 실패:', error.message);
      }
    } catch (error) {
      console.error('메시지 저장 실패:', error);
    }
  };

  return (
    <div className={currentStyles.container}>
      <div className="h-15 font-bold text-[18px] flex justify-center items-center">
        채팅
      </div>

      <div className={currentStyles.chatArea}>
        {size === 'small' ? (
          <div className="py-2 space-y-2">
            {prevMessages.map((msg, index) => {
              const showProfile = shouldShowProfile(index);
              return (
                <div key={`prev-${msg.id}-${index}`}>
                  <ChatMessage
                    userName={msg.nickname || '알수없음'}
                    message={msg.content}
                    isMine={msg.player_id === user.user?.id}
                    size={currentStyles.messageSize}
                    showProfile={showProfile}
                  />
                </div>
              );
            })}

            {messages.map((msg, index) => {
              const showProfile = shouldShowProfile(
                prevMessages.length + index
              );
              return (
                <div key={`real-${index}`}>
                  <ChatMessage
                    userName={msg.userName || '알수없음'}
                    message={msg.message}
                    isMine={msg.isMine}
                    size={currentStyles.messageSize}
                    showProfile={showProfile}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <>
            {prevMessages.map((msg, index) => (
              <ChatMessage
                key={`prev-${msg.id}-${index}`}
                userName={msg.nickname || '알수없음'}
                message={msg.content}
                isMine={msg.player_id === user.user?.id}
                size={currentStyles.messageSize}
                showProfile={shouldShowProfile(index)}
              />
            ))}

            {messages.map((msg, index) => (
              <ChatMessage
                key={`real-${index}`}
                userName={msg.userName || '알수없음'}
                message={msg.message}
                isMine={msg.isMine}
                size={currentStyles.messageSize}
                showProfile={shouldShowProfile(prevMessages.length + index)}
              />
            ))}
          </>
        )}

        <div ref={bottomRef}></div>
      </div>

      <div className={currentStyles.inputContainer}>
        <form
          onSubmit={handleSubmit}
          className={`w-full flex ${currentStyles.formGap}`}
        >
          <BaseInput
            value={message}
            onChange={handleChange}
            placeholder="메시지 입력"
            className={currentStyles.input}
          />
          <Button className={currentStyles.button} type="submit">
            <img src={send} alt="전송" className={currentStyles.sendIcon} />
          </Button>
        </form>
      </div>
    </div>
  );
}
