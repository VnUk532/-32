const view = document.getElementById("view");

/* ===== Категории (возвращён блок) ===== */
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

/* ===== Профиль (лендинг) ===== */
const profile = {
  title: "Выгодометр",
  subtitle: "Кэшбэк-агрегатор банков",
  avatar: "assets/logo.png"
};

/* ===== Банки (иконки локальные PNG) ===== */
const BANKS = [
  { name:"Альфа-Банк", desc:"Кэшбэк до 33% у партнёров", logo:"assets/alfa.png", bg:"rgba(255,120,155,.20)", color:"#e8265c" },
  { name:"Т-Банк",     desc:"Умный кэшбэк до 25%",        logo:"assets/tbank.png", bg:"rgba(255,210,120,.25)", color:"#f2b100" },
  { name:"Сбер",       desc:"СберСпасибо до 30%",         logo:"assets/sber.png", bg:"rgba(160,230,190,.25)", color:"#1ca85a" },
  { name:"ВТБ",        desc:"Мультикарта — до 15%",        logo:"assets/vtb.png",  bg:"rgba(170,195,255,.25)", color:"#2d55d2" },
  { name:"Яндекс Банк",desc:"Баллы Плюса до 20%",         logo:"assets/yandex.png",bg:"rgba(255,165,165,.25)", color:"#e62828" }
];

/* ===== Данные магазинов по банкам и категориям =====
   Важно: ключ категории = текст без эмодзи (например "Рестораны", "АЗС")
*/
const DATA = {
  "Альфа-Банк": {
    "Рестораны": [
      { name:"Яндекс Еда", percent:8, desc:"На доставку", top:true },
      { name:"Додо Пицца", percent:6, desc:"На заказы онлайн" },
      { name:"Burger King", percent:5, desc:"На покупки" }
    ],
    "Супермаркеты": [
      { name:"Перекрёсток", percent:6, desc:"До 3000₽", top:true },
      { name:"Пятёрочка", percent:4, desc:"На покупки" },
      { name:"Лента", percent:3, desc:"Без ограничений" }
    ],
    "АЗС": [
      { name:"Газпромнефть", percent:5, desc:"На топливо", top:true },
      { name:"Роснефть", percent:4, desc:"На топливо" },
      { name:"Лукойл", percent:3, desc:"На топливо" }
    ],
    "Одежда": [
      { name:"Lamoda", percent:7, desc:"Онлайн", top:true },
      { name:"Ostin", percent:4, desc:"Онлайн/оффлайн" },
      { name:"Sportmaster", percent:3, desc:"На покупки" }
    ],
    "Электроника": [
      { name:"М.Видео", percent:5, desc:"До 5000₽", top:true },
      { name:"DNS", percent:3, desc:"Без ограничений" }
    ],
    "Путешествия": [
      { name:"Ostrovok", percent:8, desc:"На бронирования", top:true },
      { name:"Aviasales", percent:4, desc:"На билеты" }
    ],
    "Развлечения": [
      { name:"КиноПоиск", percent:6, desc:"Подписка/покупки", top:true },
      { name:"Okko", percent:4, desc:"Подписка" }
    ],
    "Здоровье": [
      { name:"Аптека.ру", percent:6, desc:"На заказы", top:true },
      { name:"Eapteka", percent:4, desc:"На покупки" }
    ]
  },

  "Т-Банк": {
    "Рестораны": [
      { name:"Додо Пицца", percent:7, desc:"На доставку", top:true },
      { name:"KFC", percent:5, desc:"На меню" },
      { name:"Тануки", percent:4, desc:"На заказы" }
    ],
    "Супермаркеты": [
      { name:"Самокат", percent:8, desc:"На доставку", top:true },
      { name:"ВкусВилл", percent:5, desc:"На покупки" },
      { name:"Магнит", percent:4, desc:"На покупки" }
    ],
    "АЗС": [
      { name:"Лукойл", percent:7, desc:"На топливо", top:true },
      { name:"Нефтьмагистраль", percent:6, desc:"На заправку" },
      { name:"BP", percent:5, desc:"На покупки" },
      { name:"Татнефть", percent:4, desc:"На топливо" }
    ],
    "Одежда": [
      { name:"Zara", percent:6, desc:"Онлайн", top:true },
      { name:"H&M", percent:5, desc:"Онлайн покупки" },
      { name:"Wildberries", percent:4, desc:"На покупки" }
    ],
    "Электроника": [
      { name:"Ситилинк", percent:6, desc:"До 5000₽", top:true },
      { name:"М.Видео", percent:5, desc:"На покупки" },
      { name:"DNS", percent:3, desc:"Без ограничений" }
    ],
    "Путешествия": [
      { name:"OneTwoTrip", percent:8, desc:"На брони", top:true },
      { name:"Яндекс Путешествия", percent:6, desc:"На брони" }
    ],
    "Развлечения": [
      { name:"IVI", percent:6, desc:"Подписка", top:true },
      { name:"VK Музыка", percent:4, desc:"Подписка" }
    ],
    "Здоровье": [
      { name:"Аптека 36.6", percent:5, desc:"На покупки", top:true },
      { name:"Аптека.ру", percent:4, desc:"На заказы" }
    ]
  },

  "Сбер": {
    "Рестораны": [
      { name:"Яндекс Еда", percent:7, desc:"Бонусами Спасибо", top:true },
      { name:"KFC", percent:5, desc:"Бонусами" }
    ],
    "Супермаркеты": [
      { name:"Магнит", percent:5, desc:"Бонусами Спасибо", top:true },
      { name:"Лента", percent:4, desc:"Бонусами Спасибо" }
    ],
    "АЗС": [
      { name:"Газпромнефть", percent:5, desc:"Бонусами", top:true },
      { name:"Лукойл", percent:4, desc:"Бонусами" }
    ],
    "Одежда": [
      { name:"Lamoda", percent:6, desc:"Бонусами", top:true },
      { name:"Ozon Fashion", percent:4, desc:"Бонусами" }
    ],
    "Электроника": [
      { name:"М.Видео", percent:5, desc:"Бонусами", top:true },
      { name:"Ситилинк", percent:4, desc:"Бонусами" }
    ],
    "Путешествия": [
      { name:"СберТревел", percent:7, desc:"При оплате картой", top:true },
      { name:"Ostrovok", percent:5, desc:"Бонусами" }
    ],
    "Развлечения": [
      { name:"Okko", percent:6, desc:"Подписка", top:true },
      { name:"КиноПоиск", percent:4, desc:"Покупки" }
    ],
    "Здоровье": [
      { name:"ЕАПТЕКА", percent:5, desc:"Бонусами", top:true },
      { name:"Аптека.ру", percent:4, desc:"Бонусами" }
    ]
  },

  "ВТБ": {
    "Рестораны": [
      { name:"Burger King", percent:6, desc:"По мультикарте", top:true },
      { name:"Додо Пицца", percent:5, desc:"На заказы" }
    ],
    "Супермаркеты": [
      { name:"Перекрёсток", percent:6, desc:"До 2000₽", top:true },
      { name:"Пятёрочка", percent:4, desc:"На покупки" }
    ],
    "АЗС": [
      { name:"Газпромнефть", percent:5, desc:"До 2000₽", top:true },
      { name:"Лукойл", percent:4, desc:"По мультикарте" }
    ],
    "Одежда": [
      { name:"Lamoda", percent:6, desc:"Онлайн", top:true },
      { name:"Ostin", percent:4, desc:"На покупки" }
    ],
    "Электроника": [
      { name:"М.Видео", percent:6, desc:"До 5000₽", top:true },
      { name:"DNS", percent:3, desc:"Без ограничений" }
    ],
    "Путешествия": [
      { name:"OneTwoTrip", percent:7, desc:"На брони", top:true },
      { name:"Aviasales", percent:4, desc:"На билеты" }
    ],
    "Развлечения": [
      { name:"IVI", percent:6, desc:"Подписка", top:true },
      { name:"Okko", percent:4, desc:"Подписка" }
    ],
    "Здоровье": [
      { name:"Аптека.ру", percent:5, desc:"На заказы", top:true },
      { name:"Eapteka", percent:4, desc:"На покупки" }
    ]
  },

  "Яндекс Банк": {
    "Рестораны": [
      { name:"Яндекс Еда", percent:10, desc:"Баллы Плюса", top:true },
      { name:"Delivery Club", percent:6, desc:"Баллы Плюса" }
    ],
    "Супермаркеты": [
      { name:"Яндекс Лавка", percent:10, desc:"Баллы Плюса", top:true },
      { name:"Самокат", percent:6, desc:"Баллы Плюса" }
    ],
    "АЗС": [
      { name:"Яндекс Заправки", percent:7, desc:"Баллы Плюса", top:true },
      { name:"Газпромнефть", percent:4, desc:"Баллы" }
    ],
    "Одежда": [
      { name:"Lamoda", percent:7, desc:"Баллы Плюса", top:true },
      { name:"Wildberries", percent:4, desc:"Баллы" }
    ],
    "Электроника": [
      { name:"Яндекс Маркет", percent:6, desc:"Баллы Плюса", top:true },
      { name:"DNS", percent:3, desc:"Баллы" }
    ],
    "Путешествия": [
      { name:"Яндекс Путешествия", percent:8, desc:"Баллы Плюса", top:true },
      { name:"Ostrovok", percent:5, desc:"Баллы" }
    ],
    "Развлечения": [
      { name:"Кинопоиск", percent:6, desc:"Баллы Плюса", top:true },
      { name:"Яндекс Музыка", percent:5, desc:"Баллы Плюса" }
    ],
    "Здоровье": [
      { name:"Аптека.ру", percent:5, desc:"Баллы", top:true },
      { name:"Eapteka", percent:4, desc:"Баллы" }
    ]
  }
};

/* ===== Роутинг (вкладки) ===== */
const stack = [];

function mount(el, animate = true){
  el.classList.add("screen");
  if (animate) el.classList.add("slide-in");
  view.innerHTML = "";
  view.appendChild(el);
}

function push(renderFn){
  stack.push(renderFn);
  mount(renderFn(), true);
}

function pop(){
  if (stack.length <= 1) return;
  stack.pop();
  const prev = stack[stack.length - 1];
  mount(prev(), true);
}

/* ===== Helpers ===== */
function getCategoryText(item){
  // "🍕 Рестораны" -> { emoji:"🍕", text:"Рестораны" }
  const emoji = item.split(" ")[0];
  const text = item.substring(2).trim();
  return { emoji, text };
}

function categoryIcon(categoryText){
  // В третьем экране слева хотим иконку по категории (как на скрине)
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
  return map[categoryText] || "⭐️";
}

/* ===== Screen 1: Landing + Banks ===== */
function ScreenBanks(){
  const root = document.createElement("div");

  const head = document.createElement("div");
  head.className = "profile";
  head.innerHTML = `
    <div class="avatar"><img src="${profile.avatar}" alt="logo"></div>
    <h1>${profile.title}</h1>
    <p>${profile.subtitle}</p>
  `;
  root.appendChild(head);

  const list = document.createElement("div");
  list.className = "bank-list";

  BANKS.forEach(bank=>{
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
      <div class="arrow" style="background:${bank.bg};color:${bank.color}">→</div>
    `;

    card.addEventListener("click", () => push(() => ScreenCategories(bank)));
    list.appendChild(card);
  });

  root.appendChild(list);
  return root;
}

/* ===== Screen 2: Categories tiles ===== */
function ScreenCategories(bank){
  const root = document.createElement("div");

  const back = document.createElement("div");
  back.className = "back";
  back.textContent = "← Назад к банкам";
  back.addEventListener("click", pop);
  root.appendChild(back);

  const row = document.createElement("div");
  row.className = "title-row";
  row.innerHTML = `
    <div class="logo-box" style="width:64px;height:64px;border-radius:20px;">
      <img src="${bank.logo}" alt="${bank.name}">
    </div>
    <div>
      <h2>${bank.name}</h2>
      <div class="subtitle">Выберите категорию расходов</div>
    </div>
  `;
  root.appendChild(row);

  const grid = document.createElement("div");
  grid.className = "category-grid";

  categories.forEach(item=>{
    const {emoji, text} = getCategoryText(item);

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

/* ===== Screen 3: Shops ===== */
function ScreenShops(bank, categoryText){
  const root = document.createElement("div");
  root.className = "shop-screen";

  const back = document.createElement("div");
  back.className = "back";
  back.textContent = "← Назад к категориям";
  back.addEventListener("click", pop);
  root.appendChild(back);

  const header = document.createElement("div");
  header.className = "shop-header";
  header.innerHTML = `
    <div class="shop-title">${categoryText}</div>
    <div class="shop-subtitle">${bank.name} — условия кэшбэка</div>
  `;
  root.appendChild(header);

  const list = (DATA[bank.name]?.[categoryText] || [])
    .slice()
    .sort((a,b)=> (b.percent||0) - (a.percent||0));

  // если пока нет данных — покажем заглушку
  if (list.length === 0){
    const empty = document.createElement("div");
    empty.className = "bank-card";
    empty.style.cursor = "default";
    empty.innerHTML = `
      <div class="bank-left">
        <div class="logo-box"><span style="font-size:26px;">${categoryIcon(categoryText)}</span></div>
        <div class="bank-text">
          <h2>Пока пусто</h2>
          <p>Добавьте магазины для этой категории</p>
        </div>
      </div>
      <div class="arrow" style="background:rgba(0,0,0,.05);color:#6b7280">…</div>
    `;
    root.appendChild(empty);
    return root;
  }

  list.forEach(shop=>{
    const card = document.createElement("div");
    card.className = "shop-card";

    card.innerHTML = `
      <div class="shop-left">
        <div class="shop-icon">${categoryIcon(categoryText)}</div>
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

    root.appendChild(card);
  });

  return root;
}

/* ===== Init ===== */
stack.push(() => ScreenBanks());
mount(ScreenBanks(), false);