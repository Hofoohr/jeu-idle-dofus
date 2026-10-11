/* ==========================================================================
   Espace de noms global, utilitaires, bus d'événements, chemins des images.
   Chargé en premier. Pas de modules ES : le jeu marche aussi en ouvrant
   index.html directement (file://) et sur GitHub Pages.
   ========================================================================== */
(function () {
  'use strict';

  const Game = (window.Game = {
    Data: {},        // contenu (rempli par js/data/*.js)
    Systems: {},     // logique de jeu (combat, métiers, inventaire…)
    UI: {},          // interface
    state: null,     // état sauvegardé (voir core/state.js)
    rt: {},          // état d'exécution NON sauvegardé (combat en cours…)
    silent: false,   // true pendant la simulation hors-ligne (pas de journal ni d'animations)
    report: null,    // accumulateur de gains pendant la simulation hors-ligne
    logs: [],        // journal des événements récents
  });

  /* ---------- Chemins des images (fichiers fournis par toi dans assets/) ---------- */
  Game.assets = {
    classe: (classId) => `assets/classes/${classId}.png`,
    monstre: (dofusdbId) => `assets/monstres/${dofusdbId}.png`,
    objet: (icone) => `assets/objets/${icone}`,
  };

  /** HTML d'une icône d'objet (image locale ; visuel provisoire si le fichier manque). */
  Game.iconHtml = (itemId, cls = '') => {
    const it = Game.items[itemId];
    const ini = Game.util.esc(it.name.slice(0, 2));
    return `<img class="ic ${cls}" src="${Game.assets.objet(it.icone)}" alt="" loading="lazy" data-ph="${ini}" onerror="Game.UI.imgFail(this)">`;
  };

  /* ---------- Bus d'événements ---------- */
  const handlers = {};
  Game.on = (evt, fn) => { (handlers[evt] = handlers[evt] || []).push(fn); };
  Game.emit = (evt, arg) => { (handlers[evt] || []).forEach((fn) => fn(arg)); };

  /* ---------- Utilitaires ---------- */
  Game.util = {
    rand: (a, b) => a + Math.random() * (b - a),
    randInt: (a, b) => Math.floor(a + Math.random() * (b - a + 1)),
    chance: (pct) => Math.random() * 100 < pct,
    clamp: (v, a, b) => Math.max(a, Math.min(b, v)),
    fmt: (n) => Math.floor(n).toLocaleString('fr-FR'),
    fmtDec: (n, d = 1) => (Math.round(n * 10 ** d) / 10 ** d).toLocaleString('fr-FR'),
    fmtDur(sec) {
      sec = Math.max(0, Math.floor(sec));
      const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
      if (h) return `${h} h ${String(m).padStart(2, '0')} min`;
      if (m) return `${m} min ${String(s).padStart(2, '0')} s`;
      return `${s} s`;
    },
    esc: (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])),
    /** Tirage pondéré : items = [{weight, …}] → un élément. */
    weighted(items) {
      let total = items.reduce((s, i) => s + i.weight, 0), r = Math.random() * total;
      for (const i of items) { if ((r -= i.weight) < 0) return i; }
      return items[items.length - 1];
    },
  };

  /* ---------- Journal ---------- */
  // type : 'info' | 'loot' | 'rare' | 'level' | 'combat' | 'spell' | 'bad' | 'gold'
  Game.log = function (html, type = 'info') {
    if (Game.silent) return;
    const entry = { t: Date.now(), html, type };
    Game.logs.push(entry);
    const max = Game.Data.config.log.max;
    if (Game.logs.length > max) Game.logs.splice(0, Game.logs.length - max);
    Game.emit('log', entry);
  };

  /* ---------- Index des données (appelé après chargement des fichiers data) ---------- */
  Game.buildIndex = function () {
    const D = Game.Data;
    const byId = (arr) => arr.reduce((m, o) => ((m[o.id] = o), m), {});
    Game.classes = byId(D.classes);
    Game.spells = byId(D.spells);
    Game.items = byId(D.items);
    Game.monsters = byId(D.monsters);
    Game.zones = byId(D.zones);
    Game.jobs = byId(D.jobs);
    Game.recipes = byId(D.recipes);
    Game.slots = byId(D.slots);
    Game.resources = {};
    D.jobs.forEach((j) => (j.resources || []).forEach((r) => { r.jobId = j.id; Game.resources[r.id] = r; }));
    // Contrôles de cohérence (aident quand tu ajoutes du contenu)
    const warn = (m) => console.warn('[data]', m);
    D.classes.forEach((c) => c.spells.forEach((s) => { if (!Game.spells[s.id]) warn(`sort inconnu "${s.id}" (classe ${c.id})`); }));
    D.monsters.forEach((m) => (m.drops || []).forEach((d) => { if (!Game.items[d.item]) warn(`drop inconnu "${d.item}" sur ${m.id}`); }));
    D.zones.forEach((z) => z.monsters.forEach((e) => { if (!Game.monsters[e.id]) warn(`monstre inconnu "${e.id}" dans zone ${z.id}`); }));
    D.recipes.forEach((r) => {
      if (!Game.items[r.result.item]) warn(`résultat inconnu "${r.result.item}" (${r.id})`);
      if (!Game.jobs[r.job]) warn(`métier inconnu "${r.job}" (${r.id})`);
      r.ingredients.forEach((i) => { if (!Game.items[i.item]) warn(`ingrédient inconnu "${i.item}" (${r.id})`); });
    });
    D.jobs.forEach((j) => (j.resources || []).forEach((r) => { if (!Game.items[r.item]) warn(`ressource inconnue "${r.item}"`); }));
  };
})();
