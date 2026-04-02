import React from 'react';
import '../styles/AppStyles.css';

const PendingView = ({ onBack }) => {
  return (
    <div className="auth-page">
      <div className="auth-card glass">
        <div className="success-register-view">
           <div className="success-icon-animate">⏳</div>
           <h2>Solicitud en Evaluación</h2>
           <p>Hemos recibido tus datos correctamente. Un administrador revisará tu perfil y te notificará cuando tu cuenta sea activada.</p>
           <button className="btn-primary" onClick={onBack}>ENTENDIDO</button>
        </div>
      </div>
    </div>
  );
};

export default PendingView;
