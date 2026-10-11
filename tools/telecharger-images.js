#!/usr/bin/env node
/* Télécharge depuis DofusDB les images référencées par les fichiers de données :
     - assets/monstres/<dofusdbId>.png   (sprite du monstre, via l'API DofusDB)
     - assets/objets/<icone>             (icône de chaque objet / ressource)
   Les sprites de classes (assets/classes/*.png) et les décors sont à fournir toi-même.
   Usage : node tools/telecharger-images.js [--force]     (Node 18 ou plus récent)
   Les images déjà présentes sont conservées (sauf --force).
   Images © Ankama — usage fan non commercial. */
const fs = require('fs'), path = require('path');
const G = require('./load.js');
const force = process.argv.includes('--force');
const root = path.join(__dirname, '..', 'assets');

async function save(url, file) {
  if (!force && fs.existsSync(file)) return 'déjà là';
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} ${url}`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  return 'ok';
}

(async () => {
  let fail = 0;
  for (const m of G.Data.monsters) {
    const file = path.join(root, 'monstres', `${m.dofusdbId}.png`);
    try {
      let status = 'déjà là';
      if (force || !fs.existsSync(file)) {
        const info = await (await fetch(`https://api.dofusdb.fr/monsters/${m.dofusdbId}`)).json();
        if (!info.img) throw new Error('pas de champ img');
        status = await save(info.img, file);
      }
      console.log(`monstre ${m.name} (${m.dofusdbId}) : ${status}`);
    } catch (e) { fail++; console.error(`monstre ${m.name} (${m.dofusdbId}) : ÉCHEC ${e.message}`); }
  }
  for (const it of G.Data.items) {
    try { console.log(`objet ${it.name} (${it.icone}) : ${await save(`https://api.dofusdb.fr/img/items/${it.icone}`, path.join(root, 'objets', it.icone))}`); }
    catch (e) { fail++; console.error(`objet ${it.name} (${it.icone}) : ÉCHEC ${e.message}`); }
  }
  console.log(fail ? `\n${fail} échec(s).` : '\nTout est téléchargé.');
})();
