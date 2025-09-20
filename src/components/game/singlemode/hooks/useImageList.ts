import { useState, useEffect } from "react";
import type { FileObject } from "@supabase/storage-js";
import supabase from "../../../../utils/supabase";

interface StorageResponse {
  data: FileObject[] | null;
  error: Error | null;
}

export const useImageList = (userId: string | undefined) => {
  const [answerList, setAnswerList] = useState<string[]>([]);

  useEffect(() => {
    if (!userId) return;

    const fetchImage = async () => {
      const { data, error }: StorageResponse = await supabase.storage
        .from("singlemode-images")
        .list(`private/${userId}`, {
          limit: 100,
          offset: 0,
          sortBy: { column: "name", order: "asc" },
        });

      if (error) {
        console.error(error);
        return;
      }

      const imageUrls = data!.map((file: FileObject) => {
        const { data } = supabase.storage
          .from("singlemode-images")
          .getPublicUrl(`private/${userId}/${file.name}`);
        return data.publicUrl;
      });

      setAnswerList(imageUrls);
    };

    fetchImage();
  }, [userId]);

  return { answerList };
};
