/* ==========================================================================
   Écran Équipe : fiche des 4 personnages (sprite, niveau, XP, stats) et
   équipement affiché sous forme d'icônes (jamais dessiné sur le sprite).
   Cliquer un emplacement ouvre la liste des objets compatibles.
   ========================================================================== */
(function () {
  'use strict';
  const G = Game, U = G.util, UI = G.UI;
  let sel = { i: 0, slot: 'weapon' };

  function slotBtn(i, s) {
    const uid = G.state.team[i].equipped[s.id], g = uid ? G.Systems.inventory.getGear(uid) : null;
    const on = sel.i === i && sel.slot === s.id;
    return `<button class="eslot ${on ? 'sel' : ''}" data-act="slot" data-i="${i}" data-slot="${s.id}" title="${s.name}${g ? ' : ' + G.items[g.id].name : ''}">
      ${g ? UI.icon(g.id, 'sm') : `<span class="empty">${s.icon}</span>`}</button>`;
  }

  function statsTable(i) {
    const st = G.Systems.team.stats(i), eq = G.Systems.team.equipStats(i), L = G.Data.statLabels;
    const rows = Object.keys(L).filter((k) => st[k] || eq[k]).map((k) =>
      `<tr><td>${L[k].icon} ${L[k].name}</td><td>${st[k]}${L[k].suffix}${eq[k] ? ` <small class="pos">(+${eq[k]})</small>` : ''}</td></tr>`);
    return `<table class="kv compact">${rows.join('')}</table>`;
  }

  function charCard(i) {
    const c = G.state.team[i], cls = G.classes[c.classId];
    return `<div class="panel char-card">
      <div class="char-top"><div class="sprite-box md">${UI.classSprite(c.classId)}</div>
        <div class="char-id"><input type="text" class="name-in" maxlength="16" value="${U.esc(c.name)}" data-i="${i}">
          <span class="tag">${cls.name} · ${cls.role}</span> <span class="lvl">Niv. ${c.level}</span>
          ${UI.bar('tm-xp' + i, 'xp thin')}<small id="tm-xpt${i}" class="muted"></small></div></div>
      <div class="eslots">${G.Data.slots.map((s) => slotBtn(i, s)).join('')}</div>
      ${statsTable(i)}
      <small class="muted">Arme : ${G.Data.weaponTypes[cls.weapon]} · ${cls.spells.map((s) => G.spells[s].icon + ' ' + G.spells[s].name).join(' · ')}</small>
    </div>`;
  }

  function picker() {
    const i = sel.i, slot = G.slots[sel.slot], c = G.state.team[i];
    const list = G.state.gear.filter((g) => G.items[g.id].slot === sel.slot).sort((a, b) => G.items[b.id].level - G.items[a.id].level);
    return `<div class="panel"><h3>${slot.icon} ${slot.name} de ${U.esc(c.name)}</h3>
      ${list.length ? list.map((g) => UI.gearRow(g, { char: i })).join('') : '<p class="muted">Aucun objet pour cet emplacement dans l\'inventaire.</p>'}</div>`;
  }

  UI.registerView({
    id: 'team', name: 'Équipe', icon: '👥', events: ['inv', 'equip', 'level', 'imported'],
    render(el) {
      el.innerHTML = `<h2>Équipe</h2>
        <div class="grid cols4">${G.state.team.map((c, i) => charCard(i)).join('')}</div>
        ${picker()}`;
      el.querySelectorAll('.name-in').forEach((inp) => {
        inp.onchange = () => { G.state.team[+inp.dataset.i].name = inp.value.trim().slice(0, 16) || 'Héros'; G.emit('imported'); };
      });
      this.update();
    },
    update() {
      G.state.team.forEach((c, i) => {
        const max = c.level >= G.Data.config.maxCharLevel, need = G.Systems.team.xpToNext(i);
        UI.setBar('tm-xp' + i, max ? 1 : c.xp / need);
        const t = document.getElementById('tm-xpt' + i);
        if (t) { const s = max ? 'Niveau max' : `XP ${U.fmt(c.xp)} / ${U.fmt(need)}`; if (t.textContent !== s) t.textContent = s; }
      });
    },
  });

  UI.actions.slot = (d) => { sel = { i: +d.i, slot: d.slot }; UI.renderView(); };
})();
