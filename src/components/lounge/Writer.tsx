import { useState } from "react";
import Cancel from "../../assets/images/answer_wrong_2.svg?react";
import Ellipsis from "../../assets/images/icon_ellipsis.svg?react";
import TimeAgo from "./TimeAgo";
import { useAuthStore } from "../../stores/authStore";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import supabase from "../../utils/supabase";
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
type WriterType = {
  avatar: string;
  userName: string;
  date: string;
};
const moreTextStyle =
  "text-xs font-normal text-[var(--grey-100)] hover:underline-offset-2 cursor-pointer";

export default function Writer({ avatar, userName, date }: WriterType) {
  const user = useAuthStore((state) => state.user);
  const post = useLoaderData<PostDetail>();
  const navigate = useNavigate();

  const isAuthor = user?.id === post.user_id;
  const [showMenu, setShowMenu] = useState(false);

  const handleToggle = () => {
    setShowMenu((prev) => !prev);
  };

  const handleEdit = () => {
    setShowMenu(false);
  };

  const handleDelete = async () => {
    const { error } = await supabase.from("posts").delete().eq("id", post.id);
    if (error) console.error("댓글 삭제 오류", error);

    setShowMenu(false);
    navigate("/lounge");
  };
  return (
    <div className="flex flex-col w-[840px]">
      <div className="flex justify-between items-center pr-6">
        <div className="flex justify-start items-center p-0">
          <img
            className="w-[41px] mr-[5px] color-[var(--black)]"
            src={avatar}
            alt="프로필 사진"
          />
          <div className="flex flex-col justify-center">
            <span className="font-bold text-base mr-[16px]">{userName}</span>
            <TimeAgo timestamp={date} />
          </div>
        </div>

        {/* 더보기 토글 */}
        <div>
          {showMenu && (
            <div className="flex items-center gap-x-2">
              <div className="flex gap-x-1">
                <Link
                  to="/lounge/edit-post"
                  className={moreTextStyle}
                  onClick={handleEdit}>
                  수정
                </Link>
                <span className={moreTextStyle}>|</span>
                <span className={moreTextStyle} onClick={handleDelete}>
                  삭제
                </span>
              </div>
              <span>
                <Cancel
                  className="w-[8px] cursor-pointer text-[var(--grey-100)]"
                  onClick={() => handleDelete}
                />
              </span>
            </div>
          )}

          {isAuthor && (
            <span
              onClick={handleToggle}
              className="cursor-pointer text-[var(--black)] inline-flex items-center">
              <Ellipsis className="w-[16px] h-[16px] fill-current" />
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
