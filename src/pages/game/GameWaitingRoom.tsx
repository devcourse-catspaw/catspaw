import send from '../../assets/images/icon_send.svg';
import Button from '../../components/common/Button';
import WaitingRoom, {
  type PlayerUserProps,
} from '../../components/common/WaitingRoom';
import BaseInput from '../../components/common/BaseInput';
import ChatMessage from '../../components/common/ChatMessage';
import NavWithExit from '../../components/common/NavWithExit';
import type { Database } from '../../types/supabase';
import supabase from '../../utils/supabase';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import WaitingRoomSkeleton from '../../components/game/WaitingRoomSkeleton';
import { useAuthStore } from '../../stores/authStore';

export type UserProps = Database['public']['Tables']['users']['Row'];
export type PlayerProps = Database['public']['Tables']['players']['Row'];

export default function GameWaitingRoom() {
  const navigate = useNavigate();
  const location = useLocation();
  const { game_id, current_players, ready_players } = location.state || {};

  const { user } = useAuthStore();

  const [isLoading, setIsLoading] = useState(true);
  const [isLeader, setIsLeader] = useState(false);
  const [isAllReady, setIsAllReady] = useState(false);
  const [players, setPlayers] = useState<PlayerUserProps[]>([]);

  const checkLeader = () => {
    // players.map((player) => {
    //   if (player.is_leader && player.user_id === user?.id) {
    //     setIsLeader(true);
    //   }
    // });
    const leader = players.find(
      (player) => player.is_leader && player.user_id === user?.id
    );
    setIsLeader(!!leader);
  };

  const checkAllReady = () => {
    // players.map((player) => {
    //   if (!player.is_leader && !player.is_ready) {
    //     return;
    //   }
    //   setIsAllReady(true);
    // });
    if (players.length === 1) {
      setIsAllReady(false);
      return;
    }
    const allReady = players
      .filter((player) => !player.is_leader)
      .every((player) => player.is_ready);
    setIsAllReady(allReady);
  };

  const clickStartHandler = async () => {
    const { data: players } = await supabase
      .from('players')
      .select('id')
      .eq('game_id', game_id)
      .eq('is_ready', true);

    console.log(players);
    console.log(current_players);

    // current_players 최신으로 반영되게 수정
    if (players && players.length === current_players) {
      await supabase
        .from('games')
        .update({ status: 'PLAYING' })
        .eq('id', game_id);

      console.log('게임을 시작합니다!');
    } else {
      console.log('모든 팀원이 준비되지 않았습니다.');
    }
  };

  const clickReadyHandler = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('players')
      .update({
        is_ready: true,
      })
      .eq('user_id', user?.id)
      .select();

    if (data) {
      console.log('READY 성공!');

      const { data, error } = await supabase
        .from('games')
        .update({
          ready_players: ready_players + 1,
        })
        .eq('id', game_id)
        .select();

      if (data) console.log('레디 카운트 성공!');
      if (error) {
        console.log('레디 카운트 에러');
        console.error('Ready Count error:', error.message);
      }
    }

    if (error) {
      console.log('READY 에러');
      console.error('Ready error:', error.message);
    }
  };

  const clickExitHandler = async () => {
    if (!user) return;
    const { error } = await supabase
      .from('players')
      .delete()
      .eq('user_id', user?.id);

    if (error) {
      console.error('삭제 실패:', error.message);
    } else {
      console.log('삭제 성공');

      const { error } = await supabase
        .from('games')
        .update({ current_players: current_players - 1 })
        .eq('id', game_id)
        .select();

      if (error) {
        console.error('카운트 실패:', error.message);
      } else {
        console.log('카운트 성공');
        navigate('/game/list');
      }
    }
  };

  const getPlayerList = async () => {
    try {
      const { data } = await supabase
        .from('players')
        .select(
          `
            *,
            users(
              *
            )
          `
        )
        .eq('game_id', game_id)
        .order('joined_at', { ascending: true });
      if (data) {
        console.log(data);
        setPlayers(data);
        // checkLeader();
        setIsLoading(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // const getPlayerList = async () => {
  //   try {
  //     const { data } = await supabase
  //       .from('player_with_user')
  //       .select(
  //         `
  //           *
  //         `
  //       )
  //       .eq('game_id', game_id)
  //       .order('joined_at', { ascending: true });
  //     if (data) {
  //       console.log(data);
  //       setPlayers(data);
  //       checkLeader();
  //       setIsLoading(false);
  //     }
  //   } catch (e) {
  //     console.error(e);
  //   }
  // };

  useEffect(() => {
    getPlayerList();
    checkLeader();
    checkAllReady();

    const channel = supabase
      .channel('change_players')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'players',
        },
        async (payload) => {
          console.log(payload);

          const { eventType, new: newPlayer, old: oldPlayer } = payload;

          if (!newPlayer) return;

          const player = newPlayer as PlayerProps;

          const { data: user } = await supabase
            .from('users')
            .select('*')
            .eq('id', player.user_id)
            .maybeSingle();
          // .single();

          console.log('player.user_id:', player.user_id);
          console.log('user:', user);

          setPlayers((prevPlayers) => {
            switch (eventType) {
              case 'INSERT':
                return [
                  ...prevPlayers,
                  {
                    ...player,
                    users: {
                      avatar: user?.avatar ?? '',
                      created_at: user?.created_at ?? '',
                      email: user?.email ?? '',
                      id: user?.id ?? '',
                      nickname: user?.nickname ?? '',
                    },
                  },
                ];
              case 'UPDATE':
                return prevPlayers.map((p) =>
                  p.id === player.id
                    ? {
                        ...player,
                        users: {
                          avatar: user?.avatar ?? '',
                          created_at: user?.created_at ?? '',
                          email: user?.email ?? '',
                          id: user?.id ?? '',
                          nickname: user?.nickname ?? '',
                        },
                      }
                    : p
                );
              case 'DELETE':
                return prevPlayers.filter(
                  (p) => p.id !== (oldPlayer as PlayerProps).id
                );
              default:
                return prevPlayers;
            }
          });
          // })();

          // checkAllReady();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel(`room-${game_id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'games',
          filter: `id=eq.${game_id}`,
        },
        (payload) => {
          const newStatus = payload.new;
          if (newStatus.status === 'PLAYING') {
            // navigate(`/game/${game_id}`);
            navigate('/game/multi');
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [game_id]);

  useEffect(() => {
    checkLeader();
  }, [players, user?.id]);

  useEffect(() => {
    checkAllReady();
  }, [players]);

  return (
    <div className="w-full min-h-screen flex flex-col items-center px-20 pt-[14px] relative">
      <NavWithExit />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex justify-center items-center gap-[56px] px-[138px]">
          <div className="flex flex-col items-center gap-[23px] w-[321px]">
            <div className="flex flex-col gap-[14px] h-[352px]">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <WaitingRoomSkeleton key={i} />
                ))
              ) : (
                <>
                  {players.map((player) => (
                    <WaitingRoom key={player.id} {...player} />
                  ))}
                </>
              )}
            </div>
            <div
              className="w-[256px] h-[3px] rounded-full"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(to right, black 0 12px, transparent 12px 24px)',
              }}
            ></div>
            {isLeader ? (
              <Button
                // disabled
                // disabled:bg-[var(--grey-100)] disabled:cursor-not-allowed
                className={`text-[28px] w-[320px] h-[82px] bg-[var(--blue)] ${
                  !isAllReady && 'bg-[var(--grey-100)] cursor-not-allowed'
                }`}
                onClick={clickStartHandler}
              >
                Start
              </Button>
            ) : (
              <Button
                className="text-[28px] w-[320px] h-[82px] bg-[var(--blue)]"
                onClick={clickReadyHandler}
              >
                Ready
              </Button>
            )}

            <Button
              className="text-[28px] w-[320px] h-[82px]"
              onClick={clickExitHandler}
            >
              Exit
            </Button>
          </div>
          <div className="flex flex-col w-[627px] bg-[var(--white)] rounded-[6px] border-2 border-[var(--black)] shadow-[0_4px_4px_rgba(0,0,0,0.25)] overflow-hidden">
            <div className="h-15 font-bold text-[18px] flex justify-center items-center">
              채팅
            </div>
            <div className="h-[434px] flex flex-col gap-2 px-7 py-5 border-y-2 border-[var(--black)] overflow-y-auto scroll-custom">
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
