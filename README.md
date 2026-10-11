# Dofus Idle (projet de fan, non commercial)

Jeu idle/incrémental dans le navigateur, inspiré de *Melvor Idle* et *Milky Way Idle*, dans l'univers de **Dofus**.
HTML + CSS + JavaScript vanilla, aucun backend : tout est statique et fonctionne sur **GitHub Pages**
(ou en ouvrant simplement `index.html`). Images : [DofusDB](https://dofusdb.fr). Dofus © Ankama Games.

## Lancer / publier
- Local : ouvrir `index.html`, ou `python3 -m http.server` puis http://localhost:8000
- GitHub Pages : *Settings → Pages → Deploy from a branch →* branche + dossier `/ (root)`.

## Arborescence
```
index.html                 page unique (ordre de chargement des scripts)
css/style.css              thème sombre chaud, responsive mobile
js/
  data/                    ── CONTENU (à éditer pour ajouter du contenu)
    config.js              constantes d'équilibrage globales
    classes.js             classes + sorts
    items.js               emplacements, stats, objets (ressources + équipements)
    monsters.js            monstres + tables de drop (%)
    zones.js               zones de combat
    jobs.js                métiers + ressources récoltables
    recipes.js             recettes de craft
    dungeons.js / runes.js (vides, prévus pour la suite)
  core/                    ── MOTEUR
    namespace.js           objet global Game, utilitaires, bus d'événements, URLs d'images
    formulas.js            formules d'XP / dégâts / temps de récolte
    state.js               état de jeu + migration des sauvegardes
    save.js                localStorage, autosave 30 s, export / import
    engine.js              boucle : UNE action active à la fois
  systems/                 ── LOGIQUE DE JEU
    character.js           stats effectives (classe + niveau + équipement)
    inventory.js           ressources, instances d'équipement, vente, équiper
    rewards.js             XP / niveaux, kamas, drops (+ journal + rapport hors-ligne)
    combat.js gathering.js crafting.js    les 3 actions possibles
    offline.js             progression hors-ligne (plafond 12 h)
    breaking.js forgemagie.js dungeons.js  squelettes (à venir)
  ui/                      ── INTERFACE
    ui.js                  routeur, helpers, barre du haut, dock (action + journal)
    view-*.js              un fichier par écran (Combat, Métiers, Inventaire, Équipement, Personnage)
    modals.js              choix de classe, rapport de retour
  main.js                  démarrage et boucle de jeu
tools/
  load.js                  charge la logique dans Node (sans UI)
  balance.js               `node tools/balance.js 1,10,20` : kills / morts / XP par heure
```

## Ajouter du contenu (sans toucher à la logique)
- **Monstre** : un bloc dans `monsters.js` puis son `id` dans la liste d'une zone (`zones.js`).
- **Zone** : un bloc dans `zones.js` (`minLevel` = niveau requis).
- **Objet / équipement** : `items.js`. Icône = `Game.img.item(<id image>)`.
  L'id d'image est dans l'URL `https://api.dofusdb.fr/img/items/<id>.png` (champ `img` de l'API).
  Pour les monstres, utilise bien le champ `img` de l'API (≠ id du monstre).
- **Recette** : `recipes.js`. **Ressource récoltable** : `jobs.js`. **Classe / sort** : `classes.js`.
- Au chargement, la console signale les références cassées (`[data] drop inconnu…`).

## Prévu pour la suite (déjà préparé dans le code)
- Les équipements sont des **instances** `{uid, id, mods}` : `mods` accueillera les bonus de forgemagie
  (déjà additionnés par `Inventory.instanceStats`). `state.runes` et `state.dungeons` sont réservés.
- Moteur extensible : une nouvelle action = `Game.Engine.register('type', système)`
  (`begin/end/interval/tick/describe`). Un nouvel écran = `Game.UI.registerView({...})`.

## Formules d'équilibrage
Toutes les constantes sont dans `js/data/config.js`, les formules dans `js/core/formulas.js`.

| Sujet | Formule |
|---|---|
| XP pour passer de L à L+1 | `floor(base × croissance^(L-1))` — personnage 80 × 1,20, métiers 45 × 1,15 |
| Stats du personnage | `PV = base + PV/niv × (L-1) + équip.` ; `ATK = base + ATK/niv × (L-1)` |
| Dégâts d'un sort | `ATK × coef. sort × (1 ± 10 %) × (1 + %Dommages/100) + Dommages fixes`, ×1,5 si critique, puis `× (1 - rés. monstre/100)` (min 1) |
| Dégâts d'un monstre | `rand(min, max) × (1 - Résistance/100)` (résistance plafonnée à 75 %) |
| Rythme de combat | une action toutes les 1,5 s, joueur puis monstre en alternance ; pause 1 s entre deux monstres ; 6 s de résurrection ; +12 % PV après une victoire |
| Sorts | coefficient (`mult`) et recharge (`cd`, en tours du joueur) ; le 1er sort disponible par ordre de priorité est lancé ; Féca : bouclier = 35 % PV max pendant 3 tours ; Crâ : le monstre perd sa 1re action |
| XP de combat | `xp monstre × max(0,1 ; 1 - 0,08 × (niv. joueur - niv. monstre - 5))` |
| Kamas | tirage uniforme dans `kamas: [min, max]` du monstre |
| Drops | chaque ligne de `drops` est tirée indépendamment : `chance` en %, quantité uniforme `[min, max]` |
| Récolte | temps `= base × max(0,5 ; 1 - 0,005 × (niv. métier - 1))` ; chance de récolte ×2 = `0,4 % × niv. métier` |
| XP de métier | `xp × max(0,1 ; 1 - 0,08 × (niv. métier - niv. requis - 6))` |
| Hors-ligne | simulation à l'identique du jeu en direct, plafonnée à 12 h (`offlineCapHours`) |

Pour régler : `node tools/balance.js` donne, par classe / niveau / monstre, les kills, morts et XP par heure.
