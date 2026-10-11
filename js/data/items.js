/* ==========================================================================
   Objets. L'icône vient de DofusDB : Game.img.item(<id d'image>).
   (l'id d'image = fin de l'URL https://api.dofusdb.fr/img/items/<id>.png)

   type  : 'resource' (empilable) | 'equipment' (instance unique, forgemageable plus tard)
   slot  : pour les équipements (voir Game.Data.slots)
   level : niveau requis pour équiper
   stats : vit (PV) · dmg (dommages fixes) · pow (% dommages) · res (% résistance) · crit (% critique)
   value : prix de vente en kamas
   ========================================================================== */
const I = (id) => Game.img.item(id);

Game.Data.slots = [
  { id: 'hat',    name: 'Coiffe',   icon: '🎩' },
  { id: 'amulet', name: 'Amulette', icon: '📿' },
  { id: 'weapon', name: 'Arme',     icon: '⚔️' },
  { id: 'shield', name: 'Bouclier', icon: '🛡️' },
  { id: 'cape',   name: 'Cape',     icon: '🧣' },
  { id: 'ring',   name: 'Anneau',   icon: '💍' },
  { id: 'belt',   name: 'Ceinture', icon: '🎗️' },
  { id: 'boots',  name: 'Bottes',   icon: '👢' },
];

Game.Data.statLabels = {
  vit:  { name: 'PV',          icon: '❤️', suffix: '' },
  dmg:  { name: 'Dommages',    icon: '💥', suffix: '' },
  pow:  { name: '% Dommages',  icon: '🔺', suffix: '%' },
  res:  { name: 'Résistance',  icon: '🛡️', suffix: '%' },
  crit: { name: 'Critique',    icon: '🎯', suffix: '%' },
};

Game.Data.items = [
  /* ---------- Ressources de métier (Bûcheron) ---------- */
  { id: 'bois_frene',        name: 'Bois de Frêne',        type: 'resource', img: I(38017), value: 2 },
  { id: 'bois_chataignier',  name: 'Bois de Châtaignier',  type: 'resource', img: I(38086), value: 4 },
  { id: 'bois_noyer',        name: 'Bois de Noyer',        type: 'resource', img: I(38095), value: 8 },
  { id: 'bois_chene',        name: 'Bois de Chêne',        type: 'resource', img: I(38092), value: 14 },
  { id: 'bois_if',           name: "Bois d'If",            type: 'resource', img: I(38094), value: 24 },

  /* ---------- Ressources de monstres ---------- */
  { id: 'ailes_moskito',     name: 'Ailes de Moskito',     type: 'resource', img: I(104019), value: 3 },
  { id: 'sourcil_moskito',   name: 'Sourcil de Moskito',   type: 'resource', img: I(15044),  value: 9 },
  { id: 'laine_bouftou',     name: 'Laine de Bouftou',     type: 'resource', img: I(57056),  value: 3 },
  { id: 'sang_bouftou',      name: 'Sang de Bouftou',      type: 'resource', img: I(15499),  value: 10 },
  { id: 'plume_tofu',        name: 'Plume de Tofu',        type: 'resource', img: I(53014),  value: 4 },
  { id: 'cocon_ver_soie',    name: 'Cocon de Ver à Soie',  type: 'resource', img: I(15489),  value: 12 },
  { id: 'patte_arakne',      name: "Patte d'Arakne",       type: 'resource', img: I(103035), value: 5 },
  { id: 'patte_arakne_mag',  name: "Patte d'Arakne Magique", type: 'resource', img: I(103392), value: 16 },
  { id: 'defense_sanglier',  name: 'Défense du Sanglier',  type: 'resource', img: I(47059),  value: 7 },
  { id: 'etoffe_sanglier',   name: 'Étoffe du Sanglier',   type: 'resource', img: I(55220),  value: 20 },
  { id: 'pic_prespic',       name: 'Pic de Prespic',       type: 'resource', img: I(47134),  value: 9 },
  { id: 'poils_darit',       name: 'Poils de Darit',       type: 'resource', img: I(54555),  value: 24 },

  /* ---------- Équipements fabriqués (Forgeron) ---------- */
  { id: 'epee_boisaille',  name: 'Épée de Boisaille',  type: 'equipment', slot: 'weapon', level: 1,  img: I(6007),  value: 25,  stats: { dmg: 2, pow: 8 } },
  { id: 'ceinture_bouftou', name: 'Ceinture du Bouftou', type: 'equipment', slot: 'belt', level: 3,  img: I(10029), value: 40,  stats: { vit: 20, res: 2 } },
  { id: 'epee_fouraille',  name: 'Épée de Fouraille',  type: 'equipment', slot: 'weapon', level: 6,  img: I(6002),  value: 90,  stats: { dmg: 4, pow: 15 } },
  { id: 'anneau_sanglier', name: 'Anneau du Sanglier', type: 'equipment', slot: 'ring',   level: 9,  img: I(9073),  value: 120, stats: { pow: 6, vit: 15, crit: 2 } },
  { id: 'bouclier_prespic', name: 'Bouclier hérissé du Prespic', type: 'equipment', slot: 'shield', level: 12, img: I(82514), value: 220, stats: { res: 6, vit: 35 } },

  /* ---------- Équipements rares (drops de monstres) ---------- */
  { id: 'amulette_moskito', name: 'Amulette du Moskito', type: 'equipment', slot: 'amulet', level: 2,  img: I(1075),  value: 30,  stats: { vit: 10, crit: 2 } },
  { id: 'boufbottes',       name: 'Boufbottes',          type: 'equipment', slot: 'boots',  level: 3,  img: I(11026), value: 35,  stats: { vit: 12, dmg: 1 } },
  { id: 'kaskofu',          name: 'Kaskofu',             type: 'equipment', slot: 'hat',    level: 5,  img: I(16128), value: 60,  stats: { vit: 15, res: 2 } },
  { id: 'cape_tofu',        name: 'Cape du Tofu',        type: 'equipment', slot: 'cape',   level: 5,  img: I(17097), value: 60,  stats: { pow: 6, vit: 10 } },
  { id: 'anneau_tofu',      name: 'Anneau du Tofu',      type: 'equipment', slot: 'ring',   level: 6,  img: I(9100),  value: 70,  stats: { dmg: 2, crit: 2 } },
  { id: 'araknacoiffe',     name: "L'Araknacoiffe",      type: 'equipment', slot: 'hat',    level: 9,  img: I(16083), value: 110, stats: { vit: 25, pow: 5 } },
  { id: 'pieds_sanglier',   name: 'Pieds du Sanglier',   type: 'equipment', slot: 'boots',  level: 9,  img: I(11051), value: 110, stats: { vit: 25, res: 3 } },
  { id: 'coiffe_prespic',   name: 'Coiffe du Prespic',   type: 'equipment', slot: 'hat',    level: 12, img: I(16081), value: 180, stats: { vit: 35, res: 3, crit: 2 } },
  { id: 'cape_prespic',     name: 'Cape du Prespic',     type: 'equipment', slot: 'cape',   level: 12, img: I(17075), value: 180, stats: { pow: 10, vit: 25, dmg: 2 } },
];
