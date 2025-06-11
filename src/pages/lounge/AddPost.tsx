import backImg from "../../assets/images/background_doodle.svg";
import Spring from "../../assets/images/spring_big.svg?react";
import { twMerge } from "tailwind-merge";
import LabeledInput from "../../components/common/LabeledInput";

const cardLayout =
  "w-[1080px]  flex flex-col items-center overflow-visible border-[3px] border-[var(--black)] shadow-[0px_7px_0px_var(--black)] rounded-[11px] ";

export default function AddPost() {
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
                "px-[100px] py-[94px] gap-4 bg-[var(--white)]"
              )}>
              <div className="w-[984px] h-[29px] text-[24px] font-bold text-center">
                게시물 작성하기
              </div>
              <LabeledInput
                title="게시물 제목 *"
                placeholder="메시지 입력"
                className="w-[915px] h-[44px]"
              />
              <LabeledInput
                title="게시물 제목 *"
                placeholder="메시지 입력"
                className="w-[915px] h-[200px] align-text-top"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
