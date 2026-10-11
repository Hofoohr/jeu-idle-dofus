/* ==========================================================================
   Scène de combat en bandeau : décor en fond, les 4 personnages à gauche,
   les monstres à droite. Sous chaque combattant : nom, badge de niveau,
   barre de vie (PV actuels / max, bouclier en bleu).
   Animations CSS : avance quand le combattant agit, chiffres flottants
   (dégâts rouges, soins verts, boucliers bleus), fondu à la mort.
   Les événements viennent de systems/combat.js via Game.emit('fx', …).
   ========================================================================== */
(function () {
  'use strict';
  const G = Game, U = G.util, UI = G.UI;

  const Scene = (UI.scene = {
    /** HTML de la scène (à insérer dans une vue puis appeler fill()). */
    html(zoneId) {
      const z = G.zones[zoneId];
      // Image de décor dans un vrai élément (url relative à la page, pas à la feuille de style)
      const img = z.decor ? `<div class="scene-bg" style="background-image:url('${z.decor}')"></div>` : '';
      return `<div class="scene" id="scene" style="background:${z.decorCss}">${img}
        <div class="side party" id="sc-party"></div>
        <div class="side enemies" id="sc-enemies"></div>
        <div class="scene-msg" id="sc-msg"></div>
      </div>`;
    },

    unitHtml(id, sprite, name) {
      return `<div class="unit" id="u-${id}"><div class="fx-layer"></div>
        <div class="sprite-box">${sprite}</div>
        <div class="nm"><span class="nm-t">${U.esc(name)}</span> <span class="lvl"></span></div>
        <div class="hpbar"><i class="hp"></i><i class="sh"></i><b></b></div>
        <div class="atb"><i></i></div></div>`;
    },

    /** Remplit la scène : équipe + ennemis courants (s'il y en a). */
    fill() {
      const party = document.getElementById('sc-party');
      if (!party) return;
      party.innerHTML = G.state.team.map((c, i) => this.unitHtml('p' + i, UI.classSprite(c.classId), c.name)).join('');
      this.fillEnemies();
    },

    fillEnemies() {
      const box = document.getElementById('sc-enemies');
      if (!box) return;
      const rt = G.rt.combat, a = G.Engine.current();
      const list = a && a.type === 'combat' && rt ? rt.enemies : [];
      // les monstres s'alignent à droite ; l'emplacement e0 est le plus proche de l'équipe
      box.innerHTML = list.map((e) => this.unitHtml(e.id, UI.monsterSprite(e.def), e.name)).join('');
      this.update();
    },

    /** Met à jour barres, niveaux, états (appelé à chaque tick d'interface). */
    update() {
      const rt = G.rt.combat, a = G.Engine.current();
      const active = a && a.type === 'combat' && rt;
      G.state.team.forEach((c, i) => {
        const f = active ? rt.party[i] : null, st = G.Systems.team.stats(i);
        this.setUnit('p' + i, c.level, f ? f.hp : st.maxHp, st.maxHp, f ? f.shield : 0, f ? f.alive : true, f ? f.atb : 0);
      });
      if (active) rt.enemies.forEach((e) => this.setUnit(e.id, e.level, e.hp, e.maxHp, e.shield, e.alive, e.atb));
      const msg = document.getElementById('sc-msg');
      if (msg) {
        const t = !active ? 'Choisis une zone pour lancer les combats' : rt.phase === 'rest' ? '💤 L\'équipe se repose…' : rt.phase === 'between' ? '' : '';
        if (msg.textContent !== t) msg.textContent = t;
        msg.classList.toggle('show', !!t);
      }
    },

    setUnit(id, level, hp, max, shield, alive, atb) {
      const u = document.getElementById('u-' + id);
      if (!u) return;
      const den = Math.max(max, hp + shield);
      u.querySelector('.hp').style.width = (hp / den * 100).toFixed(1) + '%';
      const sh = u.querySelector('.sh');
      sh.style.left = (hp / den * 100).toFixed(1) + '%';
      sh.style.width = (shield / den * 100).toFixed(1) + '%';
      const txt = `${U.fmt(hp)}${shield > 0 ? ` (+${U.fmt(shield)})` : ''} / ${U.fmt(max)}`;
      const b = u.querySelector('.hpbar b');
      if (b.textContent !== txt) b.textContent = txt;
      const lv = u.querySelector('.lvl'), lt = `Niv. ${level}`;
      if (lv.textContent !== lt) lv.textContent = lt;
      u.querySelector('.atb i').style.width = Math.min(100, (atb || 0) / G.Data.config.combat.atbMax * 100).toFixed(1) + '%';
      u.classList.toggle('dead', !alive);
    },

    /** Effets visuels : animation d'action, chiffres flottants. */
    fx(e) {
      if (e.t === 'spawn') { this.fillEnemies(); return; }
      const u = document.getElementById('u-' + e.id);
      if (!u) return;
      if (e.t === 'act') {
        const cls = e.id[0] === 'p' ? 'acting-r' : 'acting-l';
        u.classList.remove('acting-r', 'acting-l'); void u.offsetWidth; u.classList.add(cls);
        setTimeout(() => u.classList.remove(cls), 500);
      } else if (e.t === 'num' || e.t === 'text') {
        const s = document.createElement('span');
        const kind = e.kind;
        s.className = 'float ' + kind + (e.crit ? ' crit' : '');
        s.textContent = e.t === 'text' ? e.text : (kind === 'dmg' ? '-' : '+') + U.fmt(e.v) + (e.crit ? '!' : '');
        if (e.absorb) s.textContent = '🛡 ' + U.fmt(e.v);
        s.style.left = (30 + Math.random() * 40) + '%';
        u.querySelector('.fx-layer').appendChild(s);
        setTimeout(() => s.remove(), 1100);
      }
    },
  });

  G.on('fx', (e) => Scene.fx(e));
})();
