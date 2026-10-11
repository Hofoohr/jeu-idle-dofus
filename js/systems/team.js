/* ==========================================================================
   Équipe : 4 personnages, chacun avec son niveau, ses caractéristiques, son
   équipement et la priorité de ses sorts.

   Toutes les classes ont les mêmes caractéristiques (config.charBase) :
     - niveau 1 : 50 PV, 0 en force / intelligence / agilité / chance, 0 % de résistance ;
     - chaque niveau : +5 PV et +5 points à répartir (force, agilité, intelligence, chance).
   Les objets et les panoplies (bonus selon le nombre de pièces portées) ajoutent caractéristiques,
   puissance, dommages, critiques, soins, sagesse, initiative bonus, résistances.
   Initiative = force + intelligence + agilité + chance + initiative bonus des objets.
   ========================================================================== */
(function () {
  'use strict';
  const G = Game;
  const cache = {};
  const STATS = ['force', 'agi', 'intel', 'chance'];

  const Team = (G.Systems.team = {
    STATS,
    invalidate() { Object.keys(cache).forEach((k) => delete cache[k]); },

    size() { return G.state.team.length; },
    char(i) { return G.state.team[i]; },
    cls(i) { return G.classes[G.state.team[i].classId]; },
    avgLevel() { return G.state.team.reduce((s, c) => s + c.level, 0) / G.state.team.length; },

    /** Panoplies actives du personnage i : [{ set, count, bonus }] (bonus du palier atteint). */
    activeSets(i) {
      const worn = {};
      Object.values(G.state.team[i].equipped).forEach((uid) => {
        const g = G.Systems.inventory.getGear(uid), set = g && G.items[g.id].set;
        if (set) worn[set] = (worn[set] || 0) + 1;
      });
      return Object.keys(worn).map((id) => {
        const set = G.sets[id], tiers = Object.keys(set.bonus).map(Number).filter((n) => n <= worn[id]);
        return { set, count: worn[id], bonus: tiers.length ? set.bonus[Math.max(...tiers)] : null };
      });
    },

    /** Stats cumulées de l'équipement porté par le personnage i, bonus de panoplies compris. */
    equipStats(i) {
      const sum = {};
      const add = (st) => Object.keys(st).forEach((k) => (sum[k] = (sum[k] || 0) + st[k]));
      Object.values(G.state.team[i].equipped).forEach((uid) => add(G.Systems.inventory.instanceStats(G.Systems.inventory.getGear(uid))));
      this.activeSets(i).forEach((a) => { if (a.bonus) add(a.bonus); });
      return sum;
    },

    /** Stats complètes du personnage i (mises en cache). */
    stats(i) {
      if (cache[i]) return cache[i];
      const c = G.state.team[i], eq = this.equipStats(i), b = G.Data.config.charBase;
      const cap = G.Data.config.combat.resistCap;
      const out = {
        vit: b.vit + b.vitPerLevel * (c.level - 1) + (eq.vit || 0),
        resTerre: Math.min(cap, eq.resTerre || 0), resFeu: Math.min(cap, eq.resFeu || 0),
        resEau: Math.min(cap, eq.resEau || 0), resAir: Math.min(cap, eq.resAir || 0),
      };
      ['pow', 'dmg', 'dmgTerre', 'dmgFeu', 'dmgEau', 'dmgAir', 'crit', 'heal', 'sagesse'].forEach((k) => { out[k] = eq[k] || 0; });
      STATS.forEach((k) => { out[k] = c.stat[k] + (eq[k] || 0); });
      out.initBonus = eq.init || 0;
      out.initiative = out.force + out.intel + out.agi + out.chance + out.initBonus;
      out.maxHp = Math.max(1, Math.round(out.vit));
      return (cache[i] = out);
    },

    xpToNext(i) { return G.F.xpForLevel('char', G.state.team[i].level); },

    /* ----- Répartition des points ----- */
    /** Ajoute n points (au plus les points disponibles) dans une caractéristique. */
    allocate(i, stat, n) {
      const c = G.state.team[i];
      n = Math.min(n, c.points);
      if (n <= 0 || !STATS.includes(stat)) return false;
      c.stat[stat] += n; c.points -= n;
      this.invalidate(); G.emit('level');
      return true;
    },

    /** Répartit tous les points disponibles selon la répartition automatique du personnage. */
    autoAllocate(i) {
      const c = G.state.team[i];
      if (c.autoStat && c.points > 0) { c.stat[c.autoStat] += c.points; c.points = 0; this.invalidate(); }
    },

    /** Rend tous les points répartis (gratuit). */
    resetPoints(i) {
      const c = G.state.team[i];
      STATS.forEach((k) => { c.points += c.stat[k]; c.stat[k] = 0; });
      this.invalidate(); G.emit('level');
    },

    /** Appelé à chaque montée de niveau. */
    onLevelUp(i) {
      G.state.team[i].points += G.Data.config.charBase.pointsPerLevel;
      this.invalidate();
      this.autoAllocate(i);
    },

    /* ----- Sorts ----- */
    /** Sorts de la classe déjà obtenus au niveau du personnage. */
    unlocked(i) {
      const c = G.state.team[i];
      return this.cls(i).spells.filter((s) => s.unlock <= c.level).map((s) => s.id);
    },
    unlockLevel(i, spellId) { return this.cls(i).spells.find((s) => s.id === spellId).unlock; },
    /** Attaque de base de la classe (le sort sans recharge). */
    basicSpell(i) { return this.cls(i).spells.map((s) => G.spells[s.id]).find((s) => s.cd === 0); },
    /** Déplace un sort dans la liste de priorité (dir = -1 : plus prioritaire, +1 : moins). */
    movePriority(i, spellId, dir) {
      const p = G.state.team[i].priority, k = p.indexOf(spellId), t = k + dir;
      if (k < 0 || t < 0 || t >= p.length) return;
      [p[k], p[t]] = [p[t], p[k]];
    },
  });

  G.on('equip', Team.invalidate);
  G.on('level', Team.invalidate);
  G.on('imported', Team.invalidate);
})();
