/* ==========================================================================
   Espace de noms global, utilitaires, bus d'événements, URLs d'images DofusDB.
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
    rt: {},          // état d'exécution NON sauvegardé (combat en cours, timers)
    silent: false,   // true pendant la simulation hors-ligne (pas de journal)
    report: null,    // accumulateur de gains pendant la simulation hors-ligne
    logs: [],        // journal des événements récents
  });

  /* ---------- Images DofusDB (https://dofusdb.fr) ---------- */
  const IMG = 'https://api.dofusdb.fr/img/';
  Game.img = {
    item: (id) => `${IMG}items/${id}.png`,
    monster: (id) => `${IMG}monsters/${id}.png`,
    // Emblème de la classe (le "logo_transparent_" de DofusDB est un filigrane blanc quasi invisible)
    breed: (id) => `${IMG}breeds/symbol_${id}.png`,
    breedLogo: (id) => `${IMG}breeds/symbol_${id}.png`,
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
    clone: (o) => JSON.parse(JSON.stringify(o)),
  };

  /* ---------- Journal ---------- */
  // type : 'info' | 'loot' | 'rare' | 'level' | 'combat' | 'bad' | 'gold'
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
    Game.items = byId(D.items);
    Game.monsters = byId(D.monsters);
    Game.zones = byId(D.zones);
    Game.jobs = byId(D.jobs);
    Game.recipes = byId(D.recipes);
    Game.slots = byId(D.slots);
    Game.resources = {};
    D.jobs.forEach((j) => (j.resources || []).forEach((r) => { r.jobId = j.id; Game.resources[r.id] = r; }));
    // Contrôle de cohérence des données (aide quand on ajoute du contenu)
    const warn = (m) => console.warn('[data]', m);
    D.monsters.forEach((m) => (m.drops || []).forEach((d) => { if (!Game.items[d.item]) warn(`drop inconnu "${d.item}" sur ${m.id}`); }));
    D.zones.forEach((z) => z.monsters.forEach((id) => { if (!Game.monsters[id]) warn(`monstre inconnu "${id}" dans zone ${z.id}`); }));
    D.recipes.forEach((r) => {
      if (!Game.items[r.result.item]) warn(`résultat inconnu "${r.result.item}" (${r.id})`);
      r.ingredients.forEach((i) => { if (!Game.items[i.item]) warn(`ingrédient inconnu "${i.item}" (${r.id})`); });
    });
    D.jobs.forEach((j) => (j.resources || []).forEach((r) => { if (!Game.items[r.item]) warn(`ressource inconnue "${r.item}"`); }));
  };
})();
