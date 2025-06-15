import CommentCard from "./CommentCard";
import kisu from "../../assets/images/kisu_.svg";
import BaseInput from "../common/BaseInput";
import Button from "../common/Button";
import type { fetchPostDetail } from "../../routes/loader/post.loader";
import { useState } from "react";
import supabase from "../../utils/supabase";

type PostDetail = Awaited<ReturnType<typeof fetchPostDetail>>;
type CommentRow = PostDetail["comments"][number];
type CommentsProps = {
  postId: number;
  initialComments: CommentRow[];
};

export default function Comments({ postId, initialComments }: CommentsProps) {
  const [comments, setComments] = useState<CommentRow[]>(initialComments);
  const [newComment, setNewComment] = useState("");

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    //TODO 오류 확인 필요
    const { data, error } = await supabase
      .from("comments")
      .insert([
        {
          post_id: postId,
          content: newComment,
        },
      ])
      .select()
      .single();

    if (error || !data) {
      console.error("댓글 추가 실패", error);
      return;
    }

    // 2) 로컬 배열에 추가 (optimistic UI)
    setComments((prev) => [...prev, data]);
    setNewComment("");
  };

  return (
    <>
      {" "}
      q{/* 댓글 렌더링 */}
      <div className=" flex flex-col gap-[40px]">
        <div className="flex flex-col justify-between divide-y divide-[var(--grey-100)]">
          {comments.map((c) => (
            <CommentCard
              key={c.id}
              id={c.id}
              userId={c.users.id}
              userName={c.userName}
              avatar={c.avatar}
              date={c.date}
              comment={c.comment}
              onDelete={() => (deletedId: string) =>
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
