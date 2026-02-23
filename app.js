const view = document.getElementById("view");

/* ===== Категории ===== */
const categories = [
  "🍕 Рестораны",
  "🛒 Супермаркеты",
  "⛽ АЗС",
  "👗 Одежда",
  "📱 Электроника",
  "✈️ Путешествия",
  "🎬 Развлечения",
  "💊 Здоровье"
];

/* ===== Банки ===== */
const BANKS = [
  { name:"Альфа-Банк", desc:"Кэшбэк до 33%", logo:"alfa.png" },
  { name:"Т-Банк", desc:"Умный кэшбэк до 25%", logo:"tbank.png" },
  { name:"Сбер", desc:"СберСпасибо до 30%", logo:"sber.png" },
  { name:"ВТБ", desc:"Мультикарта — до 15%", logo:"vtb.png" },
  { name:"Яндекс Банк", desc:"Баллы Плюса до 20%", logo:"yandex.png" }
];

/* ===== Данные магазинов =====
   Можно ДОБАВЛЯТЬ ручные условия так:
   { name, percent, desc, top, details: ["...", "..."] }
*/
const DATA = {
  "Альфа-Банк": {
    "Рестораны":[
      {name:"Яндекс Еда",percent:8,desc:"На доставку",top:true},
      {name:"Додо Пицца",percent:6,desc:"На заказы"},
      {name:"Burger King",percent:5,desc:"На покупки"}
    ],
    "Супермаркеты":[
      {name:"Перекрёсток",percent:6,desc:"До 3000₽",top:true},
      {name:"Пятёрочка",percent:4,desc:"На покупки"},
      {name:"Лента",percent:3,desc:"Без ограничений"}
    ],
    "АЗС":[
      {name:"Газпромнефть",percent:5,desc:"На топливо",top:true},
      {name:"Лукойл",percent:4,desc:"На топливо"},
      {name:"Роснефть",percent:3,desc:"На топливо"}
    ],
    "Одежда":[
      {name:"Lamoda",percent:7,desc:"Онлайн",top:true},
      {name:"Ostin",percent:4,desc:"На покупки"},
      {name:"Sportmaster",percent:3,desc:"На покупки"}
    ],
    "Электроника":[
      {name:"М.Видео",percent:5,desc:"До 5000₽",top:true},
      {name:"DNS",percent:3,desc:"Без ограничений"}
    ],
    "Путешествия":[
      {name:"Ostrovok",percent:8,desc:"На бронирования",top:true},
      {name:"Aviasales",percent:4,desc:"На билеты"}
    ],
    "Развлечения":[
      {name:"КиноПоиск",percent:6,desc:"Подписка",top:true},
      {name:"Okko",percent:4,desc:"Подписка"}
    ],
    "Здоровье":[
      {name:"Аптека.ру",percent:6,desc:"На заказы",top:true},
      {name:"Eapteka",percent:4,desc:"На покупки"}
    ]
  },

  "Т-Банк": {
    "Рестораны":[
      {name:"Додо Пицца",percent:7,desc:"На доставку",top:true},
      {name:"KFC",percent:5,desc:"На меню"},
      {name:"Тануки",percent:4,desc:"На заказы"}
    ],
    "Супермаркеты":[
      {name:"Самокат",percent:8,desc:"На доставку",top:true},
      {name:"ВкусВилл",percent:5,desc:"На покупки"},
      {name:"Магнит",percent:4,desc:"На покупки"}
    ],
    "АЗС":[
      {name:"Лукойл",percent:7,desc:"На топливо",top:true},
      {name:"Нефтьмагистраль",percent:6,desc:"На заправку"},
      {name:"BP",percent:5,desc:"На покупки"},
      {name:"Татнефть",percent:4,desc:"На топливо"}
    ],
    "Одежда":[
      {name:"Zara",percent:6,desc:"Онлайн",top:true},
      {name:"H&M",percent:5,desc:"Онлайн"},
      {name:"Wildberries",percent:4,desc:"На покупки"}
    ],
    "Электроника":[
      {name:"Ситилинк",percent:6,desc:"До 5000₽",top:true},
      {name:"М.Видео",percent:5,desc:"На покупки"},
      {name:"DNS",percent:3,desc:"Без ограничений"}
    ],
    "Путешествия":[
      {name:"OneTwoTrip",percent:8,desc:"На брони",top:true},
      {name:"Яндекс Путешествия",percent:6,desc:"На брони"}
    ],
    "Развлечения":[
      {name:"IVI",percent:6,desc:"Подписка",top:true},
      {name:"VK Музыка",percent:4,desc:"Подписка"}
    ],
    "Здоровье":[
      {name:"Аптека 36.6",percent:5,desc:"На покупки",top:true},
      {name:"Аптека.ру",percent:4,desc:"На заказы"}
    ]
  },

  "Сбер": {
    "Рестораны":[
      {name:"Яндекс Еда",percent:7,desc:"Бонусами",top:true},
      {name:"KFC",percent:5,desc:"Бонусами"}
    ],
    "Супермаркеты":[
      {name:"Магнит",percent:5,desc:"Бонусами",top:true},
      {name:"Лента",percent:4,desc:"Бонусами"}
    ],
    "АЗС":[
      {name:"Газпромнефть",percent:5,desc:"Бонусами",top:true},
      {name:"Лукойл",percent:4,desc:"Бонусами"}
    ],
    "Одежда":[
      {name:"Lamoda",percent:6,desc:"Бонусами",top:true},
      {name:"Ozon Fashion",percent:4,desc:"Бонусами"}
    ],
    "Электроника":[
      {name:"М.Видео",percent:5,desc:"Бонусами",top:true},
      {name:"Ситилинк",percent:4,desc:"Бонусами"}
    ],
    "Путешествия":[
      {name:"СберТревел",percent:7,desc:"Оплата картой",top:true},
      {name:"Ostrovok",percent:5,desc:"Бонусами"}
    ],
    "Развлечения":[
      {name:"Okko",percent:6,desc:"Подписка",top:true},
      {name:"КиноПоиск",percent:4,desc:"Покупки"}
    ],
    "Здоровье":[
      {name:"ЕАПТЕКА",percent:5,desc:"Бонусами",top:true},
      {name:"Аптека.ру",percent:4,desc:"Бонусами"}
    ]
  },

  "ВТБ": {
    "Рестораны":[
      {name:"Burger King",percent:6,desc:"По мультикарте",top:true},
      {name:"Додо Пицца",percent:5,desc:"На заказы"}
    ],
    "Супермаркеты":[
      {name:"Перекрёсток",percent:6,desc:"До 2000₽",top:true},
      {name:"Пятёрочка",percent:4,desc:"На покупки"}
    ],
    "АЗС":[
      {name:"Газпромнефть",percent:5,desc:"До 2000₽",top:true},
      {name:"Лукойл",percent:4,desc:"По мультикарте"}
    ],
    "Одежда":[
      {name:"Lamoda",percent:6,desc:"Онлайн",top:true},
      {name:"Ostin",percent:4,desc:"На покупки"}
    ],
    "Электроника":[
      {name:"М.Видео",percent:6,desc:"До 5000₽",top:true},
      {name:"DNS",percent:3,desc:"Без ограничений"}
    ],
    "Путешествия":[
      {name:"OneTwoTrip",percent:7,desc:"На брони",top:true},
      {name:"Aviasales",percent:4,desc:"На билеты"}
    ],
    "Развлечения":[
      {name:"IVI",percent:6,desc:"Подписка",top:true},
      {name:"Okko",percent:4,desc:"Подписка"}
    ],
    "Здоровье":[
      {name:"Аптека.ру",percent:5,desc:"На заказы",top:true},
      {name:"Eapteka",percent:4,desc:"На покупки"}
    ]
  },

  "Яндекс Банк": {
    "Рестораны":[
      {name:"Яндекс Еда",percent:10,desc:"Баллы Плюса",top:true},
      {name:"Delivery Club",percent:6,desc:"Баллы Плюса"}
    ],
    "Супермаркеты":[
      {name:"Яндекс Лавка",percent:10,desc:"Баллы Плюса",top:true},
      {name:"Самокат",percent:6,desc:"Баллы Плюса"}
    ],
    "АЗС":[
      {name:"Яндекс Заправки",percent:7,desc:"Баллы Плюса",top:true},
      {name:"Газпромнефть",percent:4,desc:"Баллы"}
    ],
    "Одежда":[
      {name:"Lamoda",percent:7,desc:"Баллы Плюса",top:true},
      {name:"Wildberries",percent:4,desc:"Баллы"}
    ],
    "Электроника":[
      {name:"Яндекс Маркет",percent:6,desc:"Баллы Плюса",top:true},
      {name:"DNS",percent:3,desc:"Баллы"}
    ],
    "Путешествия":[
      {name:"Яндекс Путешествия",percent:8,desc:"Баллы Плюса",top:true},
      {name:"Ostrovok",percent:5,desc:"Баллы"}
    ],
    "Развлечения":[
      {name:"Кинопоиск",percent:6,desc:"Баллы Плюса",top:true},
      {name:"Яндекс Музыка",percent:5,desc:"Баллы Плюса"}
    ],
    "Здоровье":[
      {name:"Аптека.ру",percent:5,desc:"Баллы",top:true},
      {name:"Eapteka",percent:4,desc:"Баллы"}
    ]
  }
};

/* =========================
   ROUTER
========================= */
const stack = [];

function mount(node){
  node.classList.add("screen");
  view.innerHTML = "";
  view.appendChild(node);
}

function push(render){
  stack.push(render);
  mount(render());
}

function pop(){
  if(stack.length > 1){
    stack.pop();
    mount(stack[stack.length - 1]());
  }
}

/* =========================
   HELPERS
========================= */
function catSplit(s){
  const emoji = s.split(" ")[0];
  const text = s.substring(2).trim();
  return { emoji, text };
}

function catIcon(category){
  const map = {
    "Рестораны":"🍕",
    "Супермаркеты":"🛒",
    "АЗС":"⛽",
    "Одежда":"👗",
    "Электроника":"📱",
    "Путешествия":"✈️",
    "Развлечения":"🎬",
    "Здоровье":"💊"
  };
  return map[category] || "⭐️";
}

/* =========================
   DETAILS GENERATOR (ALL)
========================= */
function bankRules(bankName){
  switch(bankName){
    case "Альфа-Банк":
      return {
        accrual: "Начисление: по правилам программы (обычно до 10 рабочих дней после завершения расчётного периода).",
        limit: "Лимит: зависит от тарифа/лимитов банка (часто 3 000–10 000 ₽/мес).",
        form: "Форма: рублями или бонусами — зависит от программы."
      };
    case "Т-Банк":
      return {
        accrual: "Начисление: обычно до 5 числа следующего месяца.",
        limit: "Лимит: часто 3 000 ₽/мес на повышенный кэшбэк (зависит от условий месяца).",
        form: "Форма: рублями на счёт/карту."
      };
    case "Сбер":
      return {
        accrual: "Начисление: бонусами «Спасибо» (как правило, в течение 1–10 дней).",
        limit: "Лимит: зависит от уровня/подписок/акций (часто есть месячные ограничения).",
        form: "Форма: бонусами «Спасибо»."
      };
    case "ВТБ":
      return {
        accrual: "Начисление: обычно в течение 5–10 дней после расчётного периода.",
        limit: "Лимит: по мультикарте/категории, часто 2 000–5 000 ₽/мес.",
        form: "Форма: рублями/баллами (зависит от программы)."
      };
    case "Яндекс Банк":
      return {
        accrual: "Начисление: баллами Плюса/кэшбэком по условиям (обычно после оплаты/закрытия периода).",
        limit: "Лимит: зависит от подписки/условий (часто 2 000–5 000 ₽/мес).",
        form: "Форма: баллами Плюса или рублями — по правилам."
      };
    default:
      return {
        accrual: "Начисление: по правилам программы банка.",
        limit: "Лимит: по условиям банка.",
        form: "Форма: по условиям банка."
      };
  }
}

function categoryRules(category){
  switch(category){
    case "Рестораны":
      return {
        what: "Учитываются покупки в кафе/ресторанах и доставке (если проходит корректным MCC).",
        mcc: "Частые MCC: 5812/5814.",
        exclude: "подарочные карты, оплата через сервисы с другим MCC, отдельные комиссии."
      };
    case "Супермаркеты":
      return {
        what: "Покупки в продуктовых сетях и доставке продуктов (при корректном MCC).",
        mcc: "Частые MCC: 5411.",
        exclude: "маркетплейсы/доставка с другим MCC."
      };
    case "АЗС":
      return {
        what: "Оплата топлива на АЗС (иногда + товары на кассе — зависит от MCC).",
        mcc: "Частые MCC: 5541/5542.",
        exclude: "оплата через агрегаторов/приложения, меняющие MCC."
      };
    case "Одежда":
      return {
        what: "Покупки одежды/обуви (онлайн/офлайн) при корректном MCC.",
        mcc: "Частые MCC: 5651/5661/5691.",
        exclude: "маркетплейсы с MCC маркетплейса."
      };
    case "Электроника":
      return {
        what: "Покупки в магазинах электроники при корректном MCC.",
        mcc: "Частые MCC: 5732.",
        exclude: "маркетплейсы/сторонние платёжные страницы с другим MCC."
      };
    case "Путешествия":
      return {
        what: "Билеты/отели/агентства (часто начисление после факта поездки/проживания).",
        mcc: "Частые MCC: 7011, 4722, 3000–3350.",
        exclude: "отмены/возвраты."
      };
    case "Развлечения":
      return {
        what: "Кино/стриминг/подписки (если банк относит к развлечениям).",
        mcc: "MCC зависит от сервиса.",
        exclude: "оплата через App Store/Google Play часто идёт другим MCC."
      };
    case "Здоровье":
      return {
        what: "Аптеки/медицина при корректном MCC.",
        mcc: "Частые MCC: 5912/8099.",
        exclude: "маркетплейсы/доставка с другим MCC."
      };
    default:
      return {
        what: "Покупки при корректном MCC категории.",
        mcc: "MCC зависит от торговой точки.",
        exclude: "оплата через агрегаторов может менять MCC."
      };
  }
}

function shopExtraRules(shopName, category){
  const n = (shopName || "").toLowerCase();
  if (category === "Путешествия" && (n.includes("ostrovok") || n.includes("onetwotrip"))){
    return [
      "Кэшбэк может начисляться после подтверждения проживания/поездки (не сразу после оплаты).",
      "При отмене брони кэшбэк обычно не сохраняется."
    ];
  }
  if (category === "Развлечения" && (n.includes("okko") || n.includes("ivi") || n.includes("кинопоиск") || n.includes("музыка"))){
    return [
      "Если оплата идёт через App Store/Google Play, MCC может отличаться — кэшбэк может не начислиться.",
      "По подпискам начисление может быть только на первый платёж в периоде (зависит от банка)."
    ];
  }
  if (category === "Супермаркеты" && (n.includes("самокат") || n.includes("лавка") || n.includes("вкусвилл"))){
    return [
      "Для доставки важно, чтобы списание прошло как «супермаркеты» (MCC 5411).",
      "Итоговая сумма (после скидок) влияет на сумму кэшбэка."
    ];
  }
  if (category === "АЗС" && n.includes("яндекс")){
    return [
      "При оплате через сервисы («Яндекс Заправки») MCC может быть сервисный — начисление зависит от банка.",
      "Проверь MCC в выписке после первой оплаты."
    ];
  }
  return [];
}

function buildDetails(bankName, category, shop){
  const b = bankRules(bankName);
  const c = categoryRules(category);

  const base = [
    `Ставка: ${shop.percent}% (${shop.desc || "по условиям категории"}).`,
    b.form,
    b.limit,
    b.accrual,
    c.what,
    c.mcc,
    `Исключения: ${c.exclude}`
  ];

  const extra = shopExtraRules(shop.name, category);
  const finish = [
    "Важно: решает MCC в выписке. Если MCC другой — кэшбэк может не начислиться или пойдёт по другой категории."
  ];

  return [...base, ...extra, ...finish];
}

/* =========================
   SCREENS
========================= */
function ScreenBanks(){
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

  BANKS.forEach(bank => {
    const card = document.createElement("div");
    card.className = "bank-card";
    card.innerHTML = `
      <div class="bank-left">
        <div class="logo-box"><img src="${bank.logo}" alt="${bank.name}"></div>
        <div class="bank-text">
          <h2>${bank.name}</h2>
          <p>${bank.desc}</p>
        </div>
      </div>
      <div class="arrow" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path d="M9 6l6 6-6 6"></path>
        </svg>
      </div>
    `;
    card.addEventListener("click", () => push(() => ScreenCategories(bank)));
    list.appendChild(card);
  });

  root.appendChild(list);
  return root;
}

function ScreenCategories(bank){
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
      <div class="logo-box"><img src="${bank.logo}" alt="${bank.name}"></div>
      <div>
        <div class="cat-title">${bank.name}</div>
        <div class="cat-subtitle">Выберите категорию расходов</div>
      </div>
    </div>
  `;
  root.appendChild(header);

  const grid = document.createElement("div");
  grid.className = "category-grid";

  categories.forEach(item => {
    const { emoji, text } = catSplit(item);

    const tile = document.createElement("div");
    tile.className = "category-card";
    tile.innerHTML = `
      <div class="category-emoji">${emoji}</div>
      <div class="category-text">${text}</div>
    `;
    tile.addEventListener("click", () => push(() => ScreenShops(bank, text)));
    grid.appendChild(tile);
  });

  root.appendChild(grid);
  return root;
}

function ScreenShops(bank, category){
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
    <div class="shop-subtitle">${bank.name} — условия кэшбэка</div>
  `;
  root.appendChild(header);

  const items = (DATA[bank.name]?.[category] || []).slice().sort((a,b)=> (b.percent||0)-(a.percent||0));

  items.forEach(shop => {
    const card = document.createElement("div");
    card.className = "shop-card";
    card.innerHTML = `
      <div class="shop-left">
        <div class="shop-icon">${catIcon(category)}</div>
        <div>
          <div class="shop-name">${shop.name}</div>
          <div class="shop-desc">${shop.desc || ""}</div>
        </div>
      </div>
      <div class="shop-right">
        ${shop.top ? `<div class="shop-badge">ТОП</div>` : ``}
        <div class="shop-percent">${shop.percent}%</div>
        <div class="shop-cash">кэшбэк</div>
      </div>
    `;

    // ✅ КЛИК → УСЛОВИЯ (4 экран)
    card.addEventListener("click", () => {
      push(() => ScreenDetails(bank, category, shop));
    });

    root.appendChild(card);
  });

  return root;
}

/* ===== Screen 4: Details ===== */
function ScreenDetails(bank, category, shop){
  const root = document.createElement("div");

  const back = document.createElement("div");
  back.className = "back";
  back.textContent = "← Назад к магазинам";
  back.addEventListener("click", pop);
  root.appendChild(back);

  const header = document.createElement("div");
  header.className = "shop-header";
  header.innerHTML = `
    <div class="shop-title">${shop.name}</div>
    <div class="shop-subtitle">${bank.name} · ${category}</div>
  `;
  root.appendChild(header);

  const details = (Array.isArray(shop.details) && shop.details.length)
    ? shop.details
    : buildDetails(bank.name, category, shop);

  const box = document.createElement("div");
  box.className = "details-box";

  details.forEach(text => {
    const row = document.createElement("div");
    row.className = "details-row";
    row.innerHTML = `
      <div class="details-dot"></div>
      <div class="details-text">${text}</div>
    `;
    box.appendChild(row);
  });

  root.appendChild(box);
  return root;
}

/* init */
stack.push(() => ScreenBanks());
mount(ScreenBanks());
