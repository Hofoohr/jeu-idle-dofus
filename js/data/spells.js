/* ==========================================================================
   Sorts de Dofus Unity (importés depuis DofusDB, voir dofusdb-data.js) adaptés au combat
   automatique. Nom, description, icône, coût en PA, élément et dégâts (moyenne des dés du
   niveau 1 du sort) sont ceux du jeu ; la RECHARGE et les effets de soutien sont adaptés.

   kind    : 'damage' (dégâts) | 'heal' (soin) | 'shield' (bouclier) | 'debuff' (affaiblissement)
   element : terre | feu | eau | air  (voir Game.Data.elements : donne la caractéristique associée)
   power   : base du sort. Valeur finale = power × (100 + caractéristique associée + Puissance) / 100
             (+ Dommages et Dommages de l'élément pour les dégâts, + Soins pour les soins),
             puis réduite/augmentée par la résistance de l'ennemi à l'élément du sort.
   cd      : actions du lanceur avant de pouvoir relancer le sort (0 = attaque de base,
             toujours disponible ; chaque classe en a une seule)
   aoe     : true => touche tous les ennemis (damage) / tous les alliés (shield, heal)
   duration: actions de la cible pour shield / debuff · value : debuff, fraction de dégâts retirée

   Un sort n'est « prêt » que si sa recharge est finie ET qu'il a une utilité :
     heal   → un allié est sous 50 % de PV          shield → un allié n'a pas de bouclier
     debuff → un ennemi n'est pas déjà affaibli     damage de zone → au moins 2 ennemis
   Parmi les sorts prêts, la PRIORITÉ choisie par le joueur (écran Équipe) décide.

   Adaptations (note: affichée dans l'écran Équipe) : Rempart et Bouclier Féca (réduction de
   dommages en jeu) sont des boucliers ; Lait de Bambou est un soin ; Souillure réduit les
   dégâts d'un ennemi (elle retire de la Puissance en jeu).
   ========================================================================== */
(function () {
  'use strict';
  const D = Game.Data, DB = D.dofusdb;

  /** Construit un sort du jeu à partir d'un sort DofusDB. o : { id, kind, cd, aoe, … } */
  function unity(dofusId, o) {
    const d = DB.spells[dofusId];
    const power = o.power !== undefined ? o.power : (d.dice[0] + d.dice[1]) / 2;
    const sp = { id: o.id, dofusdbId: dofusId, name: d.name, icone: d.icone, ap: d.ap, kind: o.kind || 'damage',
      element: o.element || d.element, power, cd: o.cd, aoe: !!o.aoe, desc: d.description.split('\n')[0] };
    if (o.duration) sp.duration = o.duration;
    if (o.value) sp.value = o.value;
    if (o.note) sp.note = o.note;
    return sp;
  }

  D.spells = [
    /* ---------- Crâ ---------- */
    unity(32427, { id: 'fleche_cinglante',   cd: 0 }),                  // attaque de base (Air)
    unity(32426, { id: 'fleche_de_recul',     cd: 2 }),
    unity(32428, { id: 'fleche_de_dispersion', cd: 3, aoe: true }),
    unity(32445, { id: 'fleche_explosive',    cd: 4, aoe: true }),
    unity(32438, { id: 'fleche_d_expiation',  cd: 3 }),

    /* ---------- Iop ---------- */
    unity(13123, { id: 'concentration',  cd: 0 }),                       // attaque de base (Terre)
    unity(13106, { id: 'pression',       cd: 2 }),
    unity(13110, { id: 'epee_divine',    cd: 3, aoe: true }),
    unity(13115, { id: 'couperet',       cd: 3, aoe: true }),
    unity(13125, { id: 'epee_de_iop',    cd: 5, aoe: true }),

    /* ---------- Féca ---------- */
    unity(12994, { id: 'bulle',          cd: 0 }),                       // attaque de base (Eau)
    unity(12981, { id: 'rempart',        cd: 3, kind: 'shield', element: 'eau', power: 12, duration: 3, aoe: true,
      note: 'Adapté : en jeu, réduit les dommages reçus ; ici, bouclier sur toute l\'équipe.' }),
    unity(12982, { id: 'bouclier_feca',  cd: 3, kind: 'shield', element: 'eau', power: 22, duration: 4,
      note: 'Adapté : en jeu, réduit les dommages subis ; ici, gros bouclier sur un allié.' }),
    unity(12984, { id: 'nimbus',         cd: 3, aoe: true }),
    unity(12976, { id: 'typhon',         cd: 4, aoe: true }),

    /* ---------- Pandawa ---------- */
    unity(12781, { id: 'paume_explosive', cd: 0 }),                      // attaque de base (Feu)
    unity(24038, { id: 'lait_de_bambou', cd: 3, kind: 'heal', element: 'feu', power: 14,
      note: 'Adapté : en jeu, réduit la durée des effets ; ici, soigne l\'allié le plus blessé.' }),
    unity(12792, { id: 'souillure',      cd: 4, kind: 'debuff', element: 'feu', value: 0.30, duration: 3, power: 0,
      note: 'Adapté : retire de la Puissance en jeu ; ici, réduit de 30 % les dégâts d\'un ennemi.' }),
    unity(12796, { id: 'flasque_explosive', cd: 3, aoe: true }),
    unity(12794, { id: 'vague_a_lame',   cd: 4 }),
  ];
})();
