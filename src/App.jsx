import React, { useState } from 'react'
import './App.css'
import HomeController from './modules/home/controllers/HomeController'
import AppController from './modules/app/controllers/AppController'

import ChatBot from './modules/app/components/chatbot/ChatBot'

function App() {
  // Detectar si la app viene de la PWA (start_url o modo standalone)
  const isPwa = window.matchMedia('(display-mode: standalone)').matches || 
                new URLSearchParams(window.location.search).get('pwa') === 'true';

  const [view, setView] = useState(isPwa ? 'app' : 'landing'); // Iniciar en app si es PWA

  return (
    <>
      {view === 'landing' ? (
        <>
          <HomeController onEnterApp={() => setView('app')} />
          <ChatBot />
        </>
      ) : (
        <AppController onExitApp={() => isPwa ? setView('app') : setView('landing')} />
      )}
    </>
  );
}

export default App
