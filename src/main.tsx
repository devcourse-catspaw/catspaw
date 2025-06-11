import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import Router from './routes/index.tsx'
import { Toaster } from 'react-hot-toast'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Toaster />
    <App />
    <Router />
  </StrictMode>
)
