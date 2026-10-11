/* ==========================================================================
   Noyau de l'interface : routeur de vues, helpers HTML (sprites, icônes,
   barres), barre du haut, dock (activité en cours + journal), boutons data-act.
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

  /* ---------- Images : sprites et icônes avec visuel provisoire ---------- */
  /** Teinte stable à partir d'un texte (pour les silhouettes provisoires). */
  const hue = (s) => { let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) % 360; return h; };

  /** Sprite (classe ou monstre) : hauteur fixe, largeur auto, aligné en bas. */
  UI.sprite = (url, name, color) =>
    `<img class="sprite" src="${url}" alt="${U.esc(name)}" data-name="${U.esc(name)}" data-color="${color || `hsl(${hue(name)} 45% 42%)`}" onerror="Game.UI.spriteFail(this)">`;
  UI.spriteFail = (img) => {
    const d = document.createElement('div');
    d.className = 'sprite ph';
    d.style.setProperty('--c', img.dataset.color);
    d.innerHTML = `<i></i><span>${U.esc(img.dataset.name)}</span>`;
    img.replaceWith(d);
  };
  UI.classSprite = (classId) => UI.sprite(G.assets.classe(classId), G.classes[classId].name, G.classes[classId].color);
  UI.monsterSprite = (m) => UI.sprite(G.assets.monstre(m.dofusdbId), m.name);

  /** Icône d'objet (visuel provisoire = initiales sur fond coloré). */
  UI.icon = (itemId, cls) => G.iconHtml(itemId, cls);
  UI.imgFail = (img) => {
    const s = document.createElement('span');
    s.className = 'ic-fb ' + img.className.replace('ic', '').trim();
    s.textContent = img.dataset.ph || '?';
    s.style.background = `hsl(${hue(img.dataset.ph || '?')} 40% 32%)`;
    img.replaceWith(s);
  };

  /* ---------- Helpers HTML ---------- */
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
  UI.itemName = (id, qty) => `${UI.icon(id, 'xs')} ${qty ? qty + '× ' : ''}${G.items[id].name}`;

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

  /* ---------- Rafraîchissement des vues ---------- */
  ['action', 'inv', 'xp', 'level', 'equip', 'imported', 'select'].forEach((e) => G.on(e, () => dirty.add(e)));
  setInterval(() => {
    if (!dirty.size || !G.state) return;
    const v = view(UI.current);
    if (v && (v.events || []).some((e) => dirty.has(e))) UI.renderView();
    dirty.clear();
  }, 250);

  /* ---------- Barre du haut ---------- */
  UI.buildTopbar = () => {
    $('#topbar').innerHTML = `<b class="tb-title">⚔️ Dofus Idle</b><div class="tb-chars" id="tb-chars"></div><div class="kamas" id="tb-kamas"></div>`;
  };
  UI.updateTopbar = () => {
    const chars = G.state.team.map((c) => `<span class="chip">${U.esc(c.name)} <b>${c.level}</b></span>`).join('');
    const el = $('#tb-chars');
    if (el.dataset.h !== chars) { el.dataset.h = chars; el.innerHTML = chars; }
    $('#tb-kamas').textContent = `💰 ${U.fmt(G.state.kamas)} k`;
  };

  /* ---------- Dock : activité en cours + journal ---------- */
  UI.updateDock = () => {
    const a = G.Engine.current();
    const info = G.Engine.describeCurrent();
    $('#dk-title').textContent = info ? info.title : 'Aucune activité';
    $('#dk-sub').textContent = info ? info.sub : 'Choisis un combat ou un métier.';
    $('#dk-stop').style.visibility = a ? 'visible' : 'hidden';
    const sys = G.Engine.system();
    if (!a) UI.setBar('dk-bar', 0, '');
    else if (sys.barInfo) { const b = sys.barInfo(a); UI.setBar('dk-bar', b.ratio, b.text); }
    else { const p = G.Engine.progress(); UI.setBar('dk-bar', p, `${Math.round(p * 100)} %`); }
  };

  function logHtml(e) {
    const d = new Date(e.t);
    const hh = String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0') + ':' + String(d.getSeconds()).padStart(2, '0');
    return `<div class="log-line log-${e.type}"><time>${hh}</time><span>${e.html}</span></div>`;
  }
  UI.renderJournal = () => {
    const j = $('#journal');
    j.innerHTML = G.logs.map(logHtml).join('');
    j.scrollTop = j.scrollHeight;
    j.classList.toggle('hide-spell', !G.state.settings.showSpellLog);
    $('#log-spells').checked = G.state.settings.showSpellLog;
  };
  G.on('log', (e) => {
    const j = $('#journal');
    if (!j) return;
    const atBottom = j.scrollHeight - j.scrollTop - j.clientHeight < 30;
    j.insertAdjacentHTML('beforeend', logHtml(e));
    while (j.children.length > G.Data.config.log.max) j.removeChild(j.firstChild);
    if (atBottom) j.scrollTop = j.scrollHeight;
  });
  UI.actions.togglespells = (d, el) => {
    G.state.settings.showSpellLog = el.checked;
    $('#journal').classList.toggle('hide-spell', !el.checked);
  };

  UI.tick = () => {
    UI.updateTopbar();
    UI.updateDock();
    const v = view(UI.current);
    if (v && v.update) v.update();
  };
})();
