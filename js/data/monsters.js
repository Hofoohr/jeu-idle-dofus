/* ==========================================================================
   Monstres. Le sprite est assets/monstres/<dofusdbId>.png, où dofusdbId est
   l'identifiant du monstre sur DofusDB (https://dofusdb.fr/fr/database/monster/<id>).

   level / hp / init      : niveau, points de vie, initiative
   attack                 : { element, dmg:[min,max] } — l'élément détermine quelle
                            résistance du personnage s'applique
   res                    : résistances du monstre en % { terre, feu, eau, air } (réduisent nos dégâts)
   xp / kamas [min,max]   : récompenses par monstre vaincu (l'XP du groupe est partagée entre les 4 persos)
   rare: true             : au plus un monstre « rare » par groupe
   drops : { item, chance (en %), min, max } — chaque ligne est tirée indépendamment
   ========================================================================== */
Game.Data.monsters = [
  /* ---------- Plaine des Bouftous ---------- */
  { id: 'bouftou', name: 'Bouftou', dofusdbId: 101, level: 3, hp: 85, init: 20,
    attack: { element: 'terre', dmg: [7, 12] }, res: {}, xp: 16, kamas: [2, 6],
    drops: [
      { item: 'laine_bouftou',    chance: 53,  min: 1, max: 2 },
      { item: 'sang_bouftou',     chance: 8.8, min: 1, max: 1 },
      { item: 'boufbottes',       chance: 2.5, min: 1, max: 1 },
      { item: 'ceinture_bouftou', chance: 2.5, min: 1, max: 1 },
      { item: 'epee_boisaille',   chance: 2,   min: 1, max: 1 },
    ] },
  { id: 'boufton_blanc', name: 'Boufton blanc', dofusdbId: 134, level: 5, hp: 130, init: 25,
    attack: { element: 'terre', dmg: [10, 17] }, res: { terre: 5 }, xp: 26, kamas: [4, 9],
    drops: [
      { item: 'corne_boufton',  chance: 53,  min: 1, max: 2 },
      { item: 'sang_bouftou',   chance: 8.8, min: 1, max: 1 },
      { item: 'anneau_bouze',   chance: 3,   min: 1, max: 1 },
    ] },
  { id: 'boufton_noir', name: 'Boufton noir', dofusdbId: 149, level: 6, hp: 145, init: 30,
    attack: { element: 'terre', dmg: [12, 19] }, res: { terre: 5, feu: 5 }, xp: 30, kamas: [5, 10],
    drops: [
      { item: 'laine_boufton_noir', chance: 53,  min: 1, max: 2 },
      { item: 'sang_bouftou',       chance: 8.8, min: 1, max: 1 },
      { item: 'amulette_bouftou',   chance: 3,   min: 1, max: 1 },
    ] },
  { id: 'chef_guerre_bouftou', name: 'Chef de Guerre Bouftou', dofusdbId: 148, level: 10, hp: 420, init: 45, rare: true,
    attack: { element: 'terre', dmg: [17, 27] }, res: { terre: 10, feu: 5, eau: 5, air: 5 }, xp: 90, kamas: [20, 40],
    drops: [
      { item: 'laine_chef_guerre', chance: 53, min: 1, max: 2 },
      { item: 'sang_bouftou',      chance: 30, min: 1, max: 2 },
      { item: 'epee_fouraille',    chance: 10, min: 1, max: 1 },
    ] },

  /* ---------- Champs d'Astrub ---------- */
  { id: 'tofu', name: 'Tofu', dofusdbId: 98, level: 7, hp: 115, init: 50,
    attack: { element: 'air', dmg: [10, 17] }, res: { air: 5 }, xp: 30, kamas: [4, 10],
    drops: [
      { item: 'plume_tofu',      chance: 51,  min: 1, max: 2 },
      { item: 'cocon_ver_soie',  chance: 8.4, min: 1, max: 1 },
      { item: 'anneau_tofu',     chance: 2,   min: 1, max: 1 },
      { item: 'baguette_tofu',   chance: 1.5, min: 1, max: 1 },
    ] },
  { id: 'pissenlit_diabolique', name: 'Pissenlit diabolique', dofusdbId: 79, level: 8, hp: 170, init: 25,
    attack: { element: 'terre', dmg: [14, 22] }, res: { terre: 5, eau: 5 }, xp: 38, kamas: [6, 12],
    drops: [
      { item: 'fleur_pissenlit',  chance: 55,  min: 1, max: 2 },
      { item: 'engrais',          chance: 9.2, min: 1, max: 1 },
      { item: 'amulette_champs',  chance: 2.5, min: 1, max: 1 },
      { item: 'anneau_champetre', chance: 3,   min: 1, max: 1 },
    ] },
  { id: 'rose_demoniaque', name: 'Rose démoniaque', dofusdbId: 78, level: 9, hp: 185, init: 25,
    attack: { element: 'feu', dmg: [15, 24] }, res: { feu: 5, air: 5 }, xp: 42, kamas: [6, 13],
    drops: [
      { item: 'petale_rose',       chance: 55,  min: 1, max: 2 },
      { item: 'bave_rose',         chance: 9.2, min: 1, max: 1 },
      { item: 'plantouze_champs',  chance: 1.5, min: 1, max: 1 },
      { item: 'bottes_champetres', chance: 2.5, min: 1, max: 1 },
      { item: 'ceinture_fleurie',  chance: 2.5, min: 1, max: 1 },
    ] },
  { id: 'arakne', name: 'Arakne', dofusdbId: 52, level: 11, hp: 220, init: 55,
    attack: { element: 'eau', dmg: [19, 29] }, res: { terre: 5, air: 5 }, xp: 54, kamas: [8, 16],
    drops: [
      { item: 'patte_arakne',     chance: 55,  min: 1, max: 2 },
      { item: 'patte_arakne_mag', chance: 9.2, min: 1, max: 1 },
      { item: 'araknoton',        chance: 2,   min: 1, max: 1 },
      { item: 'araknoture',       chance: 2,   min: 1, max: 1 },
    ] },
];
