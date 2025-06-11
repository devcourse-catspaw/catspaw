import CommentCard from "./CommentCard";
import kisu from "../../assets/images/kisu_.svg";
import BaseInput from "../common/BaseInput";
import Button from "../common/Button";

export default function Comments() {
  return (
    <>
      {/* 댓글 렌더링 */}
      <div className=" flex flex-col gap-[40px]">
        <div className="flex flex-col justify-between divide-y divide-[var(--grey-100)]">
          <CommentCard
            userName="ㅎㅎ"
            avatar={kisu}
            date="5분전"
            comment="ㅍ...파이팅....."
          />
          <CommentCard
            userName="hihihihi"
            avatar={kisu}
            date="5분전"
            comment="ㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋ"
          />
          <CommentCard
            userName="qkrwnsrb"
            avatar={kisu}
            date="5분전"
            comment="ㅉ"
          />
          <CommentCard
            userName="영서쓰"
            avatar={kisu}
            date="5분전"
            comment="힘내요"
          />
        </div>

        {/* 댓글 입력 */}
        <div className="w-[840px] flex justify-between">
          <BaseInput
            className="w-[720px] h-[40px] text-sm font-medium "
            placeholder="댓글을 입력해주세요."
          />
          <Button className="w-[100px] h-[38px] text-[13px] font-bold px-[25px] py-[12px] leading-0">
            댓글달기
          </Button>
        </div>
      </div>
    </>
  );
}
