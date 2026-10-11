/* Simulation d'équilibrage : node tools/balance.js [niveaux] [heures]
   Équipe Crâ / Iop / Féca / Pandawa, SANS équipement, points répartis automatiquement
   dans la caractéristique de la classe, au niveau donné, sur chaque zone.
   Affiche combats, défaites, XP gagnée (par perso) et kamas par heure de jeu. */
const G = require('./load.js');
const levels = (process.argv[2] || '1,5,10,15').split(',').map(Number);
const hours = +(process.argv[3] || 1);
function run(level, zoneId) {
  G.state = G.newState(G.testTeam());
  G.state.team.forEach((c, i) => { c.level = level; c.points = 5 * (level - 1); G.Systems.team.autoAllocate(i); });
  G.Systems.team.invalidate();
  G.Engine.start({ type: 'combat', zoneId });
  G.silent = true; G.report = G.Offline.newReport(hours * 3600);
  G.Engine.advance(hours * 3600);
  const r = G.report; G.report = null; G.silent = false;
  const xp = Object.keys(r.xp).filter((k) => /^c\d$/.test(k)).reduce((s, k) => s + r.xp[k], 0) / 4;
  return { fights: r.fights, defeats: r.defeats, xp: Math.round(xp / hours), kamas: Math.round(r.kamas / hours), lvl: G.state.team.map((c) => c.level).join('/') };
}
console.log(`Équipe sans équipement, ${hours} h de jeu par ligne`);
for (const L of levels) {
  for (const z of G.Data.zones) {
    const r = run(L, z.id);
    console.log(`niv ${String(L).padStart(2)} | ${z.name.padEnd(22)} | combats/h ${String(Math.round(r.fights / hours)).padStart(4)} | défaites/h ${String(Math.round(r.defeats / hours)).padStart(3)} | XP/h/perso ${String(r.xp).padStart(6)} | kamas/h ${String(r.kamas).padStart(5)} | niveaux finaux ${r.lvl}`);
  }
}
