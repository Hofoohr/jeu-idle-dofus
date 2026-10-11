/* ==========================================================================
   Écran Paramètres : sauvegarde (manuelle, export, import), réinitialisation.
   ========================================================================== */
(function () {
  'use strict';
  const G = Game, U = G.util, UI = G.UI;

  function download(name, text) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([text], { type: 'text/plain' }));
    a.download = name; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  UI.registerView({
    id: 'settings', name: 'Paramètres', icon: '⚙️', events: ['imported'],
    render(el) {
      const S = G.state;
      el.innerHTML = `<h2>Paramètres</h2>
        <div class="panel"><h3>💾 Sauvegarde</h3>
          <p class="muted">Sauvegarde automatique toutes les ${G.Data.config.autosaveSeconds} s dans ce navigateur. Exporte-la pour la déplacer ou la protéger.</p>
          <div class="row" style="margin-bottom:10px">
            <button class="btn primary" data-act="savenow">Sauvegarder maintenant</button>
            <button class="btn" data-act="export">Exporter</button>
            <button class="btn" data-act="download">Télécharger (.txt)</button>
            <button class="btn danger" data-act="reset">Réinitialiser</button></div>
          <textarea class="save" id="save-text" placeholder="Colle ici une sauvegarde exportée, ou clique sur Exporter…"></textarea>
          <div class="row" style="margin-top:8px">
            <button class="btn" data-act="copy">Copier</button>
            <button class="btn primary" data-act="import">Importer ce texte</button>
            <label class="btn">Importer un fichier<input type="file" id="save-file" accept=".txt,.json" hidden></label></div>
        </div>
        <div class="panel"><h3>📊 Statistiques</h3>
          <table class="kv">
            <tr><td>Combats gagnés</td><td>${U.fmt(S.stats.fights)}</td></tr>
            <tr><td>Monstres vaincus</td><td>${U.fmt(S.stats.kills)}</td></tr>
            <tr><td>Défaites de l'équipe</td><td>${U.fmt(S.stats.defeats)}</td></tr>
            <tr><td>Ressources récoltées</td><td>${U.fmt(S.stats.gathered)}</td></tr>
            <tr><td>Objets fabriqués</td><td>${U.fmt(S.stats.crafted)}</td></tr>
            <tr><td>Kamas gagnés (hors ventes)</td><td>${U.fmt(S.stats.kamasEarned)}</td></tr>
            ${G.Data.jobs.map((j) => `<tr><td>${j.icon} ${j.name}</td><td>niveau ${S.jobs[j.id].level}</td></tr>`).join('')}
            <tr><td>Début de l'aventure</td><td>${new Date(S.createdAt).toLocaleDateString('fr-FR')}</td></tr>
          </table></div>`;
      document.getElementById('save-file').onchange = (e) => {
        const f = e.target.files[0]; if (!f) return;
        const r = new FileReader();
        r.onload = () => { document.getElementById('save-text').value = r.result; UI.actions.import(); };
        r.readAsText(f);
      };
    },
  });

  const txt = () => document.getElementById('save-text');
  UI.actions.savenow = () => { G.Save.save(); UI.toast('Partie sauvegardée ✔'); };
  UI.actions.export = () => { txt().value = G.Save.exportString(); txt().select(); UI.toast('Sauvegarde exportée'); };
  UI.actions.download = () => download(`dofus-idle-niv${Math.round(G.Systems.team.avgLevel())}.txt`, G.Save.exportString());
  UI.actions.copy = () => {
    if (!txt().value) txt().value = G.Save.exportString();
    txt().select();
    (navigator.clipboard ? navigator.clipboard.writeText(txt().value) : Promise.reject()).then(() => UI.toast('Copié ✔'), () => { document.execCommand('copy'); UI.toast('Copié ✔'); });
  };
  UI.actions.import = () => {
    try {
      const s = G.Save.parseExport(txt().value);
      if (!confirm(`Importer cette sauvegarde (équipe : ${s.team.map((c) => c.name + ' niv. ' + c.level).join(', ')}) ? La partie actuelle sera remplacée.`)) return;
      G.Engine.stop(true);
      G.state = s;
      G.Save.save();
      G.emit('imported');
      G.Engine.resume();
      UI.buildTopbar(); UI.renderJournal(); UI.renderView();
      UI.toast('Sauvegarde importée ✔');
    } catch (e) { alert(e.message); }
  };
  UI.actions.reset = () => {
    if (!confirm('Effacer définitivement ta progression ?')) return;
    G.Save.wipe(); G.state = null; location.reload();
  };
})();
