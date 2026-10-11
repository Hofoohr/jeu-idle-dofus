/* ==========================================================================
   Personnage : stats effectives (classe + niveau + équipement).
   Stats : maxHp, atk (base de dégâts), dmg (fixes), pow (%), res (%), crit (%)
   ========================================================================== */
(function () {
  'use strict';
  const G = Game;
  let cache = null;

  const Character = (G.Systems.character = {
    invalidate() { cache = null; },

    cls() { return G.classes[G.state.char.classId]; },
    level() { return G.state.char.level; },

    /** Stats cumulées de l'équipement porté : { vit, dmg, pow, res, crit } */
    equipStats() {
      const sum = {};
      Object.values(G.state.equipped).forEach((uid) => {
        const st = G.Systems.inventory.instanceStats(G.Systems.inventory.getGear(uid));
        Object.keys(st).forEach((k) => (sum[k] = (sum[k] || 0) + st[k]));
      });
      return sum;
    },

    stats() {
      if (cache) return cache;
      const c = this.cls(), L = this.level(), eq = this.equipStats();
      cache = {
        maxHp: Math.round(c.base.hp + c.perLevel.hp * (L - 1) + (eq.vit || 0)),
        atk: c.base.atk + c.perLevel.atk * (L - 1),
        dmg: eq.dmg || 0,
        pow: eq.pow || 0,
        res: Math.min(G.Data.config.combat.resistCap, c.base.res + (eq.res || 0)),
        crit: Math.min(100, c.base.crit + (eq.crit || 0)),
      };
      return cache;
    },

    xpToNext() { return G.F.xpForLevel('char', G.state.char.level); },
  });

  G.on('equip', Character.invalidate);
  G.on('level', Character.invalidate);
  G.on('imported', Character.invalidate);
})();
