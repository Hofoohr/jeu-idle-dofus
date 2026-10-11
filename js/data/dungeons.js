/* ==========================================================================
   [À VENIR] Donjons : série de combats + boss, ressources rares, plus d'XP.
   Format prévu :
   { id, name, minLevel, rooms: [ { monsters: ['id', …] }, … ], boss: 'monsterId',
     rewards: { xpMult, drops: [ … ] } }
   La logique sera dans js/systems/dungeons.js (action de type 'dungeon').
   ========================================================================== */
Game.Data.dungeons = [];
