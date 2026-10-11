/* ==========================================================================
   État de jeu sauvegardé. `Game.state` est remplacé à l'import / à la reset :
   ne jamais en garder une référence longue durée dans un autre module.
   ========================================================================== */
(function () {
  'use strict';
  const G = Game;

  G.newState = function (classId, name) {
    const now = Date.now();
    return {
      v: G.Data.config.saveVersion,
      createdAt: now, lastSeen: now,
      char: { name: name || 'Aventurier', classId, level: 1, xp: 0 },
      jobs: { woodcutter: { level: 1, xp: 0 }, blacksmith: { level: 1, xp: 0 } },
      kamas: 0,
      items: {},          // ressources empilables { itemId: quantité }
      gear: [],           // instances d'équipement { uid, id, mods:{} }
      nextUid: 1,
      equipped: {},       // { slotId: uid }
      action: null,       // { type:'combat'|'gather'|'craft', … } — une seule à la fois
      selection: { zoneId: G.Data.zones[0].id },
      stats: { kills: 0, deaths: 0, gathered: 0, crafted: 0, kamasEarned: 0 },
      // Réservé pour les futures fonctionnalités (brisage, forgemagie, donjons)
      runes: {},
      dungeons: {},
    };
  };

  /** Complète une sauvegarde ancienne avec les champs manquants (migration douce). */
  G.migrate = function (s) {
    if (!s || !s.char || !G.classes[s.char.classId]) return null;
    const fresh = G.newState(s.char.classId, s.char.name);
    const fill = (target, def) => {
      Object.keys(def).forEach((k) => {
        if (target[k] === undefined) target[k] = def[k];
        else if (def[k] && typeof def[k] === 'object' && !Array.isArray(def[k]) && typeof target[k] === 'object') fill(target[k], def[k]);
      });
    };
    fill(s, fresh);
    // Métiers ajoutés plus tard
    G.Data.jobs.forEach((j) => { if (!s.jobs[j.id]) s.jobs[j.id] = { level: 1, xp: 0 }; });
    // Nettoyage : objets / équipements dont la définition a disparu
    Object.keys(s.items).forEach((id) => { if (!G.items[id] || !(s.items[id] > 0)) delete s.items[id]; });
    s.gear = s.gear.filter((g) => G.items[g.id]);
    const uids = new Set(s.gear.map((g) => g.uid));
    Object.keys(s.equipped).forEach((slot) => { if (!uids.has(s.equipped[slot])) delete s.equipped[slot]; });
    if (!G.zones[s.selection.zoneId]) s.selection.zoneId = G.Data.zones[0].id;
    s.v = G.Data.config.saveVersion;
    return s;
  };
})();
