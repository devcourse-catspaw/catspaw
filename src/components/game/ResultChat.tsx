import type { HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';
import sketchBook from '../../assets/images/sketchbook.svg';

type ResultChatProps = HTMLAttributes<HTMLDivElement> & {
  userName: string;
  message: string;
  isDrawing: boolean;
};

export default function ResultChat({
  userName,
  message,
  isDrawing,
  className,
  ...props
}: ResultChatProps) {
  const containerClass = twMerge(
    'flex w-full',
    isDrawing ? 'justify-end flex-row-reverse' : 'justify-start',
    className
  );

  const messageClass = twMerge(
    'rounded-[6px] min-w-10 min-h-9 px-4 py-2 break-words text-[color:var(--white)] text-sm max-w-[180px] bg-[color:var(--grey-200-40)]'
  );

  const userNameClass = twMerge(
    'font-medium text-[color:var(--black)] text-sm'
  );

  return (
    <div className={containerClass} {...props}>
      <div
        className={twMerge(
          'flex flex-col w-full',
          isDrawing ? 'items-end gap-1' : 'items-start gap-2'
        )}
      >
        <span className={userNameClass}>{userName}</span>
        {isDrawing ? (
          <div className="flex relative w-[307px] h-[210px] justify-center items-center pt-4 pr-0">
            <div className="w-[290px] h-[175px] flex justify-center items-center">
              {message && <img src={message} alt="그림" />}
            </div>
            <img
              src={sketchBook}
              alt="스케치북"
              className="absolute right-0 bottom-0 w-full h-full -z-50"
            />
          </div>
        ) : (
          <div className={messageClass}>{message}</div>
        )}
      </div>
    </div>
  );
}
