import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';
import Home from '../pages/Home';
import GameModeSelect from '../pages/game/GameModeSelect';
import GameLayout from './layouts/GameLayout';
import SingleModePage from '../pages/SingleModePage';
import Login from '../pages/Login';
import AiAnswering from '../pages/AiAnswering';
import SingleModeResultPage from '../pages/SingleModeResultPage';
import GameRoomList from '../pages/game/GameRoomList';
import GameWaitingRoom from '../pages/game/GameWaitingRoom';
import MultiModeWords from '../pages/game/MultiModeWords';
import MultiModeDrawing from '../pages/game/MultiModeDrawing';
import MultiModeResult from '../pages/game/MultiModeResult';
import Lounge from '../pages/Lounge';
import LoungeLayout from './layouts/LoungeLayout';
import {
  fetchExactPost,
  fetchPostDetail,
  fetchUsers,
} from './loader/post.loader';
import LoungeDetail from '../pages/lounge/LoungDetail';
import AddPost from '../pages/lounge/AddPost';
import EditPost from '../pages/lounge/EditPost';
import MyPage from '../pages/MyPage';
import UserPage from '../pages/UserPage';
import NotFound from '../pages/NotFound';
import useAuthInit from '../hooks/useAuthInit';
import ProtectedRoute from '../components/common/ProtectedRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    hydrateFallbackElement: <h1>Loading ...</h1>,
  },
  {
    path: '/login',
    element: <Login />,
    hydrateFallbackElement: <h1>Loading ...</h1>,
  },
  {
    path: '/game',
    element: (
      <ProtectedRoute>
        <GameLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="select" replace />,
      },
      {
        path: 'select',
        element: <GameModeSelect />,
      },
      {
        path: 'single',
        element: <SingleModePage />,
      },
      {
        path: 'ai-answering',
        element: <AiAnswering />,
      },
      {
        path: "score-result",
        element: <SingleModeResultPage />,
      },
      { path: 'list', element: <GameRoomList /> },
      {
        path: 'room',
        element: <GameWaitingRoom />,
      },
      {
        path: 'multi',
        element: <MultiModeWords />,
      },
      {
        path: 'multi/drawing',
        element: <MultiModeDrawing key="DRAWING" step="DRAWING" />,
      },
      {
        path: 'multi/words',
        element: <MultiModeDrawing key="WORDS" step="WORDS" />,
      },
      {
        path: "result",
        element: <MultiModeResult />,
      },
    ],
  },
  {
    path: '/lounge',
    element: <LoungeLayout />,
    loader: fetchUsers,
    children: [
      { index: true, element: <Lounge /> },
      { path: ':id', element: <LoungeDetail />, loader: fetchPostDetail },
      { path: 'add-post', element: <AddPost /> },
      {
        path: ':postId/edit-post',
        element: <EditPost />,
        loader: fetchExactPost,
      },
    ],
  },

  {
    path: '/mypage',
    element: (
      <ProtectedRoute>
        <MyPage />
      </ProtectedRoute>
    ),
    hydrateFallbackElement: <h1>Loading ...</h1>,
  },
  {
    path: '/user/:id',
    element: (
      <ProtectedRoute>
        <UserPage />
      </ProtectedRoute>
    ),
    hydrateFallbackElement: <h1>Loading ...</h1>,
  },
  {
    path: '*',
    element: <NotFound />,
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
