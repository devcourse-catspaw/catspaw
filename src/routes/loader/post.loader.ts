import type { LoaderFunctionArgs } from "react-router-dom";
import supabase from "../../utils/supabase";

export const fetchPosts = async () => {
  try {
    const { data: posts } = await supabase.from("posts").select(`
    *,
    users (
      id, 
      avatar,
      nickname
    ),
     likes(
    id,
    created_at,
    post_id,
    user_id
    )
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
    likes(
    id,
    created_at,
    post_id,
    user_id

    )
  `
      )
      .eq("id", Number(params.id))
      .single();

    return posts;
  } catch (e) {
    console.error(e);
  }
};

export const fetchLikes = async () => {
  try {
    const { data: likes } = await supabase.from("likes").select(`
    *,
  
  `);

    return likes;
  } catch (e) {
    console.error(e);
  }
};
