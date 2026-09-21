const demandModel = window.DEMANDA_INSTITUCIONAL_SIMULADA;
const periodSelect = document.querySelector('#period-select');
const previousButton = document.querySelector('#period-prev');
const nextButton = document.querySelector('#period-next');
const announcements = document.querySelector('#announcements');
let periodIndex = 0;

const categoryDefinitions = [
  { key: 'total', label: 'Demanda total', className: 'total' },
  { key: 'elegibleActual', label: 'Elegible período actual', className: 'eligible' },
  { key: 'condicionalSiguiente', label: 'Condicional período siguiente', className: 'conditional' },
  { key: 'planificadaSinCupo', label: 'Planificada por falta de capacidad', className: 'no-capacity' }
];

function assertDemandModel(model) {
  if (!model?.simulado || !Array.isArray(model.periodos) || !model.periodos.length) {
    throw new Error('The simulated institutional demand model is unavailable.');
  }

  model.periodos.forEach(period => period.demanda.forEach(item => {
    const components = item.elegibleActual + item.condicionalSiguiente + item.planificadaSinCupo;
    if (item.total !== components) {
      throw new Error(`Inconsistent demand total for ${period.id}/${item.materiaId}.`);
    }
  }));
}

function currentPeriod() {
  return demandModel.periodos[periodIndex];
}

function totalFor(period, key) {
  return period.demanda.reduce((sum, item) => sum + item[key], 0);
}

function createMetric(definition, value) {
  const metric = document.createElement('div');
  metric.className = 'metric';
  const label = document.createElement('dt');
  label.textContent = definition.label;
  const number = document.createElement('dd');
  number.textContent = value;
  metric.append(label, number);
  return metric;
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

function createDemandCard(item) {
  const isUnsatisfied = item.planificadaSinCupo > 0;
  const card = document.createElement('article');
  card.className = `demand-card${isUnsatisfied ? ' is-unsatisfied' : ''}`;
  card.setAttribute('aria-label', `${item.materiaId}, ${item.materia}${isUnsatisfied ? ', con demanda sin satisfacer' : ''}`);

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
  status.textContent = isUnsatisfied ? 'Sin satisfacer' : 'Sin pendiente de cupo';
  header.append(titleGroup, status);

  const categories = document.createElement('dl');
  categories.className = 'category-list';
  categoryDefinitions.forEach(definition => categories.append(createCategoryRow(definition, item)));

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
  card.append(header, categories, causes);
  return card;
}

function renderPeriod({ announce = false } = {}) {
  const period = currentPeriod();
  document.querySelector('#period-kind').textContent = period.tipo;
  document.querySelector('#summary-period').textContent = period.etiqueta;
  periodSelect.value = String(periodIndex);
  previousButton.disabled = periodIndex === 0;
  nextButton.disabled = periodIndex === demandModel.periodos.length - 1;

  const metrics = document.querySelector('#summary-metrics');
  metrics.replaceChildren(...categoryDefinitions.map(definition => createMetric(definition, totalFor(period, definition.key))));

  const demandList = document.querySelector('#demand-list');
  demandList.replaceChildren(...period.demanda.map(createDemandCard));

  if (announce) {
    const unresolved = totalFor(period, 'planificadaSinCupo');
    announcements.textContent = `${period.tipo}: ${period.etiqueta}. ${period.demanda.length} materias consultadas; ${unresolved} planificaciones por falta de capacidad.`;
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
