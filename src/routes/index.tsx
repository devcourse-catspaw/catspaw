import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Home from "../pages/Home";
import GameModeSelect from "../pages/game/GameModeSelect";
import GameLayout from "./layouts/GameLayout";
import SingleModePage from "../pages/SingleModePage";
import Login from "../pages/Login";
import useAuthInit from "./../utils/useAuthInit";
import LoungeLayout from "./layouts/LoungeLayout";
import LoungeDetail from "../pages/lounge/LoungeDetail";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    hydrateFallbackElement: <h1>Loading ...</h1>,
  },
  {
    path: "/login",
    element: <Login />,
    hydrateFallbackElement: <h1>Loading ...</h1>,
  },
  {
    path: "/game",
    element: <GameLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="select" replace />,
      },
      {
        path: "select",
        element: <GameModeSelect />,
      },
      {
        path: "single",
        element: <SingleModePage />,
      },
    ],
  },
  {
    path: "/lounge",
    element: <LoungeLayout />,
    children: [
      // { index: true, element: <Lounge /> },
      { path: "post/:id", element: <LoungeDetail /> },
      // { path: "add-post", element: <AddPost /> },
    ],
  },
]);
export default function Router() {
  useAuthInit();
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}
