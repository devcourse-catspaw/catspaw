import logo from "../../assets/images/logo_catpaw.svg";
import exit from "../../assets/images/icon_exit.svg";
import { useNavigate } from "react-router";

export default function NavWithExit({ title }: { title?: string }) {
  const navigate = useNavigate();
  return (
    <>
      <nav className="w-full flex justify-between items-center z-50">
        <div className="flex gap-5 items-center">
          <img
            src={logo}
            alt="Cat's Paw 로고"
            className="w-15 cursor-pointer"
            onClick={() => navigate("/")}
          />
          {title && <span className="font-semibold text-lg">{title}</span>}
        </div>
        {!title && (
          <img
            src={exit}
            alt="나가기 버튼"
            className="cursor-pointer"
            onClick={() => navigate('/')}
          />
        )}
      </nav>
    </>
  );
}
