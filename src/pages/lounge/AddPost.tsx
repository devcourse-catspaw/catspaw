import backImg from "../../assets/images/background_doodle_2.svg";
import StashImg from "../../assets/images/icon_stash_image.svg?react";
import Spring from "../../assets/images/spring_big.svg?react";
import { twMerge } from "tailwind-merge";
import LabeledInput from "../../components/common/LabeledInput";
import TextBox from "../../components/common/lounge/TextBox";
import Button from "../../components/common/Button";
import ImageBox from "../../components/common/lounge/ImageBox";
import { useId } from "react";

const cardLayout =
  "w-[1080px]  flex flex-col items-center overflow-visible border-[3px] border-[var(--black)] shadow-[0px_7px_0px_var(--black)] rounded-[11px] ";

export default function AddPost() {
  const inputId = useId();

  return (
    <div className="w-full flex justify-center ">
      <div className="relative overflow-hidden py-[94px]">
        <img
          src={backImg}
          alt="배경이미지"
          className="fixed inset-0 w-full h-full object-cover -z-10"
        />
        <div className="flex justify-center">
          <div className="relative overflow-visible">
            <Spring className="w-[1078px] absolute -top-8  z-1 text-[var(--black)]" />
            <div
              className={twMerge(
                cardLayout,
                "px-[100px] py-[94px] gap-[30px] bg-[var(--white)] "
              )}>
              <div className="w-[984px] h-[29px] text-[24px] font-bold text-center mb-[37px]">
                게시물 작성하기
              </div>
              <LabeledInput
                title="게시물 제목 *"
                placeholder="메시지 입력"
                className="w-[915px] h-[44px]"
              />

              <TextBox
                placeholder="메시지 입력"
                className="w-[915px] h-[200px] align-text-top"
              />
              {/* 이미지 첨부 버튼 */}
              {/* <div className="w-[915px] flex justify-start">
                <div className="border-[2px] rounded-[6px] p">
                  <button className="flex justify-center items-center pl-[2px] pr-[4px] cursor-pointer">
                    <StashImg className="text-[var(--black)]" />
                    <span className="text-sm font-bold">이미지 첨부</span>
                  </button>
                </div>
              </div> */}
              <div className="w-[915px] flex justify-start">
                <div className="border-[2px] rounded-[6px] p">
                  <label
                    htmlFor={inputId}
                    className="flex justify-center items-center pl-[2px] pr-[4px] cursor-pointer text-sm font-bold">
                    <StashImg className="text-[var(--black)]" />
                    이미지 첨부
                  </label>
                  <input
                    id={inputId}
                    type="file"
                    accept="image/*"
                    className="sr-only"
                  />
                </div>
              </div>

              {/* 첨부된 이미지 로드 */}
              <div className="flex justify-start w-[915px] gap-[45px] overflow-x-auto py-2">
                {/* 이미지로드 박스 */}

                <ImageBox image="data:image/jpeg;base64,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" />
              </div>
              <div className="flex justify-end w-[915px] gap-[15px] mt-4">
                <Button className="w-[125px] font-bold text-[var(--black)]">
                  취소
                </Button>
                <Button className="w-[125px] font-bold text-[var(--black)]">
                  저장
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
