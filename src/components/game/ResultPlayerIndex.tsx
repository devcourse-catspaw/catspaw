import { twMerge } from 'tailwind-merge';

export default function ResultPlayerIndex({
  avatar: Avatar,
  name,
  isActive,
  onClick,
}: {
  avatar: React.FC<React.SVGProps<SVGSVGElement>>;
  name: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <>
      <div
        className={twMerge(
          'flex flex-col items-center w-[50px] py-1 gap-1 rounded-[5px] border-[3px] border-r-0 border-[var(--black)] cursor-pointer',
          isActive && 'text-[var(--red)] w-[60px] p-[10px]'
        )}
        onClick={onClick}
      >
        <div>
          {/* <img
            src={avatar}
            alt="캐릭터"
            className={twMerge(
              isActive ? 'w-[40px] h-[40px]' : 'w-[30px] h-[30px]'
            )}
          /> */}
          <Avatar
            className={twMerge(
              'w-[40px] h-[40px]',
              isActive && 'text-[var(--red)]'
            )}
          />
        </div>
        {isActive && (
          <div
            className={twMerge(
              'text-[18px] font-bold tracking-widest [writing-mode:vertical-rl] [text-orientation:sideways] rotate-180'
            )}
          >
            {name}
          </div>
        )}
      </div>
    </>
  );
}
