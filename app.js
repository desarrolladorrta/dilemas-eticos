"use strict";

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const routes = ["inicio", "principios", "modelo", "comprension", "casos", "sintesis"];
const titles = ["Bienvenida", "Principios éticos", "Modelo de reflexión", "Comprueba lo aprendido", "Dilemas del aula", "Síntesis y autoevaluación"];
const storageKey = "cecar-etica-v2";
const emptyState = () => ({
  principles: [], model: [], matched: false, quiz: false, cases: {}, map: false,
  checks: [false, false, false, false], associations: ["", "", ""], quizChoice: null,
  mapChoices: ["", "", "", ""]
});
let state = emptyState();
let storageWorks = true;
try {
  const saved = JSON.parse(localStorage.getItem(storageKey));
  if (saved && Array.isArray(saved.principles) && Array.isArray(saved.model)
    && Array.isArray(saved.checks) && Array.isArray(saved.associations)
    && Array.isArray(saved.mapChoices) && saved.cases && typeof saved.cases === "object") {
    state = { ...state, ...saved };
  }
} catch { storageWorks = false; }
let current = "inicio";
const announce = text => { $("#announcement").textContent = text; };

// A single, decorative line-icon family; text always carries the meaning.
function icon(name) {
  const paths = {
    balance: '<path d="M12 3v17m-5 1h10M4 7h16M5 7l-3 7h6L5 7Zm14 0-3 7h6l-3-7Z"/><path d="M2 14c0 2 6 2 6 0m8 0c0 2 6 2 6 0"/>',
    book: '<path d="M12 6v15M3 4c3-1 6 0 9 2 3-2 6-3 9-2v15c-3-1-6 0-9 2-3-2-6-3-9-2V4Z"/>',
    heart: '<path d="m12 21-8-8C-2 7 6-1 12 6c6-7 14 1 8 7l-8 8Z"/>',
    shield: '<path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z"/><path d="m8 12 3 3 5-6"/>',
    search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
    people: '<circle cx="9" cy="7" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3M16 4a3 3 0 0 1 0 6m3 4a5 5 0 0 1 2 4v3"/>',
    check: '<path d="M9 4H5v17h14V4h-4M9 3h6v4H9V3Z"/><path d="m8 14 3 3 5-6"/>',
    route: '<circle cx="5" cy="5" r="2"/><circle cx="19" cy="19" r="2"/><path d="M7 5h9a4 4 0 0 1 0 8H8a3 3 0 0 0 0 6h9"/>',
    branches: '<rect x="8" y="2" width="8" height="5" rx="1"/><rect x="2" y="17" width="7" height="5" rx="1"/><rect x="15" y="17" width="7" height="5" rx="1"/><path d="M12 7v5m-7 5v-5h14v5"/>',
    question: '<circle cx="12" cy="12" r="9"/><path d="M9 9a3 3 0 1 1 5 2c-1 1-2 1-2 3m0 3v.1"/>',
    argument: '<path d="M21 12a8 8 0 0 1-8 8H8l-5 2v-6a8 8 0 1 1 18-4Z"/><path d="m8 11 3 3 5-6"/>',
    library: '<path d="M4 4h5v17H4V4Zm7 0h4v17h-4V4Zm5 1 4-1 3 16-4 1-3-16Z"/>',
    reset: '<path d="M4 10a8 8 0 1 1 2 8M4 4v6h6"/>'
  };
  return `<svg class="line-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${paths[name] || paths.book}</svg>`;
}
function sectionHeading(name, text, id = "") {
  return `<h2 class="section-heading"${id ? ` id="${id}"` : ""}>${icon(name)}<span>${text}</span></h2>`;
}

// Stable within this visit, with canonical values independent of visible position.
const optionOrders = new Map();
function ordered(key, items) {
  if (!optionOrders.has(key)) {
    const order = items.map((_, i) => i);
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    optionOrders.set(key, order);
  }
  return optionOrders.get(key).map(index => ({ item: items[index], index }));
}
function completed() {
  return [false, state.principles.length === 4, state.model.length === 4,
    state.matched && state.quiz, Boolean(state.cases.leo?.done && state.cases.excursion?.done),
    state.map && state.checks.every(Boolean)];
}
function updateProgress() {
  const done = completed();
  const total = state.principles.length + state.model.length + Number(state.matched)
    + Number(state.quiz) + Number(Boolean(state.cases.leo?.done))
    + Number(Boolean(state.cases.excursion?.done)) + Number(state.map)
    + state.checks.filter(Boolean).length;
  const percent = Math.round(total / 17 * 100);
  $("#progress").value = percent;
  $("#progress-text").textContent = `${percent} %`;
  $("#progress-note").textContent = percent === 100
    ? "Recorrido completado. ¡Sigue reflexionando!" : "Explora, contrasta y comprueba.";
  $("#navigation").innerHTML = routes.map((route, i) => {
    const active = current === route || (current.startsWith("caso-") && route === "casos");
    return `<a href="#${route}" class="nav-link ${active ? "active" : ""} ${done[i] ? "done" : ""}"
      ${active ? 'aria-current="step"' : ""}><span class="nav-number">${done[i] ? "✓" : i + 1}</span><span>${titles[i]}</span></a>`;
  }).join("");
}
function save() {
  try { localStorage.setItem(storageKey, JSON.stringify(state)); }
  catch { storageWorks = false; }
  updateProgress();
  if (!storageWorks) $("#save-note").textContent = "El guardado local no está disponible. Puedes completar las actividades durante esta visita.";
}
function top(label) {
  return `<div class="page-top"><span>Dilemas éticos en la práctica docente</span><span><i class="dot" aria-hidden="true"></i> ${label}</span></div>`;
}
function footer(previous, next, nextLabel = "Continuar") {
  return `<footer class="page-footer"><p>De la reflexión a la acción pedagógica.</p><div class="buttons">
    ${previous ? `<a class="secondary" href="#${previous}">← Anterior</a>` : ""}
    ${next ? `<a class="primary" href="#${next}">${nextLabel} <span aria-hidden="true">→</span></a>` : ""}
    </div></footer><p class="site-credit">CECAR · Teoría e Historia de la Pedagogía</p>`;
}

const principles = [
  { title: "Justicia y equidad", text: "Asegurar que cada estudiante reciba lo que necesita para desarrollarse, reconociendo y atendiendo a sus diferencias, sin favoritismos ni prejuicios.", hint: "Reconocer las diferencias", connection: "La justicia y la equidad dialogan con la pedagogía crítica: una norma puede reproducir desigualdades si ignora las condiciones de quienes aprenden." },
  { title: "Responsabilidad formativa", text: "Asumir el compromiso por el aprendizaje y el desarrollo integral del estudiante, más allá de la mera transmisión de contenidos.", hint: "Poner el aprendizaje en el centro", connection: "La responsabilidad formativa exige preguntarse por la finalidad de la enseñanza y por lo que una evaluación permite aprender." },
  { title: "Ética del cuidado", text: "Establecer relaciones de confianza y empatía, reconociendo la vulnerabilidad del estudiante y procurando su bienestar emocional y físico (Noddings, 1984).", hint: "Comprender a quien aprende", connection: "La ética del cuidado conecta con enfoques humanistas: las relaciones y las necesidades concretas son parte de la experiencia educativa." },
  { title: "Integridad profesional", text: "Actuar con honestidad, coherencia y respeto a la normativa, manteniendo la confidencialidad y la objetividad en el ejercicio de la profesión.", hint: "Actuar con coherencia", connection: "La deontología profesional aporta deberes; el juicio pedagógico permite interpretarlos responsablemente ante situaciones concretas." }
];
const steps = [
  { title: "Identificar", question: "¿Cuál es el dilema central?", text: "Distingue el problema de la tensión ética. Nombra los principios que entran en conflicto: por ejemplo, justicia y cuidado. No reduzcas la situación a quién hizo algo mal.", example: "Un estudiante usa un traductor en línea para sus tareas de inglés. Entran en tensión la integridad académica y la responsabilidad de atender sus posibles dificultades." },
  { title: "Analizar", question: "¿Quiénes están involucrados y qué sabemos?", text: "Reconoce a las personas afectadas, los hechos relevantes y las normativas aplicables. Separa la evidencia de las suposiciones y escucha las distintas perspectivas.", example: "Afecta al estudiante, al docente y a la clase. Antes de decidir, averigua qué uso hizo del traductor, qué había comprendido y qué acuerdos de trabajo existían." },
  { title: "Valorar", question: "¿Qué alternativas y consecuencias existen?", text: "Plantea varios cursos de acción. Considera sus efectos a corto y largo plazo sobre el aprendizaje, la confianza y la convivencia. Pregúntate qué valor protege y qué valor arriesga cada alternativa.", example: "¿Confrontar y sancionar, ofrecer apoyo o ignorar el uso del traductor? Una sanción sin diálogo puede ocultar una necesidad; ignorarlo puede debilitar los acuerdos académicos." },
  { title: "Actuar y justificar", question: "¿Qué decisión puedes fundamentar?", text: "Elige la acción más responsable pedagógicamente. Explica sus razones, acuerda cómo llevarla a cabo y documenta el proceso cuando sea necesario. Revisa después sus efectos para transformar tu práctica.", example: "Dialogar sobre el uso de herramientas, comprobar el aprendizaje y acordar una tarea acompañada es una posible respuesta. Su pertinencia depende de los hechos y de los acuerdos del curso." }
];
const matchSituations = [
  "Un docente dedica tiempo extra después de clase para apoyar a un estudiante que muestra dificultades emocionales debido a problemas en casa.",
  "Un docente garantiza que los criterios de evaluación sean claros para todos y se apliquen de la misma manera a cada estudiante.",
  "Un docente se niega a compartir información confidencial sobre el rendimiento de un estudiante con las familias de sus compañeros."
];
const matchOptions = ["Ética del cuidado", "Justicia y equidad", "Integridad profesional"];
const quizOptions = [
  "Un docente busca reparar el proyector del aula para mostrar una presentación que necesita durante la explicación planificada del tema.",
  "Un docente considera reportar la falta de un colega, aunque hacerlo pueda afectar la confianza y la convivencia del equipo.",
  "Un docente reorganiza los ejercicios de matemáticas para explicar un procedimiento que varios estudiantes todavía no han logrado comprender correctamente."
];
const cases = {
  leo: {
    title: "La evaluación de Leo", theme: "Equidad en la evaluación",
    short: "Un mismo aprendizaje, distintas posibilidades. ¿Cómo equilibrar la rúbrica y el contexto?",
    narrative: "Eres el profesor de Ciencias. Leo es un estudiante brillante y participativo, pero proviene de una familia con escasos recursos económicos. Para el proyecto final, que vale el 30 % de la nota, los estudiantes debían construir un modelo del sistema solar. La mayoría ha presentado maquetas impresionantes. Leo entrega un dibujo detallado en una cartulina y explica que no pudo comprar los materiales. El dibujo cumple con todos los criterios académicos de contenido, pero no con el requisito del formato «maqueta» especificado en la rúbrica.",
    dilemma: "¿Aplicas estrictamente la rúbrica, afectando su promedio, o reconoces sus condiciones socioeconómicas, con el riesgo de que los demás perciban un trato injusto?",
    alt: "Un docente examina un dibujo del sistema solar en un escritorio donde también hay una maqueta tridimensional.",
    caption: "El aprendizaje demostrado y los materiales disponibles son dimensiones diferentes de la evaluación.",
    perspectives: [
      { name: "La rúbrica", principle: "Justicia y equidad", text: "¿Aplicar la misma norma a todos es siempre lo más justo? ¿La rúbrica fue diseñada considerando la diversidad de condiciones del estudiantado?" },
      { name: "El dibujo de Leo", principle: "Responsabilidad formativa", text: "¿El objetivo de la evaluación era medir la capacidad de comprar materiales o la comprensión del sistema solar? ¿El dibujo evidencia el aprendizaje esperado?" },
      { name: "Su contexto familiar", principle: "Ética del cuidado", text: "¿Cómo afectará la decisión a la motivación y autoestima de Leo? ¿Ignorar su contexto puede reproducir desigualdades y constituir una forma de violencia simbólica?" }
    ],
    options: [
      "Aplicar el criterio de formato tal como fue anunciado y explicar a Leo que la misma rúbrica debe regir la calificación de todo el grupo.",
      "Asignar al dibujo la nota completa del proyecto y mantener para los demás estudiantes los criterios de formato que se habían anunciado originalmente.",
      "Ofrecer a Leo un formato accesible que evidencie su aprendizaje y revisar la rúbrica para que las próximas evaluaciones contemplen alternativas equivalentes para todos."
    ],
    feedback: [
      { title: "La justicia no siempre es uniformidad", value: "Priorizas una norma común y clara, lo que evita arbitrariedades.", risk: "Puedes penalizar condiciones fuera del control del estudiante, invisibilizar su aprendizaje y desmotivarlo. La equidad no siempre es igualdad.", question: "¿Cómo conservarías criterios transparentes sin convertir los recursos económicos en un criterio de calificación?" },
      { title: "Cuidar también exige transparencia", value: "Proteges la autoestima y reconoces el aprendizaje real de Leo.", risk: "Ignorar un criterio sin explicar ni revisar la evaluación puede ser percibido como una injusticia y debilitar los acuerdos compartidos.", question: "¿Cómo harías explícito el ajuste y lo convertirías en una posibilidad justa para todos?" },
      { title: "Transformar la evaluación desde la reflexión", value: "Buscas equilibrar justicia, cuidado y responsabilidad formativa. Una alternativa accesible reconoce el aprendizaje y mantiene expectativas compartidas.", risk: "La alternativa no debe imponer una carga adicional injustificada a Leo. Asegura recursos, criterios y oportunidades accesibles para todos.", question: "¿Qué cambiarías en la próxima rúbrica para evaluar el aprendizaje sin reproducir barreras económicas?" }
    ],
    reasoningQuestion: "¿Qué criterio permite fundamentar una evaluación equitativa?",
    reasoningOptions: [
      "Mantener el formato original como evidencia principal, pues modificarlo después de la entrega puede debilitar la autoridad de los criterios anunciados.",
      "Valorar el aprendizaje demostrado con evidencias equivalentes, pues las diferencias en los recursos disponibles no deberían convertirse en diferencias de exigencia académica.",
      "Otorgar el mismo puntaje a todos los productos entregados, pues evitar diferencias en las notas puede prevenir conflictos y proteger la motivación del grupo."
    ],
    reasoningAnswer: 1,
    reasoningFeedback: [
      "La transparencia importa, pero el formato no debe desplazar el aprendizaje que la evaluación busca evidenciar. Revisa qué criterio reduce barreras sin reducir la exigencia académica.",
      "La equidad sostiene expectativas académicas compartidas y admite evidencias equivalentes. Revisar recursos y formatos permite evaluar el aprendizaje sin premiar la capacidad de comprar materiales.",
      "Cuidar la motivación no exige igualar todas las notas. La evaluación necesita evidencias de aprendizaje y criterios transparentes, no puntajes idénticos para evitar conflictos."
    ]
  },
  excursion: {
    title: "La excursión escolar", theme: "Inclusión y seguridad",
    short: "La participación de un estudiante y el cuidado del grupo. ¿Qué condiciones hacen posible incluir?",
    narrative: "Tu grupo realizará una visita a un museo. En salidas anteriores, Samuel se ha separado del grupo y ha respondido impulsivamente cuando recibe indicaciones. No se han registrado agresiones, pero el equipo docente teme no poder acompañarlo de manera suficiente durante el desplazamiento. Samuel quiere asistir y su familia está dispuesta a colaborar. Una colega propone excluirlo para proteger al grupo. Aún no se han revisado con él los apoyos, los acuerdos de convivencia ni las condiciones de acompañamiento de la visita.",
    dilemma: "¿Excluyes a Samuel para reducir el riesgo, permites su participación sin cambios o construyes condiciones de apoyo que atiendan su inclusión y la seguridad de todos?",
    alt: "Una educadora escucha a un adolescente y revisa un mapa con él, mientras otro adulto acompaña al grupo a la entrada de un museo.",
    caption: "Escuchar y planificar apoyos permite analizar la inclusión junto con la seguridad del grupo.",
    perspectives: [
      { name: "La voz de Samuel", principle: "Justicia y equidad", text: "¿Se ha escuchado al estudiante? ¿Excluirlo por sus antecedentes, sin valorar apoyos, convierte su conducta en una etiqueta permanente? ¿Qué oportunidad de aprendizaje perdería?" },
      { name: "El grupo y la visita", principle: "Responsabilidad formativa", text: "¿Qué riesgos concretos existen en el trayecto y el museo? ¿Con qué personal y protocolos cuenta la institución? Incluir no significa ignorar la seguridad del grupo." },
      { name: "La familia y los apoyos", principle: "Ética del cuidado e integridad", text: "¿Qué estrategias ayudan a Samuel a autorregularse? ¿Cómo pueden colaborar la familia y el equipo de apoyo, sin trasladarles toda la responsabilidad ni divulgar información privada?" }
    ],
    options: [
      "Mantener la salida como estaba prevista y dejar a Samuel en el colegio con una actividad alternativa, para reducir los riesgos señalados por el equipo.",
      "Permitir que Samuel participe con las condiciones habituales del grupo y recordarle las reglas al salir, para evitar que reciba un trato diferente al resto.",
      "Acordar con Samuel y su familia apoyos viables, revisar los riesgos con la institución y organizar su participación según las condiciones de seguridad realmente disponibles."
    ],
    feedback: [
      { title: "Proteger sin etiquetar", value: "Reconoces la responsabilidad de cuidar al grupo y anticipar riesgos.", risk: "Excluir automáticamente, sin escuchar ni evaluar apoyos, puede reforzar la estigmatización y negar una oportunidad formativa. Los antecedentes no sustituyen un análisis concreto.", question: "¿Qué hechos y apoyos necesitas revisar antes de decidir una restricción proporcional y fundamentada?" },
      { title: "Incluir no es dejar sin acompañamiento", value: "Defiendes la participación y evitas una exclusión inmediata.", risk: "Ofrecer exactamente las mismas condiciones puede ignorar necesidades de apoyo. Sin ajustes ni evaluación de riesgos, queda desprotegido tanto Samuel como el grupo.", question: "¿Qué ajustes harían de la participación una experiencia de aprendizaje y no una exposición al riesgo?" },
      { title: "Una inclusión con condiciones responsables", value: "Articulas participación, cuidado y responsabilidad. Escuchar, acordar apoyos y evaluar riesgos permite construir una decisión contextualizada.", risk: "No puedes prometer seguridad sin recursos reales. Si los apoyos son insuficientes, corresponde revisar la salida y buscar alternativas formativas no punitivas, conforme a los protocolos institucionales.", question: "¿Cómo revisarías los acuerdos y valorarías después la experiencia con Samuel?" }
    ],
    reasoningQuestion: "¿Qué criterio permite fundamentar una participación responsable?",
    reasoningOptions: [
      "Valorar los riesgos concretos y los apoyos disponibles, pues la inclusión exige condiciones de participación que cuiden al estudiante y al grupo.",
      "Tomar la conducta pasada como criterio definitivo, pues prevenir dificultades en la salida requiere mantener las mismas consecuencias ante cualquier incumplimiento previo.",
      "Dar prioridad a la voluntad de asistir del estudiante, pues garantizar la inclusión implica permitir su participación con las condiciones previstas inicialmente."
    ],
    reasoningAnswer: 0,
    reasoningFeedback: [
      "La inclusión responsable integra escucha, evaluación de riesgos y apoyos viables. La decisión depende de condiciones concretas y de los protocolos institucionales, no de etiquetas ni de promesas de seguridad sin recursos.",
      "Los antecedentes ayudan a anticipar necesidades, pero no bastan para decidir. Una restricción requiere valorar riesgos actuales, escuchar al estudiante y considerar apoyos y alternativas proporcionales.",
      "Escuchar la voluntad de Samuel es necesario, pero no sustituye el acompañamiento. Participar con seguridad puede requerir ajustes distintos de las condiciones inicialmente previstas."
    ]
  }
};
const mapLabels = ["Reflexión y acción que transforman la práctica", "Respuesta empática a las necesidades del otro", "Reconocimiento de diferencias sin favoritismo", "Compromiso con el aprendizaje y el desarrollo integral"];
const mapOptions = ["Praxis", "Ética del cuidado", "Justicia", "Responsabilidad"];
const checklist = ["Puedo definir qué es un dilema ético en el contexto docente.", "Reconozco los principios éticos que entran en conflicto en una situación escolar.", "Soy capaz de aplicar los cuatro pasos para analizar un caso.", "Distingo argumentos que fundamentan una decisión pedagógica responsable."];

function radioOptions(key, name, options, selected) {
  return `<div class="options">${ordered(key, options).map(({ item, index }, position) =>
    `<label class="option"><input required type="radio" name="${name}" value="${index}" ${selected === index ? "checked" : ""}>
    <span><strong>${String.fromCharCode(65 + position)}.</strong> ${item}</span></label>`).join("")}</div>`;
}
function renderInicio() {
  return `${top("Bienvenida")}<div class="intro-grid"><div class="intro-copy"><h1>Decidir también<br>es <span>educar.</span></h1>
    <p class="lead">La ética está en el corazón de la praxis docente. Explora situaciones del aula en las que no hay una respuesta única y aprende a fundamentar tus decisiones.</p>
    <a class="primary" href="#principios">Comenzar el recorrido <span aria-hidden="true">→</span></a></div>
    <div class="scenario-preview"><div class="case-label"><span class="preview-mark" aria-hidden="true">?</span> Una decisión del aula</div>
    <h2>¿La misma regla para todos es siempre lo más justo?</h2><p>Leo comprende el sistema solar, pero no puede comprar los materiales de la maqueta. Su dibujo demuestra el aprendizaje. ¿Cómo lo evaluarías?</p>
    <div class="tension"><span>La norma compartida</span><span aria-hidden="true">↔</span><span>Las condiciones de cada quien</span></div></div></div>
    <section class="learn-section">${sectionHeading("route", "Un recorrido para construir tu criterio")}<ol class="learning-list">
    <li><span class="small-index">01</span><strong>Reconoce los principios</strong>Distingue un problema técnico de un dilema donde entran en tensión valores.</li>
    <li><span class="small-index">02</span><strong>Contrasta perspectivas</strong>Aplica un modelo de reflexión y considera las consecuencias de tus decisiones.</li>
    <li><span class="small-index">03</span><strong>Comprueba tus argumentos</strong>Elige criterios fundamentados y recibe una explicación inmediata, sin entregas escritas.</li></ol>
    <p class="learning-note"><span aria-hidden="true">↳</span> Actividades de autoaprendizaje con retroalimentación automática. No requieren revisión docente.</p></section>
    ${footer(null, "principios", "Explorar los principios")}`;
}
function renderPrincipios() {
  return `${top("Principios éticos")}<h1>La ética va más allá de cumplir una norma.</h1>
    <p class="definition">La ética profesional docente es la reflexión sistemática sobre las normas, valores y principios que orientan la conducta del educador en su relación con estudiantes, familias, colegas y comunidad.</p>
    <p class="lead">No se limita a un código de conducta: implica un compromiso activo con la formación integral y el bienestar de cada estudiante (Hortal, 2002).</p>
    <section class="section-space">${sectionHeading("balance", "Principios en tensión")}<p class="instruction">Abre cada principio para explorar su significado. En un dilema, proteger uno puede poner en riesgo otro.</p>
    <div class="principle-grid">${principles.map((p, i) => `<button class="principle" data-principle="${i}" aria-haspopup="dialog"><span class="principle-heading">${icon(["balance", "book", "heart", "shield"][i])}<strong>${p.title}</strong></span><small>${p.hint} <span class="principle-state">${state.principles.includes(i) ? "· Explorado ✓" : "↗"}</span></small></button>`).join("")}</div>
    <p class="connection">La formación ética conecta la teoría pedagógica con las condiciones reales de la enseñanza. Los principios no son fórmulas: requieren interpretación y reflexión.</p></section>${footer("inicio", "modelo")}`;
}
function renderModelo() {
  return `${top("Modelo de reflexión")}<h1>Antes de decidir, haz mejores preguntas.</h1>
    <p class="lead">Un modelo de reflexión ética en cuatro pasos te ayuda a pasar de una reacción inmediata a una decisión pedagógica fundamentada.</p>
    <div class="step-tabs" role="group" aria-label="Cuatro pasos de reflexión">${steps.map((s, i) => `<button class="step-tab ${i === 0 ? "active" : ""}" data-step="${i}" aria-pressed="${i === 0}"><b>Paso ${i + 1}</b><span class="step-label">${icon(["search", "people", "balance", "check"][i])}${s.title}</span></button>`).join("")}</div>
    <div id="model-detail" class="model-detail" role="status"></div><p class="connection">La praxis pedagógica relaciona reflexión y acción: después de actuar, observa los resultados y vuelve a interrogar tu práctica (Freire, 2005).</p>${footer("principios", "comprension", "Ponerlo en práctica")}`;
}
function renderComprension() {
  return `${top("Comprueba lo aprendido")}<h1>De los principios a las acciones.</h1>
    <p class="lead">Relaciona cada situación con el principio que representa de manera más directa. Puedes responder con el teclado o desde tu pantalla táctil.</p>
    <form id="match-form">${matchSituations.map((s, i) => `<div class="match-row"><p>${s}</p><div><label for="match-${i}">Principio de la situación ${i + 1}</label>
    <select id="match-${i}" required><option value="">Selecciona un principio</option>${ordered(`match-${i}`, matchOptions).map(({ item, index }) => `<option value="${index}" ${String(state.associations[i]) === String(index) ? "selected" : ""}>${item}</option>`).join("")}</select></div></div>`).join("")}
    <button class="primary section-space" type="submit" aria-haspopup="dialog">Comprobar asociaciones</button></form>
    <section class="quiz">${sectionHeading("question", "¿Un problema o un dilema?")}<p id="quiz-question">¿Cuál de estas situaciones describe mejor un dilema ético?</p>
    <form id="quiz-form"><fieldset aria-labelledby="quiz-question">${radioOptions("quiz", "quiz", quizOptions, state.quizChoice)}</fieldset>
    <button class="primary" type="submit" aria-haspopup="dialog">Revisar mi respuesta</button></form></section>${footer("modelo", "casos", "Explorar los casos")}`;
}
function renderCasos() {
  return `${top("Dilemas del aula")}<h1>Dos situaciones. Más de una perspectiva.</h1>
    <p class="lead">Elige el orden de los casos. Explora las perspectivas, contrasta una decisión y selecciona el criterio que mejor fundamenta una actuación responsable. Completa ambos para cerrar el recorrido.</p>
    <div class="case-menu">${Object.entries(cases).map(([id, c], i) => `<article class="case-card"><div class="case-card-photo"><img src="assets/caso-${id}.webp" width="1536" height="1024" alt="${c.alt}" loading="lazy"><span class="case-status">${state.cases[id]?.done ? "Completado" : state.cases[id] ? "En exploración" : "Por iniciar"}</span></div>
    <div class="case-card-body"><p class="small">Caso ${i + 1}</p><h2>${c.title}</h2><p>${c.short}</p><a class="secondary" href="#caso-${id}">${state.cases[id]?.done ? "Revisar el caso" : "Analizar este caso"} <span aria-hidden="true">→</span></a></div></article>`).join("")}</div>
    <p class="connection">Los casos y sus imágenes son recreaciones didácticas. La retroalimentación contrasta valores y consecuencias; no reemplaza el análisis del contexto ni los protocolos de cada institución.</p>${footer("comprension", "sintesis", "Ir a la síntesis")}`;
}
function renderCase(id) {
  const c = cases[id];
  const cs = state.cases[id] ||= { seen: [], choice: null, reviewed: false, reasoning: null, done: false };
  return `${top(c.theme)}<button class="back-link" data-go="casos">← Volver a los casos</button><h1>${c.title}</h1>
    ${id === "excursion" ? '<p class="small">Desarrollo didáctico a partir del esquema del material base.</p>' : ""}
    <figure class="case-illustration"><img src="assets/caso-${id}.webp" width="1536" height="1024" alt="${c.alt}"><figcaption>${c.caption} <span>Imagen generada con IA · escena ficticia.</span></figcaption></figure>
    <article class="case-narrative"><p>${c.narrative}</p><p class="dilemma">${c.dilemma}</p></article>
    <section class="section-space">${sectionHeading("people", "Antes de decidir, cambia de perspectiva.")}
    <p class="instruction">Abre las tres perspectivas para reconocer los principios en tensión. <span id="perspective-count" class="perspective-count">${cs.seen.length} de 3 exploradas</span></p>
    <div class="perspectives">${c.perspectives.map((p, i) => `<button class="perspective" data-perspective="${i}" aria-haspopup="dialog"><span>${p.name}</span><span class="perspective-symbol" aria-hidden="true">${cs.seen.includes(i) ? "✓" : "+"}</span></button>`).join("")}</div></section>
    <section class="section-space">${sectionHeading("route", "¿Qué acción tomarías?", "decision-question")}<p class="instruction">Elige una alternativa para contrastar los valores que protege y los riesgos que plantea. Esta elección no se califica como correcta o incorrecta.</p>
    <form id="case-form"><fieldset aria-labelledby="decision-question">${radioOptions(`decision-${id}`, "decision", c.options, cs.choice)}</fieldset>
    <button class="primary" type="submit" aria-haspopup="dialog">Contrastar mi decisión</button> <span class="badge" id="decision-status">${cs.reviewed ? "Decisión contrastada ✓" : "Por contrastar"}</span></form></section>
    <section class="section-space">${sectionHeading("argument", "Reconoce un argumento fundamentado")}<p id="reasoning-question">${c.reasoningQuestion}</p>
    <p class="instruction">No necesitas escribir. Selecciona el criterio y revisa su explicación automática.</p>
    <form id="reasoning-form"><fieldset aria-labelledby="reasoning-question">${radioOptions(`reasoning-${id}`, "reasoning", c.reasoningOptions, cs.reasoning)}</fieldset>
    <button class="primary" type="submit" aria-haspopup="dialog">Comprobar el argumento</button> <span class="badge" id="case-status">${cs.done ? "Caso completado ✓" : "Caso pendiente"}</span></form></section>
    ${footer("casos", id === "leo" ? "caso-excursion" : "caso-leo", "Ver el otro caso")}`;
}
function renderSintesis() {
  return `${top("Síntesis y autoevaluación")}<h1>Teje tu identidad docente.</h1>
    <p class="lead">Una decisión pedagógica fundamentada une principios, contexto y reflexión. Reconstruye estas relaciones y comprueba lo que puedes llevar a tu práctica.</p>
    <section class="section-space">${sectionHeading("branches", "Conecta los conceptos")}<p class="instruction">Completa los nodos que permiten pasar del dilema a una decisión fundamentada.</p>
    <form id="map-form" class="concept-map"><div class="map-end">Dilema ético</div><div class="map-grid">${mapLabels.map((label, i) => `<div class="map-node"><label for="map-${i}">${label}</label><select id="map-${i}" required><option value="">Elige un concepto</option>${ordered(`map-${i}`, mapOptions).map(({ item, index }) => `<option value="${index}" ${String(state.mapChoices[i]) === String(index) ? "selected" : ""}>${item}</option>`).join("")}</select></div>`).join("")}</div>
    <div class="map-end">↓ Decisión pedagógica fundamentada</div><button class="secondary section-space" type="submit" aria-haspopup="dialog">Comprobar mi mapa</button></form></section>
    <section class="section-space">${sectionHeading("check", "Haz una pausa y autoevalúate")}<p class="instruction">Marca solo aquello que reconoces haber comprendido. Si algo aún no está claro, vuelve a la sección correspondiente.</p>
    <div class="checklist">${checklist.map((text, i) => `<label><input type="checkbox" data-check="${i}" ${state.checks[i] ? "checked" : ""}><span>${text}</span></label>`).join("")}</div></section>
    <div class="completion"><h3>La reflexión no termina aquí.</h3><p>En la práctica docente, identificar tensiones, escuchar a quienes están implicados y valorar consecuencias permite actuar de manera más responsable. Una práctica innovadora es, ante todo, una práctica éticamente responsable.</p>
    <p id="completion-status" class="small" role="status"></p><div class="final-actions"><button class="primary" id="check-completion" aria-haspopup="dialog">Revisar mi recorrido</button><a class="secondary" href="#casos">Volver a los casos</a></div></div>${footer("casos", null)}`;
}

function showStep(i) {
  const s = steps[i];
  if (!state.model.includes(i)) state.model.push(i);
  $$("[data-step]").forEach(button => {
    const active = Number(button.dataset.step) === i;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  $("#model-detail").innerHTML = `<h2>${s.question}</h2><p>${s.text}</p><div class="example"><h3>En el aula: el traductor en línea</h3><p>${s.example}</p></div>`;
  save();
}
function showFeedback(title, content, tone = "info") {
  const dialog = $("#resource-dialog");
  dialog.dataset.tone = tone;
  $("#dialog-title").textContent = title;
  $("#dialog-content").innerHTML = `<div class="feedback-state">${tone === "success" ? "Actividad completada" : tone === "retry" ? "Una oportunidad para revisar" : "Para tu análisis"}</div><div class="feedback-body">${content}</div>
    <div class="dialog-actions"><button class="primary" id="feedback-continue">${tone === "retry" ? "Volver a intentarlo" : "Continuar"}</button></div>`;
  $("#feedback-continue").addEventListener("click", () => dialog.close());
  dialog.showModal();
  $("#dialog-title").focus();
}
function showCaseFeedback(id, index) {
  const f = cases[id].feedback[index];
  showFeedback(f.title, `<p><strong>Lo que protege:</strong> ${f.value}</p><p><strong>Lo que debes considerar:</strong> ${f.risk}</p><p><strong>Para pensar:</strong> ${f.question}</p>`);
}
function missingActivities() {
  const missing = [];
  if (!completed()[1]) missing.push("Explorar los cuatro principios éticos.");
  if (!completed()[2]) missing.push("Revisar los cuatro pasos del modelo.");
  if (!completed()[3]) missing.push("Completar las asociaciones y la pregunta sobre dilemas.");
  if (!state.cases.leo?.done) missing.push("Completar el caso de Leo: perspectivas, decisión y argumento.");
  if (!state.cases.excursion?.done) missing.push("Completar el caso de la excursión: perspectivas, decisión y argumento.");
  if (!state.map) missing.push("Completar el mapa de conceptos.");
  if (!state.checks.every(Boolean)) missing.push("Revisar tu autoevaluación.");
  return missing;
}
function updateCompletion() {
  $("#completion-status").textContent = missingActivities().length
    ? "Puedes consultar qué actividades te faltan con «Revisar mi recorrido»."
    : "Has completado el recorrido. Vuelve a estos principios cuando enfrentes nuevos dilemas.";
}
function render() {
  const hash = location.hash.slice(1);
  current = routes.includes(hash) || ["caso-leo", "caso-excursion"].includes(hash) ? hash : "inicio";
  const renderers = { inicio: renderInicio, principios: renderPrincipios, modelo: renderModelo, comprension: renderComprension, casos: renderCasos, sintesis: renderSintesis };
  $("#content").innerHTML = `<div class="page">${current.startsWith("caso-") ? renderCase(current.slice(5)) : renderers[current]()}</div>`;
  updateProgress();
  $("#sidebar").classList.remove("open");
  $(".menu-toggle").setAttribute("aria-expanded", "false");
  document.title = `${current.startsWith("caso-") ? cases[current.slice(5)].title : titles[routes.indexOf(current)]} · Dilemas éticos · CECAR`;
  bindPage();
  window.scrollTo(0, 0);
}
function bindPage() {
  $$("main form").forEach(form => {
    form.noValidate = true;
    form.addEventListener("submit", event => {
      if (form.checkValidity()) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      showFeedback("Completa tu selección", "<p>Hay una o más respuestas sin seleccionar. Revisa las opciones de esta actividad antes de comprobarla.</p>", "retry");
    }, true);
  });
  $$("[data-go]").forEach(button => button.addEventListener("click", () => { location.hash = button.dataset.go; }));
  $$("[data-principle]").forEach(button => button.addEventListener("click", () => {
    const i = Number(button.dataset.principle), p = principles[i];
    if (!state.principles.includes(i)) state.principles.push(i);
    $(".principle-state", button).textContent = "· Explorado ✓";
    save();
    showFeedback(p.title, `<p>${p.text}</p><p class="connection">${p.connection}</p>`);
  }));
  if (current === "modelo") {
    showStep(0);
    $$("[data-step]").forEach(button => button.addEventListener("click", () => showStep(Number(button.dataset.step))));
  }
  if (current === "comprension") bindComprehension();
  if (current.startsWith("caso-")) bindCase(current.slice(5));
  if (current === "sintesis") bindSynthesis();
}
function bindComprehension() {
  matchSituations.forEach((_, i) => $(`#match-${i}`).addEventListener("change", event => {
    state.associations[i] = event.target.value;
    save();
  }));
  $("#match-form").addEventListener("submit", event => {
    event.preventDefault();
    const wrong = matchSituations.map((_, i) => Number($(`#match-${i}`).value) === i ? null : i + 1).filter(Boolean);
    if (!wrong.length) {
      state.matched = true;
      showFeedback("Principios que se vuelven acciones", "<p>Has relacionado el cuidado ante la vulnerabilidad, la justicia en los criterios y la integridad al proteger la confidencialidad.</p><p>En situaciones reales pueden coexistir varios principios. Aquí identificaste el más directamente representado.</p>", "success");
    } else {
      showFeedback("Revisa las asociaciones", `<p>Revisa ${wrong.length === 1 ? "la situación" : "las situaciones"} ${wrong.join(" y ")}.</p><p>Piensa en la necesidad principal de cada situación: bienestar emocional, criterios de evaluación o confidencialidad.</p>`, "retry");
    }
    save();
  });
  $$("input[name=quiz]").forEach(input => input.addEventListener("change", () => { state.quizChoice = Number(input.value); save(); }));
  $("#quiz-form").addEventListener("submit", event => {
    event.preventDefault();
    const value = Number(new FormData(event.target).get("quiz"));
    state.quizChoice = value;
    if (value === 1) {
      state.quiz = true;
      showFeedback("Identificaste el conflicto de valores", "<p>Reportar la falta de un colega pone en tensión la responsabilidad profesional y la confianza del equipo.</p><p>Reparar el proyector es un problema técnico; reorganizar ejercicios es un desafío de enseñanza. Tal como están descritos, no plantean por sí solos un conflicto entre valores.</p>", "success");
    } else {
      showFeedback("Busca dos valores en tensión", value === 0
        ? "<p>Reparar el proyector responde a un problema técnico. Busca una situación en la que proteger un valor pueda poner en riesgo otro.</p>"
        : "<p>Reorganizar ejercicios responde a un desafío pedagógico. La situación descrita no enfrenta dos deberes o valores incompatibles. Revisa qué decisión protege un principio y arriesga otro.</p>", "retry");
    }
    save();
  });
}
function bindCase(id) {
  const c = cases[id], cs = state.cases[id];
  $$("[data-perspective]").forEach(button => button.addEventListener("click", () => {
    const i = Number(button.dataset.perspective), p = c.perspectives[i];
    if (!cs.seen.includes(i)) cs.seen.push(i);
    $(".perspective-symbol", button).textContent = "✓";
    $("#perspective-count").textContent = `${cs.seen.length} de 3 exploradas`;
    save();
    showFeedback(p.principle, `<h3>${p.name}</h3><p>${p.text}</p>`);
  }));
  $$("input[name=decision]").forEach(input => input.addEventListener("change", () => {
    cs.choice = Number(input.value);
    cs.reviewed = false;
    cs.done = false;
    $("#decision-status").textContent = "Por contrastar";
    $("#case-status").textContent = "Caso pendiente";
    save();
  }));
  $("#case-form").addEventListener("submit", event => {
    event.preventDefault();
    cs.choice = Number(new FormData(event.target).get("decision"));
    cs.reviewed = true;
    $("#decision-status").textContent = "Decisión contrastada ✓";
    save();
    showCaseFeedback(id, cs.choice);
  });
  $$("input[name=reasoning]").forEach(input => input.addEventListener("change", () => {
    cs.reasoning = Number(input.value);
    cs.done = false;
    $("#case-status").textContent = "Caso pendiente";
    save();
  }));
  $("#reasoning-form").addEventListener("submit", event => {
    event.preventDefault();
    cs.reasoning = Number(new FormData(event.target).get("reasoning"));
    if (cs.seen.length < 3 || !cs.reviewed) {
      showFeedback("Completa primero el análisis", `<p>${cs.seen.length < 3 ? "Explora las tres perspectivas del caso. " : ""}${!cs.reviewed ? "Selecciona una acción y pulsa «Contrastar mi decisión»." : ""}</p><p>Después vuelve a comprobar el argumento. No necesitas escribir ni enviar una tarea.</p>`, "retry");
    } else if (cs.reasoning === c.reasoningAnswer) {
      cs.done = true;
      $("#case-status").textContent = "Caso completado ✓";
      showFeedback("Un criterio pedagógico fundamentado", `<p>${c.reasoningFeedback[cs.reasoning]}</p><p><strong>Completaste este caso.</strong> Puedes explorar otras decisiones o continuar con el recorrido.</p>`, "success");
    } else {
      cs.done = false;
      $("#case-status").textContent = "Caso pendiente";
      showFeedback("Reconsidera el fundamento", `<p>${c.reasoningFeedback[cs.reasoning]}</p><p>Vuelve a las perspectivas y prueba otro argumento.</p>`, "retry");
    }
    save();
  });
}
function bindSynthesis() {
  updateCompletion();
  mapLabels.forEach((_, i) => $(`#map-${i}`).addEventListener("change", event => {
    state.mapChoices[i] = event.target.value;
    save();
  }));
  $("#map-form").addEventListener("submit", event => {
    event.preventDefault();
    const wrong = mapLabels.map((_, i) => Number($(`#map-${i}`).value) === i ? null : i).filter(i => i !== null);
    if (!wrong.length) state.map = true;
    showFeedback(wrong.length ? "Revisa las conexiones" : "Una decisión con fundamentos", wrong.length
      ? `<p>Revisa ${wrong.length === 1 ? "esta conexión" : "estas conexiones"}:</p><ul>${wrong.map(i => `<li>${mapLabels[i]}.</li>`).join("")}</ul><p>La praxis vincula reflexión y acción; el cuidado se centra en la relación; la justicia, en la equidad; la responsabilidad, en el compromiso formativo.</p>`
      : "<p>La praxis une reflexión y acción; el cuidado atiende necesidades; la justicia reconoce diferencias y la responsabilidad compromete al educador con el aprendizaje.</p><p>Estos conceptos se articulan para transformar una tensión ética en una acción pedagógica fundamentada.</p>", wrong.length ? "retry" : "success");
    save();
    updateCompletion();
  });
  $$("[data-check]").forEach(input => input.addEventListener("change", () => {
    state.checks[Number(input.dataset.check)] = input.checked;
    save();
    updateCompletion();
  }));
  $("#check-completion").addEventListener("click", () => {
    const missing = missingActivities();
    showFeedback(missing.length ? "Tu recorrido sigue en construcción" : "Recorrido completado", missing.length
      ? `<p>Estas actividades aún están pendientes:</p><ul>${missing.map(item => `<li>${item}</li>`).join("")}</ul><p>Usa la ruta de aprendizaje para retomarlas. No hay entregas escritas ni revisión docente pendiente.</p>`
      : "<p>Exploraste los principios, aplicaste el modelo, contrastaste los dos casos y reconociste argumentos fundamentados.</p><p>El reto ahora es llevar estas preguntas a tus decisiones cotidianas: ¿qué principios están en tensión?, ¿a quién afecta mi decisión?, ¿qué consecuencias tendrá?</p>", missing.length ? "info" : "success");
  });
}

const glossary = [
  { letter: "D", title: "Deontología profesional", text: "Conjunto de deberes y principios éticos que rigen una profesión. En docencia, se refiere a las obligaciones específicas del rol educador." },
  { letter: "D", title: "Dilema ético", text: "Situación en la que se debe elegir entre dos o más cursos de acción respaldados por principios morales o valores que entran en conflicto entre sí." },
  { letter: "E", title: "Ética del cuidado", text: "Enfoque ético, popularizado por Carol Gilligan y Nel Noddings, que enfatiza las relaciones, la interdependencia y la respuesta empática a las necesidades de los otros." },
  { letter: "J", title: "Juicio pedagógico", text: "Capacidad de valorar una situación educativa concreta y fundamentar una decisión considerando sus fines, sus principios y las personas implicadas. Definición de apoyo didáctico." },
  { letter: "P", title: "Praxis pedagógica", text: "Concepto de Paulo Freire que describe la relación dialéctica entre reflexión y acción. Es la acción informada por la reflexión crítica para transformar la realidad educativa." },
  { letter: "R", title: "Responsabilidad social", text: "Compromiso de considerar los efectos de las decisiones docentes sobre la comunidad y contribuir a una educación justa e inclusiva. Definición de apoyo didáctico." }
];
function openDialog(kind) {
  const dialog = $("#resource-dialog");
  dialog.removeAttribute("data-tone");
  $("#dialog-title").textContent = kind === "glossary" ? "Glosario para la reflexión" : kind === "reset" ? "¿Reiniciar tu recorrido?" : "Referencias y lecturas";
  $("#dialog-content").innerHTML = kind === "glossary"
    ? `<p class="instruction">Selecciona una letra o despliega un concepto.</p><nav class="glossary-nav" aria-label="Letras del glosario">${["D", "E", "J", "P", "R"].map(letter => `<a href="#glossary-${letter}" data-letter="${letter}">${letter}</a>`).join("")}</nav>${glossary.map((g, i) => `<details id="glossary-term-${i}"><summary>${g.title}</summary><p>${g.text}</p></details>`).join("")}`
    : kind === "reset"
      ? '<p>Se reiniciarán las respuestas automáticas y el avance de esta versión del recurso en este navegador.</p><div class="final-actions"><button class="secondary" id="cancel-reset">Conservar mi avance</button><button class="primary" id="confirm-reset">Sí, reiniciar</button></div>'
      : `<div class="references"><p>Bolívar, A. (2005). El lugar de la ética profesional en la formación universitaria. <em>Revista Mexicana de Investigación Educativa, 10</em>(24), 93–123.</p><p>Freire, P. (2005). <em>Pedagogía del oprimido</em> (54.ª ed.). Siglo XXI Editores.</p><p>Hortal, A. (2002). <em>Ética general de las profesiones</em>. Desclée de Brouwer.</p><p>Noddings, N. (1984). <em>Caring: A feminine approach to ethics and moral education</em>. University of California Press.</p><p>Savater, F. (1997). <em>El valor de educar</em>. Ariel.</p></div><h3>Para seguir pensando</h3><p class="small">Profundiza en la ética profesional con Bolívar y Hortal; en la relación entre reflexión y acción con Freire; y en las relaciones educativas desde el cuidado con Noddings.</p><p class="small">Base académica: material proporcionado para este recurso. El segundo caso desarrolla el esquema de inclusión y seguridad del documento original. Las imágenes son escenas ficticias generadas con la API de OpenAI; no documentan personas ni hechos reales. No se incluye el video sugerido porque el material no identifica una fuente verificable.</p>`;
  if (kind === "glossary") $$("[data-letter]").forEach(link => link.addEventListener("click", event => {
    event.preventDefault();
    const i = glossary.findIndex(g => g.letter === link.dataset.letter), term = $(`#glossary-term-${i}`);
    term.open = true;
    term.scrollIntoView({ block: "nearest" });
    $("summary", term).focus();
  }));
  if (kind === "reset") {
    $("#cancel-reset").onclick = () => dialog.close();
    $("#confirm-reset").onclick = () => {
      state = emptyState();
      save();
      dialog.close();
      if (location.hash !== "#inicio") location.hash = "inicio";
      else render();
      announce("Recorrido reiniciado.");
    };
  }
  dialog.showModal();
}
$(".menu-toggle").addEventListener("click", () => {
  const open = $("#sidebar").classList.toggle("open");
  $(".menu-toggle").setAttribute("aria-expanded", String(open));
});
$$("[data-dialog]").forEach(button => button.addEventListener("click", () => openDialog(button.dataset.dialog)));
$("[data-dialog=glossary]").innerHTML = `<span class="tool-label">${icon("book")}Glosario</span><span aria-hidden="true">↗</span>`;
$("[data-dialog=references]").innerHTML = `<span class="tool-label">${icon("library")}Referencias</span><span aria-hidden="true">↗</span>`;
$("#reset").innerHTML = `<span class="tool-label">${icon("reset")}Reiniciar recorrido</span>`;
$("#close-dialog").addEventListener("click", () => $("#resource-dialog").close());
$("#reset").addEventListener("click", () => openDialog("reset"));
$(".skip").addEventListener("click", event => {
  event.preventDefault();
  $("#content").focus({ preventScroll: true });
  $("#content").scrollIntoView({ block: "start" });
});
window.addEventListener("hashchange", () => {
  if (location.hash === "#content") return;
  if ($("#resource-dialog").open) $("#resource-dialog").close();
  render();
  $("#content").focus({ preventScroll: true });
});
render();
if (!storageWorks) save();
