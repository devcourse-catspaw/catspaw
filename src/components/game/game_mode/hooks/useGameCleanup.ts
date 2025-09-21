import { useEffect } from "react";
import { useDrawingStore } from "../../../../stores/drawingStore";
import supabase from "../../../../utils/supabase";

export const useGameCleanup = (userId: string | undefined) => {
  const { resetTopicList } = useDrawingStore();

  useEffect(() => {
    if (!userId) return;

    const clearData = async () => {
      try {
        const { data, error } = await supabase.storage
          .from("singlemode-images")
          .list(`private/${userId}`);

        if (error) {
          console.error("파일 목록 조회 실패:", error);
          return;
        }

        const fileNames = data.map((file) => `private/${userId}/${file.name}`);

        if (fileNames.length > 0) {
          const { error: removeError } = await supabase.storage
            .from("singlemode-images")
            .remove(fileNames);

          if (removeError) {
            console.error("파일 삭제 실패:", removeError);
          }
        }

        resetTopicList();
      } catch (error) {
        console.error("clearData 에러:", error);
      }
    };

    clearData();
  }, [userId, resetTopicList]);
};