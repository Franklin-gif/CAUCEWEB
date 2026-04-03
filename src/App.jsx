import React, { useState, useEffect } from 'react'
import './App.css'
import HomeController from './modules/home/controllers/HomeController'
import AppController from './modules/app/controllers/AppController'

import ChatBot from './modules/app/components/chatbot/ChatBot'

function App() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // Prevenir que el navegador muestre su propio banner de instalación
      e.preventDefault();
      // Guardar el evento para dispararlo más tarde
      setDeferredPrompt(e);
      console.log("PWA Install Prompt Captured");
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Detectar si la app viene de la PWA (start_url o modo standalone)
  const isPwa = window.matchMedia('(display-mode: standalone)').matches || 
                new URLSearchParams(window.location.search).get('pwa') === 'true';

  const [view, setView] = useState(isPwa ? 'app' : 'landing'); // Iniciar en app si es PWA

  return (
    <>
      {view === 'landing' ? (
        <>
          <HomeController 
            onEnterApp={() => setView('app')} 
            deferredPrompt={deferredPrompt}
          />
          <ChatBot />
        </>
      ) : (
        <AppController onExitApp={() => isPwa ? setView('app') : setView('landing')} />
      )}
    </>
  );
}

export default App
