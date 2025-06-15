import BaseInput from "../common/BaseInput";
import Button from "../common/Button";
import ChatMessage from "../common/ChatMessage";
import send from "../../assets/images/icon_send.svg";
import { useGameRoomStore } from "../../stores/gameRoomStore";
import { useAuthStore } from "../../stores/authStore";
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import supabase from "../../utils/supabase";
import type { RealtimeChannel } from "@supabase/supabase-js";

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

export default function Chat() {
  const game = useGameRoomStore((state) => state.game);
  const user = useAuthStore();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [prevMessages, setPrevMessages] = useState<PrevMessage[]>([]);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const [userName, setUserName] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    const fetchUserName = async () => {
      if (!user.user?.id) return;

      try {
        const { data: users, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.user.id)
          .single();

        if (error) {
          console.error("사용자 정보 불러오기 에러:", error.message);
        } else if (users?.nickname) {
          setUserName(users.nickname);
        }
      } catch (error) {
        console.error("사용자 정보 불러오기 실패:", error);
      }
    };

    const fetchMessages = async () => {
      if (!game?.id) return;

      try {
        const { data: messagesData, error } = await supabase
          .from("messages")
          .select("*")
          .eq("game_id", game.id)
          .order("created_at", { ascending: true });

        if (error) {
          console.error("메시지 불러오기 에러:", error.message);
        } else if (messagesData) {
          setPrevMessages(messagesData);
        }
      } catch (error) {
        console.error("메시지 불러오기 실패:", error);
      }
    };

    fetchMessages();
    fetchUserName();
  }, [user.user?.id, game?.id]);

  useEffect(() => {
    if (!game?.id || !user.user?.user_metadata?.full_name) return;

    const gameChannel = supabase.channel(`chat-${game.id}`);

    gameChannel
      .on("broadcast", { event: "shout" }, (payload) => {
        const res = payload.payload;
        setMessages((prev) => [
          ...prev,
          {
            userName: res.userName,
            message: res.message,
            isMine: res.userName === user.user?.user_metadata?.full_name,
          },
        ]);
      })
      .subscribe();

    channelRef.current = gameChannel;

    return () => {
      gameChannel.unsubscribe();
    };
  }, [game?.id, user.user?.user_metadata?.full_name]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!message.trim() || !user.user?.id || !game?.id) return;

    const newMessage = {
      message: message.trim(),
      userName: user.user?.user_metadata?.full_name ?? userName,
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
      type: "broadcast",
      event: "shout",
      payload: newMessage,
    });

    setMessage("");

    try {
      const { error } = await supabase.from("messages").insert([
        {
          game_id: game.id,
          player_id: user.user.id,
          content: newMessage.message,
          nickname: newMessage.userName,
        },
      ]);

      if (error) {
        console.error("메시지 전송 실패:", error.message);
      }
    } catch (error) {
      console.error("메시지 저장 실패:", error);
    }
  };

  return (
    <div className="flex flex-col w-[627px] bg-[var(--white)] rounded-[6px] border-2 border-[var(--black)] shadow-[0_4px_4px_rgba(0,0,0,0.25)] overflow-hidden">
      <div className="h-15 font-bold text-[18px] flex justify-center items-center">
        채팅
      </div>

      <div className="h-[434px] flex flex-col gap-2 px-7 py-5 border-y-2 border-[var(--black)] overflow-y-auto scroll-custom">
        {prevMessages.map((msg, index) => (
          <ChatMessage
            key={`prev-${msg.id}-${index}`}
            userName={msg.nickname || ""}
            message={msg.content}
            isMine={msg.player_id === user.user?.id}
            size="large"
          />
        ))}

        {messages.map((msg, index) => (
          <ChatMessage
            key={`real-${index}`}
            userName={msg.userName}
            message={msg.message}
            isMine={msg.isMine}
            size="large"
          />
        ))}
      </div>

      <div className="flex justify-between gap-[10px] px-5 py-5">
        <form onSubmit={handleSubmit} className="w-full flex gap-[10px]">
          <BaseInput
            placeholder="메시지 입력"
            className="text-[14px]"
            value={message}
            onChange={handleChange}
          />
          <Button className="w-[66px] h-[50px] px-[18px]" type="submit">
            <img src={send} alt="전송" className="w-[29px] h-[29px]" />
          </Button>
        </form>
      </div>
    </div>
  );
}
