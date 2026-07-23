'use strict';

/* ============================================================
   CRUZZLE — Play with your pictures
   Puzzle : les vignettes d'une photo sont mélangées et
   transformées (rotation, miroir, flou, pixelisation).
   Le joueur échange les vignettes et annule les transformations.
   ============================================================ */

/* ---------- Utilitaires ---------- */

const $ = s => document.querySelector(s);
const mod = (n, m) => ((n % m) + m) % m;
const rand = a => a[Math.floor(Math.random() * a.length)];
const fmtTime = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ---------- Langues ---------- */

const I18N = {
  en: {
    photoTitle: 'Your photo',
    photoLead: "The photo's tiles will be shuffled and transformed. Tap the photo to replace it with one of your own.",
    changePhoto: 'Change photo',
    difficulty: 'Difficulty',
    presetFacile: 'Easy', presetMoyen: 'Medium', presetDifficile: 'Hard',
    gridLabel: 'Grid', tiles: 'tiles',
    timeLabel: 'Time limit', timeNone: 'No limit', minute: 'minute', minutes: 'minutes',
    checksLegend: 'Tile transformations',
    ckRot: 'Rotations ±90°', ckFlip: 'Mirrors (flips)', ckBlur: 'Blur',
    ckPix: 'Pixelation', ckNb: 'Black & white', ckInv: 'Negative',
    play: 'Play',
    credits: 'Rebuild the photo: swap the tiles and undo their transformations.',
    moves: 'Moves', time: 'Time', peek: 'Preview',
    hint: 'Tap a tile to select it, then tap another one to swap them.',
    toolCcw: 'Rotate −90°', toolCw: 'Rotate +90°',
    toolFh: 'Flip horiz.', toolFv: 'Flip vert.',
    clean: 'Clean', cleanPenalty: 'Clean (−{n} s)',
    progress: '{ok} / {total} in place',
    fx1: 'Light effects', fx2: 'Medium effects', fx3: 'Strong effects',
    penaltyFree: 'cleaning is free', penaltyCost: 'cleaning a tile costs {n} s',
    winTitle: 'Well done!',
    scoreLabel: 'Score',
    winStats1: 'Photo rebuilt in 1 move and {t}.',
    winStatsN: 'Photo rebuilt in {m} moves and {t}.',
    rowTiles1: '1 tile in place', rowTilesN: '{n} tiles in place',
    rowSwaps1: '1 tile swap', rowSwapsN: '{n} tile swaps',
    rowTransforms1: '1 transformation (rotate/flip)', rowTransformsN: '{n} transformations (rotate/flip)',
    rowCleans1: '1 tile cleaned', rowCleansN: '{n} tiles cleaned',
    rowBonusLight1: '1 grayscale/negative tile kept intact', rowBonusLightN: '{n} grayscale/negative tiles kept intact',
    rowBonusStrong1: '1 blurred/pixelated tile kept intact', rowBonusStrongN: '{n} blurred/pixelated tiles kept intact',
    rowActive: '{n}/6 transformations enabled',
    free: 'free',
    rowTotal: 'Total',
    zeroedLine: 'Score reset to zero — Easy mode time limit exceeded ({min} min for this grid).',
    replay: 'Play again', changeSetup: 'Change settings',
    loseTitle: "Time's up!",
    loseText: "The photo wasn't rebuilt in time. Try again?",
    retry: 'Try again', peekCaption: 'Original photo',
    ariaBack: 'Back to settings', ariaPeek: 'Show the original photo',
  },
  fr: {
    photoTitle: 'Votre photo',
    photoLead: 'Les vignettes de la photo seront mélangées et transformées. Touchez la photo pour la remplacer par une des vôtres.',
    changePhoto: 'Changer la photo',
    difficulty: 'Difficulté',
    presetFacile: 'Facile', presetMoyen: 'Moyen', presetDifficile: 'Difficile',
    gridLabel: 'Grille', tiles: 'vignettes',
    timeLabel: 'Temps limité', timeNone: 'Sans limite', minute: 'minute', minutes: 'minutes',
    checksLegend: 'Transformations des vignettes',
    ckRot: 'Rotations ±90°', ckFlip: 'Symétries (miroirs)', ckBlur: 'Flou',
    ckPix: 'Pixelisation', ckNb: 'Noir et blanc', ckInv: 'Négatif',
    play: 'Jouer',
    credits: 'Reconstituez la photo : échangez les vignettes et annulez leurs transformations.',
    moves: 'Coups', time: 'Temps', peek: 'Modèle',
    hint: 'Touchez une vignette pour la sélectionner, puis une autre pour les échanger.',
    toolCcw: 'Pivoter −90°', toolCw: 'Pivoter +90°',
    toolFh: 'Miroir horiz.', toolFv: 'Miroir vert.',
    clean: 'Nettoyer', cleanPenalty: 'Nettoyer (−{n} s)',
    progress: '{ok} / {total} en place',
    fx1: 'Effets légers', fx2: 'Effets moyens', fx3: 'Effets forts',
    penaltyFree: 'nettoyage sans pénalité', penaltyCost: 'nettoyer une vignette coûte {n} s',
    winTitle: 'Bravo !',
    scoreLabel: 'Score',
    winStats1: 'Photo reconstituée en 1 coup et {t}.',
    winStatsN: 'Photo reconstituée en {m} coups et {t}.',
    rowTiles1: '1 vignette bien placée', rowTilesN: '{n} vignettes bien placées',
    rowSwaps1: '1 échange de vignettes', rowSwapsN: '{n} échanges de vignettes',
    rowTransforms1: '1 transformation (rotation/miroir)', rowTransformsN: '{n} transformations (rotations/miroirs)',
    rowCleans1: '1 vignette nettoyée', rowCleansN: '{n} vignettes nettoyées',
    rowBonusLight1: '1 vignette N&B/négatif intacte', rowBonusLightN: '{n} vignettes N&B/négatif intactes',
    rowBonusStrong1: '1 vignette floutée/pixelisée intacte', rowBonusStrongN: '{n} vignettes floutées/pixelisées intactes',
    rowActive: '{n}/6 transformations activées',
    free: 'gratuit',
    rowTotal: 'Total',
    zeroedLine: 'Score ramené à zéro — délai du niveau Facile dépassé ({min} min pour cette grille).',
    replay: 'Rejouer', changeSetup: 'Modifier la partie',
    loseTitle: 'Temps écoulé !',
    loseText: "La photo n'a pas été reconstituée à temps. On retente ?",
    retry: 'Réessayer', peekCaption: 'Photo originale',
    ariaBack: 'Retour aux réglages', ariaPeek: 'Voir la photo modèle',
  },
  es: {
    photoTitle: 'Tu foto',
    photoLead: 'Las fichas de la foto se mezclarán y transformarán. Toca la foto para reemplazarla por una tuya.',
    changePhoto: 'Cambiar la foto',
    difficulty: 'Dificultad',
    presetFacile: 'Fácil', presetMoyen: 'Medio', presetDifficile: 'Difícil',
    gridLabel: 'Cuadrícula', tiles: 'fichas',
    timeLabel: 'Tiempo limitado', timeNone: 'Sin límite', minute: 'minuto', minutes: 'minutos',
    checksLegend: 'Transformaciones de las fichas',
    ckRot: 'Rotaciones ±90°', ckFlip: 'Espejos (simetrías)', ckBlur: 'Desenfoque',
    ckPix: 'Pixelado', ckNb: 'Blanco y negro', ckInv: 'Negativo',
    play: 'Jugar',
    credits: 'Reconstruye la foto: intercambia las fichas y anula sus transformaciones.',
    moves: 'Jugadas', time: 'Tiempo', peek: 'Modelo',
    hint: 'Toca una ficha para seleccionarla y luego otra para intercambiarlas.',
    toolCcw: 'Girar −90°', toolCw: 'Girar +90°',
    toolFh: 'Espejo horiz.', toolFv: 'Espejo vert.',
    clean: 'Limpiar', cleanPenalty: 'Limpiar (−{n} s)',
    progress: '{ok} / {total} en su sitio',
    fx1: 'Efectos suaves', fx2: 'Efectos medios', fx3: 'Efectos fuertes',
    penaltyFree: 'limpiar es gratis', penaltyCost: 'limpiar una ficha cuesta {n} s',
    winTitle: '¡Bravo!',
    scoreLabel: 'Puntuación',
    winStats1: 'Foto reconstruida en 1 jugada y {t}.',
    winStatsN: 'Foto reconstruida en {m} jugadas y {t}.',
    rowTiles1: '1 ficha en su sitio', rowTilesN: '{n} fichas en su sitio',
    rowSwaps1: '1 intercambio de fichas', rowSwapsN: '{n} intercambios de fichas',
    rowTransforms1: '1 transformación (rotar/espejo)', rowTransformsN: '{n} transformaciones (rotar/espejo)',
    rowCleans1: '1 ficha limpiada', rowCleansN: '{n} fichas limpiadas',
    rowBonusLight1: '1 ficha B/N o negativo intacta', rowBonusLightN: '{n} fichas B/N o negativo intactas',
    rowBonusStrong1: '1 ficha borrosa/pixelada intacta', rowBonusStrongN: '{n} fichas borrosas/pixeladas intactas',
    rowActive: '{n}/6 transformaciones activadas',
    free: 'gratis',
    rowTotal: 'Total',
    zeroedLine: 'Puntuación a cero — tiempo del nivel Fácil superado ({min} min para esta cuadrícula).',
    replay: 'Jugar de nuevo', changeSetup: 'Cambiar ajustes',
    loseTitle: '¡Tiempo agotado!',
    loseText: 'La foto no se reconstruyó a tiempo. ¿Lo intentamos de nuevo?',
    retry: 'Reintentar', peekCaption: 'Foto original',
    ariaBack: 'Volver a los ajustes', ariaPeek: 'Ver la foto original',
  },
  de: {
    photoTitle: 'Dein Foto',
    photoLead: 'Die Kacheln des Fotos werden gemischt und transformiert. Tippe auf das Foto, um es durch ein eigenes zu ersetzen.',
    changePhoto: 'Foto ändern',
    difficulty: 'Schwierigkeit',
    presetFacile: 'Leicht', presetMoyen: 'Mittel', presetDifficile: 'Schwer',
    gridLabel: 'Raster', tiles: 'Kacheln',
    timeLabel: 'Zeitlimit', timeNone: 'Ohne Limit', minute: 'Minute', minutes: 'Minuten',
    checksLegend: 'Kachel-Transformationen',
    ckRot: 'Drehungen ±90°', ckFlip: 'Spiegelungen', ckBlur: 'Unschärfe',
    ckPix: 'Verpixelung', ckNb: 'Schwarz-Weiß', ckInv: 'Negativ',
    play: 'Spielen',
    credits: 'Stelle das Foto wieder her: Tausche die Kacheln und mache ihre Transformationen rückgängig.',
    moves: 'Züge', time: 'Zeit', peek: 'Vorlage',
    hint: 'Tippe auf eine Kachel, um sie auszuwählen, und dann auf eine andere, um sie zu tauschen.',
    toolCcw: 'Drehen −90°', toolCw: 'Drehen +90°',
    toolFh: 'Spiegeln horiz.', toolFv: 'Spiegeln vert.',
    clean: 'Säubern', cleanPenalty: 'Säubern (−{n} s)',
    progress: '{ok} / {total} richtig platziert',
    fx1: 'Leichte Effekte', fx2: 'Mittlere Effekte', fx3: 'Starke Effekte',
    penaltyFree: 'Säubern ohne Strafe', penaltyCost: 'Säubern kostet {n} s',
    winTitle: 'Bravo!',
    scoreLabel: 'Punktzahl',
    winStats1: 'Foto in 1 Zug und {t} wiederhergestellt.',
    winStatsN: 'Foto in {m} Zügen und {t} wiederhergestellt.',
    rowTiles1: '1 Kachel richtig platziert', rowTilesN: '{n} Kacheln richtig platziert',
    rowSwaps1: '1 Kachel-Tausch', rowSwapsN: '{n} Kachel-Tausche',
    rowTransforms1: '1 Transformation (Drehen/Spiegeln)', rowTransformsN: '{n} Transformationen (Drehen/Spiegeln)',
    rowCleans1: '1 Kachel gesäubert', rowCleansN: '{n} Kacheln gesäubert',
    rowBonusLight1: '1 unberührte Graustufen-/Negativ-Kachel', rowBonusLightN: '{n} unberührte Graustufen-/Negativ-Kacheln',
    rowBonusStrong1: '1 unberührte unscharfe/verpixelte Kachel', rowBonusStrongN: '{n} unberührte unscharfe/verpixelte Kacheln',
    rowActive: '{n}/6 Transformationen aktiv',
    free: 'kostenlos',
    rowTotal: 'Gesamt',
    zeroedLine: 'Punktzahl auf null gesetzt — Zeitlimit des Levels „Leicht“ überschritten ({min} Min. für dieses Raster).',
    replay: 'Nochmal spielen', changeSetup: 'Einstellungen ändern',
    loseTitle: 'Zeit abgelaufen!',
    loseText: 'Das Foto wurde nicht rechtzeitig wiederhergestellt. Nochmal versuchen?',
    retry: 'Nochmal versuchen', peekCaption: 'Originalfoto',
    ariaBack: 'Zurück zu den Einstellungen', ariaPeek: 'Originalfoto anzeigen',
  },
};

let lang = 'en';
const t = k => I18N[lang][k] ?? I18N.en[k] ?? k;
const tf = (k, vars) => t(k).replace(/\{(\w+)\}/g, (_, v) => vars[v]);

function applyLang(l) {
  lang = I18N[l] ? l : 'en';
  document.documentElement.lang = lang;
  $('#langSel').value = lang;
  localStorage.setItem('cruzzle-lang', lang);

  document.querySelectorAll('[data-i18n]')
    .forEach(el => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll('[data-i18n-aria]')
    .forEach(el => el.setAttribute('aria-label', t(el.dataset.i18nAria)));

  // Libellés des listes déroulantes
  document.querySelectorAll('#gridSel option').forEach(o => {
    const [c, r] = o.value.split('x').map(Number);
    o.textContent = `${c} × ${r} — ${c * r} ${t('tiles')}`;
  });
  document.querySelectorAll('#timeSel option').forEach(o => {
    const v = Number(o.value);
    o.textContent = v === 0 ? t('timeNone')
      : `${v / 60} ${v === 60 ? t('minute') : t('minutes')}`;
  });

  // Textes dynamiques déjà affichés
  markPreset();
  if (state.game) {
    configureTools();
    updateHud();
  }
}

/* ---------- Réglages ---------- */

/* fxLevel : intensité du flou / de la pixelisation (1 léger, 2 moyen, 3 fort)
   penalty : secondes perdues à chaque « Nettoyer » */
const PRESETS = {
  facile:    { cols: 3, rows: 3, rot: true, flip: true, blur: true, pix: true, nb: true, inv: true, limit: 0,   fxLevel: 1, penalty: 0 },
  moyen:     { cols: 4, rows: 4, rot: true, flip: true, blur: true, pix: true, nb: true, inv: true, limit: 180, fxLevel: 2, penalty: 5 },
  difficile: { cols: 5, rows: 5, rot: true, flip: true, blur: true, pix: true, nb: true, inv: true, limit: 300, fxLevel: 3, penalty: 10 },
};

const BLUR_PX = { 1: '3px', 2: '6px', 3: '10px' };   // rayon de flou CSS
const PIX_RES = { 1: 11,    2: 7,     3: 4 };        // pixels par vignette (pixelisation)

/* ---------- Score ---------- */

// Petits nombres entiers, faciles à lire et à additionner de tête. La
// hiérarchie voulue : une vignette bien placée (3) rapporte plus qu'un
// bonus d'effet intact ; un effet fort (flou/pixelisation, 2) rapporte le
// double d'un effet léger (N&B/négatif, 1). Pas de multiplicateur final :
// cocher une transformation de plus rapporte toujours directement des
// points (+2, une fois, à la victoire), quelle que soit la vignette qui la
// reçoit ou non au mélange.
//
// Seuls les ÉCHANGES coûtent des points (tâtonnement de repositionnement) :
// corriger une rotation/un miroir n'est pas du gaspillage mais un passage
// obligé quand ces options sont cochées — le facturer annulerait quasiment
// le bonus « transformations activées » qui vient récompenser ce choix.
// Nettoyer est déjà pénalisé deux fois autrement (bonus perdu + secondes) ;
// pas besoin d'un troisième malus en points pour la même action.
const PTS_PER_TILE = 3;                 // par vignette résolue
const PTS_PER_SWAP = 1;                 // malus par échange de vignettes
const FX_BONUS_LIGHT = 1;               // par vignette N&B/négatif intacte (jamais nettoyée)
const FX_BONUS_STRONG = 2;              // par vignette floutée/pixelisée intacte (jamais nettoyée)
const PTS_PER_ACTIVE_TRANSFORM = 2;     // par type de transformation coché à l'accueil (sur 6)

const TRANSFORM_KEYS = ['rot', 'flip', 'blur', 'pix', 'nb', 'inv'];

// Niveau Facile uniquement : passé ce délai (selon la taille de grille), le
// score retombe à zéro. La partie continue, mais ne rapporte plus rien —
// c'est la seule contrainte de temps du niveau Facile (pas de limite stricte
// par défaut). Clé = nombre de colonnes (les grilles sont toujours carrées).
const FACILE_ZERO_AT = { 3: 180, 4: 300, 5: 420, 6: 540 };   // 3/5/7/9 min

// Calcule le score courant (utilisé en direct pendant la partie et à la
// victoire, pour garantir un résultat toujours cohérent entre les deux).
function computeScore() {
  const g = state.game;
  const s = state.settings;

  // Points de base sur les vignettes RÉSOLUES à l'instant présent (pastille
  // verte), pas sur le total de la grille — sinon le score en direct
  // n'augmente jamais au fil de la partie. Les deux coïncident à la victoire.
  const okTiles = g.tiles.filter(isSolved).length;
  const basePts = okTiles * PTS_PER_TILE;

  const lightTiles = g.tiles.filter(t => isSolved(t) && (t.fx === 'nb' || t.fx === 'inv')).length;
  const strongTiles = g.tiles.filter(t => isSolved(t) && (t.fx === 'blur' || t.fx === 'pix')).length;
  const lightPts = lightTiles * FX_BONUS_LIGHT;
  const strongPts = strongTiles * FX_BONUS_STRONG;

  // Seul le malus d'échange affecte le score (voir note ci-dessus) ;
  // transforms/cleans restent comptés pour l'affichage (transparence) mais
  // ne coûtent plus de points.
  const swapPts = g.swaps * PTS_PER_SWAP;

  const activeCount = TRANSFORM_KEYS.filter(k => s[k]).length;
  const activePts = activeCount * PTS_PER_ACTIVE_TRANSFORM;

  const elapsed = Math.floor((Date.now() - g.start) / 1000);
  const zeroed = s.fxLevel === 1 && elapsed >= (FACILE_ZERO_AT[s.cols] ?? Infinity);

  return {
    total: zeroed ? 0 : Math.max(0, basePts + lightPts + strongPts + activePts - swapPts),
    basePts, okTiles,
    swaps: g.swaps, swapPts,
    transforms: g.transforms,
    cleans: g.cleans,
    lightTiles, lightPts, strongTiles, strongPts,
    activeCount, activePts, zeroed,
  };
}

const state = {
  photo: null,                    // HTMLCanvasElement ou HTMLImageElement
  settings: { ...PRESETS.facile },
  game: null,
};

/* ============================================================
   Photo d'exemple (générée, aucune ressource externe)
   ============================================================ */

function defaultPhoto() {
  const c = document.createElement('canvas');
  c.width = c.height = 900;
  const x = c.getContext('2d');
  const TAU = Math.PI * 2;

  // Ciel
  const sky = x.createLinearGradient(0, 0, 0, 640);
  sky.addColorStop(0, '#3b1d5a');
  sky.addColorStop(0.45, '#c33d2e');
  sky.addColorStop(0.8, '#ff8c42');
  sky.addColorStop(1, '#ffd166');
  x.fillStyle = sky;
  x.fillRect(0, 0, 900, 640);

  // Soleil
  const halo = x.createRadialGradient(450, 500, 20, 450, 500, 210);
  halo.addColorStop(0, '#fff7d6');
  halo.addColorStop(0.35, 'rgba(255,223,128,0.9)');
  halo.addColorStop(1, 'rgba(255,223,128,0)');
  x.fillStyle = halo;
  x.beginPath(); x.arc(450, 500, 210, 0, TAU); x.fill();
  x.fillStyle = '#fff3c4';
  x.beginPath(); x.arc(450, 500, 90, 0, TAU); x.fill();

  // Nuages
  x.fillStyle = 'rgba(255,255,255,0.28)';
  [[150, 150, 120, 20], [640, 110, 160, 22], [290, 260, 100, 15], [720, 300, 130, 17], [80, 380, 90, 13]]
    .forEach(([cx, cy, w, h]) => {
      x.beginPath(); x.ellipse(cx, cy, w, h, 0, 0, TAU); x.fill();
    });

  // Oiseaux
  x.strokeStyle = 'rgba(45,20,20,0.75)';
  x.lineWidth = 3.5;
  x.lineCap = 'round';
  [[200, 200], [255, 235], [660, 190], [610, 240], [740, 150]].forEach(([bx, by]) => {
    x.beginPath();
    x.arc(bx - 9, by, 11, Math.PI * 1.1, Math.PI * 1.9);
    x.arc(bx + 9, by, 11, Math.PI * 1.1, Math.PI * 1.9);
    x.stroke();
  });

  // Montagnes (deux plans)
  x.fillStyle = '#7a2318';
  x.beginPath();
  x.moveTo(0, 640); x.lineTo(0, 500); x.lineTo(150, 400); x.lineTo(310, 560);
  x.lineTo(450, 440); x.lineTo(620, 600); x.lineTo(760, 470); x.lineTo(900, 590);
  x.lineTo(900, 640); x.closePath(); x.fill();

  x.fillStyle = '#571109';
  x.beginPath();
  x.moveTo(0, 640); x.lineTo(120, 540); x.lineTo(300, 640); x.lineTo(520, 480);
  x.lineTo(700, 640); x.lineTo(820, 560); x.lineTo(900, 620); x.lineTo(900, 640);
  x.closePath(); x.fill();

  // Mer
  const sea = x.createLinearGradient(0, 640, 0, 900);
  sea.addColorStop(0, '#8f2a12');
  sea.addColorStop(0.5, '#5a1408');
  sea.addColorStop(1, '#2b0a05');
  x.fillStyle = sea;
  x.fillRect(0, 640, 900, 260);

  // Reflet du soleil sur l'eau
  x.fillStyle = 'rgba(255,220,140,0.5)';
  for (let i = 0; i < 14; i++) {
    const y = 655 + i * 17;
    const w = 130 - i * 7 + Math.random() * 30;
    x.beginPath();
    x.ellipse(450 + (Math.random() - 0.5) * 40, y, w / 2, 3.5, 0, 0, TAU);
    x.fill();
  }

  // Voilier
  x.fillStyle = '#1d0803';
  x.beginPath(); x.moveTo(680, 710); x.lineTo(760, 710); x.lineTo(745, 728); x.lineTo(695, 728); x.closePath(); x.fill();
  x.beginPath(); x.moveTo(718, 705); x.lineTo(718, 640); x.lineTo(690, 700); x.closePath(); x.fill();
  x.beginPath(); x.moveTo(724, 705); x.lineTo(724, 630); x.lineTo(762, 700); x.closePath(); x.fill();

  return c;
}

/* ============================================================
   Préparation de l'image (recadrage + version pixelisée)
   ============================================================ */

function prepareImage(src, cols, rows, fxLevel) {
  const aspect = cols / rows;
  const sw = src.naturalWidth || src.width;
  const sh = src.naturalHeight || src.height;

  // Recadrage centré à l'aspect de la grille (vignettes carrées)
  let cw = sw, ch = sh;
  if (cw / ch > aspect) cw = ch * aspect;
  else ch = cw / aspect;
  const sx = (sw - cw) / 2;
  const sy = (sh - ch) / 2;

  const W = cols * 200, H = rows * 200;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  c.getContext('2d').drawImage(src, sx, sy, cw, ch, 0, 0, W, H);

  // Version pixelisée : réduction puis agrandissement sans lissage
  const res = PIX_RES[fxLevel] || PIX_RES[2];
  const small = document.createElement('canvas');
  small.width = cols * res; small.height = rows * res;
  small.getContext('2d').drawImage(c, 0, 0, small.width, small.height);
  const pix = document.createElement('canvas');
  pix.width = W; pix.height = H;
  const px = pix.getContext('2d');
  px.imageSmoothingEnabled = false;
  px.drawImage(small, 0, 0, W, H);

  return {
    url: c.toDataURL('image/jpeg', 0.85),
    pixUrl: pix.toDataURL('image/jpeg', 0.85),
  };
}

/* ============================================================
   Orientation des vignettes (groupe diédral D4)
   État : rot (degrés cumulés pour animer) + flipH (miroir horizontal,
   axe vertical) + flipV (miroir vertical, axe horizontal) — indépendants.
   CSS : transform = scaleX(flipH) scaleY(flipV) rotate(rot).
   Chaque bouton ne modifie qu'une seule fonction CSS à la fois, ce qui
   rend chaque animation atomique et naturelle (pas de vrille combinée).
   Quand un seul des deux miroirs est actif, la transformation inverse
   la chiralité : le sens visuel des rotations cw/ccw doit alors être
   inversé pour que les boutons restent toujours « visuellement »
   corrects (d'où le calcul de parité ci-dessous).
   ============================================================ */

function applyOp(t, op) {
  const oddParity = t.flipH !== t.flipV;   // un seul miroir actif → sens inversé
  switch (op) {
    case 'cw':  t.rot += oddParity ? -90 : 90; break;   // pivoter +90° à l'écran
    case 'ccw': t.rot += oddParity ? 90 : -90; break;   // pivoter −90° à l'écran
    case 'fh':  t.flipH = !t.flipH; break;              // miroir horizontal (axe vertical)
    case 'fv':  t.flipV = !t.flipV; break;              // miroir vertical (axe horizontal)
    case 'fx':  t.fx = null; break;                     // retirer flou / pixelisation
  }
}

/* Une vignette non nettoyée (flou / pixelisation) compte comme résolue :
   seuls la position et l'orientation importent pour gagner.
   Deux combinaisons (flipH,flipV,rot) affichent la même image d'origine :
   (false,false,0°) et (true,true,180°). */
const isSolved = t =>
  t.slot === t.home &&
  t.flipH === t.flipV &&
  mod(t.rot + (t.flipH ? 180 : 0), 360) === 0;

/* ============================================================
   Partie
   ============================================================ */

function startGame() {
  const s = state.settings;
  const total = s.cols * s.rows;

  if (state.game) clearInterval(state.game.timerId);

  const img = prepareImage(state.photo, s.cols, s.rows, s.fxLevel);

  // Création des vignettes
  const tiles = [];
  for (let r = 0; r < s.rows; r++)
    for (let c = 0; c < s.cols; c++)
      tiles.push({
        r, c,
        home: r * s.cols + c,
        slot: 0,
        rot: 0,
        flipH: false,
        flipV: false,
        fx: null,
        el: null,
        face: null,
      });

  // Mélange des positions : un vrai dérangement (aucune vignette dans sa
  // propre case), pas seulement « pas toutes à la fois » — sinon une
  // vignette isolée peut atterrir chez elle par hasard et afficher la
  // pastille verte dès le lancement, avant même le premier coup.
  let perm;
  do { perm = shuffle([...Array(total).keys()]); }
  while (perm.some((v, i) => v === i));
  perm.forEach((slot, i) => { tiles[i].slot = slot; });

  // Mélange des orientations : tirage direct parmi les états que le joueur
  // peut défaire avec les boutons actifs. Le 180° se corrige en deux clics ±90°.
  // flipH et flipV sont tirés indépendamment : chaque combinaison (rot, flipH,
  // flipV) correspond à l'un des 8 états du groupe D4 (avec redondance 2 pour 1,
  // ce qui ne pose aucun problème puisque isSolved() reconnaît les deux formes).
  const fxPool = [
    ...(s.blur ? ['blur'] : []),
    ...(s.pix ? ['pix'] : []),
    ...(s.nb ? ['nb'] : []),
    ...(s.inv ? ['inv'] : []),
  ];
  tiles.forEach(t => {
    if (s.rot) t.rot = rand([0, 90, 180, 270]);
    if (s.flip) {
      t.flipH = Math.random() < 0.5;
      t.flipV = Math.random() < 0.5;
    }
    if (fxPool.length && Math.random() < 0.4) t.fx = rand(fxPool);
  });

  state.game = {
    tiles, img,
    sel: null,
    moves: 0,
    // Sous-compteurs pour le détail du score (voir computeScore) : leur
    // somme égale toujours `moves`, chacun coûtant le même malus par coup.
    swaps: 0, transforms: 0, cleans: 0,
    start: Date.now(),
    limit: s.limit,
    over: false,
    timerId: null,
  };

  buildBoard();
  $('#peek0').src = img.url;
  $('#moves').textContent = '0';
  configureTools();
  updateHud();
  startClock();
  show('game');
}

function buildBoard() {
  const s = state.settings;
  const g = state.game;
  const board = $('#board');
  board.classList.remove('won');
  board.innerHTML = '';
  board.style.aspectRatio = `${s.cols} / ${s.rows}`;
  board.style.setProperty('--blur', BLUR_PX[s.fxLevel] || BLUR_PX[2]);
  fitBoard();

  g.tiles.forEach((t, i) => {
    const el = document.createElement('div');
    el.className = 'tile';
    el.style.width = `${100 / s.cols}%`;
    el.style.height = `${100 / s.rows}%`;

    const face = document.createElement('div');
    face.className = 'face';
    face.style.backgroundSize = `${s.cols * 100}% ${s.rows * 100}%`;
    const bx = s.cols > 1 ? (t.c * 100) / (s.cols - 1) : 0;
    const by = s.rows > 1 ? (t.r * 100) / (s.rows - 1) : 0;
    face.style.backgroundPosition = `${bx}% ${by}%`;

    el.appendChild(face);
    el.addEventListener('click', () => onTile(i));
    board.appendChild(el);
    t.el = el;
    t.face = face;
    paintTile(t);
  });
}

/* Le plateau est dimensionné pour tenir aussi en hauteur */
function fitBoard() {
  const s = state.settings;
  const board = $('#board');
  const availH = window.innerHeight - 230;
  const availW = Math.min(document.documentElement.clientWidth * 0.94, 460);
  const w = Math.min(availW, Math.max(240, (availH * s.cols) / s.rows));
  board.style.width = `${w}px`;
}

function paintTile(t) {
  const s = state.settings;
  const g = state.game;
  t.el.style.left = `${(t.slot % s.cols) * (100 / s.cols)}%`;
  t.el.style.top = `${Math.floor(t.slot / s.cols) * (100 / s.rows)}%`;
  t.face.style.backgroundImage = `url(${t.fx === 'pix' ? g.img.pixUrl : g.img.url})`;
  t.face.style.transform =
    `scaleX(${t.flipH ? -1 : 1}) scaleY(${t.flipV ? -1 : 1}) rotate(${t.rot}deg)`;
  t.face.classList.toggle('blur', t.fx === 'blur');
  t.face.classList.toggle('nb', t.fx === 'nb');
  t.face.classList.toggle('inv', t.fx === 'inv');
  t.el.classList.toggle('sel', g.sel === t);
  t.el.classList.toggle('ok', isSolved(t));
}

/* ---------- Interactions ---------- */

function onTile(i) {
  const g = state.game;
  if (!g || g.over) return;
  const t = g.tiles[i];

  if (g.sel === t) {
    g.sel = null;                       // désélection
  } else if (!g.sel) {
    g.sel = t;                          // sélection
  } else {
    const a = g.sel;                    // échange
    g.sel = null;
    [a.slot, t.slot] = [t.slot, a.slot];
    g.moves++;
    g.swaps++;
    paintTile(a);
  }
  paintTile(t);
  updateHud();
  checkWin();
}

function onToolOp(op) {
  const g = state.game;
  if (!g || g.over || !g.sel) return;
  if (op === 'fx') {
    if (!g.sel.fx) return;
    applyPenalty();
    g.cleans++;
  } else {
    g.transforms++;
  }
  applyOp(g.sel, op);
  g.moves++;
  paintTile(g.sel);
  updateHud();
  checkWin();
}

/* Nettoyer coûte des secondes : on recule le point de départ du chrono,
   ce qui fonctionne aussi bien en temps limité qu'en chrono libre. */
function applyPenalty() {
  const p = state.settings.penalty;
  if (!p) return;
  state.game.start -= p * 1000;
  const stat = $('#clock').parentElement;
  const el = document.createElement('em');
  el.className = 'penalty-pop';
  el.textContent = `−${p} s`;
  stat.appendChild(el);
  el.addEventListener('animationend', () => el.remove());
}

function configureTools() {
  const s = state.settings;
  $('#opCw').hidden = $('#opCcw').hidden = !s.rot;
  $('#opFh').hidden = $('#opFv').hidden = !s.flip;
  $('#opFx').hidden = !(s.blur || s.pix || s.nb || s.inv);
  $('#opFxLabel').textContent =
    s.penalty ? tf('cleanPenalty', { n: s.penalty }) : t('clean');
}

function updateHud() {
  const g = state.game;
  const s = state.settings;
  $('#moves').textContent = g.moves;

  const total = g.tiles.length;
  const ok = g.tiles.filter(isSolved).length;
  $('#progressTxt').textContent = tf('progress', { ok, total });
  $('#progressBar').style.width = `${(ok / total) * 100}%`;

  const anyTool = s.rot || s.flip || s.blur || s.pix || s.nb || s.inv;
  const showTools = !!g.sel && anyTool && !g.over;
  $('#tools').classList.toggle('hidden', !showTools);
  $('#hint').classList.toggle('hidden', showTools);
  if (g.sel) $('#opFx').disabled = !g.sel.fx;

  updateLiveScore();
}

/* Score affiché en direct dans le HUD, pendant la partie. Appelé après
   chaque coup/outil (via updateHud) et à chaque tic d'horloge, pour que
   le passage à zéro (niveau Facile, temps dépassé) apparaisse même sans
   nouvelle action du joueur. */
function updateLiveScore() {
  const g = state.game;
  if (!g || g.over) return;
  const sc = computeScore();
  const el = $('#liveScore');
  const changed = el.textContent !== String(sc.total);
  el.textContent = sc.total;
  el.classList.toggle('zeroed', sc.zeroed);
  if (changed) {
    el.classList.remove('bump');
    void el.offsetWidth;   // relance l'animation même si la classe était déjà posée
    el.classList.add('bump');
  }
}

/* ---------- Chronomètre ---------- */

function startClock() {
  const g = state.game;
  const clock = $('#clock');
  const tick = () => {
    const elapsed = Math.floor((Date.now() - g.start) / 1000);
    if (g.limit) {
      const rem = g.limit - elapsed;
      clock.textContent = fmtTime(Math.max(0, rem));
      clock.classList.toggle('warn', rem <= 30 && rem > 0);
      if (rem <= 0 && !g.over) {
        g.over = true;
        clearInterval(g.timerId);
        g.sel = null;
        updateHud();
        overlay('lose', true);
        return;
      }
    } else {
      clock.textContent = fmtTime(elapsed);
    }
    updateLiveScore();
  };
  tick();
  g.timerId = setInterval(tick, 250);
}

/* ---------- Fin de partie ---------- */

function checkWin() {
  const g = state.game;
  if (g.over || !g.tiles.every(isSolved)) return;

  g.over = true;
  g.sel = null;
  clearInterval(g.timerId);
  $('#clock').classList.remove('warn');
  updateHud();

  // Score : à calculer avant la révélation finale, qui nettoie les vignettes
  // encore floutées/pixelisées/N&B/négatif (donc avant d'y perdre la trace).
  g.score = computeScore();

  // Révélation finale : les effets restants disparaissent (sans pénalité)
  g.tiles.forEach(t => {
    if (t.fx) { t.fx = null; paintTile(t); }
  });

  const board = $('#board');
  board.classList.add('won');
  g.tiles.forEach(t => {
    t.face.style.animationDelay = `${t.home * 45}ms`;
  });

  const secs = Math.floor((Date.now() - g.start) / 1000);
  const popMs = g.tiles.length * 45 + 650;    // durée de la vague d'animation des vignettes
  const holdMs = 1400;                        // pause pour admirer la photo reconstituée
  setTimeout(() => {
    $('#winStats').textContent =
      tf(g.moves === 1 ? 'winStats1' : 'winStatsN', { m: g.moves, t: fmtTime(secs) });

    const sc = g.score;
    $('#scoreValue').textContent = sc.total;

    const table = $('#scoreTable');
    const zeroedLine = $('#winZeroed');

    if (sc.zeroed) {
      // Score nul (niveau Facile, délai dépassé) : le détail n'aurait plus
      // de sens puisqu'il n'expliquerait pas un total forcé à 0.
      table.classList.add('hidden');
      table.innerHTML = '';
      const mins = Math.round((FACILE_ZERO_AT[state.settings.cols] ?? 0) / 60);
      zeroedLine.textContent = tf('zeroedLine', { min: mins });
      zeroedLine.classList.remove('hidden');
    } else {
      zeroedLine.classList.add('hidden');

      const tfN = (base, n, vars) => tf(n === 1 ? `${base}1` : `${base}N`, { n, ...vars });
      const row = (label, pts, cls, extraClass = '') => `
        <div class="score-row ${extraClass}"><span>${label}</span>
        <strong class="${cls}">${pts > 0 ? '+' : ''}${pts}</strong></div>`;

      const freeRow = label => `
        <div class="score-row"><span>${label}</span><strong>${t('free')}</strong></div>`;

      const rows = [row(tfN('rowTiles', sc.okTiles), sc.basePts, 'pos')];
      if (sc.swaps > 0) rows.push(row(tfN('rowSwaps', sc.swaps), -sc.swapPts, 'neg'));
      if (sc.transforms > 0) rows.push(freeRow(tfN('rowTransforms', sc.transforms)));
      if (sc.cleans > 0) rows.push(freeRow(tfN('rowCleans', sc.cleans)));
      if (sc.lightTiles > 0) rows.push(row(tfN('rowBonusLight', sc.lightTiles), sc.lightPts, 'pos'));
      if (sc.strongTiles > 0) rows.push(row(tfN('rowBonusStrong', sc.strongTiles), sc.strongPts, 'pos'));
      if (sc.activeCount > 0) rows.push(row(tf('rowActive', { n: sc.activeCount }), sc.activePts, 'pos'));
      rows.push(row(t('rowTotal'), sc.total, '', 'score-row--total'));

      table.innerHTML = rows.join('');
      table.classList.remove('hidden');
    }

    launchConfetti();
    overlay('win', true);
  }, popMs + holdMs);
}

function launchConfetti() {
  const box = $('#confetti');
  box.innerHTML = '';
  const colors = ['#e8290b', '#ffb037', '#2ecc71', '#3498db', '#faf6f0', '#b71c0c'];
  for (let i = 0; i < 90; i++) {
    const p = document.createElement('i');
    p.style.left = `${Math.random() * 100}%`;
    p.style.background = rand(colors);
    p.style.animationDuration = `${2.5 + Math.random() * 2.2}s`;
    p.style.animationDelay = `${Math.random() * 0.9}s`;
    p.style.transform = `rotate(${Math.random() * 360}deg)`;
    box.appendChild(p);
  }
}

/* ============================================================
   Navigation et superpositions
   ============================================================ */

function show(id) {
  document.querySelectorAll('.screen')
    .forEach(el => el.classList.toggle('active', el.id === id));
}

function overlay(id, on) {
  $(`#${id}`).classList.toggle('show', on);
}

function backToSetup() {
  if (state.game) clearInterval(state.game.timerId);
  overlay('win', false);
  overlay('lose', false);
  show('setup');
}

/* ============================================================
   Écran de configuration
   ============================================================ */

function syncControls() {
  const s = state.settings;
  $('#gridSel').value = `${s.cols}x${s.rows}`;
  $('#timeSel').value = String(s.limit);
  $('#ckRot').checked = s.rot;
  $('#ckFlip').checked = s.flip;
  $('#ckBlur').checked = s.blur;
  $('#ckPix').checked = s.pix;
  $('#ckNb').checked = s.nb;
  $('#ckInv').checked = s.inv;
  markPreset();
}

function readControls() {
  const s = state.settings;
  const [c, r] = $('#gridSel').value.split('x').map(Number);
  s.cols = c; s.rows = r;
  s.limit = Number($('#timeSel').value);
  s.rot = $('#ckRot').checked;
  s.flip = $('#ckFlip').checked;
  s.blur = $('#ckBlur').checked;
  s.pix = $('#ckPix').checked;
  s.nb = $('#ckNb').checked;
  s.inv = $('#ckInv').checked;
  markPreset();
}

function markPreset() {
  const s = state.settings;
  document.querySelectorAll('.chip[data-preset]').forEach(ch => {
    const p = PRESETS[ch.dataset.preset];
    const match = Object.keys(p).every(k => p[k] === s[k]);
    ch.classList.toggle('active', match);
  });
  $('#presetInfo').textContent =
    `${t(`fx${s.fxLevel}`)} · ` +
    (s.penalty ? tf('penaltyCost', { n: s.penalty }) : t('penaltyFree'));
}

function initSetup() {
  // Photo
  $('#slot0').addEventListener('click', () => $('#file0').click());
  $('#file0').addEventListener('change', () => {
    const f = $('#file0').files[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    const img = new Image();
    img.onload = () => {
      state.photo = img;
      $('#prev0').src = url;
    };
    img.onerror = () => URL.revokeObjectURL(url);
    img.src = url;
  });

  // Préréglages
  document.querySelectorAll('.chip[data-preset]').forEach(ch =>
    ch.addEventListener('click', () => {
      Object.assign(state.settings, PRESETS[ch.dataset.preset]);
      syncControls();
    }));

  // Réglages personnalisés
  ['#gridSel', '#timeSel', '#ckRot', '#ckFlip', '#ckBlur', '#ckPix', '#ckNb', '#ckInv']
    .forEach(sel => $(sel).addEventListener('change', readControls));

  $('#btnPlay').addEventListener('click', () => {
    localStorage.setItem('cruzzle-settings-v2', JSON.stringify(state.settings));
    startGame();
  });
}

/* ============================================================
   Écran de jeu : boutons
   ============================================================ */

function initGameUi() {
  $('#btnBack').addEventListener('click', backToSetup);

  $('#tools').addEventListener('click', e => {
    const b = e.target.closest('button[data-op]');
    if (b) onToolOp(b.dataset.op);
  });

  // Aperçu du modèle : un clic sur le bouton l'ouvre, le clic suivant — où
  // qu'il soit, y compris sur la photo — le referme. Un seul écouteur
  // permanent avec un état interne, plutôt que d'ajouter/retirer un
  // écouteur « fermer » à l'ouverture : ça évite le piège classique où le
  // clic d'ouverture, encore en train de remonter dans le DOM, déclenche
  // aussitôt le nouvel écouteur et referme la modale sur le même clic.
  let peekOpen = false;
  let peekTouchedAt = 0;
  const togglePeek = e => {
    if (peekOpen) {
      peekOpen = false;
      overlay('peek', false);
    } else if (e.target.closest('#btnPeek')) {
      peekOpen = true;
      overlay('peek', true);
    }
  };
  document.addEventListener('click', e => {
    // Filet de sécurité : ignore un clic de synthèse résiduel qui suivrait
    // de très près (même frame) une ouverture déclenchée par touchend
    // ci-dessous — la fenêtre est courte pour ne jamais bloquer un vrai
    // second tap de l'utilisateur, seulement l'écho immédiat d'un seul geste.
    if (Date.now() - peekTouchedAt < 80) return;
    togglePeek(e);
  });
  // iOS Safari : le bouton se retrouve couvert par l'overlay plein écran
  // pendant l'appui (il disparaît sous elle), ce qui pousse WebKit à générer
  // un clic de synthèse fantôme juste après — perçu comme un flash où la
  // modale s'ouvre puis se referme aussitôt. On gère l'ouverture via
  // touchend + preventDefault pour supprimer ce clic fantôme à la source ;
  // la fermeture (clic sur l'overlay) continue de passer par 'click' ci-dessus.
  $('#btnPeek').addEventListener('touchend', e => {
    e.preventDefault();
    peekTouchedAt = Date.now();
    togglePeek(e);
  }, { passive: false });

  // Fin de partie
  $('#btnReplay').addEventListener('click', () => { overlay('win', false); startGame(); });
  $('#btnRetry').addEventListener('click', () => { overlay('lose', false); startGame(); });
  $('#btnWinSetup').addEventListener('click', backToSetup);
  $('#btnLoseSetup').addEventListener('click', backToSetup);

  window.addEventListener('resize', () => {
    if (state.game) fitBoard();
  });
}

/* ============================================================
   Démarrage
   ============================================================ */

function init() {
  const saved = localStorage.getItem('cruzzle-settings-v2');
  if (saved) {
    try { Object.assign(state.settings, JSON.parse(saved)); }
    catch { /* réglages par défaut */ }
  }

  state.photo = defaultPhoto();
  $('#prev0').src = state.photo.toDataURL('image/jpeg', 0.8);

  initSetup();
  initGameUi();

  // Langue : choix mémorisé, sinon langue du navigateur, sinon anglais
  const navLang = (navigator.language || 'en').slice(0, 2).toLowerCase();
  const startLang = localStorage.getItem('cruzzle-lang')
    || (I18N[navLang] ? navLang : 'en');
  $('#langSel').addEventListener('change', e => applyLang(e.target.value));
  applyLang(startLang);

  syncControls();

  // PWA : service worker pour le hors ligne (nécessite HTTP(S) ;
  // l'ouverture directe du fichier index.html reste possible sans lui)
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('sw.js').catch(() => { /* hors ligne dégradé */ });
  }
}

init();
