/* ==========================================================================
   Sauvegarde : localStorage (auto toutes les 30 s) + export / import texte.
   ========================================================================== */
(function () {
  'use strict';
  const G = Game;
  const PREFIX = 'DIDLE1:';

  const Save = (G.Save = {
    save() {
      if (!G.state) return false;
      try {
        G.state.lastSeen = Date.now();
        localStorage.setItem(G.Data.config.saveKey, JSON.stringify(G.state));
        G.emit('saved');
        return true;
      } catch (e) { console.warn('Sauvegarde impossible', e); return false; }
    },

    /** Charge depuis le localStorage. Retourne l'état migré ou null. */
    load() {
      try {
        const raw = localStorage.getItem(G.Data.config.saveKey);
        return raw ? G.migrate(JSON.parse(raw)) : null;
      } catch (e) { console.warn('Sauvegarde illisible', e); return null; }
    },

    wipe() { try { localStorage.removeItem(G.Data.config.saveKey); } catch (e) { /* ignore */ } },

    /** Texte d'export (JSON encodé en base64, préfixé pour la validation). */
    exportString() {
      G.state.lastSeen = Date.now();
      return PREFIX + btoa(unescape(encodeURIComponent(JSON.stringify(G.state))));
    },

    /** Parse un texte d'export. Retourne l'état migré ou lance une Error. */
    parseExport(text) {
      text = String(text || '').trim();
      if (!text.startsWith(PREFIX)) throw new Error("Ce texte n'est pas une sauvegarde valide.");
      let obj;
      try { obj = JSON.parse(decodeURIComponent(escape(atob(text.slice(PREFIX.length))))); }
      catch (e) { throw new Error('Sauvegarde corrompue ou incomplète.'); }
      const s = G.migrate(obj);
      if (!s) throw new Error('Sauvegarde incompatible (classe inconnue).');
      return s;
    },

    startAutosave() {
      setInterval(() => Save.save(), G.Data.config.autosaveSeconds * 1000);
      document.addEventListener('visibilitychange', () => { if (document.hidden) Save.save(); });
      window.addEventListener('pagehide', () => Save.save());
    },
  });
})();
