// ╔══════════════════════════════════════════════════════════════════════╗
// ║  data.js — ЕДИНСТВЕННЫЙ файл с данными                              ║
// ║  Интерфейс читает его и строит страницу автоматически.              ║
// ║  Менять нужно только этот файл.                                      ║
// ╚══════════════════════════════════════════════════════════════════════╝


// ─────────────────────────────────────────────────────────────────────────
//  ЧЕЛОВЕКОЧИТАЕМЫЕ НАЗВАНИЯ ПАРАМЕТРОВ
//  ► Переименовать параметр → изменить значение здесь
//  ► Добавить новый параметр → добавить строку здесь + id в секцию ниже
// ─────────────────────────────────────────────────────────────────────────
const paramMeta = {
  rf_cards:      "Карты РФ",
  foreign_cards: "Иностранные карты",
  sbp:           "СБП",
  pay_methods:   "Pay-методы (комиссия)",
  mirpay:        "MirPay",
  sberpay:       "SberPay",
  tpay:          "T-Pay",
  mtcpay:        "МТС Pay",
  alfapay:       "Альфа Pay",
  gazprompay:    "Газпром Pay",
  yandexpay:     "Yandex Pay",
  yandex_split:  "Яндекс Сплит",
  bnpl:          "BNPL (Долями / Подели)",
  installment:   "Рассрочка",
  credit:        "Кредит",
  hold:          "Холдирование",
  recurrents:    "Рекуррентные платежи",
  card_binding:  "Привязка карты",
  smz:           "Работа с СМЗ",
  fiscal_54fz:   "Чеки по 54-ФЗ",
  fiscal_smz:    "Чеки для СМЗ",
};


// ─────────────────────────────────────────────────────────────────────────
//  СЕКЦИИ И ПОРЯДОК ПАРАМЕТРОВ
//  ► Изменить порядок секций → переставить объекты
//  ► Добавить секцию → { id, title, params: ["id1", "id2", ...] }
//  ► Изменить порядок строк → переставить id внутри params[]
// ─────────────────────────────────────────────────────────────────────────
const sections = [
  {
    id:     "tariffs",
    title:  "Базовые условия",
    params: ["rf_cards", "foreign_cards", "sbp", "pay_methods"],
  },
  {
    id:     "payments",
    title:  "Способы оплаты",
    params: ["mirpay", "sberpay", "tpay", "mtcpay", "alfapay", "gazprompay", "yandexpay", "yandex_split"],
  },
  {
    id:     "bnpl",
    title:  "BNPL / Рассрочка / Кредиты",
    params: ["bnpl", "installment", "credit"],
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
//  ПРОВАЙДЕРЫ
//
//  isPrimary: true → Robokassa, всегда слева. Не трогать.
//
//  ╔══ КАК ДОБАВИТЬ НОВОГО КОНКУРЕНТА ══════════════════════════════════╗
//  ║  1. Скопируй шаблон в конце файла                                  ║
//  ║  2. Заполни id, name, highlights[] и params{}                      ║
//  ║  3. Сохрани — конкурент появится в dropdown автоматически          ║
//  ╚════════════════════════════════════════════════════════════════════╝
//
//  ТИПЫ ЗНАЧЕНИЙ (поле v):
//    "yes"     → ✓ Есть           (зелёный)
//    "no"      → ✗ Нет            (красный)
//    "partial" → ≈ Частично       (жёлтый)
//    "partner" → ↗ Через партнёра (синий)
//    "request" → По запросу       (серый)
//    "soon"    → Скоро            (серый)
//    "unknown" → —  Нет данных    (приглушённый)
//    строка    → текст как есть   (тарифы, проценты и т.д.)
//
//  ПОЛЕ note (необязательное): короткий комментарий под значением.
//  ПОЛЕ highlights[]: ключевые тезисы для блока «Чем отличаемся».
// ─────────────────────────────────────────────────────────────────────────
const providers = [

  // ══════════════════════════════════════════════════════════════
  //  ROBOKASSA — первичный провайдер. isPrimary не менять.
  // ══════════════════════════════════════════════════════════════
  {
    id:        "robokassa",
    name:      "Robokassa",
    isPrimary: true,
    highlights: [],
    params: {
      rf_cards:      { v: "3,7% мин. 2,9%" },
      foreign_cards: { v: "9,9%" },
      sbp:           { v: "от 2,7% мин. 1,8%", note: "Лимит 1 млрд ₽" },
      pay_methods:   { v: "Как карты", note: "AlfaPay +0,3%, Yandex Pay +1,9%" },
      mirpay:        { v: "yes" },
      sberpay:       { v: "yes" },
      tpay:          { v: "yes" },
      mtcpay:        { v: "yes" },
      alfapay:       { v: "yes" },
      gazprompay:    { v: "soon" },
      yandexpay:     { v: "yes" },
      yandex_split:  { v: "yes" },
      bnpl:          { v: "yes", note: "Подели, Мокка" },
      installment:   { v: "partner", note: "ОТП Банк" },
      credit:        { v: "partner", note: "ОТП Банк" },
      hold:          { v: "yes" },
      recurrents:    { v: "yes" },
      card_binding:  { v: "yes" },
      smz:           { v: "yes" },
      fiscal_54fz:   { v: "yes", note: "Робочеки — включено в тариф" },
      fiscal_smz:    { v: "yes" },
    },
  },

  // ══════════════════════════════════════════════════════════════
  //  ЮКасса
  // ══════════════════════════════════════════════════════════════
  {
    id:        "yookassa",
    name:      "ЮКасса",
    isPrimary: false,
    highlights: [
      "Фискализация у ЮКасса — отдельная комиссия поверх тарифа; у Robokassa Робочеки включены в тариф",
      "МТС Pay, Альфа Pay, Газпром Pay — есть у Robokassa, у ЮКасса не подключены",
      "Привязка карты — есть у Robokassa, у ЮКасса отсутствует",
      "СБП у ЮКасса дороже: от 0,49–0,85% против 0,4–0,7% у Robokassa; лимит 700К",
    ],
    params: {
      rf_cards:      { v: "3,5% мин. 2,8%", note: "4,27% с НДС" },
      foreign_cards: { v: "4,0% мин. 3,4%", note: "4,88% с НДС" },
      sbp:           { v: "0,49–0,85%", note: "Лимит 700 000 ₽" },
      pay_methods:   { v: "Как карты", note: "T-Pay +3,8%" },
      mirpay:        { v: "yes" },
      sberpay:       { v: "yes" },
      tpay:          { v: "yes" },
      mtcpay:        { v: "no" },
      alfapay:       { v: "no" },
      gazprompay:    { v: "no" },
      yandexpay:     { v: "no" },
      yandex_split:  { v: "yes" },
      bnpl:          { v: "partner", note: "Плати Частями от Сбер до 150 000 ₽" },
      installment:   { v: "partner", note: "Покупай со Сбером" },
      credit:        { v: "partner", note: "Покупай со Сбером" },
      hold:          { v: "yes" },
      recurrents:    { v: "yes" },
      card_binding:  { v: "no" },
      smz:           { v: "yes" },
      fiscal_54fz:   { v: "partial", note: "Чеки от ЮКасса — доп. комиссия поверх тарифа" },
      fiscal_smz:    { v: "no" },
    },
  },

  // ══════════════════════════════════════════════════════════════
  //  Prodamus
  // ══════════════════════════════════════════════════════════════
  {
    id:        "prodamus",
    name:      "Prodamus",
    isPrimary: false,
    highlights: [
      "Фискализация (54-ФЗ) — у Prodamus не поддерживается, у Robokassa включена в тариф",
      "Холдирование — есть у Robokassa, у Prodamus отсутствует",
      "СБП у Prodamus дороже: от 3,8% против 0,4–0,7% у Robokassa",
      "МТС Pay, Альфа Pay, Газпром Pay — только у Robokassa",
    ],
    params: {
      rf_cards:      { v: "3,8% мин. 2,9%" },
      foreign_cards: { v: "10%" },
      sbp:           { v: "от 3,8%", note: "Как карты" },
      pay_methods:   { v: "+0,3% к картам" },
      mirpay:        { v: "no" },
      sberpay:       { v: "yes" },
      tpay:          { v: "yes" },
      mtcpay:        { v: "no" },
      alfapay:       { v: "no" },
      gazprompay:    { v: "no" },
      yandexpay:     { v: "yes" },
      yandex_split:  { v: "no" },
      bnpl:          { v: "partner", note: "Prodamus Частями от 3 500 ₽, Долями до 200 000 ₽, Плати Частями до 150 000 ₽" },
      installment:   { v: "partner", note: "Т-Банк Кредит, ОТП, Директ Кредит, Долями+, ПроОнлайн" },
      credit:        { v: "partner", note: "Т-Банк Кредит" },
      hold:          { v: "no" },
      recurrents:    { v: "yes" },
      card_binding:  { v: "no" },
      smz:           { v: "yes" },
      fiscal_54fz:   { v: "no" },
      fiscal_smz:    { v: "yes" },
    },
  },

  // ══════════════════════════════════════════════════════════════
  //  CloudPayments
  // ══════════════════════════════════════════════════════════════
  {
    id:        "cloudpayments",
    name:      "CloudPayments",
    isPrimary: false,
    highlights: [
      "Фискализация у CloudPayments платная: +1,5% на операцию + 1 500 ₽/год; у Robokassa включена",
      "Работа с СМЗ — есть у Robokassa, у CloudPayments отсутствует",
      "Газпром Pay у CloudPayments подключён; у Robokassa — скоро",
      "Яндекс Сплит у CloudPayments есть; у Robokassa — тоже есть",
    ],
    params: {
      rf_cards:      { v: "2,9% мин. 2,5%", note: "4,75% мин. 3,05% с НДС" },
      foreign_cards: { v: "11%", note: "13,42% с НДС" },
      sbp:           { v: "1,7%" },
      pay_methods:   { v: "Как карты" },
      mirpay:        { v: "yes" },
      sberpay:       { v: "yes" },
      tpay:          { v: "yes" },
      mtcpay:        { v: "yes" },
      alfapay:       { v: "yes" },
      gazprompay:    { v: "yes" },
      yandexpay:     { v: "yes" },
      yandex_split:  { v: "yes" },
      bnpl:          { v: "partner", note: "Долями до 200 000 ₽" },
      installment:   { v: "partner", note: "Т-Банк Кредит" },
      credit:        { v: "partner", note: "Т-Банк Кредит" },
      hold:          { v: "yes" },
      recurrents:    { v: "yes" },
      card_binding:  { v: "yes" },
      smz:           { v: "no" },
      fiscal_54fz:   { v: "partial", note: "Cloud-чеки: +1,5% поверх операции + 1 500 ₽/год" },
      fiscal_smz:    { v: "yes" },
    },
  },

  // ══════════════════════════════════════════════════════════════
  //  GetCourse
  // ══════════════════════════════════════════════════════════════
  {
    id:        "getcourse",
    name:      "GetCourse",
    isPrimary: false,
    highlights: [
      "GetCourse — платформа для онлайн-курсов, не полноценный платёжный шлюз",
      "Комиссия на картах выше: от 3,5% против 3,7% у Robokassa, но без ряда возможностей",
      "MirPay, МТС Pay, Газпром Pay, Альфа Pay — у GetCourse не поддерживаются",
      "Холдирование и привязка карты — есть у Robokassa, у GetCourse отсутствуют",
    ],
    params: {
      rf_cards:      { v: "3,5% мин. 1,9%", note: "3,5% мин. 1,9% с НДС" },
      foreign_cards: { v: "10%", note: "10% с НДС" },
      sbp:           { v: "от 3,5%", note: "Как карты" },
      pay_methods:   { v: "Как карты" },
      mirpay:        { v: "no" },
      sberpay:       { v: "yes" },
      tpay:          { v: "yes" },
      mtcpay:        { v: "no" },
      alfapay:       { v: "unknown" },
      gazprompay:    { v: "no" },
      yandexpay:     { v: "yes" },
      yandex_split:  { v: "yes" },
      bnpl:          { v: "partner", note: "Покупай со Сбером, Т-Банк Кредит, POSCREDIT, Фреш кредит, Ресурс Развития" },
      installment:   { v: "partner", note: "Покупай со Сбером, Т-Банк Кредит, POSCREDIT, Фреш кредит, Ресурс Развития" },
      credit:        { v: "partner", note: "Покупай со Сбером, Т-Банк Кредит, Фреш кредит" },
      hold:          { v: "no" },
      recurrents:    { v: "yes" },
      card_binding:  { v: "no" },
      smz:           { v: "yes" },
      fiscal_54fz:   { v: "yes" },
      fiscal_smz:    { v: "yes" },
    },
  },

  // ══════════════════════════════════════════════════════════════
  //  PayKeeper
  // ══════════════════════════════════════════════════════════════
  {
    id:        "paykeeper",
    name:      "PayKeeper",
    isPrimary: false,
    highlights: [
      "PayKeeper — агрегатор-посредник: итоговая комиссия зависит от банка-эквайера",
      "МТС Pay, Альфа Pay, Газпром Pay, Yandex Pay, Яндекс Сплит — не поддерживаются",
      "BNPL, рассрочка, кредит — отсутствуют полностью",
      "Нет работы с СМЗ; фискализация платная: Т-чеки +1,5% поверх операции",
    ],
    params: {
      rf_cards:      { v: "1,85–2,25%", note: "2,25–2,74% с НДС" },
      foreign_cards: { v: "no" },
      sbp:           { v: "0,4–0,7%" },
      pay_methods:   { v: "unknown", note: "Зависит от банка-эквайера" },
      mirpay:        { v: "yes" },
      sberpay:       { v: "unknown" },
      tpay:          { v: "unknown" },
      mtcpay:        { v: "no" },
      alfapay:       { v: "unknown" },
      gazprompay:    { v: "no" },
      yandexpay:     { v: "no" },
      yandex_split:  { v: "no" },
      bnpl:          { v: "no" },
      installment:   { v: "no" },
      credit:        { v: "no" },
      hold:          { v: "yes" },
      recurrents:    { v: "yes" },
      card_binding:  { v: "yes" },
      smz:           { v: "no" },
      fiscal_54fz:   { v: "partial", note: "Т-чеки: +1,5% поверх операции" },
      fiscal_smz:    { v: "unknown" },
    },
  },

  // ══════════════════════════════════════════════════════════════
  //  Т-Банк
  // ══════════════════════════════════════════════════════════════
  {
    id:        "tbank",
    name:      "Т-Банк",
    isPrimary: false,
    highlights: [
      "Т-Банк — монобанк: из wallet-методов доступен только T-Pay и SberPay",
      "MirPay, МТС Pay, Альфа Pay, Газпром Pay, Yandex Pay — не подключены",
      "Нет работы с СМЗ, нет привязки карты, нет Яндекс Сплит",
      "Фискализация платная: Т-чеки +1,5% поверх операции; у Robokassa включена в тариф",
    ],
    params: {
      rf_cards:      { v: "2,99–3,64%", note: "2,49–3,03% при объёме" },
      foreign_cards: { v: "no" },
      sbp:           { v: "0,4–0,7%" },
      pay_methods:   { v: "Как карты" },
      mirpay:        { v: "no" },
      sberpay:       { v: "yes" },
      tpay:          { v: "yes" },
      mtcpay:        { v: "no" },
      alfapay:       { v: "no" },
      gazprompay:    { v: "no" },
      yandexpay:     { v: "no" },
      yandex_split:  { v: "no" },
      bnpl:          { v: "partner", note: "Долями до 200 000 ₽" },
      installment:   { v: "partner", note: "Т-Банк Кредит" },
      credit:        { v: "partner", note: "Т-Банк Кредит" },
      hold:          { v: "yes" },
      recurrents:    { v: "yes" },
      card_binding:  { v: "no" },
      smz:           { v: "no" },
      fiscal_54fz:   { v: "partial", note: "Т-чеки: +1,5% поверх операции" },
      fiscal_smz:    { v: "unknown" },
    },
  },

  // ══════════════════════════════════════════════════════════════
  //  ШАБЛОН ДЛЯ НОВОГО КОНКУРЕНТА
  //  Раскомментируй, заполни и сохрани.
  // ══════════════════════════════════════════════════════════════
  // {
  //   id:        "new_competitor",
  //   name:      "Название",
  //   isPrimary: false,
  //   highlights: [
  //     "Первое ключевое отличие",
  //     "Второе ключевое отличие",
  //   ],
  //   params: {
  //     rf_cards:      { v: "3,5%" },
  //     foreign_cards: { v: "unknown" },
  //     sbp:           { v: "yes" },
  //     pay_methods:   { v: "Как карты" },
  //     mirpay:        { v: "no" },
  //     sberpay:       { v: "no" },
  //     tpay:          { v: "no" },
  //     mtcpay:        { v: "no" },
  //     alfapay:       { v: "no" },
  //     gazprompay:    { v: "no" },
  //     yandexpay:     { v: "no" },
  //     yandex_split:  { v: "no" },
  //     bnpl:          { v: "no" },
  //     installment:   { v: "no" },
  //     credit:        { v: "no" },
  //     hold:          { v: "no" },
  //     recurrents:    { v: "no" },
  //     card_binding:  { v: "no" },
  //     smz:           { v: "no" },
  //     fiscal_54fz:   { v: "no" },
  //     fiscal_smz:    { v: "no" },
  //   },
  // },

];
