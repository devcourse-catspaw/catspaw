import { createBrowserRouter, RouterProvider } from 'react-router'
import Home from '../pages/Home'
import GameModeSelect from '../pages/game/GameModeSelect'
import GameLayout from './layouts/GameLayout'
import Login from '../pages/Login'

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
    element: <GameLayout />,
    children: [
      {
        path: '/game/select',
        element: <GameModeSelect />,
      },
    ],
  },
])
export default function Router() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}
