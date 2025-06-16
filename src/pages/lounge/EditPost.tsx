import StashImg from "../../assets/images/icon_stash_image.svg?react";
import Spring from "../../assets/images/spring_big.svg?react";
import { twMerge } from "tailwind-merge";
import LabeledInput from "../../components/common/LabeledInput";
import TextBox from "../../components/lounge/TextBox";
import Button from "../../components/common/Button";
import ImageBox from "../../components/lounge/ImageBox";
import { useId, useState, type ChangeEvent } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import supabase from "../../utils/supabase";
import toast from "react-hot-toast";
import type { fetchExactPost } from "../../routes/loader/post.loader";

const cardLayout =
  "w-[1080px]  flex flex-col items-center overflow-visible border-[3px] border-[var(--black)] shadow-[0px_7px_0px_var(--black)] rounded-[11px] ";

type PostDetail = Awaited<ReturnType<typeof fetchExactPost>>;

export default function EditPost() {
  const post = useLoaderData<PostDetail>();
  // const user = useAuthStore((s) => s.user)!;
  const inputId = useId();
  const navigate = useNavigate();

  const [title, setTitle] = useState(post?.title);
  const [content, setContent] = useState(post?.content);
  const [imgPath, setImgPath] = useState<string[]>(post?.images ?? []);

  const addImage = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newPaths = Array.from(files).map((file) => URL.createObjectURL(file));
    setImgPath((prev) => [...prev, ...newPaths]);
  };

  const deleteImage = (idx: number) => {
    setImgPath((p) => p.filter((_, i) => i !== idx));
  };

  const handleSubmit = async () => {
    const { error } = await supabase
      .from("posts")
      .update({ title, content, images: imgPath })
      .eq("id", post!.id);

    if (error) {
      console.error(error);
      toast.error("수정에 실패했습니다.");
      return;
    }
    setTitle(title);
    setContent(content);
    setImgPath(imgPath);
    toast("수정이 완료되었습니다!");
    navigate("/lounge");
  };

  const handleCancel = () => {
    navigate("/lounge");
  };
  return (
    <div className="w-full flex justify-center ">
      <div className="flex justify-center">
        <div className="relative overflow-visible">
          <Spring className="w-[1078px] absolute -top-8  z-1 text-[var(--black)]" />
          <div
            className={twMerge(
              cardLayout,
              "px-[100px] py-[94px] gap-[30px] bg-[var(--white)] "
            )}>
            <div className="w-[984px] h-[29px] text-[24px] font-bold text-center mb-[37px]">
              게시물 수정하기
            </div>
            <LabeledInput
              title="게시물 제목 *"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-[915px] h-[44px]"
            />

            <TextBox
              value={content}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="내용 입력"
              className="w-[915px] h-[200px] align-text-top"
            />

            <div className="w-[915px] flex justify-start">
              <div className="border-[2px] rounded-[6px] cursor-pointer">
                <label
                  htmlFor={inputId}
                  className="flex justify-center items-center px-4 py-[5px] cursor-pointer text-sm font-bold">
                  <StashImg className="text-[var(--black)]" />
                  이미지 첨부
                </label>
                <input
                  id={inputId}
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={addImage}
                />
              </div>
            </div>

            {/* 첨부된 이미지 로드 */}
            <div className="flex justify-start w-[915px] gap-x-[45px] overflow-x-auto py-2">
              {/* 이미지로드 박스 */}
              {imgPath.length > 0
                ? imgPath.map((src, idx) => (
                    <ImageBox
                      image={src}
                      key={idx}
                      onDelete={() => deleteImage(idx)}
                    />
                  ))
                : ""}
            </div>
            <div className="flex justify-end w-[915px] gap-[15px] mt-4">
              <Button
                onClick={handleCancel}
                className="w-[125px] font-bold text-[var(--black)]">
                취소
              </Button>
              <Button
                onClick={handleSubmit}
                className="w-[125px] font-bold text-[var(--black)]">
                수정
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
