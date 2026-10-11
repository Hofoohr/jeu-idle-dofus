/* ==========================================================================
   Écran Inventaire : ressources empilables et équipements (instances).
   ========================================================================== */
(function () {
  'use strict';
  const G = Game, U = G.util, UI = G.UI;
  let tab = 'res';

  UI.gearRow = (g, opts = {}) => {
    const it = G.items[g.id], eq = G.Systems.inventory.isEquipped(g.uid);
    const can = G.Systems.inventory.canEquip(g);
    const stats = G.Systems.inventory.instanceStats(g);
    return `<div class="gear-row ${eq ? 'equipped' : ''}">${UI.img(it.img, '🛡️', 'md')}
      <div class="info"><b>${it.name}</b> <span class="tag ${can ? '' : 'lock'}">niv. ${it.level}</span> <span class="tag">${G.slots[it.slot].name}</span>${eq ? ' <span class="tag">équipé</span>' : ''}
        ${UI.statsHtml(stats)}</div>
      <div class="row">
        ${eq ? `<button class="btn sm" data-act="unequip" data-slot="${it.slot}">Retirer</button>`
             : `<button class="btn sm primary" ${can ? '' : 'disabled'} data-act="equip" data-uid="${g.uid}">Équiper</button>
                <button class="btn sm" data-act="sellgear" data-uid="${g.uid}">Vendre ${U.fmt(it.value)} k</button>`}
      </div></div>`;
  };

  function resources() {
    const ids = G.Data.items.filter((i) => i.type === 'resource' && G.Systems.inventory.count(i.id) > 0);
    if (!ids.length) return '<p class="muted">Aucune ressource. Va combattre ou récolter !</p>';
    return `<div class="inv-grid">${ids.map((it) => {
      const n = G.Systems.inventory.count(it.id);
      return `<div class="inv-item">${UI.img(it.img, '📦', 'md')}<b>${it.name}</b>
        <span class="qty">× ${U.fmt(n)}</span><small>${U.fmt(it.value)} k / unité</small>
        <div class="row"><button class="btn sm" data-act="sell" data-id="${it.id}" data-n="1">Vendre 1</button>
        <button class="btn sm" data-act="sell" data-id="${it.id}" data-n="${n}">Tout (${U.fmt(n * it.value)} k)</button></div></div>`;
    }).join('')}</div>`;
  }

  function gear() {
    const list = G.state.gear.slice().sort((a, b) => (G.items[a.id].slot.localeCompare(G.items[b.id].slot)) || (G.items[b.id].level - G.items[a.id].level));
    const sellable = list.filter((g) => !G.Systems.inventory.isEquipped(g.uid)).length;
    if (!list.length) return '<p class="muted">Aucun équipement. Fabrique-en chez le Forgeron ou espère un drop rare !</p>';
    return `<div class="row spread" style="margin-bottom:10px"><span class="muted">${list.length} équipement(s)</span>
      <button class="btn sm danger" ${sellable ? '' : 'disabled'} data-act="sellall">Vendre tous les non-équipés (${sellable})</button></div>
      ${list.map((g) => UI.gearRow(g)).join('')}`;
  }

  UI.registerView({
    id: 'inventory', name: 'Inventaire', icon: '🎒', events: ['inv', 'imported'],
    render(el) {
      el.innerHTML = `<h2>Inventaire</h2>
        <div class="tabs">
          <button class="tab ${tab === 'res' ? 'active' : ''}" data-act="invtab" data-t="res">Ressources</button>
          <button class="tab ${tab === 'gear' ? 'active' : ''}" data-act="invtab" data-t="gear">Équipements (${G.state.gear.length})</button>
        </div>
        <div class="panel">${tab === 'res' ? resources() : gear()}</div>`;
    },
  });

  UI.actions.invtab = (d) => { tab = d.t; UI.renderView(); };
  UI.actions.sell = (d) => G.Systems.inventory.sellStack(d.id, +d.n);
  UI.actions.sellgear = (d) => G.Systems.inventory.sellGear(+d.uid);
  UI.actions.sellall = () => { if (confirm('Vendre tous les équipements non portés ?')) G.Systems.inventory.sellAllUnequipped(); };
  UI.actions.equip = (d) => { if (!G.Systems.inventory.equip(+d.uid)) UI.toast('Niveau insuffisant'); };
  UI.actions.unequip = (d) => G.Systems.inventory.unequip(d.slot);
})();
