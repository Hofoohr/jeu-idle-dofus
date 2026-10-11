/* ==========================================================================
   Monstres. Le sprite est assets/monstres/<dofusdbId>.png, où dofusdbId est
   l'identifiant du monstre sur DofusDB (https://dofusdb.fr/fr/database/monster/<id>).
   `node tools/telecharger-images.js` récupère les sprites.

   level / hp / init      : niveau, points de vie, initiative (vitesse de la barre d'attaque)
   attack                 : { element, dmg:[min,max] } — l'élément détermine quelle
                            résistance du personnage s'applique
   res                    : résistances du monstre en % { terre, feu, eau, air } : positive = réduit nos dégâts,
                            NÉGATIVE = faiblesse (dégâts augmentés)
   xp / kamas [min,max]   : récompenses par monstre vaincu (l'XP du groupe est partagée entre les 4 persos)
   rare: true             : au plus un monstre « rare » par groupe
   drops                  : { item, chance (en %), min, max } — chaque ligne est tirée indépendamment.
                            drop(dofusdbId, extra) reprend la VRAIE table de drop de DofusDB (ressources et
                            pièces de panoplie du jeu) et y ajoute `extra` (drops inventés pour ce jeu).
   Les stats de combat (PV, dégâts, XP) sont celles du jeu idle, pas celles de Dofus.
   ========================================================================== */
(function () {
  'use strict';
  const D = Game.Data, DB = D.dofusdb;

  /** Table de drop réelle d'un monstre DofusDB (seuls les objets présents dans le jeu sont gardés). */
  function drop(dofusId, extra) {
    const rows = DB.monsters[dofusId].drops.filter((d) => D.byDofusId[d.item]).map((d) => ({ item: D.byDofusId[d.item], chance: d.chance, min: 1, max: d.chance >= 50 ? 2 : 1 }));
    return rows.concat(extra || []);
  }

  const piou = (id, dofusdbId, name, element, res) => ({
    id, name, dofusdbId, level: 2, hp: 120, init: 10, attack: { element, dmg: [2, 4] }, res, xp: 10, kamas: [1, 3],
    drops: drop(dofusdbId, [{ item: 'epee_de_boisaille', chance: 0.6, min: 1, max: 1 }]),   // fan : de quoi équiper les Iop
  });

  D.monsters = [
    /* ---------- Prairie des Piou (une couleur = une panoplie) ---------- */
    piou('piou_rouge',  489, 'Piou Rouge',  'feu',   { feu: 10, eau: -10 }),
    piou('piou_bleu',   491, 'Piou Bleu',   'eau',   { eau: 10, air: -10 }),
    piou('piou_violet', 236, 'Piou Violet', 'air',   { air: 5, terre: -5 }),
    piou('piou_rose',   492, 'Piou Rose',   'eau',   { feu: -5 }),
    piou('piou_jaune',  493, 'Piou Jaune',  'air',   { air: 10, terre: -10 }),
    piou('piou_vert',   490, 'Piou Vert',   'terre', { terre: 10, feu: -10 }),

    /* ---------- Champs d'Astrub ---------- */
    { id: 'pissenlit_diabolique', name: 'Pissenlit Diabolique', dofusdbId: 79, level: 8, hp: 300, init: 25,
      attack: { element: 'terre', dmg: [8, 13] }, res: { terre: 5, eau: 5, feu: -15 }, xp: 40, kamas: [4, 10], drops: drop(79) },
    { id: 'rose_demoniaque', name: 'Rose Démoniaque', dofusdbId: 78, level: 9, hp: 320, init: 25,
      attack: { element: 'feu', dmg: [9, 14] }, res: { feu: 5, air: 5, eau: -15 }, xp: 44, kamas: [4, 10], drops: drop(78) },
    { id: 'tournesol_sauvage', name: 'Tournesol Sauvage', dofusdbId: 48, level: 9, hp: 340, init: 20,
      attack: { element: 'terre', dmg: [8, 13] }, res: { terre: 5, feu: -10 }, xp: 44, kamas: [4, 10], drops: drop(48) },
    { id: 'epouvanteur', name: 'Épouvanteur', dofusdbId: 4820, level: 10, hp: 380, init: 30,
      attack: { element: 'air', dmg: [10, 16] }, res: { air: 5, feu: 5, terre: -10 }, xp: 52, kamas: [5, 12], drops: drop(4820) },
    { id: 'arakne', name: 'Arakne', dofusdbId: 52, level: 11, hp: 400, init: 45,
      attack: { element: 'eau', dmg: [11, 17] }, res: { terre: 5, air: 5, feu: -10 }, xp: 58, kamas: [6, 14],
      drops: drop(52, [{ item: 'epee_de_fouraille', chance: 1, min: 1, max: 1 }]) },

    /* ---------- Plaine des Bouftous ---------- */
    { id: 'bouftou', name: 'Bouftou', dofusdbId: 101, level: 14, hp: 520, init: 30,
      attack: { element: 'terre', dmg: [12, 19] }, res: { feu: -10 }, xp: 120, kamas: [10, 24], drops: drop(101) },
    { id: 'boufton_blanc', name: 'Boufton Blanc', dofusdbId: 134, level: 15, hp: 600, init: 35,
      attack: { element: 'terre', dmg: [14, 22] }, res: { terre: 5, feu: -10 }, xp: 140, kamas: [12, 28], drops: drop(134) },
    { id: 'boufton_noir', name: 'Boufton Noir', dofusdbId: 149, level: 16, hp: 640, init: 40,
      attack: { element: 'terre', dmg: [15, 23] }, res: { terre: 5, eau: -10 }, xp: 150, kamas: [12, 30], drops: drop(149) },
    { id: 'chef_guerre_bouftou', name: 'Chef de Guerre Bouftou', dofusdbId: 148, level: 20, hp: 1600, init: 60, rare: true,
      attack: { element: 'terre', dmg: [22, 34] }, res: { terre: 10, feu: 5, eau: 5, air: 5 }, xp: 450, kamas: [50, 100], drops: drop(148) },
  ];
})();
