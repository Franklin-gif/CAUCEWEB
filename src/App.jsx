import React, { useState } from 'react'
import './App.css'
import HomeController from './modules/home/controllers/HomeController'
import AppController from './modules/app/controllers/AppController'

import ChatBot from './modules/app/components/chatbot/ChatBot'

function App() {
  const [view, setView] = useState('landing') // 'landing' or 'app'

  return (
    <>
      {view === 'landing' ? (
        <HomeController onEnterApp={() => setView('app')} />
      ) : (
        <AppController onExitApp={() => setView('landing')} />
      )}
      <ChatBot />
    </>
  )
}

export default App
