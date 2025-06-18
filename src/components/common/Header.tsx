import { useAuthStore } from "../../stores/authStore";
import LogoCatPaw from "../../assets/images/logo_catpaw.svg?react";
import Button from "./Button";
import { useNavigate } from "react-router-dom";

const buttonStyle =
  "w-[140px] h-[38px] text-sm f text-[var(--black)] leading-none tracking-tight px-[28px]";
export default function Header({
  pageTitle,
  userNickname,
  avatar,
}: {
  pageTitle: string;
  userNickname?: string;
  avatar?: string;
}) {
  const user = useAuthStore((state) => state.user);

  const navigate = useNavigate();

  return (
    <div className="flex h-[60px] justify-between items-center mb-[60px] px-[80px] pt-[32px]">
      <div
        onClick={() => navigate("/")}
        className="flex  h-[60px] justify-start items-center gap-[20px]">
        <LogoCatPaw className="w-[60px] h-[60px] text-[var(--black)] cursor-pointer" />
        <span className="font-semibold text-lg text-[var(--black)]">
          {pageTitle}
        </span>
      </div>
      <div>
        {!user && (
          <div className="flex  h-[52px] items-center">
            <Button onClick={() => navigate("/login")} className={buttonStyle}>
              Join to Draw
            </Button>
          </div>
        )}
        {user && (
          <div
            onClick={() => navigate("/mypage")}
            className="flex w-full h-[52px]  justify-end items-center gap-[8px] cursor-pointer">
            <img className="w-[60px]" src={avatar} alt="프로필사진" />
            <span className="font-semibold text-lg">{userNickname}</span>
          </div>
        )}
      </div>
    </div>
  );
}
