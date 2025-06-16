import backImg from "../../assets/images/background_doodle_2.svg";
import { Outlet } from "react-router-dom";

export default function LoungeLayout() {
  return (
    <div className="relative min-h-screen">
      <img
        src={backImg}
        alt="배경 이미지"
        className="fixed left-[160px] top-[140px] w-auto h-auto transform scale-x-[1.3] -z-10"
      />

      <Outlet />
    </div>
  );
}
