const demandModel = window.DEMANDA_INSTITUCIONAL_SIMULADA;
const simulatedData = window.DATOS_SIMULADOS;
const periodLabel = document.querySelector('#period-label');
const previousButton = document.querySelector('#period-prev');
const nextButton = document.querySelector('#period-next');
const announcements = document.querySelector('#announcements');
const globalEvaluationContainer = document.querySelector('#global-evaluation');
const globalEvaluationAction = document.querySelector('#global-evaluation-action');
const globalEvaluationResult = document.querySelector('#global-evaluation-result');
let globalEvaluation = null;
let globalEvaluationExpanded = false;
let periodIndex = 0;

const metricDefinitions = [
  { key: 'total', label: 'Total', className: 'total', valueId: 'demand-total-value' },
  { key: 'alumnosInscriptos', label: 'Alumnos inscriptos', className: 'eligible', valueId: 'enrolled-value' },
  { key: 'alumnosInscriptosFueraDeCupo', label: 'Alumnos inscriptos fuera de cupo', className: 'no-capacity', valueId: 'outside-capacity-value' },
  { key: 'demandaFutura', label: 'Demanda futura', className: 'conditional', valueId: 'future-demand-value' }
];

const periodContracts = {
  'Período actual': {
    metricas: ['total', 'alumnosInscriptos', 'alumnosInscriptosFueraDeCupo'],
    subjectCount: 5,
    totalFor: item => item.alumnosInscriptos + item.alumnosInscriptosFueraDeCupo
  },
  'Período siguiente': {
    metricas: ['total', 'demandaFutura'],
    subjectCount: 4,
    totalFor: item => item.demandaFutura
  }
};

function assertDemandModel(model) {
  if (!model?.simulado || !Array.isArray(model.periodos) || !model.periodos.length) {
    throw new Error('The simulated institutional demand model is unavailable.');
  }

  model.periodos.forEach(period => {
    const contract = periodContracts[period.tipo];
    if (!contract || period.demanda.length !== contract.subjectCount || period.metricas?.join('|') !== contract.metricas.join('|')) {
      throw new Error(`Invalid demand contract for ${period.id}.`);
    }

    period.demanda.forEach(item => {
      if (item.total !== contract.totalFor(item)) {
        throw new Error(`Inconsistent demand total for ${period.id}/${item.materiaId}.`);
      }

      if (period.tipo === 'Período actual') {
        const sections = item.secciones;
        const assigned = sections?.reduce((sum, section) => sum + section.alumnosInscriptosAsignados, 0);
        const validSections = Array.isArray(sections) && sections.length > 0
          && sections.every(section => section.catedraId && section.aulaId && section.aulaNombre
            && section.cupo === section.alumnosInscriptosAsignados);
        if (!validSections || assigned !== item.alumnosInscriptos
          || (item.alumnosInscriptosFueraDeCupo > 0 && item.atribucionFueraDeCupo !== 'No asignados todavía a una sección.')) {
          throw new Error(`Inconsistent section snapshot for ${period.id}/${item.materiaId}.`);
        }
      } else if (item.secciones) {
        throw new Error(`Unexpected section snapshot for future demand ${period.id}/${item.materiaId}.`);
      }
    });
  });
}

function assertEvaluationData(data, model) {
  if (!data?.simulado || !Array.isArray(data.aulas) || !Array.isArray(data.catedras)) {
    throw new Error('The shared simulated classroom data is unavailable.');
  }

  model.periodos.filter(period => period.tipo === 'Período actual').forEach(period => {
    period.demanda.forEach(item => item.secciones.forEach(section => {
      const classroom = data.aulas.find(room => room.id === section.aulaId);
      const offer = data.catedras.find(candidate => candidate.id === section.catedraId && candidate.periodo === period.etiqueta);
      if (!classroom || !offer || offer.aulaId !== section.aulaId || classroom.capacidad !== section.cupo) {
        throw new Error(`Inconsistent classroom data for ${period.id}/${section.catedraId}.`);
      }
    }));
  });
}

function currentPeriod() {
  return demandModel.periodos[periodIndex];
}

function totalFor(period, key) {
  return period.demanda.reduce((sum, item) => sum + item[key], 0);
}

function metricDefinitionsFor(period) {
  return period.metricas.map(key => metricDefinitions.find(definition => definition.key === key));
}

function createCategoryRow(definition, item) {
  const row = document.createElement('div');
  row.className = `category-row ${definition.className}`;
  const label = document.createElement('dt');
  label.textContent = definition.label;
  const value = document.createElement('dd');
  value.textContent = item[definition.key];
  row.append(label, value);
  return row;
}

function createSectionDetails(item) {
  const sectionBlock = document.createElement('section');
  sectionBlock.className = 'section-details';
  const title = document.createElement('h4');
  title.textContent = 'Secciones asignadas (simuladas)';
  const list = document.createElement('ul');
  list.className = 'section-list';

  item.secciones.forEach(section => {
    const listItem = document.createElement('li');
    const sectionId = document.createElement('strong');
    sectionId.textContent = section.catedraId;
    listItem.append(sectionId, ` · ${section.aulaNombre} · Cupo: ${section.cupo} · Inscriptos asignados: ${section.alumnosInscriptosAsignados}`);
    list.append(listItem);
  });

  sectionBlock.append(title, list);
  return sectionBlock;
}

function renderGlobalEvaluationResult(evaluation) {
  const title = document.createElement('h3');
  title.textContent = 'Resultado de evaluación global';
  const details = document.createElement('dl');
  details.className = 'global-evaluation-details';
  [
    ['Demanda fuera de cupo antes de evaluar', evaluation.summary.totalOutsideCapacityStudents],
    ['Estudiantes absorbidos por el plan', evaluation.summary.incorporableStudents],
    ['Estudiantes residuales', evaluation.summary.residualStudents],
    ['Movimientos de aula', evaluation.summary.changedRoomCount],
    ['Capacidad sin usar (definición del optimizador)', evaluation.summary.unusedCapacity]
  ].forEach(([label, value]) => {
    const term = document.createElement('dt');
    term.textContent = label;
    const description = document.createElement('dd');
    description.textContent = value;
    details.append(term, description);
  });
  const definition = document.createElement('p');
  definition.textContent = 'La capacidad sin usar es la suma de los asientos libres en las aulas asignadas, antes de absorber la demanda fuera de cupo.';
  const notice = document.createElement('p');
  notice.className = 'global-evaluation-notice';
  notice.textContent = 'Esta evaluación es de solo lectura: no aplica cambios a aulas, inscripciones, horarios, docentes ni propuestas.';
  globalEvaluationResult.replaceChildren(title, details, definition, notice);
}

function renderGlobalEvaluation(period) {
  const hasOutsideCapacity = period.tipo === 'Período actual'
    && totalFor(period, 'alumnosInscriptosFueraDeCupo') > 0;
  const hasResultForPeriod = globalEvaluation?.periodId === period.id;
  const isExpanded = hasOutsideCapacity && hasResultForPeriod && globalEvaluationExpanded;

  globalEvaluationContainer.hidden = !hasOutsideCapacity;
  globalEvaluationAction.setAttribute('aria-expanded', String(isExpanded));
  globalEvaluationResult.hidden = !isExpanded;

  if (!hasOutsideCapacity) {
    globalEvaluationResult.replaceChildren();
    return;
  }

  if (isExpanded) renderGlobalEvaluationResult(globalEvaluation.result);
}

function globalSubjectPlanFor(period, item) {
  if (!globalEvaluationExpanded || globalEvaluation?.periodId !== period.id) return null;
  const subject = globalEvaluation.result.subjects.find(candidate => candidate.materiaId === item.materiaId);
  if (!subject || (subject.outsideCapacityStudents === 0 && !subject.sections.some(section => section.changedRoom))) {
    return null;
  }
  return subject;
}

function createGlobalPlanDetails(subject) {
  const planBlock = document.createElement('section');
  planBlock.className = 'global-plan-details';
  const headingId = `global-plan-${subject.materiaId}`;
  const title = document.createElement('h4');
  title.id = headingId;
  title.textContent = 'Plan global simulado';
  const explanation = document.createElement('p');
  explanation.className = 'global-plan-explanation';
  explanation.textContent = 'El plan considera todas las secciones en conjunto, el tipo y la capacidad de aula, los horarios fijos y la contención de aulas. No aplica cambios.';

  const summary = document.createElement('dl');
  summary.className = 'global-plan-summary';
  [
    ['Demanda fuera de cupo', subject.outsideCapacityStudents],
    ['Total incorporable', subject.incorporableStudents],
    ['Residual', subject.residualStudents]
  ].forEach(([label, value]) => {
    const term = document.createElement('dt');
    term.textContent = label;
    const description = document.createElement('dd');
    description.textContent = value;
    summary.append(term, description);
  });

  const sectionsTitle = document.createElement('h5');
  sectionsTitle.textContent = 'Asignación por cátedra';
  const sections = document.createElement('ul');
  sections.className = 'global-plan-section-list';
  sections.setAttribute('aria-labelledby', headingId);
  subject.sections.forEach(section => {
    const sectionItem = document.createElement('li');
    const sectionId = document.createElement('strong');
    sectionId.textContent = section.catedraId;
    const assignment = document.createElement('p');
    assignment.className = 'global-plan-assignment';
    assignment.textContent = `${section.changedRoom ? 'Se traslada' : 'Permanece'} · actual: ${section.currentRoom.nombre} (${section.currentRoom.id}), capacidad ${section.currentRoom.capacidad} · propuesta: ${section.proposedRoom.nombre} (${section.proposedRoom.id}), capacidad ${section.proposedRoom.capacidad}.`;
    const allocation = document.createElement('p');
    allocation.className = 'global-plan-allocation';
    allocation.textContent = `Inscriptos asignados: ${section.alumnosInscriptosAsignados} · Fuera de cupo absorbidos: ${section.incorporableStudents} · Demanda restante: ${section.remainingOutsideCapacityStudents}.`;
    sectionItem.append(sectionId, assignment, allocation);
    sections.append(sectionItem);
  });

  const residualNotice = document.createElement('p');
  residualNotice.className = 'global-plan-residual';
  residualNotice.textContent = subject.residualStudents > 0
    ? `Quedan ${subject.residualStudents} estudiantes residuales: se deriva a CU-11 para evaluar una nueva sección. Esta pantalla no crea ni aprueba una propuesta.`
    : 'La demanda fuera de cupo queda cubierta por la redistribución simulada.';
  planBlock.setAttribute('aria-labelledby', headingId);
  planBlock.append(title, explanation, summary, sectionsTitle, sections, residualNotice);
  return planBlock;
}

function evaluateGlobalDistribution() {
  const period = currentPeriod();
  if (period.tipo !== 'Período actual' || totalFor(period, 'alumnosInscriptosFueraDeCupo') === 0) return;

  if (globalEvaluation?.periodId === period.id) {
    globalEvaluationExpanded = !globalEvaluationExpanded;
    announcements.textContent = globalEvaluationExpanded
      ? 'Resultado de la evaluación global mostrado.'
      : 'Resultado de la evaluación global oculto.';
  } else {
    const optimizeGlobalClassrooms = window.CU10_GLOBAL_CLASSROOM_OPTIMIZER?.optimizeGlobalClassrooms;
    if (typeof optimizeGlobalClassrooms !== 'function') {
      throw new Error('The global classroom optimizer is unavailable.');
    }
    const result = optimizeGlobalClassrooms(period, period.demanda, simulatedData);
    globalEvaluation = { periodId: period.id, result };
    globalEvaluationExpanded = true;
    announcements.textContent = `Evaluación global disponible: ${result.summary.incorporableStudents} estudiantes pueden ser absorbidos y ${result.summary.residualStudents} permanecen residuales.`;
  }

  renderPeriod();
  globalEvaluationAction.focus();
}

function createDemandCard(item, period) {
  const isCurrentPeriod = period.tipo === 'Período actual';
  const hasOutsideCapacity = isCurrentPeriod && item.alumnosInscriptosFueraDeCupo > 0;
  const card = document.createElement('article');
  card.className = `demand-card${hasOutsideCapacity ? ' is-unsatisfied' : ''}`;
  const statusText = isCurrentPeriod
    ? (hasOutsideCapacity ? 'Pendiente de asignación (simulado)' : 'Asignado a sección (simulado)')
    : 'Demanda futura simulada';
  card.setAttribute('aria-label', `${item.materiaId}, ${item.materia}, ${statusText.toLowerCase()}`);

  const header = document.createElement('header');
  header.className = 'card-header';
  const titleGroup = document.createElement('div');
  const code = document.createElement('p');
  code.className = 'course-code';
  code.textContent = item.materiaId;
  const title = document.createElement('h3');
  title.textContent = item.materia;
  titleGroup.append(code, title);
  const status = document.createElement('span');
  status.className = 'status-chip';
  status.textContent = statusText;
  header.append(titleGroup, status);

  const categories = document.createElement('dl');
  categories.className = 'category-list';
  metricDefinitionsFor(period).forEach(definition => categories.append(createCategoryRow(definition, item)));

  const causes = document.createElement('section');
  causes.className = 'cause-block';
  const causesTitle = document.createElement('h4');
  causesTitle.textContent = 'Causas del escenario';
  const causesList = document.createElement('ul');
  item.causas.forEach(cause => {
    const listItem = document.createElement('li');
    listItem.textContent = cause;
    causesList.append(listItem);
  });
  causes.append(causesTitle, causesList);
  card.append(header, categories);
  if (isCurrentPeriod) {
    card.append(createSectionDetails(item));
    const subjectPlan = globalSubjectPlanFor(period, item);
    if (subjectPlan) card.append(createGlobalPlanDetails(subjectPlan));
  }
  card.append(causes);
  return card;
}

function renderSummary(period) {
  const activeMetrics = new Set(period.metricas);
  metricDefinitions.forEach(definition => {
    const summaryItem = document.querySelector(`[data-metric="${definition.key}"]`);
    const isActive = activeMetrics.has(definition.key);
    summaryItem.hidden = !isActive;
    summaryItem.classList.remove('is-preview', 'is-open', 'is-dismissed');
    summaryItem.querySelector('.summary-info').setAttribute('aria-expanded', 'false');
    document.querySelector(`#${definition.valueId}`).textContent = isActive ? totalFor(period, definition.key) : 0;
  });

  document.querySelector('#demand-total-help').textContent = period.tipo === 'Período actual'
    ? 'Total: suma de alumnos inscriptos y alumnos inscriptos fuera de cupo.'
    : 'Total: coincide con la demanda futura.';
}

// La etiqueta visible del período sale del calendario académico compartido: el
// código solo no ubica al lector, y el mes es lo que dice en qué parte del año está.
function etiquetaDePeriodo(period) {
  const academico = (simulatedData.periodosAcademicos || []).find(item => item.codigo === period.codigo);
  return academico ? `${academico.codigo} ${academico.meses}` : period.etiqueta;
}

function renderPeriod({ announce = false } = {}) {
  const period = currentPeriod();
  document.querySelector('#period-kind').textContent = period.tipo;
  periodLabel.textContent = etiquetaDePeriodo(period);
  previousButton.disabled = periodIndex === 0;
  nextButton.disabled = periodIndex === demandModel.periodos.length - 1;

  renderSummary(period);
  renderGlobalEvaluation(period);

  const demandList = document.querySelector('#demand-list');
  demandList.replaceChildren(...period.demanda.map(item => createDemandCard(item, period)));

  if (announce) {
    const total = totalFor(period, 'total');
    announcements.textContent = period.tipo === 'Período actual'
      ? `${period.tipo}: ${etiquetaDePeriodo(period)}. ${period.demanda.length} materias consultadas; total ${total}: ${totalFor(period, 'alumnosInscriptos')} alumnos inscriptos y ${totalFor(period, 'alumnosInscriptosFueraDeCupo')} alumnos inscriptos fuera de cupo.`
      : `${period.tipo}: ${etiquetaDePeriodo(period)}. ${period.demanda.length} materias consultadas; total ${total} de demanda futura.`;
  }
}

function setPeriod(nextIndex, announce = true) {
  const boundedIndex = Math.max(0, Math.min(demandModel.periodos.length - 1, nextIndex));
  if (boundedIndex !== periodIndex) {
    globalEvaluation = null;
    globalEvaluationExpanded = false;
  }
  periodIndex = boundedIndex;
  renderPeriod({ announce });
}

assertDemandModel(demandModel);
assertEvaluationData(simulatedData, demandModel);
renderPeriod();
previousButton.addEventListener('click', () => setPeriod(periodIndex - 1));
nextButton.addEventListener('click', () => setPeriod(periodIndex + 1));
globalEvaluationAction.addEventListener('click', evaluateGlobalDistribution);

const summaryItems = document.querySelectorAll('.summary-item');

function setTooltipState(item, { isPreview = false, isOpen = false, isDismissed = false }) {
  item.classList.toggle('is-preview', isPreview && !isOpen && !isDismissed);
  item.classList.toggle('is-open', isOpen);
  item.classList.toggle('is-dismissed', isDismissed);
  item.querySelector('.summary-info').setAttribute('aria-expanded', String(isOpen));
}

function startTooltipPreview(item, { clearDismissal = false } = {}) {
  if (item.classList.contains('is-open')) return;
  if (item.classList.contains('is-dismissed') && !clearDismissal) return;
  setTooltipState(item, { isPreview: true });
}

function dismissTooltip(item) {
  setTooltipState(item, { isDismissed: true });
}

function closeOpenTooltips(exceptItem = null) {
  document.querySelectorAll('.summary-item.is-open').forEach(item => {
    if (item !== exceptItem) dismissTooltip(item);
  });
}

summaryItems.forEach(item => {
  const button = item.querySelector('.summary-info');

  button.addEventListener('click', () => {
    const willOpen = !item.classList.contains('is-open');
    if (willOpen) {
      closeOpenTooltips(item);
      setTooltipState(item, { isOpen: true });
    } else {
      dismissTooltip(item);
    }
  });

  item.addEventListener('pointerenter', () => {
    startTooltipPreview(item, { clearDismissal: true });
  });

  item.addEventListener('pointerleave', () => {
    item.classList.remove('is-preview');
  });

  item.addEventListener('focusin', () => {
    startTooltipPreview(item);
  });

  item.addEventListener('focusout', event => {
    if (!item.contains(event.relatedTarget)) {
      setTooltipState(item, { isOpen: item.classList.contains('is-open') });
    }
  });
});

document.addEventListener('click', event => {
  if (!event.target.closest('.summary-item')) {
    closeOpenTooltips();
  }
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    document.querySelectorAll('.summary-item.is-preview, .summary-item.is-open').forEach(dismissTooltip);
  }
});
