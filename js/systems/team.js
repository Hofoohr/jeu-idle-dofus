/* ==========================================================================
   Équipe : 4 personnages, chacun avec son niveau, ses stats, son équipement.
   Stats effectives = classe (base + gain/niveau) + équipement.
   `maxHp` = Vitalité. Les résistances sont plafonnées (config.combat.resistCap).
   ========================================================================== */
(function () {
  'use strict';
  const G = Game;
  const cache = {};

  const Team = (G.Systems.team = {
    invalidate() { Object.keys(cache).forEach((k) => delete cache[k]); },

    size() { return G.state.team.length; },
    char(i) { return G.state.team[i]; },
    cls(i) { return G.classes[G.state.team[i].classId]; },
    avgLevel() { return G.state.team.reduce((s, c) => s + c.level, 0) / G.state.team.length; },

    /** Stats cumulées de l'équipement porté par le personnage i. */
    equipStats(i) {
      const sum = {};
      Object.values(G.state.team[i].equipped).forEach((uid) => {
        const st = G.Systems.inventory.instanceStats(G.Systems.inventory.getGear(uid));
        Object.keys(st).forEach((k) => (sum[k] = (sum[k] || 0) + st[k]));
      });
      return sum;
    },

    /** Stats complètes du personnage i (mises en cache). */
    stats(i) {
      if (cache[i]) return cache[i];
      const c = G.state.team[i], cls = G.classes[c.classId], eq = this.equipStats(i), L = c.level;
      const out = {};
      Object.keys(cls.base).forEach((k) => { out[k] = cls.base[k] + cls.perLevel[k] * (L - 1) + (eq[k] || 0); });
      const cap = G.Data.config.combat.resistCap;
      ['resTerre', 'resFeu', 'resEau', 'resAir'].forEach((k) => (out[k] = Math.min(cap, out[k])));
      Object.keys(out).forEach((k) => (out[k] = Math.round(out[k] * 10) / 10));
      out.maxHp = Math.round(out.vit);
      return (cache[i] = out);
    },

    xpToNext(i) { return G.F.xpForLevel('char', G.state.team[i].level); },
  });

  G.on('equip', Team.invalidate);
  G.on('level', Team.invalidate);
  G.on('imported', Team.invalidate);
})();
