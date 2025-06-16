import BaseInput from '../common/BaseInput'
import Button from '../common/Button'
import icon_close from '../../assets/images/icon_close.svg'
import { useState } from 'react'

export default function MyPageNameModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void
  onSubmit: (changedName: string) => void
}) {
  const [changedName, setChangedName] = useState<string>(null)

  const handleChange = () => {
    console.log('바뀐 이름:', changedName)
    onSubmit(changedName)
    onClose()
  }
  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.5)] flex justify-center items-center z-[1000]">
        <div className="relative w-[365px] h-[238px] flex flex-col gap-[14px] justify-center items-center bg-[var(--white)] border-2 rounded-[6px]">
          <img
            onClick={onClose}
            className="absolute right-[16px] top-[16px]"
            src={icon_close}
            alt="icon_close"
          />
          <span className="text-[18px] font-semibold mb-[5px]">
            닉네임을 변경해주세요.
          </span>
          <div className="flex flex-col gap-[5px] justify-center items-center">
            <BaseInput
              onChange={(e) => setChangedName(e.target.value)}
              className="w-[185px] h-[50px]"
              placeholder="닉네임 입력"
            />
            <span className="text-[12px] text-[var(--red)]">
              *한글 8자, 영문 10자 이하
            </span>
          </div>
          <Button
            onClick={handleChange}
            className="h-[40px] text-[20px] leading-0"
          >
            확인
          </Button>
        </div>
      </div>
    </>
  )
}
