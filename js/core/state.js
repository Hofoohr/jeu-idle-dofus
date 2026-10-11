/* ==========================================================================
   État de jeu sauvegardé. `Game.state` est remplacé à l'import / à la reset :
   ne jamais en garder une référence longue durée dans un autre module.
   ========================================================================== */
(function () {
  'use strict';
  const G = Game;

  /** team : [{ name, classId } × 4] */
  G.newState = function (team) {
    const now = Date.now();
    const jobs = {};
    G.Data.jobs.forEach((j) => (jobs[j.id] = { level: 1, xp: 0 }));
    return {
      v: G.Data.config.saveVersion,
      createdAt: now, lastSeen: now,
      team: team.map((t) => ({ name: t.name, classId: t.classId, level: 1, xp: 0, equipped: {} })),
      jobs,               // métiers du compte
      kamas: 0,
      items: {},          // ressources empilables { itemId: quantité }
      gear: [],           // instances d'équipement { uid, id, mods:{} } (inventaire partagé)
      nextUid: 1,
      action: null,       // { type:'combat'|'gather'|'craft', … } — une seule à la fois
      selection: { zoneId: G.Data.zones[0].id },
      settings: { showSpellLog: true },
      stats: { kills: 0, fights: 0, defeats: 0, gathered: 0, crafted: 0, kamasEarned: 0 },
      // Réservé pour les futures fonctionnalités (brisage, forgemagie, donjons)
      runes: {},
      dungeons: {},
    };
  };

  /** Complète une sauvegarde ancienne avec les champs manquants (migration douce). */
  G.migrate = function (s) {
    if (!s || s.v !== G.Data.config.saveVersion || !Array.isArray(s.team) || s.team.length !== G.Data.config.teamSize) return null;
    if (!s.team.every((c) => G.classes[c.classId])) return null;
    const fresh = G.newState(s.team);
    const fill = (target, def) => {
      Object.keys(def).forEach((k) => {
        if (target[k] === undefined) target[k] = def[k];
        else if (def[k] && typeof def[k] === 'object' && !Array.isArray(def[k]) && typeof target[k] === 'object') fill(target[k], def[k]);
      });
    };
    const team = s.team; delete fresh.team; fill(s, fresh);
    team.forEach((c) => { c.equipped = c.equipped || {}; c.level = c.level || 1; c.xp = c.xp || 0; });
    // Nettoyage : objets / équipements dont la définition a disparu
    Object.keys(s.items).forEach((id) => { if (!G.items[id] || !(s.items[id] > 0)) delete s.items[id]; });
    s.gear = s.gear.filter((g) => G.items[g.id]);
    const uids = new Set(s.gear.map((g) => g.uid));
    team.forEach((c) => Object.keys(c.equipped).forEach((slot) => { if (!uids.has(c.equipped[slot])) delete c.equipped[slot]; }));
    if (!G.zones[s.selection.zoneId]) s.selection.zoneId = G.Data.zones[0].id;
    return s;
  };
})();
