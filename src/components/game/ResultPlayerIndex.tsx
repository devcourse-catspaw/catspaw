import { twMerge } from 'tailwind-merge';

export default function ResultPlayerIndex({
  avatar,
  name,
  isActive,
}: {
  avatar: string;
  name: string;
  isActive: boolean;
}) {
  return (
    <>
      <div
        className={twMerge(
          'flex flex-col items-center p-[10px] gap-1 rounded-[5px] border-[3px] border-r-0 border-[var(--black)]',
          isActive && 'text-[var(--red)]'
        )}
      >
        <div>
          <img
            src={avatar}
            alt="캐릭터"
            className={twMerge(
              isActive ? 'w-[40px] h-[40px]' : 'w-[30px] h-[30px]'
            )}
          />
        </div>
        <div
          className={twMerge(
            'text-[18px] font-bold tracking-widest [writing-mode:vertical-rl] [text-orientation:sideways] rotate-180'
          )}
        >
          {name}
        </div>
      </div>
    </>
  );
}
