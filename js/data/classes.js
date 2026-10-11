/* ==========================================================================
   Classes jouables. TOUTES les classes ont les mêmes caractéristiques (voir
   Game.Data.config.charBase) : seuls changent les sorts, l'arme réservée et la
   caractéristique conseillée. Pour en ajouter une : copie un bloc, crée le sprite
   assets/classes/<id>.png et référence des sorts de spells.js.

   weapon   : type d'arme réservé à la classe (arc, epee, baton, baguette)
   mainStat : caractéristique conseillée (répartition automatique par défaut)
   spells   : { id, unlock } — `unlock` = niveau d'obtention (3 sorts au niv. 1, un au niv. 5, un au niv. 10).
              L'ordre de la liste = priorité PAR DÉFAUT (modifiable par le joueur).
              Chaque classe a une attaque de base (cd 0) et des sorts à recharge.
   ========================================================================== */
Game.Data.classes = [
  {
    id: 'cra', name: 'Crâ', role: 'Dégâts à distance', weapon: 'arc', mainStat: 'agi', color: '#7cb342',
    desc: 'Archer redoutable : beaucoup de dégâts à distance, surtout Air (Agilité), avec de la zone en Feu.',
    spells: [
      { id: 'fleche_d_expiation', unlock: 10 }, { id: 'fleche_explosive', unlock: 5 },
      { id: 'fleche_de_dispersion', unlock: 1 }, { id: 'fleche_de_recul', unlock: 1 }, { id: 'fleche_cinglante', unlock: 1 },
    ],
  },
  {
    id: 'iop', name: 'Iop', role: 'Dégâts en mêlée', weapon: 'epee', mainStat: 'force', color: '#e53935',
    desc: 'Guerrier impétueux : gros coups au corps à corps, surtout Terre (Force), avec de la zone.',
    spells: [
      { id: 'epee_de_iop', unlock: 10 }, { id: 'couperet', unlock: 5 },
      { id: 'epee_divine', unlock: 1 }, { id: 'pression', unlock: 1 }, { id: 'concentration', unlock: 1 },
    ],
  },
  {
    id: 'feca', name: 'Féca', role: 'Protection', weapon: 'baton', mainStat: 'chance', color: '#8d6e63',
    desc: 'Protecteur : applique des boucliers sur ses alliés, avec des dégâts Eau (Chance) et de zone.',
    spells: [
      { id: 'typhon', unlock: 10 }, { id: 'nimbus', unlock: 5 },
      { id: 'rempart', unlock: 1 }, { id: 'bouclier_feca', unlock: 1 }, { id: 'bulle', unlock: 1 },
    ],
  },
  {
    id: 'pandawa', name: 'Pandawa', role: 'Soutien', weapon: 'baguette', mainStat: 'intel', color: '#26a69a',
    desc: 'Soutien : soigne l\'allié le plus blessé, affaiblit les ennemis et frappe en Feu (Intelligence) et en Eau.',
    spells: [
      { id: 'vague_a_lame', unlock: 10 }, { id: 'flasque_explosive', unlock: 5 },
      { id: 'lait_de_bambou', unlock: 1 }, { id: 'souillure', unlock: 1 }, { id: 'paume_explosive', unlock: 1 },
    ],
  },
];
