// ═══════════════════════════════════════════════════════════════════════
//  script.js — логика рендера страницы сравнения
//  Данные здесь не трогать. Всё редактируется в data.js.
// ═══════════════════════════════════════════════════════════════════════


// ── Карта отображаемых названий для стандартных типов значений ──
const VALUE_LABELS = {
  yes:     "Есть",
  no:      "Нет",
  partial: "Частично",
  partner: "Через партнёра",
  request: "По запросу",
  soon:    "Скоро",
};

// ── CSS-классы бейджей ──
const VALUE_BADGE = {
  yes:     "badge--yes",
  no:      "badge--no",
  partial: "badge--partial",
  partner: "badge--partner",
  request: "badge--request",
  soon:    "badge--soon",
};

// ── Иконки для бейджей ──
const VALUE_ICONS = {
  yes:     "✓",
  no:      "✕",
  partial: "≈",
  partner: "↗",
  request: "···",
  soon:    "◷",
};


// ── Найти Robokassa (первичный провайдер) ──
const primary = providers.find(p => p.isPrimary);

// ── Список конкурентов (все, кроме Robokassa) ──
const competitorList = providers.filter(p => !p.isPrimary);

// ── Текущее состояние ──
let currentCompetitor = competitorList[0] || null;
let currentMode       = 'all'; // 'all' | 'diff'


// ─────────────────────────────────────────────────────────────────────
//  Инициализация при загрузке страницы
// ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  if (!primary) {
    console.error('data.js: не найден провайдер с isPrimary: true');
    return;
  }
  populateSelect();
  bindControls();
  render();
});


// ─────────────────────────────────────────────────────────────────────
//  Заполнить dropdown конкурентами из data.js
// ─────────────────────────────────────────────────────────────────────
function populateSelect() {
  const select = document.getElementById('competitor-select');
  competitorList.forEach(comp => {
    const opt = document.createElement('option');
    opt.value       = comp.id;
    opt.textContent = comp.name;
    select.appendChild(opt);
  });
}


// ─────────────────────────────────────────────────────────────────────
//  Привязать обработчики кнопок и select
// ─────────────────────────────────────────────────────────────────────
function bindControls() {
  // Смена конкурента
  document.getElementById('competitor-select').addEventListener('change', e => {
    currentCompetitor = competitorList.find(c => c.id === e.target.value) || competitorList[0];
    render();
  });

  // Режим «Все параметры»
  document.getElementById('btn-all').addEventListener('click', () => {
    if (currentMode === 'all') return;
    currentMode = 'all';
    document.getElementById('btn-all').classList.add('active');
    document.getElementById('btn-diff').classList.remove('active');
    applyMode();
  });

  // Режим «Только отличия»
  document.getElementById('btn-diff').addEventListener('click', () => {
    if (currentMode === 'diff') return;
    currentMode = 'diff';
    document.getElementById('btn-diff').classList.add('active');
    document.getElementById('btn-all').classList.remove('active');
    applyMode();
  });
}


// ─────────────────────────────────────────────────────────────────────
//  Главный рендер: пересобирает всю страницу при смене конкурента
// ─────────────────────────────────────────────────────────────────────
function render() {
  if (!currentCompetitor) return;

  // Обновить sticky-шапку
  document.getElementById('header-competitor').textContent = currentCompetitor.name;

  // Рендер блока ключевых отличий
  renderHighlights();

  // Рендер секций сравнения
  renderSections();

  // Применить текущий режим (all / diff)
  applyMode();
}


// ─────────────────────────────────────────────────────────────────────
//  Блок ключевых отличий (highlights)
// ─────────────────────────────────────────────────────────────────────
function renderHighlights() {
  const container = document.getElementById('highlights-area');
  const highlights = (currentCompetitor && currentCompetitor.highlights) || [];

  if (highlights.length === 0) {
    container.innerHTML = '';
    container.style.display = 'none';
    return;
  }

  container.style.display = 'block';
  const items = highlights
    .map(h => `<div class="highlight-item"><span class="highlight-dot"></span>${escHtml(h)}</div>`)
    .join('');

  container.innerHTML = `
    <div class="card highlights-card">
      <h2 class="card-title">Ключевые отличия: Robokassa vs ${escHtml(currentCompetitor.name)}</h2>
      <div class="highlights-list">${items}</div>
    </div>
  `;
}


// ─────────────────────────────────────────────────────────────────────
//  Рендер всех секций сравнения
// ─────────────────────────────────────────────────────────────────────
function renderSections() {
  const area = document.getElementById('comparison-area');
  area.innerHTML = '';

  sections.forEach(section => {
    const card = buildSectionCard(section);
    area.appendChild(card);
  });
}


// ─────────────────────────────────────────────────────────────────────
//  Собрать DOM-элемент карточки секции
// ─────────────────────────────────────────────────────────────────────
function buildSectionCard(section) {
  const card = document.createElement('div');
  card.className     = 'section-card';
  card.dataset.sectionId = section.id;

  // Заголовок секции
  const titleEl = document.createElement('div');
  titleEl.className   = 'section-title';
  titleEl.textContent = section.title;
  card.appendChild(titleEl);

  // Строки параметров
  section.params.forEach(paramId => {
    const row = buildParamRow(paramId);
    card.appendChild(row);
  });

  return card;
}


// ─────────────────────────────────────────────────────────────────────
//  Собрать одну строку параметра
// ─────────────────────────────────────────────────────────────────────
function buildParamRow(paramId) {
  const pVal = (primary.params         && primary.params[paramId])         || null;
  const cVal = (currentCompetitor.params && currentCompetitor.params[paramId]) || null;
  const diff = !valuesAreSame(pVal, cVal);

  const row = document.createElement('div');
  row.className       = 'param-row' + (diff ? ' param-row--diff' : '');
  row.dataset.paramId = paramId;
  // Используется в applyMode() для скрытия/показа строк
  row.dataset.same    = diff ? 'false' : 'true';

  // Колонка 1: название параметра
  const labelEl = document.createElement('div');
  labelEl.className   = 'param-label';
  // paramMeta — из data.js; fallback на id если не задан
  labelEl.textContent = (paramMeta && paramMeta[paramId]) ? paramMeta[paramId] : paramId;
  row.appendChild(labelEl);

  // Колонка 2: значение Robokassa
  const primaryCell = document.createElement('div');
  primaryCell.className = 'value-cell';
  primaryCell.innerHTML = renderValue(pVal);
  row.appendChild(primaryCell);

  // Колонка 3: значение конкурента
  const compCell = document.createElement('div');
  compCell.className = 'value-cell';
  compCell.innerHTML = renderValue(cVal);
  row.appendChild(compCell);

  return row;
}


// ─────────────────────────────────────────────────────────────────────
//  Отображение одного значения → HTML-строка
//
//  Принимает объект { v, note } или null.
//  Поддерживает все типы: yes/no/partial/partner/request/soon/unknown/текст.
// ─────────────────────────────────────────────────────────────────────
function renderValue(paramData) {
  // Пустое / отсутствующее значение
  if (!paramData || paramData.v === undefined || paramData.v === null || paramData.v === '') {
    return '<span class="value-unknown">—</span>';
  }

  const v    = String(paramData.v).trim();
  const note = paramData.note
    ? `<div class="value-note">${escHtml(paramData.note)}</div>`
    : '';

  // "Нет данных"
  if (v === 'unknown') {
    return '<span class="value-unknown">Нет данных</span>' + note;
  }

  // Стандартный тип → бейдж
  if (VALUE_LABELS[v]) {
    const icon    = VALUE_ICONS[v]  ? `<em class="badge__icon">${VALUE_ICONS[v]}</em>` : '';
    const cls     = VALUE_BADGE[v]  || '';
    const label   = VALUE_LABELS[v];
    return `<span class="badge ${cls}">${icon}${label}</span>` + note;
  }

  // Текстовое значение (тарифы, проценты и т.д.)
  return `<span class="value-text">${escHtml(v)}</span>` + note;
}


// ─────────────────────────────────────────────────────────────────────
//  Сравнение двух значений — нужно ли считать их одинаковыми?
//
//  Возвращает true → значения совпадают (строку прятать в режиме diff).
//  Логика нарочно консервативна: любое «нет данных» — это отличие.
// ─────────────────────────────────────────────────────────────────────
function valuesAreSame(v1, v2) {
  const isEmpty = x =>
    !x || x.v === undefined || x.v === null || String(x.v).trim() === '';

  if (isEmpty(v1) && isEmpty(v2)) return true;
  if (isEmpty(v1) || isEmpty(v2)) return false;

  const n1 = String(v1.v).toLowerCase().trim();
  const n2 = String(v2.v).toLowerCase().trim();

  // «Нет данных» всегда считается отличием
  if (n1 === 'unknown' || n2 === 'unknown') return false;

  return n1 === n2;
}


// ─────────────────────────────────────────────────────────────────────
//  Применить режим отображения (all / diff)
//  Вызывается при смене режима и после render()
// ─────────────────────────────────────────────────────────────────────
function applyMode() {
  const rows = document.querySelectorAll('.param-row');
  let diffCount = 0;

  rows.forEach(row => {
    const isSame = row.dataset.same === 'true';
    if (currentMode === 'diff' && isSame) {
      row.classList.add('param-row--same-hidden');
    } else {
      row.classList.remove('param-row--same-hidden');
      if (!isSame) diffCount++;
    }
  });

  // Плашка «нет отличий» в секции, если все строки скрыты
  document.querySelectorAll('.section-card').forEach(card => {
    // Убрать старую плашку (если была)
    const old = card.querySelector('.no-diff-notice');
    if (old) old.remove();

    if (currentMode !== 'diff') return;

    const visible = card.querySelectorAll('.param-row:not(.param-row--same-hidden)');
    if (visible.length === 0) {
      const notice = document.createElement('div');
      notice.className   = 'no-diff-notice';
      notice.textContent = 'В этой секции условия совпадают';
      card.appendChild(notice);
    }
  });

  // Обновить счётчик отличий
  const counter    = document.getElementById('diff-counter');
  const counterNum = document.getElementById('diff-counter-num');
  if (counter && counterNum) {
    if (currentMode === 'diff') {
      counterNum.textContent = diffCount;
      counter.classList.add('visible');
    } else {
      counter.classList.remove('visible');
    }
  }
}


// ─────────────────────────────────────────────────────────────────────
//  Утилита: экранирование HTML-символов (защита от XSS в данных)
// ─────────────────────────────────────────────────────────────────────
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
