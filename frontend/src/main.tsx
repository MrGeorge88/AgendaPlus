import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './global-reset.css'
import './components/ui/modal.css'
import './calendar-styles.css'
import './i18n' // Initialize i18n before rendering the app
import App from './App.tsx'
import { ToasterProvider } from './components/ui/toaster'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToasterProvider>
      <App />
    </ToasterProvider>
  </StrictMode>,
)
