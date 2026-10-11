/* ==========================================================================
   Écran Debug : outils de test (objets, XP, niveaux, kamas). Voir systems/debug.js.
   ========================================================================== */
(function () {
  'use strict';
  const G = Game, U = G.util, UI = G.UI;
  const D = () => G.Systems.debug;
  let out = [], filter = '';

  const say = (m) => { out.unshift(m); out = out.slice(0, 8); const el = document.getElementById('dbg-out'); if (el) el.innerHTML = out.map((x) => `<div>${U.esc(x)}</div>`).join(''); UI.toast(m); };

  function itemRows() {
    const f = filter.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
    return G.Data.items.filter((it) => !f || it.name.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().includes(f) || it.id.includes(f)).map((it) => {
      const eq = it.type === 'equipment';
      return `<div class="entry">${UI.icon(it.id, 'sm')}<div class="info"><b>${it.name}</b> <span class="tag">${eq ? G.slots[it.slot].name + ' · niv. ' + it.level : 'ressource'}</span> <small class="muted">${it.id}</small></div>
        <input type="number" class="qty-in" min="1" value="${eq ? 1 : 100}" id="dq-${it.id}">
        <button class="btn sm primary" data-act="dgive" data-id="${it.id}">Give</button></div>`;
    }).join('') || '<p class="muted">Aucun objet.</p>';
  }

  UI.registerView({
    id: 'debug', name: 'Debug', icon: '🧪', events: ['imported'],
    render(el) {
      const targets = `<option value="all">Toute l'équipe</option>` + G.state.team.map((c, i) => `<option value="${i}">${U.esc(c.name)} (perso ${i + 1})</option>`).join('') +
        G.Data.jobs.map((j) => `<option value="${j.id}">${j.icon} ${j.name} (métier)</option>`).join('');
      const xpBtns = [100, 1000, 10000, 100000, 1000000].map((n) => `<button class="btn sm" data-act="dxp" data-n="${n}">+${U.fmt(n)} XP</button>`).join('');
      el.innerHTML = `<h2>Debug <small class="muted">(outils de test)</small></h2>
        <div class="panel"><h3>Commande</h3>
          <div class="row"><input type="text" id="dbg-cmd" class="grow-in" placeholder="/give epee de boisaille 3   ·   /xp 5000 2   ·   /level 20   ·   /help">
            <button class="btn primary" data-act="dcmd">Exécuter</button></div>
          <div class="muted dbg-out" id="dbg-out">${out.map((x) => `<div>${U.esc(x)}</div>`).join('') || '<div>/give &lt;objet|all|resources|equipment&gt; [qté] · /xp &lt;n&gt; [perso 1-4|all|métier] · /level &lt;n&gt; [perso 1-4|all] · /kamas &lt;n&gt;</div>'}</div></div>
        <div class="grid cols2">
          <div class="panel"><h3>Expérience et niveaux</h3>
            <div class="row" style="margin-bottom:8px"><select id="dbg-target">${targets}</select></div>
            <div class="row" style="margin-bottom:10px">${xpBtns}</div>
            <div class="row"><input type="number" id="dbg-lvl" class="qty-in" min="1" max="${G.Data.config.maxCharLevel}" value="10">
              <button class="btn sm" data-act="dlevel">Fixer le niveau (perso / équipe)</button></div>
            <p class="muted"><small>Fixer le niveau remet les points à répartir (automatiquement si la répartition auto est active).</small></p></div>
          <div class="panel"><h3>Dons rapides</h3>
            <div class="row" style="margin-bottom:8px">
              <button class="btn primary" data-act="dgroup" data-k="all">🎁 Tous les objets</button>
              <button class="btn" data-act="dgroup" data-k="equipment">Tous les équipements ×1</button>
              <button class="btn" data-act="dgroup" data-k="resources">Toutes les ressources ×100</button></div>
            <div class="row"><button class="btn sm" data-act="dkamas" data-n="10000">+10 000 k</button>
              <button class="btn sm" data-act="dkamas" data-n="1000000">+1 000 000 k</button></div></div>
        </div>
        <div class="panel"><h3>Donner un objet</h3>
          <input type="text" id="dbg-filter" class="grow-in" placeholder="Filtrer par nom…" value="${U.esc(filter)}">
          <div id="dbg-items" style="margin-top:10px">${itemRows()}</div></div>`;
      document.getElementById('dbg-cmd').onkeydown = (e) => { if (e.key === 'Enter') UI.actions.dcmd(); };
      document.getElementById('dbg-filter').oninput = (e) => { filter = e.target.value; document.getElementById('dbg-items').innerHTML = itemRows(); };
    },
  });

  const target = () => document.getElementById('dbg-target').value;
  UI.actions.dcmd = () => { const i = document.getElementById('dbg-cmd'); if (i.value.trim()) { say(D().run(i.value)); i.value = ''; } };
  UI.actions.dgive = (d) => say(D().give(d.id, Math.max(1, parseInt(document.getElementById('dq-' + d.id).value, 10) || 1)));
  UI.actions.dgroup = (d) => say(D().giveGroup(d.k, 0));
  UI.actions.dkamas = (d) => say(D().giveKamas(+d.n));
  UI.actions.dxp = (d) => say(D().giveXp(target(), +d.n));
  UI.actions.dlevel = () => { const t = target(); say(G.jobs[t] ? 'Choisis un personnage ou l\'équipe' : D().setLevel(t, +document.getElementById('dbg-lvl').value)); };
})();
