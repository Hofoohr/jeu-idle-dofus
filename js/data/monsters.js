/* ==========================================================================
   Monstres. L'image vient de DofusDB : Game.img.monster(<id d'image>)
   (id d'image = fin de https://api.dofusdb.fr/img/monsters/<id>.png ; attention,
   ce n'est PAS toujours l'id du monstre, vérifie le champ "img" sur l'API).

   hp / dmg [min,max] / res (%) : stats de combat
   xp / kamas [min,max]         : récompenses par victoire
   drops : { item, chance (en %), min, max } — chaque ligne est tirée indépendamment
   ========================================================================== */
const M = (id) => Game.img.monster(id);

Game.Data.monsters = [
  /* ---------- Champs d'Astrub ---------- */
  { id: 'moskito', name: 'Moskito', level: 1, img: M(22), hp: 30, dmg: [3, 5], res: 0, xp: 9, kamas: [2, 5],
    drops: [
      { item: 'ailes_moskito',    chance: 55,  min: 1, max: 2 },
      { item: 'sourcil_moskito',  chance: 9.2, min: 1, max: 1 },
      { item: 'amulette_moskito', chance: 2,   min: 1, max: 1 },
    ] },
  { id: 'bouftou', name: 'Bouftou', level: 3, img: M(3), hp: 55, dmg: [5, 8], res: 0, xp: 16, kamas: [4, 9],
    drops: [
      { item: 'laine_bouftou', chance: 53,   min: 1, max: 2 },
      { item: 'sang_bouftou',  chance: 8.8,  min: 1, max: 1 },
      { item: 'boufbottes',    chance: 2,    min: 1, max: 1 },
    ] },
  { id: 'tofu', name: 'Tofu', level: 5, img: M(9), hp: 80, dmg: [7, 11], res: 0, xp: 26, kamas: [7, 14],
    drops: [
      { item: 'plume_tofu',     chance: 51,  min: 1, max: 2 },
      { item: 'cocon_ver_soie', chance: 8.4, min: 1, max: 1 },
      { item: 'kaskofu',        chance: 1.5, min: 1, max: 1 },
      { item: 'cape_tofu',      chance: 1.5, min: 1, max: 1 },
      { item: 'anneau_tofu',    chance: 1.2, min: 1, max: 1 },
    ] },

  /* ---------- Forêt d'Astrub ---------- */
  { id: 'arakne', name: 'Arakne', level: 8, img: M(15), hp: 140, dmg: [11, 16], res: 5, xp: 48, kamas: [10, 20],
    drops: [
      { item: 'patte_arakne',     chance: 55,  min: 1, max: 2 },
      { item: 'patte_arakne_mag', chance: 9.2, min: 1, max: 1 },
      { item: 'araknacoiffe',     chance: 1,   min: 1, max: 1 },
    ] },
  { id: 'sanglier', name: 'Sanglier', level: 11, img: M(54), hp: 220, dmg: [15, 22], res: 5, xp: 80, kamas: [16, 30],
    drops: [
      { item: 'defense_sanglier', chance: 53,  min: 1, max: 2 },
      { item: 'etoffe_sanglier',  chance: 8.8, min: 1, max: 1 },
      { item: 'pieds_sanglier',   chance: 1,   min: 1, max: 1 },
    ] },
  { id: 'prespic', name: 'Prespic', level: 14, img: M(53), hp: 300, dmg: [20, 28], res: 8, xp: 120, kamas: [24, 44],
    drops: [
      { item: 'pic_prespic',    chance: 53,  min: 1, max: 2 },
      { item: 'poils_darit',    chance: 8.8, min: 1, max: 1 },
      { item: 'coiffe_prespic', chance: 0.8, min: 1, max: 1 },
      { item: 'cape_prespic',   chance: 0.8, min: 1, max: 1 },
    ] },
];
