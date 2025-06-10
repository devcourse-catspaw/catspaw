import Button from '../../components/common/Button';
import pawPencil from '../../assets/images/paw_pencil_big.svg';
import doodle from '../../assets/images/background_doodle4.svg';
import NavWithExit from '../../components/common/NavWithExit';
import LabeledInput from '../../components/common/LabeledInput';
import { useState } from 'react';

export default function MultiModeWords() {
  const [word, setWord] = useState('');
  const [invalid, setInvalid] = useState(false);

  const checkValidation = () => {
    if (word.trim() !== '') {
      alert('이동합니당');
      // 제시어 저장
      // navigate()
    } else setInvalid(true);
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center px-20 pt-[14px] relative">
      <NavWithExit title="같이 할 사람~" />
      <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col justify-center items-center gap-[22px] rounded-[6px] w-[711px] py-11 bg-[var(--white)] border-2 border-[var(--black)]">
          <div className="font-semibold text-[22px]">
            다른 플레이어가 그릴 제시어를 설정해주세요.
          </div>
          <LabeledInput
            value={word}
            onChange={(e) => {
              setWord(e.target.value);
              setInvalid(false);
            }}
            title=""
            invalidMessage="한 단어로 설정해주세요."
            isInvalid={invalid}
            placeholder="제시어 입력"
            className="w-[500px] h-[50px] pr-[50px]"
          />
          <Button onClick={checkValidation} className="w-30 h-11 px-0 py-0">
            제출
          </Button>
        </div>
      </div>
      <img
        src={pawPencil}
        alt="paw pencil 이미지"
        className="fixed bottom-25 right-0 -z-10"
      />
      <img
        src={doodle}
        alt="그림 이미지"
        className="fixed bottom-[-150px] right-[150px] w-[3000px] h-[1000px] -z-10"
      />
    </div>
  );
}
