/* ==========================================================================
   Écran Combat : scène en bandeau, XP de l'équipe, choix de la zone et
   aperçu des monstres (stats, apparition, drops).
   ========================================================================== */
(function () {
  'use strict';
  const G = Game, U = G.util, UI = G.UI;

  function dropRow(d) {
    const it = G.items[d.item];
    const rare = it.type === 'equipment';
    const qty = d.min === d.max ? (d.min > 1 ? ` ×${d.min}` : '') : ` ×${d.min}-${d.max}`;
    return `<div class="drop ${rare ? 'rare' : ''}">${UI.icon(d.item, 'xs')}<span class="nm">${it.name}${qty}</span><span class="pct">${U.fmtDec(d.chance, d.chance < 10 ? 2 : 0)} %</span></div>`;
  }

  function monsterCard(entry, zone) {
    const m = G.monsters[entry.id];
    const total = zone.monsters.reduce((s, e) => s + e.weight, 0);
    const el = G.Data.elements[m.attack.element];
    const res = Object.keys(m.res || {}).map((k) => `${G.Data.elements[k].icon}${m.res[k]}%`).join(' ');
    return `<div class="panel mon-card">
      <div class="mon-head"><div class="sprite-box sm">${UI.monsterSprite(m)}</div>
        <div><h3>${m.name}</h3><span class="tag">Niv. ${m.level}</span>${m.rare ? ' <span class="tag rare">Rare</span>' : ''}
        <div class="muted"><small>Apparition ~${Math.round(entry.weight / total * 100)} %</small></div></div></div>
      <div class="mon-stats">
        <span>❤️ ${U.fmt(m.hp)} PV</span><span>⚡ Init. ${m.init}</span>
        <span>${el.icon} ${m.attack.dmg[0]}–${m.attack.dmg[1]} (${el.name})</span><span>🛡️ ${res || 'aucune rés.'}</span>
        <span>✨ ${m.xp} XP</span><span>💰 ${m.kamas[0]}–${m.kamas[1]} k</span>
      </div>
      <div class="drops">${(m.drops || []).filter((d) => d.chance > 0).map(dropRow).join('')}</div>
    </div>`;
  }

  function xpStrip() {
    return `<div class="xp-strip">${G.state.team.map((c, i) => `<div><small id="xs-n${i}"></small>${UI.bar('xs-' + i, 'xp thin')}</div>`).join('')}</div>`;
  }

  UI.registerView({
    id: 'combat', name: 'Combat', icon: '⚔️', events: ['action', 'level', 'select', 'imported'],
    render(el) {
      const S = G.state, avg = G.Systems.team.avgLevel();
      const zone = G.zones[S.selection.zoneId];
      const a = G.Engine.current();
      const tabs = G.Data.zones.map((z) => {
        const lock = avg < z.minLevel;
        return `<button class="tab ${z.id === zone.id ? 'active' : ''}" data-act="zone" data-id="${z.id}">${z.icon} ${z.name}${lock ? ` 🔒` : ''}</button>`;
      }).join('');
      const locked = avg < zone.minLevel;
      const fighting = a && a.type === 'combat' && a.zoneId === zone.id;
      const scZone = a && a.type === 'combat' ? a.zoneId : zone.id;
      el.innerHTML = `
        <h2>Combat</h2>
        ${UI.scene.html(scZone)}
        ${xpStrip()}
        <div class="tabs" style="margin-top:14px">${tabs}</div>
        <div class="panel row spread">
          <div><h3 style="margin:0">${zone.icon} ${zone.name}</h3><span class="muted">${zone.desc}</span>
            ${locked ? `<br><span class="tag lock">Niveau moyen ${zone.minLevel} requis (actuel : ${U.fmtDec(avg, 1)})</span>` : ''}</div>
          ${fighting ? '<button class="btn danger" data-act="stop">⏹ Arrêter les combats</button>'
            : `<button class="btn primary" ${locked ? 'disabled' : ''} data-act="fight" data-zone="${zone.id}">⚔️ Lancer les combats ici</button>`}
        </div>
        <div class="grid cols4">${zone.monsters.map((e) => monsterCard(e, zone)).join('')}</div>`;
      UI.scene.fill();
      this.update();
    },

    update() {
      UI.scene.update();
      G.state.team.forEach((c, i) => {
        const max = c.level >= G.Data.config.maxCharLevel, need = G.Systems.team.xpToNext(i);
        const n = document.getElementById('xs-n' + i);
        if (n) { const t = `${c.name} · XP ${U.fmt(c.xp)} / ${U.fmt(need)}`; if (n.textContent !== t) n.textContent = t; }
        UI.setBar('xs-' + i, max ? 1 : c.xp / need);
      });
    },
  });

  UI.actions.zone = (d) => { G.state.selection.zoneId = d.id; G.emit('select'); };
  UI.actions.fight = (d) => G.Systems.combat.start(d.zone);
})();
