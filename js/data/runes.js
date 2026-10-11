/* ==========================================================================
   [À VENIR] Runes (brisage) et forgemagie.
   Format prévu d'une rune :
   { id, name, img, stat: 'vit'|'dmg'|'pow'|'res'|'crit', amount, rarity }
   Brisage : un équipement détruit donne des runes selon ses stats (js/systems/breaking.js).
   Forgemagie : consommer une rune pour ajouter `amount` à instance.mods[stat],
   avec une chance d'échec (js/systems/forgemagie.js).
   Les instances d'équipement ont déjà un champ `mods` prévu pour ça.
   ========================================================================== */
Game.Data.runes = [];
