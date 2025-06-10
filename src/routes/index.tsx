import { createBrowserRouter, RouterProvider } from 'react-router';
import Home from '../pages/Home';
import GameModeSelect from '../pages/game/GameModeSelect';
import GameLayout from './layouts/GameLayout';

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
