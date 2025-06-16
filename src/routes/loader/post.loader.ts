import type { LoaderFunctionArgs } from "react-router-dom";
import supabase from "../../utils/supabase";
import type { Database } from "../../types/supabase";

export type LikeRow = Database["public"]["Tables"]["likes"]["Row"];

export const fetchPosts = async () => {
  try {
    const { data: posts } = await supabase.from("posts").select(`
    *,
    users (
      id, 
      avatar,
      nickname
    ),
     likes(*)
  `);

    return posts;
  } catch (e) {
    console.error(e);
  }
};

export const fetchPostDetail = async ({ params }: LoaderFunctionArgs) => {
  try {
    const { data: posts } = await supabase
      .from("posts")
      .select(
        `
    *,
    users (
      id, 
      avatar,
      nickname
    ),
    comments (
      id, 
      content,
      updated_at,
      post_id,
      users (
        id, 
        nickname,
        avatar
      )
    ),
    likes(*)
  `
      )
      .eq("id", Number(params.id))
      .single();
    return posts;
  } catch (e) {
    console.error(e);
  }
};

// 좋아요 불러오기
export const fetchLikes = async (): Promise<LikeRow[]> => {
  const { data, error } = await supabase.from("likes").select("*");
  if (error || !data) return [];
  return data;
};

//좋아요 추가
export const addLike = async (postId: number, userId: string) => {
  const { error } = await supabase
    .from("likes")
    .insert([{ post_id: postId, user_id: userId }]);
  if (error) console.error("addLike error:", error);
  return !error;
};

// 좋아요 취소(삭제)
export const removeLike = async (postId: number, userId: string) => {
  const { error } = await supabase
    .from("likes")
    .delete()
    .eq("post_id", postId)
    .eq("user_id", userId);
  if (error) console.error("removeLike error:", error);
  return !error;
};
