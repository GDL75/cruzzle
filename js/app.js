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
    bonusLine1: '+{pts} pts bonus — 1 tile kept intact ({level})',
    bonusLineN: '+{pts} pts bonus — {n} tiles kept intact ({level})',
    multLine: 'Active transformations: {n}/6 → score ×{mult}',
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
    bonusLine1: '+{pts} pts bonus — 1 vignette intacte ({level})',
    bonusLineN: '+{pts} pts bonus — {n} vignettes intactes ({level})',
    multLine: 'Transformations actives : {n}/6 → score ×{mult}',
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
    bonusLine1: '+{pts} pts bonus — 1 ficha intacta ({level})',
    bonusLineN: '+{pts} pts bonus — {n} fichas intactas ({level})',
    multLine: 'Transformaciones activas: {n}/6 → puntuación ×{mult}',
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
    bonusLine1: '+{pts} Punkte Bonus — 1 unberührte Kachel ({level})',
    bonusLineN: '+{pts} Punkte Bonus — {n} unberührte Kacheln ({level})',
    multLine: 'Aktive Transformationen: {n}/6 → Punktzahl ×{mult}',
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

const PTS_PER_TILE = 10;                              // par vignette résolue
const PTS_PER_MOVE = 1;                                // malus par coup joué
const BONUS_UNCLEANED = { 1: 10, 2: 25, 3: 45 };       // par vignette jamais nettoyée, selon fxLevel
const LEVEL_NAME_KEY = { 1: 'presetFacile', 2: 'presetMoyen', 3: 'presetDifficile' };

// Moins de transformations actives = puzzle plus simple = score réduit.
const TRANSFORM_KEYS = ['rot', 'flip', 'blur', 'pix', 'nb', 'inv'];
const MULT_MIN = 0.4;   // multiplicateur si aucune transformation n'est active

function transformMultiplier(s) {
  const enabled = TRANSFORM_KEYS.filter(k => s[k]).length;
  return MULT_MIN + (1 - MULT_MIN) * (enabled / TRANSFORM_KEYS.length);
}

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
  const bonusTiles = g.tiles.filter(t => isSolved(t) && t.fx).length;
  const bonusPts = bonusTiles * (BONUS_UNCLEANED[s.fxLevel] || BONUS_UNCLEANED[2]);
  const basePts = okTiles * PTS_PER_TILE;
  const movesMalus = g.moves * PTS_PER_MOVE;
  const mult = transformMultiplier(s);

  const elapsed = Math.floor((Date.now() - g.start) / 1000);
  const zeroed = s.fxLevel === 1 && elapsed >= (FACILE_ZERO_AT[s.cols] ?? Infinity);

  return {
    total: zeroed ? 0 : Math.round(Math.max(0, basePts + bonusPts - movesMalus) * mult),
    bonusTiles, bonusPts, mult, zeroed,
    activeCount: TRANSFORM_KEYS.filter(k => s[k]).length,
    levelKey: LEVEL_NAME_KEY[s.fxLevel] || LEVEL_NAME_KEY[2],
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

  // Mélange des positions (jamais la permutation identité)
  let perm;
  do { perm = shuffle([...Array(total).keys()]); }
  while (perm.every((v, i) => v === i));
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

    const bonusLine = $('#winBonus');
    const multLine = $('#winMult');
    const zeroedLine = $('#winZeroed');

    if (sc.zeroed) {
      // Score nul (niveau Facile, délai dépassé) : les autres lignes de détail
      // n'ont plus de sens puisqu'elles n'expliqueraient pas un total à 0.
      bonusLine.classList.add('hidden');
      multLine.classList.add('hidden');
      const mins = Math.round((FACILE_ZERO_AT[state.settings.cols] ?? 0) / 60);
      zeroedLine.textContent = tf('zeroedLine', { min: mins });
      zeroedLine.classList.remove('hidden');
    } else {
      zeroedLine.classList.add('hidden');

      if (sc.bonusTiles > 0) {
        bonusLine.textContent = tf(sc.bonusTiles === 1 ? 'bonusLine1' : 'bonusLineN',
          { pts: sc.bonusPts, n: sc.bonusTiles, level: t(sc.levelKey) });
        bonusLine.classList.remove('hidden');
      } else {
        bonusLine.classList.add('hidden');
      }

      if (sc.mult < 1) {
        multLine.textContent = tf('multLine', { n: sc.activeCount, mult: sc.mult.toFixed(2) });
        multLine.classList.remove('hidden');
      } else {
        multLine.classList.add('hidden');
      }
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
