import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import GameModeSelectCard from "../../components/game/game_mode/GameModeSelectCard";
import NavWithExit from "../../components/common/NavWithExit";
import pawPencil from "../../assets/images/paw_pencil_big.svg";
import doodle from "../../assets/images/doodle_loading.svg";
import supabase from "../../utils/supabase";
import { useAuthStore } from "../../stores/authStore";
import { useDrawingStore } from "../../stores/drawingStore";

export default function GameModeSelect() {
  const navigate = useNavigate();
  const [count, setCount] = useState<number | null>(null);
  const user = useAuthStore((state) => state.user);
  const { resetTopicList, getRandomTopic } = useDrawingStore();

  useEffect(() => {
    if (count === null) return;
    if (count === 0) {
      navigate("/game/single");
      return;
    }
    const timer = setTimeout(() => {
      setCount((prev) => (prev ?? 0) - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [count, navigate]);

  useEffect(() => {
    const clearData = async () => {
      const { data, error } = await supabase.storage
        .from("singlemode-images")
        .list(`private/${user?.id}`);

      if (error) {
        console.error(error);
        return;
      }

      const fileNames = data.map((file) => `private/${user?.id}/${file.name}`);

      if (fileNames.length > 0) {
        const { error } = await supabase.storage
          .from("singlemode-images")
          .remove(fileNames);
        if (error) {
          console.error(error);
        }
      }
      resetTopicList();
      getRandomTopic();
    };
    clearData();
  });

  return (
    <div className="w-full min-h-screen flex flex-col items-center px-20 pt-[14px] relative">
      <NavWithExit />
      <div className="flex flex-col justify-center items-center gap-10 absolute inset-0">
        {count === null ? (
          <>
            <p className="font-extrabold text-[39px]">
              게임 모드를 골라보세요!
            </p>
            <div className="flex gap-[81px]">
              <div onClick={() => setCount(3)} className="z-50 cursor-pointer">
                <GameModeSelectCard mode="single" />
              </div>
              <div onClick={() => navigate("/game/multi")} className="z-50">
                <GameModeSelectCard mode="multi" />
              </div>
            </div>
          </>
        ) : (
          <div className="text-[134px] font-gloria font-extrabold text-[color:var(--black)] animate-pulse z-50">
            {count}
          </div>
        )}
      </div>
      <img
        src={pawPencil}
        alt="paw pencil 이미지"
        className="fixed bottom-25 right-0"
      />
      <img
        src={doodle}
        alt="그림 이미지"
        className="fixed bottom-[-60px] right-[26px] rotate-150 -z-10"
      />
    </div>
  );
}
