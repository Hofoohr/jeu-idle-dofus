/* ==========================================================================
   Sorts. Les classes (classes.js) y font référence par leur id.

   kind    : 'damage' (dégâts) | 'heal' (soin) | 'shield' (bouclier) | 'debuff' (affaiblissement)
   element : terre | feu | eau | air  (voir Game.Data.elements : donne la caractéristique associée)
   power   : puissance de base. Valeur finale = power × (100 + caractéristique associée) / 100
             (+ Dommages pour les sorts de dégâts), puis réduite/augmentée par la résistance
             de l'ennemi à l'élément du sort.
   cd      : nombre d'actions du lanceur avant de pouvoir relancer le sort (0 = attaque de base,
             toujours disponible ; chaque classe en a une seule)
   aoe     : true => touche tous les ennemis (damage) / tous les alliés (shield, heal)
   duration: actions de la cible pour shield / debuff · value : debuff, fraction de dégâts retirée

   Un sort n'est « prêt » que si sa recharge est finie ET qu'il a une utilité :
     heal   → un allié est sous 50 % de PV          shield → un allié n'a pas de bouclier
     debuff → un ennemi n'est pas déjà affaibli     damage de zone → au moins 2 ennemis
   Parmi les sorts prêts, la PRIORITÉ choisie par le joueur (écran Équipe) décide.
   ========================================================================== */
Game.Data.spells = [
  /* ---------- Crâ (air / agilité) ---------- */
  { id: 'fleche_magique',    name: 'Flèche Magique',       icon: '🏹', kind: 'damage', element: 'air', power: 10, cd: 0, desc: 'Attaque de base.' },
  { id: 'tir_puissant',      name: 'Tir Puissant',         icon: '🔥', kind: 'damage', element: 'air', power: 28, cd: 3, desc: 'Gros dégât sur un ennemi.' },
  { id: 'fleche_dispersion', name: 'Flèche de Dispersion', icon: '🎯', kind: 'damage', element: 'air', power: 12, cd: 4, aoe: true, desc: 'Touche tous les ennemis.' },
  { id: 'fleche_explosive',  name: 'Flèche Explosive',     icon: '💥', kind: 'damage', element: 'air', power: 20, cd: 6, aoe: true, desc: 'Explosion sur tous les ennemis.' },
  { id: 'tir_critique',      name: 'Tir Critique',         icon: '☄️', kind: 'damage', element: 'air', power: 70, cd: 8, desc: 'Un tir dévastateur sur un ennemi.' },

  /* ---------- Iop (terre / force) ---------- */
  { id: 'pression',          name: 'Pression',             icon: '💢', kind: 'damage', element: 'terre', power: 11, cd: 0, desc: 'Attaque de base.' },
  { id: 'epee_divine',       name: 'Épée Divine',          icon: '⚔️', kind: 'damage', element: 'terre', power: 28, cd: 3, desc: 'Gros dégât sur un ennemi.' },
  { id: 'tempete_puissance', name: 'Tempête de Puissance', icon: '🌪️', kind: 'damage', element: 'terre', power: 12, cd: 4, aoe: true, desc: 'Touche tous les ennemis.' },
  { id: 'colere_iop',        name: 'Colère de Iop',        icon: '😡', kind: 'damage', element: 'terre', power: 46, cd: 6, desc: 'Coup dévastateur.' },
  { id: 'epee_celeste',      name: 'Épée Céleste',         icon: '🗡️', kind: 'damage', element: 'terre', power: 26, cd: 7, aoe: true, desc: 'Une pluie d\'épées sur tous les ennemis.' },

  /* ---------- Féca (feu / intelligence) ---------- */
  { id: 'attaque_naturelle', name: 'Attaque Naturelle',    icon: '🔥', kind: 'damage', element: 'feu', power: 8, cd: 0, desc: 'Attaque de base.' },
  { id: 'armure_terrestre',  name: 'Armure Terrestre',     icon: '🧱', kind: 'shield', element: 'feu', power: 22, duration: 4, cd: 3, desc: 'Gros bouclier sur un allié.' },
  { id: 'rempart',           name: 'Rempart',              icon: '🛡️', kind: 'shield', element: 'feu', power: 12, duration: 3, cd: 6, aoe: true, desc: 'Bouclier sur toute l\'équipe.' },
  { id: 'glyphe_agressif',   name: 'Glyphe Agressif',      icon: '🔯', kind: 'damage', element: 'feu', power: 11, cd: 4, aoe: true, desc: 'Touche tous les ennemis.' },
  { id: 'immunite',          name: 'Immunité',             icon: '✨', kind: 'shield', element: 'feu', power: 30, duration: 3, cd: 9, aoe: true, desc: 'Gros bouclier sur toute l\'équipe.' },

  /* ---------- Pandawa (eau / chance) ---------- */
  { id: 'vague_a_lame',      name: 'Vague à Lame',         icon: '🌊', kind: 'damage', element: 'eau', power: 9, cd: 0, desc: 'Attaque de base.' },
  { id: 'lait_bambou',       name: 'Lait de Bambou',       icon: '🥛', kind: 'heal',   element: 'eau', power: 14, cd: 2, desc: 'Soigne l\'allié le plus blessé.' },
  { id: 'epouvante',         name: 'Épouvante',            icon: '😱', kind: 'debuff', element: 'eau', value: 0.30, duration: 3, cd: 4, desc: 'Réduit de 30 % les dégâts d\'un ennemi.' },
  { id: 'souffle_alcoolise', name: 'Souffle Alcoolisé',    icon: '🍶', kind: 'damage', element: 'eau', power: 12, cd: 5, aoe: true, desc: 'Touche tous les ennemis.' },
  { id: 'lait_revigorant',   name: 'Lait Revigorant',      icon: '🍼', kind: 'heal',   element: 'eau', power: 16, cd: 6, aoe: true, desc: 'Soigne toute l\'équipe.' },
];
