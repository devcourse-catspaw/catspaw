import { useId, useState, type InputHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';
import pwHide from '../../assets/images/icon_pw_hide.svg';
import pwShow from '../../assets/images/icon_pw_show.svg';

type LabeledInputProps = InputHTMLAttributes<HTMLInputElement> & {
  title?: string;
  className?: string;
  invalidMessage?: string;
  isInvalid?: boolean;
  ref?: React.Ref<HTMLInputElement>;
};
export default function LabeledInput({
  title = '게임방 입력',
  className,
  invalidMessage = '한 글자 이상 입력해주세요.',
  isInvalid = false,
  ref,
  placeholder = '이름 입력',
  id,
  type,
  value,
  onChange,
  ...props
}: LabeledInputProps) {
  const [showPW, setShowPw] = useState(false);
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const LabeledInputStyle =
    'border-2 border-[color:var(--black)] px-4 py-3 text-lg rounded-[6px] w-full font-medium';
  const clickHandler = () => {
    setShowPw(!showPW);
  };
  return (
    <div className="flex flex-col gap-[8px]">
      <label htmlFor={inputId} className="text-base font-semibold">
        {title}
      </label>
      <div className="flex flex-col gap-[4px] relative">
        <input
          type={type === 'password' ? (showPW ? 'text' : 'password') : 'text'}
          ref={ref}
          value={value}
          onChange={onChange}
          id={inputId}
          className={twMerge(LabeledInputStyle, className)}
          placeholder={placeholder}
          {...props}
        />
        {type === 'password' &&
          (showPW ? (
            <img
              src={pwShow}
              alt="보이기"
              onClick={clickHandler}
              className="absolute top-[13px] right-4"
            />
          ) : (
            <img
              src={pwHide}
              alt="숨기기"
              onClick={clickHandler}
              className="absolute top-[13px] right-4"
            />
          ))}
        <p
          className={twMerge(
            'text-[color:var(--red)] text-xs font-regular',
            !isInvalid && 'invisible'
          )}
        >
          *{invalidMessage}
        </p>
      </div>
    </div>
  );
}
