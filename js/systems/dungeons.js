/* ==========================================================================
   [À VENIR] Donjons : série de combats + boss.
   Idée : une action { type:'dungeon', dungeonId, room } qui réutilise
   G.Systems.combat (spawn/tick) pièce après pièce, avec G.Data.dungeons.
   Enregistrer avec G.Engine.register('dungeon', Dungeons).
   ========================================================================== */
(function () {
  'use strict';
  const G = Game;

  G.Systems.dungeons = {
    enabled: false,
    start(dungeonId) { /* TODO */ },
  };
})();
