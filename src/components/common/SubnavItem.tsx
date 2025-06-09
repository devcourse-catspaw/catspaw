import React from "react";
import { twMerge } from "tailwind-merge";

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
  const subnavBasicStyle =
    "w-[100px] h-[49px] text-[18px] font-medium text-center mx-[20px] cursor-pointer";

  const activeStyle = "border-b-2 border-[var(--black)] text-[var(--black)]";
  const inactiveStyle = "text-[#777777] hover:text-[var(--black)]";

  const className = twMerge(
    subnavBasicStyle,
    active ? activeStyle : inactiveStyle
  );

  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );
}
