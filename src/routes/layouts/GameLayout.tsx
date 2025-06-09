import { Outlet } from "react-router";
import MusicToggleButton from "../../components/common/MusicToggleButton";

export default function GameLayout() {
  return (
    <>
      <Outlet />
      <MusicToggleButton />
    </>
  );
}
