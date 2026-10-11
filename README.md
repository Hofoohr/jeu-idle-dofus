# Dofus Idle (projet de fan non officiel et non commercial)

Jeu idle/incrémental dans le navigateur, inspiré de *Melvor Idle* et *Milky Way Idle*, dans l'univers de **Dofus** :
une équipe de 4 personnages combat en groupe, récolte, fabrique son équipement… même quand tu n'es pas là.
HTML + CSS + JavaScript vanilla, aucun backend : fonctionne sur **GitHub Pages** (ou en ouvrant `index.html`).

> DOFUS est une marque d'Ankama, tous droits réservés. Les images et les données (sorts, objets, panoplies) viennent de DofusDB / Dofus Unity et appartiennent à Ankama.

## Lancer / publier
- Local : ouvrir `index.html`, ou `python3 -m http.server` puis http://localhost:8000
- GitHub Pages : *Settings → Pages → Deploy from a branch →* branche + dossier `/ (root)`.

## Données Dofus Unity (DofusDB)
Les **sorts**, **objets**, **bonus d'objets**, **panoplies**, **recettes** et **tables de drop** viennent de DofusDB (Dofus Unity).
`node tools/importer-dofusdb.js` (Node 18+) les télécharge et régénère `js/data/dofusdb-data.js` (fichier **généré**, déjà commité : tu n'as pas besoin de le relancer pour jouer).
Les fichiers de `js/data/` choisissent ensuite ce qu'on utilise et l'adaptent au jeu idle.

## Images
Le jeu lit les fichiers du dossier `assets/`. **Si un fichier manque, une silhouette colorée (sprites) ou des initiales (icônes) s'affichent** : rien ne casse.
`node tools/telecharger-images.js` télécharge depuis DofusDB (déjà fait et commité) :
- `assets/monstres/<dofusdbId>.png` : sprite de chaque monstre (id du monstre sur DofusDB : 489 Piou Rouge, 101 Bouftou…) ;
- `assets/objets/<id image>.png` : icône de chaque objet et ressource (ex. `16041.png`) ;
- `assets/sorts/sort_<id>.png` : icône de chaque sort.

**À fournir toi-même :**

| Fichier | Contenu |
|---|---|
| `assets/classes/cra.png`, `iop.png`, `feca.png`, `pandawa.png` | sprite de chaque classe (PNG transparent, pieds au bord bas de l'image, de face / trois-quarts) |
| `assets/decors/prairie_piou.png` *(optionnel)* | fond de scène de la Prairie des Piou |
| `assets/decors/champs_astrub.png`, `plaine_bouftous.png` | fonds de scène (déjà fournis) |

Les sprites peuvent avoir n'importe quelle taille : ils sont affichés à hauteur fixe, largeur automatique, alignés par le bas. Les décors peuvent être de simples bandeaux étroits.

## Arborescence
```
index.html                 page unique (ordre de chargement des scripts)
css/style.css              thème sombre chaud, responsive mobile
assets/                    classes/ monstres/ objets/ sorts/ decors/
js/
  data/                    ── CONTENU (à éditer pour ajouter du contenu)
    config.js              constantes d'équilibrage globales + éléments
    dofusdb-data.js        GÉNÉRÉ : données brutes DofusDB (sorts, objets, panoplies, monstres)
    spells.js              les 20 sorts Unity utilisés (recharge, zone, adaptations)
    classes.js             classes : arme réservée, sorts (déblocage, priorité par défaut)
    items.js               emplacements, stats, ressources et équipements (depuis DofusDB)
    sets.js                panoplies et leurs bonus
    monsters.js            monstres, stats de combat, résistances, tables de drop (vraies %)
    zones.js               Piou → Champs → Bouftous
    jobs.js recipes.js     métiers, ressources récoltables, recettes de craft
    dungeons.js runes.js   (vides, prévus pour la suite)
  core/                    ── MOTEUR
    namespace.js           objet global Game, utilitaires, bus d'événements, chemins d'images
    formulas.js            formules d'XP / dégâts / soins / critiques / barre d'attaque
    state.js save.js engine.js
  systems/                 ── LOGIQUE DE JEU
    team.js                caractéristiques, points, priorités de sorts, panoplies actives, stats
    inventory.js rewards.js combat.js gathering.js crafting.js offline.js
    debug.js               outils de test (/give, /xp, /level, /kamas)
    breaking.js forgemagie.js dungeons.js  squelettes (à venir)
  ui/                      ── INTERFACE (scene.js = scène de combat, view-*.js = écrans, modals.js)
  main.js                  démarrage et boucle de jeu
tools/
  importer-dofusdb.js      importe les données DofusDB -> js/data/dofusdb-data.js
  telecharger-images.js    télécharge les images DofusDB référencées par les données
  balance.js               `node tools/balance.js 1,10,20` : combats / défaites / XP par heure
  load.js                  charge la logique dans Node (sans UI)
```

## Ajouter du contenu
- **Objet / panoplie / sort / monstre de Dofus** : ajoute son id dans les listes en tête de `tools/importer-dofusdb.js`, relance l'import, puis déclare-le dans `items.js` (`equip(id)` / `resource(...)`), `sets.js`, `spells.js` (`unity(id, {…})`) ou `monsters.js` (`drop(id)` reprend la vraie table de drop). Les ids DofusDB se trouvent dans les URL de https://dofusdb.fr.
- **Zone** : un bloc dans `zones.js`. **Recette** : `recipes.js`. **Ressource récoltable** : `jobs.js`. **Classe** : `classes.js` + `assets/classes/<id>.png`.
- Au chargement, la console signale les références cassées (`[data] drop inconnu…`).

## Règles du jeu et formules d'équilibrage
Constantes : `js/data/config.js` · formules : `js/core/formulas.js` · combat et IA : `js/systems/combat.js`.

| Sujet | Règle |
|---|---|
| Personnages | **Toutes les classes ont les mêmes caractéristiques** : niveau 1 = 50 PV et 0 partout, **0 % de résistance**. À chaque niveau : +5 PV et +5 points à répartir entre force, agilité, intelligence et chance (manuellement ou automatiquement). Tout le reste (résistances, puissance, dommages, critiques, soins, sagesse, initiative bonus) vient **des objets et des panoplies**. |
| Éléments | Terre ↔ Force · Feu ↔ Intelligence · Eau ↔ Chance · Air ↔ Agilité. Chaque sort a un élément, donc une caractéristique associée. |
| Dégâts d'un sort | `base × (100 + caractéristique associée + Puissance) / 100 + Dommages + Dommages de l'élément`, ×1,5 si critique (chance = stat Critiques en %), puis × `(1 − résistance du monstre à l'élément / 100)` (résistance négative = faiblesse). ±10 % de variance. `base` = moyenne des dés du sort de Dofus Unity au niveau 1. |
| Soin / bouclier | `base × (100 + caractéristique + Puissance) / 100` (+ Soins pour les soins). Un bouclier absorbe d'abord, dure N actions de la cible, non cumulable. |
| Sorts | 5 vrais sorts Unity par classe : 3 au niveau 1, un au niveau 5, un au niveau 10. Une attaque de base sans recharge ; les autres ont une recharge (en actions du lanceur, adaptée au jeu). Le joueur règle la **priorité** (écran Équipe) : parmi les sorts prêts (recharge finie ET utiles : soin si un allié < 50 % PV, bouclier si un allié n'en a pas, affaiblissement si un ennemi ne l'est pas, zone s'il y a ≥ 2 ennemis), le mieux classé est lancé. |
| Initiative | `force + intelligence + agilité + chance + initiative bonus des objets` (monstres : champ `init`). |
| Barre d'attaque | Chaque tick (0,1 s), la barre de chaque combattant gagne `40 + initiative × 0,2`. À 1000, il agit (la barre perd 1000). Si plusieurs sont prêts au même tick, celui qui dépasse le plus 1000 agit en premier, les autres attendent le tick suivant. |
| Panoplies | Bonus selon le nombre de pièces portées par le **même personnage** (palier atteint, valeurs Unity). |
| Dégâts d'un monstre | `rand(min, max) × (1 − affaiblissement) × (1 − résistance du perso à l'élément / 100)` |
| Groupes | taille 1/2/3/4 tirée avec poids 15/30/35/20, monstres tirés selon le poids de la zone, 1 « rare » maximum |
| Défaite / victoire | Défaite : repos de 8 s (régénération progressive) puis nouveau groupe. Victoire : alliés tombés relevés à 30 % PV, +10 % PV max pour tous. |
| XP | total du groupe ÷ 4, puis `× max(0,1 ; 1 − 0,08 × (niv. perso − niv. moyen des monstres − 5)) × (1 + Sagesse %)` ; courbe `70 × 1,2^(niveau−1)` (métiers `45 × 1,15^(niveau−1)`) |
| Kamas / drops | tirages uniformes `[min, max]` ; chaque ligne de `drops` tirée indépendamment (`chance` en %, valeurs réelles de DofusDB) |
| Métiers | Récolte : temps `base × max(0,5 ; 1 − 0,005 × (niv−1))`, récolte double `0,4 % × niv`. XP de métier réduite si l'action est trop facile. |
| Hors-ligne | simulation identique au jeu en direct, plafonnée à 12 h (`offlineCapHours`) |

Bonus d'objets de Dofus non gérés (ignorés) : PA, PM, portée, invocations, dommages neutres, fuite. Les stats de combat des monstres (PV, dégâts, XP) sont celles du jeu idle, pas celles de Dofus.

Pour régler : `node tools/balance.js 1,10,20 2` donne, par niveau et par zone (équipe **sans équipement**, points répartis automatiquement), les combats, défaites, XP et kamas par heure.
