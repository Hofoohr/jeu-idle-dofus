/* ==========================================================================
   Fenêtres : création de l'équipe (4 personnages) et récapitulatif de retour
   après une absence (progression hors-ligne).
   ========================================================================== */
(function () {
  'use strict';
  const G = Game, U = G.util, UI = G.UI;
  const DEFAULT_NAMES = ['Sylvaine', 'Brakkar', 'Féclia', 'Pandor'];

  /** Création de l'équipe. callback([{name, classId} × 4]) */
  UI.teamCreate = (callback) => {
    const opts = (sel) => G.Data.classes.map((c) => `<option value="${c.id}" ${c.id === sel ? 'selected' : ''}>${c.name} — ${c.role}</option>`).join('');
    const rows = Array.from({ length: G.Data.config.teamSize }, (_, i) => {
      const cid = G.Data.classes[i % G.Data.classes.length].id;
      return `<div class="create-row"><div class="sprite-box sm" id="cr-sp${i}">${UI.classSprite(cid)}</div>
        <div class="grow"><input type="text" id="cr-name${i}" maxlength="16" value="${DEFAULT_NAMES[i] || 'Héros ' + (i + 1)}" placeholder="Nom">
        <select id="cr-cls${i}" data-i="${i}">${opts(cid)}</select>
        <small class="muted" id="cr-desc${i}">${G.classes[cid].desc}</small></div></div>`;
    }).join('');
    UI.modal(`<h2>Compose ton équipe</h2>
      <p class="muted">Choisis un nom et une classe pour tes ${G.Data.config.teamSize} personnages (plusieurs de la même classe sont possibles). Le combat est automatique et continue même quand tu fermes l'onglet (jusqu'à ${G.Data.config.offlineCapHours} h).</p>
      ${rows}
      <div class="row" style="justify-content:flex-end;margin-top:14px"><button class="btn primary" id="cr-go">Commencer l'aventure</button></div>`, { closable: false });
    document.querySelectorAll('[id^=cr-cls]').forEach((sel) => {
      sel.onchange = () => {
        const i = sel.dataset.i;
        document.getElementById('cr-sp' + i).innerHTML = UI.classSprite(sel.value);
        document.getElementById('cr-desc' + i).textContent = G.classes[sel.value].desc;
      };
    });
    document.getElementById('cr-go').onclick = () => {
      const team = Array.from({ length: G.Data.config.teamSize }, (_, i) => ({
        name: document.getElementById('cr-name' + i).value.trim().slice(0, 16) || DEFAULT_NAMES[i] || 'Héros',
        classId: document.getElementById('cr-cls' + i).value,
      }));
      UI.closeModal();
      callback(team);
    };
  };

  /** Récapitulatif de retour. */
  UI.offlineReport = (r, awaySeconds) => {
    const label = (key) => (/^c\d$/.test(key) ? U.esc(G.state.team[+key.slice(1)].name) : G.jobs[key].name);
    const xp = Object.keys(r.xp).map((k) => {
      const lv = r.levels[k];
      return `<div class="report-line">✨ <b>${label(k)}</b> +${U.fmt(r.xp[k])} XP${lv ? ` <span class="tag">niv. ${lv.from} → ${lv.to}</span>` : ''}</div>`;
    }).join('');
    const items = Object.keys(r.items).sort((a, b) => G.items[b].value * r.items[b] - G.items[a].value * r.items[a]).map((id) =>
      `<div class="report-line">${UI.icon(id, 'sm')}<span>${U.fmt(r.items[id])}× ${G.items[id].name}</span></div>`).join('');
    const info = r.hadAction ? r.hadAction.title : '';
    UI.modal(`<h2>👋 Bon retour !</h2>
      <p>Tu étais absent <b>${U.fmtDur(awaySeconds)}</b>${r.capped ? ` — progression plafonnée à <b>${G.Data.config.offlineCapHours} h</b>` : ''}.<br>
      <span class="muted">Pendant ce temps : ${info}${r.stoppedEarly ? ' (arrêté avant la fin : ressources épuisées)' : ''}</span></p>
      <div class="panel">
        ${xp}
        ${r.kamas ? `<div class="report-line">💰 <b>+${U.fmt(r.kamas)}</b> kamas</div>` : ''}
        ${r.fights ? `<div class="report-line">⚔️ ${U.fmt(r.fights)} combats gagnés · ${U.fmt(r.kills)} monstres vaincus${r.defeats ? ` · 💀 ${U.fmt(r.defeats)} défaite(s)` : ''}</div>` : ''}
        ${r.gathered ? `<div class="report-line">🪓 ${U.fmt(r.gathered)} ressources récoltées</div>` : ''}
        ${r.crafted ? `<div class="report-line">⚒️ ${U.fmt(r.crafted)} objets fabriqués</div>` : ''}
      </div>
      ${items ? `<h4>Butin</h4><div class="report-grid">${items}</div>` : ''}
      <div class="row" style="margin-top:14px;justify-content:flex-end"><button class="btn primary" data-act="closemodal">Continuer</button></div>`);
  };
  UI.actions.closemodal = () => UI.closeModal();
})();
