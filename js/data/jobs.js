/* ==========================================================================
   Métiers (niveau du COMPTE, pas par personnage).
   type 'gather' : liste `resources` (récolte en boucle)
   type 'craft'  : les recettes sont dans recipes.js (champ job)
   Ressource : level requis, time (s), xp, yield [min,max], item
   ========================================================================== */
Game.Data.jobs = [
  {
    id: 'woodcutter', name: 'Bûcheron', icon: '🪓', type: 'gather',
    resources: [
      { id: 'frene',       name: 'Frêne',       item: 'bois_frene',       level: 1,  time: 3.0, xp: 6,  yield: [1, 1] },
      { id: 'chataignier', name: 'Châtaignier', item: 'bois_chataignier', level: 8,  time: 3.5, xp: 12, yield: [1, 1] },
      { id: 'noyer',       name: 'Noyer',       item: 'bois_noyer',       level: 16, time: 4.0, xp: 20, yield: [1, 2] },
    ],
  },
  { id: 'tailor',  name: 'Tailleur',  icon: '🧵', type: 'craft' },
  { id: 'sculptor', name: 'Sculpteur', icon: '🪚', type: 'craft' },
];
