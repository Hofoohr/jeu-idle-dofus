/* ==========================================================================
   Zones de combat : Piou → Champs → Bouftous.
   minLevel : niveau MOYEN de l'équipe requis pour y accéder
   monsters : { id, weight } — poids de tirage de chaque monstre dans un groupe
              (les monstres « rare: true » sont limités à un par groupe)
   decorCss : fond de la scène (dégradés CSS, toujours disponible)
   decor    : (optionnel) image de fond, ex. 'assets/decors/plaine_bouftous.png'
              (PNG ou JPG, même un bandeau étroit). Elle est étirée sur toute la largeur de
              la scène, collée en bas, avec le décor CSS derrière ; sur mobile elle est
              répétée à la hauteur de la scène. Si le fichier n'existe pas, le CSS reste.
   Les donjons (plus tard) vivront dans dungeons.js et réutiliseront les monstres.
   ========================================================================== */
Game.Data.zones = [
  {
    id: 'piou', name: 'Prairie des Piou', icon: '🐤', minLevel: 1,
    desc: 'Les piafs multicolores d\'Incarnam. Chaque couleur laisse sa panoplie : Rouge, Bleu, Violet, Rose, Jaune, Vert.',
    monsters: [
      { id: 'piou_rouge', weight: 1 }, { id: 'piou_bleu', weight: 1 }, { id: 'piou_violet', weight: 1 },
      { id: 'piou_rose', weight: 1 }, { id: 'piou_jaune', weight: 1 }, { id: 'piou_vert', weight: 1 },
    ],
    decor: 'assets/decors/prairie_piou.png',
    decorCss: 'radial-gradient(ellipse 55% 30% at 50% 82%, rgba(255,240,190,.22), transparent 70%), linear-gradient(#a9d0e8 0 34%, transparent 34%), linear-gradient(#7fb055 0 40%, transparent 40%), repeating-linear-gradient(90deg, rgba(0,0,0,.08) 0 2px, transparent 2px 70px), linear-gradient(#93c25e, #6b9a44)',
  },
  {
    id: 'champs_astrub', name: "Champs d'Astrub", icon: '🌾', minLevel: 8,
    desc: 'Champs cultivés infestés de fleurs carnivores et d\'épouvanteurs. Panoplies Champêtre et du Paysan.',
    monsters: [
      { id: 'pissenlit_diabolique', weight: 25 }, { id: 'rose_demoniaque', weight: 25 },
      { id: 'tournesol_sauvage', weight: 20 }, { id: 'epouvanteur', weight: 20 }, { id: 'arakne', weight: 10 },
    ],
    decor: 'assets/decors/champs_astrub.png',
    decorCss: 'radial-gradient(ellipse 55% 30% at 50% 82%, rgba(255,240,190,.2), transparent 70%), linear-gradient(#9cbfd3 0 30%, transparent 30%), linear-gradient(#7fa04a 0 42%, transparent 42%), repeating-linear-gradient(90deg, rgba(0,0,0,.14) 0 3px, transparent 3px 34px), linear-gradient(#93b04e, #6f8f3a)',
  },
  {
    id: 'plaine_bouftous', name: 'Plaine des Bouftous', icon: '🐑', minLevel: 15,
    desc: 'Prairie où broutent les Bouftous. Gare au Chef de Guerre ! Panoplie du Bouftou.',
    monsters: [
      { id: 'bouftou', weight: 50 }, { id: 'boufton_blanc', weight: 25 },
      { id: 'boufton_noir', weight: 25 }, { id: 'chef_guerre_bouftou', weight: 5 },
    ],
    decor: 'assets/decors/plaine_bouftous.png',
    decorCss: 'radial-gradient(ellipse 55% 30% at 50% 82%, rgba(255,240,190,.22), transparent 70%), linear-gradient(#8fb2cc 0 34%, transparent 34%), linear-gradient(#6f8f45 0 40%, transparent 40%), repeating-linear-gradient(90deg, rgba(0,0,0,.10) 0 2px, transparent 2px 70px), linear-gradient(#8aa25a, #5f7a3a)',
  },
];
