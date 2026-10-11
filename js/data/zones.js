/* ==========================================================================
   Zones de combat.
   minLevel : niveau MOYEN de l'équipe requis pour y accéder
   monsters : { id, weight } — poids de tirage de chaque monstre dans un groupe
              (les monstres « rare: true » sont limités à un par groupe)
   decorCss : fond de la scène (dégradés CSS, toujours disponible)
   decor    : (optionnel) image de fond, ex. 'assets/decors/plaine_bouftous.png'
              superposée au décor CSS ; si le fichier n'existe pas, le CSS reste.
   Les donjons (plus tard) vivront dans dungeons.js et réutiliseront les monstres.
   ========================================================================== */
Game.Data.zones = [
  {
    id: 'plaine_bouftous', name: 'Plaine des Bouftous', icon: '🐑', minLevel: 1,
    desc: 'Prairie paisible où broutent les Bouftous. Gare au Chef de Guerre !',
    monsters: [
      { id: 'bouftou', weight: 50 }, { id: 'boufton_blanc', weight: 25 },
      { id: 'boufton_noir', weight: 25 }, { id: 'chef_guerre_bouftou', weight: 5 },
    ],
    decor: 'assets/decors/plaine_bouftous.png',
    decorCss: 'radial-gradient(ellipse 55% 30% at 50% 82%, rgba(255,240,190,.22), transparent 70%), linear-gradient(#8fb2cc 0 34%, transparent 34%), linear-gradient(#6f8f45 0 40%, transparent 40%), repeating-linear-gradient(90deg, rgba(0,0,0,.10) 0 2px, transparent 2px 70px), linear-gradient(#8aa25a, #5f7a3a)',
  },
  {
    id: 'champs_astrub', name: "Champs d'Astrub", icon: '🌾', minLevel: 8,
    desc: 'Champs cultivés infestés de Tofus, de fleurs carnivores et d\'Araknes.',
    monsters: [
      { id: 'tofu', weight: 30 }, { id: 'pissenlit_diabolique', weight: 25 },
      { id: 'rose_demoniaque', weight: 25 }, { id: 'arakne', weight: 20 },
    ],
    decor: 'assets/decors/champs_astrub.png',
    decorCss: 'radial-gradient(ellipse 55% 30% at 50% 82%, rgba(255,240,190,.2), transparent 70%), linear-gradient(#a9b6bf 0 30%, transparent 30%), linear-gradient(#6d5a3c 0 42%, transparent 42%), repeating-linear-gradient(90deg, rgba(0,0,0,.14) 0 3px, transparent 3px 34px), linear-gradient(#a08a4a, #75642f)',
  },
];
