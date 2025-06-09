import { createBrowserRouter, RouterProvider } from 'react-router';
import Home from '../pages/Home';
import GameRoomPage from '../pages/game/GameRoomPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    hydrateFallbackElement: <h1>Loading ...</h1>,
  },
  {
    path: '/game',
    element: <GameRoomPage />,
    hydrateFallbackElement: <h1>Loading ...</h1>,
  },
]);
export default function Router() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}
