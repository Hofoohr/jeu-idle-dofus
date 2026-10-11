/* ==========================================================================
   Craft (Forgeron…). Action { type:'craft', recipeId } : fabrique en boucle
   tant que les ingrédients sont disponibles.
   ========================================================================== */
(function () {
  'use strict';
  const G = Game;

  const Crafting = (G.Systems.crafting = {
    valid(a) {
      const r = G.recipes[a.recipeId];
      return !!r && G.state.jobs[r.job].level >= r.level;
    },

    interval(a) { return G.recipes[a.recipeId].time; },

    describe(a) {
      const r = G.recipes[a.recipeId], res = G.items[r.result.item];
      return { title: `${G.jobs[r.job].icon} ${G.jobs[r.job].name} : ${res.name}`, sub: 'Fabrication en continu' };
    },

    canCraft(r) { return G.state.jobs[r.job].level >= r.level && G.Systems.inventory.hasAll(r.ingredients); },

    tick(a) {
      const r = G.recipes[a.recipeId], inv = G.Systems.inventory;
      if (!inv.hasAll(r.ingredients)) {
        G.log('⚒️ Ingrédients épuisés : fabrication terminée.', 'info');
        G.Engine.stop();
        return;
      }
      r.ingredients.forEach((i) => inv.remove(i.item, i.qty));
      G.state.stats.crafted += r.result.qty;
      if (G.report) G.report.crafted += r.result.qty;
      G.Systems.rewards.giveItem(r.result.item, r.result.qty);
      G.Systems.rewards.addXp('job', r.job, Math.max(1, Math.round(r.xp * G.F.jobXpMult(G.state.jobs[r.job].level, r.level))));
      if (!inv.hasAll(r.ingredients)) {
        G.log('⚒️ Plus assez d’ingrédients pour continuer.', 'info');
        G.Engine.stop();
      }
    },

    start(recipeId) { G.Engine.start({ type: 'craft', recipeId }); },
  });

  G.Engine.register('craft', Crafting);
})();
