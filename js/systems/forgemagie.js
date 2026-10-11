/* ==========================================================================
   [À VENIR] Forgemagie : améliorer un équipement avec des runes
   (G.state.runes), avec une chance d'échec.
   Résultat réussi => inst.mods[stat] += rune.amount (déjà pris en compte par
   Inventory.instanceStats et donc par les stats de combat).
   ========================================================================== */
(function () {
  'use strict';
  const G = Game;

  G.Systems.forgemagie = {
    enabled: false,
    /** Chance de réussite (0-100) d'appliquer `runeId` sur `inst`. */
    successChance(inst, runeId) { return 0; },
    apply(uid, runeId) { /* TODO */ return { ok: false }; },
  };
})();
