import { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

export default function ResultPlayerIndex({
  // avatar: Avatar,
  avatar,
  name,
  isActive,
  onClick,
}: {
  // avatar: React.FC<React.SVGProps<SVGSVGElement>>;
  avatar: string;
  name: string;
  isActive: boolean;
  onClick: () => void;
}) {
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const avatarUrl = avatar
    ? `${
        import.meta.env.VITE_SUPABASE_URL
      }/storage/v1/object/public/avatar-image/${avatar}`
    : '';

  useEffect(() => {
    const loadSvg = async () => {
      const res = await fetch(avatarUrl);
      let text = await res.text();

      text = text.replace(/\s(width|height)="[^"]+"/g, '');

      setSvgContent(text);

      if (isActive) {
        const updatedSvg = text.replace(
          /fill="#[0-9a-fA-F]{3,6}"/g,
          'fill="#f45a5a"'
        );
        setSvgContent(updatedSvg);
      }
    };
    loadSvg();
  }, [avatarUrl, isActive]);

  return (
    <>
      <div
        className={twMerge(
          'flex flex-col items-center  py-1 gap-1 rounded-[5px] border-[3px] border-r-0 border-[var(--black)] cursor-pointer transition-all duration-300 ease-in-out origin-left',
          isActive ? 'text-[var(--red)] w-[60px] p-[10px]' : 'w-[50px]'
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
          {/* <Avatar
            className={twMerge(
              'w-[40px] h-[40px]',
              isActive && 'text-[var(--red)]'
            )}
          /> */}
          <div
            dangerouslySetInnerHTML={{ __html: svgContent || '' }}
            className="w-[40px] h-[40px]"
          />
        </div>
        {isActive && (
          <div
            className={twMerge(
              'text-[18px] font-bold max-h-[140px] truncate tracking-widest [writing-mode:vertical-rl] [text-orientation:sideways] rotate-180'
            )}
          >
            {name}
          </div>
        )}
      </div>
    </>
  );
}
