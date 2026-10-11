/* Simulation d'équilibrage : node tools/balance.js
   Affiche, pour chaque classe / niveau / monstre (sans équipement), les kills,
   morts et XP par heure de jeu. Sert à ajuster js/data/*.js et formulas.js. */
const G = require('./load.js');
const levels = (process.argv[2] || '1,5,10,15,20').split(',').map(Number);
const hours = 1;
function run(classId, level, monsterId) {
  G.state = G.newState(classId, 't');
  G.state.char.level = level;
  G.Systems.character.invalidate();
  const z = G.Data.zones.find((z) => z.monsters.includes(monsterId));
  G.Engine.start({ type: 'combat', zoneId: z.id, monsterId });
  G.silent = true; G.report = G.Offline.newReport(hours * 3600);
  const xp0 = G.state.char.xp;
  G.Engine.advance(hours * 3600);
  const r = G.report; G.report = null; G.silent = false;
  return { kills: r.kills, deaths: r.deaths, xp: r.xp.char || 0, kamas: r.kamas, lvl: G.state.char.level };
}
for (const c of G.Data.classes) {
  console.log(`\n=== ${c.name} ===`);
  for (const L of levels) {
    const row = G.Data.monsters.map((m) => {
      const r = run(c.id, L, m.id);
      return `${m.name.padEnd(8)} k${String(r.kills).padStart(4)} d${String(r.deaths).padStart(4)} xp${String(r.xp).padStart(6)}`;
    });
    console.log(`L${String(L).padStart(2)} | ` + row.join(' | '));
  }
}
