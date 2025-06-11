import backImg from "../assets/images/background_doodle_2.svg";
import BaseInput from "../components/common/BaseInput";
import Button from "../components/common/Button";
import PostCard from "../components/common/PostCard";
import SubnavItem from "../components/common/SubnavItem";
import kisu from "../assets/images/kisu_ribbon.svg";
import { useState } from "react";

export default function Lounge() {
  const [isActive, setIsActive] = useState(false);

  const activeHandler = () => {
    setIsActive((prev) => !prev);
  };

  return (
    <div className="w-full flex justify-center ">
      <div className="relative overflow-hidden py-[94px]">
        <img
          src={backImg}
          alt="배경이미지"
          className="fixed inset-0 w-full h-full object-cover -z-10"
        />
        <div className="flex flex-col px-[160px] gap-[82px]">
          {/* 서브탭, 검색 */}
          <div className="flex w-[960px] justify-between items-center">
            <div className="w-[210px] h-[49px] flex justify-center">
              <SubnavItem active={!isActive} onClick={activeHandler}>
                최신순
              </SubnavItem>
              <SubnavItem active={isActive} onClick={activeHandler}>
                인기순
              </SubnavItem>
            </div>
            <div className="flex justify-between items-start gap-2 h-[40px]">
              <BaseInput className="w-[480px] h-[40px] bg-[var(--white)] rounded-[3px] border-[2px]" />
              <Button
                className="w-[64px] h-[35px] font-medium text-base px-[16px] bg-[var(--white)]"
                onClick={() => console.log("click")}>
                검색
              </Button>
            </div>
          </div>

          {/* 포스트, data 받아와서 렌더링, 서브탭, 검색 결과에 따라 필터링*/}
          <div className="w-[960px] py-[14px] gap-[102px] grid grid-cols-3 ">
            <PostCard
              postId={1}
              postTitle="잔말말고 파워냉방틀어"
              date="2025.06.09"
              contents="잔말말고 파워냉방틀어 제습 틀 생각말고 무조건 파워냉방으로 틀어"
              userName="헤이야치엘사김용명"
              likeCount={100}
              isLiked={true}
              avatar={kisu}
              image="https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNDA4MDJfMTAy%2FMDAxNzIyNTI2NjI0NTE4.pO3Di13VrBLozxbsBSS1sUB6wYigutsAlh6OMHhbkDAg.dq8IhZAbwwRED9pHmqjIaLQ-6mk711EBOnJicVPs0AUg.JPEG%2FIMG_0177.JPG&type=l340_165"
              springImg="yes"
            />
            <PostCard
              postId={1}
              postTitle="ㅎㅎ"
              date="2025.06.09"
              contents="ai 정답 공유좀.."
              userName="보리꼬리"
              likeCount={12}
              isLiked={false}
              avatar={kisu}
              springImg="yes"
            />
            <PostCard
              postId={1}
              postTitle="잔말말고 파워냉방틀어"
              date="2025.06.09"
              contents="잔말말고 파워냉방틀어 제습 틀 생각말고 무조건 파워냉방으로 틀어"
              userName="헤이야치엘사김용명"
              likeCount={100}
              isLiked={true}
              avatar={kisu}
              image="https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNDA4MDJfMTAy%2FMDAxNzIyNTI2NjI0NTE4.pO3Di13VrBLozxbsBSS1sUB6wYigutsAlh6OMHhbkDAg.dq8IhZAbwwRED9pHmqjIaLQ-6mk711EBOnJicVPs0AUg.JPEG%2FIMG_0177.JPG&type=l340_165"
              springImg="yes"
            />
            <PostCard
              postId={1}
              postTitle="잔말말고 파워냉방틀어"
              date="2025.06.09"
              contents="잔말말고 파워냉방틀어 제습 틀 생각말고 무조건 파워냉방으로 틀어"
              userName="헤이야치엘사김용명"
              likeCount={100}
              isLiked={true}
              avatar={kisu}
              image="https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNDA4MDJfMTAy%2FMDAxNzIyNTI2NjI0NTE4.pO3Di13VrBLozxbsBSS1sUB6wYigutsAlh6OMHhbkDAg.dq8IhZAbwwRED9pHmqjIaLQ-6mk711EBOnJicVPs0AUg.JPEG%2FIMG_0177.JPG&type=l340_165"
              springImg="yes"
            />
            <PostCard
              postId={1}
              postTitle="잔말말고 파워냉방틀어"
              date="2025.06.09"
              contents="잔말말고 파워냉방틀어 제습 틀 생각말고 무조건 파워냉방으로 틀어"
              userName="헤이야치엘사김용명"
              likeCount={100}
              isLiked={true}
              avatar={kisu}
              image="https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNDA4MDJfMTAy%2FMDAxNzIyNTI2NjI0NTE4.pO3Di13VrBLozxbsBSS1sUB6wYigutsAlh6OMHhbkDAg.dq8IhZAbwwRED9pHmqjIaLQ-6mk711EBOnJicVPs0AUg.JPEG%2FIMG_0177.JPG&type=l340_165"
              springImg="yes"
            />
            <PostCard
              postId={1}
              postTitle="잔말말고 파워냉방틀어"
              date="2025.06.09"
              contents="잔말말고 파워냉방틀어 제습 틀 생각말고 무조건 파워냉방으로 틀어"
              userName="헤이야치엘사김용명"
              likeCount={100}
              isLiked={true}
              avatar={kisu}
              image="https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNDA4MDJfMTAy%2FMDAxNzIyNTI2NjI0NTE4.pO3Di13VrBLozxbsBSS1sUB6wYigutsAlh6OMHhbkDAg.dq8IhZAbwwRED9pHmqjIaLQ-6mk711EBOnJicVPs0AUg.JPEG%2FIMG_0177.JPG&type=l340_165"
              springImg="yes"
            />
            <PostCard
              postId={1}
              postTitle="잔말말고 파워냉방틀어"
              date="2025.06.09"
              contents="잔말말고 파워냉방틀어 제습 틀 생각말고 무조건 파워냉방으로 틀어"
              userName="헤이야치엘사김용명"
              likeCount={100}
              isLiked={true}
              avatar={kisu}
              image="https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNDA4MDJfMTAy%2FMDAxNzIyNTI2NjI0NTE4.pO3Di13VrBLozxbsBSS1sUB6wYigutsAlh6OMHhbkDAg.dq8IhZAbwwRED9pHmqjIaLQ-6mk711EBOnJicVPs0AUg.JPEG%2FIMG_0177.JPG&type=l340_165"
              springImg="yes"
            />
            <PostCard
              postId={1}
              postTitle="잔말말고 파워냉방틀어"
              date="2025.06.09"
              contents="잔말말고 파워냉방틀어 제습 틀 생각말고 무조건 파워냉방으로 틀어"
              userName="헤이야치엘사김용명"
              likeCount={100}
              isLiked={true}
              avatar={kisu}
              image="https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNDA4MDJfMTAy%2FMDAxNzIyNTI2NjI0NTE4.pO3Di13VrBLozxbsBSS1sUB6wYigutsAlh6OMHhbkDAg.dq8IhZAbwwRED9pHmqjIaLQ-6mk711EBOnJicVPs0AUg.JPEG%2FIMG_0177.JPG&type=l340_165"
              springImg="yes"
            />
            <PostCard
              postId={1}
              postTitle="잔말말고 파워냉방틀어"
              date="2025.06.09"
              contents="잔말말고 파워냉방틀어 제습 틀 생각말고 무조건 파워냉방으로 틀어"
              userName="헤이야치엘사김용명"
              likeCount={100}
              isLiked={true}
              avatar={kisu}
              image="https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNDA4MDJfMTAy%2FMDAxNzIyNTI2NjI0NTE4.pO3Di13VrBLozxbsBSS1sUB6wYigutsAlh6OMHhbkDAg.dq8IhZAbwwRED9pHmqjIaLQ-6mk711EBOnJicVPs0AUg.JPEG%2FIMG_0177.JPG&type=l340_165"
              springImg="yes"
            />
            <PostCard
              postId={1}
              postTitle="잔말말고 파워냉방틀어"
              date="2025.06.09"
              contents="잔말말고 파워냉방틀어 제습 틀 생각말고 무조건 파워냉방으로 틀어"
              userName="헤이야치엘사김용명"
              likeCount={100}
              isLiked={true}
              avatar={kisu}
              image="https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNDA4MDJfMTAy%2FMDAxNzIyNTI2NjI0NTE4.pO3Di13VrBLozxbsBSS1sUB6wYigutsAlh6OMHhbkDAg.dq8IhZAbwwRED9pHmqjIaLQ-6mk711EBOnJicVPs0AUg.JPEG%2FIMG_0177.JPG&type=l340_165"
              springImg="yes"
            />
            <PostCard
              postId={1}
              postTitle="잔말말고 파워냉방틀어"
              date="2025.06.09"
              contents="잔말말고 파워냉방틀어 제습 틀 생각말고 무조건 파워냉방으로 틀어"
              userName="헤이야치엘사김용명"
              likeCount={100}
              isLiked={true}
              avatar={kisu}
              image="https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNDA4MDJfMTAy%2FMDAxNzIyNTI2NjI0NTE4.pO3Di13VrBLozxbsBSS1sUB6wYigutsAlh6OMHhbkDAg.dq8IhZAbwwRED9pHmqjIaLQ-6mk711EBOnJicVPs0AUg.JPEG%2FIMG_0177.JPG&type=l340_165"
              springImg="yes"
            />
            <PostCard
              postId={1}
              postTitle="잔말말고 파워냉방틀어"
              date="2025.06.09"
              contents="잔말말고 파워냉방틀어 제습 틀 생각말고 무조건 파워냉방으로 틀어"
              userName="헤이야치엘사김용명"
              likeCount={100}
              isLiked={true}
              avatar={kisu}
              image="https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNDA4MDJfMTAy%2FMDAxNzIyNTI2NjI0NTE4.pO3Di13VrBLozxbsBSS1sUB6wYigutsAlh6OMHhbkDAg.dq8IhZAbwwRED9pHmqjIaLQ-6mk711EBOnJicVPs0AUg.JPEG%2FIMG_0177.JPG&type=l340_165"
              springImg="yes"
            />
            <PostCard
              postId={1}
              postTitle="잔말말고 파워냉방틀어"
              date="2025.06.09"
              contents="잔말말고 파워냉방틀어 제습 틀 생각말고 무조건 파워냉방으로 틀어"
              userName="헤이야치엘사김용명"
              likeCount={100}
              isLiked={true}
              avatar={kisu}
              image="https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNDA4MDJfMTAy%2FMDAxNzIyNTI2NjI0NTE4.pO3Di13VrBLozxbsBSS1sUB6wYigutsAlh6OMHhbkDAg.dq8IhZAbwwRED9pHmqjIaLQ-6mk711EBOnJicVPs0AUg.JPEG%2FIMG_0177.JPG&type=l340_165"
              springImg="yes"
            />
            <PostCard
              postId={1}
              postTitle="잔말말고 파워냉방틀어"
              date="2025.06.09"
              contents="잔말말고 파워냉방틀어 제습 틀 생각말고 무조건 파워냉방으로 틀어"
              userName="헤이야치엘사김용명"
              likeCount={100}
              isLiked={true}
              avatar={kisu}
              image="https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNDA4MDJfMTAy%2FMDAxNzIyNTI2NjI0NTE4.pO3Di13VrBLozxbsBSS1sUB6wYigutsAlh6OMHhbkDAg.dq8IhZAbwwRED9pHmqjIaLQ-6mk711EBOnJicVPs0AUg.JPEG%2FIMG_0177.JPG&type=l340_165"
              springImg="yes"
            />
            <PostCard
              postId={1}
              postTitle="잔말말고 파워냉방틀어"
              date="2025.06.09"
              contents="잔말말고 파워냉방틀어 제습 틀 생각말고 무조건 파워냉방으로 틀어"
              userName="헤이야치엘사김용명"
              likeCount={100}
              isLiked={true}
              avatar={kisu}
              image="https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNDA4MDJfMTAy%2FMDAxNzIyNTI2NjI0NTE4.pO3Di13VrBLozxbsBSS1sUB6wYigutsAlh6OMHhbkDAg.dq8IhZAbwwRED9pHmqjIaLQ-6mk711EBOnJicVPs0AUg.JPEG%2FIMG_0177.JPG&type=l340_165"
              springImg="yes"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
