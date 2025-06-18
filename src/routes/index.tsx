import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Home from "../pages/Home";
import GameModeSelect from "../pages/game/GameModeSelect";
import GameLayout from "./layouts/GameLayout";
import SingleModePage from "../pages/SingleModePage";
import GameRoomList from "../pages/game/GameRoomList";
import GameWaitingRoom from "../pages/game/GameWaitingRoom";
import MultiModeWords from "../pages/game/MultiModeWords";
import MultiModeDrawing from "../pages/game/MultiModeDrawing";
import MultiModeResult from "../pages/game/MultiModeResult";
import Login from "../pages/Login";
import Lounge from "../pages/Lounge";
import LoungeLayout from "./layouts/LoungeLayout";
import {
  fetchExactPost,
  fetchPostDetail,
  fetchUsers,
} from "./loader/post.loader";
import useAuthInit from "./../utils/useAuthInit";
import LoungeDetail from "../pages/lounge/LoungDetail";
import AddPost from "../pages/lounge/AddPost";
import EditPost from "../pages/lounge/EditPost";

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
        path: "list",
        element: <GameRoomList />,
      },
      {
        path: "room",
        element: <GameWaitingRoom />,
      },
      {
        path: "multi",
        element: <MultiModeWords />,
      },
      {
        path: "multi/drawing",
        element: <MultiModeDrawing key="DRAWING" step="DRAWING" />,
      },
      {
        path: "multi/words",
        element: <MultiModeDrawing key="WORDS" step="WORDS" />,
      },
      {
        path: "multi/result",
        element: <MultiModeResult />,
      },
    ],
  },
  {
    path: "/lounge",
    element: <LoungeLayout />,
    loader: fetchUsers,
    children: [
      { index: true, element: <Lounge /> },
      { path: ":id", element: <LoungeDetail />, loader: fetchPostDetail },
      { path: "add-post", element: <AddPost /> },
      {
        path: ":postId/edit-post",
        element: <EditPost />,
        loader: fetchExactPost,
      },
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
