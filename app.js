const view = document.getElementById("view");

/* ====== 1) CSV URL (твой) ====== */
const SHEET_URL = "https://docs.google.com/spreadsheets/d/10WpoOiqyf4yTyoPa6ENtt0msHcwAOF9qVF1zFlDesEc/export?format=csv&gid=0";

/* ====== 2) Хранилище данных ====== */
let ITEMS = []; // все строки из таблицы

/* =========================
   CSV LOADER (simple)
========================= */
async function loadData() {
  const res = await fetch(SHEET_URL, { cache: "no-store" });
  const text = await res.text();

  // ⚠️ простой CSV (если в ячейках будут запятые — скажи, сделаю парсер с кавычками)
  const lines = text.trim().split(/\r?\n/);
  const headers = lines[0].split(",").map((h) => h.trim());

  const rows = lines.slice(1).map((line) => {
    const cols = line.split(",");
    const obj = {};
    headers.forEach((h, i) => (obj[h] = (cols[i] ?? "").trim()));
    return normalizeRow(obj);
  });

  // active = TRUE/пусто => показываем, active=FALSE => скрываем
  return rows.filter((r) => r.active !== false);
}

function toBool(v) {
  const s = String(v ?? "").trim().toLowerCase();
  if (s === "true" || s === "1" || s === "yes" || s === "да") return true;
  if (s === "false" || s === "0" || s === "no" || s === "нет") return false;
  // если пусто — считаем true для active, false для top (ниже)
  return null;
}

function normalizeRow(r) {
  // привести ключевые поля
  r.bank = String(r.bank ?? "").trim();
  r.category = String(r.category ?? "").trim();
  r.shop = String(r.shop ?? "").trim();
  r.desc = String(r.desc ?? "").trim();
  r.limit = String(r.limit ?? "").trim();
  r.accrual = String(r.accrual ?? "").trim();
  r.mcc = String(r.mcc ?? "").trim();

  // percent
  const p = Number(String(r.percent ?? "").replace(",", "."));
  r.percent = Number.isFinite(p) ? p : 0;

  // top
  const t = toBool(r.top);
  r.top = t === null ? false : t;

  // active
  const a = toBool(r.active);
  r.active = a === null ? true : a;

  return r;
}

/* =========================
   DATA HELPERS
========================= */
function uniq(arr) {
  return [...new Set(arr)];
}

function getBanks() {
  const banks = uniq(ITEMS.map((x) => x.bank).filter(Boolean)).sort();
  return banks;
}

function getCategoriesForBank(bankName) {
  const cats = uniq(
    ITEMS.filter((x) => x.bank === bankName).map((x) => x.category)
  )
    .filter(Boolean)
    .sort();
  return cats;
}

function getShops(bankName, category) {
  return ITEMS.filter((x) => x.bank === bankName && x.category === category)
    .slice()
    .sort((a, b) => (b.percent || 0) - (a.percent || 0));
}

/* эмодзи для категорий */
function catEmoji(category) {
  const map = {
    "Рестораны": "🍕",
    "Супермаркеты": "🛒",
    "АЗС": "⛽",
    "Одежда": "👗",
    "Электроника": "📱",
    "Путешествия": "✈️",
    "Развлечения": "🎬",
    "Здоровье": "💊",
  };
  return map[category] || "⭐️";
}

/* =========================
   DETAILS GENERATOR (ALL)
========================= */
function bankRules(bankName) {
  switch (bankName) {
    case "Альфа-Банк":
      return {
        accrual: "Начисление: по правилам программы (часто до 10 дней после периода).",
        limit: "Лимит: зависит от тарифа/лимитов банка.",
        form: "Форма: рублями или бонусами — по правилам."
      };
    case "Т-Банк":
      return {
        accrual: "Начисление: обычно до 5 числа следующего месяца.",
        limit: "Лимит: зависит от условий месяца (часто есть месячные ограничения).",
        form: "Форма: рублями на счёт/карту."
      };
    case "Сбер":
      return {
        accrual: "Начисление: бонусами «Спасибо» (обычно 1–10 дней).",
        limit: "Лимит: зависит от уровня/подписок/акций.",
        form: "Форма: бонусами «Спасибо»."
      };
    case "ВТБ":
      return {
        accrual: "Начисление: обычно 5–10 дней после расчётного периода.",
        limit: "Лимит: по условиям мультикарты/категории.",
        form: "Форма: рублями/баллами — по правилам."
      };
    case "Яндекс Банк":
      return {
        accrual: "Начисление: по правилам (баллы/рубли) после оплаты/периода.",
        limit: "Лимит: зависит от условий/подписки.",
        form: "Форма: баллами Плюса или рублями."
      };
    default:
      return {
        accrual: "Начисление: по правилам программы банка.",
        limit: "Лимит: по условиям банка.",
        form: "Форма: по условиям банка."
      };
  }
}

function categoryRules(category) {
  switch (category) {
    case "Рестораны":
      return { what: "Покупки в кафе/ресторанах и доставке при корректном MCC.", mcc: "Частые MCC: 5812/5814.", exclude: "подарочные карты/оплата через сервисы с другим MCC." };
    case "Супермаркеты":
      return { what: "Покупки в продуктовых сетях при корректном MCC.", mcc: "Частые MCC: 5411.", exclude: "маркетплейсы/доставка с другим MCC." };
    case "АЗС":
      return { what: "Оплата топлива на АЗС при корректном MCC.", mcc: "Частые MCC: 5541/5542.", exclude: "оплата через агрегаторов может менять MCC." };
    case "Одежда":
      return { what: "Одежда/обувь при корректном MCC.", mcc: "Частые MCC: 5651/5661/5691.", exclude: "маркетплейсы часто идут другим MCC." };
    case "Электроника":
      return { what: "Электроника при корректном MCC.", mcc: "Частые MCC: 5732.", exclude: "маркетплейсы/платёжные страницы могут менять MCC." };
    case "Путешествия":
      return { what: "Билеты/отели/агентства (часто после факта поездки).", mcc: "Частые MCC: 7011/4722/3000–3350.", exclude: "отмена/возврат обнуляет кэшбэк." };
    case "Развлечения":
      return { what: "Кино/стриминг/подписки по условиям банка.", mcc: "MCC зависит от сервиса.", exclude: "App Store/Google Play часто идёт другим MCC." };
    case "Здоровье":
      return { what: "Аптеки/медицина при корректном MCC.", mcc: "Частые MCC: 5912/8099.", exclude: "маркетплейсы/доставка могут менять MCC." };
    default:
      return { what: "Покупки при корректном MCC.", mcc: "MCC зависит от точки.", exclude: "агрегаторы могут менять MCC." };
  }
}

function buildDetails(row) {
  const b = bankRules(row.bank);
  const c = categoryRules(row.category);

  const details = [
    `Ставка: ${row.percent}% (${row.desc || "по условиям категории"}).`,
    b.form,
    row.limit ? `Лимит: ${row.limit}.` : b.limit,
    row.accrual ? `Начисление: ${row.accrual}.` : b.accrual,
    c.what,
    row.mcc ? `MCC: ${row.mcc}.` : c.mcc,
    `Исключения: ${c.exclude}`,
    "Важно: решает MCC в выписке. Если MCC другой — кэшбэк может не начислиться или пойдёт по другой категории."
  ];

  return details;
}

/* =========================
   ROUTER
========================= */
const stack = [];

function mount(node) {
  node.classList.add("screen");
  view.innerHTML = "";
  view.appendChild(node);
}

function push(render) {
  stack.push(render);
  mount(render());
}

function pop() {
  if (stack.length > 1) {
    stack.pop();
    mount(stack[stack.length - 1]());
  }
}

/* =========================
   SCREENS
========================= */

/* Screen 1: Banks */
function ScreenBanks() {
  const root = document.createElement("div");

  const profile = document.createElement("div");
  profile.className = "profile";
  profile.innerHTML = `
    <div class="avatar"><img src="logo.png" alt="logo"></div>
    <h1>Выгодометр</h1>
    <p>Кэшбэк-агрегатор банков</p>
  `;
  root.appendChild(profile);

  const list = document.createElement("div");
  list.className = "bank-list";

  const banks = getBanks();

  banks.forEach((bankName) => {
    // логотипы банков (локальные)
    const logoMap = {
      "Альфа-Банк": "alfa.png",
      "Т-Банк": "tbank.png",
      "Сбер": "sber.png",
      "ВТБ": "vtb.png",
      "Яндекс Банк": "yandex.png",
    };

    const card = document.createElement("div");
    card.className = "bank-card";
    card.innerHTML = `
      <div class="bank-left">
        <div class="logo-box"><img src="${logoMap[bankName] || "bank.png"}" alt="${bankName}"></div>
        <div class="bank-text">
          <h2>${bankName}</h2>
          <p>Выбрать категории кэшбэка</p>
        </div>
      </div>
      <div class="arrow" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path d="M9 6l6 6-6 6"></path>
        </svg>
      </div>
    `;

    card.addEventListener("click", () => push(() => ScreenCategories(bankName)));
    list.appendChild(card);
  });

  root.appendChild(list);
  return root;
}

/* Screen 2: Categories */
function ScreenCategories(bankName) {
  const root = document.createElement("div");

  const back = document.createElement("div");
  back.className = "back";
  back.textContent = "← Назад к банкам";
  back.addEventListener("click", pop);
  root.appendChild(back);

  // header
  const header = document.createElement("div");
  header.className = "cat-header";
  header.innerHTML = `
    <div class="cat-header-row">
      <div class="logo-box">
        <img src="${
          {
            "Альфа-Банк": "alfa.png",
            "Т-Банк": "tbank.png",
            "Сбер": "sber.png",
            "ВТБ": "vtb.png",
            "Яндекс Банк": "yandex.png",
          }[bankName] || "assets/bank.png"
        }" alt="${bankName}">
      </div>
      <div>
        <div class="cat-title">${bankName}</div>
        <div class="cat-subtitle">Выберите категорию расходов</div>
      </div>
    </div>
  `;
  root.appendChild(header);

  const grid = document.createElement("div");
  grid.className = "category-grid";

  const cats = getCategoriesForBank(bankName);

  cats.forEach((cat) => {
    const tile = document.createElement("div");
    tile.className = "category-card";
    tile.innerHTML = `
      <div class="category-emoji">${catEmoji(cat)}</div>
      <div class="category-text">${cat}</div>
    `;
    tile.addEventListener("click", () => push(() => ScreenShops(bankName, cat)));
    grid.appendChild(tile);
  });

  root.appendChild(grid);
  return root;
}

/* Screen 3: Shops */
function ScreenShops(bankName, category) {
  const root = document.createElement("div");

  const back = document.createElement("div");
  back.className = "back";
  back.textContent = "← Назад к категориям";
  back.addEventListener("click", pop);
  root.appendChild(back);

  const header = document.createElement("div");
  header.className = "shop-header";
  header.innerHTML = `
    <div class="shop-title">${category}</div>
    <div class="shop-subtitle">${bankName} — предложения</div>
  `;
  root.appendChild(header);

  const items = getShops(bankName, category);

  items.forEach((row) => {
    const card = document.createElement("div");
    card.className = "shop-card";
    card.innerHTML = `
      <div class="shop-left">
        <div class="shop-icon">${catEmoji(category)}</div>
        <div>
          <div class="shop-name">${row.shop}</div>
          <div class="shop-desc">${row.desc || ""}</div>
        </div>
      </div>
      <div class="shop-right">
        ${row.top ? `<div class="shop-badge">ТОП</div>` : ``}
        <div class="shop-percent">${row.percent}%</div>
        <div class="shop-cash">кэшбэк</div>
      </div>
    `;

    // click -> details
    card.addEventListener("click", () => {
      push(() => ScreenDetails(row));
    });

    root.appendChild(card);
  });

  return root;
}

/* Screen 4: Details */
function ScreenDetails(row) {
  const root = document.createElement("div");

  const back = document.createElement("div");
  back.className = "back";
  back.textContent = "← Назад к магазинам";
  back.addEventListener("click", pop);
  root.appendChild(back);

  const header = document.createElement("div");
  header.className = "shop-header";
  header.innerHTML = `
    <div class="shop-title">${row.shop}</div>
    <div class="shop-subtitle">${row.bank} · ${row.category}</div>
  `;
  root.appendChild(header);

  const details = buildDetails(row);

  const box = document.createElement("div");
  box.className = "details-box";

  details.forEach((t) => {
    const d = document.createElement("div");
    d.className = "details-row";
    d.innerHTML = `
      <div class="details-dot"></div>
      <div class="details-text">${t}</div>
    `;
    box.appendChild(d);
  });

  root.appendChild(box);
  return root;
}

/* =========================
   INIT
========================= */
async function init() {
  try {
    ITEMS = await loadData();
  } catch (e) {
    // если таблица недоступна — покажем простую ошибку
    view.innerHTML = `
      <div class="screen">
        <div class="shop-header">
          <div class="shop-title">Ошибка загрузки</div>
          <div class="shop-subtitle">Проверь доступ к таблице и ссылку CSV.</div>
        </div>
      </div>
    `;
    return;
  }

  stack.length = 0;
  stack.push(() => ScreenBanks());
  mount(ScreenBanks());
}

document.addEventListener("DOMContentLoaded", init);
