import { useState, useEffect } from "react";
import supabase from "../../../utils/supabase";

export const useImageFetch = (
  filename: string | null, 
  userId: string | undefined,
  setIsError: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const fetchImage = async () => {
      if (!filename) {
        return;
      }

      if (!userId) {
        return;
      }

      const { data } = supabase.storage
        .from("singlemode-images")
        .getPublicUrl(`private/${userId}/${filename}`);

      const img = new Image();
      img.onload = () => {
        setImageUrl(data.publicUrl);
        setRetryCount(0);
      };
      img.onerror = () => {
        if (retryCount < 5) {
          setRetryCount((prev) => prev + 1);
          setTimeout(fetchImage, 1000);
        } else {
          setIsError(true);
        }
      };
      img.src = data.publicUrl;
    };

    const timer = setTimeout(fetchImage, 300);
    return () => clearTimeout(timer);
  }, [filename, retryCount, userId, setIsError]);

  return { imageUrl };
};