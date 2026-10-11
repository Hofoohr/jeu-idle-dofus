/* ==========================================================================
   Outils de test (onglet « Debug ») : se donner des objets, de l'XP, des kamas,
   régler le niveau. Utilisable par boutons ou par commandes tapées :
     /give <objet|all|resources|equipment> [quantité]   /xp <n> [perso 1-4|all|métier]
     /level <n> [perso 1-4|all]                        /kamas <n>      /help
   Pour retirer l'onglet en production : enlève view-debug.js de index.html.
   ========================================================================== */
(function () {
  'use strict';
  const G = Game, U = G.util;
  const norm = (s) => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

  const Debug = (G.Systems.debug = {
    /** Donne `qty` exemplaires d'un objet (id). */
    give(itemId, qty) {
      G.Systems.inventory.add(itemId, qty);
      return `+${qty}× ${G.items[itemId].name}`;
    },

    /** kind : 'all' | 'resources' | 'equipment'. Ressources ×qty (100 par défaut), équipements ×1 (ou qty si précisé). */
    giveGroup(kind, qty) {
      let n = 0;
      G.Data.items.forEach((it) => {
        const eq = it.type === 'equipment';
        if (kind === 'resources' && eq) return;
        if (kind === 'equipment' && !eq) return;
        G.Systems.inventory.add(it.id, qty || (eq ? 1 : 100));
        n++;
      });
      return `${n} objet(s) donné(s)`;
    },

    giveKamas(n) { G.Systems.rewards.addKamas(n, true); return `+${U.fmt(n)} kamas`; },

    /** target : 'all' (les 4 personnages) | index 0-3 | id de métier. */
    giveXp(target, n) {
      const R = G.Systems.rewards;
      if (G.jobs[target]) { R.addXp('job', target, n); return `+${U.fmt(n)} XP ${G.jobs[target].name}`; }
      const list = target === 'all' ? G.state.team.map((c, i) => i) : [+target];
      list.forEach((i) => R.addXp('char', i, n));
      return `+${U.fmt(n)} XP ${target === 'all' ? 'à toute l\'équipe' : G.state.team[+target].name}`;
    },

    /** Fixe le niveau (monte ou descend) ; points remis à zéro puis répartis (auto ou à répartir). */
    setLevel(target, lvl) {
      lvl = U.clamp(Math.floor(lvl), 1, G.Data.config.maxCharLevel);
      const list = target === 'all' ? G.state.team.map((c, i) => i) : [+target];
      list.forEach((i) => {
        const c = G.state.team[i];
        c.level = lvl; c.xp = 0;
        G.Systems.team.STATS.forEach((k) => (c.stat[k] = 0));
        c.points = G.Data.config.charBase.pointsPerLevel * (lvl - 1);
        G.Systems.team.autoAllocate(i);
      });
      G.Systems.team.invalidate(); G.emit('level');
      return `Niveau ${lvl} : ${target === 'all' ? 'toute l\'équipe' : G.state.team[+target].name}`;
    },

    /** Retrouve un objet par id, nom exact ou fragment de nom. Retourne { item } ou { error }. */
    find(text) {
      const t = norm(text);
      const exact = G.Data.items.find((i) => i.id === text || norm(i.name) === t);
      if (exact) return { item: exact };
      const words = t.split(/\s+/);   // tous les mots doivent apparaître dans le nom ou l'id
      const part = G.Data.items.filter((i) => words.every((w) => norm(i.name).includes(w) || i.id.includes(w)));
      if (part.length === 1) return { item: part[0] };
      if (!part.length) return { error: `Objet introuvable : « ${text} »` };
      return { error: `Plusieurs objets : ${part.slice(0, 6).map((i) => i.id).join(', ')}${part.length > 6 ? '…' : ''}` };
    },

    /** Exécute une commande texte ; retourne le message de résultat. */
    run(line) {
      const parts = line.trim().replace(/^\//, '').split(/\s+/);
      const cmd = (parts.shift() || '').toLowerCase();
      const num = (s, d) => { const v = parseFloat(s); return Number.isFinite(v) ? v : d; };
      const who = (s) => {
        if (s === undefined || s === 'all') return 'all';
        if (G.jobs[s]) return s;
        const k = parseInt(s, 10);
        return k >= 1 && k <= G.state.team.length ? k - 1 : null;
      };
      if (cmd === 'give') {
        const what = parts[0];
        if (!what) return 'Usage : /give <objet|all|resources|equipment> [quantité]';
        if (['all', 'resources', 'equipment'].includes(what)) return this.giveGroup(what, parts[1] ? num(parts[1]) : 0);
        // /give <nom en plusieurs mots> [quantité]
        let qty = 1, words = parts;
        if (parts.length > 1 && /^\d+$/.test(parts[parts.length - 1])) { qty = +parts[parts.length - 1]; words = parts.slice(0, -1); }
        const r = this.find(words.join(' '));
        return r.error || this.give(r.item.id, qty);
      }
      if (cmd === 'xp') {
        const n = num(parts[0]); const t = who(parts[1]);
        if (!(n > 0)) return 'Usage : /xp <n> [perso 1-4 | all | woodcutter | tailor | sculptor]';
        return t === null ? 'Cible inconnue' : this.giveXp(t, n);
      }
      if (cmd === 'level') {
        const n = num(parts[0]); const t = who(parts[1]);
        if (!(n >= 1)) return 'Usage : /level <n> [perso 1-4 | all]';
        return t === null || G.jobs[t] ? 'Cible inconnue' : this.setLevel(t, n);
      }
      if (cmd === 'kamas') { const n = num(parts[0]); return n > 0 ? this.giveKamas(n) : 'Usage : /kamas <n>'; }
      if (cmd === 'help' || cmd === '') return 'Commandes : /give <objet|all|resources|equipment> [qté] · /xp <n> [perso|all|métier] · /level <n> [perso|all] · /kamas <n>';
      return `Commande inconnue : /${cmd} (tape /help)`;
    },
  });
})();
