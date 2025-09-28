import { useState } from "react";
import { useNavigate } from "react-router";
import logo from "../../assets/images/logo_catpaw.svg";
import exit from "../../assets/images/icon_exit.svg";
import AlertBox from "../common/AlertBox";

export default function SingleModeHeader({ disable }: { disable?: boolean }) {
  const navigate = useNavigate();
  const [showExitAlert, setShowExitAlert] = useState(false);

  const handleExitClick = () => {
    setShowExitAlert(true);
  };

  const handleConfirmExit = () => {
    navigate(-1);
  };

  return (
    <>
      <nav className="w-full flex justify-between items-center">
        <div className="flex gap-5 items-center">
          <img
            src={logo}
            alt="Cat's Paw 로고"
            className="w-15 cursor-pointer"
            onClick={disable ? undefined : () => navigate("/")}
          />
          <span className="font-semibold text-lg">싱글모드</span>
        </div>
        {!disable && (
          <img
            src={exit}
            alt="나가기 버튼"
            onClick={handleExitClick}
            className="cursor-pointer"
          />
        )}
      </nav>

      <AlertBox
        title="게임 나가기"
        content="게임을 종료하시겠습니까? 저장되지 않은 진행 상황은 사라집니다."
        cancel="취소"
        action="확인"
        isOpen={showExitAlert}
        onClose={() => setShowExitAlert(false)}
        actionHandler={handleConfirmExit}
      />
    </>
  );
}
