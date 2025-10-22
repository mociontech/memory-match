import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AttendeeProvider } from './context/AttendeeContext.jsx'
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
     <AttendeeProvider>
        <App />
     </AttendeeProvider>
  </React.StrictMode>,
)
