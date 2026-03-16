import React, { useEffect, useState } from 'react';
import heroImg from '/src/assets/images/hero.png';
import logoImg from '/src/assets/images/logo.png';

const HomeView = ({ data, members }) => {
    const [selectedMember, setSelectedMember] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const reveal = () => {
            const reveals = document.querySelectorAll(".reveal");
            for (let i = 0; i < reveals.length; i++) {
                const windowHeight = window.innerHeight;
                const elementTop = reveals[i].getBoundingClientRect().top;
                const elementVisible = 150;
                if (elementTop < windowHeight - elementVisible) {
                    reveals[i].classList.add("active");
                }
            }
        };

        window.addEventListener("scroll", reveal);
        reveal();
        return () => window.removeEventListener("scroll", reveal);
    }, []);

    return (
        <>
        <div className="home-container">
            <header>
                <div className="container">
                    <nav>
                        <div className="logo">
                            <img src={logoImg} alt="CAUCE Logo" />
                            <span>CAUCE</span>
                        </div>
                        <div className={`nav-links ${menuOpen ? 'active' : ''}`}>
                            <a href="#inicio" onClick={() => setMenuOpen(false)}>Inicio</a>
                            <a href="#equipo" onClick={() => setMenuOpen(false)}>Integrantes</a>
                            <a href="#componentes" onClick={() => setMenuOpen(false)}>Componentes</a>
                            <a href="#capacitacion" onClick={() => setMenuOpen(false)}>Capacitación</a>
                            <a href="#preguntas" onClick={() => setMenuOpen(false)}>Preguntas</a>
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
                                <img src={member.photo} alt={member.name} className="team-avatar" />
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

            <section id="capacitacion" className="section-padding training">
                <div className="container">
                    <div className="section-title reveal">
                        <h2>Programa de Formación</h2>
                        <p>Cinco jornadas enfocadas en la protección hídrica (ODS 6 y 12).</p>
                    </div>
                    <div className="training-items">
                        {data.training.map((item, index) => (
                            <div key={index} className="training-item reveal">
                                <div className="training-icon">{index + 1}</div>
                                <div>
                                    <h3>{item.title}</h3>
                                    <p>{item.description}</p>
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

        {selectedMember && (
            <div className="modal-overlay" onClick={() => setSelectedMember(null)}>
                <div className="modal-content" onClick={e => e.stopPropagation()}>
                    <button className="modal-close" onClick={() => setSelectedMember(null)}>&times;</button>
                    <img src={selectedMember.photo} alt={selectedMember.name} className="modal-img" />
                    <h2>{selectedMember.name}</h2>
                    <a href={selectedMember.instagram} target="_blank" rel="noopener noreferrer" className="instagram-btn">
                        Ver Instagram
                    </a>
                </div>
            </div>
        )}
        </>
    );
};

export default HomeView;
