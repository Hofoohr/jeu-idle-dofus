/* ==========================================================================
   Récompenses : XP (personnages / métiers), kamas, objets.
   Tout passe ici pour alimenter le journal et le récapitulatif hors-ligne.
   ========================================================================== */
(function () {
  'use strict';
  const G = Game, U = G.util;

  G.Systems.rewards = {
    /** kind 'char' : id = index du personnage · kind 'job' : id = id du métier */
    addXp(kind, id, amount) {
      if (amount <= 0) return;
      const ent = kind === 'char' ? G.state.team[id] : G.state.jobs[id];
      const max = kind === 'char' ? G.Data.config.maxCharLevel : G.Data.config.maxJobLevel;
      const key = kind === 'char' ? 'c' + id : id;
      if (G.report) G.report.xp[key] = (G.report.xp[key] || 0) + amount;
      if (ent.level >= max) return;
      ent.xp += amount;
      let up = false;
      while (ent.level < max && ent.xp >= G.F.xpForLevel(kind, ent.level)) {
        ent.xp -= G.F.xpForLevel(kind, ent.level);
        ent.level++;
        up = true;
        if (G.report) {
          const lv = G.report.levels[key] = G.report.levels[key] || { from: ent.level - 1, to: ent.level };
          lv.to = ent.level;
        }
        const name = kind === 'char' ? U.esc(ent.name) : G.jobs[id].name;
        G.log(`🎉 <b>${name}</b> passe niveau <b>${ent.level}</b> !`, 'level');
      }
      if (ent.level >= max) ent.xp = 0;
      if (up) G.emit('level', { kind, id });
      G.emit('xp');
    },

    addKamas(n, fromSale) {
      G.state.kamas += n;
      if (!fromSale) {
        G.state.stats.kamasEarned += n;
        if (G.report) G.report.kamas += n;
      }
    },

    /** Donne un objet et l'annonce dans le journal. rare : mise en avant. */
    giveItem(itemId, qty, rare) {
      G.Systems.inventory.add(itemId, qty);
      const it = G.items[itemId];
      G.log(`${G.iconHtml(itemId, 'xs')} ${rare ? '✨ Drop rare ! ' : ''}${qty}× <b>${it.name}</b>`, rare ? 'rare' : 'loot');
    },

    /** Tire une table de drops { item, chance %, min, max }. */
    rollDrops(drops) {
      drops.forEach((d) => {
        if (d.chance > 0 && U.chance(d.chance)) this.giveItem(d.item, U.randInt(d.min, d.max), d.chance < 5 && G.items[d.item].type === 'equipment');
      });
    },
  };
})();
