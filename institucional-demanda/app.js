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
let selectedSubjectId = null;

const metricDefinitions = [
  { key: 'total', label: 'Total', shortLabel: 'Total', className: 'total', valueId: 'demand-total-value' },
  { key: 'alumnosInscriptos', label: 'Alumnos inscriptos', shortLabel: 'Inscriptos', className: 'eligible', valueId: 'enrolled-value' },
  { key: 'alumnosInscriptosFueraDeCupo', label: 'Alumnos inscriptos fuera de cupo', shortLabel: 'Fuera de cupo', className: 'no-capacity', valueId: 'outside-capacity-value' },
  { key: 'demandaFutura', label: 'Demanda futura', shortLabel: 'Demanda futura', className: 'conditional', valueId: 'future-demand-value' }
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

function demandSubjectFor(period, materiaId) {
  return period.demanda.find(item => item.materiaId === materiaId) || null;
}

function createCauseBlock(item) {
  const causes = document.createElement('section');
  causes.className = 'cause-block';
  const title = document.createElement('h4');
  title.textContent = 'Causas del escenario';
  const list = document.createElement('ul');
  item.causas.forEach(cause => {
    const listItem = document.createElement('li');
    listItem.textContent = cause;
    list.append(listItem);
  });
  causes.append(title, list);
  return causes;
}

function createDemandRow(item, period, metrics, isCurrentPeriod) {
  const hasOutsideCapacity = isCurrentPeriod && item.alumnosInscriptosFueraDeCupo > 0;
  const isSelected = item.materiaId === selectedSubjectId;
  const row = document.createElement('tr');
  row.className = `demand-row${hasOutsideCapacity ? ' is-unsatisfied' : ''}${isSelected ? ' is-selected' : ''}`;
  row.dataset.materiaId = item.materiaId;

  const subjectCell = document.createElement('th');
  subjectCell.scope = 'row';
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'subject-select';
  button.dataset.materiaId = item.materiaId;
  button.setAttribute('aria-controls', 'demand-detail');
  if (isSelected) button.setAttribute('aria-current', 'true');
  const code = document.createElement('span');
  code.className = 'subject-code';
  code.textContent = item.materiaId;
  const name = document.createElement('span');
  name.className = 'subject-name';
  name.textContent = item.materia;
  // Chrome no expone `aria-current` en este botón (medido): el estado de selección
  // viaja en el nombre accesible, que es lo que el lector de pantalla sí lee.
  const selection = document.createElement('span');
  selection.className = 'sr-only';
  selection.textContent = isSelected ? ' (seleccionada)' : '';
  button.append(code, name, selection);
  subjectCell.append(button);
  row.append(subjectCell);

  metrics.forEach(definition => {
    const cell = document.createElement('td');
    cell.className = `metric-cell ${definition.className}`;
    cell.textContent = item[definition.key];
    row.append(cell);
  });

  if (isCurrentPeriod) {
    const statusCell = document.createElement('td');
    statusCell.className = 'status-cell';
    const chip = document.createElement('span');
    chip.className = 'status-chip';
    chip.textContent = hasOutsideCapacity ? 'Pendiente' : 'Asignado';
    statusCell.append(chip);
    row.append(statusCell);
  }

  row.addEventListener('click', () => selectSubject(item.materiaId));
  return row;
}

function selectSubject(materiaId) {
  const period = currentPeriod();
  const subject = demandSubjectFor(period, materiaId);
  if (!subject || materiaId === selectedSubjectId) return;
  selectedSubjectId = materiaId;
  renderDemand(period);
  const selectedButton = document.querySelector(`.subject-select[data-materia-id="${materiaId}"]`);
  if (selectedButton) selectedButton.focus();
  announcements.textContent = `Detalle de ${subject.materiaId} · ${subject.materia}.`;
}

function renderDemandDetail(period) {
  const container = document.querySelector('#demand-detail');
  const item = demandSubjectFor(period, selectedSubjectId);
  if (!item) {
    container.replaceChildren();
    return;
  }

  const isCurrentPeriod = period.tipo === 'Período actual';
  const hasOutsideCapacity = isCurrentPeriod && item.alumnosInscriptosFueraDeCupo > 0;
  const title = document.createElement('h3');
  title.id = 'demand-detail-title';
  title.className = 'demand-detail-title';
  const code = document.createElement('span');
  code.className = 'subject-code';
  code.textContent = item.materiaId;
  const name = document.createElement('span');
  name.className = 'subject-name';
  name.textContent = item.materia;
  const status = document.createElement('span');
  status.className = 'status-chip';
  status.textContent = isCurrentPeriod
    ? (hasOutsideCapacity ? 'Pendiente de asignación' : 'Asignado a sección')
    : 'Demanda futura simulada';
  title.append(code, name, status);

  container.replaceChildren(title);
  if (isCurrentPeriod) container.append(createSectionDetails(item));
  const subjectPlan = globalSubjectPlanFor(period, item);
  if (subjectPlan) container.append(createGlobalPlanDetails(subjectPlan));
  container.append(createCauseBlock(item));
}

function renderDemand(period) {
  const isCurrentPeriod = period.tipo === 'Período actual';
  const metrics = metricDefinitionsFor(period);
  if (!demandSubjectFor(period, selectedSubjectId)) {
    selectedSubjectId = period.demanda.length ? period.demanda[0].materiaId : null;
  }

  const headRow = document.createElement('tr');
  const subjectHead = document.createElement('th');
  subjectHead.scope = 'col';
  subjectHead.textContent = 'Materia';
  headRow.append(subjectHead);
  metrics.forEach(definition => {
    const head = document.createElement('th');
    head.scope = 'col';
    head.className = `metric-head ${definition.className}`;
    head.textContent = definition.shortLabel;
    headRow.append(head);
  });
  if (isCurrentPeriod) {
    const head = document.createElement('th');
    head.scope = 'col';
    head.className = 'status-head';
    head.textContent = 'Estado';
    headRow.append(head);
  }
  document.querySelector('#demand-table-head').replaceChildren(headRow);
  document.querySelector('#demand-table-body').replaceChildren(
    ...period.demanda.map(item => createDemandRow(item, period, metrics, isCurrentPeriod))
  );
  renderDemandDetail(period);
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

  renderDemand(period);

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
