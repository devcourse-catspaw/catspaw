import logo from "../../assets/images/logo_catpaw.svg";
import exit from "../../assets/images/icon_exit.svg";
import { useNavigate } from "react-router";

export default function SingleModeHeader({ disable }: { disable?: boolean }) {
  const navigate = useNavigate();
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
            onClick={() => navigate(-1)}
            className="cursor-pointer"
          />
        )}
      </nav>
    </>
  );
}
