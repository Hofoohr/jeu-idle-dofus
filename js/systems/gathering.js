/* ==========================================================================
   Récolte (Bûcheron…). Action { type:'gather', resourceId }.
   ========================================================================== */
(function () {
  'use strict';
  const G = Game, U = G.util;

  const Gathering = (G.Systems.gathering = {
    valid(a) { const r = G.resources[a.resourceId]; return !!r && G.state.jobs[r.jobId].level >= r.level; },

    interval(a) {
      const r = G.resources[a.resourceId];
      return G.F.gatherTime(r, G.state.jobs[r.jobId].level);
    },

    describe(a) {
      const r = G.resources[a.resourceId];
      return { title: `${G.jobs[r.jobId].icon} ${G.jobs[r.jobId].name} : ${r.name}`, sub: `Niveau ${G.state.jobs[r.jobId].level}` };
    },

    tick(a) {
      const r = G.resources[a.resourceId], job = G.state.jobs[r.jobId];
      let qty = U.randInt(r.yield[0], r.yield[1]);
      if (U.chance(job.level * G.Data.config.gathering.doubleChancePerLevel)) qty *= 2;
      G.state.stats.gathered += qty;
      if (G.report) G.report.gathered += qty;
      G.Systems.rewards.giveItem(r.item, qty);
      G.Systems.rewards.addXp('job', r.jobId, Math.max(1, Math.round(r.xp * G.F.jobXpMult(job.level, r.level))));
    },

    start(resourceId) { G.Engine.start({ type: 'gather', resourceId }); },
  });

  G.Engine.register('gather', Gathering);
})();
