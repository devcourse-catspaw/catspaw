import { useId, type InputHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

interface LabeledInputProps extends InputHTMLAttributes<HTMLInputElement> {
  title?: string;
  className?: string;
  warningText?: string;
  hasError?: boolean;
}
export default function LabeledInput({
  title = "게임방 입력",
  className,
  warningText = "한 글자 이상 입력해주세요.",
  hasError = false,
  placeholder = "이름 입력",
  id,
  ...props
}: LabeledInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const LabeledInputStyle =
    "border-2 border-[color:var(--black)] px-4 py-3 text-lg rounded-[3px] w-full font-medium";
  return (
    <div className="flex flex-col gap-[10px]">
      <label htmlFor={inputId} className="text-base font-semibold">
        {title}
      </label>
      <div className="flex flex-col gap-[4px]">
        <input
          type="text"
          id={inputId}
          className={twMerge(LabeledInputStyle, className)}
          placeholder={placeholder}
          {...props}
        />
        {hasError && (
          <p className="text-[color:var(--red)] text-xs font-regular">
            *{warningText}
          </p>
        )}
      </div>
    </div>
  );
}
