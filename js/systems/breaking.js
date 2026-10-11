/* ==========================================================================
   [À VENIR] Brisage : détruire un équipement pour obtenir des runes.
   Squelette prêt à être rempli. Brancher une action 'break' dans le moteur :
     G.Engine.register('break', Breaking);
   et ajouter une vue dans UI.registerView.
   Données : js/data/runes.js — instances : G.state.gear[i].mods
   ========================================================================== */
(function () {
  'use strict';
  const G = Game;

  G.Systems.breaking = {
    enabled: false,
    /** Runes obtenues en brisant `inst` (à implémenter : fonction des stats de l'objet). */
    preview(inst) { return []; },
    /** Détruit l'instance et ajoute les runes à G.state.runes. */
    breakGear(uid) { /* TODO */ return false; },
  };
})();
