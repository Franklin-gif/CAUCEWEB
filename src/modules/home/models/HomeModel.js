const HomeModel = {
    getProjectData: () => ({
        components: [
            { title: "Alianzas Estratégicas", description: "Gestión y colaboración constante con entidades como el MIDA y el Idiap, asegurando el respaldo institucional para la validación técnica, acompañamiento en campo y logística en la cuenca del Río La Villa." },
            { title: "Caracterización", description: "Evaluación integral mediante visitas de campo y pre-test para identificar de forma precisa a agricultores clave cerca de afluentes críticos, apoyándonos en mapeos cartográficos y censos oficiales actualizados." },
            { title: "Capacitación", description: "Enfoque teórico-práctico y participativo en prácticas agrícolas sostenibles, donde los productores aprenden técnicas aplicables en sus fincas para mejorar cultivos, reducir costos y fortalecer el suelo." }
        ],
        training: [
            { title: "Uso Responsable de Agroquímicos", description: "Fortalecer los conocimientos de los productores sobre el uso adecuado de agroquímicos, promoviendo prácticas seguras para la salud y el ambiente." },
            { title: "Elaboración y Aplicación de Bioinsumos", description: "Fortalecer capacidades para implementar prácticas sostenibles mediante la elaboración y uso de bioinsumos, protegiendo los recursos hídricos." },
            { title: "Agricultura Regenerativa", description: "Promover la comprensión de prácticas regenerativas que mejoren la infiltración del agua, la cobertura del suelo y reduzcan la contaminación de cuencas." },
            { title: "Reforestación y Restauración de Áreas", description: "Promover la reforestación de áreas degradadas en los bordes de la cuenca del Río La Villa para reducir la erosión del suelo y proteger el recurso hídrico." },
            { title: "Economía circular aplicada al manejo de agua", description: "Capacitar en principios de economía circular para promover prácticas sostenibles que reduzcan la contaminación del río y generen ahorro en fincas." }
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
