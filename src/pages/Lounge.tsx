import BaseInput from "../components/common/BaseInput";
import Button from "../components/common/Button";
import PostCard from "../components/common/PostCard";
import SubnavItem from "../components/common/SubnavItem";
import kisu from "../assets/images/kisu_ribbon.svg";
import Pen from "../assets/images/icon_pencil.svg?react";
import { useEffect, useState } from "react";
import { Link, useLoaderData } from "react-router-dom";
import { type fetchPosts } from "../routes/loader/post.loader";
import { format } from "date-fns";
import supabase from "../utils/supabase";

export type Posts = NonNullable<Awaited<ReturnType<typeof fetchPosts>>>;

export default function Lounge() {
  const posts = useLoaderData<Posts>();

  console.log(posts[0].likes);

  // const [likes, setLikes] = useState<Likes>([]);

  // const [likeCount, setLikeCount] = useState<number>(0);
  const [isActive, setIsActive] = useState(false);
  const activeHandler = () => {
    setIsActive((prev) => !prev);
  };

  useEffect(() => {
    console.log(posts);
  }, [posts]); // useEffect(() => {
  //   const loadLikes = async () => {
  //     const data = await fetchLikes();
  //     if (!data) return;
  //     setLikes(data || []);
  //   };
  //   loadLikes();
  // }, []);

  // const likeCount = p.likes?.filter((l) => l.post_id === post.id).length;

  //좋아요 수 호출
  // useEffect(() => {
  //   const fetchLikes = async () => {
  //     const { count, error } = await supabase
  //       .from("likes")
  //       .select("*", { count: "exact", head: true })
  //       .eq("post_id", post.id);

  //     if (error) {
  //       console.error("Error fetching like count:", error);
  //       return;
  //     }
  //     setLikeCount(count ?? 0);
  //   };

  //   fetchLikes();
  // }, [post.id]);

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
              <BaseInput className="w-[480px] h-[40px] bg-[var(--white)] rounded-[3px] border-[2px]" />
              <Button
                className="w-[64px] h-[35px] font-medium text-base px-[16px] bg-[var(--white)]"
                onClick={() => console.log("click")}>
                검색
              </Button>
            </div>
          </div>

          {/* (포스트) data 받아와서 렌더링, 서브탭, 검색 결과에 따라 필터링*/}
          <div className="w-[960px] py-[14px] gap-[102px] grid grid-cols-3 ">
            {posts.map((p) => (
              <PostCard
                postId={p.id}
                postTitle={p.title}
                date={format(new Date(p.created_at), "yyyy.MM.dd")}
                contents={p.content}
                userName={p.users.nickname}
                likeCount={p.likes?.filter((l) => l.post_id === post.id).length}
                isLiked={true}
                avatar={p.users.avatar ?? undefined}
                image={
                  p.images && p.images.length > 0 ? p.images[0] : undefined
                }
                springImg="yes"
              />
            ))}
          </div>
        </div>

        {/* TODO 로그인 유저만 볼 수 있게 */}
        <Link
          to="/lounge/add-post"
          className="fixed bottom-10 right-10 w-[80px] h-[80px] border-2 rounded-full shadow-[0px_5px_0px_var(--black)] bg-[var(--white)] flex items-center justify-center z-50">
          <Pen className="text-[var(--black)] w-[40px] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer" />
        </Link>
      </div>
    </div>
  );
}
