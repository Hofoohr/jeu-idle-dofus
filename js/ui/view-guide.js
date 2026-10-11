/* ==========================================================================
   Écran Guide : explique les mécaniques du jeu. Les chiffres sont lus dans
   Game.Data.config : si tu rééquilibres le jeu, le guide reste exact.
   ========================================================================== */
(function () {
  'use strict';
  const G = Game, U = G.util, UI = G.UI;

  function html() {
    const c = G.Data.config, cb = c.combat, b = c.charBase, f = (n, d = 1) => U.fmtDec(n, d);
    const sec = (title, body, open) => `<details ${open ? 'open' : ''}><summary>${title}</summary><div class="gbody">${body}</div></details>`;
    const sp = G.spells.epee_divine, ex = { stat: 45, dmg: 3, res: -10 };
    const exBase = sp.power * (cb.statOffset + ex.stat) / 100, exRaw = exBase + ex.dmg, exFinal = exRaw * (1 - ex.res / 100);
    const spd = (init) => cb.speedBase + init * cb.speedPerInit, secs = (init) => cb.atbMax / spd(init) * cb.tickSeconds;
    const classes = G.Data.classes.map((k) => `<tr><td><b>${k.name}</b></td><td>${k.role}</td><td>${G.Data.weaponTypes[k.weapon]}</td>
      <td>${G.Data.elements[{ force: 'terre', agi: 'air', intel: 'feu', chance: 'eau' }[k.mainStat]].icon} ${G.Data.statLabels[k.mainStat].name}</td></tr>`).join('');

    return `<h2>Guide du jeu</h2>
    <p class="muted">Dofus Idle est un jeu <b>idle</b> : tout se déroule tout seul, même onglet fermé (jusqu'à ${c.offlineCapHours} h). Ton rôle : composer l'équipe, répartir les points, régler les priorités de sorts, équiper et fabriquer.</p>
    <div class="guide">
    ${sec('🎯 La boucle de jeu', `<ol>
      <li><b>Combattre</b> des groupes de monstres avec ton équipe de ${c.teamSize} pour gagner de l'XP, des kamas et des ressources.</li>
      <li><b>Récolter</b> du bois (Bûcheron) et <b>fabriquer</b> des équipements (Tailleur, Sculpteur) avec ces ressources.</li>
      <li><b>Équiper</b> tes personnages pour devenir plus fort et affronter des zones plus dures.</li>
      <li class="muted">À venir : brisage des équipements en runes, forgemagie, donjons.</li></ol>
      <p><b>Une seule activité à la fois</b> pour toute l'équipe : combattre <i>ou</i> exercer un métier. Lancer une activité arrête la précédente. L'activité en cours, sa barre de progression et le journal sont en bas de l'écran.</p>`, true)}

    ${sec('🧭 Les onglets', `<ul>
      <li><b>Combat</b> : la scène (équipe à gauche, monstres à droite), le choix de la zone, les fiches des monstres (PV, attaque, résistances, faiblesses, drops en %).</li>
      <li><b>Métiers</b> : récolte et fabrication. Les métiers sont <u>communs au compte</u>.</li>
      <li><b>Inventaire</b> : ressources et équipements, partagés par toute l'équipe ; vente en kamas.</li>
      <li><b>Équipe</b> : un onglet par personnage : équipement, points à répartir, priorité des sorts.</li>
      <li><b>Guide</b> : cette page.</li>
      <li><b>Paramètres</b> : sauvegarde (auto toutes les ${c.autosaveSeconds} s), export / import, réinitialisation.</li>
      <li><b>Debug</b> : outils de test (se donner des objets, de l'XP, des kamas, fixer le niveau ; commandes <code>/give</code>, <code>/xp</code>, <code>/level</code>, <code>/kamas</code>).</li></ul>`, false)}

    ${sec('👥 L\'équipe et les classes', `<p>Tu composes une équipe de ${c.teamSize} personnages (plusieurs de la même classe sont possibles). <b>Toutes les classes ont exactement les mêmes caractéristiques</b> : elles diffèrent par leurs <b>sorts</b>, leur <b>arme</b> et leur <b>élément</b>.</p>
      <table><tr><th>Classe</th><th>Rôle</th><th>Arme</th><th>Caractéristique conseillée</th></tr>${classes}</table>
      <p>Chaque personnage a son propre niveau, ses propres caractéristiques et son propre équipement. L'XP d'un combat est <b>partagée</b> entre les ${c.teamSize} personnages (même ceux tombés au combat).</p>`, false)}

    ${sec('📈 Niveaux et caractéristiques', `<ul>
      <li><b>Niveau 1</b> : ${b.vit} PV, 0 en force / agilité / intelligence / chance, 0 en sagesse et en dommages, <b>0 % de résistance</b>.</li>
      <li><b>À chaque niveau</b> : +${b.vitPerLevel} vitalité (PV) et <b>+${b.pointsPerLevel} points à répartir</b> librement entre <b>force, agilité, intelligence et chance</b>.</li>
      <li>Dans l'onglet Équipe, utilise +1 / +5, ou choisis une <b>répartition automatique</b> (par défaut dans la caractéristique de la classe) pour que les points soient placés tout seuls à chaque niveau, même quand tu es absent. « Réinitialiser » rend tous les points, gratuitement.</li>
      <li><b>Résistances, Sagesse, Dommages, Initiative bonus</b> et caractéristiques supplémentaires viennent <u>uniquement des objets</u>.</li>
      <li><b>Sagesse</b> : +${cb.sagesseXpPct} % d'XP par point.</li>
      <li>Courbe d'XP exponentielle : il faut <code>${c.xp.char.base} × ${c.xp.char.growth}^(niveau−1)</code> XP pour passer au niveau suivant (personnages) ; <code>${c.xp.job.base} × ${c.xp.job.growth}^(niveau−1)</code> pour les métiers. Niveau maximum : ${c.maxCharLevel}.</li>
      <li><b>XP réduite</b> : si ton niveau dépasse de plus de ${cb.levelXpPenalty.graceLevels} niveaux celui des monstres, l'XP baisse de ${Math.round(cb.levelXpPenalty.perLevel * 100)} % par niveau d'écart (minimum ${Math.round(cb.levelXpPenalty.min * 100)} %). Il faut changer de zone pour progresser.</li></ul>`, false)}

    ${sec('🔥 Éléments, dégâts et résistances', `<p>Chaque sort a un <b>élément</b>, lié à une caractéristique :</p>
      <table><tr><th>Élément</th><th>Caractéristique</th><th>Résistance</th></tr>
      ${Object.keys(G.Data.elements).map((k) => `<tr><td>${G.Data.elements[k].icon} ${G.Data.elements[k].name}</td><td>${G.Data.statLabels[G.Data.elements[k].stat].name}</td><td>${G.Data.statLabels[G.Data.elements[k].res].name}</td></tr>`).join('')}</table>
      <p><b>Dégâts d'un sort</b> :</p>
      <span class="ex">dégâts = <b>base</b> × (${cb.statOffset} + <b>caractéristique associée</b> + <b>Puissance</b>) / 100 + <b>Dommages</b> + <b>Dommages de l'élément</b><br>× ${cb.critMultiplier} en cas de <b>coup critique</b> (chance = stat Critiques, en %)<br>puis × (1 − <b>résistance</b> du monstre à l'élément / 100)</span>
      <p>Exemple : un Iop avec ${ex.stat} en Force et ${ex.dmg} Dommages lance <i>${sp.name}</i> (base ${sp.power}) sur un monstre qui a ${ex.res} % de résistance Terre (une <b>faiblesse</b>) :</p>
      <span class="ex">${sp.power} × ${f((cb.statOffset + ex.stat) / 100, 2)} = ${f(exBase)} · + ${ex.dmg} = ${f(exRaw)} · × ${f(1 - ex.res / 100, 2)} = <b>≈ ${Math.round(exFinal)} dégâts</b></span>
      <ul><li>Une résistance <b>positive</b> réduit les dégâts (plafonnée à ${cb.resistCap} %), une résistance <b>négative</b> (faiblesse, en vert sur les fiches monstres) les augmente. Choisis tes éléments en fonction des monstres !</li>
      <li>Soins et boucliers utilisent la même formule ; les soins ajoutent la stat <b>Soins</b>, les boucliers n'ajoutent rien.</li>
      <li>Les attaques des monstres ont aussi un élément : tes résistances (objets) s'appliquent. Les dégâts varient aléatoirement de ±${Math.round(cb.damageVariance * 100)} %.</li></ul>`, false)}

    ${sec('✨ Les sorts et leurs priorités', `<ul>
      <li>Chaque classe a <b>5 sorts</b> : 3 au niveau 1, un 4<sup>e</sup> au niveau 5, un 5<sup>e</sup> au niveau 10. Ce sont de <b>vrais sorts de Dofus Unity</b> (nom, icône, élément et dégâts de base du niveau 1) ; la <b>recharge</b> est adaptée au combat automatique, et les effets de soutien (Rempart, Bouclier Féca, Lait de Bambou, Souillure) sont adaptés en boucliers, soin et affaiblissement (une note l'indique sur chaque sort).</li>
      <li>Un sort est une <b>attaque de base</b> (sans recharge, toujours disponible) ou un sort à <b>recharge</b> (nombre d'actions du lanceur avant de pouvoir le relancer).</li>
      <li>Types : <b>dégâts</b> (sur une cible ou <b>de zone</b>), <b>soin</b>, <b>bouclier</b> (absorbe des dégâts avant les PV, dure quelques actions), <b>affaiblissement</b> (réduit les dégâts d'un ennemi).</li>
      <li><b>Priorité</b> : dans l'onglet Équipe, classe les sorts avec ▲ ▼. À chaque action, le personnage lance le sort <u>le mieux classé qui est prêt</u>. Un sort est « prêt » si sa recharge est finie <b>et</b> qu'il est utile :
        <ul><li>soin : un allié est sous ${Math.round(cb.healThreshold * 100)} % de PV ;</li><li>bouclier : un allié n'en a pas (donc surtout en début de combat) ;</li><li>affaiblissement : un ennemi n'est pas déjà affaibli ;</li><li>zone : il y a au moins 2 ennemis.</li></ul></li>
      <li>L'écran Équipe montre pour chaque sort ses <b>dégâts de base</b> et ses <b>dégâts estimés</b> avec tes caractéristiques actuelles (avant résistances de l'ennemi).</li>
      <li>Astuce : si tu places l'attaque de base en première position, elle sera toujours lancée et les autres sorts ne le seront jamais.</li></ul>`, false)}

    ${sec('⚡ Initiative et barre d\'attaque', `<ul>
      <li><b>Initiative</b> = force + intelligence + agilité + chance + initiative bonus des objets. Les monstres ont une valeur d'initiative fixe.</li>
      <li>Chaque combattant (personnage ou monstre) a une <b>barre d'attaque</b> (la fine barre jaune sous sa barre de vie). À chaque tick (${cb.tickSeconds} s) elle gagne <code>${cb.speedBase} + initiative × ${cb.speedPerInit}</code>.</li>
      <li>Quand la barre atteint <b>${cb.atbMax}</b>, le combattant agit (la barre perd ${cb.atbMax}).</li>
      <li>Si plusieurs combattants atteignent ${cb.atbMax} au même tick, celui qui <b>dépasse le plus</b> ${cb.atbMax} agit en premier ; les autres agissent au tick suivant.</li>
      <li>Exemples : initiative 0 → 1 action toutes les <b>${f(secs(0))} s</b> ; initiative 100 → 1 action toutes les <b>${f(secs(100))} s</b>. Monter l'initiative donne donc plus d'actions, donc plus de dégâts, de soins et de boucliers.</li></ul>`, false)}

    ${sec('⚔️ Le combat', `<ul>
      <li>Les monstres arrivent en <b>groupes de 1 à 4</b>. Dans une zone, chaque monstre a un pourcentage d'apparition ; les monstres <b>rares</b> (ex. Chef de Guerre Bouftou) sont limités à un par groupe.</li>
      <li>Les monstres attaquent un personnage <b>au hasard</b> parmi ceux encore debout.</li>
      <li><b>Victoire</b> : XP partagée, kamas, et chaque monstre lance ses <b>drops</b> (chaque ligne est tirée indépendamment selon son pourcentage). Les alliés tombés se relèvent avec ${Math.round(cb.reviveHpPct * 100)} % de PV et tout le monde récupère ${Math.round(cb.healAfterFight * 100)} % de ses PV max.</li>
      <li><b>Défaite</b> (toute l'équipe à terre) : l'équipe se <b>repose ${cb.restSeconds} s</b> en régénérant ses PV, puis reprend les combats.</li>
      <li>Une zone demande un <b>niveau moyen d'équipe</b> minimum pour être débloquée.</li>
      <li>Les chiffres au-dessus des combattants : <span style="color:#ff5a45">rouge = dégâts</span>, <span style="color:#6fe05a">vert = soins</span>, <span style="color:#5ab8ff">bleu = boucliers</span>.</li></ul>`, false)}

    ${sec('🗺️ Les zones', `<p>Trois zones, à débloquer avec le <b>niveau moyen de l'équipe</b> : <b>Prairie des Piou</b> (niveau 1) → <b>Champs d'Astrub</b> (niveau ${G.zones.champs_astrub.minLevel}) → <b>Plaine des Bouftous</b> (niveau ${G.zones.plaine_bouftous.minLevel}). Chaque zone a ses monstres, leurs résistances et faiblesses, et ses butins.</p>
      <ul><li><b>Prairie des Piou</b> : les 6 Piou (Rouge, Bleu, Violet, Rose, Jaune, Vert). Chaque couleur laisse sa panoplie et sa plume.</li>
      <li><b>Champs d'Astrub</b> : panoplies <b>Champêtre</b> et <b>du Paysan</b>.</li>
      <li><b>Plaine des Bouftous</b> : panoplie <b>du Bouftou</b>, dont le Chef de Guerre (monstre rare).</li></ul>`, false)}

    ${sec('🧩 Les panoplies', `<ul>
      <li>Une panoplie est un ensemble d'objets (ex. Panoplie du Piou Rouge). Porter <b>plusieurs pièces de la même panoplie</b> sur un même personnage donne un <b>bonus</b> qui augmente avec le nombre de pièces (2, 3, 4… pièces). Les bonus sont ceux de Dofus Unity ; le palier atteint remplace le précédent.</li>
      <li>Dans l'onglet Équipe, la section <b>Panoplies</b> montre pour chaque panoplie les pièces <b>portées</b> (vives), <b>dans l'inventaire</b> (atténuées) et <b>manquantes</b> (grisées), ainsi que les bonus de chaque palier.</li>
      <li>Bonus non gérés (ignorés) : PA, PM, portée, invocations, dommages neutres, fuite…</li>
      <li>Les stats des objets sont celles de Dofus Unity (jet maximum). Nouvelles stats : <b>Puissance</b> (s'ajoute à la caractéristique), <b>Dommages de l'élément</b>, <b>Critiques</b>, <b>Soins</b>.</li></ul>`, false)}

    ${sec('🪓 Les métiers', `<ul>
      <li>Les métiers sont au niveau du <b>compte</b> (pas par personnage) et partagent l'inventaire.</li>
      <li><b>Bûcheron</b> (récolte) : 3 types de bois débloqués par niveau. Plus le niveau est élevé, plus la récolte est rapide (−${f(c.gathering.speedPerLevel * 100)} % de temps par niveau) et plus la chance de récolte double est grande (+${f(c.gathering.doubleChancePerLevel)} % par niveau).</li>
      <li><b>Tailleur</b> (craft) : coiffes et capes avec des ressources de monstres. Les recettes sont celles de Dofus quand c'est possible (étiquette « adaptée » sinon).</li>
      <li><b>Sculpteur</b> (craft) : arcs, bâtons et baguettes, avec du bois et des plumes de Piou.</li>
      <li>Chaque recette demande un niveau de métier. Fabriquer tourne en boucle tant que tu as les ingrédients.</li>
      <li>Comme pour les monstres, une activité trop facile (niveau du métier bien supérieur au niveau requis) rapporte moins d'XP.</li></ul>`, false)}

    ${sec('🛡️ L\'équipement', `<ul>
      <li>8 emplacements par personnage : <b>coiffe, cape, amulette, anneau, ceinture, bottes, bouclier, arme</b>. L'équipement est <b>affiché en icônes</b> dans la fiche du personnage (il n'est pas dessiné sur le sprite).</li>
      <li>Chaque objet a un <b>niveau requis</b> et des stats : vitalité, force, intelligence, agilité, chance, dommages, sagesse, initiative, résistances.</li>
      <li><b>Armes réservées</b> : arcs pour les Crâ, épées pour les Iop, bâtons pour les Féca, baguettes pour les Pandawa. Les marteaux et les faux sont utilisables par toutes les classes.</li>
      <li>Un objet ne peut être porté que par un personnage à la fois ; équiper un objet déjà porté le déplace.</li>
      <li>Les objets rares tombent des monstres (pourcentage faible), les autres se fabriquent. Tu peux vendre en kamas ce dont tu n'as pas besoin.</li></ul>`, false)}

    ${sec('💾 Hors-ligne et sauvegarde', `<ul>
      <li>La partie est sauvegardée <b>automatiquement toutes les ${c.autosaveSeconds} s</b> dans ton navigateur (localStorage).</li>
      <li>Quand tu reviens après une absence, le jeu <b>simule</b> ce que ton équipe a gagné pendant ton absence (jusqu'à <b>${c.offlineCapHours} h</b>) et affiche un récapitulatif : XP, niveaux, kamas, butin.</li>
      <li>Pense à <b>exporter</b> ta sauvegarde (Paramètres) avant de vider les données du navigateur ou de changer d'appareil.</li></ul>`, false)}
    </div>`;
  }

  UI.registerView({ id: 'guide', name: 'Guide', icon: '📖', events: [], render(el) { el.innerHTML = html(); } });
})();
