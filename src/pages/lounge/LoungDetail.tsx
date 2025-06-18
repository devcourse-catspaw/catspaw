import Comments from "../../components/lounge/Comments";
import Contents from "../../components/lounge/Contents";
import Writer from "../../components/lounge/Writer";
import kisu from "../../assets/images/kisu_.svg";
import Spring from "../../assets/images/spring_big.svg?react";
import Back from "../../assets/images/icon_back_page.svg?react";
import { useLoaderData, useNavigate } from "react-router";
import { twMerge } from "tailwind-merge";
import { useAuthStore } from "../../stores/authStore";
import { useState } from "react";

const cardLayout =
  "w-[1080px]  flex flex-col items-center overflow-visible border-[3px] border-[var(--black)] shadow-[0px_7px_0px_var(--black)] rounded-[11px] ";
// export type PostDetail = NonNullable<
//   Awaited<ReturnType<typeof fetchPostDetail>>
// >;

type PostDetail = {
  content: string;
  created_at: string;
  id: number;
  images: string[] | null;
  title: string;
  updated_at: string;
  user_id: string;
  users: {
    avatar: string | null;
    created_at: string;
    email: string | null;
    id: string;
    nickname: string;
  };
  comments: {
    content: string;
    created_at: string;
    id: number;
    post_id: number;
    updated_at: string;
    user_id: string;
  }[];
  likes:
    | {
        created_at: string;
        id: number;
        post_id: number | null;
        user_id: string | null;
      }[];
};

export default function LoungeDetail() {
  const post = useLoaderData<PostDetail>();
  const user = useAuthStore((state) => state.user);

  const [commentsCount, setCommentsCount] = useState(post.comments.length);

  const allowedAvatars = [
    "kisu_.svg",
    "kisu_ribbon.svg",
    "kisu_sunglasses.svg",
    "kisu_cap.svg",
    "kisu_pippi.svg",
    "kisu_tie.svg",
  ];
  const rawAvatar = post.users!.avatar!;
  const avatarFile = allowedAvatars.includes(rawAvatar)
    ? rawAvatar
    : "kisu_.svg";
  const avatarSrc = `${
    import.meta.env.VITE_SUPABASE_URL
  }/storage/v1/object/public/avatar-image/${avatarFile}`;

  const isLiked = post.likes.some((like) => like.user_id === user?.id);

  const navigate = useNavigate();

  return (
    <div className="flex justify-center">
      <div className="relative overflow-visible">
        <Spring className="w-[1078px] absolute -top-8  z-1 text-[var(--black)]" />
        <div
          className={twMerge(
            cardLayout,
            "px-[100px] py-[94px] gap-8 bg-[var(--white)]"
          )}>
          <div className="w-[840px] flex items-start pb-[32px]">
            <Back
              className="w-[65px] h-[23px]  text-[var(--black)] cursor-pointer"
              onClick={() => navigate(-1)}
            />
          </div>

          <Writer
            avatar={avatarSrc}
            userName={post.users.nickname}
            date={post.created_at}
          />

          <Contents
            images={post.images ?? []}
            title={post.title}
            content={post.content}
            isLiked={isLiked}
            postId={post.id}
            likeCount={post.likes?.length ?? 0}
            commentsCount={commentsCount}
          />
          <Comments
            onAddComment={() => setCommentsCount((c) => c + 1)}
            onDeleteComment={() => setCommentsCount((c) => c - 1)}
          />
        </div>
      </div>
    </div>
  );
}
