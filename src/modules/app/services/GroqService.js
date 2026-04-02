import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

/* BASE DE CONOCIMIENTO EXTRAÍDA DEL INFORME ESTRATÉGICO 2026 */
const CAUCE_KNOWLEDGE = `
INFORMACIÓN DEL PROYECTO CAUCE:
- Qué es: Intervención social con cambio de comportamiento medible en agricultura. No son simples capacitaciones.
- Sede: Finca experimental El Ejido del IDIAP (estación real para práctica en campo).
- Respaldo: IDIAP, MIDA, y LLAC 2026.
- Modelo de 6 Pasos: 1. Capacitar, 2. Demostrar, 3. Practicar, 4. Asignar tarea, 5. Seguimiento (7-15 días), 6. Medir y ajustar.
- Las 5 Jornadas:
  1. Reducción de daño (uso correcto de agroquímicos).
  2. Alternativas (bioinsumos).
  3. Protección de suelo (manejo para evitar escorrentía).
  4. Restauración de barrera natural (reforestación).
  5. Economía circular (reducción de residuos).
- Innovación: Se enseña en campo real, se asigna una acción concreta a realizar en la finca propia y se mide el cambio de comportamiento. 
- Objetivo: Reducir y prevenir la contaminación del río La Villa desde las prácticas agrícolas.
`;

export const getGroqChatCompletion = async (messages) => {
  try {
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Eres el Asistente Virtual EXCLUSIVO de CAUCE (Centro Autónomo Universitario de Capacitación y Extensión). 
          
          REGLAS CRÍTICAS DE COMPORTAMIENTO:
          1. SOLO puedes hablar sobre el proyecto CAUCE utilizando la información proporcionada.
          2. Si el usuario pregunta algo NO relacionado con CAUCE (ejemplo: clima, chistes, otros proyectos, tecnología general, etc.), debes responder cortésmente: "Lo siento, como asistente exclusivo de CAUCE, solo estoy capacitado para responder dudas relacionadas con este proyecto y sus jornadas académicas."
          3. NO respondas preguntas de conocimiento general ni realices tareas que no tengan que ver con CAUCE.
          4. Mantén un tono profesional, amable y corporativo.

          INFORMACIÓN DE CAUCE PARA CONSULTA:
          ${CAUCE_KNOWLEDGE}
          
          Instrucciones de Respuesta:
          - Si te preguntan por qué CAUCE es diferente, resalta la "Capacitación en finca real" y las "Tareas aplicadas con seguimiento".`,
        },
        ...messages,
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3, // Bajamos aún más la temperatura para evitar alucinaciones
      max_tokens: 1024,
    });

    return response.choices[0]?.message?.content || "Lo siento, no pude procesar tu solicitud.";
  } catch (error) {
    console.error("Error connecting to Groq:", error);
    throw new Error("Hubo un problema al conectar con el servicio de IA.");
  }
};
