import type { InputHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

interface BaseInputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}
export default function BaseInput({ className, ...props }: BaseInputProps) {
  const baseInputStyle =
    "border-2 border-[color:var(--black)] px-4 py-3 rounded-[3px] w-full text-lg";
  return (
    <>
      <input
        type="text"
        className={twMerge(baseInputStyle, className)}
        placeholder="제시어 입력"
        {...props}
      />
    </>
  );
}
