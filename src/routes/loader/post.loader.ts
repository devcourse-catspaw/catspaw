import type { LoaderFunctionArgs } from "react-router-dom";
import supabase from "../../utils/supabase";

export const fetchPosts = async () => {
  try {
    const { data: posts } = await supabase.from("posts").select(`
    *,
    profiles (
      id, 
      username,
      avatar_url
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
    profiles (
      id, 
      username,
      avatar_url
    ),
    comments (
      id, 
      comment, 
      profile_id,
      created_at,
      post_id,
      profiles (
        id, 
        username,
        avatar_url
      )
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
