import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app'
import './scss/global.scss'
import AppThemeProvider from './context/app-theme-provider'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AppThemeProvider>
      <App />
    </AppThemeProvider>
  </React.StrictMode>,
)
