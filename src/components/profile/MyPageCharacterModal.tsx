import { useState } from 'react'
import Button from '../common/Button'
import ChracterSwiper from './ChracterSwiper'

export default function MyPageCharacterModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void
  onSubmit: (selectedImage: string) => void
}) {
  const [selectedImage, setSelectedImage] = useState<string>('')

  const handleChange = () => {
    console.log('선택된 이미지:', selectedImage)
    onSubmit(selectedImage)
    onClose()
  }
  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.5)] flex justify-center items-center z-[1000]">
        <div className="flex flex-col gap-[20px] justify-center items-center w-[519px] h-[426px] bg-[var(--white)] border-2 rounded-[6px]">
          <span className="text-[20px] font-semibold">캐릭터 변경</span>

          <div className="flex w-full justify-center py-[20px]">
            <ChracterSwiper onChange={setSelectedImage} />
          </div>
          <div className="flex gap-[40px] justify-center">
            <Button onClick={onClose} className="w-[118px] h-[44px] leading-0">
              취소
            </Button>
            <Button
              onClick={handleChange}
              className="w-[118px] h-[44px] leading-0"
            >
              변경
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
