// ═══════════════════════════════════════════════════════════════
//  script.js — логика рендера
//  Данные здесь не трогать. Всё редактируется в data.js.
// ═══════════════════════════════════════════════════════════════

const VALUE_LABELS = {
  yes:     "Есть",
  no:      "Нет",
  partial: "Частично",
  partner: "Через партнёра",
  request: "По запросу",
  soon:    "Скоро",
};
const VALUE_ICONS = {
  yes:     "✓",
  no:      "✕",
  partial: "≈",
  partner: "↗",
  request: "···",
  soon:    "◷",
};
const VALUE_CHIP = {
  yes:     "chip--yes",
  no:      "chip--no",
  partial: "chip--partial",
  partner: "chip--partner",
  request: "chip--request",
  soon:    "chip--soon",
};

const primary        = providers.find(p => p.isPrimary);
const competitorList = providers.filter(p => !p.isPrimary);

let currentCompetitor = competitorList[0] || null;
let currentMode       = 'all'; // 'all' | 'diff'


// ─── Старт ───────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  if (!primary) { console.error('data.js: нет провайдера с isPrimary: true'); return; }
  fillSelect();
  bindControls();
  render();
});


// ─── Заполнить dropdown ──────────────────────────────────────
function fillSelect() {
  const sel = document.getElementById('competitor-select');
  competitorList.forEach(c => {
    const o = document.createElement('option');
    o.value = c.id; o.textContent = c.name;
    sel.appendChild(o);
  });
}


// ─── Привязать события ───────────────────────────────────────
function bindControls() {
  document.getElementById('competitor-select').addEventListener('change', e => {
    currentCompetitor = competitorList.find(c => c.id === e.target.value) || competitorList[0];
    render();
  });

  document.getElementById('btn-all').addEventListener('click', () => {
    if (currentMode === 'all') return;
    currentMode = 'all';
    document.getElementById('btn-all').classList.add('active');
    document.getElementById('btn-diff').classList.remove('active');
    applyMode();
  });

  document.getElementById('btn-diff').addEventListener('click', () => {
    if (currentMode === 'diff') return;
    currentMode = 'diff';
    document.getElementById('btn-diff').classList.add('active');
    document.getElementById('btn-all').classList.remove('active');
    applyMode();
  });
}


// ─── Главный рендер ──────────────────────────────────────────
function render() {
  if (!currentCompetitor) return;

  // Обновить имя в шапке
  document.getElementById('ch-competitor-name').textContent = currentCompetitor.name;

  renderHighlights();
  renderSections();
  applyMode();
}


// ─── Ключевые отличия ────────────────────────────────────────
function renderHighlights() {
  const area = document.getElementById('highlights-area');
  const list = (currentCompetitor.highlights || []);

  if (!list.length) { area.innerHTML = ''; area.style.display = 'none'; return; }

  area.style.display = 'block';
  area.innerHTML = `
    <div class="card highlights-card">
      <div class="card-title">Ключевые отличия: Robokassa vs ${esc(currentCompetitor.name)}</div>
      <div class="highlights-list">
        ${list.map(h => `
          <div class="highlight-item">
            <span class="highlight-dot"></span>${esc(h)}
          </div>`).join('')}
      </div>
    </div>`;
}


// ─── Секции сравнения ────────────────────────────────────────
function renderSections() {
  const area = document.getElementById('comparison-area');
  area.innerHTML = '';
  sections.forEach(s => area.appendChild(buildSection(s)));
}

function buildSection(section) {
  const block = document.createElement('div');
  block.className = 'section-block';
  block.dataset.sectionId = section.id;

  block.innerHTML = `
    <div class="section-head">
      <span class="section-head-line"></span>
      <span class="section-head-title">${esc(section.title)}</span>
    </div>`;

  section.params.forEach(paramId => {
    block.appendChild(buildRow(paramId));
  });

  return block;
}

function buildRow(paramId) {
  const pVal = primary.params?.[paramId]          || null;
  const cVal = currentCompetitor.params?.[paramId] || null;
  const diff = !areSame(pVal, cVal);

  const row = document.createElement('div');
  row.className       = 'param-row' + (diff ? ' param-row--diff' : '');
  row.dataset.paramId = paramId;
  row.dataset.same    = diff ? 'false' : 'true';

  const label = (paramMeta && paramMeta[paramId]) ? paramMeta[paramId] : paramId;

  row.innerHTML = `
    <div class="param-label">${esc(label)}</div>
    <div class="param-cell">${renderVal(pVal)}</div>
    <div class="param-cell">${renderVal(cVal)}</div>`;

  return row;
}


// ─── Отображение значения ─────────────────────────────────────
function renderVal(p) {
  const empty = x =>
    !x || x.v === undefined || x.v === null || String(x.v).trim() === '';

  if (empty(p)) return '<span class="val-unknown">—</span>';

  const v    = String(p.v).trim();
  const note = p.note
    ? `<div class="param-cell-note">${esc(p.note)}</div>`
    : '';

  if (v === 'unknown') return '<span class="val-unknown">Нет данных</span>' + note;

  if (VALUE_LABELS[v]) {
    const icon = VALUE_ICONS[v] ? `<em class="chip-icon">${VALUE_ICONS[v]}</em>` : '';
    return `<span class="chip ${VALUE_CHIP[v]}">${icon}${VALUE_LABELS[v]}</span>${note}`;
  }

  return `<span class="val-text">${esc(v)}</span>${note}`;
}


// ─── Применить режим (all / diff) ────────────────────────────
function applyMode() {
  const rows = document.querySelectorAll('.param-row');
  let diffCount = 0;

  rows.forEach(row => {
    const same = row.dataset.same === 'true';
    if (currentMode === 'diff' && same) {
      row.classList.add('param-row--hidden');
    } else {
      row.classList.remove('param-row--hidden');
      if (!same) diffCount++;
    }
  });

  // «Нет отличий» в секции
  document.querySelectorAll('.section-block').forEach(block => {
    block.querySelector('.no-diff-msg')?.remove();
    if (currentMode !== 'diff') return;
    const visible = block.querySelectorAll('.param-row:not(.param-row--hidden)');
    if (!visible.length) {
      const msg = document.createElement('div');
      msg.className = 'no-diff-msg';
      msg.textContent = 'В этой секции условия совпадают';
      block.appendChild(msg);
    }
  });

  // Счётчик
  const counter    = document.getElementById('diff-counter');
  const counterNum = document.getElementById('diff-counter-num');
  if (currentMode === 'diff') {
    counterNum.textContent = diffCount;
    counter.classList.add('visible');
  } else {
    counter.classList.remove('visible');
  }
}


// ─── Сравнение значений ───────────────────────────────────────
function areSame(v1, v2) {
  const empty = x =>
    !x || x.v === undefined || x.v === null || String(x.v).trim() === '';

  if (empty(v1) && empty(v2)) return true;
  if (empty(v1) || empty(v2)) return false;

  const a = String(v1.v).toLowerCase().trim();
  const b = String(v2.v).toLowerCase().trim();

  // «Нет данных» и «Скоро» — всегда отличие
  if (a === 'unknown' || b === 'unknown') return false;
  if (a === 'soon'    || b === 'soon')    return false;

  return a === b;
}


// ─── Экранирование HTML ───────────────────────────────────────
function esc(str) {
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}
