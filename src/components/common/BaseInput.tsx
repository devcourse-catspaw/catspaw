import type { InputHTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

type BaseInputProps = InputHTMLAttributes<HTMLInputElement> & {
  className?: string
  placeholder?: string
  ref?: React.Ref<HTMLInputElement>;
}
export default function BaseInput({
  className,
  ref,
  placeholder = '제시어 입력',
  ...props
}: BaseInputProps) {
  const baseInputStyle =
    'border-2 border-[color:var(--black)] px-4 py-3 rounded-[6px] w-full text-lg';
  return (
    <input
      type="text"
      ref={ref}
      className={twMerge(baseInputStyle, className)}
      placeholder={placeholder}
      {...props}
    />
  )
}
