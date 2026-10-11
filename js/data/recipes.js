/* ==========================================================================
   Recettes de craft. Quand c'est possible ce sont les VRAIES recettes de Dofus Unity
   (DofusDB) ; celles marquées `adapted: true` ont des ingrédients remplacés par des
   ressources présentes dans ce jeu (bois, plumes de Piou…).
   job : métier requis · level : niveau de métier requis · time : secondes
   xp  : XP de métier gagnée par fabrication
   ========================================================================== */
Game.Data.recipes = [
  /* ---------- Tailleur : coiffes et capes ---------- */
  { id: 'r_capouze_champs', job: 'tailor', level: 1, time: 4, xp: 14,
    ingredients: [{ item: 'langue_epouvanteur', qty: 3 }, { item: 'bave_rose', qty: 1 }],
    result: { item: 'capouze_des_champs', qty: 1 } },
  { id: 'r_coiffe_champetre', job: 'tailor', level: 3, time: 4, xp: 20, adapted: true,
    ingredients: [{ item: 'fleur_pissenlit', qty: 3 }, { item: 'bave_rose', qty: 1 }],
    result: { item: 'coiffe_champetre', qty: 1 } },
  { id: 'r_coiffe_bouftou', job: 'tailor', level: 8, time: 5, xp: 36,
    ingredients: [{ item: 'corne_boufton', qty: 3 }, { item: 'laine_chef_guerre', qty: 1 }],
    result: { item: 'coiffe_du_bouftou', qty: 1 } },
  { id: 'r_cape_bouffante', job: 'tailor', level: 12, time: 5, xp: 52,
    ingredients: [{ item: 'laine_chef_guerre', qty: 3 }, { item: 'sang_bouftou', qty: 1 }],
    result: { item: 'cape_bouffante', qty: 1 } },

  /* ---------- Sculpteur : arcs, bâtons, baguettes (bois + ressources de monstres) ---------- */
  { id: 'r_baguette_boisaille', job: 'sculptor', level: 1, time: 4, xp: 12, adapted: true,
    ingredients: [{ item: 'bois_frene', qty: 8 }, { item: 'plume_piou_bleu', qty: 3 }],
    result: { item: 'baguette_de_boisaille', qty: 1 } },
  { id: 'r_arc_boisaille', job: 'sculptor', level: 2, time: 4, xp: 16, adapted: true,
    ingredients: [{ item: 'bois_frene', qty: 8 }, { item: 'plume_piou_vert', qty: 3 }],
    result: { item: 'arc_de_boisaille', qty: 1 } },
  { id: 'r_baton_boisaille', job: 'sculptor', level: 3, time: 4, xp: 20, adapted: true,
    ingredients: [{ item: 'bois_frene', qty: 8 }, { item: 'plume_piou_rouge', qty: 3 }],
    result: { item: 'baton_de_boisaille', qty: 1 } },
  { id: 'r_arc_sifflant', job: 'sculptor', level: 8, time: 6, xp: 45, adapted: true,
    ingredients: [{ item: 'bois_chataignier', qty: 8 }, { item: 'plume_piou_bleu', qty: 3 }, { item: 'patte_arakne', qty: 3 }],
    result: { item: 'arc_sifflant', qty: 1 } },
];
