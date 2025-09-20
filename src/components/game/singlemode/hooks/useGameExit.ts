import { useNavigate } from "react-router";
import supabase from "../../../../utils/supabase";
import { useDrawingStore } from "../../../../stores/drawingStore";

export const useGameExit = (
  userId: string | undefined,
  correctCount: number
) => {
  const navigate = useNavigate();
  const { resetTopicList } = useDrawingStore();

  const saveScoreToDatabase = async () => {
    if (!userId) return;

    await supabase
      .from("game_scores")
      .insert([{ user_id: userId, score: correctCount }]);
  };

  const handleExitRoom = async () => {
    resetTopicList();

    const { data, error } = await supabase.storage
      .from("singlemode-images")
      .list(`private/${userId}`);

    saveScoreToDatabase();

    if (error) {
      console.error(error);
      return;
    }

    const fileNames = data.map((file) => `private/${userId}/${file.name}`);

    if (fileNames.length > 0) {
      const { error } = await supabase.storage
        .from("singlemode-images")
        .remove(fileNames);
      if (error) {
        console.error(error);
      }
    }

    requestAnimationFrame(() => {
      navigate("/game");
    });
  };

  return { handleExitRoom };
};
