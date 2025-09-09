import BaseInput from "../components/common/BaseInput";
import Button from "../components/common/Button";
import PostCard from "../components/common/PostCard";
import SubnavItem from "../components/common/SubnavItem";
import Pen from "../assets/images/icon_pencil.svg?react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  addLike,
  fetchLikes,
  fetchPosts,
  removeLike,
} from "../routes/loader/post.loader";
import { useAuthStore } from "../stores/authStore";
import toast from "react-hot-toast";
import useInfiniteScroll from "../components/hooks/useInfiniteScroll";

// import kisu from "../assets/images/kisu_.svg";
// import kisuRibbon from "../assets/images/kisu_ribbon.svg";
// import kisuSunglasses from "../assets/images/kisu_sunglasses.svg";
// import kisuCap from "../assets/images/kisu_cap.svg";
// import kisuPippi from "../assets/images/kisu_pippi.svg";
// import kisuTie from "../assets/images/kisu_tie.svg";

export type Likes = Awaited<ReturnType<typeof fetchLikes>>;
export type Posts = NonNullable<Awaited<ReturnType<typeof fetchPosts>>>;

export default function Lounge() {
  const user = useAuthStore((state) => state.user);
  // const posts = useLoaderData<Posts>();
  const navigate = useNavigate();

  const [posts, setPosts] = useState<Posts>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const limit = 12;

  const [isLoading, setIsLoading] = useState(false);

  const [likeCounts, setLikeCounts] = useState<Record<number, number>>({});
  const [allLikes, setAllLikes] = useState<Likes>([]);

  const [input, setInput] = useState("");
  const [isActive, setIsActive] = useState(false);
  const activeHandler = () => {
    setIsActive((prev) => !prev);
  };

  const [searchItem, setSearchItem] = useState("");
  const handleSearch = () => {
    setSearchItem(input);
  };

  const loadMorePosts = async () => {
    if (isLoading) return;

    setIsLoading(true);
    const offset = page * limit;
    const newPosts = await fetchPosts(offset, limit);
    if (!newPosts || newPosts.length < limit) setHasMore(false);
    setPosts((prev) => {
      const prevPostsId = new Set(prev.map((p) => p.id));
      const uniquePosts = newPosts?.filter((p) => !prevPostsId.has(p.id));
      return [...prev, ...uniquePosts!];
    });
    setPage((prev) => prev + 1);
    setIsLoading(false);
  };

  const loaderRef = useInfiniteScroll(loadMorePosts, hasMore, isLoading);

  useEffect(() => {
    loadMorePosts();
  }, []);

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
    const keyword = searchItem.trim().toLowerCase();
    const filtered =
      keyword === ""
        ? posts
        : posts.filter(
            (p) =>
              p.title.toLowerCase().includes(keyword) ||
              p.content.toLowerCase().includes(keyword) ||
              p.users.nickname.toLowerCase().includes(keyword)
          );

    if (isActive) {
      // 인기순: 좋아요 수 우선, 동률이면 댓글 수
      return filtered.slice().sort((a, b) => {
        const likeDiff = (likeCounts[b.id] || 0) - (likeCounts[a.id] || 0);
        if (likeDiff !== 0) return likeDiff;
        return b.comments.length - a.comments.length;
      });
    } else {
      // 최신순
      return filtered
        .slice()
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
    }
  }, [posts, likeCounts, isActive, searchItem]);
  const handleLikeClick = async (postId: number) => {
    if (!user) return toast("로그인 후 이용해주세요.");

    const liked = allLikes.some(
      (l) => l.post_id === postId && l.user_id === user.id
    );

    //롤백 가능한 기존 상태 복사
    const prevLikeCounts = { ...likeCounts };
    const prevAllLikes = [...allLikes];

    try {
      setLikeCounts((prev) => ({
        ...prev,
        [postId]: (prev[postId] || 0) + (liked ? -1 : 1),
      }));

      setAllLikes((prev) =>
        liked
          ? prev.filter((l) => !(l.post_id === postId && l.user_id === user.id))
          : [...prev, { post_id: postId, user_id: user.id } as Likes[number]]
      );

      if (liked) {
        await removeLike(postId, user.id);
      } else {
        await addLike(postId, user.id);
      }

      // const freshLikes = await fetchLikes();

      // setAllLikes(freshLikes);
      // const counts = freshLikes.reduce((acc, l) => {
      //   if (l.post_id !== null) acc[l.post_id] = (acc[l.post_id] || 0) + 1;
      //   return acc;
      // }, {} as Record<number, number>);
      // setLikeCounts(counts);
    } catch (error) {
      setLikeCounts(prevLikeCounts);
      setAllLikes(prevAllLikes);
      console.log(error);
      toast.error("좋아요 처리 중 오류가 발생했습니다.");
    }
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
    <div className="w-full flex justify-center">
      <div className="relative overflow-visible ">
        <div className="flex flex-col px-[160px] gap-[82px] ">
          {/* 서브탭, 검색 */}
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
                placeholder="검색어를 입력해주세요."
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSearch();
                  }
                }}
                className="w-[480px] h-[40px] bg-[var(--white)] rounded-[3px] border-[2px]"
              />
              <Button
                className="w-[64px] h-[35px] font-medium text-base px-[16px] bg-[var(--white)]"
                onClick={handleSearch}>
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
              const allowedAvatars = [
                "kisu_.svg",
                "kisu_ribbon.svg",
                "kisu_sunglasses.svg",
                "kisu_cap.svg",
                "kisu_pippi.svg",
                "kisu_tie.svg",
              ];
              const rawAvatar = p.users!.avatar!;
              const avatarFile = allowedAvatars.includes(rawAvatar)
                ? rawAvatar
                : "kisu_.svg";
              const avatarSrc = `${
                import.meta.env.VITE_SUPABASE_URL
              }/storage/v1/object/public/avatar-image/${avatarFile}`;

              return (
                <PostCard
                  key={p.id}
                  userId={p.user_id}
                  postId={p.id}
                  postTitle={p.title}
                  date={p.created_at}
                  contents={p.content}
                  userName={p.users.nickname}
                  likeCount={likeCounts[p.id] ?? 0}
                  isLiked={isLiked}
                  avatar={avatarSrc}
                  image={p.images && p.images.length > 0 ? p.images[0] : ""}
                  springImg="yes"
                  onLike={() => handleLikeClick(p.id)}
                />
              );
            })}
          </div>
          <div
            ref={loaderRef}
            className="h-12 flex justify-center items-center">
            {isLoading && <span>로딩 중...</span>}
            {!hasMore && <span>모든 글을 불러왔습니다!</span>}
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
