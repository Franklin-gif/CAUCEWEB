import React, { useState, useEffect } from 'react';
import { db, messaging } from '../../../firebase';
import { getToken, onMessage } from 'firebase/messaging';
import { ref, onValue, set, update, remove, push } from 'firebase/database'; // Realtime SDK
import '../styles/AppStyles.css';

const MainView = ({ user, onLogout }) => {
  if (!user) return null;
  const [activeTab, setActiveTab] = useState('inicio');
  const [adminSubTab, setAdminSubTab] = useState('evaluacion'); 
  const [memberFilter, setMemberFilter] = useState('pending');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Perfil del usuario
  const [userName, setUserName] = useState(user?.name || '');
  const [userEmail, setUserEmail] = useState(user?.email || '');
  const [userProvince, setUserProvince] = useState(user?.province || '');
  const [userHandle, setUserHandle] = useState(user?.handle || user.uid.substring(0,6));
  const [userPhoto, setUserPhoto] = useState(user?.photoUrl || null);

  // App data states (Realtime)
  const [appTasks, setAppTasks] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', requiresPhoto: false, requiresVideo: false, visible: true });
  const [adminComment, setAdminComment] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [allUsers, setAllUsers] = useState([]);

  // UI States
  const [selectedDashboardJornada, setSelectedDashboardJornada] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [tempUploads, setTempUploads] = useState([]); // Array of { url, type }
  const [customAlert, setCustomAlert] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [activeUserMenu, setActiveUserMenu] = useState(null);
  const [selectedEvaluationSubmission, setSelectedEvaluationSubmission] = useState(null);
  const [evalFeedback, setEvalFeedback] = useState('');
  const [evalRating, setEvalRating] = useState(0);
  const [lastSavedData, setLastSavedData] = useState({ 
    name: user?.name, 
    email: user?.email, 
    province: user?.province, 
    handle: user?.handle || user?.uid?.substring(0,6) 
  });

  const isAdmin = user?.isAdmin || user?.email === 'caucepanama@gmail.com';

  // -- Notificaciones desactivadas --
  const sendPushNotification = async (title, body) => {
     console.log("Notificación omitida (sistema desactivado):", title);
  };

  // 1. Suscripcin a Tareas (Realtime)
  useEffect(() => {
    const tasksRef = ref(db, 'tasks');
    const unsub = onValue(tasksRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const tasksArr = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setAppTasks(tasksArr);
      } else {
        setAppTasks([]);
      }
    });
    return () => unsub();
  }, []);

  // 2. Suscripcin a Entregas (Realtime)
  useEffect(() => {
    const subsRef = ref(db, 'submissions');
    const unsub = onValue(subsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const subsArr = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setSubmissions(subsArr.reverse());
      } else {
        setSubmissions([]);
      }
    });
    return () => unsub();
  }, []);

  const mySubmissions = submissions.filter(s => s.farmerId === user.uid);

  useEffect(() => {
    // Si eres admin, descargamos toda la base de datos de usuarios sin filtros raros
    if (!user?.isAdmin && user?.email !== 'caucepanama@gmail.com') return;

    const usersRef = ref(db, 'users');
    const unsub = onValue(usersRef, (snapshot) => {
      try {
        const data = snapshot.val();
        console.log("Datos crudos de Firebase:", data); // Esto nos ayudara a ver si llega algo
        
        if (data) {
          const list = Object.keys(data).map(key => ({ id: key, ...data[key] }));
          // Solo filtramos al administrador principal para que no se autogestione 
          const cleanList = list.filter(u => u.email !== 'caucepanama@gmail.com');
          setAllUsers(cleanList);
        } else {
          setAllUsers([]);
        }
      } catch (err) {
        console.error("Error en lista de admin:", err);
      }
    }, (error) => {
      console.error("Permisos denegados por Firebase. Revisa tus Rules:", error);
    });
    return () => unsub();
  }, [user]);

  const JORNADAS_PRESET = [
    { title: 'Jornada 1', name: 'Uso Responsable de Agroquímicos', icon: '🧪' },
    { title: 'Jornada 2', name: 'Elaboración de Bioinsumos', icon: '🌱' },
    { title: 'Jornada 3', name: 'Agricultura Regenerativa', icon: '☀️' },
    { title: 'Jornada 4', name: 'Reforestación de Áreas Productivas', icon: '🌳' },
    { title: 'Jornada 5', name: 'Economía Circular Agrícola', icon: '♻️' }
  ];

  const PANAMA_PROVINCES = [
    'Bocas del Toro', 'Chiriquí', 'Coclé', 'Colón', 'Darién', 
    'Herrera', 'Los Santos', 'Panamá', 'Panamá Oeste', 'Veraguas',
    'Guna Yala', 'Ngäbe-Buglé', 'Emberá-Wounaan'
  ];

  const handleNav = (tab, subTab = null) => {
    setActiveTab(tab);
    if (subTab) setAdminSubTab(subTab);
    setSidebarOpen(false);
  };

  const showAlert = (message, type = 'success') => {
    setCustomAlert({ message, type });
    if (type !== 'confirm') setTimeout(() => setCustomAlert(null), 3000);
  };

  const showConfirm = (message, onConfirm) => {
    setCustomAlert({ message, type: 'confirm', onConfirm });
  };

  // --- Operaciones de Administrador (Realtime) ---
  const handleCreateOrUpdateTask = async (e) => {
    e.preventDefault();
    if (!newTask.title) return;
    setIsSubmitting(true);
    try {
      if (editingTaskId) {
        await update(ref(db, `tasks/${editingTaskId}`), { 
           description: newTask.description, 
           requiresPhoto: newTask.requiresPhoto, 
           requiresVideo: newTask.requiresVideo, 
           visible: newTask.visible 
        });
        setEditingTaskId(null); showAlert('Tarea actualizada con éxito');
      } else {
        const p = JORNADAS_PRESET.find(preset => preset.title === newTask.title);
        const newTaskRef = push(ref(db, 'tasks'));
        await set(newTaskRef, { 
           ...p, 
           description: newTask.description || '', 
           requiresPhoto: newTask.requiresPhoto, 
           requiresVideo: newTask.requiresVideo, 
           visible: true,
           createdAt: new Date().toISOString()
        });
        showAlert('Nueva tarea publicada correctamente');
        // Notificar a todos
        sendPushNotification("¡Nueva Tarea!", `Se ha publicado: ${p.name} (${p.title})`);
      }
      setNewTask({ title: '', description: '', requiresPhoto: false, requiresVideo: false, visible: true });
    } catch (err) { showAlert("Error al guardar tarea", "error"); }
    finally { setIsSubmitting(false); }
  };

  const toggleVisibility = async (id, currentVal) => {
    const newVal = !currentVal;
    await update(ref(db, `tasks/${id}`), { visible: newVal });
    if (newVal) {
       // Obtener detalles de la tarea para la notificación
       const task = appTasks.find(t => t.id === id);
       if (task) {
          sendPushNotification("Tarea Disponible", `La jornada ${task.name} ya está habilitada.`);
       }
    }
  };

  const deleteTask = (id) => { 
    showConfirm('¿Estás seguro de que deseas eliminar esta tarea permanentemente?', async () => {
      try {
        await remove(ref(db, `tasks/${id}`));
        showAlert("Tarea eliminada");
      } catch (err) { showAlert("Error al eliminar", "error"); }
      setCustomAlert(null);
    });
  };

  const submitRating = async () => {
    if (!selectedEvaluationSubmission || !evalRating) {
      showAlert("Por favor selecciona una calificación", "warning");
      return;
    }
    setIsSubmitting(true);
    try {
      await update(ref(db, `submissions/${selectedEvaluationSubmission.id}`), {
        status: 'evaluated',
        adminComment: evalFeedback || '¡Excelente trabajo!',
        score: evalRating
      });
      showAlert("Evaluación enviada con éxito");
      setSelectedEvaluationSubmission(null);
      setEvalFeedback('');
      setEvalRating(0);
    } catch (e) { showAlert("Error al evaluar", "error"); }
    finally { setIsSubmitting(false); }
  };

  const updateUserStatus = async (uid, newStatus) => {
    await update(ref(db, `users/${uid}`), { status: newStatus });
    const statusMap = { 'accepted': 'Aprobado', 'denied': 'Denegado', 'pending': 'Inactivado' };
    showAlert(`Usuario ${statusMap[newStatus] || newStatus}`);
  };

  const deleteUser = (uid) => {
    showConfirm('¿Estás seguro de que deseas eliminar permanentemente a este usuario y todos sus datos? Esta acción es irreversible.', async () => {
      try {
        await remove(ref(db, `users/${uid}`));
        showAlert("Usuario eliminado definitivamente");
      } catch (err) { showAlert("Error al eliminar", "error"); }
      setCustomAlert(null);
    });
  }


  // --- Operaciones de Usuario (Realtime) ---
  const handleFileChange = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'imagenes'); 
      formData.append('cloud_name', 'dhxaodqr9');
      const res = await fetch(`https://api.cloudinary.com/v1_1/dhxaodqr9/upload`, { method: 'POST', body: formData });
      const data = await res.json();
      if (data.secure_url) {
        setTempUploads(prev => [...prev, { url: data.secure_url, type }]);
      } else { throw new Error("Upload failed"); }
    } catch (error) { showAlert("Error al subir a Cloudinary.", "error"); }
    finally { setIsSubmitting(false); }
  };

  const removeTempFile = (index) => {
    setTempUploads(prev => prev.filter((_, i) => i !== index));
  };

  const submitTask = async (taskId, taskTitle) => {
    if (tempUploads.length === 0) return;
    setIsSubmitting(true);
    try {
      const newSubRef = push(ref(db, 'submissions'));
      await set(newSubRef, {
        farmerId: user.uid,
        farmerName: userName,
        taskId,
        taskTitle,
        status: 'pending',
        score: 0,
        date: new Date().toLocaleDateString(),
        evidence: tempUploads,
        createdAt: new Date().toISOString()
      });
      setSubmitSuccess(true);
    } catch (e) { showAlert("Error al enviar tarea", "error"); }
    finally { setIsSubmitting(false); }
  };

  const undoSubmission = async (submissionId) => {
    showConfirm('¿Deseas anular esta entrega para editarla? Podrás volver a subir archivos y entregarla de nuevo.', async () => {
      try {
        await remove(ref(db, `submissions/${submissionId}`));
        setSubmitSuccess(false);
        showAlert("Entrega anulada. Puedes editarla ahora.");
      } catch (err) { showAlert("Error al anular entrega", "error"); }
      setCustomAlert(null);
    });
  };

  const handleProfilePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'imagenes');
      formData.append('cloud_name', 'dhxaodqr9');
      const res = await fetch(`https://api.cloudinary.com/v1_1/dhxaodqr9/upload`, { method: 'POST', body: formData });
      const data = await res.json();
      if (data.secure_url) {
        await update(ref(db, `users/${user.uid}`), { photoUrl: data.secure_url });
        setUserPhoto(data.secure_url);
        showAlert("Foto actualizada");
      }
    } catch (e) { showAlert("Error al subir foto", "error"); }
    finally { setPhotoLoading(false); }
  };

  const saveProfileChanges = async () => {
    try {
      const updatedData = { name: userName, email: userEmail, province: userProvince, handle: userHandle };
      await update(ref(db, `users/${user.uid}`), updatedData);
      setLastSavedData(updatedData);
      setIsEditingProfile(false);
      showAlert('Perfil guardado');
    } catch (e) { showAlert("Error al guardar perfil", "error"); }
  }

  const handleModalClose = () => {
    setSelectedDashboardJornada(null); 
    setSubmitSuccess(false);
    setTempUploads([]);
    setIsSubmitting(false);
  };

  return (
    <div className="app-container">
      {sidebarOpen && <div className="overlay" onClick={() => setSidebarOpen(false)}></div>}
      
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header" onClick={() => handleNav('inicio')}>
          <div className="logo-round">C</div>
          <div className="logo-text">CAUCE</div>
        </div>
        
        <nav className="sidebar-nav">
          <div className="nav-section-label">PRINCIPAL</div>
          <button className={`sidebar-item ${activeTab === 'inicio' ? 'active' : ''}`} onClick={() => handleNav('inicio')}>
             <div className="sidebar-icon-wrapper">🏠</div> Inicio
          </button>
          <button className={`sidebar-item ${activeTab === 'tareas' ? 'active' : ''}`} onClick={() => handleNav('tareas')}>
             <div className="sidebar-icon-wrapper">📋</div> Mis Tareas
          </button>
          <button className={`sidebar-item ${activeTab === 'config' ? 'active' : ''}`} onClick={() => handleNav('config')}>
             <div className="sidebar-icon-wrapper">⚙️</div> Configuración
          </button>

          {isAdmin && (
            <>
              <div className="nav-section-label admin-label">ADMINISTRACIÓN</div>
              <button className={`sidebar-item ${adminSubTab === 'evaluacion' && activeTab === 'admin' ? 'active' : ''}`} onClick={() => handleNav('admin', 'evaluacion')}>
                 <div className="sidebar-icon-wrapper">⭐</div> Evaluar
              </button>
              <button className={`sidebar-item ${adminSubTab === 'gestion' && activeTab === 'admin' ? 'active' : ''}`} onClick={() => handleNav('admin', 'gestion')}>
                 <div className="sidebar-icon-wrapper">📝</div> Gestión
              </button>
              <button className={`sidebar-item ${adminSubTab === 'miembros' && activeTab === 'admin' ? 'active' : ''}`} onClick={() => handleNav('admin', 'miembros')}>
                 <div className="sidebar-icon-wrapper">
                    👥
                    {allUsers.filter(u => u.status === 'pending').length > 0 && (
                       <span className="nav-badge-alert">{allUsers.filter(u => u.status === 'pending').length}</span>
                    )}
                 </div> 
                 Miembros
              </button>
              <button className={`sidebar-item ${adminSubTab === 'historial' && activeTab === 'admin' ? 'active' : ''}`} onClick={() => handleNav('admin', 'historial')}>
                 <div className="sidebar-icon-wrapper">📜</div> Historial
              </button>
            </>
          )}
        </nav>
      </aside>

      <header className="app-header glass">
        <button className="menu-btn" onClick={() => setSidebarOpen(true)}>☰</button>
        <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
           {userPhoto && <img src={userPhoto} alt="Mini" style={{width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)'}} />}
           <span style={{ fontWeight: 800, color: 'var(--primary)', letterSpacing: '-0.02em' }}>CAUCE WEB</span>
        </div>
        <button onClick={onLogout} style={{color: 'var(--accent)', fontWeight: 700, fontSize: '0.85rem'}}>SALIR</button>
      </header>

      <main className="app-main">
        {activeTab === 'inicio' && (
          <div className="profile-section">
            <div className={`profile-pic ${photoLoading ? 'loading' : ''}`}>
               {userPhoto ? <img src={userPhoto} alt="P" style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}} /> : '👤'}
               {photoLoading && <div className="photo-sync-overlay"><div className="sync-spinner"></div></div>}
            </div>
            <div className="profile-info">
              <h1>{userName}</h1>
              <p style={{color: 'var(--text-muted)', marginBottom: '0.25rem'}}>@{userHandle}</p>
              <p style={{fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 600}}>{userEmail}</p>
              <p style={{fontSize: '0.85rem', marginTop: '1rem'}}>{userProvince || 'Productor CAUCE'}</p>
            </div>
          </div>
        )}

        {activeTab === 'tareas' && (
          <div className="tareas-jornada-container">
             <div className="tareas-header-line">
                <h2 className="tareas-title-line">Tareas de Jornada</h2>
             </div>
             
             <div className="jornadas-grid-premium">
                {JORNADAS_PRESET.map((j, index) => {
                   const task = appTasks.find(t => t.title === j.title);
                   const sub = mySubmissions.find(s => s.taskId === task?.id);
                   const isVisible = task?.visible !== false;
                   const hasTask = !!task && isVisible;

                   return (
                      <div key={j.title} className={`jornada-card-ui ${!hasTask ? 'no-task' : ''} ${sub ? 'completed' : ''}`} onClick={() => hasTask && setSelectedDashboardJornada(task)}>
                         <div className="jornada-badge">JORNADA {index + 1}</div>
                         <div className="jornada-icon-ui">{j.icon}</div>
                         <h3 className="jornada-name-ui">{j.name}</h3>
                         
                         {!hasTask && (
                            <div className="no-task-seal">
                               <div className="seal-content">
                                  <span>🚫</span> No hay tarea asignada
                               </div>
                            </div>
                         )}
                         {sub && <div className="completed-check-ui">✓ Entregada</div>}
                      </div>
                   );
                })}
             </div>
          </div>
        )}

        {activeTab === 'config' && (
          <div className="profile-config-modern">
            <div className="profile-cover">
               <div className={`profile-edit-pic ${photoLoading ? 'loading' : ''}`}>
                  {userPhoto ? <img src={userPhoto} alt="Profile" style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%'}} /> : <span>👤</span>}
                  {photoLoading && <div className="photo-sync-overlay"><div className="sync-spinner"></div></div>}
                  <label className="pic-change-btn">
                     <input type="file" onChange={handleProfilePhotoChange} style={{display: 'none'}} accept="image/*" />
                      {photoLoading ? '...' : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      )}
                  </label>
               </div>
            </div>
            <div className="profile-config-card">
                <div className="config-card-header">
                   <h2>Mi Cuenta</h2>
                   {!isEditingProfile && (
                      <button className="btn-edit-unlock" onClick={() => setIsEditingProfile(true)}>✎ EDITAR PERFIL</button>
                   )}
                </div>
                
                <div className="config-grid" style={{marginTop: '2rem'}}>
                   <div className="input-field">
                      <label>Nombre Completo</label>
                      <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} readOnly={!isEditingProfile} className={!isEditingProfile ? 'field-locked' : ''} />
                   </div>
                   <div className="input-field">
                      <label>Nombre de Usuario (@)</label>
                      <input type="text" value={userHandle} onChange={(e) => setUserHandle(e.target.value)} readOnly={!isEditingProfile} className={!isEditingProfile ? 'field-locked' : ''} />
                   </div>
                   <div className="input-field">
                      <label>Provincia / Distrito</label>
                      <select 
                         value={userProvince} 
                         onChange={(e) => setUserProvince(e.target.value)} 
                         disabled={!isEditingProfile} 
                         className={!isEditingProfile ? 'field-locked' : ''}
                      >
                         <option value="">Selecciona provincia</option>
                         {PANAMA_PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                   </div>
                   <div className="input-field">
                      <label>Correo Electrónico</label>
                      <input type="email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} readOnly={!isEditingProfile} className={!isEditingProfile ? 'field-locked' : ''} />
                   </div>
                </div>

                {isEditingProfile && (
                   <div className="config-footer">
                      <button className="btn-cancel-edit" onClick={() => { 
                         // Restaurar datos guardados
                         setUserName(lastSavedData.name || '');
                         setUserEmail(lastSavedData.email || '');
                         setUserProvince(lastSavedData.province || '');
                         setUserHandle(lastSavedData.handle || '');
                         setIsEditingProfile(false); 
                      }}>CANCELAR</button>
                      <button className="btn-save-modern" onClick={saveProfileChanges}>GUARDAR CAMBIOS</button>
                   </div>
                )}
             </div>
          </div>
        )}

        {activeTab === 'admin' && adminSubTab === 'evaluacion' && (
          <div className="admin-section-modern">
             <div className="section-header-flex">
                <h2 className="section-title">Tareas por Revisar</h2>
                <span className="pending-counter">
                   {submissions.filter(s => s.status === 'pending').length} pendientes
                </span>
             </div>

             <div className="eval-list-modern">
                {submissions.filter(s => s.status === 'pending').length === 0 && (
                   <div className="empty-state-eval">
                      <p>✨ Todo al día. No hay tareas por revisar.</p>
                   </div>
                )}
                {submissions.filter(s => s.status === 'pending').map(sub => (
                   <div key={sub.id} className="eval-row-modern" onClick={() => {
                      setSelectedEvaluationSubmission(sub);
                      setEvalFeedback('');
                      setEvalRating(0);
                   }}>
                      <div className="eval-user-block">
                         <div className="eval-avatar-mini">👤</div>
                         <div className="eval-user-meta">
                            <strong>{sub.farmerName}</strong>
                            <span>Participante CAUCE</span>
                         </div>
                      </div>
                      <div className="eval-task-block">
                         <p className="task-name-eval">{sub.taskTitle}</p>
                         <p className="task-date-eval">{sub.date}</p>
                      </div>
                      <div className="eval-action-block">
                         <button className="btn-review-professional">REVISAR</button>
                      </div>
                   </div>
                ))}
             </div>
          </div>
        )}

        {activeTab === 'admin' && adminSubTab === 'gestion' && (
          <div className="admin-section-modern">
             <h2 className="section-title">Gestión de Jornadas</h2>
             <form className="admin-task-form modern-card" onSubmit={handleCreateOrUpdateTask}>
                <h3>{editingTaskId ? 'Editar Jornada' : 'Publicar Nueva Jornada'}</h3>
                <div className="form-grid">
                   <select value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} disabled={!!editingTaskId}>
                      <option value="">Selecciona una Jornada</option>
                      {JORNADAS_PRESET.map(p => <option key={p.title} value={p.title}>{p.title}: {p.name}</option>)}
                   </select>
                   <textarea placeholder="Instrucciones técnicas..." value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})} />
                   <div className="requirements-grid">
                      <div className={`req-tile ${newTask.requiresPhoto ? 'active' : ''}`} onClick={() => setNewTask({...newTask, requiresPhoto: !newTask.requiresPhoto})}>
                         <span>📸</span> Foto
                      </div>
                      <div className={`req-tile ${newTask.requiresVideo ? 'active' : ''}`} onClick={() => setNewTask({...newTask, requiresVideo: !newTask.requiresVideo})}>
                         <span>🎥</span> Video
                      </div>
                   </div>
                   <div className="form-actions">
                      <button type="submit" className="btn-publish">{editingTaskId ? 'ACTUALIZAR' : 'PUBLICAR'}</button>
                      {editingTaskId && <button type="button" className="btn-cancel" onClick={() => setEditingTaskId(null)}>Cancelar</button>}
                   </div>
                </div>
             </form>
             <div className="tasks-admin-list">
                {appTasks.map(t => (
                   <div key={t.id} className="admin-task-item modern-card">
                      <div className="task-info">
                         <span className="task-emoji">{t.icon}</span>
                         <div>
                            <h4>{t.title}</h4>
                            <p>{t.name}</p>
                         </div>
                      </div>
                      <div className="task-controls">
                         <button className={`btn-icon ${!t.visible ? 'hidden' : ''}`} onClick={() => toggleVisibility(t.id, t.visible)}>👁️</button>
                         <button className="btn-icon" onClick={() => setEditingTaskId(t.id)}>✏️</button>
                         <button className="btn-icon delete" onClick={() => deleteTask(t.id)}>🗑️</button>
                      </div>
                   </div>
                ))}
             </div>
          </div>
        )}



        {activeTab === 'admin' && adminSubTab === 'miembros' && (
          <div className="admin-section-modern">
             <div className="section-header-flex">
                <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                   <h2 className="section-title" style={{margin: 0}}>Gestión de Usuarios</h2>
                   <button 
                      className="btn-refresh-sync" 
                      onClick={() => {
                        // Forzar una re-suscripción cambiando una clave de estado
                        setMemberFilter(memberFilter); // Re-trigger visual local
                        showAlert("Sincronizando con Firebase...");
                        // En Realtime Database, onValue ya es síncrono, pero podemos 
                        // forzar una lectura única si queremos estar 100% seguros
                        get(ref(db, 'users')).then(snap => {
                           if (snap.exists()) {
                              const list = Object.keys(snap.val()).map(k => ({ id: k, ...snap.val()[k] }));
                              setAllUsers(list.filter(u => u.email !== 'caucepanama@gmail.com'));
                              showAlert("Lista de usuarios actualizada");
                           }
                        });
                      }}
                      title="Sincronizar ahora"
                   >
                      🔄
                   </button>
                </div>
                <div className="status-filter-tabs">
                   <button className={`filter-tab ${memberFilter === 'pending' ? 'active' : ''}`} onClick={() => setMemberFilter('pending')}>
                      Pendientes <span>{allUsers.filter(u => (u.status || 'pending') === 'pending').length}</span>
                   </button>
                   <button className={`filter-tab ${memberFilter === 'accepted' ? 'active' : ''}`} onClick={() => setMemberFilter('accepted')}>
                      Activos <span>{allUsers.filter(u => u.status === 'accepted').length}</span>
                   </button>
                   <button className={`filter-tab ${memberFilter === 'denied' ? 'active' : ''}`} onClick={() => setMemberFilter('denied')}>
                      Rechazados <span>{allUsers.filter(u => u.status === 'denied').length}</span>
                   </button>
                </div>
             </div>

             <div className="eval-grid" onClick={() => activeUserMenu && setActiveUserMenu(null)}>
                {allUsers.filter(u => (u.status || 'pending') === memberFilter).length === 0 && (
                   <p className="empty-state">No hay usuarios en esta categoría.</p>
                )}
                {allUsers.filter(u => (u.status || 'pending') === memberFilter).map((u, index) => (
                   <div key={u.id} className="admin-card-modern">
                      <div className="admin-card-header">
                         <div className="user-info-mini">
                            <span className="user-row-number">{index + 1}</span>
                            <div className="user-avatar">{u.photoUrl ? <img src={u.photoUrl} alt="U" /> : (u.name?.[0] || 'U')}</div>
                            <div>
                               <div className="user-name-small">{u.name || 'Participante'}</div>
                               <div className="sub-meta-small">{u.email}</div>
                            </div>
                         </div>
                      </div>

                      {memberFilter === 'pending' ? (
                        <div className="pending-actions-ui">
                           <button className="btn-icon-action approve" title="Aprobar" onClick={(e) => { e.stopPropagation(); updateUserStatus(u.id, 'accepted'); }}>
                              ✓
                           </button>
                           <button className="btn-icon-action reject" title="Rechazar" onClick={(e) => { e.stopPropagation(); updateUserStatus(u.id, 'denied'); }}>
                              ✕
                           </button>
                        </div>
                      ) : (
                        <div className="menu-container-ui">
                           <button className="btn-dots-ui" onClick={(e) => {
                             e.stopPropagation();
                             setActiveUserMenu(activeUserMenu === u.id ? null : u.id);
                           }}>
                             ⋮
                           </button>
                           {activeUserMenu === u.id && (
                             <div className="dropdown-menu-ui" onClick={(e) => e.stopPropagation()}>
                                {memberFilter === 'accepted' && (
                                  <>
                                    <button className="dropdown-item-ui" onClick={() => { updateUserStatus(u.id, 'pending'); setActiveUserMenu(null); }}>
                                       <span>⏳</span> Inactivar
                                    </button>
                                    <button className="dropdown-item-ui danger" onClick={() => { updateUserStatus(u.id, 'denied'); setActiveUserMenu(null); }}>
                                       <span>🚫</span> Rechazar
                                    </button>
                                  </>
                                )}
                                {memberFilter === 'denied' && (
                                  <>
                                    <button className="dropdown-item-ui" onClick={() => { updateUserStatus(u.id, 'accepted'); setActiveUserMenu(null); }}>
                                       <span>🔄</span> Reactivar usuario
                                    </button>
                                    <button className="dropdown-item-ui danger" onClick={() => { deleteUser(u.id); setActiveUserMenu(null); }}>
                                       <span>🗑️</span> Borrar usuario
                                    </button>
                                  </>
                                )}
                             </div>
                           )}
                        </div>
                      )}
                   </div>
                ))}
             </div>
          </div>
        )}
        {activeTab === 'admin' && adminSubTab === 'historial' && (
          <div className="admin-section-modern">
             <h2 className="section-title">Historial de Evaluaciones</h2>
             <div className="historial-table modern-card">
                {submissions.filter(s => s.status === 'evaluated').map(sub => (
                   <div key={sub.id} className="historial-record-wrapper">
                      <div className="historial-item">
                         <div className="hist-user-info">
                            <span className="hist-avatar">👤</span>
                            <div>
                               <strong>{sub.farmerName}</strong>
                               <p>{sub.taskTitle}</p>
                            </div>
                         </div>
                         <div className="hist-score">
                            <span className="star-gold">⭐</span> {sub.score}/5
                         </div>
                         <div className="hist-date">{sub.date}</div>
                      </div>
                      {sub.evidence && (Array.isArray(sub.evidence) ? sub.evidence.length > 0 : Object.values(sub.evidence).some(v => v)) && (
                         <div className="hist-evidence-preview">
                            <div className="evidence-container-modern">
                               {Array.isArray(sub.evidence) ? sub.evidence.map((file, idx) => (
                                  <div key={idx} className="evidence-thumbnail clickable" onClick={() => window.open(file.url)}>
                                     {file.type === 'photo' ? <img src={file.url} alt="E" /> : <video src={file.url} />}
                                     <span className="evidence-label">{file.type === 'photo' ? 'FOTO' : 'VIDEO'}</span>
                                  </div>
                               )) : (
                                  <>
                                     {sub.evidence?.photoUrl && (
                                        <div className="evidence-thumbnail clickable" onClick={() => window.open(sub.evidence.photoUrl)}>
                                           <img src={sub.evidence.photoUrl} alt="E" />
                                           <span className="evidence-label">FOTO</span>
                                        </div>
                                     )}
                                     {sub.evidence?.videoUrl && (
                                        <div className="evidence-video-card" onClick={() => window.open(sub.evidence.videoUrl)}>
                                           <video src={sub.evidence.videoUrl} />
                                           <span className="evidence-label">VIDEO</span>
                                        </div>
                                     )}
                                  </>
                               )}
                            </div>
                            {sub.adminComment && (
                               <div className="hist-comment-bubble">
                                  💬 "{sub.adminComment}"
                               </div>
                            )}
                         </div>
                      )}
                   </div>
                ))}
             </div>
          </div>
        )}
      </main>

      {/* MODAL DE TAREA PROFESIONAL (ESTILO IMAGEN 2) */}
      {selectedDashboardJornada && (
         <div className="modal-overlay-dark" onClick={handleModalClose}>
            <div className="professional-modal glass" onClick={e => e.stopPropagation()}>
               <div className="prof-modal-header">
                  <button className="back-btn-ui" onClick={handleModalClose}>〈 Back</button>
                  <div className="header-meta-ui">
                     <span>📋</span> {submitSuccess ? 'Entregado' : 'Asignación'}
                  </div>
                  <button className="close-x-ui" onClick={handleModalClose}>×</button>
               </div>

               <div className="prof-modal-layout">
                  {/* COLUMNA IZQUIERDA: INFORMACIÓN Y ACCIÓN */}
                  <div className="prof-left-col">
                     <h1 className="assignment-title-ui">{selectedDashboardJornada.title}: {selectedDashboardJornada.name}</h1>
                     <p className="assignment-due-ui">Disponible para entrega • CAUCE Panamá</p>

                     <section className="prof-section-ui">
                        <h4 className="prof-label-ui">Instrucciones</h4>
                        <p className="prof-text-ui">
                           {selectedDashboardJornada.description || 'Buenas tardes, productor de CAUCE. Se habilita este espacio para que subas la evidencia de tus prácticas agrícolas realizadas durante esta jornada.'}
                        </p>
                     </section>

                     <section className="prof-section-ui">
                        <h4 className="prof-label-ui">Mi trabajo</h4>
                        {(() => {
                           const submission = mySubmissions.find(s => s.taskId === selectedDashboardJornada.id);
                           const hasSubmitted = !!submission || submitSuccess;

                           if (!hasSubmitted) {
                              return (
                                 <div className="work-upload-area">
                                    <div className="professional-upload-zone">
                                       <div className="upload-controls-row">
                                          <label className="btn-upload-choice">
                                             <input type="file" onChange={e => handleFileChange(e, 'photo')} accept="image/*" />
                                             <div className="choice-content">
                                                <span className="icon">📸</span>
                                                <span>Añadir Fotos</span>
                                             </div>
                                          </label>
                                          <label className="btn-upload-choice">
                                             <input type="file" onChange={e => handleFileChange(e, 'video')} accept="video/*" />
                                             <div className="choice-content">
                                                <span className="icon">🎥</span>
                                                <span>Añadir Video</span>
                                             </div>
                                          </label>
                                       </div>

                                       {tempUploads && tempUploads.length > 0 && (
                                          <div className="file-gallery-preview">
                                             <h5 className="gallery-title">Archivos seleccionados ({tempUploads.length})</h5>
                                             <div className="gallery-grid">
                                                {tempUploads.map((file, i) => (
                                                   <div key={i} className="gallery-item-thumb">
                                                      {file.type === 'photo' ? <img src={file.url} alt="P" /> : <video src={file.url} />}
                                                      <button className="remove-file-btn" onClick={() => removeTempFile(i)}>×</button>
                                                   </div>
                                                ))}
                                             </div>
                                          </div>
                                       )}
                                       
                                       <button className="btn-submit-professional" onClick={() => submitTask(selectedDashboardJornada.id, selectedDashboardJornada.title)} disabled={isSubmitting || !tempUploads || tempUploads.length === 0}>
                                          {isSubmitting ? 'SUBIENDO...' : 'ENTREGAR TAREA'}
                                       </button>
                                    </div>
                                 </div>
                              );
                           } else {
                              const sub = submission || { evidence: tempUploads, status: 'pending' };
                              return (
                                 <div className="work-display-area">
                                    <div className="success-banner-modern">
                                       <div className="banner-text">
                                          <strong>Entregada con éxito</strong>
                                          <p>Tu tarea ha sido enviada para revisión.</p>
                                       </div>
                                       {sub.status === 'pending' && (
                                          <button className="btn-undo-submission" onClick={() => undoSubmission(sub.id)}>ANULAR ENTREGA</button>
                                       )}
                                    </div>
                                    <div className="submitted-files-gallery">
                                       {Array.isArray(sub.evidence) ? sub.evidence.map((file, idx) => (
                                          <div key={idx} className="submitted-file-row horizontal" onClick={() => window.open(file.url)}>
                                             <div className="file-icon-ui">{file.type === 'photo' ? '🖼️' : '🎬'}</div>
                                             <span className="file-name-ui">Evidencia_{file.type === 'photo' ? 'Imagen' : 'Video'}_{idx+1}</span>
                                          </div>
                                       )) : (
                                          <>
                                             {sub.evidence?.photoUrl && (
                                                <div className="submitted-file-row horizontal" onClick={() => window.open(sub.evidence.photoUrl)}>
                                                   <div className="file-icon-ui">🖼️</div>
                                                   <span className="file-name-ui">Evidencia_Imagen.jpg</span>
                                                </div>
                                             )}
                                             {sub.evidence?.videoUrl && (
                                                <div className="submitted-file-row horizontal" onClick={() => window.open(sub.evidence.videoUrl)}>
                                                   <div className="file-icon-ui">🎬</div>
                                                   <span className="file-name-ui">Evidencia_Video.mp4</span>
                                                </div>
                                             )}
                                          </>
                                       )}
                                    </div>
                                 </div>
                              );
                           }
                        })()}
                     </section>
                  </div>

                  {/* COLUMNA DERECHA: SEGUIMIENTO Y FEEDBACK */}
                  <div className="prof-right-col">
                     <section className="prof-section-ui">
                        <h4 className="prof-label-ui">Feedback</h4>
                        <div className="feedback-content-ui">
                           <h5 className="sub-label-ui">Observaciones:</h5>
                           <p className="feedback-note-ui">
                              {mySubmissions.find(s => s.taskId === selectedDashboardJornada.id)?.adminComment || 'Tu entrega está siendo procesada. El administrador revisará tu trabajo pronto.'}
                           </p>
                           
                           <div className="calificacion-box-ui">
                              <span className="sub-label-ui">Calificación:</span>
                              <span className="score-number-ui">{mySubmissions.find(s => s.taskId === selectedDashboardJornada.id)?.score || '0'}/5</span>
                           </div>
                        </div>
                     </section>

                     <section className="prof-section-ui">
                        <h4 className="prof-label-ui">Points</h4>
                        <div className="stars-points-ui">
                           {mySubmissions.find(s => s.taskId === selectedDashboardJornada.id)?.score > 0 ? (
                              <div className="stars-row-ui">
                                 {Array(5).fill(0).map((_, i) => (
                                    <span key={i} className={`point-star ${i < mySubmissions.find(s => s.taskId === selectedDashboardJornada.id).score ? 'filled' : ''}`}>⭐</span>
                                 ))}
                              </div>
                           ) : (
                              <p className="no-points-text">Pendiente de puntuación</p>
                           )}
                        </div>
                     </section>
                  </div>
               </div>
            </div>
         </div>
      )}

      {customAlert && (
        <div className="custom-alert-overlay" onClick={() => customAlert.type !== 'confirm' && setCustomAlert(null)}>
           <div className={`custom-alert-card ${customAlert.type}`} onClick={e => e.stopPropagation()}>
              <div className="alert-icon">
                 {customAlert.type === 'success' && '✅'}
                 {customAlert.type === 'error' && '❌'}
                 {customAlert.type === 'confirm' && '⚠️'}
              </div>
              <p>{customAlert.message}</p>
              <div className="alert-actions">
                 {customAlert.type === 'confirm' ? (
                   <>
                     <button className="btn-alert-cancel" onClick={() => setCustomAlert(null)}>CANCELAR</button>
                     <button className="btn-alert-confirm" onClick={customAlert.onConfirm}>COMBINAR</button>
                   </>
                 ) : (
                   <button className="btn-alert-ok" onClick={() => setCustomAlert(null)}>ENTENDIDO</button>
                 )}
              </div>
           </div>
        </div>
      )}
       {/* MODAL DE EVALUACIÓN PROFESIONAL */}
       {selectedEvaluationSubmission && (
          <div className="modal-overlay-dark" onClick={() => setSelectedEvaluationSubmission(null)}>
             <div className="professional-modal glass eval-modal-width" onClick={e => e.stopPropagation()}>
                <div className="prof-modal-header">
                   <button className="back-btn-ui" onClick={() => setSelectedEvaluationSubmission(null)}>〈 Atrás</button>
                   <div className="header-meta-ui">
                      <span>⚖️</span> Evaluación Detallada
                   </div>
                   <button className="close-x-ui" onClick={() => setSelectedEvaluationSubmission(null)}>×</button>
                </div>

                <div className="prof-modal-layout">
                   <div className="prof-left-col">
                      <div className="eval-detail-user">
                         <div className="eval-avatar-large">👤</div>
                         <div>
                            <h1 className="eval-user-name-large">{selectedEvaluationSubmission.farmerName}</h1>
                            <p className="eval-task-subtitle">{selectedEvaluationSubmission.taskTitle}</p>
                         </div>
                      </div>

                      <section className="prof-section-ui">
                         <h4 className="prof-label-ui">Evidencias Enviadas</h4>
                         <div className="eval-evidence-gallery">
                            {Array.isArray(selectedEvaluationSubmission.evidence) ? selectedEvaluationSubmission.evidence.map((file, idx) => (
                               <div key={idx} className="eval-evidence-item" onClick={() => window.open(file.url)}>
                                  {file.type === 'photo' ? <img src={file.url} alt="E" /> : <video src={file.url} />}
                                  <div className="eval-evidence-overlay">
                                     <span>👁️ VER {file.type === 'photo' ? 'FOTO' : 'VIDEO'}</span>
                                  </div>
                               </div>
                            )) : (
                               <p className="empty-state">No hay archivos de evidencia.</p>
                            )}
                         </div>
                      </section>
                   </div>

                   <div className="prof-right-col">
                      <section className="prof-section-ui">
                         <h4 className="prof-label-ui">Calificar Entrega</h4>
                         <div className="eval-rating-container">
                            <label className="sub-label-ui">Tu Feedback para el productor:</label>
                            <textarea 
                               className="eval-feedback-textarea"
                               placeholder="Escribe aquí tus observaciones..."
                               value={evalFeedback}
                               onChange={(e) => setEvalFeedback(e.target.value)}
                            />

                            <label className="sub-label-ui" style={{marginTop: '1.5rem'}}>Selecciona la Calificación:</label>
                            <div className="eval-stars-interactive">
                               {[1,2,3,4,5].map(star => (
                                  <button 
                                     key={star} 
                                     className={`eval-star-btn ${evalRating >= star ? 'active' : ''}`}
                                     onClick={() => setEvalRating(star)}
                                  >
                                     ⭐
                                  </button>
                               ))}
                            </div>

                            <button 
                               className="btn-submit-professional" 
                               style={{marginTop: '2rem', width: '100%'}}
                               onClick={submitRating}
                               disabled={isSubmitting || evalRating === 0}
                            >
                               {isSubmitting ? 'ENVIANDO...' : 'CONFIRMAR EVALUACIÓN'}
                            </button>
                         </div>
                      </section>
                   </div>
                </div>
             </div>
          </div>
       )}
    </div>
  );
};


export default MainView;
