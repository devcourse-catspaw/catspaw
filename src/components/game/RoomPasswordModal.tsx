import Button from '../common/Button';
import LabeledInput from '../common/LabeledInput';
import close from '../../assets/images/icon_close.svg';
import { useState } from 'react';

type RoomPasswordModalProps = {
  password: string | null;
  dataHandler: () => void;
  closeRoomPasswordModalHandler: () => void;
};

export default function RoomPasswordModal({
  password,
  dataHandler,
  closeRoomPasswordModalHandler,
}: RoomPasswordModalProps) {
  const [pw, setPw] = useState('');
  const [invalid, setInvalid] = useState(false);

  const checkPassword = () => {
    if (pw === password) {
      console.log('일치합니당');
      closeRoomPasswordModalHandler();
      dataHandler();
    } else setInvalid(true);
  };

  return (
    <>
      <div
        className="fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.5)] flex justify-center items-center z-[1000]"
        onClick={closeRoomPasswordModalHandler}
      >
        <div
          className="rounded-[6px] w-[519px] pb-7 flex flex-col gap-3 bg-[var(--white)] border-2 border-[var(--black)]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-end pt-5 pr-6">
            <img
              src={close}
              alt="닫기"
              onClick={closeRoomPasswordModalHandler}
              className="cursor-pointer"
            />
          </div>
          <div className="flex flex-col justify-center items-center gap-[22px]">
            <div className="font-semibold text-[18px]">
              게임방의 비밀번호를 입력해주세요.
            </div>
            <LabeledInput
              type="password"
              value={pw}
              onChange={(e) => {
                setPw(e.target.value);
                setInvalid(false);
              }}
              title=""
              invalidMessage="비밀번호가 일치하지 않습니다."
              isInvalid={invalid}
              placeholder="비밀번호 입력"
              className="w-[339px] h-[50px] pr-[50px]"
            />
            <Button onClick={checkPassword}>확인</Button>
          </div>
        </div>
      </div>
    </>
  );
}
