/* ==========================================================================
   Classes jouables. Pour en ajouter une : copie un bloc, crée le sprite
   assets/classes/<id>.png et référence des sorts de spells.js.

   base / perLevel : caractéristiques au niveau 1 / gain par niveau
     vit (PV) · force · intel · agi · chance · sagesse · init (initiative)
     resTerre · resFeu · resEau · resAir (résistances en %)
   weapon : type d'arme utilisable (arc, epee, baton, baguette)
   spells : par ordre de PRIORITÉ pour l'IA (voir spells.js)
   ========================================================================== */
Game.Data.classes = [
  {
    id: 'cra', name: 'Crâ', role: 'Dégâts à distance', weapon: 'arc', color: '#7cb342',
    desc: 'Archer redoutable : dégâts à distance très élevés, mais peu de PV.',
    base:     { vit: 45, force: 0, intel: 0, agi: 30, chance: 0, sagesse: 0, init: 40, resTerre: 0, resFeu: 0, resEau: 0, resAir: 0 },
    perLevel: { vit: 5,  force: 0, intel: 0, agi: 4,  chance: 0, sagesse: 0.5, init: 2, resTerre: 0, resFeu: 0, resEau: 0, resAir: 0 },
    spells: ['fleche_dispersion', 'tir_puissant', 'fleche_magique'],
  },
  {
    id: 'iop', name: 'Iop', role: 'Dégâts en mêlée', weapon: 'epee', color: '#e53935',
    desc: 'Guerrier impétueux : gros dégâts au corps à corps, PV moyens.',
    base:     { vit: 70, force: 30, intel: 0, agi: 0, chance: 0, sagesse: 0, init: 30, resTerre: 3, resFeu: 0, resEau: 0, resAir: 0 },
    perLevel: { vit: 8,  force: 4, intel: 0, agi: 0, chance: 0, sagesse: 0.5, init: 1.5, resTerre: 0.2, resFeu: 0, resEau: 0, resAir: 0 },
    spells: ['colere_iop', 'epee_divine', 'pression'],
  },
  {
    id: 'feca', name: 'Féca', role: 'Protection', weapon: 'baton', color: '#8d6e63',
    desc: 'Protecteur : applique des boucliers sur ses alliés. Dégâts faibles.',
    base:     { vit: 80, force: 0, intel: 25, agi: 0, chance: 0, sagesse: 0, init: 20, resTerre: 3, resFeu: 3, resEau: 3, resAir: 3 },
    perLevel: { vit: 9,  force: 0, intel: 3.5, agi: 0, chance: 0, sagesse: 0.5, init: 1, resTerre: 0.2, resFeu: 0.2, resEau: 0.2, resAir: 0.2 },
    spells: ['rempart', 'armure_terrestre', 'attaque_naturelle'],
  },
  {
    id: 'pandawa', name: 'Pandawa', role: 'Soutien', weapon: 'baguette', color: '#26a69a',
    desc: 'Soutien robuste : soigne l\'allié le plus blessé et affaiblit les ennemis.',
    base:     { vit: 90, force: 0, intel: 0, agi: 0, chance: 25, sagesse: 5, init: 10, resTerre: 0, resFeu: 0, resEau: 3, resAir: 0 },
    perLevel: { vit: 10, force: 0, intel: 0, agi: 0, chance: 3.5, sagesse: 0.5, init: 1, resTerre: 0, resFeu: 0, resEau: 0.2, resAir: 0 },
    spells: ['lait_bambou', 'epouvante', 'vague_a_lame'],
  },
];
