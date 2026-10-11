/* ==========================================================================
   Recettes de craft (fan-made : adaptées pour utiliser bois + ressources de monstres).
   job : métier requis · level : niveau de métier requis · time : secondes
   xp  : XP de métier gagnée par fabrication
   ========================================================================== */
Game.Data.recipes = [
  /* ---------- Tailleur : coiffes et capes ---------- */
  { id: 'r_coiffe_bouftou', job: 'tailor', level: 1, time: 4, xp: 12,
    ingredients: [{ item: 'laine_bouftou', qty: 10 }, { item: 'corne_boufton', qty: 2 }],
    result: { item: 'coiffe_bouftou', qty: 1 } },
  { id: 'r_cape_bouffante', job: 'tailor', level: 4, time: 4, xp: 22,
    ingredients: [{ item: 'laine_bouftou', qty: 8 }, { item: 'laine_boufton_noir', qty: 6 }],
    result: { item: 'cape_bouffante', qty: 1 } },
  { id: 'r_kaskofu', job: 'tailor', level: 7, time: 5, xp: 34,
    ingredients: [{ item: 'plume_tofu', qty: 10 }, { item: 'fleur_pissenlit', qty: 6 }],
    result: { item: 'kaskofu', qty: 1 } },
  { id: 'r_cape_tofu', job: 'tailor', level: 10, time: 5, xp: 50,
    ingredients: [{ item: 'plume_tofu', qty: 12 }, { item: 'petale_rose', qty: 6 }, { item: 'patte_arakne', qty: 4 }],
    result: { item: 'cape_tofu', qty: 1 } },

  /* ---------- Sculpteur : arcs, bâtons, baguettes ---------- */
  { id: 'r_arc_boisaille', job: 'sculptor', level: 1, time: 4, xp: 12,
    ingredients: [{ item: 'bois_frene', qty: 8 }, { item: 'laine_bouftou', qty: 4 }],
    result: { item: 'arc_boisaille', qty: 1 } },
  { id: 'r_baton_boisaille', job: 'sculptor', level: 2, time: 4, xp: 16,
    ingredients: [{ item: 'bois_frene', qty: 8 }, { item: 'corne_boufton', qty: 3 }],
    result: { item: 'baton_boisaille', qty: 1 } },
  { id: 'r_baguette_boisaille', job: 'sculptor', level: 3, time: 4, xp: 20,
    ingredients: [{ item: 'bois_frene', qty: 8 }, { item: 'laine_boufton_noir', qty: 4 }],
    result: { item: 'baguette_boisaille', qty: 1 } },
  { id: 'r_arc_sifflant', job: 'sculptor', level: 8, time: 6, xp: 45,
    ingredients: [{ item: 'bois_chataignier', qty: 10 }, { item: 'patte_arakne', qty: 6 }, { item: 'petale_rose', qty: 4 }],
    result: { item: 'arc_sifflant', qty: 1 } },
];
