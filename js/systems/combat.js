/* ==========================================================================
   Combat automatique au tour par tour en temps réel.
   Une action (joueur puis monstre, en alternance) toutes les `turnSeconds`.
   Phases : 'fight' → (monstre mort) 'respawn' → 'fight' …
                    → (joueur mort)  'dead'    → (réanimation) 'fight'
   ========================================================================== */
(function () {
  'use strict';
  const G = Game, U = G.util;

  function C() { return G.rt.combat; }
  function cfg() { return G.Data.config.combat; }
  function feed(text, cls) {
    if (G.silent) return;
    const f = C().feed;
    f.push({ text, cls });
    if (f.length > cfg().feedLines) f.shift();
  }

  const Combat = (G.Systems.combat = {
    valid(a) { return !!G.monsters[a.monsterId] && G.zones[a.zoneId] && G.state.char.level >= G.zones[a.zoneId].minLevel; },

    begin(a) {
      const st = G.Systems.character.stats();
      G.rt.combat = { phase: 'fight', hp: st.maxHp, shield: 0, shieldTurns: 0, cds: {}, feed: [], monster: null, turn: 'player', skipMonster: false };
      this.spawn(a);
    },

    end() { G.rt.combat = null; },

    spawn(a) {
      const def = G.monsters[a.monsterId], rt = C();
      rt.monster = { def, hp: def.hp };
      rt.phase = 'fight';
      rt.turn = 'player';
      rt.skipMonster = G.Systems.character.cls().opener === 'distance'; // le Crâ tire avant d'être atteint
      rt.cds = {};
      rt.shield = 0; rt.shieldTurns = 0;
      feed(`Un ${def.name} apparaît !`, 'sys');
    },

    interval() {
      const rt = C();
      if (rt.phase === 'dead') return cfg().reviveSeconds;
      if (rt.phase === 'respawn') return cfg().respawnSeconds;
      return cfg().turnSeconds;
    },

    describe(a) {
      const m = G.monsters[a.monsterId];
      return { title: `⚔️ Combat : ${m.name}`, sub: G.zones[a.zoneId].name };
    },

    tick(a) {
      const rt = C();
      const maxHp = G.Systems.character.stats().maxHp;
      if (rt.hp > maxHp) rt.hp = maxHp;

      if (rt.phase === 'dead') {
        rt.hp = maxHp;
        feed('Tu te relèves, prêt à repartir.', 'sys');
        this.spawn(a);
        return;
      }
      if (rt.phase === 'respawn') { this.spawn(a); return; }

      if (rt.turn === 'player') { this.playerTurn(a); rt.turn = 'monster'; }
      else { this.monsterTurn(a); rt.turn = 'player'; }
    },

    pickSpell() {
      const rt = C(), cls = G.Systems.character.cls(), st = G.Systems.character.stats();
      for (const sp of cls.spells) {
        if (sp.cd > 0 && (rt.cds[sp.id] || 0) > 0) continue;
        if (sp.kind === 'shield' && rt.shield > 0) continue;
        if (sp.kind === 'heal' && rt.hp > st.maxHp * 0.9) continue;
        return sp;
      }
      return cls.spells[cls.spells.length - 1];
    },

    playerTurn(a) {
      const rt = C(), st = G.Systems.character.stats(), m = rt.monster;
      // recharge des sorts / durée du bouclier
      Object.keys(rt.cds).forEach((k) => { if (rt.cds[k] > 0) rt.cds[k]--; });
      if (rt.shieldTurns > 0 && --rt.shieldTurns === 0) rt.shield = 0;

      const sp = this.pickSpell();
      if (sp.cd > 0) rt.cds[sp.id] = sp.cd;

      if (sp.kind === 'shield') {
        rt.shield = Math.round(st.maxHp * sp.pct);
        rt.shieldTurns = sp.duration;
        feed(`${sp.icon} ${sp.name} : bouclier de ${rt.shield} PV`, 'good');
        return;
      }
      const hit = G.F.playerHit(st, sp, m.def);
      m.hp -= hit.dmg;
      feed(`${sp.icon} ${sp.name} → <b>${hit.dmg}</b>${hit.crit ? ' (critique !)' : ''}`, hit.crit ? 'crit' : 'dmg');
      if (m.hp <= 0) this.victory(a);
    },

    monsterTurn() {
      const rt = C(), st = G.Systems.character.stats(), m = rt.monster;
      if (rt.skipMonster) { rt.skipMonster = false; feed(`${m.def.name} s'approche…`, 'sys'); return; }
      let dmg = G.F.monsterHit(m.def, st);
      feed(`${m.def.name} t'attaque → <b>${dmg}</b>`, 'hurt');
      if (rt.shield > 0) {
        const absorbed = Math.min(rt.shield, dmg);
        rt.shield -= absorbed; dmg -= absorbed;
      }
      rt.hp -= dmg;
      if (rt.hp <= 0) this.defeat();
    },

    victory(a) {
      const rt = C(), m = rt.monster.def, R = G.Systems.rewards, S = G.state;
      S.stats.kills++;
      if (G.report) G.report.kills++;
      const mult = G.F.monsterXpMult(S.char.level, m.level);
      const xp = Math.max(1, Math.round(m.xp * mult));
      const kamas = U.randInt(m.kamas[0], m.kamas[1]);
      R.addKamas(kamas);
      G.log(`⚔️ ${m.name} vaincu : +${xp} XP${mult < 1 ? ' <small>(niveau trop élevé)</small>' : ''}, +${kamas} kamas`, 'combat');
      R.addXp('char', null, xp);
      R.rollDrops(m.drops || []);
      feed(`${m.name} est vaincu !`, 'good');
      // soin après victoire
      const maxHp = G.Systems.character.stats().maxHp;
      rt.hp = Math.min(maxHp, rt.hp + maxHp * cfg().healAfterKill);
      rt.phase = 'respawn';
    },

    defeat() {
      const rt = C();
      G.state.stats.deaths++;
      if (G.report) G.report.deaths++;
      rt.hp = 0; rt.phase = 'dead';
      G.log(`💀 Tu es vaincu par ${rt.monster.def.name}… résurrection en cours.`, 'bad');
      feed('Tu es à terre !', 'hurt');
    },

    /** Lance un combat contre un monstre d'une zone. */
    start(zoneId, monsterId) {
      G.Engine.start({ type: 'combat', zoneId, monsterId });
    },
  });

  G.Engine.register('combat', Combat);
})();
