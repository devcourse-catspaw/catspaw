import { createBrowserRouter, RouterProvider } from 'react-router';
import Home from '../pages/Home';
import GameModeSelect from '../pages/game/GameModeSelect';
import GameLayout from './layouts/GameLayout';
import GameRoomList from '../pages/game/GameRoomList';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    hydrateFallbackElement: <h1>Loading ...</h1>,
  },
  {
    path: '/game',
    element: <GameLayout />,
    children: [
      {
        path: '/game/select',
        element: <GameModeSelect />,
      },
      {
        path: '/game/multi',
        element: <GameRoomList />,
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
