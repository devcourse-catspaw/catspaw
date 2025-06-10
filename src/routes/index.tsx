import { createBrowserRouter, RouterProvider } from 'react-router';
import Home from '../pages/Home';
import GameWaitingRoom from '../pages/game/GameWaitingRoom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    hydrateFallbackElement: <h1>Loading ...</h1>,
  },
  {
    path: '/game/waiting',
    element: <GameWaitingRoom />,
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
