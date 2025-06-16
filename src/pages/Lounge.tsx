import BaseInput from "../components/common/BaseInput";
import Button from "../components/common/Button";
import PostCard from "../components/common/PostCard";
import SubnavItem from "../components/common/SubnavItem";
import Pen from "../assets/images/icon_pencil.svg?react";
import { useEffect, useMemo, useState } from "react";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import {
  addLike,
  fetchLikes,
  removeLike,
  type fetchPosts,
} from "../routes/loader/post.loader";
import { useAuthStore } from "../stores/authStore";
import toast from "react-hot-toast";

export type Likes = Awaited<ReturnType<typeof fetchLikes>>;
export type Posts = NonNullable<Awaited<ReturnType<typeof fetchPosts>>>;

export default function Lounge() {
  const user = useAuthStore((state) => state.user);
  const posts = useLoaderData<Posts>();
  const navigate = useNavigate();

  const [likeCounts, setLikeCounts] = useState<Record<number, number>>({});
  const [allLikes, setAllLikes] = useState<Likes>([]);

  const [input, setInput] = useState("");

  const [isActive, setIsActive] = useState(false);
  const activeHandler = () => {
    setIsActive((prev) => !prev);
  };

  useEffect(() => {
    const loadLikes = async () => {
      const data = await fetchLikes();
      if (!data) return;

      setAllLikes(data);

      // reduce로 post_id별 개수 세기
      const counts = data.reduce((acc, like) => {
        const pid = like.post_id;
        if (pid != null) {
          acc[pid] = (acc[pid] || 0) + 1;
        }

        return acc;
      }, {} as Record<number, number>);
      setLikeCounts(counts);
    };

    loadLikes();
  }, []);

  //검색필터, 인기순, 최신순
  const filteredAndSorted = useMemo(() => {
    const keyword = input.trim().toLowerCase();
    const filtered =
      keyword === ""
        ? posts
        : posts.filter(
            (p) =>
              p.title.toLowerCase().includes(keyword) ||
              p.content.toLowerCase().includes(keyword) ||
              p.users.nickname.toLowerCase().includes(keyword)
          );
    return isActive
      ? filtered
          .slice()
          .sort((a, b) => (likeCounts[b.id] || 0) - (likeCounts[a.id] || 0))
      : filtered
          .slice()
          .sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          );
  }, [posts, likeCounts, isActive, input]);

  const handleLikeClick = async (postId: number) => {
    if (!user) return;

    const liked = allLikes.some(
      (l) => l.post_id === postId && l.user_id === user.id
    );

    if (liked) {
      await removeLike(postId, user.id);
    } else {
      await addLike(postId, user.id);
    }

    const freshLikes = await fetchLikes();

    setAllLikes(freshLikes);
    const counts = freshLikes.reduce((acc, l) => {
      if (l.post_id !== null) acc[l.post_id] = (acc[l.post_id] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);
    setLikeCounts(counts);
  };

  const handleAddPostClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      toast("로그인 후 이용해주세요.");
      return;
    }
    navigate("/lounge/add-post");
  };

  return (
    <div className="w-full flex justify-center ">
      <div className="relative overflow-visible py-[94px]">
        <div className="flex flex-col px-[160px] gap-[82px] ">
          {/* 서브탭, 검색 TODO 필터링(날짜, 인기) */}
          <div className="flex w-full justify-between items-center sticky top-0 z-50 bg-[var(--white)]">
            <div className="w-[210px] h-[49px] flex justify-center">
              <SubnavItem active={!isActive} onClick={activeHandler}>
                최신순
              </SubnavItem>
              <SubnavItem active={isActive} onClick={activeHandler}>
                인기순
              </SubnavItem>
            </div>
            <div className="flex justify-between items-start gap-2 h-[40px]">
              <BaseInput
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-[480px] h-[40px] bg-[var(--white)] rounded-[3px] border-[2px]"
              />
              <Button
                className="w-[64px] h-[35px] font-medium text-base px-[16px] bg-[var(--white)]"
                onClick={() => console.log("click")}>
                검색
              </Button>
            </div>
          </div>

          {/* (포스트) data 받아와서 렌더링, 서브탭, 검색 결과에 따라 필터링*/}

          <div className="w-[960px] py-[14px] gap-[102px] grid grid-cols-3 ">
            {filteredAndSorted.map((p) => {
              const isLiked = allLikes.some(
                (l) => l.post_id === p.id && l.user_id === user?.id
              );

              return (
                <PostCard
                  key={p.id}
                  postId={p.id}
                  postTitle={p.title}
                  date={p.created_at}
                  contents={p.content}
                  userName={p.users.nickname}
                  likeCount={likeCounts[p.id] ?? 0}
                  isLiked={isLiked}
                  avatar={p.users.avatar ?? undefined}
                  image={
                    p.images && p.images.length > 0 ? p.images[0] : undefined
                  }
                  springImg="yes"
                  onLike={() => handleLikeClick(p.id)}
                />
              );
            })}
          </div>
        </div>

        <Link
          to="/lounge/add-post"
          onClick={handleAddPostClick}
          className="fixed bottom-10 right-10 w-[80px] h-[80px] border-2 rounded-full shadow-[0px_5px_0px_var(--black)] bg-[var(--white)] flex items-center justify-center z-50">
          <Pen className="text-[var(--black)] w-[40px] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer" />
        </Link>
      </div>
    </div>
  );
}
