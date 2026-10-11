/* ==========================================================================
   Écran Équipe : un onglet par personnage avec
     - sprite, niveau, XP et équipement (icônes ; jamais dessiné sur le sprite)
     - caractéristiques : répartition des points (+1 / +5, ou automatique)
     - sorts : ordre de priorité réglable (▲ ▼), niveau d'obtention, recharge, effet estimé
   Cliquer un emplacement d'équipement ouvre la liste des objets compatibles.
   ========================================================================== */
(function () {
  'use strict';
  const G = Game, U = G.util, UI = G.UI;
  let sel = { i: 0, slot: 'weapon' };

  const STAT_NAMES = { force: 'Force', agi: 'Agilité', intel: 'Intelligence', chance: 'Chance' };
  const STAT_ELEMENT = { force: 'terre', agi: 'air', intel: 'feu', chance: 'eau' };

  function slotBtn(i, s) {
    const uid = G.state.team[i].equipped[s.id], g = uid ? G.Systems.inventory.getGear(uid) : null;
    const on = sel.i === i && sel.slot === s.id;
    return `<button class="eslot ${on ? 'sel' : ''}" data-act="slot" data-i="${i}" data-slot="${s.id}" title="${s.name}${g ? ' : ' + G.items[g.id].name : ''}">
      ${g ? UI.icon(g.id, 'sm') : `<span class="empty">${s.icon}</span>`}</button>`;
  }

  function charPanel(i) {
    const c = G.state.team[i], cls = G.classes[c.classId];
    return `<div class="panel char-card">
      <div class="char-top"><div class="sprite-box md">${UI.classSprite(c.classId)}</div>
        <div class="char-id"><input type="text" class="name-in" maxlength="16" value="${U.esc(c.name)}" data-i="${i}">
          <span class="tag">${cls.name} · ${cls.role}</span> <span class="lvl">Niv. ${c.level}</span>
          ${UI.bar('tm-xp' + i, 'xp thin')}<small id="tm-xpt${i}" class="muted"></small></div></div>
      <h4>Équipement</h4>
      <div class="eslots">${G.Data.slots.map((s) => slotBtn(i, s)).join('')}</div>
      <small class="muted">Arme : ${G.Data.weaponTypes[cls.weapon]}</small>
    </div>`;
  }

  function statsPanel(i) {
    const c = G.state.team[i], st = G.Systems.team.stats(i), eq = G.Systems.team.equipStats(i), L = G.Data.statLabels;
    const speed = G.F.atbSpeed(st.initiative), cc = G.Data.config.combat;
    const rows = G.Systems.team.STATS.map((k) => {
      const el = G.Data.elements[STAT_ELEMENT[k]];
      const btns = c.points > 0 ? `<button class="btn sm" data-act="alloc" data-i="${i}" data-stat="${k}" data-n="1">+1</button><button class="btn sm" data-act="alloc" data-i="${i}" data-stat="${k}" data-n="5">+5</button>` : '';
      return `<tr><td>${L[k].icon} ${STAT_NAMES[k]} <small class="muted">${el.icon} ${el.name}</small></td>
        <td><b>${st[k]}</b> <small class="muted">(${c.stat[k]}${eq[k] ? ` + <span class="pos">${eq[k]}</span>` : ''})</small></td><td class="btn-cell">${btns}</td></tr>`;
    }).join('');
    const others = ['dmg', 'sagesse', 'resTerre', 'resFeu', 'resEau', 'resAir'].map((k) =>
      `<tr><td>${L[k].icon} ${L[k].name}</td><td>${st[k]}${L[k].suffix}</td><td></td></tr>`).join('');
    const autoOpts = `<option value="">Manuelle</option>` + G.Systems.team.STATS.map((k) => `<option value="${k}" ${c.autoStat === k ? 'selected' : ''}>Auto : ${STAT_NAMES[k]}</option>`).join('');
    return `<div class="panel"><h3>Caractéristiques</h3>
      <div class="points ${c.points > 0 ? 'has' : ''}">⭐ Points à répartir : <b>${c.points}</b></div>
      <div class="row" style="margin:6px 0 8px"><select class="auto-sel" data-i="${i}">${autoOpts}</select>
        <button class="btn sm" data-act="resetpts" data-i="${i}" title="Rend tous les points répartis">Réinitialiser</button></div>
      <table class="kv compact">
        <tr><td>❤️ Vitalité (PV max)</td><td><b>${st.maxHp}</b></td><td></td></tr>
        ${rows}
        <tr><td>⚡ Initiative</td><td><b>${st.initiative}</b> <small class="muted">(${st.force + st.agi + st.intel + st.chance} + ${st.initBonus} objets)</small></td><td></td></tr>
        ${others}
      </table>
      <small class="muted">Barre d'attaque : +${U.fmtDec(speed, 1)} par tick → 1 action toutes les ${U.fmtDec(cc.atbMax / speed * cc.tickSeconds, 1)} s.
      Dégâts d'un sort = base × (100 + caractéristique) / 100 + Dommages.</small></div>`;
  }

  function effectText(i, sp, st) {
    const v = G.F.spellValue(st, sp);
    if (sp.kind === 'damage') return `≈ ${Math.round(v + st.dmg)} dégâts${sp.aoe ? ' (zone)' : ''}`;
    if (sp.kind === 'heal') return `≈ ${Math.round(v)} PV${sp.aoe ? ' (équipe)' : ''}`;
    if (sp.kind === 'shield') return `≈ ${Math.round(v)} bouclier${sp.aoe ? ' (équipe)' : ''}`;
    return `-${Math.round(sp.value * 100)} % dégâts ennemis`;
  }

  function spellsPanel(i) {
    const c = G.state.team[i], st = G.Systems.team.stats(i), open = G.Systems.team.unlocked(i);
    const rows = c.priority.map((id, k) => {
      const sp = G.spells[id], locked = !open.includes(id), el = G.Data.elements[sp.element];
      return `<div class="spell-row ${locked ? 'locked' : ''}">
        <span class="rank">${k + 1}</span>
        <span class="mv"><button class="btn sm" ${k === 0 ? 'disabled' : ''} data-act="prio" data-i="${i}" data-id="${id}" data-dir="-1">▲</button><button class="btn sm" ${k === c.priority.length - 1 ? 'disabled' : ''} data-act="prio" data-i="${i}" data-id="${id}" data-dir="1">▼</button></span>
        <div class="grow"><b>${sp.icon} ${sp.name}</b> ${locked ? `<span class="tag lock">🔒 niv. ${G.Systems.team.unlockLevel(i, id)}</span>` : ''}
          ${sp.cd === 0 ? '<span class="tag">attaque de base</span>' : `<span class="tag">recharge ${sp.cd}</span>`} <span class="tag">${el.icon} ${el.name}</span><br>
          <small class="muted">${sp.desc} · ${locked ? '' : effectText(i, sp, st)}</small></div></div>`;
    }).join('');
    return `<div class="panel"><h3>Sorts</h3>
      <p class="muted" style="margin-top:0"><small>Parmi les sorts prêts (recharge finie et utiles), le mieux classé est lancé. Soin : un allié sous 50 % · Bouclier : un allié sans bouclier · Zone : au moins 2 ennemis.</small></p>
      ${rows}</div>`;
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
      const i = sel.i;
      const tabs = G.state.team.map((c, k) => `<button class="tab ${k === i ? 'active' : ''}" data-act="char" data-i="${k}">${U.esc(c.name)} <small>niv. ${c.level}</small>${c.points > 0 ? ` <span class="pts">⭐${c.points}</span>` : ''}</button>`).join('');
      el.innerHTML = `<h2>Équipe</h2>
        <div class="tabs">${tabs}</div>
        <div class="grid team-grid">${charPanel(i)}${statsPanel(i)}${spellsPanel(i)}</div>
        ${picker()}`;
      el.querySelector('.name-in').onchange = (e) => { G.state.team[i].name = e.target.value.trim().slice(0, 16) || 'Héros'; G.emit('imported'); };
      el.querySelector('.auto-sel').onchange = (e) => {
        G.state.team[i].autoStat = e.target.value || null;
        G.Systems.team.autoAllocate(i); G.emit('level');
      };
      this.update();
    },
    update() {
      const i = sel.i, c = G.state.team[i];
      const max = c.level >= G.Data.config.maxCharLevel, need = G.Systems.team.xpToNext(i);
      UI.setBar('tm-xp' + i, max ? 1 : c.xp / need);
      const t = document.getElementById('tm-xpt' + i);
      if (t) { const s = max ? 'Niveau max' : `XP ${U.fmt(c.xp)} / ${U.fmt(need)}`; if (t.textContent !== s) t.textContent = s; }
    },
  });

  UI.actions.char = (d) => { sel.i = +d.i; UI.renderView(); };
  UI.actions.slot = (d) => { sel = { i: +d.i, slot: d.slot }; UI.renderView(); };
  UI.actions.alloc = (d) => G.Systems.team.allocate(+d.i, d.stat, +d.n);
  UI.actions.resetpts = (d) => { G.state.team[+d.i].autoStat = null; G.Systems.team.resetPoints(+d.i); };
  UI.actions.prio = (d) => { G.Systems.team.movePriority(+d.i, d.id, +d.dir); UI.renderView(); };
})();
