import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "../pages/Home";
import GameModeSelect from "../pages/game/GameModeSelect";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    hydrateFallbackElement: <h1>Loading ...</h1>,
  },
  {
    path: "/game-select",
    element: <GameModeSelect />,
  },
]);
export default function Router() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}
