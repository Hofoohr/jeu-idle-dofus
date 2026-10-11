/* ==========================================================================
   Objets : ressources et équipements, construits à partir des données DofusDB
   (Dofus Unity) importées dans dofusdb-data.js. Les bonus des équipements sont ceux
   du jeu (jet maximum). Les panoplies sont déclarées dans sets.js.

   `icone` = fichier dans assets/objets/ (identifiant d'image DofusDB).
   type    : 'resource' (empilable) | 'equipment' (instance unique, forgemageable plus tard)
   slot    : hat | cape | amulet | ring | belt | boots | shield | weapon
   level   : niveau requis pour équiper
   weaponType : arc | epee | baton | baguette | marteau | faux. Arcs = Crâ, épées = Iop,
                bâtons = Féca, baguettes = Pandawa ; marteaux et faux : toutes les classes.
   stats   : voir Game.Data.statLabels. Les classes n'ont AUCUNE résistance : elles viennent des objets.
   value   : prix de vente en kamas

   Pour ajouter un objet : ajoute son id dans RESOURCE_IDS / EXTRA_ITEM_IDS de
   tools/importer-dofusdb.js, relance l'import, puis déclare-le ici avec equip() / resource().
   ========================================================================== */
(function () {
  'use strict';
  const D = Game.Data;
  const DB = D.dofusdb;

  D.slots = [
    { id: 'hat',    name: 'Coiffe',   icon: '🎩' },
    { id: 'cape',   name: 'Cape',     icon: '🧣' },
    { id: 'amulet', name: 'Amulette', icon: '📿' },
    { id: 'ring',   name: 'Anneau',   icon: '💍' },
    { id: 'belt',   name: 'Ceinture', icon: '🎗️' },
    { id: 'boots',  name: 'Bottes',   icon: '👢' },
    { id: 'shield', name: 'Bouclier', icon: '🛡️' },
    { id: 'weapon', name: 'Arme',     icon: '⚔️' },
  ];

  D.weaponTypes = { arc: 'Arc', epee: 'Épée', baton: 'Bâton', baguette: 'Baguette', marteau: 'Marteau', faux: 'Faux' };
  // classe qui peut équiper un type d'arme (les types absents ici sont utilisables par toutes les classes)
  D.weaponClass = { arc: 'cra', epee: 'iop', baton: 'feca', baguette: 'pandawa' };

  D.statLabels = {
    vit:      { name: 'Vitalité',      icon: '❤️', suffix: '' },
    force:    { name: 'Force',         icon: '💪', suffix: '' },
    intel:    { name: 'Intelligence',  icon: '🧠', suffix: '' },
    agi:      { name: 'Agilité',       icon: '🌀', suffix: '' },
    chance:   { name: 'Chance',        icon: '🍀', suffix: '' },
    pow:      { name: 'Puissance',     icon: '🔺', suffix: '' },
    dmg:      { name: 'Dommages',      icon: '💥', suffix: '' },
    dmgTerre: { name: 'Dommages Terre', icon: '🟤', suffix: '' },
    dmgFeu:   { name: 'Dommages Feu',  icon: '🔴', suffix: '' },
    dmgEau:   { name: 'Dommages Eau',  icon: '🔵', suffix: '' },
    dmgAir:   { name: 'Dommages Air',  icon: '⚪', suffix: '' },
    crit:     { name: 'Critiques',     icon: '🎯', suffix: '%' },
    heal:     { name: 'Soins',         icon: '💚', suffix: '' },
    sagesse:  { name: 'Sagesse',       icon: '📖', suffix: '' },
    init:     { name: 'Initiative',    icon: '⚡', suffix: '' },
    resTerre: { name: 'Rés. Terre',    icon: '🟤', suffix: '%' },
    resFeu:   { name: 'Rés. Feu',      icon: '🔴', suffix: '%' },
    resEau:   { name: 'Rés. Eau',      icon: '🔵', suffix: '%' },
    resAir:   { name: 'Rés. Air',      icon: '⚪', suffix: '%' },
  };

  const SLOT_BY_TYPE = { Chapeau: 'hat', Cape: 'cape', Amulette: 'amulet', Anneau: 'ring', Ceinture: 'belt', Bottes: 'boots', Bouclier: 'shield',
    Arc: 'weapon', 'Épée': 'weapon', 'Bâton': 'weapon', Baguette: 'weapon', Marteau: 'weapon', Faux: 'weapon' };
  const WEAPON_BY_TYPE = { Arc: 'arc', 'Épée': 'epee', 'Bâton': 'baton', Baguette: 'baguette', Marteau: 'marteau', Faux: 'faux' };

  const slug = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
  const items = (D.items = []);
  D.byDofusId = {};   // id DofusDB -> id du jeu (sert aux tables de drop et aux panoplies)

  /** Ressource empilable. id du jeu explicite (utilisé par les recettes). */
  function resource(id, dofusId) {
    const d = DB.items[dofusId];
    items.push({ id, dofusdbId: dofusId, name: d.name, type: 'resource', icone: d.icone, level: d.level, value: Math.max(2, Math.round(d.level * 0.7)) });
    D.byDofusId[dofusId] = id;
  }

  /** Équipement : id = nom sans accents ; slot, niveau, bonus et icône viennent de DofusDB. */
  function equip(dofusId) {
    const d = DB.items[dofusId];
    const it = { id: slug(d.name), dofusdbId: dofusId, name: d.name, type: 'equipment', slot: SLOT_BY_TYPE[d.type], level: d.level,
      icone: d.icone, value: Math.round(10 + d.level * d.level / 5), stats: Object.assign({}, d.stats) };
    if (WEAPON_BY_TYPE[d.type]) it.weaponType = WEAPON_BY_TYPE[d.type];
    if (!it.slot) console.warn('[data] type d\'objet inconnu', d.type, d.name);
    items.push(it);
    D.byDofusId[dofusId] = it.id;
  }

  /* ---------- Ressources ---------- */
  [['bois_frene', 303], ['bois_chataignier', 473], ['bois_noyer', 476],
   ['plume_piou_rouge', 6900], ['plume_piou_vert', 6899], ['plume_piou_bleu', 6897], ['plume_piou_rose', 6903],
   ['plume_piou_jaune', 6902], ['plume_piou_violet', 6898], ['graine_sesame', 287],
   ['fleur_pissenlit', 306], ['engrais', 2663], ['petale_rose', 309], ['bave_rose', 2662],
   ['petale_tournesol', 2659], ['feuille_tournesol', 2661], ['langue_epouvanteur', 374], ['coton_ancestral', 641],
   ['patte_arakne', 365], ['patte_arakne_mag', 1673],
   ['laine_bouftou', 384], ['sang_bouftou', 2455], ['corne_boufton', 383], ['laine_boufton_noir', 885], ['laine_chef_guerre', 882],
  ].forEach(([id, dof]) => resource(id, dof));

  /* ---------- Équipements : toutes les pièces des panoplies ---------- */
  [1, 47, 18, 60, 61, 62, 70, 71, 72].forEach((setId) => DB.sets[setId].items.forEach(equip));

  /* ---------- Équipements hors panoplie (armes de Boisaille, Arc Sifflant…) ---------- */
  [91, 140, 134, 828, 44, 49].forEach(equip);
})();
