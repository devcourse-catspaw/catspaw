import CommentCard from "./CommentCard";
import kisu from "../../assets/images/kisu_.svg";
import BaseInput from "../common/BaseInput";
import Button from "../common/Button";
import type { fetchPostDetail } from "../../routes/loader/post.loader";
import { useState } from "react";
import supabase from "../../utils/supabase";
import { useAuthStore } from "../../stores/authStore";

type PostDetail = Awaited<ReturnType<typeof fetchPostDetail>>;
//TODO 오류 확인 필요
type CommentRow = PostDetail["comments"][number];

// type CommentRow = {
//   content: string;
//   created_at: string;
//   id: number;
//   post_id: number;
//   updated_at: string;
//   user_id: string;
//   userName: string;
//   avatar: string;
//   date: string;
//   comment: string;
// };
type CommentsProps = {
  postId: number;
  initialComments: CommentRow[];
};

export default function Comments({ postId, initialComments }: CommentsProps) {
  const user = useAuthStore((state) => state.user);
  const [comments, setComments] = useState<CommentRow[]>(initialComments);
  const [newComment, setNewComment] = useState("");

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    console.log(comments);

    const { data, error } = await supabase
      .from("comments")
      .insert([
        {
          post_id: postId,
          content: newComment,
          user_id: user!.id,
        },
      ])
      .select();
    // .single();

    if (error || !data) {
      console.error("댓글 추가 실패", error);
      return;
    }

    // 로컬 배열에 추가 (optimistic UI)
    setComments((prev) => [...prev, data]);
    setNewComment("");
    console.log(comments);
  };

  return (
    <>
      {/* 댓글 렌더링 */}
      <div className=" flex flex-col gap-[40px]">
        <div className="flex flex-col justify-between divide-y divide-[var(--grey-100)]">
          {comments.map((c, idx) => (
            <CommentCard
              key={`${c.users.id}-${idx}`}
              id={c.id}
              userId={c.users.id}
              userName={c.users.nickname}
              avatar={kisu}
              date={c.updated_at}
              comment={c.content}
              onDelete={() => (deletedId: number) =>
                setComments((prev) => prev.filter((x) => x.id !== deletedId))}
            />
          ))}
        </div>

        {/* 댓글 입력 */}
        <div className="w-[840px] flex justify-between">
          <BaseInput
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-[720px] h-[40px] text-sm font-medium "
            placeholder="댓글을 입력해주세요."
          />
          <Button
            onClick={handleAddComment}
            className="w-[100px] h-[38px] text-[13px] font-bold px-[25px] py-[12px] leading-0">
            댓글달기
          </Button>
        </div>
      </div>
    </>
  );
}
