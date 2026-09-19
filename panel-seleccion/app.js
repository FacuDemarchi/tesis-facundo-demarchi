const states = {
  approved: { label: 'Aprobada', symbol: '✓' }, available: { label: 'Disponible', symbol: '•' },
  'no-offer': { label: 'Sin cátedra', symbol: '—' }, blocked: { label: 'Bloqueada', symbol: '×' },
  enrolled: { label: 'Inscripta', symbol: 'I' }, 'no-capacity': { label: 'Sin cupo', symbol: '0' },
  planned: { label: 'Planificada', symbol: 'P' }, review: { label: 'Solicitud en revisión', symbol: 'R' }
};

const courses = [
  ['C01',1,1,'Herramientas matemáticas I – Álgebra','approved','sa'], ['C02',1,2,'Herramientas matemáticas II – Análisis','approved','sa'], ['C03',1,3,'Introducción a los algoritmos','approved','sa'], ['C04',1,4,'Desarrollo emprendedor','approved','sa'], ['C05',1,5,'Sistemas de información','approved','sa'], ['C06',1,6,'Idioma extranjero I','approved','sa'],
  ['C07',2,1,'Matemática discreta','approved','sa'], ['C08',2,2,'Cálculo avanzado','approved','sa'], ['C09',2,3,'Arquitectura del computador','approved','sa'], ['C10',2,4,'Programación orientada a objetos','approved','sa'], ['C11',2,6,'Idioma extranjero II','approved','sa'],
  ['C12',3,1,'Grupo y Liderazgo','approved','sa'], ['C13',3,2,'Lógica Simbólica','approved','sa'], ['C14',3,3,'Algoritmos y estructura de Datos I','approved','sa'], ['C15',3,4,'Taller de algoritmos y estructura de Datos I','approved','sa'], ['C16',3,5,'Herramientas matemáticas III – Estadística I','approved','sa'], ['C17',3,6,'Idioma extranjero III','approved','sa'],
  ['C18',4,1,'Principios de Economía','approved','sa'], ['C19',4,3,'Algoritmos y estructura de Datos II','planned','sa'], ['C20',4,4,'Taller de algoritmos y estructura de Datos II','planned','sa'], ['C21',4,5,'Paradigmas de Programación','approved','sa'], ['C22',4,6,'Idioma extranjero IV','approved','sa'],
  ['C23',5,1,'Ética y Deontología Profesional','available','sa'], ['C24',5,2,'Sistemas operativos','no-offer','sa'], ['C25',5,3,'Análisis y diseño de Software','blocked','pp'], ['C26',5,4,'Taller de Análisis de diseño de Software','blocked','pp'], ['C27',5,5,'Herramientas matemáticas V – Estadística II','planned','sa'], ['C28',5,6,'Idioma extranjero V','approved','sa'],
  ['C29',6,1,'Seminario de práctica de Analista en Software','available','process'], ['C30',6,2,'Taller de Ingeniería de Software','blocked','general'], ['C31',6,3,'Ingeniería de Software','blocked','general'], ['C32',6,4,'Base de datos I','blocked','pp'], ['C33',6,6,'Idioma extranjero VI','approved','general'],
  ['C34',7,1,'Seguridad informática','blocked','general'], ['C35',7,2,'Sistemas Operativos II (Redes)','blocked','general'], ['C36',7,4,'Calidad de Software','blocked','general'],
  ['C37',8,1,'Herramientas matemáticas VI – Modelos de simulación','blocked','general'], ['C38',8,2,'Construcción de Software','blocked','general'], ['C39',8,3,'Taller de Construcción de Software','blocked','general'], ['C40',8,4,'Administración de Proyectos','blocked','general'], ['C41',8,5,'Base de Datos II','blocked','general'],
  ['C42',9,1,'Emprendimientos universitarios','available','general'], ['C43',9,2,'Métodos Formales','available','general'], ['C44',9,4,'Práctica profesional de Ingeniería en Software','blocked','process'], ['C45',10,1,'Práctica solidaria','available','process'], ['C46',10,4,'Seminario final de Ingeniería en Software','blocked','process']
].map(([id, term, slot, name, state, category]) => ({ id, term, slot, name, state, category }));

const edges = [
  ['C02','C08','solid'], ['C03','C09','solid'], ['C09','C10','solid'], ['C06','C11','solid'], ['C11','C17','solid'], ['C14','C19','routed'], ['C15','C20','routed'], ['C16','C21','routed'], ['C17','C22','solid'], ['C19','C25','routed'], ['C20','C26','routed'], ['C21','C27','routed'], ['C22','C28','solid'], ['C24','C30','solid'], ['C25','C31','routed'], ['C26','C32','routed'], ['C28','C33','solid'], ['C29','C34','solid'], ['C30','C35','routed'], ['C31','C39','solid'], ['C32','C41','routed'], ['C34','C37','routed'], ['C35','C38','routed'], ['C36','C40','routed'], ['C36','C44','routed'], ['C44','C46','solid']
];

const periods = [
  { kind: 'Período actual', label: '1B · 2026', entryAction: 'Iniciar la inscripción', panelAction: 'Inscribir' },
  { kind: 'Período siguiente', label: '2A · 2026', entryAction: 'Generar alternativas', panelAction: 'Aceptar' }
];
const scenarioPlans = new Map([['2A · 2026', ['C19', 'C20', 'C27']]]);
const drafts = new Map();
const data = window.DATOS_SIMULADOS || { catedras: [] };
const columns = document.querySelector('#columns');
const status = document.querySelector('#selection-status');
const warningStatus = document.querySelector('#warning-status');
const selectionPanel = document.querySelector('#selection-panel');
const optimizationStage = document.querySelector('#optimization-stage');
const graphFrame = document.querySelector('#graph-frame');
const primaryAction = document.querySelector('#primary-action');
const canvas = document.querySelector('.canvas');
let periodIndex = 0;
let highlightedId = null;
let selectionOpen = false;
let optimizationOpen = false;
let panelSide = 'right';

function currentPeriod() { return periods[periodIndex]; }
function offersFor(courseId) { return data.catedras.filter(item => item.materiaId === courseId && item.periodo === currentPeriod().label); }
function draftForPeriod(label = currentPeriod().label) {
  if (!drafts.has(label)) {
    drafts.set(label, new Map((scenarioPlans.get(label) || []).map(id => [id, 'scenario'])));
  }
  return drafts.get(label);
}
function currentDraft() { return draftForPeriod(); }
function selectedCourses() { return courses.filter(course => currentDraft().has(course.id)); }
function intentionFor(course) {
  if (course.state === 'blocked') return 'no considerar';
  return currentDraft().get(course.id) === 'scenario' ? 'requerida en esta planificación' : 'deseada';
}
function consideredCourses() { return selectedCourses().filter(course => intentionFor(course) !== 'no considerar'); }
function bimestreLabel() { return currentPeriod().label.slice(0, 2); }
function cuatrimestreLabel() { return currentPeriod().label.charAt(0); }
function blockedReason(course) {
  const prerequisites = edges.filter(([, target]) => target === course.id).map(([source]) => source);
  return prerequisites.length
    ? `Bloqueada en el escenario: correlatividad pendiente con ${prerequisites.join(', ')}.`
    : 'Bloqueada en el escenario: no cumple las condiciones académicas informadas.';
}
function displayState(course) {
  if (currentDraft().has(course.id) && intentionFor(course) === 'requerida en esta planificación') return states.planned;
  if (course.state === 'planned') return states.available;
  return states[course.state];
}

function renderPeriod() {
  const period = currentPeriod();
  document.querySelector('#period-kind').textContent = period.kind;
  document.querySelector('#period-label').textContent = period.label;
  document.querySelector('#period-prev').disabled = periodIndex === 0;
  document.querySelector('#period-next').disabled = periodIndex === periods.length - 1;
  primaryAction.textContent = period.entryAction;
  primaryAction.hidden = selectionOpen || optimizationOpen;
  document.querySelector('#panel-primary-action').textContent = period.panelAction;
}

function renderColumns() {
  columns.innerHTML = Array.from({ length: 10 }, (_, index) => {
    const term = index + 1;
    const cards = courses.filter(course => course.term === term).map(course => {
      const state = displayState(course);
      const intention = currentDraft().has(course.id) ? intentionFor(course) : '';
      return `<button class="course ${state === states.planned ? 'planned' : course.state === 'planned' ? 'available' : course.state} category-${course.category}" data-course="${course.id}" type="button" style="--slot:${course.slot}" aria-pressed="${Boolean(intention)}" ${selectionOpen ? '' : 'disabled'}>
        <span class="course-state"><span aria-hidden="true">${state.symbol}</span> ${state.label}</span>
        <strong><span>${course.id}</span> · ${course.name}</strong>
        <small><span aria-hidden="true">●</span> ${intention ? intention : 'Sin marcar'} · ${course.category === 'sa' ? 'Req. SA' : course.category === 'pp' ? 'Req. PP' : course.category === 'process' ? 'Proceso' : 'General'}</small>
      </button>`;
    }).join('');
    return `<section class="term" aria-labelledby="term-${term}"><h2 id="term-${term}">Cuatrimestre ${term}</h2><div class="term-grid">${cards}</div></section>`;
  }).join('');
  document.querySelectorAll('.course').forEach(card => card.addEventListener('click', () => markCourse(card.dataset.course)));
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
    const x2 = (target.left - stageBox.left) / scale;
    const y2 = (target.top + target.height / 2 - stageBox.top) / scale;
    const bend = Math.max(28, (x2 - x1) * .48);
    const related = highlightedId && (from === highlightedId || to === highlightedId);
    return `<path class="edge ${type} ${related ? 'related' : ''} ${highlightedId && !related ? 'muted' : ''}" d="M ${x1} ${y1} C ${x1 + bend} ${y1}, ${x2 - bend} ${y2}, ${x2} ${y2}" marker-end="url(#arrow)"/>`;
  }).join('') + '<defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" /></marker></defs>';
}

function overlap(left, right) { return left.dia === right.dia && left.desde < right.hasta && right.desde < left.hasta; }
function preferredPanelSide(scrollRatio, currentSide) {
  if (currentSide === 'left') return scrollRatio < .15 ? 'right' : 'left';
  return scrollRatio >= .20 ? 'left' : 'right';
}
function boxesOverlap(first, second) {
  return first.left < second.right && first.right > second.left && first.top < second.bottom && first.bottom > second.top;
}
function panelBoxForSide(side) {
  const panelBox = selectionPanel.getBoundingClientRect();
  const inset = parseFloat(getComputedStyle(selectionPanel).getPropertyValue('--panel-inset')) || 24;
  const left = side === 'left' ? inset : window.innerWidth - inset - panelBox.width;
  return { left, right: left + panelBox.width, top: panelBox.top, bottom: panelBox.bottom };
}
function focusIsClear(side) {
  const candidateBox = panelBoxForSide(side);
  const focused = document.activeElement;
  if (!(focused instanceof HTMLElement) || focused === document.body || focused === document.documentElement) return true;
  if (selectionPanel.contains(focused)) return true;
  return !boxesOverlap(candidateBox, focused.getBoundingClientRect());
}
function scrollRatio() {
  const range = canvas.scrollWidth - canvas.clientWidth;
  return range > 0 ? canvas.scrollLeft / range : 0;
}
function updatePanelSide() {
  if (!selectionOpen) return;
  let nextSide = preferredPanelSide(scrollRatio(), panelSide);
  if (!focusIsClear(nextSide)) nextSide = nextSide === 'left' ? 'right' : 'left';
  panelSide = nextSide;
  selectionPanel.dataset.side = panelSide;
}
function localWarnings() {
  const active = consideredCourses();
  const warnings = [];
  const known = active.filter(course => offersFor(course.id).length);
  if (known.length > 3) warnings.push(`Tope de bimestre superado: ${known.length} materias con oferta en ${bimestreLabel()}; el máximo es 3.`);
  if (known.length > 6) warnings.push(`Tope de cuatrimestre superado: ${known.length} materias conocidas; el máximo es 6.`);
  active.forEach(course => {
    edges.filter(([, target]) => target === course.id).forEach(([source]) => {
      const prerequisite = courses.find(item => item.id === source);
      const fulfilled = prerequisite.state === 'approved' || (currentDraft().has(source) && intentionFor(prerequisite) !== 'no considerar');
      if (!fulfilled) warnings.push(`${course.id} requiere revisar la correlatividad directa con ${source}; el escenario no confirma que esté satisfecha.`);
    });
  });
  active.forEach(course => {
    const offerings = offersFor(course.id);
    if (offerings.length && offerings.every(offer => offer.cupo <= 0)) warnings.push(`${course.id} no tiene cupo simulado en las cátedras publicadas de ${currentPeriod().label}.`);
  });
  for (let index = 0; index < active.length; index += 1) {
    for (let other = index + 1; other < active.length; other += 1) {
      const possibleConflict = offersFor(active[index].id).some(first => offersFor(active[other].id).some(second => first.franjas.some(a => second.franjas.some(b => overlap(a, b)))));
      if (possibleConflict) warnings.push(`${active[index].id} y ${active[other].id} tienen al menos una combinación de comisiones con superposición; la optimización debe elegir una combinación compatible.`);
    }
  }
  return [...new Set(warnings)];
}

function renderPanel() {
  const selected = selectedCourses();
  const active = consideredCourses();
  const known = active.filter(course => offersFor(course.id).length);
  document.querySelector('#selected-count').textContent = `${selected.length} ${selected.length === 1 ? 'materia' : 'materias'}`;
  document.querySelector('#cap-summary').innerHTML = [
    [`Bimestre ${bimestreLabel()}`, known.length, 3], [`Cuatrimestre ${cuatrimestreLabel()}`, known.length, 6]
  ].map(([label, used, limit]) => `<div class="cap-item ${used > limit ? 'over-cap' : ''}"><span>${label}</span><b>${used} / ${limit}</b><span>${used > limit ? 'Tope excedido' : 'Con oferta conocida'}</span></div>`).join('');
  const list = document.querySelector('#selected-subjects');
  list.innerHTML = selected.length ? selected.map(course => {
    const origin = currentDraft().get(course.id);
    const intention = intentionFor(course);
    const offerText = offersFor(course.id).length ? `${offersFor(course.id).length} cátedra(s) publicada(s)` : 'oferta pendiente';
    const motive = intention === 'no considerar' ? `<span class="subject-motive">${blockedReason(course)}</span>` : '';
    return `<li class="subject-item"><div class="subject-name">${course.id} · ${course.name}<span class="subject-meta">${offerText}</span><span class="derived-intention">${intention}</span>${origin === 'scenario' ? '<span class="subject-origin">Cargada desde la planificación existente del escenario.</span>' : ''}${motive}</div></li>`;
  }).join('') : '<li class="empty-state">Todavía no hay materias marcadas.</li>';
  const warnings = localWarnings();
  document.querySelector('#warnings').innerHTML = warnings.length ? warnings.map(message => `<li>${message}</li>`).join('') : '<li class="clear-warning">No hay advertencias locales para las materias activas.</li>';
  warningStatus.textContent = warnings.length ? `${warnings.length} advertencias locales actualizadas.` : 'No hay advertencias locales.';
  document.querySelector('#panel-primary-action').disabled = selected.length === 0;
}

function updateCards() {
  const relatedIds = new Set(highlightedId ? [highlightedId] : []);
  edges.forEach(([from, to]) => { if (from === highlightedId || to === highlightedId) { relatedIds.add(from); relatedIds.add(to); } });
  document.querySelectorAll('.course').forEach(card => {
    const course = courses.find(item => item.id === card.dataset.course);
    const isMarked = currentDraft().has(course.id);
    card.setAttribute('aria-pressed', String(isMarked));
    card.classList.toggle('marked', isMarked);
    card.classList.toggle('selected', card.dataset.course === highlightedId);
    card.classList.toggle('muted', Boolean(highlightedId) && !relatedIds.has(card.dataset.course));
    if (isMarked) card.dataset.intention = intentionFor(course); else delete card.dataset.intention;
  });
}

function updateInterface() {
  renderPeriod();
  renderColumns();
  updateCards();
  renderPanel();
  updatePanelSide();
  drawConnections();
}
function announceSelection(message) { status.textContent = message; }
function markCourse(id) {
  const course = courses.find(item => item.id === id);
  if (currentDraft().has(id)) {
    currentDraft().delete(id);
    highlightedId = null;
    announceSelection(`${id} se quitó del borrador.`);
  } else {
    currentDraft().set(id, 'student');
    highlightedId = id;
    const intention = intentionFor(course);
    announceSelection(intention === 'no considerar'
      ? `${id} se agregó como no considerar. ${blockedReason(course)}`
      : `${id} se agregó como deseada. Se resaltaron sus correlatividades directas.`);
  }
  updateInterface();
}
function fitGraphToViewport() {
  const region = document.querySelector('#graph-region');
  const frame = document.querySelector('#graph-frame');
  const styles = getComputedStyle(canvas);
  const verticalPadding = parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom);
  frame.style.width = `${region.offsetWidth}px`;
  const scale = region.offsetHeight ? Math.min(1, Math.max(0, canvas.clientHeight - verticalPadding) / region.offsetHeight) : 1;
  region.dataset.scale = String(scale);
  region.style.transform = `scale(${scale})`;
  frame.style.width = `${Math.ceil(region.offsetWidth * scale)}px`;
  frame.style.height = `${Math.floor(region.offsetHeight * scale)}px`;
  drawConnections();
}
function openSelection() {
  selectionOpen = true;
  optimizationOpen = false;
  selectionPanel.hidden = false;
  primaryAction.blur();
  optimizationStage.hidden = true;
  graphFrame.hidden = false;
  updatePanelSide();
  announceSelection(`Selección abierta para ${currentPeriod().label}.`);
  updateInterface();
}
function runOptimization() {
  if (!selectedCourses().length) return;
  selectionOpen = false;
  optimizationOpen = true;
  selectionPanel.hidden = true;
  graphFrame.hidden = true;
  optimizationStage.hidden = false;
  primaryAction.hidden = true;
  announceSelection(`${currentPeriod().panelAction}: el borrador pasó a la etapa de optimización pendiente.`);
}

renderColumns();
draftForPeriod();
selectionPanel.hidden = true;
optimizationStage.hidden = true;
document.querySelector('#period-prev').addEventListener('click', () => { periodIndex = Math.max(0, periodIndex - 1); highlightedId = null; updateInterface(); });
document.querySelector('#period-next').addEventListener('click', () => { periodIndex = Math.min(periods.length - 1, periodIndex + 1); highlightedId = null; updateInterface(); });
primaryAction.addEventListener('click', openSelection);
document.querySelector('#panel-primary-action').addEventListener('click', runOptimization);
canvas.addEventListener('scroll', updatePanelSide, { passive: true });
document.addEventListener('focusin', updatePanelSide);
updateInterface();
requestAnimationFrame(fitGraphToViewport);
window.addEventListener('resize', () => {
  fitGraphToViewport();
  updatePanelSide();
});
