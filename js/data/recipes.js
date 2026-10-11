/* ==========================================================================
   Recettes de craft. (V1 : le Forgeron utilise bois + ressources de monstres ;
   pas de métier de mineur pour l'instant.)
   job : métier requis · level : niveau de métier requis · time : secondes
   xp  : XP de métier gagnée par fabrication
   ========================================================================== */
Game.Data.recipes = [
  { id: 'r_epee_boisaille', job: 'blacksmith', level: 1,  time: 4, xp: 12,
    ingredients: [{ item: 'bois_frene', qty: 8 }],
    result: { item: 'epee_boisaille', qty: 1 } },
  { id: 'r_ceinture_bouftou', job: 'blacksmith', level: 3,  time: 4, xp: 20,
    ingredients: [{ item: 'laine_bouftou', qty: 8 }, { item: 'bois_frene', qty: 4 }],
    result: { item: 'ceinture_bouftou', qty: 1 } },
  { id: 'r_epee_fouraille', job: 'blacksmith', level: 6,  time: 5, xp: 32,
    ingredients: [{ item: 'bois_chataignier', qty: 10 }, { item: 'patte_arakne', qty: 6 }],
    result: { item: 'epee_fouraille', qty: 1 } },
  { id: 'r_anneau_sanglier', job: 'blacksmith', level: 9,  time: 5, xp: 48,
    ingredients: [{ item: 'defense_sanglier', qty: 8 }, { item: 'bois_chataignier', qty: 4 }],
    result: { item: 'anneau_sanglier', qty: 1 } },
  { id: 'r_bouclier_prespic', job: 'blacksmith', level: 12, time: 6, xp: 70,
    ingredients: [{ item: 'pic_prespic', qty: 10 }, { item: 'bois_noyer', qty: 6 }, { item: 'defense_sanglier', qty: 4 }],
    result: { item: 'bouclier_prespic', qty: 1 } },
];
