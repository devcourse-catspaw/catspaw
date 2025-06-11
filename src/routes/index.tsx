import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import Home from '../pages/Home'
import GameModeSelect from '../pages/game/GameModeSelect'
import GameLayout from './layouts/GameLayout'
import SingleModePage from '../pages/SingleModePage'
import Login from '../pages/Login'
import useAuthInit from './../utils/useAuthInit'

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
    ],
  },
])
export default function Router() {
  useAuthInit()
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}
