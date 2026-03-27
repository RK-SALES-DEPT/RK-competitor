// ╔══════════════════════════════════════════════════════════════════════╗
// ║  data.js — ЕДИНСТВЕННЫЙ файл с данными                              ║
// ║  Менять данные нужно только здесь.                                   ║
// ║  Интерфейс (script.js) читает этот файл и рендерит страницу сама.   ║
// ╚══════════════════════════════════════════════════════════════════════╝


// ─────────────────────────────────────────────────────────────────────────
//  НАЗВАНИЯ ПАРАМЕТРОВ (paramMeta)
//
//  Сопоставляет технический id параметра с человекочитаемым названием.
//  ► Переименовать параметр  →  изменить значение здесь.
//  ► Добавить новый параметр →  добавить строку сюда + id в нужную секцию.
// ─────────────────────────────────────────────────────────────────────────
const paramMeta = {
  // Базовые условия
  rf_cards:       "Карты РФ",
  foreign_cards:  "Иностранные карты",
  sbp:            "СБП",

  // Способы оплаты
  mirpay:         "MirPay",
  sberpay:        "SberPay",
  tpay:           "T-Pay",
  mtcpay:         "МТС Pay",
  alfapay:        "Альфа Pay",
  gazprompay:     "Газпром Pay",
  yandexpay:      "Yandex Pay",
  yandex_split:   "Яндекс Сплит",

  // BNPL / Рассрочка
  bnpl:           "BNPL (Долями)",
  mokka:          "Мокка",
  installment:    "Рассрочка",
  credit:         "Кредит",

  // Рекурренты / Холдирование
  hold:           "Холдирование",
  recurrents:     "Рекуррентные платежи",
  card_binding:   "Привязка карты",
  smz:            "Работа с СМЗ",

  // Фискализация
  fiscal_54fz:    "Чеки по 54-ФЗ",
  fiscal_smz:     "Чеки для СМЗ",
};


// ─────────────────────────────────────────────────────────────────────────
//  СЕКЦИИ И ПОРЯДОК ПАРАМЕТРОВ
//
//  ► Изменить порядок секций  →  переставить объекты в массиве.
//  ► Добавить секцию          →  добавить { id, title, params: [...] }.
//  ► Изменить порядок строк   →  переставить id внутри params[].
//  ► Добавить параметр в секцию → добавить его id в нужный params[].
// ─────────────────────────────────────────────────────────────────────────
const sections = [
  {
    id:     "tariffs",
    title:  "Базовые условия",
    params: ["rf_cards", "foreign_cards", "sbp"],
  },
  {
    id:     "payments",
    title:  "Способы оплаты",
    params: ["mirpay", "sberpay", "tpay", "mtcpay", "alfapay", "gazprompay", "yandexpay", "yandex_split"],
  },
  {
    id:     "bnpl",
    title:  "BNPL / Рассрочка / Кредиты",
    params: ["bnpl", "mokka", "installment", "credit"],
  },
  {
    id:     "recurrents",
    title:  "Рекурренты / Холдирование",
    params: ["hold", "recurrents", "card_binding", "smz"],
  },
  {
    id:     "fiscal",
    title:  "Фискализация / 54-ФЗ",
    params: ["fiscal_54fz", "fiscal_smz"],
  },
];


// ─────────────────────────────────────────────────────────────────────────
//  ПРОВАЙДЕРЫ: Robokassa + конкуренты
//
//  isPrimary: true  →  Robokassa, всегда слева. Не трогать.
//
//  ╔══ КАК ДОБАВИТЬ НОВОГО КОНКУРЕНТА ════════════════════════════════╗
//  ║  1. Скопируй один объект-конкурент ниже                          ║
//  ║  2. Смени id, name, highlights[] и значения params{}             ║
//  ║  3. Сохрани файл — конкурент появится в dropdown автоматически   ║
//  ╚══════════════════════════════════════════════════════════════════╝
//
//  ТИПЫ ЗНАЧЕНИЙ (поле v):
//    "yes"      →  ✓ Есть           (зелёный)
//    "no"       →  ✗ Нет            (красный)
//    "partial"  →  ≈ Частично       (жёлтый)
//    "partner"  →  ↗ Через партнёра (синий)
//    "request"  →  По запросу       (серый)
//    "soon"     →  Скоро            (серый)
//    "unknown"  →  —                (нет данных, muted)
//    любая строка → выводится как текст (для тарифов, например "3,7%")
//
//  ПОЛЕ note (необязательное): короткий комментарий под значением.
//
//  ПОЛЕ highlights (только у конкурентов):
//    Массив строк — ключевые тезисы «Robokassa vs этот конкурент».
//    Выводится в блоке сверху. Если пустой — блок не показывается.
// ─────────────────────────────────────────────────────────────────────────
const providers = [

  // ════════════════════════════════════════════════════════════
  //  ROBOKASSA — первичный провайдер (isPrimary: true)
  //  Всегда слева. Не удалять, isPrimary не менять.
  // ════════════════════════════════════════════════════════════
  {
    id:        "robokassa",
    name:      "Robokassa",
    isPrimary: true,
    highlights: [],
    params: {
      rf_cards:       { v: "3,7% мин. 2,93%" },
      foreign_cards:  { v: "9,9% мин. 3,4%" },
      sbp:            { v: "0,4–0,7%" },
      mirpay:         { v: "yes" },
      sberpay:        { v: "yes" },
      tpay:           { v: "yes" },
      mtcpay:         { v: "yes" },
      alfapay:        { v: "yes" },
      gazprompay:     { v: "soon" },
      yandexpay:      { v: "yes" },
      yandex_split:   { v: "no" },
      bnpl:           { v: "no" },
      mokka:          { v: "partner", note: "Через Мокка" },
      installment:    { v: "partner", note: "ОТП Банк" },
      credit:         { v: "partner", note: "ОТП Банк" },
      hold:           { v: "yes" },
      recurrents:     { v: "yes" },
      card_binding:   { v: "yes" },
      smz:            { v: "yes" },
      fiscal_54fz:    { v: "yes",     note: "Робочеки — включено в тариф" },
      fiscal_smz:     { v: "yes" },
    },
  },

  // ════════════════════════════════════════════════════════════
  //  ЮКасса
  // ════════════════════════════════════════════════════════════
  {
    id:        "yookassa",
    name:      "ЮКасса",
    isPrimary: false,
    highlights: [
      "MTCPay, AlfaPay, Газпром Pay — есть у Robokassa, у ЮКасса нет",
      "Привязка карты — есть у Robokassa, у ЮКасса отсутствует",
      "Фискализация без доп. комиссии — у Robokassa включена в тариф, у ЮКасса взимается отдельно",
      "Яндекс Сплит — есть у ЮКасса, у Robokassa пока не представлен",
    ],
    params: {
      rf_cards:       { v: "3,5% мин. 2,8%" },
      foreign_cards:  { v: "unknown" },
      sbp:            { v: "0,49–0,85%" },
      mirpay:         { v: "yes" },
      sberpay:        { v: "yes" },
      tpay:           { v: "yes" },
      mtcpay:         { v: "no" },
      alfapay:        { v: "no" },
      gazprompay:     { v: "no" },
      yandexpay:      { v: "yes" },
      yandex_split:   { v: "yes" },
      bnpl:           { v: "partner", note: "Долями до 200 000 ₽" },
      mokka:          { v: "no" },
      installment:    { v: "partner", note: "Покупай со Сбером" },
      credit:         { v: "partner", note: "Покупай со Сбером" },
      hold:           { v: "yes" },
      recurrents:     { v: "yes" },
      card_binding:   { v: "no" },
      smz:            { v: "yes" },
      fiscal_54fz:    { v: "partial", note: "Чеки ЮКасса — доп. комиссия поверх тарифа" },
      fiscal_smz:     { v: "yes" },
    },
  },

  // ════════════════════════════════════════════════════════════
  //  Prodamus
  // ════════════════════════════════════════════════════════════
  {
    id:        "prodamus",
    name:      "Prodamus",
    isPrimary: false,
    highlights: [
      "Холдирование — есть у Robokassa, у Prodamus отсутствует",
      "Фискализация (54-ФЗ) — у Prodamus не поддерживается",
      "AlfaPay, MTCPay, Газпром Pay, Yandex Pay — только у Robokassa",
      "Рассрочка у Prodamus доступна через несколько партнёров (Сбер, Т-Банк, ОТП)",
    ],
    params: {
      rf_cards:       { v: "3,5% мин. 2,9%" },
      foreign_cards:  { v: "unknown" },
      sbp:            { v: "1,7%" },
      mirpay:         { v: "yes" },
      sberpay:        { v: "yes" },
      tpay:           { v: "yes" },
      mtcpay:         { v: "no" },
      alfapay:        { v: "no" },
      gazprompay:     { v: "no" },
      yandexpay:      { v: "no" },
      yandex_split:   { v: "no" },
      bnpl:           { v: "no" },
      mokka:          { v: "no" },
      installment:    { v: "partner", note: "Частями Сбер до 150 000 ₽, Т-Банк Кредит, ОТП" },
      credit:         { v: "partner", note: "Т-Банк Кредит" },
      hold:           { v: "no" },
      recurrents:     { v: "yes" },
      card_binding:   { v: "no" },
      smz:            { v: "yes" },
      fiscal_54fz:    { v: "no" },
      fiscal_smz:     { v: "yes" },
    },
  },

  // ════════════════════════════════════════════════════════════
  //  CloudPayments
  // ════════════════════════════════════════════════════════════
  {
    id:        "cloudpayments",
    name:      "CloudPayments",
    isPrimary: false,
    highlights: [
      "Фискализация у CloudPayments платная: +1,5% на операцию + 1 500 ₽/год — у Robokassa включена в тариф",
      "Работа с СМЗ — есть у Robokassa, у CloudPayments отсутствует",
      "Комиссия на картах РФ у CloudPayments выше (мин. 3,4% против 2,93%)",
      "Газпром Pay у CloudPayments подключён сейчас, у Robokassa — в ближайшее время",
    ],
    params: {
      rf_cards:       { v: "3,8% мин. 3,4%" },
      foreign_cards:  { v: "unknown" },
      sbp:            { v: "0,4–0,7%" },
      mirpay:         { v: "yes" },
      sberpay:        { v: "yes" },
      tpay:           { v: "yes" },
      mtcpay:         { v: "yes" },
      alfapay:        { v: "yes" },
      gazprompay:     { v: "yes" },
      yandexpay:      { v: "yes" },
      yandex_split:   { v: "no" },
      bnpl:           { v: "partner", note: "Долями до 200 000 ₽" },
      mokka:          { v: "no" },
      installment:    { v: "partner", note: "Т-Банк Кредит" },
      credit:         { v: "partner", note: "Т-Банк Кредит" },
      hold:           { v: "yes" },
      recurrents:     { v: "yes" },
      card_binding:   { v: "yes" },
      smz:            { v: "no" },
      fiscal_54fz:    { v: "partial", note: "+1,5% поверх операции + 1 500 ₽/год" },
      fiscal_smz:     { v: "yes" },
    },
  },

  // ════════════════════════════════════════════════════════════
  //  GetCourse
  // ════════════════════════════════════════════════════════════
  {
    id:        "getcourse",
    name:      "GetCourse",
    isPrimary: false,
    highlights: [
      "GetCourse — платформа для онлайн-курсов, не платёжный шлюз: тариф от 4,27% против 3,7% у Robokassa",
      "Практически нет дополнительных wallet-методов (MirPay, SberPay и др. не поддерживаются)",
      "Нет фискализации, рекуррентов, холдирования и привязки карты",
      "Минимальная гибкость интеграции — продукт заточен исключительно под онлайн-обучение",
    ],
    params: {
      rf_cards:       { v: "4,27% мин. 3,05%" },
      foreign_cards:  { v: "11% (13,42% с НДС)" },
      sbp:            { v: "от 2,7%" },
      mirpay:         { v: "no" },
      sberpay:        { v: "no" },
      tpay:           { v: "unknown" },
      mtcpay:         { v: "no" },
      alfapay:        { v: "unknown" },
      gazprompay:     { v: "no" },
      yandexpay:      { v: "unknown" },
      yandex_split:   { v: "no" },
      bnpl:           { v: "no" },
      mokka:          { v: "no" },
      installment:    { v: "no" },
      credit:         { v: "no" },
      hold:           { v: "no" },
      recurrents:     { v: "no" },
      card_binding:   { v: "no" },
      smz:            { v: "no" },
      fiscal_54fz:    { v: "no" },
      fiscal_smz:     { v: "no" },
    },
  },

  // ════════════════════════════════════════════════════════════
  //  Т-Банк
  // ════════════════════════════════════════════════════════════
  {
    id:        "tbank",
    name:      "Т-Банк",
    isPrimary: false,
    highlights: [
      "Т-Банк — монобанк: из всех wallet-методов доступен только T-Pay",
      "Нет СБП, нет иностранных карт, нет альтернативных методов оплаты",
      "Нет фискализации, рекуррентов, холдирования и привязки карты",
      "Robokassa обеспечивает значительно более широкий функциональный охват",
    ],
    params: {
      rf_cards:       { v: "2,99–3,64% / 2,49–3,03%" },
      foreign_cards:  { v: "no" },
      sbp:            { v: "no" },
      mirpay:         { v: "no" },
      sberpay:        { v: "no" },
      tpay:           { v: "yes" },
      mtcpay:         { v: "no" },
      alfapay:        { v: "no" },
      gazprompay:     { v: "no" },
      yandexpay:      { v: "no" },
      yandex_split:   { v: "no" },
      bnpl:           { v: "no" },
      mokka:          { v: "no" },
      installment:    { v: "no" },
      credit:         { v: "no" },
      hold:           { v: "no" },
      recurrents:     { v: "no" },
      card_binding:   { v: "no" },
      smz:            { v: "no" },
      fiscal_54fz:    { v: "no" },
      fiscal_smz:     { v: "no" },
    },
  },

  // ════════════════════════════════════════════════════════════
  //  ШАБЛОН ДЛЯ НОВОГО КОНКУРЕНТА
  //  Раскомментируй, заполни и сохрани файл.
  // ════════════════════════════════════════════════════════════
  // {
  //   id:        "new_competitor",           // уникальный id, латиницей
  //   name:      "Название конкурента",
  //   isPrimary: false,
  //   highlights: [
  //     "Первое ключевое отличие в пользу Robokassa",
  //     "Второе ключевое отличие",
  //   ],
  //   params: {
  //     rf_cards:       { v: "3,5%" },
  //     foreign_cards:  { v: "unknown" },
  //     sbp:            { v: "yes" },
  //     mirpay:         { v: "no" },
  //     sberpay:        { v: "no" },
  //     tpay:           { v: "no" },
  //     mtcpay:         { v: "no" },
  //     alfapay:        { v: "no" },
  //     gazprompay:     { v: "no" },
  //     yandexpay:      { v: "no" },
  //     yandex_split:   { v: "no" },
  //     bnpl:           { v: "no" },
  //     mokka:          { v: "no" },
  //     installment:    { v: "no" },
  //     credit:         { v: "no" },
  //     hold:           { v: "no" },
  //     recurrents:     { v: "no" },
  //     card_binding:   { v: "no" },
  //     smz:            { v: "no" },
  //     fiscal_54fz:    { v: "no" },
  //     fiscal_smz:     { v: "no" },
  //   },
  // },

];
