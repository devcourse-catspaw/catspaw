import Button from '../common/Button';
import LabeledInput from '../common/LabeledInput';
import close from '../../assets/images/icon_close.svg';
// import supabase from '../../utils/supabase';
import { useState } from 'react';

export default function CreateRoomModal({
  closeCreateRoomModalHandler,
}: {
  closeCreateRoomModalHandler: () => void;
}) {
  const [name, setName] = useState('');
  const [pw, setPw] = useState('');
  // const [invalid, setInvalid] = useState(false);

  // const checkPassword = () => {
  //   if (pw === password) {
  //     alert('일치합니당');
  //     closeRoomPasswordModalHandler();
  //     // navigate()
  //   } else setInvalid(true);
  // };

  const clickCreateButtonHandler = async () => {
    // const postGameRoom = async () => {
    const res = await fetch(
      'https://neddelxefvltdmbkyymh.functions.supabase.co/createRoomWithLeader',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          game: { room_name: name, room_password: pw },
          player: {},
        }),
      }
    );

    const data = await res.json();
    console.log(data);
    closeCreateRoomModalHandler();
    // };
  };
  return (
    <>
      <div
        className="fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.5)] flex justify-center items-center z-[1000]"
        onClick={closeCreateRoomModalHandler}
      >
        <div
          className="rounded-[6px] w-[519px] pb-11 flex flex-col gap-3 bg-[var(--white)] border-2 border-[var(--black)]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-end pt-5 pr-6">
            <img
              src={close}
              alt="닫기"
              onClick={closeCreateRoomModalHandler}
              className="cursor-pointer"
            />
          </div>
          <div className="flex flex-col justify-center items-center gap-[22px]">
            <div className="font-semibold text-[24px]">게임방 생성</div>
            <div className="flex flex-col gap-3">
              <LabeledInput
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                title="게임방 이름"
                invalidMessage="한 글자 이상 입력해주세요."
                isInvalid={false}
                placeholder="이름 입력"
                className="w-[339px] h-[50px]"
              />
              <LabeledInput
                type="password"
                value={pw}
                onChange={(e) => {
                  setPw(e.target.value);
                  // setInvalid(false);
                }}
                title="게임방 비밀번호"
                // invalidMessage="비밀번호가 일치하지 않습니다."
                isInvalid={false}
                placeholder="비밀번호 입력"
                className="w-[339px] h-[50px] pr-[50px]"
              />
            </div>
            <div className="flex gap-8">
              <Button onClick={clickCreateButtonHandler}>생성</Button>
              <Button onClick={closeCreateRoomModalHandler}>취소</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
