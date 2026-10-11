/* ==========================================================================
   Constantes d'équilibrage globales. Modifie ici pour régler le rythme du jeu.
   ========================================================================== */
Game.Data.config = {
  saveKey: 'dofus-idle-save-v4',
  saveVersion: 4,
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

  // Caractéristiques de TOUS les personnages (identiques pour toutes les classes) :
  // niveau 1 = `vit` PV et 0 partout ; chaque niveau = +vitPerLevel PV et
  // +pointsPerLevel points à répartir entre force / agilité / intelligence / chance.
  // Résistances, sagesse, dommages et initiative bonus viennent uniquement des objets.
  charBase: { vit: 50, vitPerLevel: 5, pointsPerLevel: 5 },
  spellUnlockLevels: [1, 5, 10],   // 3 sorts au niv. 1, un 4e au niv. 5, un 5e au niv. 10 (voir classes.js)

  combat: {
    // Barre d'attaque : à chaque tick (tickSeconds), la barre de chaque combattant gagne
    //   speedBase + initiative × speedPerInit      (initiative = force + intel + agi + chance + bonus d'objets)
    // À atbMax (1000) il agit. Si plusieurs sont prêts, celui qui dépasse le plus agit en premier.
    tickSeconds: 0.1,
    atbMax: 1000,
    speedBase: 40,             // vitesse sans initiative (sinon un niveau 1 à 0 initiative n'agirait jamais)
    speedPerInit: 0.2,
    startAtbMax: 250,          // la barre de départ est tirée entre 0 et cette valeur
    // Dégâts / soins / boucliers d'un sort = base × (statOffset + stat + Puissance) / 100
    //   (+ Dommages et Dommages de l'élément pour les dégâts ; + Soins pour les soins)
    statOffset: 100,
    spawnSeconds: 1.5,         // pause entre deux combats
    restSeconds: 8,            // repos si toute l'équipe est à terre (régénération progressive)
    reviveHpPct: 0.30,         // PV des alliés tombés qui se relèvent après la victoire
    healAfterFight: 0.10,      // fraction des PV max rendue à tous après une victoire
    critMultiplier: 1.5,       // dégâts multipliés par 1,5 sur un coup critique (chance = stat Critiques, en %)
    damageVariance: 0.10,      // ±10 % sur chaque coup (0 pour désactiver)
    resistCap: 75,             // % de résistance maximum (par élément) ; les faiblesses (rés. négative) augmentent les dégâts
    healThreshold: 0.5,        // l'IA soigne quand un allié est sous 50 % de PV
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
  terre: { name: 'Terre', icon: '🟤', stat: 'force',  res: 'resTerre', dmg: 'dmgTerre' },
  feu:   { name: 'Feu',   icon: '🔴', stat: 'intel',  res: 'resFeu',   dmg: 'dmgFeu' },
  eau:   { name: 'Eau',   icon: '🔵', stat: 'chance', res: 'resEau',   dmg: 'dmgEau' },
  air:   { name: 'Air',   icon: '⚪', stat: 'agi',    res: 'resAir',   dmg: 'dmgAir' },
};
