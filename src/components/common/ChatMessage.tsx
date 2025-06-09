import type { HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

type ChatMessageProps = HTMLAttributes<HTMLDivElement> & {
  userName: string;
  message: string;
  isMine: boolean;
  size?: "small" | "large";
};

export default function ChatMessage({
  userName,
  message,
  isMine,
  size = "small",
  className,
  ...props
}: ChatMessageProps) {
  const containerClass = twMerge(
    "flex w-full",
    isMine ? "justify-end flex-row-reverse" : "justify-start",
    className
  );

  const messageClass = twMerge(
    "rounded-[6px] px-4 py-2 break-words text-[color:var(--white)]",
    size === "small" ? "text-sm max-w-[180px]" : "text-base max-w-[320px]",
    isMine ? "bg-[color:var(--blue)]" : "bg-[color:var(--grey-200-40)]"
  );

  const userNameClass = twMerge(
    "font-bold text-[color:var(--black)] text-base"
  );

  return (
    <div className={containerClass} {...props}>
      <div
        className={twMerge(
          "flex flex-col w-full gap-2",
          isMine ? "items-end" : "items-start"
        )}
      >
        <span className={userNameClass}>{userName}</span>
        <div className={messageClass}>{message}</div>
      </div>
    </div>
  );
}
