# Dofus Idle (projet de fan non officiel et non commercial)

Jeu idle/incrémental dans le navigateur, inspiré de *Melvor Idle* et *Milky Way Idle*, dans l'univers de **Dofus** :
une équipe de 4 personnages combat en groupe, récolte, fabrique son équipement… même quand tu n'es pas là.
HTML + CSS + JavaScript vanilla, aucun backend : fonctionne sur **GitHub Pages** (ou en ouvrant `index.html`).

> DOFUS est une marque d'Ankama, tous droits réservés. Les images appartiennent à Ankama.

## Lancer / publier
- Local : ouvrir `index.html`, ou `python3 -m http.server` puis http://localhost:8000
- GitHub Pages : *Settings → Pages → Deploy from a branch →* branche + dossier `/ (root)`.

## Images à fournir
Le jeu n'embarque aucune image : il lit les fichiers du dossier `assets/`. **Si un fichier manque, une silhouette colorée avec le nom s'affiche** (rien ne casse).
Raccourci : `node tools/telecharger-images.js` (Node 18+) télécharge depuis DofusDB tous les sprites de monstres et toutes les icônes d'objets listés ci-dessous. Les 4 sprites de classes sont à fournir toi-même.

Les sprites peuvent avoir n'importe quelle taille : ils sont affichés à hauteur fixe, largeur automatique, alignés par le bas.

### Sprites de classes (à fournir : PNG transparent)

| Fichier | Classe |
|---|---|
| `assets/classes/cra.png` | Crâ |
| `assets/classes/iop.png` | Iop |
| `assets/classes/feca.png` | Féca |
| `assets/classes/pandawa.png` | Pandawa |

### Sprites de monstres (nom = identifiant DofusDB du monstre)

| Fichier | Monstre |
|---|---|
| `assets/monstres/101.png` | Bouftou |
| `assets/monstres/134.png` | Boufton blanc |
| `assets/monstres/149.png` | Boufton noir |
| `assets/monstres/148.png` | Chef de Guerre Bouftou |
| `assets/monstres/98.png` | Tofu |
| `assets/monstres/79.png` | Pissenlit diabolique |
| `assets/monstres/78.png` | Rose démoniaque |
| `assets/monstres/52.png` | Arakne |

### Icônes d'objets et de ressources (nom = identifiant d'image DofusDB)

| Fichier | Objet |
|---|---|
| `assets/objets/38017.png` | Bois de Frêne |
| `assets/objets/38086.png` | Bois de Châtaignier |
| `assets/objets/38095.png` | Bois de Noyer |
| `assets/objets/57056.png` | Laine de Bouftou |
| `assets/objets/15499.png` | Sang de Bouftou |
| `assets/objets/47055.png` | Corne de Boufton |
| `assets/objets/57210.png` | Laine de Boufton Noir |
| `assets/objets/57209.png` | Laine du Chef de Guerre Bouftou |
| `assets/objets/53014.png` | Plume de Tofu |
| `assets/objets/15489.png` | Cocon de Ver à Soie |
| `assets/objets/35018.png` | Fleur de Pissenlit Diabolique |
| `assets/objets/15635.png` | Engrais |
| `assets/objets/35020.png` | Pétale de Rose Démoniaque |
| `assets/objets/15634.png` | Bave de Rose Démoniaque |
| `assets/objets/103035.png` | Patte d'Arakne |
| `assets/objets/103392.png` | Patte d'Arakne Magique |
| `assets/objets/16041.png` | Coiffe du Bouftou |
| `assets/objets/17044.png` | Cape Bouffante |
| `assets/objets/16128.png` | Kaskofu |
| `assets/objets/17097.png` | Cape du Tofu |
| `assets/objets/2001.png` | Arc de Boisaille |
| `assets/objets/4001.png` | Bâton de Boisaille |
| `assets/objets/3008.png` | Baguette de Boisaille |
| `assets/objets/2015.png` | Arc Sifflant |
| `assets/objets/6007.png` | Épée de Boisaille |
| `assets/objets/6002.png` | Épée de Fouraille |
| `assets/objets/3058.png` | Baguette du Tofu |
| `assets/objets/4045.png` | La Plantouze des Champs |
| `assets/objets/11026.png` | Boufbottes |
| `assets/objets/10029.png` | Ceinture du Bouftou |
| `assets/objets/9044.png` | Anneau de Bouze le Clerc |
| `assets/objets/1048.png` | Amulette du Bouftou |
| `assets/objets/9100.png` | Anneau du Tofu |
| `assets/objets/1073.png` | Amulette des Champs |
| `assets/objets/9065.png` | Anneau Champêtre |
| `assets/objets/11050.png` | Bottes Champêtres |
| `assets/objets/10064.png` | Ceinture Fleurie |
| `assets/objets/9076.png` | Araknoton |
| `assets/objets/10073.png` | Araknoture |
### Décors (optionnels)
`assets/decors/plaine_bouftous.jpg` et `assets/decors/champs_astrub.jpg` : fond de la scène de combat (par-dessus le décor CSS intégré). Le chemin se règle par zone dans `js/data/zones.js` (champ `decor`).

## Arborescence
```
index.html                 page unique (ordre de chargement des scripts)
css/style.css              thème sombre chaud, responsive mobile
assets/                    classes/ monstres/ objets/ decors/   ← tes images
js/
  data/                    ── CONTENU (à éditer pour ajouter du contenu)
    config.js              constantes d'équilibrage globales + éléments
    spells.js              sorts (dégâts, soins, boucliers, affaiblissements)
    classes.js             classes : stats de base / par niveau, sorts par priorité
    items.js               emplacements, stats, objets (ressources + équipements)
    monsters.js            monstres + tables de drop (%)
    zones.js               zones, monstres qui y apparaissent (poids), décor
    jobs.js                métiers + ressources récoltables
    recipes.js             recettes de craft
    dungeons.js / runes.js (vides, prévus pour la suite)
  core/                    ── MOTEUR
    namespace.js           objet global Game, utilitaires, bus d'événements, chemins d'images
    formulas.js            formules d'XP / dégâts / soins / boucliers / temps de récolte
    state.js               état de jeu + migration des sauvegardes
    save.js                localStorage, autosave 30 s, export / import
    engine.js              boucle : UNE activité à la fois pour toute l'équipe
  systems/                 ── LOGIQUE DE JEU
    team.js                stats effectives de chaque personnage (classe + niveau + équipement)
    inventory.js           inventaire partagé, instances d'équipement, vente, équiper
    rewards.js             XP / niveaux, kamas, drops (+ journal + récapitulatif hors-ligne)
    combat.js gathering.js crafting.js    les 3 activités possibles
    offline.js             progression hors-ligne (plafond 12 h)
    breaking.js forgemagie.js dungeons.js  squelettes (à venir)
  ui/                      ── INTERFACE
    ui.js                  routeur, helpers (sprites, icônes, barres), barre du haut, journal
    scene.js               scène de combat en bandeau + animations
    view-*.js              un fichier par écran (Combat, Métiers, Inventaire, Équipe, Paramètres)
    modals.js              création de l'équipe, récapitulatif de retour
  main.js                  démarrage et boucle de jeu
tools/
  load.js                  charge la logique dans Node (sans UI)
  balance.js               `node tools/balance.js 1,10,20` : combats / défaites / XP par heure
  telecharger-images.js    télécharge les images DofusDB référencées par les données
```

## Ajouter du contenu (sans toucher à la logique)
- **Monstre** : un bloc dans `monsters.js` (`dofusdbId` = id du monstre sur DofusDB → sprite `assets/monstres/<id>.png`), puis `{ id, weight }` dans une zone (`zones.js`).
- **Zone** : un bloc dans `zones.js`. **Objet / équipement** : `items.js` (`icone` = fichier dans `assets/objets/`).
- **Recette** : `recipes.js`. **Ressource récoltable** : `jobs.js`. **Sort** : `spells.js`. **Classe** : `classes.js` + `assets/classes/<id>.png`.
- Au chargement, la console signale les références cassées (`[data] drop inconnu…`).

## Prévu pour la suite (déjà préparé dans le code)
- Les équipements sont des **instances** `{uid, id, mods}` : `mods` accueillera les bonus de forgemagie (déjà additionnés par `Inventory.instanceStats`). `state.runes` et `state.dungeons` sont réservés.
- Moteur extensible : une nouvelle activité = `Game.Engine.register('type', système)` (`begin/end/interval/tick/describe/barInfo`). Un nouvel écran = `Game.UI.registerView({...})`.

## Formules d'équilibrage
Constantes : `js/data/config.js` · formules : `js/core/formulas.js` · IA : `js/systems/combat.js`.

| Sujet | Formule |
|---|---|
| Stats d'un personnage | `base + gain/niveau × (niveau-1) + équipement` (vit = PV max, résistances plafonnées à 75 %) |
| Élément ↔ stat | Terre ↔ Force · Feu ↔ Intelligence · Eau ↔ Chance · Air ↔ Agilité (Crâ = Air, Iop = Terre, Féca = Feu, Pandawa = Eau) |
| Valeur d'un sort (dégât, soin, bouclier) | `puissance × (1 + 5 % × (niveau-1)) × (1 + stat de l'élément / 100)` |
| Dégâts sur un monstre | valeur du sort × (1 ± 10 %) × `(1 − rés. de l'élément du monstre / 100)` |
| Dégâts d'un monstre | `rand(min, max) × (1 − débuff) × (1 − rés. de l'élément / 100)` |
| Soin / bouclier | soin plafonné aux PV manquants ; bouclier absorbe d'abord, dure `duration` actions de la cible, non cumulable (on garde le plus grand) |
| Affaiblissement (Pandawa) | −30 % de dégâts de l'ennemi pendant 3 de ses actions |
| Ordre de jeu | initiative décroissante (fixée au début du combat), 1 action / seconde ; recharge d'un sort = nombre d'actions de son lanceur |
| IA des sorts | dans l'ordre de la classe : soin si un allié < 50 % PV · bouclier si un allié n'en a pas (donc en début de combat) · affaiblissement si un ennemi ne l'est pas · dégâts sinon (zone seulement si ≥ 2 ennemis) |
| Groupes | taille 1/2/3/4 tirée avec poids 15/30/35/20, monstres tirés selon le poids de la zone, 1 « rare » maximum |
| Défaite de l'équipe | repos de 8 s (régénération progressive) puis nouveau groupe. Après une victoire : alliés tombés relevés à 30 % PV, +10 % PV max pour tous |
| XP | total du groupe ÷ 4, puis `× max(0,1 ; 1 − 0,08 × (niv. perso − niv. moyen des monstres − 5)) × (1 + Sagesse %)` |
| XP du niveau L → L+1 | `floor(base × croissance^(L-1))` : personnages 70 × 1,20, métiers 45 × 1,15 |
| Kamas | somme des tirages uniformes `[min, max]` de chaque monstre |
| Drops | chaque ligne `drops` tirée indépendamment : `chance` en %, quantité uniforme `[min, max]` |
| Récolte | temps `= base × max(0,5 ; 1 − 0,005 × (niv. métier − 1))` ; chance de récolte ×2 = `0,4 % × niv. métier` |
| XP de métier | `xp × max(0,1 ; 1 − 0,08 × (niv. métier − niv. requis − 6))` |
| Hors-ligne | simulation identique au jeu en direct, plafonnée à 12 h (`offlineCapHours`) |

Pour régler : `node tools/balance.js 1,10,20 2` donne, par niveau et par zone (équipe sans équipement), les combats, défaites, XP et kamas par heure.
