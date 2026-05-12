// ════════════════════════════════════════════════════════════
//  ÉTAT GLOBAL
// ════════════════════════════════════════════════════════════

var G = {};

function initialiserJeu() {
  G = {
    mode: 'jvj', phase: 'menu', tour: 1, dernierGagnant: null,
    joueurs: {
      j1: { nom: 'Alliés', cases: 0 },
      j2: { nom: 'Axe',    cases: 0 }
    },
    jeu: {
      quiJoue:'j1', phaseTour:'de', selection:null, enAction:null,
      ontAgi:[], enDefense:[], bloquesAttaque:[],
      actionsRestantes: ACTIONS_PAR_TOUR,
      uniteMoved: null
    },
    pl: { actif:'j1', choix:null,
      listJ1: copierUnites(), listJ2: copierUnites() },
    timer: { secondes:DUREE_TIMER, intervalle:null },
    tutoriel: { actif:false, etape:0 },
    grille: creerGrille()
  };
}

function copierUnites() {
  return UNITES_BASE.map(function(u) {
    return { type:u.type, lbl:u.lbl, f:u.f, dep:u.dep };
  });
}

function creerGrille() {
  var g = [];
  for (var l = 0; l < TAILLE; l++) {
    g[l] = [];
    for (var c = 0; c < TAILLE; c++) {
      var type = 'normal';
      if (CASES_BONUS.some(function(p){return p[0]===l&&p[1]===c;})) type = 'bonus';
      if (CASES_PIEGE.some(function(p){return p[0]===l&&p[1]===c;})) type = 'piege';
      g[l][c] = { unite:null, proprio:'neutre', type:type, revele:false };
    }
  }
  return g;
}
