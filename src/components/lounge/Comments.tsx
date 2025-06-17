import CommentCard from "./CommentCard";
import kisu from "../../assets/images/kisu_.svg";
import BaseInput from "../common/BaseInput";
import Button from "../common/Button";
import { useState } from "react";
import supabase from "../../utils/supabase";
import { useAuthStore } from "../../stores/authStore";
import type { fetchPostDetail } from "../../routes/loader/post.loader";
import { useLoaderData } from "react-router-dom";

export type PostDetail = NonNullable<
  Awaited<ReturnType<typeof fetchPostDetail>>
>;

// 댓글 하나 타입은 PostDetail.comments 요소 타입
type CommentRow = PostDetail["comments"][number];

export default function Comments() {
  const user = useAuthStore((state) => state.user);
  // loader에서 post.comments, post.id 모두 가져옵니다
  const post = useLoaderData<PostDetail>();
  const { comments: initialComments = [], id: postId } = post;

  const [comments, setComments] = useState<CommentRow[]>(initialComments);
  const [newComment, setNewComment] = useState("");

  const handleAddComment = async () => {
    if (!user || !newComment.trim()) return;

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
    setNewComment("");
  };

  return (
    <div className="flex flex-col gap-[40px]">
      <div className="flex flex-col divide-y divide-[var(--grey-100)]">
        {comments.map((c) => (
          <CommentCard
            key={c.id}
            id={c.id}
            userId={c.users.id}
            userName={c.users.nickname}
            avatar={c.users.avatar ?? kisu}
            date={c.updated_at}
            comment={c.content}
            onDelete={(deletedId: number) =>
              setComments((prev) => prev.filter((x) => x.id !== deletedId))
            }
          />
        ))}
      </div>

      {/* 댓글 입력 */}
      <div className="w-[840px] flex justify-between">
        <BaseInput
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="w-[720px] h-[40px] text-sm font-medium"
          placeholder="댓글을 입력해주세요."
        />
        <Button
          onClick={handleAddComment}
          className="w-[100px] h-[38px] text-[13px] font-bold px-[25px] py-[12px] leading-0">
          댓글달기
        </Button>
      </div>
    </div>
  );
}
