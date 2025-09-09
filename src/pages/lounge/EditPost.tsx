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
import { useAuthStore } from "../../stores/authStore";

const cardLayout =
  "w-[1080px]  flex flex-col items-center overflow-visible border-[3px] border-[var(--black)] shadow-[0px_7px_0px_var(--black)] rounded-[11px] ";

type PostDetail = Awaited<ReturnType<typeof fetchExactPost>>;

export default function EditPost() {
  const post = useLoaderData<PostDetail>();
  const user = useAuthStore((s) => s.user)!;
  const inputId = useId();
  const navigate = useNavigate();

  const [title, setTitle] = useState(post?.title);
  const [content, setContent] = useState(post?.content);
  const [imgPath, setImgPath] = useState<string[]>(post?.images ?? []);
  const [files, setFiles] = useState<File[]>([]);

  const addImage = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newFiles = event.target.files ? Array.from(event.target.files) : [];
    if (newFiles.length === 0) return;

    setFiles((prev) => [...prev, ...newFiles]);

    const newPaths = Array.from(files).map((file) => URL.createObjectURL(file));
    setImgPath((prev) => [...prev, ...newPaths]);
  };

  const uploadAll = async (): Promise<string[]> => {
    const uploadPromises = files.map(async (file) => {
      // 파일명 새로 생성
      const ext = file.name.split(".").pop();
      const fileName = `${Date.now()}.${ext}`;
      const filePath = `posts/${user!.id}/${fileName}`;

      // 업로드
      const { error: uploadError } = await supabase.storage
        .from("post-images")
        .upload(filePath, file);

      if (uploadError) console.error("에러", uploadError);

      // 공개 URL 가져오기
      const { data: urlData } = supabase.storage
        .from("post-images")
        .getPublicUrl(filePath);
      return urlData.publicUrl;
    });

    // 모든 업로드가 끝날 때까지 대기 후 URL 리스트 리턴
    return Promise.all(uploadPromises);
  };

  const deleteImage = async (idx: number) => {
    const postImg = post.images![idx];

    const updatedImgPath = imgPath.filter((_, i) => i !== idx);
    const updatedFiles = files.filter((_, i) => i !== idx);

    setImgPath(updatedImgPath);
    setFiles(updatedFiles);

    const deleteImgPath = postImg.split("/").slice(-1);
    const { data, error } = await supabase.storage
      .from("post-images")
      .remove([`posts/${user.id}/${deleteImgPath}`]);

    const updatedPostImg = post.images!.filter((_, i) => i !== idx);

    const { error: updatedError } = await supabase
      .from("posts")
      .update({ images: updatedPostImg })
      .eq("id", post!.id);

    if (updatedError) {
      console.error(updatedError);
      toast.error("수정에 실패했습니다.");
      return;
    }

    post.images = updatedPostImg;

    if (error) console.error(error);
    if (data) console.log(data);
  };

  const handleSubmit = async () => {
    const prevImageUrls = [...post.images!];
    const newImageUrls = await uploadAll();
    const AllImageUrls = [...prevImageUrls, ...newImageUrls];

    const { error } = await supabase
      .from("posts")
      .update({ title, content, images: AllImageUrls })
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
              onChange={(e) => setContent(e.target.value)}
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
