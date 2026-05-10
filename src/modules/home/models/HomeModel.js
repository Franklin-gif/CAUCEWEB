const HomeModel = {
    getProjectData: () => ({
        components: [
            { title: "Alianzas Estratégicas", description: "Gestión y colaboración constante con entidades como el MIDA y el Idiap, asegurando el respaldo institucional para la validación técnica, acompañamiento en campo y logística en la cuenca del Río La Villa." },
            { title: "Caracterización", description: "Evaluación integral mediante visitas de campo y pre-test para identificar de forma precisa a agricultores clave cerca de afluentes críticos, apoyándonos en mapeos cartográficos y censos oficiales actualizados." },
            { title: "Capacitación", description: "Enfoque teórico-práctico y participativo en prácticas agrícolas sostenibles, donde los productores aprenden técnicas aplicables en sus fincas para mejorar cultivos, reducir costos y fortalecer el suelo." }
        ],
        training: [
            {
                badge: "AGROECOLOGÍA",
                title: "Uso Responsable de Agroquímicos",
                description: "Capacitación sobre el manejo seguro de productos químicos y su impacto en las fuentes de agua.",
                image: "/jornadas/1-uso-agroquimicos/IMG_2975.JPG.jpeg",
                details: "En nuestra primera jornada se desarrolló un espacio de aprendizaje y concientización enfocado en el uso responsable de agroquímicos, promoviendo el compromiso con el ambiente, la salud y el futuro. Durante esta actividad contamos con la valiosa participación del Ing. Juan Pablo Soriano y el Ing. Ernesto Herrera por parte de MiAmbiente Panamá, así como del Ing. Orlando Osorio por parte de CIAPCP AIP, quienes compartieron sus conocimientos y brindaron una enriquecedora capacitación a los participantes. Agradecemos también al Instituto de Innovación Agropecuaria de Panamá (IDIAP) por facilitar el espacio para el desarrollo de esta jornada.",
                gallery: [
                    "/jornadas/1-uso-agroquimicos/IMG_2993.JPG.jpeg",
                    "/jornadas/1-uso-agroquimicos/IMG_2994.JPG.jpeg",
                    "/jornadas/1-uso-agroquimicos/IMG_2995.JPG.jpeg",
                    "/jornadas/1-uso-agroquimicos/IMG_2997.JPG.jpeg"
                ],
                allies: ["MiAmbiente Panamá", "CIAPCP AIP", "IDIAP"]
            },
            {
                badge: "SOSTENIBILIDAD",
                title: "Elaboración y Aplicación de Bioinsumos",
                description: "Taller práctico sobre la creación de fertilizantes orgánicos y biopesticidas caseros.",
                image: "/jornadas/2-bioinsumos/IMG_2849.JPG",
                details: "En nuestra segunda jornada se abordó el tema de los bioinsumos y el vermicompost como alternativas sostenibles para nutrir el suelo, reducir residuos y fomentar prácticas agrícolas más responsables con el ambiente. A través de esta capacitación, los participantes pudieron comprender la importancia del cuidado del suelo como un elemento esencial para construir un futuro más sostenible y consciente. Agradecemos al Ing. Ezequiel Gaitán del Instituto de Innovación Agropecuaria de Panamá (IDIAP) por compartir su conocimiento y acompañarnos durante esta enriquecedora experiencia. 🌎💚",
                gallery: [
                    "/jornadas/2-bioinsumos/IMG_2851.JPG",
                    "/jornadas/2-bioinsumos/IMG_2854.JPG",
                    "/jornadas/2-bioinsumos/IMG_2855 (1).JPG",
                    "/jornadas/2-bioinsumos/IMG_2863.JPG",
                    "/jornadas/2-bioinsumos/IMG_2871 (1).JPG"
                ],
                allies: ["Instituto de Innovación Agropecuaria (IDIAP)"]
            },
            {
                badge: "BIODIVERSIDAD",
                title: "Introducción a la Agricultura Regenerativa",
                description: "Exploración de técnicas para restaurar la salud del suelo y aumentar la resiliencia climática.",
                image: "/jornadas/5-agricultura-regenerativa/IMG_3106.JPG",
                details: "En nuestra quinta y última jornada del proyecto CAUCE se desarrolló una capacitación enfocada en la agricultura regenerativa, donde se abordaron prácticas sostenibles orientadas a la recuperación de los suelos, el equilibrio de los ecosistemas y una producción agrícola más responsable. Durante esta experiencia se destacó el impacto positivo que estas acciones generan tanto en el ambiente como en el sector productivo, fortaleciendo la importancia de impulsar una agricultura más consciente y sostenible. Agradecemos al Instituto de Innovación Agropecuaria de Panamá (IDIAP) por el espacio brindado y, de manera especial, al Dr. Jorge Castro por compartir sus conocimientos y guiarnos durante esta enriquecedora jornada. Con esta actividad cerramos un ciclo lleno de aprendizajes, experiencias compartidas y el compromiso de seguir construyendo un futuro más sostenible. 🌿",
                gallery: [
                    "/jornadas/5-agricultura-regenerativa/IMG_3111.JPG",
                    "/jornadas/5-agricultura-regenerativa/IMG_3131.JPG",
                    "/jornadas/5-agricultura-regenerativa/IMG_3132.JPG",
                    "/jornadas/5-agricultura-regenerativa/IMG_3143 (1).JPG"
                ],
                allies: ["Instituto de Innovación Agropecuaria (IDIAP)", "Dr. Jorge Castro"]
            },
            {
                badge: "RESTAURACIÓN",
                title: "Reforestación y Conservación de Suelos",
                description: "Jornada de siembra de especies nativas en zonas críticas de la cuenca hidrográfica.",
                image: "/jornadas/4-reforestacion/IMG_3583.JPG.jpeg",
                details: "En nuestra cuarta jornada vivimos una experiencia enfocada en la acción y el compromiso ambiental, realizando una jornada de reforestación en las áreas cercanas a la cuenca de la sede del Instituto de Innovación Agropecuaria de Panamá (IDIAP) en La Villa, contribuyendo directamente a la recuperación y protección de los ecosistemas. Durante la actividad se plantó guadua (cañaza verde), una especie fundamental para prevenir la erosión, reducir el riesgo de deslaves en temporadas lluviosas y disminuir la contaminación de los ríos, demostrando la importancia de actuar responsablemente en favor del ambiente. Agradecemos al Dr. Anovel Barba por brindar el espacio para esta actividad, a Grupo Calesa y CIAPCP AIP por su apoyo y donación de plantones, y al Ing. José Cárdenas, integrante del comité de cuenca de la región de Los Santos de MiAmbiente Panamá, por guiarnos durante el proceso de siembra.",
                gallery: [
                    "/jornadas/4-reforestacion/IMG_3598.JPG.jpeg",
                    "/jornadas/4-reforestacion/IMG_3602.JPG.jpeg",
                    "/jornadas/4-reforestacion/IMG_3606.JPG.jpeg",
                    "/jornadas/4-reforestacion/IMG_3034.JPG",
                    "/jornadas/4-reforestacion/IMG_3071.JPG"
                ],
                allies: ["IDIAP La Villa", "Grupo Calesa", "CIAPCP AIP", "MiAmbiente Panamá"]
            },
            {
                badge: "RECURSOS HÍDRICOS",
                title: "Recursos Hídricos y Economía Circular",
                description: "Análisis de la gestión del agua y aprovechamiento de residuos en sistemas productivos.",
                image: "/jornadas/3-Recursos Hidricos y economia-circular/IMG_2924.JPG",
                details: "En nuestra tercera jornada se desarrolló un espacio de aprendizaje y reflexión enfocado en la conservación hídrica y la economía circular, promoviendo la conciencia ambiental y el compromiso con un futuro más sostenible. La capacitación fue impartida por el Ing. Feliciano Escobar y el Ing. José Cárdenas, integrantes de la sección de Seguridad Hídrica del Departamento de Manejo Integrado de Cuencas de la regional de Los Santos de MiAmbiente Panamá. Además, desde el área de Conservación de Suelos se fortaleció una visión integral orientada a la protección de nuestros recursos naturales. Esta jornada permitió el intercambio de ideas, el fortalecimiento de conocimientos y la construcción de soluciones sostenibles desde el ámbito local.",
                gallery: [
                    "/jornadas/3-Recursos Hidricos y economia-circular/IMG_2888.JPG",
                    "/jornadas/3-Recursos Hidricos y economia-circular/IMG_2901.JPG",
                    "/jornadas/3-Recursos Hidricos y economia-circular/IMG_2924.JPG",
                    "/jornadas/3-Recursos Hidricos y economia-circular/IMG_2927.JPG",
                    "/jornadas/3-Recursos Hidricos y economia-circular/IMG_2944.JPG",
                    "/jornadas/3-Recursos Hidricos y economia-circular/IMG_2956.JPG",
                    "/jornadas/3-Recursos Hidricos y economia-circular/IMG_2972.JPG"
                ],
                allies: ["MiAmbiente Panamá (Seguridad Hídrica)", "Sección de Manejo de Cuencas"]
            },
            {
                badge: "COMUNIDAD",
                title: "Presencia en Feria de Azuero",
                description: "Espacio de divulgación y sensibilización ambiental en el evento más importante de la región.",
                image: "/jornadas/6-feria-azuero/IMG_4146.JPG.jpeg",
                details: "Como parte de las actividades de proyección comunitaria del proyecto CAUCE, tuvimos la oportunidad de contar con un stand en la Feria Internacional de Azuero gracias al apoyo del Comité de Cuenca de La Villa de Los Santos. Durante esta experiencia pudimos acercarnos a miembros de la comunidad para dar a conocer más a fondo el proyecto, explicando sus objetivos, el impacto que busca generar y cada una de las jornadas desarrolladas a lo largo del programa. Además, se realizaron encuestas para conocer la percepción de las personas sobre la iniciativa, permitiéndonos recopilar opiniones, sugerencias y medir el interés de la comunidad. La participación del público fue muy positiva, ya que muchas personas mostraron interés en las temáticas abordadas, valoraron el enfoque ambiental y sostenible del proyecto, y destacaron la importancia de seguir impulsando este tipo de iniciativas en beneficio de la comunidad y del medio ambiente.",
                gallery: [
                    "/jornadas/6-feria-azuero/IMG_4020.JPG.jpeg",
                    "/jornadas/6-feria-azuero/IMG_4212.JPG.jpeg",
                    "/jornadas/6-feria-azuero/IMG_4213.JPG.jpeg",
                    "/jornadas/6-feria-azuero/IMG_3980.MOV"
                ],
                allies: ["Comité de Cuenca de La Villa de Los Santos", "Patronato de la Feria de Azuero"]
            },
            {
                badge: "TECNOLOGÍA",
                title: "Foro Sembrando Futuros",
                description: "Espacio de diálogo e intercambio de ideas sobre el impacto del proyecto CAUCE.",
                image: "/jornadas/7-foro-virtual/IMG_5156.JPG.jpeg",
                details: "Como cierre de nuestro proceso formativo y de impacto comunitario, realizamos el foro Sembrando Futuros, un espacio de diálogo e intercambio de ideas en el que reunimos a participantes de las jornadas, estudiantes universitarios, docentes, especialistas y miembros de la comunidad interesados en conocer más sobre el proyecto CAUCE. Durante el foro presentamos el propósito e impacto del proyecto, compartiendo cómo surgió la iniciativa y los resultados obtenidos a lo largo de su desarrollo. Además, se realizó un recorrido por cada una de las cinco jornadas ejecutadas, explicando sus temáticas, aprendizajes y experiencias vividas, permitiendo que quienes no participaron directamente pudieran conocer a profundidad todo el trabajo realizado. Este espacio también permitió escuchar diferentes perspectivas sobre el proyecto, recibir retroalimentación de profesionales y asistentes, y generar conversaciones sobre la importancia de continuar impulsando iniciativas enfocadas en la sostenibilidad, la educación ambiental y el desarrollo comunitario.",
                gallery: [
                    "/jornadas/7-foro-virtual/IMG_5160.JPG.jpeg"
                ],
                allies: ["Estudiantes Universitarios", "Docentes y Especialistas", "Comunidad de Azuero"]
            }
        ],
        faqs: [
            {
                question: "¿Qué es CAUCE?",
                answer: "Es una iniciativa de jóvenes líderes del Laboratorio Latinoamericano de Acción Ciudadana 2026 que busca atacar la raíz del problema en el Río La Villa, a través de jornadas de capacitación en buenas prácticas agroambientales sostenibles para actores del sector agrícola."
            },
            {
                question: "¿Cuál es nuestro objetivo?",
                answer: "Concientizar a productores del sector agrícola en la adopción de buenas prácticas agroambientales para la conservación del agua y suelo, a través de un programa de formación de dos meses."
            },
            {
                question: "¿Cuál es nuestro propósito?",
                answer: "Beneficiar a los productores agrícolas con capacitaciones en prácticas sostenibles que mejoren sus cultivos, reduzcan costos de producción y fortalezcan el suelo. Esto se desarrollará con un enfoque teórico-práctico donde aprenderán técnicas aplicables en sus fincas."
            }
        ],
        didYouKnow: [
            "En la región de Azuero, miles de personas dependen del agua del Río La Villa para su consumo diario. Sin embargo, estudios han detectado plaguicidas y metales pesados potencialmente cancerígenos en sus aguas."
        ],
        ods: [
            { code: "3", title: "Salud y Bienestar", description: "Garantizar una vida sana y promover el bienestar para todos en todas las edades." },
            { code: "6", title: "Agua Limpia y Saneamiento", description: "Garantizar la disponibilidad de agua y su gestión sostenible y el saneamiento para todos." },
            { code: "12", title: "Producción y Consumo Responsables", description: "Garantizar modalidades de consumo y producción sostenibles." },
            { code: "17", title: "Alianzas para lograr objetivos", description: "Fortalecer los medios de ejecución y revitalizar la Alianza Mundial para el Desarrollo Sostenible." }
        ]
    }),
    getMembers: () => [
        { name: "Gabriel Urriola", instagram: "https://instagram.com/gaudc.21", photo: "/team/gabriel.jpg" },
        { name: "Euris Batista", instagram: "https://instagram.com/euris.btista", photo: "/team/euris.jpg" },
        { name: "Franklin Bernal", instagram: "https://instagram.com/beernal.11", photo: "/team/franklin.jpg" },
        { name: "Yerlin Jimenez", instagram: "https://instagram.com/yerlin.js", photo: "/team/yerlin.jpg" },
        { name: "Rodolfo Ferrabone", instagram: "https://instagram.com/rodolfo.f30", photo: "/team/rodolfo.jpg" },
        { name: "Hilary Peralta", instagram: "https://instagram.com/hilary_peralta27", photo: "/team/hilary.jpg" },
        { name: "Grettelin Torres", instagram: "https://instagram.com/g_sherlinetr", photo: "/team/grettelin.jpg" },
        { name: "Jenyfer Aragón", instagram: "https://instagram.com/jenyceci1701", photo: "/team/jenyfer.jpg" },
        { name: "Melanie Sánchez", instagram: "https://instagram.com/sxnc_z", photo: "/team/melanie.jpg" },
        { name: "Reina Somoza", instagram: "https://instagram.com/r.somoza06", photo: "/team/reina.jpg" }
    ]
};

export default HomeModel;
