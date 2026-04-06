import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { registerSW } from 'virtual:pwa-register'

// Registrar el Service Worker automáticamente para IA PWA
registerSW({ immediate: true })

// Restringir la instalación de la PWA solo a dispositivos móviles (Android/iOS)
window.addEventListener('beforeinstallprompt', (e) => {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (!isMobile) {
    // Si no es móvil, prevenimos que aparezca el prompt de instalación (como el icono en la barra de direcciones)
    e.preventDefault();
  }
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
