import backImg from "../../assets/images/background_doodle_2.svg";
import { Outlet } from "react-router-dom";

export default function LoungeLayout() {
  return (
    <div className="relative overflow-hidden min-h-screen">
      <img
        src={backImg}
        alt="배경 이미지"
        className="fixed inset-0 w-full h-full object-cover -z-10"
      />

      <Outlet />
    </div>
  );
}
