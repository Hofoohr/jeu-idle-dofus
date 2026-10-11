/* ==========================================================================
   Constantes d'équilibrage globales. Modifie ici pour régler le rythme du jeu.
   ========================================================================== */
Game.Data.config = {
  saveKey: 'dofus-idle-save',
  saveVersion: 1,
  autosaveSeconds: 30,
  offlineCapHours: 12,           // plafond de progression hors-ligne
  offlineReportMinSeconds: 60,   // en dessous : pas de fenêtre de rapport
  tickMs: 100,

  maxCharLevel: 100,
  maxJobLevel: 100,

  // XP nécessaire pour passer du niveau L au niveau L+1 : floor(base * growth^(L-1))
  xp: {
    char: { base: 80, growth: 1.2 },
    job:  { base: 45, growth: 1.15 },
  },

  combat: {
    turnSeconds: 1.5,        // une action (joueur OU monstre) toutes les X secondes
    respawnSeconds: 1.0,     // pause entre deux monstres
    reviveSeconds: 6,        // temps de "résurrection" après une défaite
    critMultiplier: 1.5,
    resistCap: 75,           // % de résistance maximum
    damageVariance: 0.1,     // ±10 % sur chaque coup
    healAfterKill: 0.12,     // fraction des PV max rendue après chaque victoire
    // Le joueur trop haut niveau gagne moins d'XP : -perLevel par niveau au-delà de graceLevels
    levelXpPenalty: { graceLevels: 5, perLevel: 0.08, min: 0.1 },
    feedLines: 6,
  },

  // Même principe pour les métiers : une action trop facile rapporte moins d'XP
  jobXpPenalty: { graceLevels: 6, perLevel: 0.08, min: 0.1 },

  gathering: {
    speedPerLevel: 0.005,    // -0,5 % de temps de récolte par niveau de métier
    minTimeFactor: 0.5,
    doubleChancePerLevel: 0.4, // % de chance de récolte double par niveau de métier
  },

  log: { max: 60 },
};
