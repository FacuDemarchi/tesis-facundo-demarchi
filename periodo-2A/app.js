const states = {
  approved: { label: 'Aprobada', symbol: '✓' },
  available: { label: 'Disponible', symbol: '•' },
  'no-offer': { label: 'Sin cátedra', symbol: '—' },
  blocked: { label: 'Bloqueada', symbol: '×' },
  enrolled: { label: 'Inscripta', symbol: 'I' },
  'no-capacity': { label: 'Sin cupo', symbol: '0' },
  planned: { label: 'Planificada', symbol: 'P' },
  review: { label: 'Solicitud en revisión', symbol: 'R' }
};

const courses = [
  { id:'C01', term:1, slot:1, name:'Herramientas matemáticas I – Álgebra', state:'approved', regimen:'bimestral' },
  { id:'C02', term:1, slot:2, name:'Herramientas matemáticas II – Análisis', state:'approved', regimen:'bimestral' },
  { id:'C03', term:1, slot:3, name:'Introducción a los algoritmos', state:'approved', regimen:'bimestral' },
  { id:'C04', term:1, slot:4, name:'Desarrollo emprendedor', state:'approved', regimen:'bimestral' },
  { id:'C05', term:1, slot:5, name:'Sistemas de información', state:'approved', regimen:'bimestral' },
  { id:'C06', term:1, slot:6, name:'Idioma extranjero I', state:'approved', regimen:'anual' },
  { id:'C07', term:2, slot:1, name:'Matemática discreta', state:'approved', regimen:'bimestral' },
  { id:'C08', term:2, slot:2, name:'Cálculo avanzado', state:'approved', regimen:'bimestral' },
  { id:'C09', term:2, slot:3, name:'Arquitectura del computador', state:'approved', regimen:'bimestral' },
  { id:'C10', term:3, slot:2, name:'Programación orientada a objetos', state:'approved', regimen:'bimestral' },
  { id:'C11', term:2, slot:6, name:'Idioma extranjero II', state:'approved', regimen:'anual' },
  { id:'C12', term:3, slot:1, name:'Grupo y Liderazgo', state:'approved', regimen:'bimestral' },
  { id:'C13', term:2, slot:4, name:'Lógica Simbólica', state:'approved', regimen:'bimestral' },
  { id:'C14', term:3, slot:3, name:'Algoritmos y estructura de Datos I', state:'approved', regimen:'bimestral' },
  { id:'C15', term:3, slot:4, name:'Taller de algoritmos y estructura de Datos I', state:'approved', regimen:'bimestral' },
  { id:'C16', term:3, slot:5, name:'Herramientas matemáticas III – Estadística I', state:'approved', regimen:'bimestral' },
  { id:'C17', term:3, slot:6, name:'Idioma extranjero III', state:'approved', regimen:'anual' },
  { id:'C18', term:4, slot:1, name:'Principios de Economía', state:'approved', regimen:'bimestral' },
  { id:'C19', term:4, slot:3, name:'Algoritmos y estructura de Datos II', state:'enrolled', regimen:'bimestral' },
  { id:'C20', term:4, slot:4, name:'Taller de algoritmos y estructura de Datos II', state:'enrolled', regimen:'bimestral' },
  { id:'C21', term:4, slot:5, name:'Paradigmas de Programación', state:'approved', regimen:'bimestral' },
  { id:'C22', term:4, slot:6, name:'Idioma extranjero IV', state:'approved', regimen:'anual' },
  { id:'C23', term:5, slot:1, name:'Ética y Deontología Profesional', state:'planned', regimen:'bimestral' },
  { id:'C24', term:5, slot:2, name:'Sistemas operativos', state:'no-offer', regimen:'bimestral' },
  { id:'C25', term:5, slot:3, name:'Análisis y diseño de Software', state:'planned', regimen:'bimestral' },
  { id:'C26', term:5, slot:4, name:'Taller de Análisis de diseño de Software', state:'planned', regimen:'bimestral' },
  { id:'C27', term:5, slot:5, name:'Herramientas matemáticas V – Estadística II', state:'enrolled', regimen:'bimestral' },
  { id:'C28', term:5, slot:6, name:'Idioma extranjero V', state:'approved', regimen:'anual' },
  { id:'C29', term:6, slot:1, name:'Seminario de práctica de Analista en Software', state:'available', regimen:'cuatrimestral' },
  { id:'C30', term:6, slot:2, name:'Taller de Ingeniería de Software', state:'blocked', regimen:'bimestral' },
  { id:'C31', term:6, slot:3, name:'Ingeniería de Software', state:'blocked', regimen:'bimestral' },
  { id:'C32', term:6, slot:4, name:'Base de datos I', state:'blocked', regimen:'bimestral' },
  { id:'C33', term:6, slot:6, name:'Idioma extranjero VI', state:'approved', regimen:'anual' },
  { id:'C34', term:7, slot:1, name:'Seguridad informática', state:'blocked', regimen:'bimestral' },
  { id:'C35', term:7, slot:2, name:'Sistemas Operativos II (Redes)', state:'blocked', regimen:'bimestral' },
  { id:'C36', term:7, slot:6, name:'Calidad de Software', state:'blocked', regimen:'bimestral' },
  { id:'C37', term:8, slot:1, name:'Herramientas matemáticas VI – Modelos de simulación', state:'blocked', regimen:'bimestral' },
  { id:'C38', term:8, slot:2, name:'Construcción de Software', state:'blocked', regimen:'bimestral' },
  { id:'C39', term:8, slot:3, name:'Taller de Construcción de Software', state:'blocked', regimen:'bimestral' },
  { id:'C40', term:8, slot:4, name:'Administración de Proyectos', state:'blocked', regimen:'bimestral' },
  { id:'C41', term:8, slot:5, name:'Base de Datos II', state:'blocked', regimen:'bimestral' },
  { id:'C42', term:9, slot:1, name:'Emprendimientos universitarios', state:'available', regimen:'bimestral' },
  { id:'C43', term:9, slot:2, name:'Métodos Formales', state:'available', regimen:'bimestral' },
  { id:'C44', term:9, slot:6, name:'Práctica profesional de Ingeniería en Software', state:'blocked', regimen:'cuatrimestral' },
  { id:'C45', term:10, slot:1, name:'Práctica solidaria', state:'available', regimen:'cuatrimestral' },
  { id:'C46', term:10, slot:6, name:'Seminario final de Ingeniería en Software', state:'blocked', regimen:'cuatrimestral' }
];

const edges = [
  ['C02','C08','solid'], ['C03','C09','solid'], ['C09','C10','solid'], ['C06','C11','solid'],
  ['C11','C17','solid'], ['C14','C19','routed'], ['C15','C20','routed'], ['C16','C21','routed'],
  ['C17','C22','solid'], ['C19','C25','routed'], ['C20','C26','routed'], ['C21','C27','routed'],
  ['C22','C28','solid'], ['C24','C30','solid'], ['C25','C31','routed'], ['C26','C32','routed'],
  ['C28','C33','solid'], ['C29','C34','solid'], ['C30','C35','routed'], ['C31','C39','solid'],
  ['C32','C41','routed'], ['C34','C37','routed'], ['C35','C38','routed'], ['C36','C40','routed'],
  ['C36','C44','routed'], ['C44','C46','solid']
];

const columns = document.querySelector('#columns');
const periods = [
  { kind: 'Período actual', label: '2A · 2026' },
  { kind: 'Período siguiente', label: '2B · 2026' }
];
let periodIndex = 0;

function renderPeriod() {
  const period = periods[periodIndex];
  document.querySelector('#period-kind').textContent = period.kind;
  document.querySelector('#period-label').textContent = period.label;
  document.querySelector('#period-prev').disabled = periodIndex === 0;
  document.querySelector('#period-next').disabled = periodIndex === periods.length - 1;
}

function renderColumns() {
  columns.innerHTML = Array.from({ length: 10 }, (_, index) => {
    const term = index + 1;
    const cards = courses.filter(course => course.term === term).map(course => {
      const state = states[course.state];
      return `<article class="course ${course.state} regimen-${course.regimen}" data-course="${course.id}" style="--slot:${course.slot}">
        <span class="course-state"><span aria-hidden="true">${state.symbol}</span> ${state.label}</span>
        <strong><span>${course.id}</span> · ${course.name}</strong>
        <small><span aria-hidden="true">●</span> Disponible · ${course.regimen === 'anual' ? 'Anual' : course.regimen === 'cuatrimestral' ? 'Cuatrimestral' : 'Bimestral'}</small>
      </article>`;
    }).join('');
    return `<section class="term" aria-labelledby="term-${term}"><h2 id="term-${term}">Cuatrimestre ${term}</h2><div class="term-grid">${cards}</div></section>`;
  }).join('');
}

function drawConnections() {
  const svg = document.querySelector('#connections');
  const stage = document.querySelector('#graph-stage');
  const stageBox = stage.getBoundingClientRect();
  const scale = Number(document.querySelector('#graph-region').dataset.scale || 1);
  if (scale <= 0) {
    svg.innerHTML = '';
    return;
  }
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
    return `<path class="edge ${type}" data-from="${from}" data-to="${to}" d="M ${x1} ${y1} C ${x1 + bend} ${y1}, ${x2 - bend} ${y2}, ${x2} ${y2}" marker-end="url(#arrow)"/>`;
  }).join('') + `<defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" /></marker></defs>`;
}


function fitGraphToViewport() {
  const canvas = document.querySelector('.canvas');
  const region = document.querySelector('#graph-region');
  const frame = document.querySelector('#graph-frame');
  const canvasStyle = getComputedStyle(canvas);

  // Force the horizontal scrollbar, then measure the exact remaining client height.
  frame.style.width = `${region.offsetWidth}px`;
  const verticalPadding = parseFloat(canvasStyle.paddingTop) + parseFloat(canvasStyle.paddingBottom);
  const availableHeight = Math.max(0, canvas.clientHeight - verticalPadding);
  const scale = region.offsetHeight ? Math.min(1, availableHeight / region.offsetHeight) : 1;

  region.dataset.scale = String(scale);
  region.style.transform = `scale(${scale})`;
  frame.style.width = `${Math.ceil(region.offsetWidth * scale)}px`;
  frame.style.height = `${Math.floor(region.offsetHeight * scale)}px`;
  drawConnections();
}

renderColumns();
renderPeriod();
document.querySelector('#period-prev').addEventListener('click', () => {
  periodIndex = Math.max(0, periodIndex - 1);
  renderPeriod();
});
document.querySelector('#period-next').addEventListener('click', () => {
  periodIndex = Math.min(periods.length - 1, periodIndex + 1);
  renderPeriod();
});
requestAnimationFrame(fitGraphToViewport);
window.addEventListener('resize', fitGraphToViewport);
