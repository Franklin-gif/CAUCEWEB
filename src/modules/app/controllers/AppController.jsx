import React, { useState, useEffect } from 'react';
import { auth, db } from '../../../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { ref, get } from 'firebase/database';
import LoginView from '../views/LoginView';
import RegisterView from '../views/RegisterView';
import MainView from '../views/MainView';
import PendingView from '../views/PendingView';

const AppController = ({ onExitApp }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState('login'); 

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        try {
          const snap = await get(ref(db, `users/${u.uid}`));
          const profile = snap.exists() ? snap.val() : {};
          
          const isPrivileged = profile.isAdmin || 
                               u.email === 'caucepanama@gmail.com' ||
                               u.email?.includes('cauceadmin');

          if (isPrivileged || profile.status === 'accepted') {
             setUser({ uid: u.uid, email: u.email, ...profile, isAdmin: isPrivileged });
             setMode('dashboard');
          } else {
             // Si el perfil no existe todavía (race condition o login inicial), o no esta aceptado
             // Solo sacamos al usuario si no estamos en proceso de login o registro
             if (mode !== 'register' && mode !== 'login') {
                await signOut(auth);
                setUser(null);
                setMode('pending-evaluation');
             } else if (snap.exists() && profile.status !== 'accepted') {
                // Si el perfil existe pero está pendiente/denegado, si lo mandamos a evaluación
                await signOut(auth);
                setUser(null);
                setMode('pending-evaluation');
             }
          }
        } catch (e) {
          console.error("Auth Failure:", e);
          setUser(null);
          setMode('login');
        }
      } else {
        setUser(null);
        // Evitar que si estamos en registro o pendiente, nos mande de golpe a login
        if (mode === 'dashboard') setMode('login');
      }
      setLoading(false);
    });
    return () => unsub();
  }, [mode]); // Dependemos del modo para no resetearlo agresivamente

  const handleAuth = (userData) => {
    setUser(userData);
    setMode('dashboard');
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setMode('login');
    if (onExitApp) onExitApp();
  };

  if (loading) return (
    <div className="splash-screen">
       <div className="splash-content">
          <div className="splash-logo-circle">
             <img src="/logo.png" alt="CAUCE" />
          </div>
          <div className="splash-loader"></div>
          <p>Sincronizando con CAUCE...</p>
       </div>
    </div>
  );

  // Selector de Vista nico
  switch(mode) {
    case 'dashboard':
      return user ? <MainView user={user} onLogout={handleLogout} /> : <LoginView onAuth={handleAuth} onModeChange={setMode} onBack={onExitApp} />;
    case 'register':
      return <RegisterView onAuth={handleAuth} onModeChange={setMode} onBack={onExitApp} />;
    case 'pending-evaluation':
      return <PendingView onBack={() => setMode('login')} />;
    default:
      return <LoginView onAuth={handleAuth} onModeChange={setMode} onBack={onExitApp} />;
  }
};

export default AppController;
