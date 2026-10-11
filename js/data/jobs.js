/* ==========================================================================
   Métiers.
   type 'gather' : liste `resources` (récolte en boucle)
   type 'craft'  : les recettes sont dans recipes.js (champ job)
   Ressource : level requis, time (s), xp, yield [min,max], item
   ========================================================================== */
Game.Data.jobs = [
  {
    id: 'woodcutter', name: 'Bûcheron', icon: '🪓', type: 'gather',
    resources: [
      { id: 'frene',       name: 'Frêne',       item: 'bois_frene',       level: 1,  time: 3.0, xp: 6,  yield: [1, 1] },
      { id: 'chataignier', name: 'Châtaignier', item: 'bois_chataignier', level: 8,  time: 3.5, xp: 11, yield: [1, 1] },
      { id: 'noyer',       name: 'Noyer',       item: 'bois_noyer',       level: 16, time: 4.0, xp: 18, yield: [1, 2] },
      { id: 'chene',       name: 'Chêne',       item: 'bois_chene',       level: 25, time: 4.5, xp: 28, yield: [1, 2] },
      { id: 'if',          name: 'If',          item: 'bois_if',          level: 35, time: 5.0, xp: 42, yield: [1, 2] },
    ],
  },
  { id: 'blacksmith', name: 'Forgeron', icon: '⚒️', type: 'craft' },
];
