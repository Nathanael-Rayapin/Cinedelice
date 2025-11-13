import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import App from './App.tsx'
import AuthContextProvider from './store/auth.context.tsx'
import GlobalUIContextProvider from './store/global.context.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthContextProvider>
      <GlobalUIContextProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </GlobalUIContextProvider>
    </AuthContextProvider>
  </StrictMode>
)
