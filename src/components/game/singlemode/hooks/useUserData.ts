import { useState, useEffect } from "react";
import { useAuthStore } from "../../../../stores/authStore";
import supabase from "../../../../utils/supabase";

export const useUserData = () => {
  const user = useAuthStore((state) => state.user);
  const [nickName, setNickName] = useState("");

  useEffect(() => {
    if (!user) return;

    const fetchUserData = async () => {
      const { data: users, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", user!.id)
        .single();

      if (error) {
        console.error("사용자 정보를 불러올 수 없음:", error);
        return;
      }

      setNickName(users!.nickname);
    };

    fetchUserData();
  }, [user]);

  return { nickName, user };
};
