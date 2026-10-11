#!/usr/bin/env node
/* Importe depuis DofusDB (données Dofus Unity) tout ce que le jeu utilise et écrit
   js/data/dofusdb-data.js (fichier GÉNÉRÉ : ne pas l'éditer à la main).
     - sorts      : nom, description, icône, PA, recharge, élément, dégâts (niveau 1 du sort)
     - objets     : nom, niveau, type, icône, bonus (effets convertis en stats du jeu)
     - panoplies  : objets et bonus pour 2, 3… pièces portées
     - monstres   : nom, image, table de drop (en %)
   Usage : node tools/importer-dofusdb.js      (Node 18+)
   Pour importer autre chose, ajoute des ids dans les listes ci-dessous puis déclare le
   contenu curaté (classes, monstres, zones…) dans les fichiers de js/data/.
   Données © Ankama — usage fan non commercial. */
const fs = require('fs'), path = require('path');
const API = 'https://api.dofusdb.fr/';

/* ---------------- Ce qu'on importe ---------------- */
const SPELL_IDS = [
  32427, 32426, 32428, 32445, 32438,   // Crâ : Flèche Cinglante, de Recul, de Dispersion, Explosive, d'Expiation
  13123, 13106, 13110, 13115, 13125,   // Iop : Concentration, Pression, Épée Divine, Couperet, Épée de Iop
  12994, 12981, 12982, 12984, 12976,   // Féca : Bulle, Rempart, Bouclier Féca, Nimbus, Typhon
  12781, 24038, 12792, 12796, 12794,   // Pandawa : Paume Explosive, Lait de Bambou, Souillure, Flasque Explosive, Vague à Lame
];
const SET_IDS = [1, 47, 18, 60, 61, 62, 70, 71, 72];  // Bouftou, Paysan, Champêtre, Piou Rouge/Bleu/Violet/Rose/Jaune/Vert
const EXTRA_ITEM_IDS = [91, 140, 134, 828, 44, 49];  // armes de Boisaille, Arc Sifflant, Épée de Boisaille / Fouraille
const RESOURCE_IDS = [
  303, 473, 476,                                  // bois : Frêne, Châtaignier, Noyer
  6900, 6899, 6897, 6903, 6902, 6898, 287,        // plumes de Piou (rouge, vert, bleu, rose, jaune, violet), Graine de Sésame
  374, 641, 2659, 2661,                           // Langue d'Épouvanteur, Coton Ancestral, ressources du Tournesol Sauvage
  306, 2663, 309, 2662, 365, 1673,                // Pissenlit, Engrais, Rose, Bave, Patte d'Arakne (et magique)
  384, 2455, 383, 885, 882,                       // Laine de Bouftou, Sang de Bouftou, Corne de Boufton, Laine Boufton Noir, Laine Chef de Guerre
];
const MONSTER_IDS = [489, 490, 491, 492, 493, 236, 79, 78, 48, 4820, 52, 101, 134, 149, 148];

/* ---------------- Conversion des effets DofusDB -> stats du jeu ---------------- */
const EFFECT_STAT = {
  125: 'vit', 153: 'vit', 118: 'force', 126: 'intel', 119: 'agi', 123: 'chance', 124: 'sagesse', 174: 'init',
  138: 'pow', 115: 'crit', 178: 'heal', 112: 'dmg',
  422: 'dmgTerre', 424: 'dmgFeu', 426: 'dmgEau', 428: 'dmgAir',
  210: 'resTerre', 211: 'resEau', 212: 'resAir', 213: 'resFeu',
};
const DMG_ELEMENT = { 91: 'eau', 92: 'terre', 93: 'air', 94: 'feu', 96: 'eau', 97: 'terre', 98: 'air', 99: 'feu' };

async function get(p, params = {}) {
  const q = new URLSearchParams({ lang: 'fr', ...params }).toString();
  const res = await fetch(`${API}${p}?${q}`);
  if (!res.ok) throw new Error(`${res.status} ${p}`);
  return res.json();
}

/** Liste d'effets DofusDB -> { stat: valeur } (+ ids ignorés). Objets : valeur max du jet ; panoplies : valeur fixe. */
function convert(effects, useMax) {
  const stats = {}, ignored = [];
  (effects || []).forEach((e) => {
    const k = EFFECT_STAT[e.effectId];
    const v = useMax && e.to ? e.to : e.from;
    if (!k) { if (!ignored.includes(e.effectId)) ignored.push(e.effectId); return; }
    stats[k] = (stats[k] || 0) + v;
  });
  return { stats, ignored };
}

(async () => {
  const out = { spells: {}, items: {}, sets: {}, monsters: {} };

  for (const id of SPELL_IDS) {
    const s = await get(`spells/${id}`), lv = await get(`spell-levels/${s.spellLevels[0]}`);
    const dmg = lv.effects.find((e) => DMG_ELEMENT[e.actionId] && e.diceNum > 0);
    out.spells[id] = {
      id, name: s.name.fr, description: s.description.fr, iconId: s.iconId, icone: `sort_${s.iconId}.png`,
      ap: lv.apCost, cd: lv.minCastInterval, range: lv.range,
      element: dmg ? DMG_ELEMENT[dmg.actionId] : null, dice: dmg ? [dmg.diceNum, dmg.diceSide || dmg.diceNum] : null,
      shape: dmg ? dmg.zoneDescr.shape : null,
    };
    console.log('sort', id, s.name.fr);
  }

  const itemIds = new Set([...EXTRA_ITEM_IDS, ...RESOURCE_IDS]);
  for (const sid of SET_IDS) {
    const s = await get(`item-sets/${sid}`);
    const ids = s.items.map((i) => (typeof i === 'object' ? i.id : i));
    ids.forEach((i) => itemIds.add(i));
    const bonus = {}, ignored = new Set();
    s.effects.forEach((eff, k) => {
      const c = convert(eff, false);
      c.ignored.forEach((x) => ignored.add(x));
      if (Object.keys(c.stats).length) bonus[k + 1] = c.stats;
    });
    out.sets[sid] = { id: sid, name: s.name.fr, level: s.level, items: ids, bonus, ignored: [...ignored] };
    console.log('panoplie', sid, s.name.fr);
  }

  for (const id of itemIds) {
    const it = await get(`items/${id}`);
    const c = convert(it.effects, true);
    out.items[id] = {
      id, name: it.name.fr, level: it.level, type: it.type.name.fr, icone: it.img.split('/').pop(),
      stats: c.stats, ignored: c.ignored, set: it.itemSetId > 0 ? it.itemSetId : null,
    };
    console.log('objet', id, it.name.fr);
  }

  for (const id of MONSTER_IDS) {
    const m = await get(`monsters/${id}`);
    out.monsters[id] = {
      id, name: m.name.fr, img: m.img,
      drops: (m.drops || []).filter((d) => d.percentDropForGrade1 > 0).map((d) => ({ item: d.objectId, chance: Math.round(d.percentDropForGrade1 * 100) / 100 })),
    };
    console.log('monstre', id, m.name.fr);
  }

  const file = path.join(__dirname, '..', 'js', 'data', 'dofusdb-data.js');
  fs.writeFileSync(file, `/* FICHIER GÉNÉRÉ par tools/importer-dofusdb.js (données DofusDB / Dofus Unity). Ne pas éditer à la main.
   Relance \`node tools/importer-dofusdb.js\` pour le régénérer. Données © Ankama. */
Game.Data.dofusdb = ${JSON.stringify(out, null, 1)};
`);
  console.log('\nÉcrit :', file);
})().catch((e) => { console.error(e); process.exit(1); });
