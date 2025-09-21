import { useNavigate } from "react-router";
import { useDrawingStore } from "../../../../stores/drawingStore";
import { useAuthStore } from "../../../../stores/authStore";
import supabase from "../../../../utils/supabase";

export const useDrawingSubmit = () => {
  const navigate = useNavigate();
  const { setFilename } = useDrawingStore();
  const user = useAuthStore((state) => state.user);

  const handleSubmit = async (imageDataUrl: string) => {
    const filename = `drawing_${Date.now()}.jpg`;
    const data = await fetch(imageDataUrl);
    const blob = await data.blob();

    const file = new File([blob], filename, { type: "image/jpeg" });
    setFilename(filename);

    const { error } = await supabase.storage
      .from("singlemode-images")
      .upload(`private/${user?.id}/${filename}`, file);

    if (error) {
      console.error(error);
      return;
    }

    navigate("/game/ai-answering");
  };

  return { handleSubmit };
};
