/* ==========================================================================
   Écran Inventaire (partagé par l'équipe) : ressources et équipements.
   ========================================================================== */
(function () {
  'use strict';
  const G = Game, U = G.util, UI = G.UI;
  let tab = 'res';

  /** Ligne d'un équipement. opts.char : index du perso (vue Équipe) ; sinon boutons « équiper sur… ». */
  UI.gearRow = (g, opts = {}) => {
    const it = G.items[g.id], by = G.Systems.inventory.equippedBy(g.uid);
    const stats = G.Systems.inventory.instanceStats(g);
    const wt = it.weaponType ? ` <span class="tag">${G.Data.weaponTypes[it.weaponType]}</span>` : '';
    let actions = '';
    if (opts.char !== undefined) {
      const i = opts.char, chk = G.Systems.inventory.canEquip(i, g);
      actions = by === i
        ? `<button class="btn sm" data-act="unequip" data-i="${i}" data-slot="${it.slot}">Retirer</button>`
        : `<button class="btn sm primary" ${chk.ok ? '' : 'disabled'} title="${chk.reason || ''}" data-act="equipto" data-i="${i}" data-uid="${g.uid}">Équiper</button>
           ${chk.ok ? '' : `<small class="bad">${chk.reason}</small>`}`;
    } else {
      actions = G.state.team.map((c, i) => {
        const chk = G.Systems.inventory.canEquip(i, g);
        return `<button class="btn sm" ${chk.ok && by !== i ? '' : 'disabled'} title="${U.esc(c.name)}${chk.ok ? '' : ' — ' + chk.reason}" data-act="equipto" data-i="${i}" data-uid="${g.uid}">${U.esc(c.name.slice(0, 6))}</button>`;
      }).join('') + (by < 0 ? `<button class="btn sm danger" data-act="sellgear" data-uid="${g.uid}">Vendre ${U.fmt(it.value)} k</button>` : '');
    }
    return `<div class="gear-row ${by >= 0 ? 'equipped' : ''}">${UI.icon(g.id, 'md')}
      <div class="info"><b>${it.name}</b> <span class="tag">niv. ${it.level}</span> <span class="tag">${G.slots[it.slot].name}</span>${wt}
        ${by >= 0 ? ` <span class="tag">porté par ${U.esc(G.state.team[by].name)}</span>` : ''}
        ${UI.statsHtml(stats)}</div>
      <div class="row">${actions}</div></div>`;
  };

  function resources() {
    const ids = G.Data.items.filter((i) => i.type === 'resource' && G.Systems.inventory.count(i.id) > 0);
    if (!ids.length) return '<p class="muted">Aucune ressource. Va combattre ou récolter !</p>';
    return `<div class="inv-grid">${ids.map((it) => {
      const n = G.Systems.inventory.count(it.id);
      return `<div class="inv-item">${UI.icon(it.id, 'md')}<b>${it.name}</b>
        <span class="qty">× ${U.fmt(n)}</span><small>${U.fmt(it.value)} k / unité</small>
        <div class="row"><button class="btn sm" data-act="sell" data-id="${it.id}" data-n="1">Vendre 1</button>
        <button class="btn sm" data-act="sell" data-id="${it.id}" data-n="${n}">Tout (${U.fmt(n * it.value)} k)</button></div></div>`;
    }).join('')}</div>`;
  }

  function gear() {
    const order = G.Data.slots.map((s) => s.id);
    const list = G.state.gear.slice().sort((a, b) => (order.indexOf(G.items[a.id].slot) - order.indexOf(G.items[b.id].slot)) || (G.items[b.id].level - G.items[a.id].level));
    const sellable = list.filter((g) => G.Systems.inventory.equippedBy(g.uid) < 0).length;
    if (!list.length) return '<p class="muted">Aucun équipement. Fabrique-en avec le Tailleur ou le Sculpteur, ou espère un drop rare !</p>';
    return `<div class="row spread" style="margin-bottom:10px"><span class="muted">${list.length} équipement(s) · les boutons équipent l'objet sur le personnage choisi</span>
      <button class="btn sm danger" ${sellable ? '' : 'disabled'} data-act="sellall">Vendre tous les non-portés (${sellable})</button></div>
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
  UI.actions.equipto = (d) => { if (!G.Systems.inventory.equip(+d.i, +d.uid)) UI.toast('Équipement impossible'); };
  UI.actions.unequip = (d) => G.Systems.inventory.unequip(+d.i, d.slot);
})();
