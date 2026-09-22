const demandModel = window.DEMANDA_INSTITUCIONAL_SIMULADA;
const simulatedData = window.DATOS_SIMULADOS;
const periodSelect = document.querySelector('#period-select');
const previousButton = document.querySelector('#period-prev');
const nextButton = document.querySelector('#period-next');
const announcements = document.querySelector('#announcements');
const expandedEvaluations = new Map();
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

function slotsOverlap(first, second) {
  return first.dia === second.dia && first.desde < second.hasta && second.desde < first.hasta;
}

function roomIsAvailableForSection(room, section, period, data) {
  const otherCurrentSections = data.catedras.filter(candidate => candidate.periodo === period.etiqueta
    && candidate.id !== section.catedraId && candidate.aulaId === room.id);
  const sectionOffer = data.catedras.find(candidate => candidate.id === section.catedraId && candidate.periodo === period.etiqueta);
  return !otherCurrentSections.some(other => sectionOffer.franjas.some(slot => other.franjas.some(otherSlot => slotsOverlap(slot, otherSlot))));
}

function compareClassrooms(left, right) {
  return left.capacidad - right.capacidad || (left.id < right.id ? -1 : left.id > right.id ? 1 : 0);
}

function evaluateSubjectResolution(item, period, data = simulatedData) {
  const outsideCapacityStudents = item.alumnosInscriptosFueraDeCupo;
  const evaluations = item.secciones.map(section => {
    const currentRoom = data.aulas.find(room => room.id === section.aulaId);
    const requiredCapacity = section.alumnosInscriptosAsignados + outsideCapacityStudents;
    const compatibleClassrooms = data.aulas
      .filter(room => room.id !== section.aulaId && room.tipo === currentRoom.tipo && room.capacidad >= requiredCapacity)
      .filter(room => roomIsAvailableForSection(room, section, period, data))
      .sort(compareClassrooms);
    const classroom = compatibleClassrooms[0] || null;

    return {
      section,
      currentRoom,
      requiredCapacity,
      classroom,
      incorporableStudents: classroom
        ? Math.min(outsideCapacityStudents, classroom.capacidad - section.alumnosInscriptosAsignados)
        : 0
    };
  });
  const compatibleEvaluations = evaluations.filter(evaluation => evaluation.classroom)
    .sort((left, right) => compareClassrooms(left.classroom, right.classroom)
      || (left.section.catedraId < right.section.catedraId ? -1 : left.section.catedraId > right.section.catedraId ? 1 : 0));

  return compatibleEvaluations[0]
    ? { status: 'compatible', ...compatibleEvaluations[0] }
    : { status: 'no-compatible-classroom' };
}

window.CU13_EVALUATION = { evaluateSubjectResolution, slotsOverlap };

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

  if (item.alumnosInscriptosFueraDeCupo > 0) {
    const pending = document.createElement('p');
    pending.className = 'pending-assignment';
    pending.textContent = `${item.alumnosInscriptosFueraDeCupo} alumnos fuera de cupo pendientes de asignación a una sección.`;
    sectionBlock.append(title, list, pending);
  } else {
    sectionBlock.append(title, list);
  }
  return sectionBlock;
}

function createEvaluationResult(item, evaluation) {
  const resultId = `evaluation-result-${item.materiaId}`;
  const result = document.createElement('section');
  result.id = resultId;
  result.className = 'evaluation-result';
  result.setAttribute('aria-labelledby', `${resultId}-title`);
  result.setAttribute('aria-live', 'polite');
  const title = document.createElement('h4');
  title.id = `${resultId}-title`;
  title.textContent = 'Resultado de evaluación';
  result.append(title);

  if (evaluation.status === 'no-compatible-classroom') {
    const message = document.createElement('p');
    message.textContent = 'No se encontró un aula compatible para las secciones evaluadas. La evaluación de una nueva sección corresponde al CU-11.';
    result.append(message);
    return result;
  }

  const details = document.createElement('dl');
  details.className = 'evaluation-details';
  [
    ['Sección evaluada', evaluation.section.catedraId],
    ['Aula actual', `${evaluation.currentRoom.nombre} · Capacidad: ${evaluation.currentRoom.capacidad}`],
    ['Aula compatible', `${evaluation.classroom.nombre} · Capacidad: ${evaluation.classroom.capacidad}`],
    ['Capacidad requerida', evaluation.requiredCapacity],
    ['Estudiantes incorporables', evaluation.incorporableStudents]
  ].forEach(([label, value]) => {
    const term = document.createElement('dt');
    term.textContent = label;
    const description = document.createElement('dd');
    description.textContent = value;
    details.append(term, description);
  });
  const explanation = document.createElement('p');
  explanation.className = 'evaluation-explanation';
  explanation.textContent = 'Filtros superados: aula distinta, capacidad suficiente, tipo de aula coincidente y disponibilidad en todas las franjas horarias de la sección.';
  result.append(details, explanation);
  return result;
}

function createEvaluationAction(item, period) {
  const resultId = `evaluation-result-${item.materiaId}`;
  const expanded = expandedEvaluations.has(item.materiaId);
  const action = document.createElement('button');
  action.type = 'button';
  action.className = 'evaluation-action';
  action.dataset.evaluateSubject = item.materiaId;
  action.setAttribute('aria-controls', resultId);
  action.setAttribute('aria-expanded', String(expanded));
  action.textContent = 'Evaluar resolución';
  action.addEventListener('click', () => {
    const evaluation = evaluateSubjectResolution(item, period);
    if (expandedEvaluations.has(item.materiaId)) {
      expandedEvaluations.delete(item.materiaId);
      announcements.textContent = `Resultado de evaluación oculto para ${item.materiaId}.`;
    } else {
      expandedEvaluations.set(item.materiaId, evaluation);
      announcements.textContent = evaluation.status === 'compatible'
        ? `Resultado de evaluación disponible para ${item.materiaId}: sección ${evaluation.section.catedraId}, aula compatible ${evaluation.classroom.nombre}.`
        : `Resultado de evaluación disponible para ${item.materiaId}: no se encontró un aula compatible.`;
    }
    renderPeriod();
    document.querySelector(`[data-evaluate-subject="${item.materiaId}"]`)?.focus();
  });
  return action;
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
  if (isCurrentPeriod) card.append(createSectionDetails(item));
  if (hasOutsideCapacity) {
    card.append(createEvaluationAction(item, period));
    const evaluation = expandedEvaluations.get(item.materiaId);
    if (evaluation) card.append(createEvaluationResult(item, evaluation));
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

function renderPeriod({ announce = false } = {}) {
  const period = currentPeriod();
  document.querySelector('#period-kind').textContent = period.tipo;
  periodSelect.value = String(periodIndex);
  previousButton.disabled = periodIndex === 0;
  nextButton.disabled = periodIndex === demandModel.periodos.length - 1;

  renderSummary(period);
  document.querySelector('#outside-capacity-key').hidden = period.tipo !== 'Período actual';

  const demandList = document.querySelector('#demand-list');
  demandList.replaceChildren(...period.demanda.map(item => createDemandCard(item, period)));

  if (announce) {
    const total = totalFor(period, 'total');
    announcements.textContent = period.tipo === 'Período actual'
      ? `${period.tipo}: ${period.etiqueta}. ${period.demanda.length} materias consultadas; total ${total}: ${totalFor(period, 'alumnosInscriptos')} alumnos inscriptos y ${totalFor(period, 'alumnosInscriptosFueraDeCupo')} alumnos inscriptos fuera de cupo.`
      : `${period.tipo}: ${period.etiqueta}. ${period.demanda.length} materias consultadas; total ${total} de demanda futura.`;
  }
}

function setPeriod(nextIndex, announce = true) {
  const boundedIndex = Math.max(0, Math.min(demandModel.periodos.length - 1, nextIndex));
  if (boundedIndex !== periodIndex) expandedEvaluations.clear();
  periodIndex = boundedIndex;
  renderPeriod({ announce });
}

function populatePeriodOptions() {
  demandModel.periodos.forEach((period, index) => {
    const option = document.createElement('option');
    option.value = String(index);
    option.textContent = `${period.tipo} · ${period.etiqueta}`;
    periodSelect.append(option);
  });
}

assertDemandModel(demandModel);
assertEvaluationData(simulatedData, demandModel);
populatePeriodOptions();
renderPeriod();
previousButton.addEventListener('click', () => setPeriod(periodIndex - 1));
nextButton.addEventListener('click', () => setPeriod(periodIndex + 1));
periodSelect.addEventListener('change', event => setPeriod(Number(event.target.value)));

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
