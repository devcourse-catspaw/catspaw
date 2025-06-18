import backImg from "../../assets/images/background_doodle_2.svg";
import { Outlet, useLoaderData, useLocation } from "react-router-dom";
import Header from "../../components/common/Header";
import { useAuthStore } from "../../stores/authStore";
import type { fetchUsers } from "../loader/post.loader";
import { useEffect } from "react";

export type UsersProfile = NonNullable<Awaited<ReturnType<typeof fetchUsers>>>;

export default function LoungeLayout() {
  const users = useLoaderData<UsersProfile>();
  const user = useAuthStore((state) => state.user);

  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  const me = users.find((u) => u.id === user?.id) ?? null;

  const allowedAvatars = [
    "kisu_.svg",
    "kisu_ribbon.svg",
    "kisu_sunglasses.svg",
    "kisu_cap.svg",
    "kisu_pippi.svg",
    "kisu_tie.svg",
  ];

  const avatarFile =
    me?.avatar && allowedAvatars.includes(me.avatar) ? me.avatar : "kisu_.svg";
  const avatarSrc = `${
    import.meta.env.VITE_SUPABASE_URL
  }/storage/v1/object/public/avatar-image/${avatarFile}`;

  // const myAvatar = me?.avatar
  //   ? `${
  //       import.meta.env.VITE_SUPABASE_URL
  //     }/storage/v1/object/public/avatar-image/${me.avatar}`
  //   : "kisu_.svg";
  return (
    <div className="relative min-h-screen w-full flex flex-col pb-[80px]">
      <Header
        pageTitle="라운지"
        avatar={avatarSrc}
        userNickname={me?.nickname}
      />
      <img
        src={backImg}
        alt="배경 이미지"
        className="fixed left-[90px] top-[340px] w-full h-auto transform  -z-10"
      />
      <Outlet />
    </div>
  );
}
