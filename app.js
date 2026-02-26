const view = document.getElementById("view");

/* ====== CSV URL ====== */
const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/10WpoOiqyf4yTyoPa6ENtt0msHcwAOF9qVF1zFlDesEc/export?format=csv&gid=0";

/* ====== LINKS ====== */
const TELEGRAM_LINK = "https://t.me/Vnuk36bot";
const COLLAB_EMAIL = "danechkavetohin@yandex.ru";

/* ====== DATA ====== */
let ITEMS = [];

/* =========================
   CSV LOADER (simple)
========================= */
async function loadData() {
  const res = await fetch(SHEET_URL, { cache: "no-store" });
  const text = await res.text();

  const lines = text.trim().split(/\r?\n/);
  const headers = lines[0].split(",").map((h) => h.trim());

  const rows = lines.slice(1).map((line) => {
    const cols = line.split(",");
    const obj = {};
    headers.forEach((h, i) => (obj[h] = (cols[i] ?? "").trim()));
    return normalizeRow(obj);
  });

  return rows.filter((r) => r.active !== false);
}

function toBool(v) {
  const s = String(v ?? "").trim().toLowerCase();
  if (s === "true" || s === "1" || s === "yes" || s === "да") return true;
  if (s === "false" || s === "0" || s === "no" || s === "нет") return false;
  return null;
}

function normalizeRow(r) {
  r.bank = String(r.bank ?? "").trim();
  r.category = String(r.category ?? "").trim();
  r.shop = String(r.shop ?? "").trim();
  r.desc = String(r.desc ?? "").trim();
  r.limit = String(r.limit ?? "").trim();
  r.accrual = String(r.accrual ?? "").trim();
  r.mcc = String(r.mcc ?? "").trim();

  const p = Number(String(r.percent ?? "").replace(",", "."));
  r.percent = Number.isFinite(p) ? p : 0;

  const t = toBool(r.top);
  r.top = t === null ? false : t;

  const a = toBool(r.active);
  r.active = a === null ? true : a;

  return r;
}

/* =========================
   HELPERS
========================= */
function uniq(arr) {
  return [...new Set(arr)];
}

function getBanks() {
  return uniq(ITEMS.map((x) => x.bank).filter(Boolean)).sort();
}

function getCategoriesForBank(bankName) {
  return uniq(ITEMS.filter((x) => x.bank === bankName).map((x) => x.category))
    .filter(Boolean)
    .sort();
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
    "Маркетплейсы": "🛍️",
    "Дом и ремонт": "🧰",
    "Транспорт": "🚕",
  };
  return map[category] || "⭐️";
}

function norm(s) {
  return String(s ?? "").trim().toLowerCase();
}

function searchOffersByShop(query) {
  const q = norm(query);
  if (!q) return [];
  const hits = ITEMS.filter(
    (x) => norm(x.shop).includes(q) || norm(x.desc).includes(q)
  );
  hits.sort((a, b) => (b.percent || 0) - (a.percent || 0));
  return hits;
}

/* =========================
   DETAILS GENERATOR
========================= */
function bankRules(bankName) {
  switch (bankName) {
    case "Альфа-Банк":
      return {
        accrual:
          "Начисление: по правилам программы (часто до 10 дней после периода).",
        limit: "Лимит: зависит от тарифа/лимитов банка.",
        form: "Форма: рублями или бонусами — по правилам.",
      };
    case "Т-Банк":
      return {
        accrual: "Начисление: обычно до 5 числа следующего месяца.",
        limit:
          "Лимит: зависит от условий месяца (часто есть месячные ограничения).",
        form: "Форма: рублями на счёт/карту.",
      };
    case "Сбер":
      return {
        accrual: "Начисление: бонусами «Спасибо» (обычно 1–10 дней).",
        limit: "Лимит: зависит от уровня/подписок/акций.",
        form: "Форма: бонусами «Спасибо».",
      };
    case "ВТБ":
      return {
        accrual: "Начисление: обычно 5–10 дней после расчётного периода.",
        limit: "Лимит: по условиям мультикарты/категории.",
        form: "Форма: рублями/баллами — по правилам.",
      };
    case "Яндекс Банк":
      return {
        accrual: "Начисление: по правилам (баллы/рубли) после оплаты/периода.",
        limit: "Лимит: зависит от условий/подписки.",
        form: "Форма: баллами Плюса или рублями.",
      };
    default:
      return {
        accrual: "Начисление: по правилам программы банка.",
        limit: "Лимит: по условиям банка.",
        form: "Форма: по условиям банка.",
      };
  }
}

function categoryRules(category) {
  switch (category) {
    case "Рестораны":
      return {
        what: "Покупки в кафе/ресторанах и доставке при корректном MCC.",
        mcc: "Частые MCC: 5812/5814.",
        exclude: "подарочные карты/оплата через сервисы с другим MCC.",
      };
    case "Супермаркеты":
      return {
        what: "Покупки в продуктовых сетях при корректном MCC.",
        mcc: "Частые MCC: 5411.",
        exclude: "маркетплейсы/доставка с другим MCC.",
      };
    case "АЗС":
      return {
        what: "Оплата топлива на АЗС при корректном MCC.",
        mcc: "Частые MCC: 5541/5542.",
        exclude: "оплата через агрегаторов может менять MCC.",
      };
    case "Одежда":
      return {
        what: "Одежда/обувь при корректном MCC.",
        mcc: "Частые MCC: 5651/5661/5691.",
        exclude: "маркетплейсы часто идут другим MCC.",
      };
    case "Электроника":
      return {
        what: "Электроника при корректном MCC.",
        mcc: "Частые MCC: 5732.",
        exclude: "маркетплейсы/платёжные страницы могут менять MCC.",
      };
    case "Путешествия":
      return {
        what: "Билеты/отели/агентства (часто после факта поездки).",
        mcc: "Частые MCC: 7011/4722/3000–3350.",
        exclude: "отмена/возврат обнуляет кэшбэк.",
      };
    case "Развлечения":
      return {
        what: "Кино/стриминг/подписки по условиям банка.",
        mcc: "MCC зависит от сервиса.",
        exclude: "App Store/Google Play часто идёт другим MCC.",
      };
    case "Здоровье":
      return {
        what: "Аптеки/медицина при корректном MCC.",
        mcc: "Частые MCC: 5912/8099.",
        exclude: "маркетплейсы/доставка могут менять MCC.",
      };
    default:
      return {
        what: "Покупки при корректном MCC.",
        mcc: "MCC зависит от точки.",
        exclude: "агрегаторы могут менять MCC.",
      };
  }
}

function buildDetails(row) {
  const b = bankRules(row.bank);
  const c = categoryRules(row.category);

  return [
    `Ставка: ${row.percent}% (${row.desc || "по условиям категории"}).`,
    b.form,
    row.limit ? `Лимит: ${row.limit}.` : b.limit,
    row.accrual ? `Начисление: ${row.accrual}.` : b.accrual,
    c.what,
    row.mcc ? `MCC: ${row.mcc}.` : c.mcc,
    `Исключения: ${c.exclude}`,
    "Важно: решает MCC в выписке. Если MCC другой — кэшбэк может не начислиться или пойдёт по другой категории.",
  ];
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
   LOGOS (NO assets/)
========================= */
const BANK_LOGO = {
  "Альфа-Банк": "alfa.png",
  "Т-Банк": "tbank.png",
  "Сбер": "sber.png",
  "ВТБ": "vtb.png",
  "Яндекс Банк": "yandex.png",
};

/* =========================
   SCREENS
========================= */

/* Screen 1: Banks */
function ScreenBanks() {
  const root = document.createElement("div");

  const profile = document.createElement("div");
  profile.className = "profile";
  profile.innerHTML = `
    <div class="brand-line">
      <div class="brand-mark"><img src="logo.png" alt="logo"></div>
      <div class="brand-name"><div>Выгодный</div><div>ментор</div></div>
    </div>
    <div class="brand-subtitle">Кэшбэк-агрегатор банков</div>
  `;
  root.appendChild(profile);

  // global search
  const searchWrap = document.createElement("div");
  searchWrap.className = "search-wrap";
  searchWrap.innerHTML = `
    <input class="search-input" id="globalShopSearch" placeholder="Поиск магазина: где есть кэшбэк?">
    <div class="search-hint">Например: Ozon, WB, Яндекс…</div>
  `;
  root.appendChild(searchWrap);

  const resultsBox = document.createElement("div");
  root.appendChild(resultsBox);

  const list = document.createElement("div");
  list.className = "bank-list";
  root.appendChild(list);

  function renderBanks() {
    list.innerHTML = "";
    getBanks().forEach((bankName) => {
      const card = document.createElement("div");
      card.className = "bank-card";
      card.innerHTML = `
        <div class="bank-left">
          <div class="logo-box"><img src="${BANK_LOGO[bankName] || "bank.png"}" alt="${bankName}"></div>
          <div class="bank-text">
            <h2>${bankName}</h2>
            <p>Выбрать категории кэшбэка</p>
          </div>
        </div>
        <div class="arrow" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"></path></svg>
        </div>
      `;
      card.addEventListener("click", () => push(() => ScreenCategories(bankName)));
      list.appendChild(card);
    });
  }

  function renderGlobalResults(q) {
    const qq = norm(q);

    if (!qq) {
      resultsBox.innerHTML = "";
      list.style.display = "";
      return;
    }

    list.style.display = "none";
    const hits = searchOffersByShop(qq);

    if (!hits.length) {
      resultsBox.innerHTML = `<div class="empty-note">Ничего не найдено по запросу “${q}”.</div>`;
      return;
    }

    resultsBox.innerHTML = "";
    hits.slice(0, 30).forEach((row) => {
      const card = document.createElement("div");
      card.className = "shop-card";
      card.innerHTML = `
        <div class="shop-left">
          <div class="shop-icon">${catEmoji(row.category)}</div>
          <div>
            <div class="shop-name">${row.shop}</div>
            <div class="shop-desc">${row.bank} · ${row.category}${row.desc ? ` · ${row.desc}` : ""}</div>
          </div>
        </div>
        <div class="shop-right">
          ${row.top ? `<div class="shop-badge">ТОП</div>` : ``}
          <div class="shop-percent">${row.percent}%</div>
          <div class="shop-cash">кэшбэк</div>
        </div>
      `;
      card.addEventListener("click", () => push(() => ScreenDetails(row)));
      resultsBox.appendChild(card);
    });
  }

  renderBanks();
  searchWrap.querySelector("#globalShopSearch")
    .addEventListener("input", (e) => renderGlobalResults(e.target.value));

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

  const header = document.createElement("div");
  header.className = "cat-header";
  header.innerHTML = `
    <div class="cat-header-row">
      <div class="logo-box">
        <img src="${BANK_LOGO[bankName] || "bank.png"}" alt="${bankName}">
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

  getCategoriesForBank(bankName).forEach((cat) => {
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
    card.addEventListener("click", () => push(() => ScreenDetails(row)));
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

/* =========================
   OVERLAYS + FOOTER
========================= */
function closeOverlay() {
  const el = document.getElementById("overlay");
  if (el) el.remove();
}

function openOverlay(title, innerHtml) {
  closeOverlay();

  const overlay = document.createElement("div");
  overlay.className = "overlay";
  overlay.id = "overlay";

  overlay.innerHTML = `
    <div class="overlay-panel" role="dialog" aria-modal="true">
      <div class="overlay-head">
        <div class="overlay-title">${title}</div>
        <button class="overlay-close" type="button" aria-label="Закрыть">✕</button>
      </div>

      <div class="overlay-scroll">
        <div class="overlay-body">${innerHtml}</div>
      </div>
    </div>
  `;

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeOverlay();
  });
  overlay.querySelector(".overlay-close")?.addEventListener("click", closeOverlay);

  document.body.appendChild(overlay);
}

function openEmailCard() {
  openOverlay(
    "Сотрудничество",
    `
      <div class="overlay-text">
        По вопросам сотрудничества<br>
        напишите на почту:
        <div class="mail-pill"><a href="mailto:${COLLAB_EMAIL}">${COLLAB_EMAIL}</a></div>
      </div>
    `
  );
}

function openFAQ() {
  const FAQ = [
    { q: "Почему кэшбэк может не начислиться?", a: "Чаще всего причина — MCC в выписке отличается от ожидаемого. Банк начисляет по MCC, а не по названию магазина." },
    { q: "Где посмотреть MCC по операции?", a: "Открой операцию в приложении банка → детали операции/списание. Там обычно указан MCC или категория точки." },
    { q: "Когда приходит кэшбэк?", a: "Зависит от банка. Обычно после расчётного периода — в начале следующего месяца или через несколько дней." },
    { q: "Почему у разных банков разные проценты?", a: "У банков разные программы лояльности, лимиты, тарифы и акции." },
    { q: "Что значит метка «ТОП»?", a: "Это пометка top=TRUE в таблице — ориентир на выгодные предложения." },
    { q: "Как часто обновляются данные?", a: "После изменения Google Sheets данные подтянутся при следующей перезагрузке." },
  ];

  const html = `
    <div class="faq-list">
      ${FAQ.map((x) => `
        <div class="faq-item">
          <button class="faq-q" type="button">
            <span>${x.q}</span>
            <svg class="faq-chevron" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"></path></svg>
          </button>
          <div class="faq-a"><p>${x.a}</p></div>
        </div>
      `).join("")}
    </div>
  `;

  openOverlay("FAQ", html);

  const scrollEl = document.querySelector("#overlay .overlay-scroll");
  const panel = document.querySelector("#overlay .overlay-panel");
  if (!scrollEl || !panel) return;

  panel.querySelectorAll(".faq-a").forEach((a) => (a.style.maxHeight = "0px"));

  panel.querySelectorAll(".faq-item").forEach((item) => {
    const btn = item.querySelector(".faq-q");
    const a = item.querySelector(".faq-a");

    btn?.addEventListener("click", () => {
      const beforeTop = item.getBoundingClientRect().top;

      panel.querySelectorAll(".faq-item.open").forEach((x) => {
        if (x !== item) {
          x.classList.remove("open");
          const xa = x.querySelector(".faq-a");
          if (xa) xa.style.maxHeight = "0px";
        }
      });

      const isOpen = item.classList.toggle("open");
      if (a) a.style.maxHeight = isOpen ? a.scrollHeight + "px" : "0px";

      const afterTop = item.getBoundingClientRect().top;
      scrollEl.scrollTop += (afterTop - beforeTop);
    });
  });
}

function bindFooter() {
  document.getElementById("tgBtn")?.addEventListener("click", () => {
    if (window.Telegram?.WebApp) Telegram.WebApp.openTelegramLink(TELEGRAM_LINK);
    else window.open(TELEGRAM_LINK, "_blank", "noopener");
  });

  document.getElementById("msgBtn")?.addEventListener("click", openEmailCard);
  document.getElementById("faqBtn")?.addEventListener("click", openFAQ);
}

document.addEventListener("DOMContentLoaded", bindFooter);