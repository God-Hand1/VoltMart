/* =========================================================================
   VoltMart — hash router + views
   Vanilla JS, no framework, no build step. Open index.html directly.
   ========================================================================= */

const app = document.getElementById("app");
const overlay = document.getElementById("overlay");
const overlayCard = document.getElementById("overlay-card");
const toastEl = document.getElementById("toast");

/* ---------- tiny helpers ------------------------------------------------ */
const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) =>
    ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]));

function toast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toastEl.classList.remove("show"), 1900);
}

function openSheet(html, { center = false } = {}) {
  overlayCard.innerHTML = html;
  overlay.classList.toggle("overlay--center", center);
  overlay.hidden = false;
}
function closeSheet() {
  overlay.hidden = true;
  overlayCard.innerHTML = "";
}
overlay.addEventListener("click", (e) => { if (e.target === overlay) closeSheet(); });

async function copyText(text) {
  try { await navigator.clipboard.writeText(text); }
  catch { /* clipboard blocked on file:// — fall through to toast */ }
  toast(t("copied"));
}

/* ---------- shared chrome ---------------------------------------------- */
const LOGO_SVG = `
  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M13 2 4.5 13.2h6L11 22l8.5-11.2h-6L13 2Z"
          fill="currentColor" stroke="currentColor" stroke-width="1.2"
          stroke-linejoin="round"/>
  </svg>`;

function tabbar(active) {
  const tabs = [
    { key:"home",  ic:"⌂", lb:t("welcomeBack").split(" ")[0] === "Welcome" ? "Home" : "होम" },
    { key:"shop",  ic:"▦", lb:state.lang==="hi" ? "योजनाएँ" : "Plans" },
    { key:"team",  ic:"◉", lb:state.lang==="hi" ? "टीम" : "Team" },
    { key:"my",    ic:"☺", lb:state.lang==="hi" ? "मेरा" : "My" },
  ];
  return `<nav class="tabbar" aria-label="Primary">
    ${tabs.map(x => `
      <a href="#/${x.key}" ${x.key===active ? 'aria-current="page"' : ""}>
        <span class="ic">${x.ic}</span><span>${esc(x.lb)}</span>
      </a>`).join("")}
  </nav>`;
}

function topbar(title, back = "#/home") {
  return `<header class="topbar">
    <a class="backbtn" href="${back}" aria-label="Back">‹</a>
    <h1>${esc(title)}</h1>
  </header>`;
}

/* ---------- auth screens ------------------------------------------------ */
function viewLogin() {
  app.className = "shell";
  app.innerHTML = `
    <button class="langbtn" id="langbtn" aria-haspopup="true">
      ${state.lang === "hi" ? "हिंदी" : "English"} ▾
    </button>
    <div id="langmenu-host"></div>

    <div class="page" style="padding-top:44px">
      <div class="brand">
        <div class="brand__mark">${LOGO_SVG}</div>
        <div>
          <div class="brand__name">${esc(BRAND.name)}</div>
          <div class="brand__sub" style="justify-content:center;margin-top:5px">
            <span class="pill-ok">✓</span> ${esc(BRAND.tagline)}
          </div>
        </div>
      </div>

      <div class="card" style="margin-top:6px">
        <h2 style="font-size:21px;font-weight:800">${esc(t("welcomeBack"))}</h2>
        <p class="muted" style="font-size:13px;margin:6px 0 20px">${esc(t("loginSub"))}</p>

        <form id="loginform" style="display:flex;flex-direction:column;gap:15px">
          <div class="field">
            <label for="phone">${esc(t("mobile"))}</label>
            <div class="inputwrap">
              <span class="prefix">+91</span>
              <input id="phone" name="phone" type="tel" inputmode="numeric"
                     placeholder="9000000000" autocomplete="tel" required>
            </div>
          </div>

          <div class="field">
            <label for="pw">${esc(t("password"))}</label>
            <div class="inputwrap">
              <input id="pw" name="pw" type="${state.showPassword ? "text" : "password"}"
                     placeholder="••••••••" autocomplete="current-password" required>
              <button type="button" class="iconbtn" id="togglepw"
                      aria-label="${esc(state.showPassword ? t("hidePassword") : t("showPassword"))}">
                ${state.showPassword ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          <button class="btn btn--primary" type="submit">${esc(t("login"))}</button>
        </form>
      </div>

      <p class="center" style="font-size:13px;color:var(--muted)">
        ${esc(t("noAccount"))}
        <a href="#/register" style="color:var(--brand);font-weight:700">${esc(t("register"))}</a>
      </p>
    </div>`;

  wireLangButton();

  document.getElementById("togglepw").onclick = () => {
    state.showPassword = !state.showPassword;
    viewLogin();
  };
  document.getElementById("loginform").onsubmit = (e) => {
    e.preventDefault();
    state.loggedIn = true;
    location.hash = "#/home";
  };
}

function viewRegister() {
  app.className = "shell";
  const invite = (location.hash.split("invite=")[1] || "").split("&")[0];

  app.innerHTML = `
    <header class="topbar"><a class="backbtn" href="#/login">‹</a><h1></h1></header>
    <div class="page" style="padding-top:0">
      <div>
        <h2 style="font-size:21px;font-weight:800">${esc(t("createAccount"))}</h2>
        <p class="muted" style="font-size:13px;margin:6px 0 0">${esc(t("registerSub"))}</p>
      </div>

      <form id="regform" class="card" style="display:flex;flex-direction:column;gap:15px">
        <div class="field">
          <label for="reg-phone">${esc(t("mobile"))}</label>
          <div class="inputwrap"><span class="prefix">+91</span>
            <input id="reg-phone" name="reg-phone" type="tel" inputmode="numeric" placeholder="9000000000" required></div>
        </div>
        <div class="field">
          <label for="reg-pw">${esc(t("password"))}</label>
          <div class="inputwrap"><input id="reg-pw" name="reg-pw" type="password" placeholder="••••••••" required></div>
        </div>
        <div class="field">
          <label for="reg-pw2">${esc(t("confirmPassword"))}</label>
          <div class="inputwrap"><input id="reg-pw2" name="reg-pw2" type="password" placeholder="••••••••" required></div>
        </div>
        <div class="field">
          <label for="reg-ref">${esc(t("referralOptional"))}</label>
          <div class="inputwrap"><input id="reg-ref" name="reg-ref" type="text" value="${esc(invite)}" placeholder="000000"></div>
        </div>
        <button class="btn btn--primary" type="submit">${esc(t("createAccount"))}</button>
      </form>

      <p class="center" style="font-size:13px;color:var(--muted)">
        ${esc(t("alreadyHave"))}
        <a href="#/login" style="color:var(--brand);font-weight:700">${esc(t("login"))}</a>
      </p>
    </div>`;

  document.getElementById("regform").onsubmit = (e) => {
    e.preventDefault();
    toast(t("demoNotice"));
  };
}

/* ---------- home -------------------------------------------------------- */
function viewHome() {
  app.className = "shell shell--tabbed";
  const feed = ACTIVITY_FEED.slice(0, 5);

  app.innerHTML = `
    <div class="page" style="padding-top:16px">
      <section class="hero">
        <div class="hero__row">
          <div class="hero__avatar">${esc(ACCOUNT.name[0])}</div>
          <div>
            <div class="hero__name">${esc(ACCOUNT.name)}</div>
            <span class="hero__tier">${esc(ACCOUNT.tier)} · ${esc(t("sampleData"))}</span>
          </div>
          <a class="hero__bell" href="#/transactions" aria-label="${esc(t("notifications"))}">🔔</a>
        </div>

        <div class="hero__bal">
          <div class="eyebrow" style="color:rgba(255,255,255,.72)">${esc(t("totalBalance"))}</div>
          <div class="hero__amount"><span class="cur">₹</span>${money(ACCOUNT.balance)}</div>
          <div style="font-size:11.5px;opacity:.75;margin-top:5px">${esc(t("wallet"))}</div>
        </div>

        <div class="hero__actions">
          <a href="#/recharge"><span>⬆</span>${esc(t("recharge"))}</a>
          <a href="#/withdraw"><span>⬇</span>${esc(t("withdraw"))}</a>
        </div>
      </section>

      <section class="grid4">
        ${tile("#/recharge","🎁",t("giftReward"))}
        ${tile("#/team","👥",t("invite"))}
        ${tile("#/about","ℹ️",t("aboutUs"))}
        ${tile("#/transactions","📈",t("salary"))}
        ${tile("#/shop","▦",t("myProject"))}
        ${tile("#/about","💬",t("support"))}
        ${tile("#/transactions","🧾",t("myTransactions"))}
        ${tile("#/my","⚙️",t("myAccount"))}
      </section>

      <section>
        <div class="sechead">
          <h2>${esc(t("dailyIncomeProducts"))}</h2>
          <span class="pill-ok" style="background:var(--tint);color:var(--brand)">${esc(t("sampleData"))}</span>
        </div>
        ${planCard(PLANS.fixed[0])}
      </section>

      <section class="block">
        <div class="sechead">
          <h3>${esc(t("recentWithdrawals"))}</h3>
          <a href="#/transactions">${esc(t("viewAll"))}</a>
        </div>
        <div class="rowlist">
          ${feed.map(a => `
            <div class="row">
              <div class="avatar">${esc(a.code)}</div>
              <div class="row__main">
                <div class="row__t">${esc(a.masked)}</div>
                <div class="row__s">${esc(t("payoutSuccess"))} · ${esc(a.when)}</div>
              </div>
              <div class="row__end"><div class="row__amt pos">+₹${money(a.amount)}</div></div>
            </div>`).join("")}
        </div>
      </section>

      <p class="center" style="font-size:11.5px;color:var(--muted);margin:4px 0 0">
        ${esc(t("demoNotice"))}
      </p>
    </div>
    ${tabbar("home")}`;

  wirePlanButtons();
}

const tile = (href, ic, lb) => `
  <a class="tile" href="${href}">
    <div class="tile__ic">${ic}</div>
    <div class="tile__lb">${esc(lb)}</div>
  </a>`;

/* ---------- plan card + shop -------------------------------------------- */
function planCard(p) {
  return `
  <article class="plan">
    <div class="plan__head">
      <div class="plan__price">
        <small>${esc(t("price"))}</small>₹${money(p.price)}
      </div>
      <div class="plan__title">${esc(p.title)}</div>
    </div>
    <div class="plan__body">
      <div class="plan__stats">
        <div class="plan__stat"><div class="k">${esc(t("term"))}</div><div class="v neutral">${p.days} ${esc(t("days"))}</div></div>
        <div class="plan__stat"><div class="k">${esc(t("dailyIncome"))}</div><div class="v">₹${money(p.daily)}</div></div>
        <div class="plan__stat"><div class="k">${esc(t("total"))}</div><div class="v">₹${money(p.daily * p.days)}</div></div>
      </div>
      <button class="btn btn--primary" data-plan="${esc(p.id)}">${esc(t("buyNow"))}</button>
    </div>
  </article>`;
}

function findPlan(id) {
  for (const k of Object.keys(PLANS)) {
    const hit = PLANS[k].find(p => p.id === id);
    if (hit) return hit;
  }
  return null;
}

function wirePlanButtons() {
  document.querySelectorAll("[data-plan]").forEach(btn => {
    btn.onclick = () => {
      const p = findPlan(btn.dataset.plan);
      if (!p) return;
      openSheet(`
        <div class="sheet__title">${esc(t("buyTitle"))}</div>
        <p class="sheet__sub">${esc(t("buySub"))}</p>
        <div class="kv"><span class="k">${esc(t("price"))}</span><span class="v">₹${money(p.price)}</span></div>
        <div class="kv"><span class="k">${esc(t("term"))}</span><span class="v">${p.days} ${esc(t("days"))}</span></div>
        <div class="kv"><span class="k">${esc(t("dailyIncome"))}</span><span class="v">₹${money(p.daily)}</span></div>
        <div class="kv total"><span class="k">${esc(t("totalRevenue"))}</span><span class="v">₹${money(p.daily * p.days)}</span></div>
        <div class="kv"><span class="k">${esc(t("purchaseLimit"))}</span><span class="v">${esc(p.limit)}</span></div>
        <div class="sheet__actions">
          <button class="btn btn--ghost" data-close>${esc(t("no"))}</button>
          <button class="btn btn--primary" data-close>${esc(t("yesBuy"))}</button>
        </div>`);
      overlayCard.querySelectorAll("[data-close]").forEach(b => b.onclick = () => {
        closeSheet(); toast(t("demoNotice"));
      });
    };
  });
}

function viewShop() {
  app.className = "shell shell--tabbed";
  const list = PLANS[state.planTab] || [];

  app.innerHTML = `
    ${topbar(t("investmentPlans"), "#/home")}
    <div class="page" style="padding-top:0">
      <div class="statstrip">
        <div class="block"><div class="k">${esc(t("todaysIncome"))}</div><div class="v">₹${money(state.todayIncome)}</div></div>
        <div class="block"><div class="k">${esc(t("activePlans"))}</div><div class="v">${state.activePlans}</div></div>
      </div>

      <div class="tabs" role="tablist">
        ${PLAN_TABS.map(x => `
          <button role="tab" data-tab="${x.key}"
                  aria-selected="${x.key === state.planTab}">
            ${esc(x.label)} (${PLANS[x.key].length})
          </button>`).join("")}
      </div>

      <div style="display:flex;flex-direction:column;gap:14px">
        ${list.length ? list.map(planCard).join("") : emptyState()}
      </div>

      <div class="block">
        <h4 style="font-size:14px;font-weight:800;margin-bottom:6px">${esc(t("projectDescription"))}</h4>
        <p class="muted" style="font-size:12.5px;line-height:1.6;margin:0">${esc(t("demoNotice"))}</p>
      </div>
    </div>
    ${tabbar("shop")}`;

  document.querySelectorAll("[data-tab]").forEach(b => {
    b.onclick = () => { state.planTab = b.dataset.tab; viewShop(); };
  });
  wirePlanButtons();
}

const emptyState = () => `
  <div class="empty">
    <div class="empty__ic">▦</div>
    <div class="empty__t">${esc(t("sampleData"))}</div>
    <div class="empty__s">${esc(t("demoNotice"))}</div>
  </div>`;

/* ---------- team -------------------------------------------------------- */
function viewTeam() {
  app.className = "shell shell--tabbed";
  const link = `https://example.com/app/register?invite=${ACCOUNT.referralCode}`;

  app.innerHTML = `
    ${topbar(t("myNetwork"), "#/home")}
    <div class="page" style="padding-top:0">
      <div class="block">
        <div class="eyebrow">${esc(t("referralCode"))}</div>
        <div class="codebox" style="margin-top:10px">
          <div class="code">${esc(ACCOUNT.referralCode)}</div>
          <button class="btn btn--ghost btn--sm" id="copycode">${esc(t("copyCode"))}</button>
        </div>
        <div style="display:flex;gap:10px;margin-top:12px">
          <div class="tint" style="flex:1;text-align:center">
            <div class="eyebrow">${esc(t("active"))}</div>
            <div style="font-family:var(--font-display);font-weight:800;font-size:18px;margin-top:3px">0</div>
          </div>
          <div class="tint" style="flex:1;text-align:center">
            <div class="eyebrow">${esc(t("inactive"))}</div>
            <div style="font-family:var(--font-display);font-weight:800;font-size:18px;margin-top:3px">0</div>
          </div>
        </div>
        <div class="inputwrap" style="margin-top:12px">
          <input id="invlink" readonly value="${esc(link)}" style="font-size:12px">
        </div>
        <button class="btn btn--ghost" id="copylink" style="margin-top:10px">${esc(t("copyLink"))}</button>
      </div>

      <div class="block">
        <h3 style="font-size:16px;font-weight:800">${esc(t("inviteEarn"))}</h3>
        <p class="muted" style="font-size:12.5px;margin:5px 0 14px">${esc(t("inviteSub"))}</p>
        <div class="sharegrid">
          <button data-share="WhatsApp"><div class="ic">💬</div><div class="lb">WhatsApp</div></button>
          <button data-share="Telegram"><div class="ic">✈️</div><div class="lb">Telegram</div></button>
          <button data-share="Facebook"><div class="ic">📘</div><div class="lb">Facebook</div></button>
          <button data-share="More"><div class="ic">⋯</div><div class="lb">More</div></button>
        </div>
      </div>

      <div class="block">
        <div class="sechead">
          <h3 style="font-size:15.5px">${esc(t("networkOverview"))}</h3>
          <a href="#/transactions">${esc(t("viewDetails"))}</a>
        </div>
        <div class="statstrip" style="grid-template-columns:repeat(3,1fr)">
          <div class="tint" style="text-align:center"><div class="k eyebrow">${esc(t("teamSize"))}</div><div style="font-family:var(--font-display);font-weight:800;font-size:18px;margin-top:4px">0</div></div>
          <div class="tint" style="text-align:center"><div class="k eyebrow">${esc(t("teamRecharge"))}</div><div style="font-family:var(--font-display);font-weight:800;font-size:18px;margin-top:4px">₹0</div></div>
          <div class="tint" style="text-align:center"><div class="k eyebrow">${esc(t("myIncome"))}</div><div style="font-family:var(--font-display);font-weight:800;font-size:18px;margin-top:4px">₹0</div></div>
        </div>
      </div>

      <div>
        <div class="sechead">
          <h3 style="font-size:15.5px">${esc(t("teamLevels"))}</h3>
          <a href="#/transactions">${esc(t("viewAll"))}</a>
        </div>
        ${TEAM_LEVELS.map(lv => `
          <div class="level">
            <div class="level__badge">${esc(lv.level)}</div>
            <div class="row__main">
              <div class="row__t">${esc(lv.level === "L1" ? t("directTeam") : lv.name)}</div>
              <div class="row__s">${lv.members} ${esc(t("members"))} · ${esc(lv.commission)} ${esc(t("commission"))}</div>
            </div>
            <div class="row__end"><div class="eyebrow">${esc(t("teamRecharge"))}</div><div class="row__amt">₹0</div></div>
          </div>`).join("")}
      </div>

      <div>
        <h3 style="font-size:15.5px;font-weight:800;margin-bottom:10px">${esc(t("teamActivity"))}</h3>
        ${emptyState()}
      </div>
    </div>
    ${tabbar("team")}`;

  document.getElementById("copycode").onclick = () => copyText(ACCOUNT.referralCode);
  document.getElementById("copylink").onclick = () => copyText(link);
  document.querySelectorAll("[data-share]").forEach(b =>
    b.onclick = () => toast(t("demoNotice")));
}

/* ---------- my ---------------------------------------------------------- */
function viewMy() {
  app.className = "shell shell--tabbed";

  app.innerHTML = `
    ${topbar(t("myAccount"), "#/home")}
    <div class="page" style="padding-top:0">
      <div class="card" style="display:flex;align-items:center;gap:14px">
        <div class="hero__avatar" style="background:var(--tint);color:var(--brand)">${esc(ACCOUNT.name[0])}</div>
        <div style="flex:1">
          <div style="font-family:var(--font-display);font-weight:800;font-size:16px">${esc(ACCOUNT.name)}</div>
          <div class="muted" style="font-size:12.5px;margin-top:2px">${esc(ACCOUNT.phone.slice(0,3))}***${esc(ACCOUNT.phone.slice(-4))}</div>
        </div>
        <a class="btn btn--ghost btn--sm" href="#/about">${esc(t("support"))}</a>
      </div>

      <div class="wallets">
        <div class="wallet"><div class="k">${esc(t("rechargeWallet"))}</div><div class="v">${money(ACCOUNT.depositWallet)}</div></div>
        <div class="wallet"><div class="k">${esc(t("balanceWallet"))}</div><div class="v">${money(ACCOUNT.balance)}</div></div>
        <div class="wallet"><div class="k">${esc(t("productIncome"))}</div><div class="v">${money(ACCOUNT.productIncome)}</div></div>
      </div>

      <div class="statstrip" style="grid-template-columns:1fr 1fr">
        <a class="btn btn--primary" href="#/recharge">${esc(t("deposit"))}</a>
        <a class="btn btn--ghost" href="#/withdraw">${esc(t("withdraw"))}</a>
      </div>

      <div>
        ${menuItem("#/about","💬",t("contactUs"))}
        ${menuItem("#/shop","▦",t("myPlans"))}
        ${menuItem("#/transactions","🧾",t("myTransactions"))}
        ${menuItem("#/team","👥",t("inviteFriends"))}
        ${menuItem("#/about","🔑",t("modifyPassword"))}
      </div>

      <button class="menuitem" id="logoutbtn" style="margin-bottom:0">
        <div class="menuitem__ic" style="background:rgba(229,66,79,.12);color:var(--danger)">⏻</div>
        <div class="menuitem__t">
          ${esc(t("logOut"))}
          <div class="muted" style="font-size:11.5px;font-weight:500;margin-top:2px">${esc(t("logOutSub"))}</div>
        </div>
      </button>
    </div>
    ${tabbar("my")}`;

  document.getElementById("logoutbtn").onclick = () => {
    openSheet(`
      <h4 style="font-size:17px;font-weight:800">${esc(t("logOutTitle"))}</h4>
      <p class="sheet__sub" style="margin:8px 0 0">${esc(t("logOutBody"))}</p>
      <div class="sheet__actions">
        <button class="btn btn--ghost" data-close>${esc(t("cancel"))}</button>
        <button class="btn btn--danger" id="doLogout">${esc(t("logOut"))}</button>
      </div>`, { center:true });
    overlayCard.querySelector("[data-close]").onclick = closeSheet;
    overlayCard.querySelector("#doLogout").onclick = () => {
      closeSheet(); state.loggedIn = false; location.hash = "#/login";
    };
  };
}

const menuItem = (href, ic, lb) => `
  <a class="menuitem" href="${href}">
    <div class="menuitem__ic">${ic}</div>
    <div class="menuitem__t">${esc(lb)}</div>
    <div class="menuitem__ar">›</div>
  </a>`;

/* ---------- money screens ---------------------------------------------- */
function viewRecharge() {
  app.className = "shell";
  app.innerHTML = `
    ${topbar(t("recharge"), "#/my")}
    <div class="page" style="padding-top:0">
      ${moneyForm({ kind:"recharge", cta:t("recharge"), hint:t("demoNotice") })}
    </div>`;
  wireMoneyForm();
}

function viewWithdraw() {
  app.className = "shell";
  app.innerHTML = `
    ${topbar(t("withdraw"), "#/my")}
    <div class="page" style="padding-top:0">
      ${moneyForm({ kind:"withdraw", cta:t("withdraw"), hint:t("demoNotice") })}
    </div>`;
  wireMoneyForm();
}

function moneyForm({ kind, cta, hint }) {
  const chips = [300, 500, 1000, 2500, 5000];
  return `
    <form id="moneyform" class="card" style="display:flex;flex-direction:column;gap:16px">
      <div>
        <div class="eyebrow">${esc(t("balanceWallet"))}</div>
        <div style="font-family:var(--font-display);font-size:30px;font-weight:800;margin-top:4px">
          ₹${money(ACCOUNT.balance)}
        </div>
      </div>

      <div class="field">
        <label for="amt">${esc(t("purchaseAmount"))}</label>
        <div class="inputwrap"><span class="prefix">₹</span>
          <input id="amt" name="amt" type="number" min="1" placeholder="0" required></div>
      </div>

      <div style="display:flex;gap:8px;flex-wrap:wrap">
        ${chips.map(c => `<button type="button" class="btn btn--ghost btn--sm" data-chip="${c}">₹${money(c)}</button>`).join("")}
      </div>

      <button class="btn btn--primary" type="submit">${esc(cta)}</button>
      <p class="muted center" style="font-size:11.5px;margin:0">${esc(hint)}</p>
    </form>`;
}

function wireMoneyForm() {
  document.querySelectorAll("[data-chip]").forEach(b =>
    b.onclick = () => { document.getElementById("amt").value = b.dataset.chip; });

  document.getElementById("moneyform").onsubmit = (e) => {
    e.preventDefault();
    openSheet(`
      <div class="sheet__title">${esc(t("buyTitle"))}</div>
      <p class="sheet__sub">${esc(t("buySub"))}</p>
      <div class="sheet__actions">
        <button class="btn btn--ghost" data-close>${esc(t("cancel"))}</button>
        <button class="btn btn--primary" data-close>${esc(t("yesBuy"))}</button>
      </div>`, { center:true });
    overlayCard.querySelectorAll("[data-close]").forEach(b => b.onclick = () => {
      closeSheet(); toast(t("demoNotice"));
    });
  };
}

/* ---------- transactions ----------------------------------------------- */
function viewTransactions() {
  app.className = "shell";
  app.innerHTML = `
    ${topbar(t("myTransactions"), "#/home")}
    <div class="page" style="padding-top:0">
      <div class="block">
        <div class="eyebrow">${esc(t("sampleData"))}</div>
        <div class="rowlist" style="margin-top:6px">
          ${TRANSACTIONS.map(x => `
            <div class="row">
              <div class="avatar">${x.kind === "credit" ? "↓" : "↑"}</div>
              <div class="row__main">
                <div class="row__t">${esc(x.title)}</div>
                <div class="row__s">${esc(x.note)} · ${esc(x.when)}</div>
              </div>
              <div class="row__end">
                <div class="row__amt ${x.kind === "credit" ? "pos" : "neg"}">
                  ${x.kind === "credit" ? "+" : "−"}₹${money(x.amount)}
                </div>
              </div>
            </div>`).join("")}
        </div>
      </div>
      <p class="center" style="font-size:11.5px;color:var(--muted);margin:0">${esc(t("demoNotice"))}</p>
    </div>`;
}

/* ---------- about ------------------------------------------------------- */
function viewAbout() {
  app.className = "shell";
  app.innerHTML = `
    ${topbar(t("aboutUs"), "#/home")}
    <div class="page" style="padding-top:0">
      <div class="card center">
        <div class="brand__mark" style="margin:0 auto 12px">${LOGO_SVG}</div>
        <div class="brand__name">${esc(BRAND.name)}</div>
        <p class="muted" style="font-size:12.5px;line-height:1.7;margin:10px 0 0">
          ${esc(t("demoNotice"))}
        </p>
      </div>

      <div class="block">
        <h3 style="font-size:15px;font-weight:800;margin-bottom:8px">${esc(t("support"))}</h3>
        <p class="muted" style="font-size:12.5px;line-height:1.7;margin:0">
          ${state.lang === "hi"
            ? "यह एक शैक्षिक UI डेमो है। यहाँ कोई वास्तविक सहायता चैनल नहीं है।"
            : "This is an educational UI demo. There is no real support channel attached to it."}
        </p>
      </div>
    </div>`;
}

/* ---------- language menu ---------------------------------------------- */
function wireLangButton() {
  const btn = document.getElementById("langbtn");
  const host = document.getElementById("langmenu-host");
  if (!btn) return;
  let open = false;

  btn.onclick = () => {
    open = !open;
    host.innerHTML = open ? `
      <div class="langmenu" role="menu">
        <button role="menuitemradio" aria-checked="${state.lang==="en"}" data-lang="en">English</button>
        <button role="menuitemradio" aria-checked="${state.lang==="hi"}" data-lang="hi">हिंदी</button>
      </div>` : "";
    host.querySelectorAll("[data-lang]").forEach(b => b.onclick = () => {
      state.lang = b.dataset.lang;
      applyStaticI18n();
      route();
    });
  };
}

/* Push translations into any static [data-i18n] nodes in index.html. */
function applyStaticI18n() {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });
}

/* ---------- router ------------------------------------------------------ */
const routes = {
  login: viewLogin,
  register: viewRegister,
  home: viewHome,
  shop: viewShop,
  team: viewTeam,
  my: viewMy,
  recharge: viewRecharge,
  withdraw: viewWithdraw,
  transactions: viewTransactions,
  about: viewAbout,
};

function route() {
  const raw = (location.hash || "#/login").replace(/^#\/?/, "").split("?")[0];
  const key = routes[raw] ? raw : (state.loggedIn ? "home" : "login");

  if (["home","shop","team","my"].includes(key) && !state.loggedIn) {
    location.hash = "#/login";
    return;
  }

  applyStaticI18n();
  routes[key]();
  window.scrollTo(0, 0);
}

window.addEventListener("hashchange", route);
route();
