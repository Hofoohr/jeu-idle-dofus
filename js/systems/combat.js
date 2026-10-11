/* ==========================================================================
   Combat automatique d'une équipe de 4 contre un groupe de 1 à 4 monstres.

   BARRE D'ATTAQUE : chaque combattant (personnage ou monstre) a une barre de 0 à 1000.
   À chaque tick (0,1 s) elle gagne  speedBase + initiative × speedPerInit.
   À 1000 le combattant agit (et la barre perd 1000). Si plusieurs sont prêts au même tick,
   celui qui dépasse le plus 1000 agit en premier, les autres attendent le tick suivant.

   Phases : 'fight' (combat) → 'between' (pause avant le groupe suivant)
            → si toute l'équipe tombe : 'rest' (repos, régénération) → nouveau groupe.
   Les événements visuels (animations) sont émis via Game.emit('fx', …), sauf
   pendant la simulation hors-ligne (Game.silent).
   ========================================================================== */
(function () {
  'use strict';
  const G = Game, U = G.util;
  const cfg = () => G.Data.config.combat;
  const C = () => G.rt.combat;
  const fx = (e) => { if (!G.silent) G.emit('fx', e); };

  /* ---------- Création des combattants ---------- */
  function makeFighter(o) {
    return Object.assign({ shield: 0, shieldTurns: 0, debuff: null, cds: {}, alive: true,
      atb: Math.random() * cfg().startAtbMax }, o);
  }

  function makePartyFighters() {
    const rt = C();
    return G.state.team.map((c, i) => {
      const st = G.Systems.team.stats(i);
      const hp = rt.partyHp[i] === undefined ? st.maxHp : Math.min(rt.partyHp[i], st.maxHp);
      return makeFighter({ id: 'p' + i, side: 'party', idx: i, name: c.name, classId: c.classId, level: c.level,
        stats: st, maxHp: st.maxHp, hp, alive: hp > 0, init: st.initiative, speed: G.F.atbSpeed(st.initiative) });
    });
  }

  /** Tire un groupe de 1 à 4 monstres (au plus un monstre « rare »). */
  function makeEnemies(zone) {
    const size = +U.weighted(Object.entries(cfg().groupSizeWeights).map(([n, w]) => ({ weight: w, n }))).n;
    const list = [];
    for (let i = 0; i < size; i++) {
      let pool = zone.monsters;
      if (list.some((m) => m.rare)) pool = pool.filter((e) => !G.monsters[e.id].rare);
      list.push(G.monsters[U.weighted(pool).id]);
    }
    return list.map((m, i) => makeFighter({ id: 'e' + i, side: 'enemy', def: m, name: m.name, level: m.level,
      maxHp: m.hp, hp: m.hp, init: m.init, speed: G.F.atbSpeed(m.init) }));
  }

  function startFight(a) {
    const rt = C();
    rt.party = makePartyFighters();
    rt.enemies = makeEnemies(G.zones[a.zoneId]);
    rt.order = rt.party.concat(rt.enemies);
    rt.phase = 'fight';
    rt.fightNo++;
    fx({ t: 'spawn' });
  }

  /* ---------- IA des personnages ---------- */
  const alive = (arr) => arr.filter((f) => f.alive);
  const ratio = (f) => f.hp / f.maxHp;
  const lowest = (arr, fn) => arr.reduce((b, x) => (b === null || fn(x) < fn(b) ? x : b), null);

  /**
   * Parmi les sorts obtenus, prêts (recharge finie) et utiles, lance celui qui a la meilleure
   * priorité (réglée par le joueur dans l'écran Équipe). L'attaque de base est toujours prête.
   */
  function chooseSpell(f) {
    const rt = C(), team = G.Systems.team, ch = G.state.team[f.idx];
    const allies = alive(rt.party), foes = alive(rt.enemies);
    const open = team.unlocked(f.idx);
    for (const id of ch.priority) {
      if (!open.includes(id)) continue;
      const sp = G.spells[id];
      if (sp.cd > 0 && (f.cds[id] || 0) > 0) continue;
      if (sp.kind === 'heal') {
        const t = lowest(allies, ratio);
        if (t && ratio(t) < cfg().healThreshold) return { sp, targets: sp.aoe ? allies : [t] };
      } else if (sp.kind === 'shield') {
        const cand = allies.filter((a) => a.shield <= 0);
        if (cand.length) return { sp, targets: sp.aoe ? cand : [lowest(cand, ratio)] };
      } else if (sp.kind === 'debuff') {
        const cand = foes.filter((e) => !e.debuff);
        if (cand.length) return { sp, targets: [cand.reduce((b, e) => (e.def.attack.dmg[1] > b.def.attack.dmg[1] ? e : b))] };
      } else if (sp.kind === 'damage') {
        if (sp.aoe && foes.length < 2) continue;
        return { sp, targets: sp.aoe ? foes : [lowest(foes, (e) => e.hp)] };
      }
    }
    return { sp: team.basicSpell(f.idx), targets: [lowest(foes, (e) => e.hp)] };
  }

  /* ---------- Effets ---------- */
  /** Inflige des dégâts en consommant d'abord le bouclier. */
  function applyDamage(t, dmg, crit) {
    const absorbed = Math.min(t.shield, dmg);
    t.shield -= absorbed;
    const real = dmg - absorbed;
    t.hp -= real;
    if (absorbed > 0) fx({ t: 'num', id: t.id, kind: 'shield', v: absorbed, absorb: true });
    if (real > 0) fx({ t: 'num', id: t.id, kind: 'dmg', v: real, crit });
    if (t.hp <= 0) { t.hp = 0; t.alive = false; t.shield = 0; fx({ t: 'dead', id: t.id }); }
  }

  function cast(f, sp, targets) {
    if (sp.cd > 0) f.cds[sp.id] = sp.cd;
    fx({ t: 'act', id: f.id });
    const who = `<b>${U.esc(f.name)}</b>`, ico = G.spellIconHtml(sp, 'xs');
    if (sp.kind === 'damage') {
      const parts = targets.map((t) => { const r = G.F.spellDamage(f.stats, sp, t.def); applyDamage(t, r.dmg, r.crit); return r.crit ? r.dmg + '💥' : r.dmg; });
      G.log(`${ico} ${who} lance ${sp.name} → ${targets.length > 1 ? targets.length + ' ennemis' : targets[0].name} : <b>${parts.join(' + ')}</b>`, 'spell');
    } else if (sp.kind === 'heal') {
      const parts = targets.map((t) => {
        const h = G.F.spellHeal(f.stats, sp);
        const real = Math.min(h, t.maxHp - t.hp);
        t.hp += real;
        fx({ t: 'num', id: t.id, kind: 'heal', v: real });
        return real;
      });
      G.log(`${ico} ${who} lance ${sp.name} → ${targets.length > 1 ? 'toute l\'équipe' : U.esc(targets[0].name)} : <b>+${parts.join(' / +')} PV</b>`, 'spell');
    } else if (sp.kind === 'shield') {
      const v = Math.round(G.F.spellValue(f.stats, sp));
      targets.forEach((t) => { t.shield = Math.max(t.shield, v); t.shieldTurns = sp.duration; fx({ t: 'num', id: t.id, kind: 'shield', v }); });
      G.log(`${ico} ${who} lance ${sp.name} → ${targets.length > 1 ? 'toute l\'équipe' : U.esc(targets[0].name)} : <b>bouclier ${v}</b>`, 'spell');
    } else if (sp.kind === 'debuff') {
      targets.forEach((t) => { t.debuff = { value: sp.value, turns: sp.duration }; fx({ t: 'text', id: t.id, text: '-' + Math.round(sp.value * 100) + '% dég.', kind: 'debuff' }); });
      G.log(`${ico} ${who} lance ${sp.name} → ${targets[0].name} : <b>dégâts -${Math.round(sp.value * 100)} %</b>`, 'spell');
    }
  }

  function enemyAct(f) {
    const rt = C(), targets = alive(rt.party);
    if (!targets.length) return;
    const t = targets[Math.floor(Math.random() * targets.length)];
    fx({ t: 'act', id: f.id });
    applyDamage(t, G.F.monsterDamage(f.def, t.stats, f.debuff && f.debuff.value));
  }

  /* ---------- Fin de combat ---------- */
  function victory() {
    const rt = C(), S = G.state, R = G.Systems.rewards, n = S.team.length;
    const foes = rt.enemies;
    S.stats.fights++; S.stats.kills += foes.length;
    if (G.report) { G.report.kills += foes.length; G.report.fights++; }
    const totalXp = foes.reduce((s, e) => s + e.def.xp, 0);
    const kamas = foes.reduce((s, e) => s + U.randInt(e.def.kamas[0], e.def.kamas[1]), 0);
    const avgLvl = foes.reduce((s, e) => s + e.level, 0) / foes.length;
    R.addKamas(kamas);
    const gains = S.team.map((c, i) => {
      const wis = G.Systems.team.stats(i).sagesse * cfg().sagesseXpPct / 100;
      return Math.max(1, Math.round((totalXp / n) * G.F.monsterXpMult(c.level, avgLvl) * (1 + wis)));
    });
    G.log(`⚔️ Victoire contre ${foes.map((e) => e.name).join(', ')} : +${U.fmt(gains[0])} XP chacun (≈), +${U.fmt(kamas)} kamas`, 'combat');
    gains.forEach((g, i) => R.addXp('char', i, g));
    foes.forEach((e) => R.rollDrops(e.def.drops || []));
    // relève les alliés tombés et soigne un peu
    rt.party.forEach((p) => {
      const max = G.Systems.team.stats(p.idx).maxHp;
      const hp = p.hp <= 0 ? max * cfg().reviveHpPct : p.hp;
      rt.partyHp[p.idx] = Math.min(max, Math.round(hp + max * cfg().healAfterFight));
    });
    rt.phase = 'between'; rt.wait = cfg().spawnSeconds;
    fx({ t: 'victory' });
  }

  function defeat() {
    const rt = C();
    G.state.stats.defeats++;
    if (G.report) G.report.defeats++;
    rt.phase = 'rest'; rt.restLeft = cfg().restSeconds;
    rt.party.forEach((p) => (rt.partyHp[p.idx] = 0));
    G.log('💀 Toute l\'équipe est à terre… repos en cours.', 'bad');
    fx({ t: 'rest' });
  }

  /* ---------- Système d'action ---------- */
  const Combat = (G.Systems.combat = {
    valid(a) { const z = G.zones[a.zoneId]; return !!z && G.Systems.team.avgLevel() >= z.minLevel; },

    begin(a) {
      G.rt.combat = { phase: 'between', partyHp: [], party: [], enemies: [], order: [], fightNo: 0, restLeft: 0, wait: 0 };
      startFight(a);
    },

    end() { G.rt.combat = null; fx({ t: 'spawn' }); },

    /** Un tick de combat = tickSeconds (0,1 s). */
    interval() { return cfg().tickSeconds; },

    describe(a) {
      const z = G.zones[a.zoneId], rt = C();
      const info = rt && rt.phase === 'rest' ? 'Repos…' : `Combat n°${rt ? rt.fightNo : 1}`;
      return { title: `⚔️ Combat : ${z.name}`, sub: info };
    },

    barInfo() {
      const rt = C();
      if (!rt || !rt.enemies.length) return { ratio: 0, text: '' };
      if (rt.phase === 'rest') return { ratio: 1 - rt.restLeft / cfg().restSeconds, text: 'Repos…' };
      const hp = rt.enemies.reduce((s, e) => s + e.hp, 0), max = rt.enemies.reduce((s, e) => s + e.maxHp, 0);
      return { ratio: hp / max, text: `Ennemis : ${U.fmt(hp)} / ${U.fmt(max)} PV` };
    },

    tick(a) {
      const rt = C(), dt = cfg().tickSeconds;
      if (rt.phase === 'between') { if ((rt.wait -= dt) <= 0) startFight(a); return; }
      if (rt.phase === 'rest') {
        rt.party.forEach((p) => { p.hp = Math.min(p.maxHp, p.hp + p.maxHp * dt / cfg().restSeconds); p.alive = p.hp > 0; });
        if ((rt.restLeft -= dt) <= 0) {
          rt.party.forEach((p) => (rt.partyHp[p.idx] = p.maxHp));
          startFight(a);
        }
        return;
      }
      // Remplissage des barres d'attaque ; le combattant qui dépasse le plus 1000 agit.
      const max = cfg().atbMax;
      let f = null;
      for (let k = 0; k < rt.order.length; k++) {
        const x = rt.order[k];
        if (!x.alive) continue;
        x.atb += x.speed;
        if (x.atb >= max && (f === null || x.atb > f.atb)) f = x;
      }
      if (!f) return;
      f.atb -= max;
      // début d'action : recharges, durée du bouclier et du débuff
      for (const k in f.cds) if (f.cds[k] > 0) f.cds[k]--;
      if (f.shieldTurns > 0 && --f.shieldTurns === 0) f.shield = 0;
      if (f.debuff && --f.debuff.turns <= 0) f.debuff = null;

      if (f.side === 'party') { const c = chooseSpell(f); cast(f, c.sp, c.targets); } else enemyAct(f);

      if (!alive(rt.enemies).length) victory();
      else if (!alive(rt.party).length) defeat();
    },

    start(zoneId) { G.Engine.start({ type: 'combat', zoneId }); },
  });

  G.Engine.register('combat', Combat);
})();
