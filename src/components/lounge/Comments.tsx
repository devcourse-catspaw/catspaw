import CommentCard from "./CommentCard";
import kisu from "../../assets/images/kisu_.svg";
import BaseInput from "../common/BaseInput";
import Button from "../common/Button";
import { useState } from "react";
import supabase from "../../utils/supabase";
import { useAuthStore } from "../../stores/authStore";
import type { fetchPostDetail } from "../../routes/loader/post.loader";
import { useLoaderData } from "react-router-dom";
import toast from "react-hot-toast";

export type PostDetail = NonNullable<
  Awaited<ReturnType<typeof fetchPostDetail>>
>;

// 댓글 하나 타입은 PostDetail.comments 요소 타입
type CommentRow = PostDetail["comments"][number];

export default function Comments({
  onAddComment,
  onDeleteComment,
}: {
  onAddComment: () => void;
  onDeleteComment: () => void;
}) {
  const user = useAuthStore((state) => state.user);

  // loader에서 post.comments, post.id 모두 가져옵니다
  const post = useLoaderData<PostDetail>();
  const { comments: initialComments = [], id: postId } = post;

  const [comments, setComments] = useState<CommentRow[]>(initialComments);
  const [newComment, setNewComment] = useState("");

  const allowedAvatars = [
    "kisu_.svg",
    "kisu_ribbon.svg",
    "kisu_sunglasses.svg",
    "kisu_cap.svg",
    "kisu_pippi.svg",
    "kisu_tie.svg",
  ];

  const handleAddComment = async () => {
    if (!user) return toast.error("로그인 후 이용해주세요!");
    if (!newComment.trim()) return toast("글 작성 후 등록해주세요!");

    // insert 후 users relation까지 함께 select
    const { data, error } = await supabase
      .from("comments")
      .insert([
        {
          post_id: postId,
          content: newComment,
          user_id: user.id,
        },
      ])
      .select("*, users(id, nickname, avatar)")
      .single();

    if (error || !data) {
      console.error("댓글 추가 실패", error);
      return;
    }

    // data 타입이 CommentRow 이므로 바로 추가 가능
    setComments((prev) => [...prev, data]);
    onAddComment();
    setNewComment("");
  };

  return (
    <div className="flex flex-col gap-[40px]">
      <div className="flex flex-col divide-y divide-[var(--grey-100)]">
        {comments.map((c) => {
          const rawAvatar = c.users.avatar;

          const avatarFile =
            rawAvatar && allowedAvatars.includes(rawAvatar)
              ? rawAvatar
              : "kisu_.svg";

          const avatarSrc = `${
            import.meta.env.VITE_SUPABASE_URL
          }/storage/v1/object/public/avatar-image/${avatarFile}`;

          return (
            <CommentCard
              key={c.id}
              id={c.id}
              userId={c.users.id}
              userName={c.users.nickname}
              avatar={avatarSrc}
              date={c.updated_at}
              comment={c.content}
              onDelete={(deletedId) => {
                setComments((prev) => prev.filter((x) => x.id !== deletedId));
                onDeleteComment();
              }}
            />
          );
        })}
      </div>

      {/* 댓글 입력 */}
      <form
        className="w-[840px] flex justify-between"
        onSubmit={(e) => {
          e.preventDefault();
          handleAddComment();
        }}>
        <BaseInput
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="w-[720px] h-[40px] text-sm font-medium"
          placeholder="댓글을 입력해주세요."
        />
        <Button
          // onClick={handleAddComment}
          className="w-[100px] h-[38px] text-[13px] font-bold px-[25px] py-[12px] leading-0">
          댓글달기
        </Button>
      </form>
    </div>
  );
}
