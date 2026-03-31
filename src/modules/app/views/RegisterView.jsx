import React, { useState } from 'react';
import { googleProvider, auth, db } from '../../../firebase';
import { createUserWithEmailAndPassword, updateProfile, signOut, signInWithPopup } from 'firebase/auth';
import { ref, set, get } from 'firebase/database'; // Realtime
import '../styles/AppStyles.css';

const RegisterView = ({ onAuth, onModeChange, onBack }) => {
  const [formData, setFormData] = useState({
    name: '',
    province: '',
    email: '',
    password: ''
  });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSocialRegistering, setIsSocialRegistering] = useState(false);
  const [step, setStep] = useState(1);

  const PANAMA_PROVINCES = [
    'Bocas del Toro', 'Chiriquí', 'Coclé', 'Colón', 'Darién', 
    'Herrera', 'Los Santos', 'Panamá', 'Panamá Oeste', 'Veraguas',
    'Guna Yala', 'Ngäbe-Buglé', 'Emberá-Wounaan'
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      let userId = '';
      if (isSocialRegistering) {
        userId = auth.currentUser.uid;
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        userId = userCredential.user.uid;
        await updateProfile(userCredential.user, { displayName: formData.name });
      }

      const userProfile = {
        name: formData.name,
        province: formData.province,
        email: formData.email,
        isAdmin: false, 
        status: 'pending',
        photoUrl: isSocialRegistering ? auth.currentUser.photoURL : null,
        createdAt: new Date().toISOString()
      };

      await set(ref(db, `users/${userId}`), userProfile);
      await signOut(auth);
      setIsSuccess(true);

    } catch (err) {
      console.error("Register Error:", err);
      if (err.code === 'auth/email-already-in-use') {
        setError("Este correo ya está registrado.");
      } else {
        setError("Error al crear la cuenta. Verifica tus datos.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const googleUser = result.user;
      
      const snapshot = await get(ref(db, `users/${googleUser.uid}`));
      if (snapshot.exists()) {
        setError("Ya tienes una cuenta registrada. Por favor, inicia sesión.");
      } else {
        // Al ser registro por Google en el Paso 2, ya tenemos Nombre y Provincia
        const userProfile = {
          name: formData.name,
          province: formData.province,
          email: googleUser.email,
          isAdmin: false, 
          status: 'pending',
          photoUrl: googleUser.photoURL || null,
          createdAt: new Date().toISOString()
        };

        await set(ref(db, `users/${googleUser.uid}`), userProfile);
        await signOut(auth);
        setIsSuccess(true);
      }
    } catch (err) {
      console.error("Google Auth Error:", err);
      setError("Error con Google.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card glass">
        {isSuccess ? (
          <div className="success-register-view">
             <div className="success-icon-animate">📩</div>
             <h2>¡Solicitud Procesada!</h2>
             <p>Tu solicitud está siendo procesada, te llegará una notificación cuando se te acepte. Gracias por tu paciencia.</p>
             <button className="btn-primary" onClick={() => onModeChange('login')}>REGRESAR A LA WEB</button>
          </div>
        ) : (
          <>
            <h1 className="auth-logo">CAUCE</h1>
            <div className="auth-step-title">
               <span className={step === 1 ? 'active' : ''}>DAtOS BÁSICOS</span>
               <span style={{opacity: 0.3}}>|</span>
               <span className={step === 2 ? 'active' : ''}>CREAR ACCESO</span>
            </div>

            {error && (
              <div className="auth-error-msg">
                 <span>⚠️</span> {error}
              </div>
            )}

            <form className="auth-form" onSubmit={handleSubmit}>
              {step === 1 ? (
                <>
                  <div className="input-group">
                    <label>Nombre Completo</label>
                     <input 
                       name="name"
                       type="text" 
                       placeholder="Ej: Juan Pérez" 
                       onChange={handleChange}
                       value={formData.name}
                       required
                     />
                  </div>
                  <div className="input-group">
                    <label>Provincia</label>
                    <select name="province" onChange={handleChange} required className="auth-select">
                       <option value="">Selecciona provincia</option>
                       {PANAMA_PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <button 
                    type="button" 
                    className="btn-primary" 
                    onClick={() => {
                      if (formData.name && formData.province) setStep(2);
                      else setError("Por favor completa los datos básicos");
                    }}
                  >
                    CONTINUAR →
                  </button>
                </>
              ) : (
                <>
                  <div className="input-group">
                    <label>Correo Electrónico</label>
                    <input 
                      name="email"
                      type="email" 
                      placeholder="Ej: usuario@cauce.org" 
                      onChange={handleChange}
                      value={formData.email}
                      required
                      disabled={isSocialRegistering}
                    />
                  </div>
                  <div className="input-group">
                    <label>Contraseña</label>
                    <div className="password-input-wrapper">
                       <input 
                         name="password"
                         type={showPass ? "text" : "password"} 
                         placeholder="••••••••" 
                         onChange={handleChange}
                         required={!isSocialRegistering}
                         disabled={isSocialRegistering}
                         value={isSocialRegistering ? 'google_auth_placeholder' : formData.password}
                       />
                       <button 
                         type="button" 
                         className="toggle-pass-btn" 
                         onClick={() => setShowPass(!showPass)}
                         disabled={isSocialRegistering}
                       >
                         {showPass ? (
                           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                             <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                             <circle cx="12" cy="12" r="3" />
                           </svg>
                         ) : (
                           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                             <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                             <line x1="1" y1="1" x2="23" y2="23" />
                           </svg>
                         )}
                       </button>
                    </div>
                  </div>
                  
                  <div style={{display: 'flex', gap: '10px'}}>
                     <button type="button" className="btn-secondary" onClick={() => setStep(1)} disabled={isLoading}>
                        ATRÁS
                     </button>
                     <button type="submit" className="btn-primary" disabled={isLoading} style={{flex: 2}}>
                        {isLoading ? "REGISTRANDO..." : "REGISTRARSE"}
                     </button>
                  </div>
                  
                  {!isSocialRegistering && (
                    <>
                      <div className="auth-divider"><span>O CONTINUAR CON</span></div>
                      <button type="button" className="btn-google" onClick={handleGoogleAuth} disabled={isLoading}>
                         <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="G" />
                         Google
                      </button>
                    </>
                  )}
                </>
              )}
            </form>
            <div className="auth-footer">
              <div>¿Ya tienes cuenta? <button onClick={() => onModeChange('login')}>Iniciar Sesión</button></div>
              {onBack && <div style={{marginTop: '1rem'}}><button onClick={onBack} style={{opacity: 0.7}}>← Volver al inicio</button></div>}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RegisterView;
