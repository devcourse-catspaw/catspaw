import type { LoaderFunctionArgs } from "react-router-dom";
import supabase from "../../utils/supabase";
import type { Database } from "../../types/supabase";

export type LikeRow = Database["public"]["Tables"]["likes"]["Row"];

export const fetchPosts = async (offset: number, limit: number) => {
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
     likes(*)
  `
      )
      .range(offset, offset + limit - 1)
      .order("created_at", { ascending: false });

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

export const fetchExactPost = async ({ params }: LoaderFunctionArgs) => {
  const id = Number(params.postId);
  if (isNaN(id)) throw new Error("Invalid postId");
  const { data, error } = await supabase
    .from("posts")
    .select("*, users(id, nickname, avatar)")
    .eq("id", id)
    .single();
  if (error) throw console.error("포스트 수정 에러:", error);
  return data;
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

export const fetchUsers = async () => {
  const { data, error } = await supabase
    .from("users")
    .select("id, nickname, avatar");
  if (error) {
    console.error("fetchUsers error", error);
    throw new Response("유저 조회 실패", { status: 500 });
  }
  return data ?? [];
};
