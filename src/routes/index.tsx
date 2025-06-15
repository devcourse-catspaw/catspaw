import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import Home from "../pages/Home";
import GameModeSelect from "../pages/game/GameModeSelect";
import GameLayout from "./layouts/GameLayout";
import SingleModePage from "../pages/SingleModePage";
import Login from "../pages/Login";
import Lounge from "../pages/Lounge";
import LoungeLayout from "./layouts/LoungeLayout";
import { fetchPostDetail, fetchPosts } from "./loader/post.loader";
import useAuthInit from "./../utils/useAuthInit";

const LoungeDetail = () => <div>개발 중입니다.</div>;
const AddPost = () => <div>개발 중입니다.</div>;

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
      { index: true, element: <Lounge />, loader: fetchPosts },
      { path: ":id", element: <LoungeDetail />, loader: fetchPostDetail },
      { path: "add-post", element: <AddPost /> },
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
