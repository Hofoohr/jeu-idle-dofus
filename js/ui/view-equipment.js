/* ==========================================================================
   Écran Équipement : emplacements, stats totales appliquées au combat.
   ========================================================================== */
(function () {
  'use strict';
  const G = Game, U = G.util, UI = G.UI;
  let selected = 'weapon';

  function slotBox(s) {
    const uid = G.state.equipped[s.id], g = uid ? G.Systems.inventory.getGear(uid) : null;
    const body = g ? `${UI.img(G.items[g.id].img, '🛡️', 'md')}<b>${G.items[g.id].name}</b>` : `<span class="empty">${s.icon}</span>`;
    return `<button class="slot ${selected === s.id ? 'sel' : ''}" data-act="slot" data-id="${s.id}"><span class="sl">${s.name}</span>${body}</button>`;
  }

  function statsPanel() {
    const st = G.Systems.character.stats(), c = G.Systems.character.cls(), eq = G.Systems.character.equipStats();
    const row = (label, val, extra) => `<tr><td>${label}</td><td>${val}${extra ? ` <small class="pos">${extra}</small>` : ''}</td></tr>`;
    const bonus = (k, suf = '') => (eq[k] ? `(+${eq[k]}${suf})` : '');
    return `<table class="kv">
      ${row('❤️ PV max', U.fmt(st.maxHp), bonus('vit'))}
      ${row('⚔️ Attaque de base', U.fmtDec(st.atk, 1))}
      ${row('💥 Dommages fixes', '+' + st.dmg, '')}
      ${row('🔺 % Dommages', '+' + st.pow + ' %', '')}
      ${row('🛡️ Résistance', st.res + ' %', bonus('res', ' %'))}
      ${row('🎯 Critique', st.crit + ' %', bonus('crit', ' %'))}
    </table>
    <p class="muted" style="margin-bottom:0"><small>Dégât d'un sort = Attaque × coef. du sort × (1 + %Dommages) + Dommages fixes.</small></p>`;
  }

  UI.registerView({
    id: 'equipment', name: 'Équipement', icon: '🛡️', events: ['inv', 'equip', 'level', 'imported'],
    render(el) {
      const slot = G.slots[selected];
      const cands = G.state.gear.filter((g) => G.items[g.id].slot === selected).sort((a, b) => G.items[b.id].level - G.items[a.id].level);
      el.innerHTML = `<h2>Équipement</h2>
        <div class="grid cols2">
          <div><div class="panel"><div class="slots">${G.Data.slots.map(slotBox).join('')}</div></div>
            <div class="panel"><h3>${slot.icon} ${slot.name} — disponibles</h3>
              ${cands.length ? cands.map((g) => UI.gearRow(g)).join('') : '<p class="muted">Rien pour cet emplacement.</p>'}</div></div>
          <div class="panel"><h3>Statistiques de combat</h3>${statsPanel()}</div>
        </div>`;
    },
  });

  UI.actions.slot = (d) => { selected = d.id; UI.renderView(); };
})();
