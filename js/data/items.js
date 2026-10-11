/* ==========================================================================
   Objets. `icone` = nom du fichier dans assets/objets/ ; par convention c'est
   l'identifiant d'image DofusDB (https://api.dofusdb.fr/img/items/<icone>).
   `node tools/telecharger-images.js` les télécharge automatiquement.

   type    : 'resource' (empilable) | 'equipment' (instance unique, forgemageable plus tard)
   slot    : hat | cape | amulet | ring | belt | boots | weapon (voir Game.Data.slots)
   level   : niveau requis pour équiper
   weaponType : pour slot 'weapon' : arc | epee | baton | baguette (réservé à la classe correspondante)
   stats   : vit · force · intel · agi · chance (caractéristiques) · dmg (Dommages fixes ajoutés aux sorts)
             · sagesse (+% XP) · init (initiative bonus) · resTerre · resFeu · resEau · resAir (en %)
             Les classes n'ont AUCUNE résistance : elles viennent des objets.
   value   : prix de vente en kamas
   ========================================================================== */
Game.Data.slots = [
  { id: 'hat',    name: 'Coiffe',   icon: '🎩' },
  { id: 'cape',   name: 'Cape',     icon: '🧣' },
  { id: 'amulet', name: 'Amulette', icon: '📿' },
  { id: 'ring',   name: 'Anneau',   icon: '💍' },
  { id: 'belt',   name: 'Ceinture', icon: '🎗️' },
  { id: 'boots',  name: 'Bottes',   icon: '👢' },
  { id: 'weapon', name: 'Arme',     icon: '⚔️' },
];

Game.Data.weaponTypes = { arc: 'Arc', epee: 'Épée', baton: 'Bâton', baguette: 'Baguette' };

Game.Data.statLabels = {
  vit:      { name: 'Vitalité',     icon: '❤️', suffix: '' },
  force:    { name: 'Force',        icon: '💪', suffix: '' },
  intel:    { name: 'Intelligence', icon: '🧠', suffix: '' },
  agi:      { name: 'Agilité',      icon: '🌀', suffix: '' },
  chance:   { name: 'Chance',       icon: '🍀', suffix: '' },
  dmg:      { name: 'Dommages',     icon: '💥', suffix: '' },
  sagesse:  { name: 'Sagesse',      icon: '📖', suffix: '' },
  init:     { name: 'Initiative',   icon: '⚡', suffix: '' },
  resTerre: { name: 'Rés. Terre',   icon: '🟤', suffix: '%' },
  resFeu:   { name: 'Rés. Feu',     icon: '🔴', suffix: '%' },
  resEau:   { name: 'Rés. Eau',     icon: '🔵', suffix: '%' },
  resAir:   { name: 'Rés. Air',     icon: '⚪', suffix: '%' },
};

Game.Data.items = [
  /* ---------- Ressources de métier (Bûcheron) ---------- */
  { id: 'bois_frene',       name: 'Bois de Frêne',       type: 'resource', icone: '38017.png', value: 2 },
  { id: 'bois_chataignier', name: 'Bois de Châtaignier', type: 'resource', icone: '38086.png', value: 5 },
  { id: 'bois_noyer',       name: 'Bois de Noyer',       type: 'resource', icone: '38095.png', value: 10 },

  /* ---------- Ressources de monstres ---------- */
  { id: 'laine_bouftou',     name: 'Laine de Bouftou',            type: 'resource', icone: '57056.png',  value: 3 },
  { id: 'sang_bouftou',      name: 'Sang de Bouftou',             type: 'resource', icone: '15499.png',  value: 9 },
  { id: 'corne_boufton',     name: 'Corne de Boufton',            type: 'resource', icone: '47055.png',  value: 4 },
  { id: 'laine_boufton_noir', name: 'Laine de Boufton Noir',      type: 'resource', icone: '57210.png',  value: 5 },
  { id: 'laine_chef_guerre', name: 'Laine du Chef de Guerre Bouftou', type: 'resource', icone: '57209.png', value: 40 },
  { id: 'plume_tofu',        name: 'Plume de Tofu',               type: 'resource', icone: '53014.png',  value: 4 },
  { id: 'cocon_ver_soie',    name: 'Cocon de Ver à Soie',         type: 'resource', icone: '15489.png',  value: 12 },
  { id: 'fleur_pissenlit',   name: 'Fleur de Pissenlit Diabolique', type: 'resource', icone: '35018.png', value: 5 },
  { id: 'engrais',           name: 'Engrais',                     type: 'resource', icone: '15635.png',  value: 12 },
  { id: 'petale_rose',       name: 'Pétale de Rose Démoniaque',   type: 'resource', icone: '35020.png',  value: 5 },
  { id: 'bave_rose',         name: 'Bave de Rose Démoniaque',     type: 'resource', icone: '15634.png',  value: 12 },
  { id: 'patte_arakne',      name: "Patte d'Arakne",              type: 'resource', icone: '103035.png', value: 6 },
  { id: 'patte_arakne_mag',  name: "Patte d'Arakne Magique",      type: 'resource', icone: '103392.png', value: 18 },

  /* ---------- Équipements fabriqués : Tailleur (coiffes et capes) ---------- */
  { id: 'coiffe_bouftou', name: 'Coiffe du Bouftou', type: 'equipment', slot: 'hat',  level: 3,  icone: '16041.png', value: 45,  stats: { vit: 15, resTerre: 3 } },
  { id: 'cape_bouffante', name: 'Cape Bouffante',    type: 'equipment', slot: 'cape', level: 5,  icone: '17044.png', value: 70,  stats: { vit: 12, init: 10, resAir: 3 } },
  { id: 'kaskofu',        name: 'Kaskofu',           type: 'equipment', slot: 'hat',  level: 8,  icone: '16128.png', value: 110, stats: { vit: 20, intel: 6, sagesse: 4, resFeu: 3 } },
  { id: 'cape_tofu',      name: 'Cape du Tofu',      type: 'equipment', slot: 'cape', level: 10, icone: '17097.png', value: 160, stats: { vit: 18, agi: 6, init: 15, resAir: 4 } },

  /* ---------- Équipements fabriqués : Sculpteur (arcs, bâtons, baguettes) ---------- */
  { id: 'arc_boisaille',      name: 'Arc de Boisaille',      type: 'equipment', slot: 'weapon', weaponType: 'arc',      level: 1, icone: '2001.png', value: 30,  stats: { dmg: 2, agi: 10, vit: 5 } },
  { id: 'baton_boisaille',    name: 'Bâton de Boisaille',    type: 'equipment', slot: 'weapon', weaponType: 'baton',    level: 1, icone: '4001.png', value: 30,  stats: { dmg: 2, intel: 10, vit: 5 } },
  { id: 'baguette_boisaille', name: 'Baguette de Boisaille', type: 'equipment', slot: 'weapon', weaponType: 'baguette', level: 1, icone: '3008.png', value: 30,  stats: { dmg: 2, chance: 10, vit: 5 } },
  { id: 'arc_sifflant',       name: 'Arc Sifflant',          type: 'equipment', slot: 'weapon', weaponType: 'arc',      level: 8, icone: '2015.png', value: 130, stats: { dmg: 5, agi: 24, vit: 10, init: 10 } },

  /* ---------- Équipements rares (drops de monstres) ---------- */
  { id: 'epee_boisaille',   name: 'Épée de Boisaille',    type: 'equipment', slot: 'weapon', weaponType: 'epee', level: 1,  icone: '6007.png',  value: 30,  stats: { dmg: 2, force: 10, vit: 5 } },
  { id: 'epee_fouraille',   name: 'Épée de Fouraille',    type: 'equipment', slot: 'weapon', weaponType: 'epee', level: 8,  icone: '6002.png',  value: 140, stats: { dmg: 5, force: 24, vit: 10, resTerre: 3 } },
  { id: 'baguette_tofu',    name: 'Baguette du Tofu',     type: 'equipment', slot: 'weapon', weaponType: 'baguette', level: 7, icone: '3058.png', value: 120, stats: { dmg: 4, chance: 20, vit: 8, sagesse: 3 } },
  { id: 'plantouze_champs', name: 'La Plantouze des Champs', type: 'equipment', slot: 'weapon', weaponType: 'baton', level: 9, icone: '4045.png', value: 150, stats: { dmg: 5, intel: 22, vit: 12, resFeu: 3 } },
  { id: 'boufbottes',       name: 'Boufbottes',           type: 'equipment', slot: 'boots',  level: 3,  icone: '11026.png', value: 40,  stats: { vit: 12, init: 8 } },
  { id: 'ceinture_bouftou', name: 'Ceinture du Bouftou',  type: 'equipment', slot: 'belt',   level: 3,  icone: '10029.png', value: 40,  stats: { vit: 14, resTerre: 2 } },
  { id: 'anneau_bouze',     name: 'Anneau de Bouze le Clerc', type: 'equipment', slot: 'ring', level: 4, icone: '9044.png', value: 55, stats: { dmg: 1, vit: 10, force: 4, sagesse: 3 } },
  { id: 'amulette_bouftou', name: 'Amulette du Bouftou',  type: 'equipment', slot: 'amulet', level: 4,  icone: '1048.png',  value: 55,  stats: { vit: 12, sagesse: 4, init: 6 } },
  { id: 'anneau_tofu',      name: 'Anneau du Tofu',       type: 'equipment', slot: 'ring',   level: 6,  icone: '9100.png',  value: 80,  stats: { agi: 6, chance: 4, init: 8 } },
  { id: 'amulette_champs',  name: 'Amulette des Champs',  type: 'equipment', slot: 'amulet', level: 8,  icone: '1073.png',  value: 100, stats: { vit: 18, intel: 5, sagesse: 5 } },
  { id: 'anneau_champetre', name: 'Anneau Champêtre',     type: 'equipment', slot: 'ring',   level: 8,  icone: '9065.png',  value: 100, stats: { vit: 14, force: 6, chance: 5 } },
  { id: 'bottes_champetres', name: 'Bottes Champêtres',   type: 'equipment', slot: 'boots',  level: 9,  icone: '11050.png', value: 110, stats: { vit: 20, init: 12, resEau: 3 } },
  { id: 'ceinture_fleurie', name: 'Ceinture Fleurie',     type: 'equipment', slot: 'belt',   level: 9,  icone: '10064.png', value: 110, stats: { vit: 22, intel: 5, resFeu: 3 } },
  { id: 'araknoton',        name: 'Araknoton',            type: 'equipment', slot: 'ring',   level: 10, icone: '9076.png',  value: 140, stats: { dmg: 2, vit: 16, agi: 8, init: 10 } },
  { id: 'araknoture',       name: 'Araknoture',           type: 'equipment', slot: 'belt',   level: 10, icone: '10073.png', value: 140, stats: { vit: 24, agi: 5, resAir: 4 } },
];
