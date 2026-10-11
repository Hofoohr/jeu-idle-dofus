/* ==========================================================================
   Écran Combat : choix de la zone / du monstre + arène en direct.
   ========================================================================== */
(function () {
  'use strict';
  const G = Game, U = G.util, UI = G.UI;
  let lastFeed = '', lastMonster = null;

  function dropRow(d) {
    const it = G.items[d.item];
    const rare = it.type === 'equipment';
    const qty = d.min === d.max ? (d.min > 1 ? ` ×${d.min}` : '') : ` ×${d.min}-${d.max}`;
    return `<div class="drop ${rare ? 'rare' : ''}" title="${U.esc(it.name)}">${UI.img(it.img, '📦', 'xs')}<span class="nm">${it.name}${qty}</span><span class="pct">${U.fmtDec(d.chance, d.chance < 10 ? 2 : 0)} %</span></div>`;
  }

  function monsterCard(m, zone, locked) {
    const a = G.Engine.current();
    const active = a && a.type === 'combat' && a.monsterId === m.id;
    const xpMult = G.F.monsterXpMult(G.state.char.level, m.level);
    return `<div class="panel mon-card ${active ? 'active' : ''}">
      <div class="mon-head">${UI.img(m.img, '👾', 'lg')}
        <div><h3>${m.name}</h3><span class="tag">Niv. ${m.level}</span>${xpMult < 1 ? ' <span class="tag">XP réduite</span>' : ''}</div></div>
      <div class="mon-stats">
        <span>❤️ ${U.fmt(m.hp)} PV</span><span>💥 ${m.dmg[0]}–${m.dmg[1]}</span>
        <span>✨ ${Math.max(1, Math.round(m.xp * xpMult))} XP</span><span>💰 ${m.kamas[0]}–${m.kamas[1]} k</span>
        ${m.res ? `<span>🛡️ ${m.res} % rés.</span>` : ''}
      </div>
      <div class="drops">${(m.drops || []).map(dropRow).join('')}</div>
      ${active
        ? '<button class="btn danger" data-act="stop">⏹ Arrêter le combat</button>'
        : `<button class="btn primary" ${locked ? 'disabled' : ''} data-act="fight" data-zone="${zone.id}" data-mon="${m.id}">⚔️ Combattre</button>`}
    </div>`;
  }

  function arena() {
    const a = G.Engine.current();
    const c = G.Systems.character.cls();
    const inCombat = a && a.type === 'combat';
    const spells = c.spells.map((s) => `<span class="spell" id="sp-${s.id}" title="${s.desc}">${s.icon} ${s.name} <small id="spcd-${s.id}"></small></span>`).join('');
    return `<div class="panel" id="arena-panel">
      ${inCombat ? '' : '<p class="muted" style="margin:0 0 10px">Choisis un monstre ci-dessous pour lancer un combat automatique.</p>'}
      <div class="arena">
        <div class="fighter">${UI.img(G.img.breedLogo(c.breedId), '🧙', 'xl')}
          <div class="nm">${U.esc(G.state.char.name)}</div>
          ${UI.bar('bt-php', 'hp')}<div class="shield-bar"><div id="bt-shield"></div></div></div>
        <div class="feed" id="bt-feed"></div>
        <div class="fighter" id="bt-mon">—</div>
      </div>
      <div style="margin-top:10px">${UI.bar('bt-turn', 'turn thin')}</div>
      <div class="spells">${spells}</div>
    </div>`;
  }

  UI.registerView({
    id: 'combat', name: 'Combat', icon: '⚔️', events: ['action', 'level', 'select', 'imported'],
    render(el) {
      const S = G.state, lvl = S.char.level;
      const zone = G.zones[S.selection.zoneId];
      const tabs = G.Data.zones.map((z) => {
        const lock = lvl < z.minLevel;
        return `<button class="tab ${z.id === zone.id ? 'active' : ''}" ${lock ? 'disabled' : ''} data-act="zone" data-id="${z.id}">${z.icon} ${z.name}${lock ? ` 🔒 niv. ${z.minLevel}` : ''}</button>`;
      }).join('');
      lastFeed = ''; lastMonster = null;
      el.innerHTML = `
        <h2>Combat</h2>
        ${arena()}
        <div class="tabs">${tabs}</div>
        <p class="zone-desc muted">${zone.desc}</p>
        <div class="grid cols3">${zone.monsters.map((id) => monsterCard(G.monsters[id], zone, lvl < zone.minLevel)).join('')}</div>`;
      this.update();
    },

    update() {
      const rt = G.rt.combat, a = G.Engine.current();
      const st = G.Systems.character.stats();
      if (!document.getElementById('bt-php')) return;
      const inCombat = a && a.type === 'combat' && rt;
      if (!inCombat) {
        UI.setBar('bt-php', 1, `PV ${U.fmt(st.maxHp)} / ${U.fmt(st.maxHp)}`);
        UI.setBar('bt-turn', 0);
        document.getElementById('bt-shield').style.width = '0';
        return;
      }
      const m = rt.monster;
      if (lastMonster !== m.def.id) {
        lastMonster = m.def.id;
        document.getElementById('bt-mon').innerHTML = `${UI.img(m.def.img, '👾', 'xl')}<div class="nm">${m.def.name} <small>niv. ${m.def.level}</small></div>${UI.bar('bt-mhp', 'hp')}`;
      }
      const dead = rt.phase === 'dead';
      UI.setBar('bt-php', Math.max(0, rt.hp) / st.maxHp, `PV ${U.fmt(Math.max(0, rt.hp))} / ${U.fmt(st.maxHp)}`);
      UI.setBar('bt-mhp', Math.max(0, m.hp) / m.def.hp, `PV ${U.fmt(Math.max(0, m.hp))} / ${U.fmt(m.def.hp)}`);
      document.getElementById('bt-shield').style.width = Math.min(100, (rt.shield / st.maxHp) * 100) + '%';
      UI.setBar('bt-turn', G.Engine.progress());
      let html = rt.feed.map((f) => `<div class="${f.cls}">${f.text}</div>`).join('');
      if (dead) html += '<div class="dead-msg">💀 Résurrection…</div>';
      if (html !== lastFeed) { lastFeed = html; document.getElementById('bt-feed').innerHTML = html; }
      G.Systems.character.cls().spells.forEach((s) => {
        const cd = rt.cds[s.id] || 0, el = document.getElementById('spcd-' + s.id), box = document.getElementById('sp-' + s.id);
        if (!el) return;
        const txt = s.cd > 0 ? (cd > 0 ? `(${cd})` : '✔') : '';
        if (el.textContent !== txt) el.textContent = txt;
        box.classList.toggle('ready', s.cd > 0 && cd === 0);
      });
    },
  });

  UI.actions.zone = (d) => { G.state.selection.zoneId = d.id; G.emit('select'); };
  UI.actions.fight = (d) => G.Systems.combat.start(d.zone, d.mon);
})();
