/* ==========================================================================
   Zones de combat. minLevel : niveau de personnage requis pour y accéder.
   Les donjons (plus tard) vivront dans dungeons.js et utiliseront les mêmes monstres.
   ========================================================================== */
Game.Data.zones = [
  { id: 'champs_astrub', name: "Champs d'Astrub", icon: '🌾', minLevel: 1,
    desc: 'Plaines paisibles où rôdent les premiers monstres.',
    monsters: ['moskito', 'bouftou', 'tofu'] },
  { id: 'foret_astrub', name: "Forêt d'Astrub", icon: '🌲', minLevel: 8,
    desc: 'Sous-bois dense, plus dangereux.',
    monsters: ['arakne', 'sanglier', 'prespic'] },
];
