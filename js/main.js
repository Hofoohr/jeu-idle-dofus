/* ==========================================================================
   Démarrage : chargement de la sauvegarde, progression hors-ligne,
   boucle de jeu (100 ms), autosave.
   ========================================================================== */
(function () {
  'use strict';
  const G = Game, UI = G.UI;
  let last = Date.now();

  function startGame(awaySeconds) {
    G.Systems.character.invalidate();
    UI.buildNav();
    UI.buildTopbar();
    UI.go('combat');
    UI.renderJournal();
    G.Engine.resume();
    if (awaySeconds > G.Data.config.tickMs / 1000 * 50) handleAway(awaySeconds);
    last = Date.now();
    UI.tick();
    setInterval(loop, G.Data.config.tickMs);
    G.Save.startAutosave();
    G.Save.save();
  }

  /** Retour après une absence (rechargement de page ou onglet endormi). */
  function handleAway(seconds) {
    const r = G.Offline.run(seconds);
    if (!r) return;
    if (seconds >= G.Data.config.offlineReportMinSeconds) UI.offlineReport(r, seconds);
    else G.log(`⏱️ Absent ${Math.round(seconds)} s : progression rattrapée.`, 'info');
    UI.renderView();
  }

  function loop() {
    const now = Date.now();
    const dt = Math.max(0, (now - last) / 1000);
    last = now;
    if (dt > 5) handleAway(dt);       // onglet endormi par le navigateur
    else G.Engine.advance(dt);
    UI.tick();
  }

  function boot() {
    G.buildIndex();
    const saved = G.Save.load();
    if (saved) {
      G.state = saved;
      startGame((Date.now() - saved.lastSeen) / 1000);
    } else {
      UI.classSelect((classId, name) => {
        G.state = G.newState(classId, name);
        startGame(0);
        G.log('Bienvenue en Amakna ! Lance un combat ou une récolte.', 'info');
      });
    }
  }

  document.addEventListener('DOMContentLoaded', boot);
})();
