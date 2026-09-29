const states = {
  approved: { label: 'Aprobada', symbol: '✓' }, available: { label: 'Disponible', symbol: '•' },
  'no-offer': { label: 'Sin cátedra', symbol: '—' }, blocked: { label: 'Bloqueada', symbol: '×' },
  enrolled: { label: 'Inscripta', symbol: 'I' }, 'no-capacity': { label: 'Sin cupo', symbol: '0' },
  planned: { label: 'Planificada', symbol: 'P' }, review: { label: 'Solicitud en revisión', symbol: 'R' }
};
let selectedCourseLimit = 3;

const courses = [
  ['C01',1,1,'Herramientas matemáticas I – Álgebra','approved','sa'], ['C02',1,2,'Herramientas matemáticas II – Análisis','approved','sa'], ['C03',1,3,'Introducción a los algoritmos','approved','sa'], ['C04',1,4,'Desarrollo emprendedor','approved','sa'], ['C05',1,5,'Sistemas de información','approved','sa'], ['C06',1,6,'Idioma extranjero I','approved','sa'],
  ['C07',2,1,'Matemática discreta','approved','sa'], ['C08',2,2,'Cálculo avanzado','approved','sa'], ['C09',2,3,'Arquitectura del computador','approved','sa'], ['C10',3,2,'Programación orientada a objetos','approved','sa'], ['C11',2,6,'Idioma extranjero II','approved','sa'],
  ['C12',3,1,'Grupo y Liderazgo','approved','sa'], ['C13',2,4,'Lógica Simbólica','approved','sa'], ['C14',3,3,'Algoritmos y estructura de Datos I','approved','sa'], ['C15',3,4,'Taller de algoritmos y estructura de Datos I','approved','sa'], ['C16',3,5,'Herramientas matemáticas III – Estadística I','approved','sa'], ['C17',3,6,'Idioma extranjero III','approved','sa'],
  ['C18',4,1,'Principios de Economía','approved','sa'], ['C19',4,3,'Algoritmos y estructura de Datos II','planned','sa'], ['C20',4,4,'Taller de algoritmos y estructura de Datos II','planned','sa'], ['C21',4,5,'Paradigmas de Programación','approved','sa'], ['C22',4,6,'Idioma extranjero IV','approved','sa'],
  ['C23',5,1,'Ética y Deontología Profesional','available','sa'], ['C24',5,2,'Sistemas operativos','no-offer','sa'], ['C25',5,3,'Análisis y diseño de Software','blocked','pp'], ['C26',5,4,'Taller de Análisis de diseño de Software','blocked','pp'], ['C27',5,5,'Herramientas matemáticas V – Estadística II','planned','sa'], ['C28',5,6,'Idioma extranjero V','approved','sa'],
  ['C29',6,1,'Seminario de práctica de Analista en Software','available','process'], ['C30',6,2,'Taller de Ingeniería de Software','blocked','general'], ['C31',6,3,'Ingeniería de Software','blocked','general'], ['C32',6,4,'Base de datos I','blocked','pp'], ['C33',6,6,'Idioma extranjero VI','approved','general'],
  ['C34',7,1,'Seguridad informática','blocked','general'], ['C35',7,2,'Sistemas Operativos II (Redes)','blocked','general'], ['C36',7,6,'Calidad de Software','blocked','general'],
  ['C37',8,1,'Herramientas matemáticas VI – Modelos de simulación','blocked','general'], ['C38',8,2,'Construcción de Software','blocked','general'], ['C39',8,3,'Taller de Construcción de Software','blocked','general'], ['C40',8,4,'Administración de Proyectos','blocked','general'], ['C41',8,5,'Base de Datos II','blocked','general'],
  ['C42',9,1,'Emprendimientos universitarios','available','general'], ['C43',9,2,'Métodos Formales','available','general'], ['C44',9,6,'Práctica profesional de Ingeniería en Software','blocked','process'], ['C45',10,1,'Práctica solidaria','available','process'], ['C46',10,6,'Seminario final de Ingeniería en Software','blocked','process']
].map(([id, term, slot, name, state, category]) => ({ id, term, slot, name, state, category }));

const edges = [
  ['C02','C08','solid'], ['C03','C09','solid'], ['C09','C10','solid'], ['C06','C11','solid'], ['C11','C17','solid'], ['C14','C19','solid'], ['C15','C20','solid'], ['C16','C21','solid'], ['C17','C22','solid'], ['C19','C25','solid'], ['C20','C26','solid'], ['C21','C27','solid'], ['C22','C28','solid'], ['C24','C30','solid'], ['C25','C31','solid'], ['C26','C32','solid'], ['C28','C33','solid'], ['C29','C34','solid'], ['C30','C35','solid'], ['C31','C39','routed'], ['C32','C41','routed'], ['C34','C37','solid'], ['C35','C38','solid'], ['C36','C40','solid'], ['C36','C44','routed'], ['C44','C46','solid']
];

const periods = [
  { kind: 'Período actual', label: '1B · 2026', entryAction: 'Iniciar la inscripción', panelAction: 'Inscribir', runsSolver: true, resultsLabel: 'válida para inscripción' },
  { kind: 'Período siguiente', label: '2A · 2026', entryAction: 'Planificar', panelAction: 'Aceptar', runsSolver: false }
];
const periodStateOverrides = new Map([
  ['2A · 2026', new Map([
    ['C19', 'enrolled'], ['C20', 'enrolled'], ['C23', 'enrolled'], ['C27', 'available'],
    ['C25', 'no-offer'], ['C26', 'no-offer']
  ])]
]);
const drafts = new Map();
const acceptedPlanByPeriod = new Map();
const enrolledByPeriod = new Map();
function acceptedPlanForPeriod(label = currentPeriod().label) {
  if (!acceptedPlanByPeriod.has(label)) acceptedPlanByPeriod.set(label, new Set());
  return acceptedPlanByPeriod.get(label);
}
function enrolledForPeriod(label = currentPeriod().label) {
  if (!enrolledByPeriod.has(label)) enrolledByPeriod.set(label, new Set());
  return enrolledByPeriod.get(label);
}
const unavailableDaysByPeriod = new Map();
const professorChoicesByPeriod = new Map();
const expandedProfessorChoicesByPeriod = new Map();
const data = window.DATOS_SIMULADOS || { catedras: [], docentes: [], aulas: [] };
const resultsData = window.RESULTADOS_SIMULADOS || { periodos: {} };
const columns = document.querySelector('#columns');
const status = document.querySelector('#selection-status');
const announcement = document.querySelector('#selection-announcement');
const selectionPanel = document.querySelector('#selection-panel');
const graphFrame = document.querySelector('#graph-frame');
const primaryAction = document.querySelector('#primary-action');
const canvas = document.querySelector('.canvas');
const periodBar = document.querySelector('.period-bar');
const termIndex = document.querySelector('.term-index');
const resultsScrim = document.querySelector('#results-scrim');
const resultsModal = document.querySelector('#results-modal');
const demoStrip = document.querySelector('#demo-strip');
const resultsClose = document.querySelector('#results-close');
let periodIndex = 0;
let selectionOpen = false;
let resultsOpen = false;
let outcomeId = 'alternativas';
// Grillas semanales abiertas (U6), por alternativa: el modal se re-renderiza al elegir una
// alternativa, y sin esto la grilla que el estudiante acaba de abrir se cerraría sola.
const openGrids = new Set();
let selectedAlternative = null;
let panelSide = 'right';
let wheelScrollTarget = null;
let wheelAnimationFrame = null;

function currentPeriod() { return periods[periodIndex]; }
function configuredBimesterLimit() { return selectedCourseLimit; }
// Concordancia del singular: el máximo configurable puede ser una sola materia.
function limitLabel(count) { return count === 1 ? '1 materia' : `${count} materias`; }
function siblingBimester(label = currentPeriod().label) {
  const bimester = label.split(' · ')[0];
  const number = bimester.slice(0, -1);
  return `${number}${bimester.endsWith('A') ? 'B' : 'A'}`;
}
function isSelectionFlowActive() { return selectionOpen || resultsOpen; }
function courseStateForPeriod(course, label = currentPeriod().label) {
  if (enrolledForPeriod(label).has(course.id)) return 'enrolled';
  if (acceptedPlanForPeriod(label).has(course.id)) return 'planned';
  return periodStateOverrides.get(label)?.get(course.id) || course.state;
}
function offersFor(courseId) { return data.catedras.filter(item => item.materiaId === courseId && item.periodo === currentPeriod().label); }
function draftForPeriod(label = currentPeriod().label) {
  if (!drafts.has(label)) drafts.set(label, new Map());
  return drafts.get(label);
}
function currentDraft() { return draftForPeriod(); }
function isCourseSelectable(course) {
  const state = courseStateForPeriod(course);
  return state !== 'approved' && state !== 'blocked' && state !== 'enrolled';
}
function blockedDaysForPeriod(label = currentPeriod().label) {
  if (!unavailableDaysByPeriod.has(label)) unavailableDaysByPeriod.set(label, new Set());
  return unavailableDaysByPeriod.get(label);
}
function professorChoicesForPeriod(label = currentPeriod().label) {
  if (!professorChoicesByPeriod.has(label)) professorChoicesByPeriod.set(label, new Map());
  return professorChoicesByPeriod.get(label);
}
function expandedProfessorChoicesForPeriod(label = currentPeriod().label) {
  if (!expandedProfessorChoicesByPeriod.has(label)) expandedProfessorChoicesByPeriod.set(label, new Set());
  return expandedProfessorChoicesByPeriod.get(label);
}
function selectedCourses() { return courses.filter(course => currentDraft().has(course.id)); }
function pendingCoursesInDraftOrder() {
  return [...currentDraft().keys()]
    .map(id => courses.find(course => course.id === id))
    .filter(course => course && offersFor(course.id).length === 0);
}
function intentionFor(course) {
  if (courseStateForPeriod(course) === 'blocked') return 'no considerar';
  return 'deseada';
}
function consideredCourses() { return selectedCourses().filter(course => intentionFor(course) !== 'no considerar'); }
function blockedReason(course) {
  const prerequisites = edges.filter(([, target]) => target === course.id).map(([source]) => source);
  return prerequisites.length
    ? `Bloqueada en el escenario: correlatividad pendiente con ${prerequisites.join(', ')}.`
    : 'Bloqueada en el escenario: no cumple las condiciones académicas informadas.';
}
function displayState(course) {
  const state = courseStateForPeriod(course);
  return state === 'planned' ? states.available : states[state];
}
function coursePresentation(course) {
  const accepted = acceptedPlanForPeriod().has(course.id);
  const effectiveState = courseStateForPeriod(course);
  // Un plan base pertenece a otro período; solo el plan aceptado de esta vista afirma «Planificada».
  return accepted
    ? { state: states.planned, className: 'planned' }
    : { state: displayState(course), className: effectiveState === 'planned' ? 'available' : effectiveState };
}

function renderPeriod() {
  const period = currentPeriod();
  document.querySelector('#period-kind').textContent = period.kind;
  document.querySelector('#period-label').textContent = period.label;
  const periodNavigationLocked = isSelectionFlowActive();
  document.querySelector('#period-prev').disabled = periodNavigationLocked || periodIndex === 0;
  document.querySelector('#period-next').disabled = periodNavigationLocked || periodIndex === periods.length - 1;
  primaryAction.textContent = period.entryAction;
  primaryAction.hidden = selectionOpen || resultsOpen;
  document.querySelector('#panel-primary-action').textContent = period.panelAction;
}

function renderColumns() {
  columns.innerHTML = Array.from({ length: 10 }, (_, index) => {
    const term = index + 1;
    const cards = courses.filter(course => course.term === term).map(course => {
      const presentation = coursePresentation(course);
      const isMarked = currentDraft().has(course.id);
      const intention = isMarked ? intentionFor(course) : '';
      const disabled = !selectionOpen || !isCourseSelectable(course) || (!isMarked && currentDraft().size >= configuredBimesterLimit());
      return `<button class="course ${presentation.className} category-${course.category}" data-course="${course.id}" type="button" style="--slot:${course.slot}" aria-pressed="${Boolean(intention)}" ${disabled ? 'disabled' : ''}>
        <span class="course-state"><span aria-hidden="true">${presentation.state.symbol}</span> ${presentation.state.label}</span>
        <strong><span>${course.id}</span> · ${course.name}</strong>
        <small><span aria-hidden="true">●</span> ${intention ? intention : 'Sin marcar'} · ${course.category === 'sa' ? 'Req. SA' : course.category === 'pp' ? 'Req. PP' : course.category === 'process' ? 'Proceso' : 'General'}</small>
      </button>`;
    }).join('');
    return `<section class="term" aria-labelledby="term-${term}"><h2 id="term-${term}">Cuatrimestre ${term}</h2><div class="term-grid">${cards}</div></section>`;
  }).join('');
  document.querySelectorAll('.course').forEach(card => card.addEventListener('click', () => markCourse(card.dataset.course)));
  measureTermCenters();
}

function drawConnections() {
  const svg = document.querySelector('#connections');
  const stage = document.querySelector('#graph-stage');
  const stageBox = stage.getBoundingClientRect();
  const scale = Number(document.querySelector('#graph-region').dataset.scale || 1);
  if (scale <= 0) { svg.innerHTML = ''; return; }
  svg.setAttribute('width', stage.scrollWidth);
  svg.setAttribute('height', stage.scrollHeight);
  svg.setAttribute('viewBox', `0 0 ${stage.scrollWidth} ${stage.scrollHeight}`);
  svg.innerHTML = edges.map(([from, to, type]) => {
    const source = document.querySelector(`[data-course="${from}"]`).getBoundingClientRect();
    const target = document.querySelector(`[data-course="${to}"]`).getBoundingClientRect();
    const x1 = (source.right - stageBox.left) / scale;
    const y1 = (source.top + source.height / 2 - stageBox.top) / scale;
    // La punta de la flecha mide ~18 px en unidades del escenario: la arista termina
    // antes del borde para que la flecha se dibuje entera en el canal y no bajo la tarjeta.
    const inset = 5 / scale;
    const x2 = (target.left - stageBox.left - inset) / scale;
    const y2 = (target.top + target.height / 2 - stageBox.top) / scale;
    const bend = Math.max(28, (x2 - x1) * .48);
    return `<path class="edge ${type}" d="M ${x1} ${y1} C ${x1 + bend} ${y1}, ${x2 - bend} ${y2}, ${x2} ${y2}" marker-end="url(#arrow)"/>`;
  }).join('') + '<defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" /></marker></defs>';
}

function scrollRatio() {
  const range = canvas.scrollWidth - canvas.clientWidth;
  return range > 0 ? canvas.scrollLeft / range : 0;
}
function preferredPanelSide(ratio, currentSide) {
  if (currentSide === 'left') return ratio < .15 ? 'right' : 'left';
  return ratio >= .20 ? 'left' : 'right';
}
function updatePanelSide() {
  panelSide = preferredPanelSide(scrollRatio(), panelSide);
  selectionPanel.dataset.side = panelSide;
  canvas.dataset.side = panelSide;
}
function normalizedVerticalWheelDelta(event) {
  if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) return event.deltaY * 16;
  if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) return event.deltaY * canvas.clientWidth;
  return event.deltaY;
}
function maxCanvasScrollLeft() {
  return Math.max(0, canvas.scrollWidth - canvas.clientWidth);
}
function clampCanvasScrollLeft(value) {
  return Math.min(maxCanvasScrollLeft(), Math.max(0, value));
}
// Un solo mecanismo para el desplazamiento horizontal animado: lo comparten la rueda
// vertical traducida y el salto del índice de cuatrimestres.
function scrollCanvasHorizontallyTo(left) {
  wheelScrollTarget = clampCanvasScrollLeft(left);
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    canvas.scrollLeft = wheelScrollTarget;
    wheelScrollTarget = null;
    return;
  }
  if (wheelAnimationFrame === null) wheelAnimationFrame = requestAnimationFrame(animateWheelScroll);
}
function cancelWheelScrollAnimation() {
  if (wheelAnimationFrame !== null) cancelAnimationFrame(wheelAnimationFrame);
  wheelAnimationFrame = null;
  wheelScrollTarget = null;
}
function finishWheelScrollAnimation() {
  canvas.scrollLeft = wheelScrollTarget;
  wheelScrollTarget = null;
  wheelAnimationFrame = null;
}
function animateWheelScroll() {
  wheelAnimationFrame = null;
  if (wheelScrollTarget === null) return;
  wheelScrollTarget = clampCanvasScrollLeft(wheelScrollTarget);
  const remaining = wheelScrollTarget - canvas.scrollLeft;
  if (Math.abs(remaining) <= 1) {
    finishWheelScrollAnimation();
    return;
  }
  const previousScrollLeft = canvas.scrollLeft;
  canvas.scrollLeft = clampCanvasScrollLeft(previousScrollLeft + remaining * .25);
  if (canvas.scrollLeft === previousScrollLeft) {
    finishWheelScrollAnimation();
    return;
  }
  wheelAnimationFrame = requestAnimationFrame(animateWheelScroll);
}
// La rueda vertical se traduce a desplazamiento horizontal mientras el plano no desborde en
// vertical. El ajuste al alto garantiza que no desborde, así que esta guarda no debería cumplirse
// nunca: está para que la traducción no encierre al lector si el plano deja de entrar completo.
function planOverflowsVertically() {
  return canvas.scrollHeight > canvas.clientHeight + 1;
}
function translateVerticalWheelToHorizontalScroll(event) {
  const preservesNativeInteraction = event.deltaX !== 0 || event.shiftKey || event.ctrlKey || event.metaKey || event.deltaY === 0
    || planOverflowsVertically()
    || (event.target instanceof Element && event.target.closest('#selection-panel, #results-modal, #results-scrim'));
  if (preservesNativeInteraction) {
    cancelWheelScrollAnimation();
    return;
  }
  event.preventDefault();
  scrollCanvasHorizontallyTo((wheelScrollTarget ?? canvas.scrollLeft) + normalizedVerticalWheelDelta(event));
}

// Los centros de las columnas, en coordenadas del desplazamiento, se miden una vez por render y por
// redimensionado: el seguimiento del índice no lee layout en cada evento de scroll.
let termCenters = [];
function measureTermCenters() {
  const canvasLeft = canvas.getBoundingClientRect().left;
  termCenters = [...columns.children].map(term => {
    const rect = term.getBoundingClientRect();
    return canvas.scrollLeft + (rect.left - canvasLeft) + rect.width / 2;
  });
}
// El índice marca la columna más cercana al centro del lienzo: la que el lector está mirando.
function currentTermIndex() {
  if (!termCenters.length) return 0;
  const center = canvas.scrollLeft + canvas.clientWidth / 2;
  let current = 0;
  for (const [index, termCenter] of termCenters.entries()) {
    if (termCenter > center) break;
    current = index;
  }
  return current;
}
// El marcado arranca sin `aria-current`, así que el valor inicial tiene que forzar la primera
// escritura cuando el índice se hace visible.
let currentTerm = -1;
function updateCurrentTerm() {
  // Arriba de 760 px el índice no existe: no hay nada que marcar.
  if (termIndex.offsetParent === null) return;
  const current = currentTermIndex();
  if (current === currentTerm) return;
  currentTerm = current;
  for (const button of termIndex.querySelectorAll('button')) {
    if (Number(button.dataset.term) === current + 1) button.setAttribute('aria-current', 'true');
    else button.removeAttribute('aria-current');
  }
}
// Salta a la columna y deja el foco en su cabecera: el índice es un salto, no una navegación
// por pasos, así el recorrido siguiente entra por las materias de esa columna y no por las de
// la primera.
function goToTerm(term) {
  const column = columns.children[term - 1];
  if (!column) return;
  const canvasLeft = canvas.getBoundingClientRect().left;
  scrollCanvasHorizontallyTo(canvas.scrollLeft + column.getBoundingClientRect().left - canvasLeft);
  const heading = column.querySelector('h2');
  if (!heading) return;
  heading.setAttribute('tabindex', '-1');
  heading.focus({ preventScroll: true });
}

function teacherLabel(teacherId) {
  const teacher = data.docentes.find(item => item.id === teacherId);
  return teacher ? `${teacher.nombre} (${teacher.id})` : teacherId;
}
function professorChoicesFor(courseId) {
  return [...new Map(offersFor(courseId).map(offer => [offer.docente, teacherLabel(offer.docente)])).entries()]
    .map(([id, label]) => ({ id, label }));
}
function renderAvailability() {
  const blockedDays = blockedDaysForPeriod();
  document.querySelectorAll('[data-unavailable-day]').forEach(button => {
    const unavailable = blockedDays.has(button.dataset.unavailableDay);
    button.setAttribute('aria-pressed', String(unavailable));
    button.classList.toggle('unavailable', unavailable);
    button.textContent = `${button.dataset.unavailableDay}${unavailable ? ' · no puedo asistir' : ''}`;
  });
}
function renderProfessorPreference(course) {
  const expanded = expandedProfessorChoicesForPeriod().has(course.id);
  const choice = professorChoicesForPeriod().get(course.id) || '';
  const professorChoices = professorChoicesFor(course.id);
  const panelId = `professor-preference-${course.id}`;
  const options = professorChoices.length
    ? `<label><input type="radio" name="professor-${course.id}" value="" ${choice ? '' : 'checked'}> Sin preferencia de profesor</label>${professorChoices.map(professor => `<label><input type="radio" name="professor-${course.id}" value="${professor.id}" ${choice === professor.id ? 'checked' : ''}> ${professor.label}</label>`).join('')}`
    : '<p class="empty-state">No hay cátedras publicadas para elegir profesor en este período.</p>';
  return `<div id="${panelId}" class="subject-professor-options" ${expanded ? '' : 'hidden'}>${options}</div>`;
}
function renderPanel() {
  const selected = selectedCourses();

  // La lista de materias marcadas se dibuja primero y no depende de ningún otro
  // elemento del panel: si algo opcional faltara, la lista tiene que aparecer igual.
  const list = document.querySelector('#selected-subjects');
  if (list) {
    list.innerHTML = selected.length ? selected.map(course => {
      const intention = intentionFor(course);
      const offerText = offersFor(course.id).length ? `${offersFor(course.id).length} cátedra(s) publicada(s)` : 'oferta pendiente';
      const motive = intention === 'no considerar' ? `<span class="subject-motive">${blockedReason(course)}</span>` : '';
      const expandedHere = expandedProfessorChoicesForPeriod().has(course.id);
      return `<li class="subject-item"><button type="button" class="subject-name" data-professor-toggle="${course.id}" aria-expanded="${expandedHere}" aria-controls="professor-preference-${course.id}">${course.id} · ${course.name}<span class="subject-meta">${offerText}</span><span class="accordion-caret" aria-hidden="true"></span></button>${motive}${renderProfessorPreference(course)}</li>`;
    }).join('') : '<li class="empty-state">Todavía no hay materias marcadas.</li>';
  }

  const bimesterLimit = configuredBimesterLimit();
  const bimestreCap = document.querySelector('[data-cap="bimestre"]');
  if (bimestreCap) {
    bimestreCap.textContent = `Bimestrales ${selected.length}/${bimesterLimit}`;
    bimestreCap.dataset.overCap = String(selected.length > bimesterLimit);
  }
  const cuatrimestreCap = document.querySelector('[data-cap="cuatrimestre"]');
  if (cuatrimestreCap) {
    const cuatrimestreLimit = Math.min(6, 2 * bimesterLimit);
    cuatrimestreCap.textContent = `Cuatrimestrales ${selected.length}/${cuatrimestreLimit} · ${siblingBimester()} sin oferta publicada`;
    cuatrimestreCap.dataset.overCap = String(selected.length > cuatrimestreLimit);
  }

  renderAvailability();
  const cta = document.querySelector('#panel-primary-action');
  if (cta) cta.disabled = selected.length === 0;
}

function updateCards() {
  document.querySelectorAll('.course').forEach(card => {
    const course = courses.find(item => item.id === card.dataset.course);
    const presentation = coursePresentation(course);
    const isMarked = currentDraft().has(course.id);
    card.classList.remove(...Object.keys(states));
    card.classList.add(presentation.className);
    card.querySelector('.course-state').innerHTML = `<span aria-hidden="true">${presentation.state.symbol}</span> ${presentation.state.label}`;
    card.setAttribute('aria-pressed', String(isMarked));
    card.classList.toggle('marked', isMarked);
    if (isMarked) card.dataset.intention = intentionFor(course); else delete card.dataset.intention;
  });
}

function updateInterface() {
  renderPeriod();
  renderColumns();
  updateCards();
  renderPanel();
  drawConnections();
}
// La franja visible vive en la barra de período, que se vuelve `inert` mientras el diálogo de
// resultados está abierto, y un subárbol inerte sale del árbol de accesibilidad: ahí un anuncio
// no existe para la tecnología asistiva. El anuncio va a una región fuera de esas ramas y la
// franja visible es su espejo. Un canal, dos presentaciones.
function announceSelection(message) {
  status.textContent = message;
  if (announcement) announcement.textContent = message;
}
function markCourse(id) {
  const course = courses.find(item => item.id === id);
  if (currentDraft().has(id)) {
    currentDraft().delete(id);
    professorChoicesForPeriod().delete(id);
    expandedProfessorChoicesForPeriod().delete(id);
    announceSelection(`${id} se quitó del borrador.`);
  } else {
    const state = courseStateForPeriod(course);
    if (!isCourseSelectable(course)) {
      const reason = state === 'enrolled'
        ? `ya está inscripta en ${currentPeriod().label}`
        : state === 'approved' ? 'está aprobada' : 'está bloqueada';
      announceSelection(`${id} no se puede marcar porque ${reason}.`);
      return;
    }
    const bimesterLimit = configuredBimesterLimit();
    if (currentDraft().size >= bimesterLimit) {
      announceSelection(`Solo se pueden marcar hasta ${limitLabel(bimesterLimit)}: es el máximo que configuraste.`);
      return;
    }
    currentDraft().set(id, 'student');
    const intention = intentionFor(course);
    announceSelection(intention === 'no considerar'
      ? `${id} se agregó como no considerar. ${blockedReason(course)}`
      : `${id} se agregó como deseada.`);
  }
  updateInterface();
}
function fitGraphToViewport() {
  const region = document.querySelector('#graph-region');
  const frame = document.querySelector('#graph-frame');
  const styles = getComputedStyle(canvas);
  const verticalPadding = parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom);
  frame.style.width = `${region.offsetWidth}px`;
  // El plano entra completo en el alto: no hay desplazamiento vertical del grafo, y ese ajuste es
  // lo que hace segura la traducción de la rueda vertical a horizontal más abajo.
  const scale = region.offsetHeight ? Math.min(1, Math.max(0, canvas.clientHeight - verticalPadding) / region.offsetHeight) : 1;
  region.dataset.scale = String(scale);
  region.style.transform = `scale(${scale})`;
  frame.style.width = `${Math.ceil(region.offsetWidth * scale)}px`;
  frame.style.height = `${Math.floor(region.offsetHeight * scale)}px`;
  drawConnections();
  measureTermCenters();
}
function minutesSinceMidnight(time) {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}
function alternativeMetrics(alternative) {
  const franjas = alternative.asignaciones.flatMap(assignment => assignment.franjas);
  const days = new Set(franjas.map(franja => franja.dia));
  const hours = franjas.reduce((total, franja) => total + (minutesSinceMidnight(franja.hasta) - minutesSinceMidnight(franja.desde)) / 60, 0);
  const gaps = [...days].reduce((total, day) => {
    const daily = franjas.filter(franja => franja.dia === day).sort((a, b) => a.desde.localeCompare(b.desde));
    return total + daily.slice(1).filter((franja, index) => minutesSinceMidnight(franja.desde) - minutesSinceMidnight(daily[index].hasta) >= 60).length;
  }, 0);
  return { materias: alternative.asignaciones.length, dias: days.size, horas: hours, huecos: gaps };
}
function aulaLabel(aulaId) {
  return data.aulas.find(aula => aula.id === aulaId)?.nombre || aulaId;
}
function renderWeeklyGrid(alternative) {
  const dayOrder = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  const franjas = alternative.asignaciones.flatMap(assignment => assignment.franjas.map(franja => ({ ...franja, assignment })));
  if (!franjas.length) return '';
  const days = dayOrder.filter(day => franjas.some(franja => franja.dia === day));
  const rows = [...new Map(franjas.map(franja => [`${franja.desde}–${franja.hasta}`, franja])).values()]
    .sort((a, b) => a.desde.localeCompare(b.desde));
  return `<details class="weekly-details" data-alt="${alternative.id}"${openGrids.has(alternative.id) ? ' open' : ''}><summary>Grilla semanal · ${days.length} días · ${rows.length} franjas</summary><table class="weekly-grid"><caption>Distribución semanal: ${alternative.titulo}</caption><thead><tr><th scope="col">Franja</th>${days.map(day => `<th scope="col">${day}</th>`).join('')}</tr></thead><tbody>${rows.map(row => `<tr><th scope="row">${row.desde}–${row.hasta}</th>${days.map(day => {
    const occupied = franjas.find(franja => franja.dia === day && franja.desde === row.desde && franja.hasta === row.hasta);
    return `<td>${occupied ? `${occupied.assignment.materiaId}<span class="sr-only">${courses.find(course => course.id === occupied.assignment.materiaId)?.name || occupied.assignment.materiaId}</span>` : ''}</td>`;
  }).join('')}</tr>`).join('')}</tbody></table></details>`;
}
function recoveryAction(outcome) {
  const actions = {
    infactible: { id: 'review-restrictions', label: 'Revisar los días restringidos' },
    indeterminado: { id: 'rerun-outcome', label: 'Volver a ejecutar el desenlace simulado' },
    'oferta-pendiente': { id: 'view-pending-offers', label: 'Ver las materias sin oferta' }
  };
  return actions[outcome.id] || null;
}
function renderOutcomeExplanation(outcome) {
  if (!outcome.explicacion) return '';
  const action = recoveryAction(outcome);
  const lead = outcome.alternativas.length ? '' : '<p class="outcome-empty">Este desenlace simulado no produce alternativas de cursado.</p>';
  const causes = outcome.explicacion.causas.map(cause => `<li>${cause}</li>`).join('');
  const actions = action ? `<ul class="outcome-actions"><li><button type="button" data-outcome-action="${action.id}">${action.label}</button></li></ul>` : '';
  return `<section class="outcome-explanation">${lead}<h4>${outcome.explicacion.titulo}</h4><ul class="outcome-causes">${causes}</ul>${actions}</section>`;
}
function selectedAlternativeFor(outcome) {
  if (!selectedAlternative || selectedAlternative.outcomeId !== outcome.id) return null;
  return outcome.alternativas.find(alternative => alternative.id === selectedAlternative.alternativeId) || null;
}
function alternativeIntersection(alternative) {
  return [...new Set(alternative.asignaciones.map(assignment => assignment.materiaId))]
    .filter(courseId => currentDraft().has(courseId));
}
function renderConfirmation(outcome) {
  const alternative = selectedAlternativeFor(outcome);
  const intersection = alternative ? alternativeIntersection(alternative) : [];
  const confirm = document.querySelector('#results-confirm');
  const hint = document.querySelector('#results-confirmation-hint');
  confirm.disabled = !alternative || intersection.length === 0;
  if (!outcome.alternativas.length) {
    hint.textContent = 'Este desenlace no ofrece alternativas para confirmar. Puede usar las acciones de recuperación disponibles o volver a la selección.';
  } else if (!alternative) {
    hint.textContent = 'Seleccione una alternativa para confirmar únicamente las materias marcadas que contiene.';
  } else if (!intersection.length) {
    hint.textContent = 'La alternativa seleccionada no incluye ninguna materia marcada; elija otra alternativa o vuelva a la selección para ajustar el borrador.';
  } else {
    hint.textContent = `Se confirmarán ${intersection.length} materia(s) marcada(s) de esta alternativa.`;
  }
}
function renderResults() {
  const period = currentPeriod();
  const outcomes = resultsData.periodos[period.label] || [];
  const outcome = outcomes.find(item => item.id === outcomeId) || outcomes[0];
  if (!outcome) return;
  outcomeId = outcome.id;
  document.querySelector('#results-period').textContent = period.label;
  document.querySelector('#results-label').textContent = period.resultsLabel || '';
  const pending = selectedCourses().filter(course => offersFor(course.id).length === 0);
  document.querySelector('#results-granularity').textContent = pending.length
    ? `Granularidad del resultado: materia — hay materias con oferta pendiente: ${pending.map(course => `${course.id} · ${course.name || course.id}`).join(', ')}.`
    : 'Granularidad del resultado: cátedra — todas las materias marcadas tienen oferta publicada.';
  const outcomeSelect = document.querySelector('#outcome-select');
  outcomeSelect.innerHTML = outcomes.map(item => `<option value="${item.id}" ${item.id === outcomeId ? 'selected' : ''}>${item.titulo}</option>`).join('');
  document.querySelector('#outcome-title').textContent = outcome.titulo;
  document.querySelector('#outcome-summary').textContent = outcome.resumen;
  const alternatives = document.querySelector('#alternatives');
  const selected = selectedAlternativeFor(outcome);
  const cards = outcome.alternativas.map((alternative, index) => {
    const metrics = alternativeMetrics(alternative);
    const assignments = alternative.asignaciones.map(assignment => {
      const course = courses.find(item => item.id === assignment.materiaId);
      const schedule = assignment.franjas.map(franja => `${franja.dia} ${franja.desde}–${franja.hasta}`).join(', ');
      return `<li>${assignment.materiaId} · ${course?.name || assignment.materiaId} — ${teacherLabel(assignment.docenteId)} · ${aulaLabel(assignment.aulaId)} · ${schedule}</li>`;
    }).join('');
    const isSelected = selected?.id === alternative.id;
    const radioId = `alternative-${outcome.id}-${alternative.id}`;
    return `<article class="alternative ${isSelected ? 'selected' : ''}"><div class="alternative-choice"><input class="alternative-choice-input" type="radio" id="${radioId}" name="result-alternative" value="${alternative.id}" data-outcome-id="${outcome.id}" data-alternative-id="${alternative.id}" ${isSelected ? 'checked' : ''}><label for="${radioId}">Alternativa ${index + 1}: ${alternative.titulo}</label></div><p class="alternative-index" aria-hidden="true">Alternativa ${index + 1}</p><h4>${alternative.titulo}</h4>${alternative.parcial ? '<p class="alternative-badge">Parcial, sin garantía de optimalidad</p>' : ''}<dl class="alternative-metrics"><dt>materias</dt><dd>${metrics.materias}</dd><dt>días ocupados</dt><dd>${metrics.dias}</dd><dt>horas totales</dt><dd>${metrics.horas}</dd><dt>huecos</dt><dd>${metrics.huecos}</dd></dl><ul class="alternative-assignments">${assignments}</ul>${renderWeeklyGrid(alternative)}${alternative.nota ? `<p class="alternative-note">${alternative.nota}</p>` : ''}</article>`;
  }).join('');
  alternatives.innerHTML = `<legend class="sr-only">Seleccione una alternativa de cursado</legend>${cards}${renderOutcomeExplanation(outcome)}`;
  renderConfirmation(outcome);
}
function openSelection() {
  selectionOpen = true;
  selectionPanel.hidden = false;
  setPanelCollapsed(false);
  primaryAction.blur();
  canvas.dataset.panel = 'open';
  updatePanelSide();
  fitGraphToViewport();
  announceSelection(`Selección abierta para ${currentPeriod().label}.`);
  updateInterface();
}
function advanceStage() {
  const selection = selectedCourses();
  if (!selection.length) return;
  if (selection.length > configuredBimesterLimit()) {
    announceSelection(`El borrador tiene ${selection.length} materias y el máximo configurado es ${limitLabel(configuredBimesterLimit())}: hay que liberar lugar para continuar.`);
    return;
  }
  if (currentPeriod().runsSolver) openResults();
  else applyPlan();
}
function openResults() {
  if (!selectedCourses().length) return;
  selectedAlternative = null;
  selectionOpen = false;
  resultsOpen = true;
  selectionPanel.hidden = true;
  delete canvas.dataset.panel;
  primaryAction.hidden = true;
  resultsScrim.hidden = false;
  resultsScrim.setAttribute('aria-hidden', 'false');
  resultsModal.hidden = false;
  demoStrip.hidden = false;
  if (!legendPanel.hidden) setLegendOpen(false, false);
  canvas.inert = true;
  periodBar.inert = true;
  renderResults();
  fitGraphToViewport();
  resultsClose.focus();
  announceSelection(`${currentPeriod().panelAction}: el borrador pasó a la etapa de resultados simulados.`);
}
function applyPlan() {
  const plan = new Set(currentDraft().keys());
  acceptedPlanByPeriod.set(currentPeriod().label, plan);
  selectionOpen = false;
  selectionPanel.hidden = true;
  delete canvas.dataset.panel;
  updateInterface();
  primaryAction.focus();
  announceSelection(`El plan se aplicó: ${plan.size} materia(s) pasaron a Planificada en ${currentPeriod().label}. El borrador se conserva y la selección se cerró.`);
}
function cancelSelection() {
  const periodLabel = currentPeriod().label;
  draftForPeriod(periodLabel).clear();
  professorChoicesForPeriod(periodLabel).clear();
  expandedProfessorChoicesForPeriod(periodLabel).clear();
  blockedDaysForPeriod(periodLabel).clear();
  selectionOpen = false;
  selectionPanel.hidden = true;
  delete canvas.dataset.panel;
  updateInterface();
  primaryAction.focus();
  announceSelection(`Se descartó la selección actual de ${periodLabel} y todas sus entradas.`);
}
function hideResults() {
  resultsScrim.hidden = true;
  resultsScrim.setAttribute('aria-hidden', 'true');
  resultsModal.hidden = true;
  demoStrip.hidden = true;
  canvas.inert = false;
  periodBar.inert = false;
  resultsOpen = false;
}
function closeResults({ announcement = 'Resultados cerrados: se volvió a la selección con el borrador intacto.', prepareSelection, focusSelector } = {}) {
  hideResults();
  prepareSelection?.();
  openSelection();
  document.querySelector(focusSelector)?.focus();
  announceSelection(announcement);
}
function confirmEnrollment() {
  const outcomes = resultsData.periodos[currentPeriod().label] || [];
  const outcome = outcomes.find(item => item.id === outcomeId);
  const alternative = outcome && selectedAlternativeFor(outcome);
  const courseIds = alternative ? alternativeIntersection(alternative) : [];
  if (!courseIds.length) return;
  courseIds.forEach(courseId => enrolledForPeriod().add(courseId));
  currentDraft().clear();
  professorChoicesForPeriod().clear();
  expandedProfessorChoicesForPeriod().clear();
  selectedAlternative = null;
  hideResults();
  selectionOpen = false;
  selectionPanel.hidden = true;
  delete canvas.dataset.panel;
  updateInterface();
  primaryAction.focus();
  announceSelection(`Se confirmaron ${courseIds.length} materia(s) en ${currentPeriod().label}; se limpió el borrador. Este es el escenario simulado, no una inscripción institucional oficial.`);
}
function handleOutcomeAction(action) {
  if (action === 'review-restrictions') {
    closeResults({
      announcement: 'Volver a la selección para revisar los días restringidos.',
      focusSelector: '[data-unavailable-day="lunes"]'
    });
    return;
  }
  if (action === 'rerun-outcome') {
    const title = document.querySelector('#outcome-title').textContent;
    selectedAlternative = null;
    renderResults();
    document.querySelector('[data-outcome-action="rerun-outcome"]')?.focus();
    announceSelection(`La maqueta no ejecuta un motor: se vuelve a mostrar el mismo desenlace simulado (${title}).`);
    return;
  }
  if (action === 'view-pending-offers') {
    const pending = pendingCoursesInDraftOrder();
    const course = pending[0];
    closeResults(course ? {
      announcement: `${course.id} no tiene cátedras publicadas en ${currentPeriod().label}; el acordeón muestra el estado vacío.`,
      prepareSelection: () => expandedProfessorChoicesForPeriod().add(course.id),
      focusSelector: `[data-professor-toggle="${course.id}"]`
    } : {
      announcement: `No hay materias marcadas sin oferta publicada en ${currentPeriod().label}.`
    });
  }
}

renderColumns();
draftForPeriod();
selectionPanel.hidden = true;
function movePeriod(direction) {
  if (isSelectionFlowActive()) return;
  periodIndex = Math.min(periods.length - 1, Math.max(0, periodIndex + direction));
  updateInterface();
}
document.querySelector('#period-prev').addEventListener('click', () => movePeriod(-1));
document.querySelector('#period-next').addEventListener('click', () => movePeriod(1));
primaryAction.addEventListener('click', openSelection);
document.querySelector('#bimester-limit').addEventListener('change', event => {
  selectedCourseLimit = Number(event.target.value);
  updateInterface();
  announceSelection(`Máximo por bimestre actualizado a ${limitLabel(selectedCourseLimit)}.`);
});
document.querySelector('#panel-primary-action').addEventListener('click', advanceStage);
document.querySelector('#panel-cancel-action').addEventListener('click', cancelSelection);
resultsClose.addEventListener('click', closeResults);
document.querySelector('#results-back').addEventListener('click', closeResults);
document.querySelector('#results-confirm').addEventListener('click', confirmEnrollment);
resultsScrim.addEventListener('click', closeResults);
document.querySelector('#outcome-select').addEventListener('change', event => {
  outcomeId = event.target.value;
  selectedAlternative = null;
  renderResults();
});
document.querySelector('#alternatives').addEventListener('change', event => {
  const choice = event.target.closest('input[name="result-alternative"]');
  if (!choice) return;
  selectedAlternative = { outcomeId: choice.dataset.outcomeId, alternativeId: choice.dataset.alternativeId };
  renderResults();
  document.querySelector(`#${choice.id}`)?.focus();
});
document.querySelector('#alternatives').addEventListener('click', event => {
  if (!(event.target instanceof Element)) return;
  const action = event.target.closest('[data-outcome-action]');
  if (action) {
    handleOutcomeAction(action.dataset.outcomeAction);
    return;
  }
  if (event.target.closest('input, label, button, a, select, textarea')) return;
  const card = event.target.closest('.alternative');
  const choice = card?.querySelector('input[name="result-alternative"]');
  if (!choice) return;
  choice.focus();
  choice.click();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && resultsOpen) closeResults();
});
document.querySelector('#unavailable-days').addEventListener('click', event => {
  const button = event.target.closest('[data-unavailable-day]');
  if (!button) return;
  const blockedDays = blockedDaysForPeriod();
  const day = button.dataset.unavailableDay;
  if (blockedDays.has(day)) {
    blockedDays.delete(day);
    announceSelection(`${day} vuelve a estar disponible.`);
  } else {
    blockedDays.add(day);
    announceSelection(`${day} se marcó como no disponible; es una restricción dura.`);
  }
  updateInterface();
});
document.querySelector('#selected-subjects').addEventListener('click', event => {
  const toggle = event.target.closest('[data-professor-toggle]');
  if (!toggle) return;
  const expanded = expandedProfessorChoicesForPeriod();
  const courseId = toggle.dataset.professorToggle;
  const isExpanded = expanded.has(courseId);
  if (isExpanded) expanded.delete(courseId); else expanded.add(courseId);
  announceSelection(`Preferencia de profesor para ${courseId} ${isExpanded ? 'contraída' : 'expandida'}.`);
  updateInterface();
  document.querySelector(`[data-professor-toggle="${courseId}"]`)?.focus();
});
document.querySelector('#selected-subjects').addEventListener('change', event => {
  const choice = event.target.closest('input[name^="professor-"]');
  if (!choice) return;
  const courseId = choice.name.replace('professor-', '');
  const choices = professorChoicesForPeriod();
  if (choice.value) choices.set(courseId, choice.value); else choices.delete(courseId);
  announceSelection(choice.value ? `Preferencia de profesor para ${courseId} actualizada.` : `Preferencia de profesor para ${courseId} eliminada.`);
  updateInterface();
});
updateInterface();
updatePanelSide();
requestAnimationFrame(() => {
  fitGraphToViewport();
  updateCurrentTerm();
});
canvas.addEventListener('scroll', updatePanelSide, { passive: true });
canvas.addEventListener('scroll', updateCurrentTerm, { passive: true });
canvas.addEventListener('wheel', translateVerticalWheelToHorizontalScroll, { passive: false });
resultsModal.addEventListener('wheel', cancelWheelScrollAnimation, { passive: true });
resultsScrim.addEventListener('wheel', cancelWheelScrollAnimation, { passive: true });
canvas.addEventListener('pointerdown', cancelWheelScrollAnimation);
window.addEventListener('resize', () => {
  fitGraphToViewport();
  updatePanelSide();
  updateCurrentTerm();
});

// Panel colapsable en pantalla angosta (U5). La manija solo existe a <=760px: arriba, el
// panel flota como tarjeta y no hay nada que plegar.
const panelHandle = document.querySelector('#panel-collapse');
function setPanelCollapsed(collapsed) {
  selectionPanel.dataset.collapsed = String(collapsed);
  panelHandle.setAttribute('aria-expanded', String(!collapsed));
  panelHandle.textContent = collapsed ? 'Mostrar el panel de selección' : 'Ocultar el panel de selección';
}
panelHandle.addEventListener('click', () => setPanelCollapsed(selectionPanel.dataset.collapsed !== 'true'));
termIndex.addEventListener('click', event => {
  const button = event.target.closest('button[data-term]');
  if (button) goToTerm(Number(button.dataset.term));
});

// El modal se re-renderiza al elegir una alternativa, y eso reemplaza el nodo: el `toggle`
// nativo llega a un elemento ya desprendido y el estado se pierde. Se escucha el clic en
// captura, se aplica el estado a mano y se anula la acción por defecto, para que el render
// siguiente ya lo encuentre abierto.
document.querySelector('#alternatives').addEventListener('click', event => {
  const summary = event.target.closest('summary');
  if (!summary) return;
  const details = summary.parentElement;
  if (!details.classList || !details.classList.contains('weekly-details')) return;
  const next = !details.open;
  if (next) openGrids.add(details.dataset.alt); else openGrids.delete(details.dataset.alt);
  details.open = next;
  event.preventDefault();
}, true);

// Leyenda del plano (U4): un popover desde la barra de período.
const legendToggle = document.querySelector('#legend-toggle');
const legendPanel = document.querySelector('#legend-panel');
const legendClose = document.querySelector('#legend-close');
function setLegendOpen(open, restoreFocus = true) {
  legendPanel.hidden = !open;
  legendToggle.setAttribute('aria-expanded', String(open));
  if (restoreFocus) {
    if (open) legendClose.focus(); else legendToggle.focus();
  }
}
legendToggle.addEventListener('click', () => setLegendOpen(legendPanel.hidden));
legendClose.addEventListener('click', () => setLegendOpen(false));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !legendPanel.hidden) setLegendOpen(false);
});
// Capture phase on pointerdown: a click on a course card re-renders that card, and the
// resulting click event never reaches the document, so a click-phase handler would leave
// the legend open on top of the plan.
document.addEventListener('pointerdown', event => {
  if (legendPanel.hidden) return;
  if (event.target.closest('#legend-panel, #legend-toggle')) return;
  setLegendOpen(false, false);
}, true);
