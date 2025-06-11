import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import Home from "../pages/Home";
import GameModeSelect from "../pages/game/GameModeSelect";
import GameLayout from "./layouts/GameLayout";
import SingleModePage from "../pages/SingleModePage";
import Login from "../pages/Login";
import AiAnswering from "../pages/AiAnswering";

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
      {
        path: "ai-answering",
        element: <AiAnswering />,
      },
    ],
  },
]);
export default function Router() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}
