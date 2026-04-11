import React from 'react'
import ReactDOM from 'react-dom/client'
import { BacklogPage } from './pages/BacklogPage'
import './index.css' // Asumiendo que existe o se creará para Tailwind

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BacklogPage />
  </React.StrictMode>,
)
