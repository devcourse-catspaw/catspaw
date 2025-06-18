import Button from '../common/Button';
import LabeledInput from '../common/LabeledInput';
import close from '../../assets/images/icon_close.svg';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import supabase from '../../utils/supabase';
import { useAuthStore } from '../../stores/authStore';
import toast from 'react-hot-toast';

export default function ResultShareModal({
  imageUrl,
  closeResultShareModalHandler,
}: {
  imageUrl: string;
  closeResultShareModalHandler: () => void;
}) {
  const { user } = useAuthStore();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [invalid, setInvalid] = useState([false, false]);

  const checkValidation = () => {
    if (title.trim() === '') {
      setInvalid((prev) => [true, prev[1]]);
    }
    if (content.trim() === '') {
      setInvalid((prev) => [prev[0], true]);
    }
    if (title.trim() !== '' && content.trim() !== '') {
      // console.log('게시합니당');
      clickCreateButtonHandler();
      closeResultShareModalHandler();
    }
  };

  const base64ToBlob = (base64: string, contentType = 'image/png'): Blob => {
    const byteCharacters = atob(base64.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length)
      .fill(0)
      .map((_, i) => byteCharacters.charCodeAt(i));
    const byteArray = new Uint8Array(byteNumbers);

    return new Blob([byteArray], { type: contentType });
  };

  const uploadImageToStorage = async (url: string): Promise<string | null> => {
    const blob = base64ToBlob(url, 'image/png');
    const fileName = `screenshot-${Date.now()}.png`;

    const { data, error } = await supabase.storage
      .from('post-images')
      .upload(fileName, blob, {
        contentType: 'image/png',
        upsert: false,
      });

    console.log(data);

    if (error) {
      console.error('Storage upload error:', error.message);
      return null;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('post-images').getPublicUrl(fileName);

    return publicUrl;
  };

  const clickCreateButtonHandler = async () => {
    if (!user) {
      toast.error('로그인이 필요합니다!');
      return;
    }

    const storageImageUrl = await uploadImageToStorage(imageUrl);
    if (!storageImageUrl) return;

    const { data, error } = await supabase
      .from('posts')
      .insert([
        {
          title,
          content,
          images: [storageImageUrl],
          user_id: user?.id,
        },
      ])
      .select();

    if (data) {
      toast('게시물이 등록되었습니다!');
      closeResultShareModalHandler();
    }

    if (error) {
      console.log('에러가 발생했습니다.');
      console.error('Post insert error:', error.message);
    }
  };

  return (
    <>
      <div
        className="fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.5)] flex justify-center items-center z-[1000]"
        onClick={closeResultShareModalHandler}
      >
        <div
          className="rounded-[6px] w-[840px] pb-11 flex flex-col gap-3 bg-[var(--white)] border-2 border-[var(--black)]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-end pt-5 pr-6">
            <img
              src={close}
              alt="닫기"
              onClick={closeResultShareModalHandler}
              className="cursor-pointer"
            />
          </div>
          <div className="flex flex-col justify-center items-center gap-[38px] px-[57px]">
            <div className="font-bold text-xl">게임 결과 공유하기</div>
            <div className="flex gap-12">
              <div className="flex items-start w-[300px] min-h-[300px]">
                <img src={imageUrl} alt="공유 이미지" />
              </div>
              <div className="flex flex-col items-end gap-3">
                <div className="flex flex-col gap-3">
                  <LabeledInput
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      setInvalid((prev) => [false, prev[1]]);
                    }}
                    title="게시물 제목"
                    invalidMessage="한 글자 이상 입력해주세요."
                    isInvalid={invalid[0]}
                    placeholder="제목 입력"
                    className="w-[388px] h-[50px]"
                  />
                  <div className="flex flex-col gap-[8px]">
                    <label
                      htmlFor="content"
                      className="text-base font-semibold"
                    >
                      게시물 내용
                    </label>
                    <textarea
                      name="contentArea"
                      id="content"
                      value={content}
                      onChange={(e) => {
                        setContent(e.target.value);
                        setInvalid((prev) => [prev[0], false]);
                      }}
                      placeholder="내용 입력"
                      className="border-2 border-[var(--black)] px-4 py-3 text-lg rounded-[6px] w-[388px] h-[127px] font-medium"
                    />
                    <p
                      className={twMerge(
                        'text-[color:var(--red)] text-xs font-regular',
                        !invalid[1] && 'invisible'
                      )}
                    >
                      *한 글자 이상 입력해주세요.
                    </p>
                  </div>
                </div>
                <div className="flex gap-8">
                  <Button onClick={checkValidation}>저장</Button>
                  <Button onClick={closeResultShareModalHandler}>취소</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
