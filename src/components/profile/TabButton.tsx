import type { ReactNode } from 'react'

type TabButtonProps = {
  children: ReactNode
  isActive?: boolean
  onClick?: () => void
}

export default function TabButton({
  children,
  isActive,
  onClick,
}: TabButtonProps) {
  return (
    <>
      <div
        onClick={onClick}
        className={`${
          isActive ? 'w-[82px] h-[36px]' : 'w-[82px] h-[29px]'
        } border-2 border-b-0 rounded-t-[6px] flex items-center justify-center cursor-pointer text-[16px] font-semibold`}
      >
        {children}
      </div>
    </>
  )
}
