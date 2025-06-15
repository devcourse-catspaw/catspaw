import BaseInput from '../common/BaseInput'
import Button from '../common/Button'

export default function MyPageNameModal() {
  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.5)] flex justify-center items-center z-[1000]">
        <div className="w-[365px] h-[238px] flex flex-col justify-center items-center bg-[var(--white)] border-2 rounded-[6px]">
          <span className="text-[18px] font-semibold">
            닉네임을 변경해주세요.
          </span>
          <BaseInput className="w-[175px]" />
          <span className="text-[12px] text-[var(--red)]">
            *한글 8자, 영문 10자 이하
          </span>
          <Button className="h-[44px] text-[24px] leading-0">확인</Button>
        </div>
      </div>
    </>
  )
}
