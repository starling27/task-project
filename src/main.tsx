import React from 'react'
import ReactDOM from 'react-dom/client'
import { BacklogPage } from './pages/BacklogPage'
import './index.css'

const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <BacklogPage />
    </React.StrictMode>
  );
} else {
  console.error('Failed to find root element');
}
