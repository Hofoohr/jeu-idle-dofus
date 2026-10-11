/* ==========================================================================
   Écran Métiers (niveau du compte) : Bûcheron (récolte), Tailleur et
   Sculpteur (craft). Une seule activité à la fois pour toute l'équipe.
   ========================================================================== */
(function () {
  'use strict';
  const G = Game, U = G.util, UI = G.UI;

  function jobHead(job) {
    const j = G.state.jobs[job.id];
    return `<div class="job-head"><span class="big">${job.icon}</span>
      <div><h3 style="margin:0">${job.name}</h3><small>Niveau ${j.level}</small></div>
      ${UI.bar('jb-' + job.id, 'job')}</div>`;
  }

  function resourceRow(job, r) {
    const j = G.state.jobs[job.id], locked = j.level < r.level, it = G.items[r.item];
    const a = G.Engine.current(), active = a && a.type === 'gather' && a.resourceId === r.id;
    const xpm = G.F.jobXpMult(j.level, r.level);
    return `<div class="entry ${active ? 'active' : ''}">${UI.icon(r.item, 'md')}
      <div class="info"><b>${r.name}</b> <span class="tag ${locked ? 'lock' : ''}">niv. ${r.level}</span><br>
        <small>${U.fmtDec(G.F.gatherTime(r, j.level), 1)} s · +${Math.max(1, Math.round(r.xp * xpm))} XP · ${r.yield[0] === r.yield[1] ? r.yield[0] : r.yield.join('–')}× ${it.name} · stock : ${U.fmt(G.Systems.inventory.count(r.item))}</small></div>
      ${active ? '<button class="btn danger" data-act="stop">⏹ Arrêter</button>'
        : `<button class="btn primary" ${locked ? 'disabled' : ''} data-act="gather" data-id="${r.id}">${locked ? '🔒' : 'Récolter'}</button>`}
    </div>`;
  }

  function recipeRow(r) {
    const j = G.state.jobs[r.job], res = G.items[r.result.item];
    const locked = j.level < r.level;
    const a = G.Engine.current(), active = a && a.type === 'craft' && a.recipeId === r.id;
    const ok = G.Systems.inventory.hasAll(r.ingredients);
    const ing = r.ingredients.map((i) => {
      const have = G.Systems.inventory.count(i.item);
      return `<span class="${have >= i.qty ? 'ok' : 'miss'}">${UI.icon(i.item, 'xs')} ${G.items[i.item].name} ${U.fmt(have)}/${i.qty}</span>`;
    }).join('');
    const wt = res.weaponType ? ` <span class="tag">${G.Data.weaponTypes[res.weaponType]}</span>` : '';
    return `<div class="entry ${active ? 'active' : ''}">${UI.icon(r.result.item, 'md')}
      <div class="info"><b>${res.name}</b> <span class="tag ${locked ? 'lock' : ''}">métier niv. ${r.level}</span> <span class="tag">équip. niv. ${res.level}</span>${wt}
        ${UI.statsHtml(res.stats)}
        <div class="ing">${ing}</div>
        <small>${r.time} s · +${Math.max(1, Math.round(r.xp * G.F.jobXpMult(j.level, r.level)))} XP métier</small></div>
      ${active ? '<button class="btn danger" data-act="stop">⏹ Arrêter</button>'
        : `<button class="btn primary" ${locked || !ok ? 'disabled' : ''} data-act="craft" data-id="${r.id}">${locked ? '🔒' : 'Fabriquer'}</button>`}
    </div>`;
  }

  UI.registerView({
    id: 'jobs', name: 'Métiers', icon: '🛠️', events: ['action', 'inv', 'level', 'imported'],
    render(el) {
      const blocks = G.Data.jobs.map((job) => {
        const rows = job.type === 'gather'
          ? job.resources.map((r) => resourceRow(job, r)).join('')
          : G.Data.recipes.filter((r) => r.job === job.id).map(recipeRow).join('');
        return `<div class="panel">${jobHead(job)}${rows}</div>`;
      }).join('');
      el.innerHTML = `<h2>Métiers</h2>
        <p class="muted">Les métiers sont communs à toute l'équipe. La récolte et la fabrication tournent en boucle (la fabrication s'arrête quand les ingrédients manquent). Lancer un métier arrête le combat.</p>
        <div class="grid cols3">${blocks}</div>`;
      this.update();
    },
    update() {
      G.Data.jobs.forEach((job) => {
        const j = G.state.jobs[job.id], max = j.level >= G.Data.config.maxJobLevel, need = G.F.xpForLevel('job', j.level);
        UI.setBar('jb-' + job.id, max ? 1 : j.xp / need, max ? 'Niveau max' : `XP ${U.fmt(j.xp)} / ${U.fmt(need)}`);
      });
    },
  });

  UI.actions.gather = (d) => G.Systems.gathering.start(d.id);
  UI.actions.craft = (d) => G.Systems.crafting.start(d.id);
})();
