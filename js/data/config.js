/* ==========================================================================
   Constantes d'équilibrage globales. Modifie ici pour régler le rythme du jeu.
   ========================================================================== */
Game.Data.config = {
  saveKey: 'dofus-idle-save-v2',
  saveVersion: 2,
  autosaveSeconds: 30,
  offlineCapHours: 12,           // plafond de progression hors-ligne
  offlineReportMinSeconds: 60,   // en dessous : pas de fenêtre de récapitulatif
  tickMs: 100,

  teamSize: 4,
  maxCharLevel: 100,
  maxJobLevel: 100,

  // XP nécessaire pour passer du niveau L au niveau L+1 : floor(base × growth^(L-1))
  xp: {
    char: { base: 70, growth: 1.2 },
    job:  { base: 45, growth: 1.15 },
  },

  combat: {
    actionSeconds: 1.0,        // une action (d'un combattant) par seconde
    spawnSeconds: 1.5,         // pause entre deux combats
    restSeconds: 8,            // repos si toute l'équipe est à terre (régénération progressive)
    reviveHpPct: 0.30,         // PV des alliés tombés qui se relèvent après la victoire
    healAfterFight: 0.10,      // fraction des PV max rendue à tous après une victoire
    damageVariance: 0.10,      // ±10 % sur chaque coup
    resistCap: 75,             // % de résistance maximum (par élément)
    spellLevelScale: 0.05,     // +5 % de puissance de sort par niveau du personnage
    soloHealThreshold: 0.5,    // l'IA soigne un allié sous 50 % de PV
    // Taille des groupes de monstres : poids de tirage pour 1, 2, 3 ou 4 monstres
    groupSizeWeights: { 1: 15, 2: 30, 3: 35, 4: 20 },
    // Un personnage trop haut niveau gagne moins d'XP : -perLevel par niveau au-delà de graceLevels
    levelXpPenalty: { graceLevels: 5, perLevel: 0.08, min: 0.1 },
    sagesseXpPct: 1,           // chaque point de Sagesse = +1 % d'XP
  },

  // Même principe pour les métiers : une action trop facile rapporte moins d'XP
  jobXpPenalty: { graceLevels: 6, perLevel: 0.08, min: 0.1 },

  gathering: {
    speedPerLevel: 0.005,      // -0,5 % de temps de récolte par niveau de métier
    minTimeFactor: 0.5,
    doubleChancePerLevel: 0.4, // % de chance de récolte double par niveau de métier
  },

  log: { max: 150 },
};

/* Éléments : chaque élément est lié à une caractéristique (qui augmente les dégâts,
   soins et boucliers de ce type) et à une résistance. */
Game.Data.elements = {
  terre: { name: 'Terre', icon: '🟤', stat: 'force',  res: 'resTerre' },
  feu:   { name: 'Feu',   icon: '🔴', stat: 'intel',  res: 'resFeu' },
  eau:   { name: 'Eau',   icon: '🔵', stat: 'chance', res: 'resEau' },
  air:   { name: 'Air',   icon: '⚪', stat: 'agi',    res: 'resAir' },
};
