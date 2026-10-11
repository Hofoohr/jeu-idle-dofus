/* ==========================================================================
   Inventaire partagé : ressources empilables + équipements (instances).
   Une instance : { uid, id, mods:{} } — `mods` accueillera les bonus de
   forgemagie (stat -> valeur ajoutée) ; les stats de base viennent de items.js.
   Chaque personnage porte ses propres équipements (team[i].equipped[slot] = uid).
   ========================================================================== */
(function () {
  'use strict';
  const G = Game;

  const Inv = (G.Systems.inventory = {
    count(itemId) { return G.state.items[itemId] || 0; },

    getGear(uid) { return G.state.gear.find((g) => g.uid === uid) || null; },

    /** Stats totales d'une instance = base + mods (forgemagie). */
    instanceStats(inst) {
      if (!inst) return {};
      const out = Object.assign({}, G.items[inst.id].stats);
      Object.keys(inst.mods || {}).forEach((k) => (out[k] = (out[k] || 0) + inst.mods[k]));
      return out;
    },

    /** Ajoute des objets (crée des instances pour l'équipement). */
    add(itemId, qty = 1) {
      const it = G.items[itemId];
      if (it.type === 'equipment') {
        for (let i = 0; i < qty; i++) G.state.gear.push({ uid: G.state.nextUid++, id: itemId, mods: {} });
      } else {
        G.state.items[itemId] = (G.state.items[itemId] || 0) + qty;
      }
      if (G.report) { const r = G.report.items; r[itemId] = (r[itemId] || 0) + qty; }
      G.emit('inv');
    },

    remove(itemId, qty) {
      const have = this.count(itemId);
      if (have < qty) return false;
      if (have === qty) delete G.state.items[itemId]; else G.state.items[itemId] = have - qty;
      G.emit('inv');
      return true;
    },

    hasAll(ingredients) { return ingredients.every((i) => this.count(i.item) >= i.qty); },

    /* ----- Vente ----- */
    sellStack(itemId, qty) {
      qty = Math.min(qty, this.count(itemId));
      if (qty <= 0) return;
      const gold = qty * G.items[itemId].value;
      this.remove(itemId, qty);
      G.Systems.rewards.addKamas(gold, true);
      G.log(`💰 Vendu ${qty}× ${G.items[itemId].name} pour <b>${G.util.fmt(gold)}</b> kamas.`, 'gold');
    },

    sellGear(uid) {
      const inst = this.getGear(uid);
      if (!inst || this.equippedBy(uid) >= 0) return false;
      G.state.gear.splice(G.state.gear.indexOf(inst), 1);
      const gold = G.items[inst.id].value;
      G.Systems.rewards.addKamas(gold, true);
      G.log(`💰 Vendu ${G.items[inst.id].name} pour <b>${G.util.fmt(gold)}</b> kamas.`, 'gold');
      G.emit('inv');
      return true;
    },

    /** Vend tous les équipements non portés. Retourne le nombre vendu. */
    sellAllUnequipped() {
      const sold = G.state.gear.filter((g) => this.equippedBy(g.uid) < 0);
      if (!sold.length) return 0;
      const gold = sold.reduce((s, g) => s + G.items[g.id].value, 0);
      G.state.gear = G.state.gear.filter((g) => this.equippedBy(g.uid) >= 0);
      G.Systems.rewards.addKamas(gold, true);
      G.log(`💰 ${sold.length} équipement(s) vendu(s) pour <b>${G.util.fmt(gold)}</b> kamas.`, 'gold');
      G.emit('inv');
      return sold.length;
    },

    /* ----- Équipement ----- */
    /** Index du personnage qui porte cette instance, ou -1. */
    equippedBy(uid) {
      return G.state.team.findIndex((c) => Object.values(c.equipped).includes(uid));
    },

    /** { ok, reason } : le personnage i peut-il équiper cette instance ? */
    canEquip(i, inst) {
      const it = G.items[inst.id], c = G.state.team[i], cls = G.classes[c.classId];
      if (it.level > c.level) return { ok: false, reason: `Niveau ${it.level} requis` };
      const only = it.weaponType && G.Data.weaponClass[it.weaponType];   // arcs, épées, bâtons, baguettes : une seule classe
      if (only && only !== c.classId) return { ok: false, reason: `Réservé aux ${G.classes[only].name} (${G.Data.weaponTypes[it.weaponType]})` };
      return { ok: true };
    },

    equip(i, uid) {
      const inst = this.getGear(uid);
      if (!inst || !this.canEquip(i, inst).ok) return false;
      const other = this.equippedBy(uid);
      if (other >= 0) delete G.state.team[other].equipped[G.items[inst.id].slot];
      G.state.team[i].equipped[G.items[inst.id].slot] = uid;
      G.emit('equip'); G.emit('inv');
      return true;
    },

    unequip(i, slot) {
      if (!G.state.team[i].equipped[slot]) return;
      delete G.state.team[i].equipped[slot];
      G.emit('equip'); G.emit('inv');
    },
  });
})();
