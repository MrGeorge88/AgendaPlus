import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './global-reset.css'
import './components/ui/modal.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
