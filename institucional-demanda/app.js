const demandModel = window.DEMANDA_INSTITUCIONAL_SIMULADA;
const periodSelect = document.querySelector('#period-select');
const previousButton = document.querySelector('#period-prev');
const nextButton = document.querySelector('#period-next');
const announcements = document.querySelector('#announcements');
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
  card.append(causes);
  return card;
}

function renderSummary(period) {
  const activeMetrics = new Set(period.metricas);
  metricDefinitions.forEach(definition => {
    const summaryItem = document.querySelector(`[data-metric="${definition.key}"]`);
    const isActive = activeMetrics.has(definition.key);
    summaryItem.hidden = !isActive;
    summaryItem.classList.remove('is-open', 'is-dismissed');
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
  periodIndex = Math.max(0, Math.min(demandModel.periodos.length - 1, nextIndex));
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
populatePeriodOptions();
renderPeriod();
previousButton.addEventListener('click', () => setPeriod(periodIndex - 1));
nextButton.addEventListener('click', () => setPeriod(periodIndex + 1));
periodSelect.addEventListener('change', event => setPeriod(Number(event.target.value)));

const summaryItems = document.querySelectorAll('.summary-item');

function setTooltipState(item, { isOpen, isDismissed = false }) {
  item.classList.toggle('is-open', isOpen);
  item.classList.toggle('is-dismissed', isDismissed);
  item.querySelector('.summary-info').setAttribute('aria-expanded', String(isOpen));
}

function closeOpenTooltips() {
  document.querySelectorAll('.summary-item.is-open').forEach(item => {
    setTooltipState(item, { isOpen: false });
  });
}

summaryItems.forEach(item => {
  const button = item.querySelector('.summary-info');

  button.addEventListener('click', () => {
    const willOpen = !item.classList.contains('is-open');
    closeOpenTooltips();
    setTooltipState(item, { isOpen: willOpen, isDismissed: !willOpen });
  });

  item.addEventListener('pointerleave', () => {
    item.classList.remove('is-dismissed');
  });

  item.addEventListener('focusout', event => {
    if (!item.contains(event.relatedTarget)) {
      item.classList.remove('is-dismissed');
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
    document.querySelectorAll('.summary-item:hover, .summary-item:focus-within, .summary-item.is-open').forEach(item => {
      setTooltipState(item, { isOpen: false, isDismissed: true });
    });
  }
});
