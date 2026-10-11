/* ==========================================================================
   Noyau de l'interface : routeur de vues, helpers HTML, barre du haut,
   dock (action en cours + journal), actions des boutons (data-act).
   Ajouter un écran = Game.UI.registerView({ id, name, icon, events, render, update }).
   ========================================================================== */
(function () {
  'use strict';
  const G = Game, U = G.util, UI = G.UI;

  UI.views = [];
  UI.actions = {};          // data-act="nom" → fonction(dataset, élément)
  UI.current = 'combat';
  const dirty = new Set();
  const $ = (s) => document.querySelector(s);
  UI.$ = $;

  /* ---------- Helpers HTML ---------- */
  UI.img = (url, fallback, cls = '') =>
    `<img class="ic ${cls}" src="${url}" alt="" loading="lazy" data-fb="${fallback || '❔'}" onerror="Game.UI.imgFail(this)">`;
  UI.imgFail = (img) => {
    const s = document.createElement('span');
    s.className = 'ic-fb ' + img.className.replace('ic', '').trim();
    s.textContent = img.dataset.fb;
    img.replaceWith(s);
  };
  UI.bar = (id, cls) => `<div class="bar ${cls || ''}"><div class="fill" id="${id}"></div><span class="bar-t" id="${id}-t"></span></div>`;
  UI.setBar = (id, ratio, text) => {
    const f = document.getElementById(id);
    if (!f) return;
    f.style.width = (U.clamp(ratio, 0, 1) * 100).toFixed(1) + '%';
    const t = document.getElementById(id + '-t');
    if (t && text !== undefined && t.textContent !== text) t.textContent = text;
  };
  UI.statsHtml = (stats) => {
    const L = G.Data.statLabels;
    const parts = Object.keys(L).filter((k) => stats[k]).map((k) => `<span class="pos">${L[k].icon} +${stats[k]}${L[k].suffix} ${L[k].name}</span>`);
    return `<div class="statline">${parts.join('') || '<span class="muted">Aucun bonus</span>'}</div>`;
  };
  UI.itemName = (id, qty) => { const it = G.items[id]; return `${UI.img(it.img, '📦', 'xs')} ${qty ? qty + '× ' : ''}${it.name}`; };

  UI.toast = (msg) => {
    const t = $('#toast');
    t.textContent = msg; t.classList.add('show');
    clearTimeout(UI._toast);
    UI._toast = setTimeout(() => t.classList.remove('show'), 1800);
  };

  UI.modal = (html, opts = {}) => {
    const root = $('#modal-root');
    root.innerHTML = `<div class="modal">${html}</div>`;
    root.classList.add('open');
    root.onclick = opts.closable === false ? null : (e) => { if (e.target === root) UI.closeModal(); };
  };
  UI.closeModal = () => { const r = $('#modal-root'); r.classList.remove('open'); r.innerHTML = ''; };

  /* ---------- Vues & navigation ---------- */
  UI.registerView = (v) => UI.views.push(v);
  const view = (id) => UI.views.find((v) => v.id === id);

  UI.buildNav = () => {
    $('#nav').innerHTML = UI.views.map((v) => `<button class="nav-btn" data-act="nav" data-id="${v.id}"><span class="ni">${v.icon}</span><span>${v.name}</span></button>`).join('');
  };

  UI.go = (id) => {
    UI.current = id;
    document.querySelectorAll('.nav-btn').forEach((b) => b.classList.toggle('active', b.dataset.id === id));
    UI.renderView();
    $('#view').scrollTop = 0;
  };

  UI.renderView = () => {
    const v = view(UI.current), el = $('#view');
    const sc = el.scrollTop;
    v.render(el);
    el.scrollTop = sc;
  };

  UI.actions.nav = (d) => UI.go(d.id);
  UI.actions.stop = () => G.Engine.stop();

  // Délégation de clics : <button data-act="x" data-…>
  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-act]');
    if (!el || el.disabled) return;
    const fn = UI.actions[el.dataset.act];
    if (fn) fn(el.dataset, el);
  });

  /* ---------- Rafraîchissement ---------- */
  ['action', 'inv', 'xp', 'level', 'equip', 'imported', 'select'].forEach((e) => G.on(e, () => dirty.add(e)));
  setInterval(() => {
    if (!dirty.size || !G.state) return;
    const v = view(UI.current);
    if (v && (v.events || []).some((e) => dirty.has(e))) UI.renderView();
    dirty.clear();
  }, 250);

  /* ---------- Barre du haut ---------- */
  UI.buildTopbar = () => {
    const c = G.Systems.character.cls();
    $('#topbar').innerHTML = `
      ${UI.img(G.img.breedLogo(c.breedId), '🧙', 'portrait')}
      <div class="who"><b id="tb-name"></b><small id="tb-class"></small></div>
      <div class="bars">${UI.bar('tb-xp', 'xp')}${UI.bar('tb-hp', 'hp')}</div>
      <div class="kamas" id="tb-kamas"></div>`;
    $('#tb-name').textContent = G.state.char.name;
  };

  UI.updateTopbar = () => {
    const S = G.state, st = G.Systems.character.stats(), c = G.Systems.character.cls();
    $('#tb-class').textContent = `${c.name} · niveau ${S.char.level}`;
    const need = G.Systems.character.xpToNext();
    const max = S.char.level >= G.Data.config.maxCharLevel;
    UI.setBar('tb-xp', max ? 1 : S.char.xp / need, max ? 'Niveau max' : `XP ${U.fmt(S.char.xp)} / ${U.fmt(need)}`);
    const rt = G.rt.combat;
    const hp = rt && S.action && S.action.type === 'combat' ? Math.max(0, rt.hp) : st.maxHp;
    UI.setBar('tb-hp', hp / st.maxHp, `PV ${U.fmt(hp)} / ${U.fmt(st.maxHp)}`);
    $('#tb-kamas').textContent = `💰 ${U.fmt(S.kamas)} k`;
  };

  /* ---------- Dock : action en cours + journal ---------- */
  UI.updateDock = () => {
    const a = G.Engine.current();
    const info = G.Engine.describeCurrent();
    $('#dk-title').textContent = info ? info.title : 'Aucune action';
    $('#dk-sub').textContent = info ? info.sub : 'Choisis un combat ou un métier.';
    $('#dk-stop').style.visibility = a ? 'visible' : 'hidden';
    const p = G.Engine.progress();
    UI.setBar('dk-bar', a ? p : 0, a ? `${Math.round(p * 100)} %` : '');
  };

  function logHtml(e) {
    const d = new Date(e.t);
    const hh = String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
    return `<div class="log-line log-${e.type}"><time>${hh}</time><span>${e.html}</span></div>`;
  }
  UI.renderJournal = () => {
    const j = $('#journal');
    j.innerHTML = G.logs.map(logHtml).join('');
    j.scrollTop = j.scrollHeight;
  };
  G.on('log', (e) => {
    const j = $('#journal');
    if (!j) return;
    const atBottom = j.scrollHeight - j.scrollTop - j.clientHeight < 30;
    j.insertAdjacentHTML('beforeend', logHtml(e));
    while (j.children.length > G.Data.config.log.max) j.removeChild(j.firstChild);
    if (atBottom) j.scrollTop = j.scrollHeight;
  });

  UI.tick = () => {
    UI.updateTopbar();
    UI.updateDock();
    const v = view(UI.current);
    if (v && v.update) v.update();
  };
})();
