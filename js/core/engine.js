/* ==========================================================================
   Moteur : UNE seule action active à la fois (comme Melvor).
   Chaque système d'action s'enregistre avec Game.Engine.register(type, système)
   et implémente :
     begin(action)      – initialisation (optionnel)
     end(action)        – nettoyage (optionnel)
     interval(action)   – durée (s) avant le prochain tick
     tick(action)       – exécute un pas (peut appeler Engine.stop())
     describe(action)   – { title, sub } pour l'affichage
     barInfo(action)    – (optionnel) { ratio, text } pour la barre d'activité
   Ajouter les donjons plus tard = register('dungeon', …), rien d'autre à changer.
   ========================================================================== */
(function () {
  'use strict';
  const G = Game;

  const Engine = (G.Engine = {
    systems: {},
    timer: 0,        // secondes écoulées dans le tick courant

    register(type, system) { this.systems[type] = system; },

    current() { return G.state && G.state.action ? G.state.action : null; },
    system() { const a = this.current(); return a ? this.systems[a.type] : null; },

    start(action) {
      if (!this.systems[action.type]) return;
      this.stop(true);
      G.state.action = action;
      this.timer = 0;
      const sys = this.systems[action.type];
      if (sys.begin) sys.begin(action);
      G.emit('action');
    },

    stop(quiet) {
      const a = this.current();
      if (a) {
        const sys = this.systems[a.type];
        if (sys && sys.end) sys.end(a);
        G.state.action = null;
      }
      this.timer = 0;
      if (!quiet) G.emit('action');
    },

    /** Avance la simulation de `dt` secondes (temps réel ou hors-ligne). */
    advance(dt) {
      let t = this.timer + dt, guard = 0;
      while (G.state.action && guard++ < 400000) {
        const sys = this.systems[G.state.action.type];
        const iv = sys.interval(G.state.action);
        if (t < iv) break;
        t -= iv;
        sys.tick(G.state.action);
      }
      this.timer = G.state.action ? t : 0;
    },

    /** Progression 0..1 du tick en cours (pour les barres). */
    progress() {
      const a = this.current();
      if (!a) return 0;
      const iv = this.systems[a.type].interval(a);
      return Math.min(1, this.timer / iv);
    },

    /** Reprend l'action sauvegardée (au chargement). */
    resume() {
      const a = this.current();
      if (!a) return;
      const sys = this.systems[a.type];
      if (!sys || (sys.valid && !sys.valid(a))) { G.state.action = null; return; }
      this.timer = 0;
      if (sys.begin) sys.begin(a);
    },
  });
})();
