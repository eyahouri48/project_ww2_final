// ════════════════════════════════════════════════════════════
//  CONSTANTES DU JEU v3
// ════════════════════════════════════════════════════════════

var TAILLE = 8;
var SEUIL_VICTOIRE = 33;
var ACTIONS_PAR_TOUR = 2;       // limite d'actions par joueur par tour
var PORTEE_ATTAQUE_TANK = 2;    // le tank attaque à distance 2 en ligne droite

var ZONE_J1 = [6, 7];
var ZONE_J2 = [0, 1];
var DIRECTIONS = [[-1,0],[1,0],[0,-1],[0,1]];

var CASES_BONUS = [[2,3],[3,5],[4,2],[5,6],[3,1],[4,4]];
var CASES_PIEGE = [[2,5],[3,2],[4,6],[5,1],[3,4],[4,3]];

var UNITES_BASE = [
  { type:'tank',     lbl:'Tank',     f:3, dep:1 },
  { type:'soldat',   lbl:'Soldat',   f:2, dep:1 },
  { type:'soldat',   lbl:'Soldat',   f:2, dep:1 },
  { type:'cavalier', lbl:'Cavalier', f:1, dep:2 },
  { type:'cavalier', lbl:'Cavalier', f:1, dep:2 }
];

// ── DIFFICULTÉ IA ──
var DIFFICULTE = 'normal';
var DUREE_TIMER = 45;
var DELAI_IA = 1400;
var TAUX_ERREUR_IA = 0;

function appliquerDifficulte(n) {
  DIFFICULTE = n;
  if (n === 'facile')    { DUREE_TIMER=60; DELAI_IA=1800; TAUX_ERREUR_IA=0.35; }
  else if (n === 'normal')    { DUREE_TIMER=45; DELAI_IA=1400; TAUX_ERREUR_IA=0; }
  else if (n === 'difficile') { DUREE_TIMER=30; DELAI_IA=1200; TAUX_ERREUR_IA=0; }
}
