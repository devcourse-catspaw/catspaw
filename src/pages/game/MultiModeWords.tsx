import Button from '../../components/common/Button';
import pawPencil from '../../assets/images/paw_pencil_big.svg';
import doodle from '../../assets/images/background_doodle4.svg';
import NavWithExit from '../../components/common/NavWithExit';
import LabeledInput from '../../components/common/LabeledInput';

export default function MultiModeWords() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center px-20 pt-[14px] relative">
      <NavWithExit title="같이 할 사람~" />
      <div className="">
        <div className="flex flex-col justify-center items-center gap-[22px] rounded-[6px] w-[519px] pb-7 bg-[var(--white)] border-2 border-[var(--black)]">
          <div className="font-semibold text-[18px]">
            게임방의 비밀번호를 입력해주세요.
          </div>
          <LabeledInput
            type="password"
            title=""
            invalidMessage="비밀번호가 일치하지 않습니다."
            isInvalid={true}
            placeholder="비밀번호 입력"
            className="w-[339px] h-[50px] pr-[50px]"
          />
          <Button>확인</Button>
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
