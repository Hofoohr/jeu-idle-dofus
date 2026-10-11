/* ==========================================================================
   Classes jouables. TOUTES les classes ont les mêmes caractéristiques (voir
   Game.Data.config.charBase) : seuls changent les sorts, l'arme utilisable et la
   caractéristique conseillée. Pour en ajouter une : copie un bloc, crée le sprite
   assets/classes/<id>.png et référence des sorts de spells.js.

   weapon   : type d'arme utilisable (arc, epee, baton, baguette)
   mainStat : caractéristique conseillée (répartition automatique par défaut)
   spells   : { id, unlock } — `unlock` = niveau d'obtention (3 sorts au niv. 1, un au niv. 5, un au niv. 10).
              L'ordre de la liste = priorité PAR DÉFAUT (modifiable par le joueur).
              Chaque classe a une attaque de base (cd 0) et des sorts à recharge.
   ========================================================================== */
Game.Data.classes = [
  {
    id: 'cra', name: 'Crâ', role: 'Dégâts à distance', weapon: 'arc', mainStat: 'agi', color: '#7cb342',
    desc: 'Archer redoutable : beaucoup de dégâts à distance, y compris de zone. Élément Air (Agilité).',
    spells: [
      { id: 'tir_critique', unlock: 10 }, { id: 'fleche_explosive', unlock: 5 },
      { id: 'tir_puissant', unlock: 1 }, { id: 'fleche_dispersion', unlock: 1 }, { id: 'fleche_magique', unlock: 1 },
    ],
  },
  {
    id: 'iop', name: 'Iop', role: 'Dégâts en mêlée', weapon: 'epee', mainStat: 'force', color: '#e53935',
    desc: 'Guerrier impétueux : gros coups au corps à corps. Élément Terre (Force).',
    spells: [
      { id: 'epee_celeste', unlock: 10 }, { id: 'colere_iop', unlock: 5 },
      { id: 'epee_divine', unlock: 1 }, { id: 'tempete_puissance', unlock: 1 }, { id: 'pression', unlock: 1 },
    ],
  },
  {
    id: 'feca', name: 'Féca', role: 'Protection', weapon: 'baton', mainStat: 'intel', color: '#8d6e63',
    desc: 'Protecteur : applique des boucliers sur ses alliés. Élément Feu (Intelligence).',
    spells: [
      { id: 'immunite', unlock: 10 }, { id: 'glyphe_agressif', unlock: 5 },
      { id: 'rempart', unlock: 1 }, { id: 'armure_terrestre', unlock: 1 }, { id: 'attaque_naturelle', unlock: 1 },
    ],
  },
  {
    id: 'pandawa', name: 'Pandawa', role: 'Soutien', weapon: 'baguette', mainStat: 'chance', color: '#26a69a',
    desc: 'Soutien : soigne l\'allié le plus blessé et affaiblit les ennemis. Élément Eau (Chance).',
    spells: [
      { id: 'lait_revigorant', unlock: 10 }, { id: 'souffle_alcoolise', unlock: 5 },
      { id: 'lait_bambou', unlock: 1 }, { id: 'epouvante', unlock: 1 }, { id: 'vague_a_lame', unlock: 1 },
    ],
  },
];
