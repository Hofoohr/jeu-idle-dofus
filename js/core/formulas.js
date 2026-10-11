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

    /** Multiplicateur d'XP selon l'écart de niveau personnage / monstres. */
    monsterXpMult(charLvl, monsterLvl) {
      const p = G.Data.config.combat.levelXpPenalty;
      const over = charLvl - monsterLvl - p.graceLevels;
      return over <= 0 ? 1 : Math.max(p.min, 1 - over * p.perLevel);
    },

    /** Multiplicateur d'XP de métier selon l'écart niveau du métier / niveau requis. */
    jobXpMult(jobLvl, reqLvl) {
      const p = G.Data.config.jobXpPenalty;
      const over = jobLvl - reqLvl - p.graceLevels;
      return over <= 0 ? 1 : Math.max(p.min, 1 - over * p.perLevel);
    },

    /**
     * Valeur de base d'un sort (avant dommages fixes, variance et résistances) :
     *   power × (statOffset + caractéristique associée) / 100
     * (statOffset = 100 : à 0 en caractéristique, le sort fait ses dégâts de base.)
     */
    spellValue(stats, spell) {
      const c = G.Data.config.combat;
      const stat = stats[G.Data.elements[spell.element].stat] || 0;
      return spell.power * (c.statOffset + stat) / 100;
    },

    /** Dégâts d'un sort sur un monstre : (valeur + Dommages) × variance × (1 − résistance de l'élément). */
    spellDamage(stats, spell, monster) {
      const c = G.Data.config.combat;
      // résistance positive plafonnée ; négative = faiblesse (dégâts augmentés)
      const res = Math.min(c.resistCap, (monster.res && monster.res[spell.element]) || 0);
      const d = (this.spellValue(stats, spell) + (stats.dmg || 0)) * (1 + U.rand(-c.damageVariance, c.damageVariance)) * (1 - res / 100);
      return Math.max(1, Math.round(d));
    },

    /** Vitesse de la barre d'attaque, par tick : speedBase + initiative × speedPerInit. */
    atbSpeed(initiative) {
      const c = G.Data.config.combat;
      return c.speedBase + initiative * c.speedPerInit;
    },

    /** Dégâts d'une attaque de monstre sur un personnage (débuff = fraction retirée). */
    monsterDamage(monster, stats, debuff) {
      const c = G.Data.config.combat;
      const a = monster.attack;
      const res = Math.min(c.resistCap, stats[G.Data.elements[a.element].res] || 0);
      const d = U.rand(a.dmg[0], a.dmg[1] + 1) * (1 - (debuff || 0)) * (1 - res / 100);
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
