# CRUZZLE — Play with your pictures

Jeu de puzzle photo : les vignettes d'une photo sont mélangées **et transformées**
(rotations 90°/180°/270°, miroirs, flou, pixelisation, noir et blanc, négatif).
Le joueur doit reconstituer la photo en échangeant les vignettes et en annulant
leurs transformations, le tout animé en CSS.

## Lancer le jeu

Aucune dépendance, aucun serveur nécessaire : ouvrir simplement `index.html`
dans un navigateur (double-clic, ou `open index.html` sur macOS).

## PWA — installation sur smartphone

L'appli est une **Progressive Web App** : installable sur l'écran d'accueil,
plein écran, et jouable **hors ligne** (fichiers : `manifest.json`, `sw.js`, `icons/`).

- **Test local** : `python3 -m http.server 8000` puis ouvrir `http://localhost:8000`
  (le service worker exige HTTP(S) ; `localhost` compte comme sécurisé).
- **Mise en ligne** (obligatoirement en HTTPS) : GitHub Pages, Netlify ou
  Cloudflare Pages — il suffit de publier le dossier tel quel.
- **Installation** : sur Android/Chrome, bannière ou menu « Installer l'application » ;
  sur iPhone/Safari, bouton Partager → « Sur l'écran d'accueil ».
- **Mises à jour** : après toute modification des fichiers, incrémenter la
  constante `CACHE` dans `sw.js` (`cruzzle-v1` → `cruzzle-v2`…) pour que les
  utilisateurs déjà installés reçoivent la nouvelle version.

## Langues

Interface disponible en **anglais** (par défaut), **français**, **espagnol** et
**allemand** : sélecteur en haut de l'écran d'accueil. Au premier lancement, la
langue du navigateur est détectée si elle fait partie des quatre ; le choix est
ensuite mémorisé. Les traductions sont embarquées dans `js/app.js` (objet `I18N`),
sans aucun service externe.

## Règles

1. Choisir une photo (photo d'exemple fournie, ou une photo personnelle via « Changer la photo »).
2. Choisir la difficulté : préréglages **Facile / Moyen / Difficile**, ou réglages
   personnalisés (taille de grille, transformations actives, temps limité).
   Toutes les transformations sont actives dès le niveau Facile ; la difficulté
   joue sur la taille de la grille, le temps, **l'intensité du flou et de la
   pixelisation** (légère / moyenne / forte) et la **pénalité de nettoyage**.
3. En jeu :
   - toucher une vignette pour la **sélectionner**, puis une autre pour les **échanger** ;
   - avec une vignette sélectionnée, la barre d'outils permet de **pivoter**,
     appliquer un **miroir** ou **nettoyer** (retirer flou, pixelisation,
     noir et blanc ou négatif) — une rotation à 180° se corrige en deux clics ±90° ;
   - **nettoyer coûte des secondes** selon la difficulté : 0 s en Facile, 5 s en
     Moyen, 10 s en Difficile — le malus s'affiche près du chrono ;
   - le bouton **Modèle** (maintenir appuyé) affiche la photo originale ;
   - un point vert marque les vignettes correctement placées et orientées.
4. La partie est gagnée quand toutes les vignettes sont en place et dans la bonne
   orientation — **une vignette restée floue ou pixelisée compte comme résolue**
   (les effets restants sont révélés à la victoire). Avec un temps limité,
   dépasser le temps fait perdre la partie.

## Structure

- `index.html` — les trois écrans (configuration, jeu, fins de partie)
- `css/style.css` — thème (rouge CRUZZLE), animations CSS des vignettes, confettis
- `js/app.js` — logique du jeu : découpe de l'image, mélange, orientation des
  vignettes (groupe diédral D4), chronomètre, détection de victoire, langues (`I18N`)
- `manifest.json`, `sw.js`, `icons/` — installation PWA et mode hors ligne

## Notes techniques

- La photo est recadrée au format de la grille puis affichée par `background-position`
  sur chaque vignette ; une version pixelisée est générée sur un canvas (réduction puis
  agrandissement sans lissage).
- L'orientation d'une vignette est un élément du groupe D4 : `transform: scaleX(f) rotate(r)`.
  Les rotations cumulent les degrés (pour une animation fluide dans le bon sens),
  le miroir vertical est composé comme miroir horizontal + 180°.
- Les réglages sont mémorisés dans `localStorage`.

## Évolutions prévues

- Variante « deux photos » (cf. présentation `20250507-Cruzzle.pdf`) : mélanger les
  vignettes de deux photos sur un même plateau et reconstituer les deux images.
