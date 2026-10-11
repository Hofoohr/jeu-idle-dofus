/* ==========================================================================
   Formules d'équilibrage (toutes au même endroit pour ajuster facilement).
   ========================================================================== */
(function () {
  'use strict';
  const G = Game, U = G.util;

  G.F = {
    /** XP pour passer du niveau `lvl` au suivant. kind : 'char' | 'job' */
    xpForLevel(kind, lvl) {
      const c = G.Data.config.xp[kind];
      return Math.floor(c.base * Math.pow(c.growth, lvl - 1));
    },

    /** Multiplicateur d'XP selon l'écart de niveau joueur/monstre. */
    monsterXpMult(playerLvl, monsterLvl) {
      const p = G.Data.config.combat.levelXpPenalty;
      const over = playerLvl - monsterLvl - p.graceLevels;
      return over <= 0 ? 1 : Math.max(p.min, 1 - over * p.perLevel);
    },

    /** Multiplicateur d'XP de métier selon l'écart niveau du métier / niveau requis. */
    jobXpMult(jobLvl, reqLvl) {
      const p = G.Data.config.jobXpPenalty;
      const over = jobLvl - reqLvl - p.graceLevels;
      return over <= 0 ? 1 : Math.max(p.min, 1 - over * p.perLevel);
    },

    /** Dégâts d'un sort du joueur contre un monstre. Retourne {dmg, crit}. */
    playerHit(stats, spell, monster) {
      const c = G.Data.config.combat;
      let d = stats.atk * spell.mult * (1 + U.rand(-c.damageVariance, c.damageVariance));
      d *= 1 + stats.pow / 100;
      d += stats.dmg;
      const crit = U.chance(stats.crit);
      if (crit) d *= c.critMultiplier;
      d *= 1 - (monster.res || 0) / 100;
      return { dmg: Math.max(1, Math.round(d)), crit };
    },

    /** Dégâts d'une attaque de monstre contre le joueur. */
    monsterHit(monster, stats) {
      const c = G.Data.config.combat;
      let d = U.rand(monster.dmg[0], monster.dmg[1] + 1) * (1 - stats.res / 100);
      return Math.max(1, Math.round(d));
    },

    /** Temps de récolte (s) selon le niveau du métier. */
    gatherTime(resource, jobLevel) {
      const g = G.Data.config.gathering;
      const f = Math.max(g.minTimeFactor, 1 - g.speedPerLevel * (jobLevel - 1));
      return resource.time * f;
    },
  };
})();
