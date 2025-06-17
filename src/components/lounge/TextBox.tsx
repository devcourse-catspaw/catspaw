import { useId, type TextareaHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

const LabeledInputStyle =
  "border-2 border-[color:var(--black)] px-4 py-3 text-lg rounded-[6px] w-full font-medium";

type LabeledInputProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  title?: string;
  className?: string;
  invalidMessage?: string;
  isInvalid?: boolean;
};

export default function TextBox({
  className,
  invalidMessage = "한 글자 이상 입력해주세요.",
  isInvalid = false,
  placeholder = "이름 입력",
  id,
  ...props
}: LabeledInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className="flex flex-col gap-[8px]">
      <label htmlFor={inputId} className="text-base font-semibold">
        게시물 내용 *
      </label>
      <div className="flex flex-col gap-[4px] relative">
        <textarea
          id={inputId}
          className={twMerge(LabeledInputStyle, className)}
          placeholder={placeholder}
          {...props}></textarea>
        {isInvalid && (
          <p className="text-[color:var(--red)] text-xs font-regular">
            *{invalidMessage}
          </p>
        )}
      </div>
    </div>
  );
}
