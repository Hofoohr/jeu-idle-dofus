/* ==========================================================================
   Progression hors-ligne : simule l'action en cours pendant l'absence
   (plafonnée à 12 h) avec EXACTEMENT la même logique que le jeu en direct.
   ========================================================================== */
(function () {
  'use strict';
  const G = Game;

  G.Offline = {
    newReport(seconds) {
      return { seconds, xp: {}, levels: {}, kamas: 0, items: {}, kills: 0, fights: 0, defeats: 0, gathered: 0, crafted: 0, stoppedEarly: false };
    },

    /**
     * Simule `seconds` d'absence. Retourne le rapport (ou null si rien à simuler).
     * Le journal est coupé pendant la simulation (Game.silent).
     */
    run(seconds) {
      const cap = G.Data.config.offlineCapHours * 3600;
      const real = seconds;
      seconds = Math.min(seconds, cap);
      if (!G.state.action || seconds <= 0) return null;
      const report = (G.report = this.newReport(seconds));
      report.capped = real > cap;
      report.hadAction = G.Engine.describeCurrent();
      G.silent = true;
      try { G.Engine.advance(seconds); }
      finally { G.silent = false; G.report = null; }
      report.stoppedEarly = !G.state.action;   // ex : ingrédients épuisés
      G.Systems.team.invalidate();
      G.emit('inv'); G.emit('level'); G.emit('action');
      return report;
    },
  };

  G.Engine.describeCurrent = function () {
    const sys = this.system();
    return sys ? sys.describe(this.current()) : null;
  };
})();
