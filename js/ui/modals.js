/* ==========================================================================
   Fenêtres : choix de classe (création) et rapport de progression hors-ligne.
   ========================================================================== */
(function () {
  'use strict';
  const G = Game, U = G.util, UI = G.UI;

  /** Création du personnage. callback(classId, name) */
  UI.classSelect = (callback) => {
    let sel = null;
    const cards = G.Data.classes.map((c) => `
      <button class="class-card" data-act="pickclass" data-id="${c.id}">
        ${UI.img(G.img.breedLogo(c.breedId), '🧙', 'xl')}<h3 style="margin:0">${c.name}</h3><span class="tag">${c.role}</span>
        <div class="desc">${c.desc}</div>
        <small>❤️ ${c.base.hp} · ⚔️ ${c.base.atk} · 🛡️ ${c.base.res} %</small>
        <small>${c.spells.map((s) => s.icon + ' ' + s.name).join(' · ')}</small>
      </button>`).join('');
    UI.modal(`<h2>Bienvenue, aventurier !</h2>
      <p class="muted">Choisis ta classe et ton nom. Le combat est automatique et continue même quand tu fermes l'onglet (jusqu'à ${G.Data.config.offlineCapHours} h).</p>
      <div class="class-cards">${cards}</div>
      <div class="row"><input type="text" id="new-name" maxlength="20" placeholder="Nom du personnage" value="Aventurier">
      <button class="btn primary" id="new-go" disabled>Commencer l'aventure</button></div>`, { closable: false });
    UI.actions.pickclass = (d) => {
      sel = d.id;
      document.querySelectorAll('.class-card').forEach((c) => c.classList.toggle('sel', c.dataset.id === sel));
      document.getElementById('new-go').disabled = false;
    };
    document.getElementById('new-go').onclick = () => {
      const name = document.getElementById('new-name').value.trim().slice(0, 20) || 'Aventurier';
      UI.closeModal();
      callback(sel, name);
    };
  };

  /** Rapport de retour. */
  UI.offlineReport = (r, awaySeconds) => {
    const L = (key) => (key === 'char' ? 'Personnage' : G.jobs[key].name);
    const xp = Object.keys(r.xp).map((k) => {
      const lv = r.levels[k];
      return `<div class="report-line">✨ <b>${L(k)}</b> +${U.fmt(r.xp[k])} XP${lv ? ` <span class="tag">niv. ${lv.from} → ${lv.to}</span>` : ''}</div>`;
    }).join('');
    const items = Object.keys(r.items).sort((a, b) => G.items[b].value * r.items[b] - G.items[a].value * r.items[a]).map((id) =>
      `<div class="report-line">${UI.img(G.items[id].img, '📦', 'sm')}<span>${U.fmt(r.items[id])}× ${G.items[id].name}</span></div>`).join('');
    const info = r.hadAction ? `${r.hadAction.title}` : '';
    UI.modal(`<h2>👋 Bon retour !</h2>
      <p>Tu étais absent <b>${U.fmtDur(awaySeconds)}</b>${r.capped ? ` — progression plafonnée à <b>${G.Data.config.offlineCapHours} h</b>` : ''}.<br>
      <span class="muted">Pendant ce temps : ${info}${r.stoppedEarly ? ' (arrêté avant la fin : ressources épuisées)' : ''}</span></p>
      <div class="panel">
        ${xp || ''}
        ${r.kamas ? `<div class="report-line">💰 <b>+${U.fmt(r.kamas)}</b> kamas</div>` : ''}
        ${r.kills ? `<div class="report-line">⚔️ ${U.fmt(r.kills)} monstres vaincus${r.deaths ? ` · 💀 ${U.fmt(r.deaths)} défaites` : ''}</div>` : ''}
        ${r.gathered ? `<div class="report-line">🪓 ${U.fmt(r.gathered)} ressources récoltées</div>` : ''}
        ${r.crafted ? `<div class="report-line">⚒️ ${U.fmt(r.crafted)} objets fabriqués</div>` : ''}
      </div>
      ${items ? `<h4>Butin</h4><div class="report-grid">${items}</div>` : ''}
      <div class="row" style="margin-top:14px;justify-content:flex-end"><button class="btn primary" data-act="closemodal">Continuer</button></div>`);
  };
  UI.actions.closemodal = () => UI.closeModal();
})();
