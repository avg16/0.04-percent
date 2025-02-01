import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { IPFSProvider } from './context/IpfsContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <IPFSProvider>
      <App />
    </IPFSProvider>
  </StrictMode>,
)
