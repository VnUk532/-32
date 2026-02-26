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
   CSV LOADER
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
  if (["true","1","yes","да"].includes(s)) return true;
  if (["false","0","no","нет"].includes(s)) return false;
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

  r.top = toBool(r.top) ?? false;
  r.active = toBool(r.active) ?? true;

  return r;
}

/* =========================
   HELPERS
========================= */
function uniq(arr){ return [...new Set(arr)]; }

function getBanks(){
  return uniq(ITEMS.map(x=>x.bank).filter(Boolean)).sort();
}

function getCategoriesForBank(bankName){
  return uniq(
    ITEMS.filter(x=>x.bank===bankName).map(x=>x.category)
  ).filter(Boolean).sort();
}

function getShops(bankName, category){
  return ITEMS
    .filter(x=>x.bank===bankName && x.category===category)
    .slice()
    .sort((a,b)=>(b.percent||0)-(a.percent||0));
}

function catEmoji(category){
  const map={
    "Рестораны":"🍕",
    "Супермаркеты":"🛒",
    "АЗС":"⛽",
    "Одежда":"👗",
    "Электроника":"📱",
    "Путешествия":"✈️",
    "Развлечения":"🎬",
    "Здоровье":"💊",
    "Маркетплейсы":"🛍️",
    "Дом и ремонт":"🧰",
    "Транспорт":"🚕"
  };
  return map[category] || "⭐️";
}

function norm(s){
  return String(s??"").trim().toLowerCase();
}

function searchOffersByShop(query){
  const q = norm(query);
  if(!q) return [];
  const hits = ITEMS.filter(x =>
    norm(x.shop).includes(q) || norm(x.desc).includes(q)
  );
  hits.sort((a,b)=>(b.percent||0)-(a.percent||0));
  return hits;
}

/* =========================
   ROUTER
========================= */
const stack=[];

function mount(node){
  node.classList.add("screen");
  view.innerHTML="";
  view.appendChild(node);
}

function push(render){
  stack.push(render);
  mount(render());
}

function pop(){
  if(stack.length>1){
    stack.pop();
    mount(stack[stack.length-1]());
  }
}

/* =========================
   SCREENS
========================= */
function ScreenBanks(){
  const root=document.createElement("div");

  const profile=document.createElement("div");
  profile.className="profile";
  profile.innerHTML=`
    <div class="brand-line">
      <div class="brand-mark">
        <img src="logo.png" alt="logo">
      </div>
      <div class="brand-name">
        <div>Выгодный</div>
        <div>ментор</div>
      </div>
    </div>
    <div class="brand-subtitle">Кэшбэк-агрегатор банков</div>
  `;
  root.appendChild(profile);

  const searchWrap=document.createElement("div");
  searchWrap.className="search-wrap";
  searchWrap.innerHTML=`
    <input class="search-input" id="globalShopSearch"
      placeholder="Поиск магазина: где есть кэшбэк?">
  `;
  root.appendChild(searchWrap);

  const resultsBox=document.createElement("div");
  root.appendChild(resultsBox);

  const list=document.createElement("div");
  list.className="bank-list";
  root.appendChild(list);

  const logoMap={
    "Альфа-Банк":"alfa.png",
    "Т-Банк":"tbank.png",
    "Сбер":"sber.png",
    "ВТБ":"vtb.png",
    "Яндекс Банк":"yandex.png"
  };

  function renderBanks(){
    list.innerHTML="";
    getBanks().forEach(bankName=>{
      const card=document.createElement("div");
      card.className="bank-card";
      card.innerHTML=`
        <div class="bank-left">
          <div class="logo-box">
            <img src="${logoMap[bankName]||""}" alt="${bankName}">
          </div>
          <div class="bank-text">
            <h2>${bankName}</h2>
            <p>Выбрать категории кэшбэка</p>
          </div>
        </div>
        <div class="arrow">
          <svg viewBox="0 0 24 24">
            <path d="M9 6l6 6-6 6"></path>
          </svg>
        </div>
      `;
      card.addEventListener("click",()=>push(()=>ScreenCategories(bankName)));
      list.appendChild(card);
    });
  }

  function renderGlobalResults(q){
    const qq=norm(q);

    if(!qq){
      resultsBox.innerHTML="";
      list.style.display="";
      return;
    }

    list.style.display="none";
    const hits=searchOffersByShop(qq);

    if(!hits.length){
      resultsBox.innerHTML=
        `<div class="empty-note">Ничего не найдено.</div>`;
      return;
    }

    resultsBox.innerHTML="";
    hits.slice(0,30).forEach(row=>{
      const card=document.createElement("div");
      card.className="shop-card";
      card.innerHTML=`
        <div class="shop-left">
          <div class="shop-icon">${catEmoji(row.category)}</div>
          <div>
            <div class="shop-name">${row.shop}</div>
            <div class="shop-desc">
              ${row.bank} · ${row.category}
            </div>
          </div>
        </div>
        <div class="shop-right">
          ${row.top?`<div class="shop-badge">ТОП</div>`:""}
          <div class="shop-percent">${row.percent}%</div>
          <div class="shop-cash">кэшбэк</div>
        </div>
      `;
      card.addEventListener("click",()=>push(()=>ScreenDetails(row)));
      resultsBox.appendChild(card);
    });
  }

  renderBanks();
  searchWrap.querySelector("#globalShopSearch")
    .addEventListener("input",(e)=>renderGlobalResults(e.target.value));

  return root;
}

function ScreenCategories(bankName){
  const root=document.createElement("div");

  const back=document.createElement("div");
  back.className="back";
  back.textContent="← Назад к банкам";
  back.addEventListener("click",pop);
  root.appendChild(back);

  const logoMap={
    "Альфа-Банк":"alfa.png",
    "Т-Банк":"tbank.png",
    "Сбер":"sber.png",
    "ВТБ":"vtb.png",
    "Яндекс Банк":"yandex.png"
  };

  const header=document.createElement("div");
  header.className="cat-header";
  header.innerHTML=`
    <div class="cat-header-row">
      <div class="logo-box">
        <img src="${logoMap[bankName]||""}" alt="${bankName}">
      </div>
      <div>
        <div class="cat-title">${bankName}</div>
        <div class="cat-subtitle">
          Выберите категорию расходов
        </div>
      </div>
    </div>
  `;
  root.appendChild(header);

  const grid=document.createElement("div");
  grid.className="category-grid";

  getCategoriesForBank(bankName).forEach(cat=>{
    const tile=document.createElement("div");
    tile.className="category-card";
    tile.innerHTML=`
      <div class="category-emoji">${catEmoji(cat)}</div>
      <div class="category-text">${cat}</div>
    `;
    tile.addEventListener("click",()=>push(()=>ScreenShops(bankName,cat)));
    grid.appendChild(tile);
  });

  root.appendChild(grid);
  return root;
}

function ScreenShops(bankName,category){
  const root=document.createElement("div");

  const back=document.createElement("div");
  back.className="back";
  back.textContent="← Назад";
  back.addEventListener("click",pop);
  root.appendChild(back);

  const header=document.createElement("div");
  header.className="shop-header";
  header.innerHTML=`
    <div class="shop-title">${category}</div>
    <div class="shop-subtitle">
      ${bankName} — предложения
    </div>
  `;
  root.appendChild(header);

  const listBox=document.createElement("div");
  root.appendChild(listBox);

  getShops(bankName,category).forEach(row=>{
    const card=document.createElement("div");
    card.className="shop-card";
    card.innerHTML=`
      <div class="shop-left">
        <div class="shop-icon">${catEmoji(category)}</div>
        <div>
          <div class="shop-name">${row.shop}</div>
          <div class="shop-desc">${row.desc||""}</div>
        </div>
      </div>
      <div class="shop-right">
        ${row.top?`<div class="shop-badge">ТОП</div>`:""}
        <div class="shop-percent">${row.percent}%</div>
        <div class="shop-cash">кэшбэк</div>
      </div>
    `;
    card.addEventListener("click",()=>push(()=>ScreenDetails(row)));
    listBox.appendChild(card);
  });

  return root;
}

function ScreenDetails(row){
  const root=document.createElement("div");

  const back=document.createElement("div");
  back.className="back";
  back.textContent="← Назад";
  back.addEventListener("click",pop);
  root.appendChild(back);

  const header=document.createElement("div");
  header.className="shop-header";
  header.innerHTML=`
    <div class="shop-title">${row.shop}</div>
    <div class="shop-subtitle">
      ${row.bank} · ${row.category}
    </div>
  `;
  root.appendChild(header);

  const box=document.createElement("div");
  box.className="details-box";
  box.innerHTML=`
    <div class="details-row">
      <div class="details-dot"></div>
      <div class="details-text">
        Ставка: ${row.percent}%
      </div>
    </div>
  `;
  root.appendChild(box);

  return root;
}

/* =========================
   INIT
========================= */
async function init(){
  try{
    ITEMS=await loadData();
  }catch(e){
    view.innerHTML="<div>Ошибка загрузки данных</div>";
    return;
  }

  stack.length=0;
  stack.push(()=>ScreenBanks());
  mount(ScreenBanks());
}

document.addEventListener("DOMContentLoaded",init);