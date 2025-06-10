import Comments from "../../components/lounge/Comments";
import Contents from "../../components/lounge/Contents";
import Writer from "../../components/lounge/Writer";
import kisu from "../../assets/images/kisu_.svg";
import Spring from "../../assets/images/spring_big.svg?react";
import Back from "../../assets/images/icon_back_page.svg?react";
// import { twMerge } from "tailwind-merge";
import { useNavigate } from "react-router";
import { twMerge } from "tailwind-merge";
const cardLayout =
  "w-[1080px]  flex flex-col items-center overflow-visible border-[3px] border-[var(--black)] shadow-[0px_7px_0px_var(--black)] rounded-[11px] ";

export default function LoungeDetail() {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center pt-20">
      <div className="relative overflow-visible">
        <Spring className="w-[1078px] absolute -top-8  z-1 text-[var(--black)]" />
        <div className={twMerge(cardLayout, "px-[100px] py-[94px] gap-4")}>
          <div className="w-[840px] flex items-start pb-[32px]">
            <Back
              className="w-[65px] h-[23px]  text-[var(--black)] cursor-pointer"
              onClick={() => navigate(-1)}
            />
          </div>

          <Writer avatar={kisu} userName="김용명씨" date="2025.06.10" />

          <Contents
            title="작업 다 날린거 실화?"
            content="진짜 열심히 했는데 작업 다날림... 진짜.. 너무 ..열심히 했는데... 페이지 하나 퍼블리싱 하나 했는데...... 다 어디갔어...어어엉어어어어어엉ㅇ어엉어어엉어어어어어엉ㅇ어엉어어엉어어어어어엉ㅇ어엉어어엉어어어어어엉ㅇ어엉어어엉어어어어어엉ㅇ어엉어어엉어어어어어엉ㅇ어엉어어엉어어어어어엉ㅇ어엉어어엉어어어어어엉ㅇ어엉어어엉어어어어어엉ㅇ어엉어어엉어어어어어엉ㅇ어엉어어엉어어어어어엉ㅇ어엉어어엉어어어어어엉ㅇ어엉어어엉어어어어어엉ㅇ어엉어어엉어어어어어엉ㅇ어엉어어엉어어어어어엉ㅇ어엉어어엉어어어어어엉ㅇ어엉어어엉어어어어어엉ㅇ어엉어어엉어어어어어엉ㅇ어엉어어엉어어어어어엉ㅇ어엉어어엉어어어어어엉ㅇ어엉어어엉어어어어어엉ㅇ어엉어어엉어어어어어엉ㅇ어엉 "
            isLiked={false}
            likeCount={10}
            commentsCount={1}
          />
          <Comments />
        </div>
      </div>
    </div>
  );
}
