/* Charge la logique du jeu (sans UI) dans Node, pour tester / équilibrer.
   Usage : const G = require('./load.js'); */
const fs = require('fs'), vm = require('vm'), path = require('path');
global.window = global;
const store = {};
global.localStorage = { getItem: (k) => (k in store ? store[k] : null), setItem: (k, v) => (store[k] = String(v)), removeItem: (k) => delete store[k] };
global.document = { addEventListener() {}, hidden: false };
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const files = [...html.matchAll(/<script src="([^"]+)"/g)].map((m) => m[1]).filter((f) => !f.startsWith('js/ui/') && f !== 'js/main.js');
files.forEach((f) => vm.runInThisContext(fs.readFileSync(path.join(root, f), 'utf8'), { filename: f }));
Game.buildIndex();
Game.testTeam = () => Game.Data.classes.map((c, i) => ({ name: c.name, classId: c.id }));
module.exports = Game;
