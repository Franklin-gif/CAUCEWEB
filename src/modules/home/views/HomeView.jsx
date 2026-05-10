import React, { useEffect, useState } from 'react';
import heroImg from '/src/assets/images/hero.png';
import logoImg from '/src/assets/images/logo.png';

const HomeView = ({ data, members, onEnterApp, deferredPrompt }) => {
    const [selectedMember, setSelectedMember] = useState(null);
    const [showPwaTutorial, setShowPwaTutorial] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [pwaDevice, setPwaDevice] = useState(null); // 'ios' or 'android'
    const [selectedJornada, setSelectedJornada] = useState(null);

    const handlePlataformaClick = async () => {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        
        // Si es computadora, entramos directo a la plataforma
        if (!isMobile) {
            onEnterApp();
            return;
        }

        // Si es móvil y tenemos el evento de instalación (Andorid)
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`User installation choice: ${outcome}`);
            // Después de intentar la instalación, entramos a la app
            onEnterApp();
        } else {
            // Si es iOS o móvil sin evento, mostramos el tutorial
            setShowPwaTutorial(true);
        }
    };

    useEffect(() => {
        // Detectar dispositivo para tutorial PWA predeterminado
        const ua = navigator.userAgent.toLowerCase();
        if (/iphone|ipad|ipod/.test(ua)) setPwaDevice('ios');
        else setPwaDevice('android');

        const reveal = () => {
            const reveals = document.querySelectorAll(".reveal");
            for (let i = 0; i < reveals.length; i++) {
                const windowHeight = window.innerHeight;
                const elementTop = reveals[i].getBoundingClientRect().top;
                const elementVisible = 100;
                if (elementTop < windowHeight - elementVisible) {
                    reveals[i].classList.add("active");
                }
            }
        };

        window.addEventListener("scroll", reveal);
        reveal();
        return () => window.removeEventListener("scroll", reveal);
    }, []);

    useEffect(() => {
        if (selectedMember || showPwaTutorial) {
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        };
    }, [selectedMember, showPwaTutorial]);

    if (selectedJornada) {
        return (
            <div className="jornada-full-view">
                <nav className="detail-nav">
                    <button className="back-btn" onClick={() => {
                        setSelectedJornada(null);
                        window.scrollTo(0, 0);
                    }}>
                        &larr; Volver a la Ruta de Acción
                    </button>
                    <div className="logo-mini">
                        <img src={logoImg} alt="CAUCE Logo" loading="lazy" />
                    </div>
                </nav>

                <div className="detail-hero">
                    <img src={selectedJornada.image} alt={selectedJornada.title} className="detail-cover-img" fetchpriority="high" decoding="async" />
                    <div className="detail-hero-content">
                        <span className="jornada-badge-pill static-badge">{selectedJornada.badge}</span>
                        <h1>{selectedJornada.title}</h1>
                    </div>
                </div>

                <div className="detail-container">
                    <section className="detail-section">
                        <h2>¿Qué hicimos?</h2>
                        <p>{selectedJornada.details}</p>
                    </section>

                    <section className="detail-section">
                        <h2>Galería de Fotos</h2>
                        <div className="jornada-gallery">
                            {selectedJornada.gallery && selectedJornada.gallery.map((img, idx) => {
                                const isVideo = img.toLowerCase().endsWith('.mov') || img.toLowerCase().endsWith('.mp4');
                                const isRaw = img.toLowerCase().endsWith('.cr2') || img.toLowerCase().endsWith('.heic');
                                
                                if (isVideo) {
                                    return (
                                        <video key={idx} src={img} controls className="jornada-gallery-img" style={{ objectFit: 'cover' }} />
                                    );
                                }
                                
                                if (isRaw) {
                                    return (
                                        <div key={idx} className="jornada-gallery-img raw-fallback">
                                            <span>📁</span>
                                            <p>Formato no web ({img.split('.').pop()})</p>
                                            <a href={img} download>Descargar original</a>
                                        </div>
                                    );
                                }
                                
                                return (
                                    <img key={idx} src={img} alt={`Galería ${idx + 1}`} className="jornada-gallery-img" loading="lazy" decoding="async" />
                                );
                            })}
                        </div>
                    </section>

                    <section className="detail-section">
                        <h2>Aliados Estratégicos</h2>
                        <div className="jornada-allies">
                            {selectedJornada.allies && selectedJornada.allies.map((ally, idx) => (
                                <span key={idx} className="ally-badge">{ally}</span>
                            ))}
                        </div>
                    </section>
                </div>

                <footer className="detail-footer">
                    <button className="back-btn-bottom" onClick={() => {
                        setSelectedJornada(null);
                        window.scrollTo(0, 0);
                    }}>
                        Volver a Inicio
                    </button>
                </footer>
            </div>
        );
    }

    return (
        <>
        <div className="home-container">
            <header>
                <div className="container">
                    <nav>
                        <div className="logo">
                            <img src={logoImg} alt="CAUCE Logo" fetchpriority="high" />
                            <span>CAUCE</span>
                        </div>
                        <div className={`nav-links ${menuOpen ? 'active' : ''}`}>
                            <a href="#inicio" onClick={() => setMenuOpen(false)}>Inicio</a>
                            <a href="#equipo" onClick={() => setMenuOpen(false)}>Integrantes</a>
                            <a href="#componentes" onClick={() => setMenuOpen(false)}>Componentes</a>
                            <a href="#jornadas" onClick={() => setMenuOpen(false)}>Ruta de Acción</a>
                            <a href="#preguntas" onClick={() => setMenuOpen(false)}>Preguntas</a>
                            <button className="nav-cta" onClick={handlePlataformaClick}>Plataforma</button>
                        </div>
                        <div className={`mobile-menu-btn ${menuOpen ? 'active' : ''}`} onClick={() => setMenuOpen(!menuOpen)}>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </nav>
                </div>
            </header>

            <section id="inicio" className="hero" style={{ backgroundImage: `url(${heroImg})` }}>
                <div className="hero-overlay"></div>
                <div className="container hero-content">
                    <span className="slogan-tag">Un río sano empieza con conciencia</span>
                    <h1>CAUCE</h1>
                    <p>Capacitación Agroambiental Unida para la Calidad de Entornos Hídricos. Recuperando el curso natural de nuestra cuenca.</p>
                </div>
            </section>

            <section id="equipo" className="section-padding">
                <div className="container">
                    <div className="section-title reveal">
                        <h2>Nuestro Equipo</h2>
                        <p>Estudiantes comprometidos con el futuro de los recursos hídricos en Azuero.</p>
                    </div>
                    <div className="team-grid">
                        {members.map((member, index) => (
                            <div
                                key={index}
                                className="team-member reveal"
                                onClick={() => setSelectedMember(member)}
                            >
                                <img src={member.photo} alt={member.name} className="team-avatar" loading="lazy" decoding="async" />
                                <span>{member.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            
            <section id="sabias" className="did-you-know section-padding">
                <div className="container">
                    <div className="section-title reveal">
                        <h2>¿Sabías que?</h2>
                    </div>
                    <div className="dyk-grid">
                        {data.didYouKnow.map((fact, index) => (
                            <div key={index} className="dyk-card reveal">
                                <div className="dyk-icon">💡</div>
                                <p>{fact}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="componentes" className="section-padding" style={{ backgroundColor: '#e9f5e9' }}>
                <div className="container">
                    <div className="section-title reveal">
                        <h2>Estrategia Técnica</h2>
                        <p>Nuestro enfoque combina ciencia, comunidad y mercado.</p>
                    </div>
                    <div className="components-grid">
                        {data.components.map((comp, index) => (
                            <div key={index} className="card reveal">
                                <h3>{index + 1}. {comp.title}</h3>
                                <p>{comp.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="jornadas" className="section-padding training-section">
                <div className="container">
                    <div className="section-title reveal">
                        <h2>Nuestra Ruta de Acción</h2>
                        <p style={{ maxWidth: '700px', margin: '0 auto', fontSize: '1.1rem', color: '#64748b', marginTop: '10px' }}>
                            Descubre las actividades y jornadas que realizamos para proteger las cuencas y promover prácticas sostenibles.
                        </p>
                    </div>
                    <div className="jornadas-grid reveal">
                        {data.training.map((item, index) => (
                            <div 
                                key={index} 
                                className="jornada-card"
                                onClick={() => {
                                    setSelectedJornada(item);
                                    window.scrollTo(0, 0);
                                }}
                            >
                                <div className="jornada-card-img" style={{ backgroundImage: `url("${encodeURI(item.image)}")` }}>
                                    <span className="jornada-badge-pill">{item.badge}</span>
                                </div>
                                <div className="jornada-card-content">
                                    <h3>{item.title}</h3>
                                    <p>{item.description}</p>
                                    <span className="jornada-btn">Leer Detalles &rarr;</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="preguntas" className="section-padding faqs-section">
                <div className="container">
                    <div className="section-title reveal">
                        <h2>Preguntas Frecuentes</h2>
                        <p>Todo lo que necesitas saber sobre CAUCE.</p>
                    </div>
                    <div className="faqs-grid">
                        {data.faqs.map((faq, index) => (
                            <div key={index} className="faq-item reveal">
                                <h3>{faq.question}</h3>
                                <p>{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="impacto-ods" className="section-padding ods-section">
                <div className="container">
                    <div className="section-title reveal">
                        <h2>Objetivos de Desarrollo Sostenible</h2>
                        <p>Nuestro compromiso con la Agenda 2030 de las Naciones Unidas.</p>
                    </div>
                    <div className="ods-grid">
                        {data.ods.map((ods, index) => (
                            <div key={index} className={`ods-card reveal ods-${ods.code}`}>
                                <div className="ods-number">ODS {ods.code}</div>
                                <h3>{ods.title}</h3>
                                <p>{ods.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <footer>
                <div className="container">
                    <p>&copy; 2026 CAUCE - Laboratorio de Acción Ciudadana</p>
                    <a href="https://instagram.com/caucepanama" target="_blank" rel="noopener noreferrer" className="instagram-btn footer-insta-hero">
                        SÍGUENOS EN INSTAGRAM
                    </a>
                </div>
            </footer>
        </div>

        {/* MODAL INTEGRANTE */}
        {selectedMember && (
            <div className="modal-overlay" onClick={() => setSelectedMember(null)}>
                <div className="modal-content" onClick={e => e.stopPropagation()}>
                    <button className="modal-close" onClick={() => setSelectedMember(null)}>&times;</button>
                    <img src={selectedMember.photo} alt={selectedMember.name} className="modal-img" loading="lazy" />
                    <h2>{selectedMember.name}</h2>
                    <a href={selectedMember.instagram} target="_blank" rel="noopener noreferrer" className="instagram-btn">
                        Ver Instagram
                    </a>
                </div>
            </div>
        )}

        {/* MODAL PWA TUTORIAL */}
        {showPwaTutorial && (
            <div className="modal-overlay" onClick={() => setShowPwaTutorial(false)}>
                <div className="modal-content pwa-tutorial-content" onClick={e => e.stopPropagation()}>
                    <button className="modal-close" onClick={() => setShowPwaTutorial(false)}>&times;</button>
                    
                    <div className="pwa-header">
                        <img src={logoImg} alt="logo" className="pwa-mini-logo" />
                        <h2>Instalar CAUCE App</h2>
                        <p>Lleva la plataforma de seguimiento contigo en tu pantalla de inicio.</p>
                    </div>

                    <div className="pwa-tabs">
                        <button 
                            className={`pwa-tab ${pwaDevice === 'android' ? 'active' : ''}`}
                            onClick={() => setPwaDevice('android')}
                        >
                            Android
                        </button>
                        <button 
                            className={`pwa-tab ${pwaDevice === 'ios' ? 'active' : ''}`}
                            onClick={() => setPwaDevice('ios')}
                        >
                            iPhone / iOS
                        </button>
                    </div>

                    <div className="pwa-steps">
                        {pwaDevice === 'android' ? (
                            <div className="pwa-step-list">
                                <div className="pwa-step-item"><b>1.</b> Abre esta página en <b>Chrome</b>.</div>
                                <div className="pwa-step-item"><b>2.</b> Toca los <b>tres puntos (⋮)</b> en la esquina superior derecha.</div>
                                <div className="pwa-step-item"><b>3.</b> Selecciona <b>"Instalar aplicación"</b> o <b>"Añadir a pantalla de inicio"</b>.</div>
                                <div className="pwa-step-item"><b>4.</b> Confirma y ¡listo!</div>
                            </div>
                        ) : (
                            <div className="pwa-step-list">
                                <div className="pwa-step-item"><b>1.</b> Abre esta página en <b>Safari</b>.</div>
                                <div className="pwa-step-item"><b>2.</b> Toca el botón <b>Compartir (📤)</b> en la barra inferior.</div>
                                <div className="pwa-step-item"><b>3.</b> Desliza hacia abajo y toca en <b>"Añadir a la pantalla de inicio"</b>.</div>
                                <div className="pwa-step-item"><b>4.</b> Pulsa <b>"Añadir"</b> en la esquina superior derecha.</div>
                            </div>
                        )}
                    </div>

                    <div className="pwa-footer-btns">
                        <button className="btn-primary" onClick={async () => {
                             if (deferredPrompt) {
                                 deferredPrompt.prompt();
                                 await deferredPrompt.userChoice;
                             }
                             onEnterApp();
                        }}>
                            CONTINUAR A LA PLATAFORMA →
                        </button>
                    </div>
                </div>
            </div>
        )}
        </>
    );
};

export default HomeView;
