/* ==========================================================================
   Classes jouables. Pour en ajouter une : copie un bloc, change breedId
   (id de la classe sur DofusDB : Féca=1, Osamodas=2, Enutrof=3, Sram=4,
   Xélor=5, Ecaflip=6, Eniripsa=7, Iop=8, Crâ=9, Sadida=10, Sacrieur=11…).

   base      : stats au niveau 1        perLevel : gain par niveau
   opener    : 'distance' => le monstre perd sa 1re action (il doit approcher)
   spells    : liste par PRIORITÉ ; le 1er sort disponible est lancé.
               Le dernier doit avoir cd:0 (attaque de base, toujours dispo).
     kind 'damage' : dégâts = ATK × mult
     kind 'shield' : bouclier = PV max × pct, dure `duration` tours, non cumulable
     cd            : nombre de tours du joueur entre deux lancers
   ========================================================================== */
Game.Data.classes = [
  {
    id: 'cra', name: 'Crâ', breedId: 9, role: 'Distance',
    desc: 'Archer redoutable : dégâts élevés, mais fragile. Frappe de loin, le monstre perd sa première action.',
    opener: 'distance',
    base: { hp: 40, atk: 10, res: 0, crit: 8 },
    perLevel: { hp: 5, atk: 1.6 },
    spells: [
      { id: 'fleche_enflammee', name: 'Flèche Enflammée', icon: '🔥', kind: 'damage', mult: 2.4, cd: 3, desc: 'Gros dégâts, tous les 3 tours.' },
      { id: 'fleche_magique',   name: 'Flèche Magique',   icon: '🏹', kind: 'damage', mult: 1.0, cd: 0, desc: 'Attaque de base.' },
    ],
  },
  {
    id: 'iop', name: 'Iop', breedId: 8, role: 'Mêlée',
    desc: 'Guerrier impétueux : dégâts et vie équilibrés, aucun point faible évident.',
    opener: null,
    base: { hp: 60, atk: 8, res: 5, crit: 5 },
    perLevel: { hp: 8, atk: 1.3 },
    spells: [
      { id: 'colere_de_iop', name: 'Colère de Iop', icon: '⚔️', kind: 'damage', mult: 2.6, cd: 4, desc: 'Coup dévastateur, tous les 4 tours.' },
      { id: 'pression',      name: 'Pression',      icon: '💢', kind: 'damage', mult: 1.0, cd: 0, desc: 'Attaque de base.' },
    ],
  },
  {
    id: 'feca', name: 'Féca', breedId: 1, role: 'Défense',
    desc: 'Protecteur robuste : beaucoup de PV et de résistances, mais peu de dégâts.',
    opener: null,
    base: { hp: 85, atk: 6, res: 15, crit: 3 },
    perLevel: { hp: 11, atk: 1.0 },
    spells: [
      { id: 'armure_terrestre', name: 'Armure Terrestre', icon: '🛡️', kind: 'shield', pct: 0.35, duration: 3, cd: 4, desc: 'Bouclier de 35 % des PV max pendant 3 tours.' },
      { id: 'attaque_nuageuse', name: 'Attaque Nuageuse', icon: '☁️', kind: 'damage', mult: 1.0, cd: 0, desc: 'Attaque de base.' },
    ],
  },
];
