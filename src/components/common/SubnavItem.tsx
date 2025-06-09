import React from "react";

type SubnavItemProps = {
  children: React.ReactNode;
  active: boolean;
  onClick?: () => void;
};

export default function SubnavItem({
  children,
  active,
  onClick,
}: SubnavItemProps) {
  return (
    <button
      className={`
          w-[100px] h-[49px] text-[18px] font-medium
          px-[26px] py-[12px] mx-[20px] cursor-pointer
          ${
            active
              ? "border-b-2 border-[var(--black)] text-[var(--black)] font-medium"
              : "text-[#777777] hover:text-var(--black)"
          }
        `}
      onClick={onClick}>
      {children}
    </button>
  );
}
