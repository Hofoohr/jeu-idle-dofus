/* ==========================================================================
   Sorts. Les classes (classes.js) y font référence par leur id.

   kind    : 'damage' (dégâts) | 'heal' (soin) | 'shield' (bouclier) | 'debuff' (affaiblissement)
   element : terre | feu | eau | air  (voir Game.Data.elements ; détermine la stat et la résistance)
   power   : puissance de base au niveau 1. Valeur finale =
             power × (1 + 5 %/niveau) × (1 + stat de l'élément / 100)
   cd      : nombre d'actions du lanceur entre deux lancers (0 = attaque de base, toujours dispo)
   aoe     : true => touche tous les ennemis (damage) / tous les alliés (shield)
   duration: tours (actions de la cible) pour shield / debuff · value : debuff, fraction de dégâts retirée

   L'IA (voir systems/combat.js, chooseSpell) parcourt les sorts de la classe DANS L'ORDRE :
     heal   → si un allié est sous 50 % de PV (le plus blessé)
     shield → si un allié n'a pas de bouclier (donc surtout en début de combat)
     debuff → si un ennemi n'est pas déjà affaibli
     damage → sinon ; un sort de zone (aoe) n'est lancé que s'il y a au moins 2 ennemis
   Le dernier sort de la classe doit avoir cd:0 (attaque de base).
   ========================================================================== */
Game.Data.spells = [
  /* ---------- Crâ (air / agilité) ---------- */
  { id: 'fleche_dispersion', name: 'Flèche de Dispersion', icon: '🎯', kind: 'damage', element: 'air', power: 11, cd: 4, aoe: true, desc: 'Touche tous les ennemis.' },
  { id: 'tir_puissant',      name: 'Tir Puissant',         icon: '🔥', kind: 'damage', element: 'air', power: 26, cd: 3, desc: 'Gros dégât sur un ennemi.' },
  { id: 'fleche_magique',    name: 'Flèche Magique',       icon: '🏹', kind: 'damage', element: 'air', power: 10, cd: 0, desc: 'Attaque de base.' },

  /* ---------- Iop (terre / force) ---------- */
  { id: 'colere_iop',  name: 'Colère de Iop', icon: '💥', kind: 'damage', element: 'terre', power: 46, cd: 6, desc: 'Coup dévastateur.' },
  { id: 'epee_divine', name: 'Épée Divine',   icon: '⚔️', kind: 'damage', element: 'terre', power: 28, cd: 3, desc: 'Gros dégât sur un ennemi.' },
  { id: 'pression',    name: 'Pression',      icon: '💢', kind: 'damage', element: 'terre', power: 11, cd: 0, desc: 'Attaque de base.' },

  /* ---------- Féca (feu / intelligence) ---------- */
  { id: 'rempart',          name: 'Rempart',           icon: '🛡️', kind: 'shield', element: 'feu', power: 12, duration: 3, cd: 6, aoe: true, desc: 'Bouclier sur toute l\'équipe.' },
  { id: 'armure_terrestre', name: 'Armure Terrestre',  icon: '🧱', kind: 'shield', element: 'feu', power: 22, duration: 4, cd: 3, desc: 'Gros bouclier sur un allié.' },
  { id: 'attaque_naturelle', name: 'Attaque Naturelle', icon: '🔥', kind: 'damage', element: 'feu', power: 8, cd: 0, desc: 'Attaque de base.' },

  /* ---------- Pandawa (eau / chance) ---------- */
  { id: 'lait_bambou',  name: 'Lait de Bambou', icon: '🥛', kind: 'heal',   element: 'eau', power: 14, cd: 2, desc: 'Soigne l\'allié le plus blessé.' },
  { id: 'epouvante',    name: 'Épouvante',      icon: '😱', kind: 'debuff', element: 'eau', value: 0.30, duration: 3, cd: 4, desc: 'Réduit de 30 % les dégâts d\'un ennemi.' },
  { id: 'vague_a_lame', name: 'Vague à Lame',   icon: '🌊', kind: 'damage', element: 'eau', power: 9, cd: 0, desc: 'Attaque de base.' },
];
