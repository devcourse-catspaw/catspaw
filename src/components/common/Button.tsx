import { twMerge } from 'tailwind-merge';
export default function Button({
  children,
  className,
  onClick,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const buttonBasicStyle =
    'border-2 border-[var(--black)] shadow-[0px_5px_0px_var(--black)] rounded-[6px] text-center cursor-pointer font-semibold text-[18px] text-center align-middle px-[39px] py-[3px] leading-[39px] ';
  return (
    <>
      <button
        className={twMerge(buttonBasicStyle, className)}
        onClick={onClick}
        {...props}
      >
        {children}
      </button>
    </>
  );
}
