/* ==========================================================================
   Panoplies (Dofus Unity, importées depuis DofusDB). Porter plusieurs pièces d'une même
   panoplie donne un bonus : bonus[n] = bonus TOTAL avec n pièces portées (pas cumulatif).
   Bonus non gérés par le jeu (ignorés) : PA, PM, PO, invocations, dommages neutres…

   Piou -> Champs -> Bouftou : les 6 panoplies Piou tombent dans la zone Piou, les panoplies
   Champêtre et du Paysan aux Champs, la panoplie du Bouftou à la Plaine des Bouftous.
   ========================================================================== */
(function () {
  'use strict';
  const D = Game.Data, DB = D.dofusdb;
  const slug = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');

  D.sets = [1, 47, 18, 60, 61, 62, 70, 71, 72].map((dofusId) => {
    const s = DB.sets[dofusId];
    const set = { id: slug(s.name), dofusdbId: dofusId, name: s.name, level: s.level,
      items: s.items.map((i) => D.byDofusId[i]), bonus: s.bonus };
    set.items.forEach((id) => { D.items.find((it) => it.id === id).set = set.id; });
    return set;
  });
})();
