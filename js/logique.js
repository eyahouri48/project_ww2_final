// ════════════════════════════════════════════════════════════
//  LOGIQUE DU JEU v3
//  + Cavalier ignore pièges · Tank distance 2 · Soldat formation
//  + Limite 2 actions · Passer la main tôt
// ════════════════════════════════════════════════════════════

function dansGrille(l,c){return l>=0&&l<TAILLE&&c>=0&&c<TAILLE;}
function compterCases(j){var n=0;for(var l=0;l<TAILLE;l++)for(var c=0;c<TAILLE;c++)if(G.grille[l][c].proprio===j)n++;return n;}
function compterUnites(j){var n=0;for(var l=0;l<TAILLE;l++)for(var c=0;c<TAILLE;c++)if(G.grille[l][c].unite&&G.grille[l][c].proprio===j)n++;return n;}
function aDejaAgi(l,c){return G.jeu.ontAgi.some(function(p){return p.l===l&&p.c===c;});}
function estEnDefense(l,c){return G.jeu.enDefense.some(function(p){return p.l===l&&p.c===c;});}
// Pénalité : unité qui a défendu au tour précédent, ne peut pas attaquer
function estBloqueAttaque(l,c){return G.jeu.bloquesAttaque.some(function(p){return p.l===l&&p.c===c;});}
function lancerDe(){return Math.floor(Math.random()*6)+1;}

// ── BONUS DE FORMATION : soldat +1 si allié adjacent ──
function bonusFormation(l,c){
  if(!G.grille[l][c].unite||G.grille[l][c].unite.type!=='soldat') return 0;
  var proprio=G.grille[l][c].proprio;
  for(var i=0;i<DIRECTIONS.length;i++){
    var nl=l+DIRECTIONS[i][0],nc=c+DIRECTIONS[i][1];
    if(dansGrille(nl,nc)&&G.grille[nl][nc].unite&&G.grille[nl][nc].proprio===proprio) return 1;
  }
  return 0;
}

// ── FORCE EFFECTIVE (avec toutes les capacités) ──
function forceEffective(l,c,estDef){
  var u=G.grille[l][c].unite, base=u.f;
  if(G.grille[l][c].revele&&G.grille[l][c].type==='bonus') base++;
  // Cavalier ignore les pièges
  if(G.grille[l][c].revele&&G.grille[l][c].type==='piege'&&u.type!=='cavalier') base--;
  // Soldat : +1 si allié adjacent (formation)
  base+=bonusFormation(l,c);
  // Défense
  if(estDef&&estEnDefense(l,c)) base++;
  return base;
}

// ── PLACEMENT ──
function selectionnerUnitePl(idx){
  G.pl.choix=idx; rafraichirPanneauPlacement(); retirerClasse('posable');
  var zone=G.pl.actif==='j1'?ZONE_J1:ZONE_J2;
  for(var l=0;l<TAILLE;l++)for(var c=0;c<TAILLE;c++)
    if(zone.includes(l)&&G.grille[l][c].unite===null) cel(l,c).classList.add('posable');
  msg(G.joueurs[G.pl.actif].nom+' : cliquez sur une case');
}
function peutPoser(l,c){
  if(G.phase!=='placement'||G.pl.choix===null) return false;
  var z=G.pl.actif==='j1'?ZONE_J1:ZONE_J2;
  return z.includes(l)&&G.grille[l][c].unite===null;
}
function poserUnite(l,c){
  var list=G.pl.actif==='j1'?G.pl.listJ1:G.pl.listJ2, u=list[G.pl.choix];
  G.grille[l][c].proprio=G.pl.actif;
  G.grille[l][c].unite={type:u.type,lbl:u.lbl,f:u.f,dep:u.dep};
  list.splice(G.pl.choix,1); G.pl.choix=null; retirerClasse('posable');
  G.pl.actif=G.pl.actif==='j1'?'j2':'j1';
  if(G.pl.listJ1.length===0&&G.pl.listJ2.length===0) demarrerJeu();
  else{rafraichirTout();if(G.mode==='jvo'&&G.pl.actif==='j2')setTimeout(iaPlacement,600);}
}
function iaPlacement(){
  var list=G.pl.listJ2;if(list.length===0)return;
  G.pl.choix=Math.floor(Math.random()*list.length);
  var libres=[];
  for(var l=0;l<TAILLE;l++)for(var c=0;c<TAILLE;c++)
    if(ZONE_J2.includes(l)&&G.grille[l][c].unite===null) libres.push({l:l,c:c});
  if(libres.length>0){var ch=libres[Math.floor(Math.random()*libres.length)];
    msg('🤖 déploie '+nomUnite(list[G.pl.choix].type)); poserUnite(ch.l,ch.c);}
}
function demarrerJeu(){
  G.phase='jeu';
  document.getElementById('ppl').classList.remove('visible');
  document.getElementById('ppl').innerHTML='';
  document.getElementById('pde').style.display='flex';
  document.getElementById('bs').style.display='';
  document.getElementById('bf').style.display='';
  msg('Déploiement terminé ! Lancez le dé.'); rafraichirTout();
}

// ── DÉ ET TOURS ──
function onLancer(){
  SON.jouer('de');
  var d1=lancerDe(),d2=lancerDe();
  document.getElementById('de1').innerHTML=svgDe(d1);
  document.getElementById('de2').innerHTML=svgDe(d2);
  if(d1===d2){document.getElementById('rde').textContent='Égalité — relance...';setTimeout(onLancer,900);return;}
  G.jeu.quiJoue=d1>d2?'j1':'j2';
  G.jeu.phaseTour='joue'; G.jeu.ontAgi=[];
  // NE PAS vider enDefense ici — les unités qui ont défendu gardent leur pénalité
  G.jeu.actionsRestantes=ACTIONS_PAR_TOUR; G.jeu.uniteMoved=null;
  var nom=G.joueurs[G.jeu.quiJoue].nom;
  document.getElementById('rde').textContent=nom+' commence';
  document.getElementById('bl').disabled=true;
  document.getElementById('bs').disabled=false;
  document.getElementById('bf').disabled=true;
  msg(nom+' : '+ACTIONS_PAR_TOUR+' actions'); rafraichirActif(); demarrerTimer();
  if(G.mode==='jvo'&&G.jeu.quiJoue==='j2') setTimeout(iaTour,DELAI_IA);
}
function onSuivant(){
  arreterTimer();
  G.jeu.quiJoue=G.jeu.quiJoue==='j1'?'j2':'j1';
  G.jeu.ontAgi=[]; G.jeu.selection=null; G.jeu.enAction=null; G.jeu.uniteMoved=null;
  G.jeu.actionsRestantes=ACTIONS_PAR_TOUR;
  retirerClasse('sel');retirerClasse('access');retirerClasse('attack');retirerClasse('captur');
  cacherAction();cacherCombat();
  document.getElementById('bs').disabled=true;
  document.getElementById('bf').disabled=false;
  msg(G.joueurs[G.jeu.quiJoue].nom+' : '+ACTIONS_PAR_TOUR+' actions');
  rafraichirActif(); rafraichirGrille(); demarrerTimer();
  if(G.mode==='jvo'&&G.jeu.quiJoue==='j2') setTimeout(iaTour,DELAI_IA);
}
function onFinTour(){
  arreterTimer(); G.tour++;
  G.jeu.phaseTour='de'; G.jeu.ontAgi=[]; G.jeu.enDefense=[];
  G.jeu.selection=null; G.jeu.enAction=null; G.jeu.uniteMoved=null;
  G.jeu.actionsRestantes=ACTIONS_PAR_TOUR;
  retirerClasse('sel');retirerClasse('access');retirerClasse('attack');retirerClasse('captur');
  cacherAction();cacherCombat();
  document.getElementById('de1').innerHTML=svgDeVide();
  document.getElementById('de2').innerHTML=svgDeVide();
  document.getElementById('rde').textContent='';
  document.getElementById('bl').disabled=false;
  document.getElementById('bs').disabled=true;
  document.getElementById('bf').disabled=true;
  afficherTimer(DUREE_TIMER); msg('Tour '+G.tour+' — Lancez le dé');
  rafraichirScores(); rafraichirActif(); rafraichirGrille();
}

// ── TIMER ──
function demarrerTimer(){
  arreterTimer(); G.timer.secondes=DUREE_TIMER; afficherTimer(G.timer.secondes);
  G.timer.intervalle=setInterval(function(){
    G.timer.secondes--; afficherTimer(G.timer.secondes);
    if(G.timer.secondes<=10&&G.timer.secondes>0)SON.jouer('tick');
    if(G.timer.secondes<=0){arreterTimer();msg('⏰ Temps écoulé !');
      if(!document.getElementById('bs').disabled)onSuivant();
      else if(!document.getElementById('bf').disabled)onFinTour();}
  },1000);
}
function arreterTimer(){if(G.timer.intervalle!==null){clearInterval(G.timer.intervalle);G.timer.intervalle=null;}}

// ── MOUVEMENT ──
function casesAccessibles(ld,cd){
  var u=G.grille[ld][cd].unite,res=[];
  DIRECTIONS.forEach(function(d){
    for(var p=1;p<=u.dep;p++){var nl=ld+d[0]*p,nc=cd+d[1]*p;
      if(!dansGrille(nl,nc)||G.grille[nl][nc].unite!==null)break;
      res.push({l:nl,c:nc});}
  });return res;
}
function deplacerUnite(ld,cd,la,ca){
  var dep=G.grille[ld][cd],arr=G.grille[la][ca],typeU=dep.unite.type;
  arr.unite=dep.unite; arr.proprio=G.jeu.quiJoue; dep.unite=null;
  G.jeu.selection=null; retirerClasse('sel');retirerClasse('access');
  // Mettre à jour la position dans bloquesAttaque si l'unité a une pénalité
  G.jeu.bloquesAttaque=G.jeu.bloquesAttaque.map(function(p){
    if(p.l===ld&&p.c===cd) return{l:la,c:ca,tour:p.tour};
    return p;
  });
  // Marquer que cette unité a BOUGÉ
  G.jeu.uniteMoved={l:la,c:ca};
  rafraichirGrille();
  if(!arr.revele&&(arr.type==='bonus'||arr.type==='piege')) arr.revele=true;
  if(arr.type==='bonus'&&arr.revele){SON.jouer('bonus');msg('⭐ Bonus +1 !');}
  else if(arr.type==='piege'&&arr.revele){
    if(typeU==='cavalier'){SON.jouer('move');msg('🐴 Cavalier ignore le piège !');}
    else{SON.jouer('piege');msg('💀 Piège -1 !');}
  } else{SON.jouer('move');msg('Unité déplacée — choisissez action');}
  entrerEnAction(la,ca);
}

// ── CASES ATTAQUABLES (tank: distance 2 en ligne droite) ──
// Si l'unité a défendu au tour précédent → attaque bloquée
function casesAttaquables(l,c){
  // Pénalité défense : unité bloquée ne peut pas attaquer
  if(estBloqueAttaque(l,c)) return [];
  var u=G.grille[l][c].unite, res=[], portee=(u.type==='tank')?PORTEE_ATTAQUE_TANK:1;
  DIRECTIONS.forEach(function(d){
    for(var p=1;p<=portee;p++){
      var nl=l+d[0]*p, nc=c+d[1]*p;
      if(!dansGrille(nl,nc)) break;
      if(G.grille[nl][nc].unite&&G.grille[nl][nc].proprio!==G.jeu.quiJoue){
        res.push({l:nl,c:nc}); break; // on s'arrête au premier ennemi
      }
      if(G.grille[nl][nc].unite) break; // allié bloque la ligne
    }
  });
  return res;
}
function casesCapturables(l,c){
  var res=[];
  // Capture uniquement adjacente (même pour le tank)
  DIRECTIONS.forEach(function(d){var nl=l+d[0],nc=c+d[1];
    if(dansGrille(nl,nc)&&G.grille[nl][nc].proprio==='neutre'&&!G.grille[nl][nc].unite) res.push({l:nl,c:nc});});
  return res;
}

// ── COMBAT ──
function resoudreCombat(la,ca,ld,cd){
  var uA=G.grille[la][ca].unite,uD=G.grille[ld][cd].unite;
  var dA=lancerDe(),dD=lancerDe();
  var fA=forceEffective(la,ca,false),fD=forceEffective(ld,cd,true);
  var sA=dA+fA,sD=dD+fD,g;
  if(sA>sD){g='att';G.grille[ld][cd].unite=null;G.grille[ld][cd].proprio=G.jeu.quiJoue;SON.jouer('attaque');}
  else if(sD>sA){g='def';SON.jouer('defense');}else{g='egal';SON.jouer('defense');}
  afficherCombat(uA,dA,fA,sA,uD,dD,fD,sD,g);
  terminerAction(la,ca); rafraichirScores(); rafraichirGrille(); verifierVictoire();
}
function capturerCase(la,ca,lc,cc){
  G.grille[lc][cc].proprio=G.jeu.quiJoue; SON.jouer('capture');
  terminerAction(la,ca); rafraichirScores(); rafraichirGrille(); cacherCombat();
  msg('Case capturée !'); verifierVictoire();
}

// ── TERMINER ACTION (limite 2 actions) ──
function terminerAction(l,c){
  G.jeu.ontAgi.push({l:l,c:c}); G.jeu.actionsRestantes--;
  G.jeu.enAction=null; G.jeu.selection=null; G.jeu.uniteMoved=null;
  // Purger SEULEMENT les pénalités des tours PRÉCÉDENTS (pas celui en cours)
  G.jeu.bloquesAttaque=G.jeu.bloquesAttaque.filter(function(p){
    if(p.l===l&&p.c===c&&p.tour<G.tour) return false; // purger l'ancienne pénalité
    return true;
  });
  retirerClasse('sel');retirerClasse('access');retirerClasse('attack');retirerClasse('captur');
  cacherAction();
  if(G.jeu.actionsRestantes<=0) msg(G.joueurs[G.jeu.quiJoue].nom+' : tour terminé ('+ACTIONS_PAR_TOUR+' actions)');
  else msg(G.joueurs[G.jeu.quiJoue].nom+' : '+G.jeu.actionsRestantes+' action'+(G.jeu.actionsRestantes>1?'s':'')+' restante'+(G.jeu.actionsRestantes>1?'s':''));
}
function entrerEnAction(l,c){
  G.jeu.enAction={l:l,c:c}; cel(l,c).classList.add('sel');
  var att=casesAttaquables(l,c),cap=casesCapturables(l,c);
  // Si l'unité a sa pénalité défense, montrer un avertissement
  if(estBloqueAttaque(l,c)) msg('⚠ Attaque bloquée (défense tour précédent)');
  att.forEach(function(p){cel(p.l,p.c).classList.add('attack');});
  cap.forEach(function(p){cel(p.l,p.c).classList.add('captur');});
  afficherPanneauAction(l,c,att,cap);
}
function annulerAction(){
  // Si l'unité a DÉJÀ BOUGÉ, on ne peut pas annuler → auto-passer
  if(G.jeu.uniteMoved){
    var m=G.jeu.uniteMoved;
    G.jeu.uniteMoved=null;
    retirerClasse('sel');retirerClasse('access');retirerClasse('attack');retirerClasse('captur');
    cacherAction();
    SON.jouer('passer');
    terminerAction(m.l,m.c);
    msg('Action passée (déplacement déjà effectué)');
    return;
  }
  // Sinon annulation normale (pas de mouvement effectué)
  G.jeu.enAction=null;G.jeu.selection=null;
  retirerClasse('sel');retirerClasse('access');retirerClasse('attack');retirerClasse('captur');
  cacherAction();msg('Action annulée.');
}

// ── SÉLECTION ──
function selectionnerUniteJeu(l,c){
  if(G.jeu.actionsRestantes<=0){msg('Plus d\'actions !');return;}
  var j=G.jeu,la=G.grille[l][c];
  if(la.proprio!==j.quiJoue){msg('Pas votre unité !');return;}
  if(aDejaAgi(l,c)){msg('Déjà joué.');return;}
  retirerClasse('sel');retirerClasse('access');
  j.selection={l:l,c:c}; cel(l,c).classList.add('sel'); SON.jouer('select');
  var acc=casesAccessibles(l,c);
  acc.forEach(function(p){cel(p.l,p.c).classList.add('access');});
  msg(nomUnite(la.unite.type)+' sélectionné');
}

// ── CLIC GRILLE ──
function clicCase(l,c){
  if(G.mode==='jvo'&&G.jeu.quiJoue==='j2'&&G.phase==='jeu') return;
  if(G.phase==='placement'){
    if(peutPoser(l,c))poserUnite(l,c);
    else if(G.pl.choix===null)msg('Choisissez une unité');
    else msg('Case invalide !'); return;
  }
  if(G.jeu.phaseTour==='de'){msg('Lancez le dé !');return;}
  var j=G.jeu,la=G.grille[l][c];
  if(j.enAction){
    if(cel(l,c).classList.contains('attack')){resoudreCombat(j.enAction.l,j.enAction.c,l,c);return;}
    if(cel(l,c).classList.contains('captur')){capturerCase(j.enAction.l,j.enAction.c,l,c);return;}
    annulerAction();return;
  }
  if(j.selection){
    if(cel(l,c).classList.contains('access')){deplacerUnite(j.selection.l,j.selection.c,l,c);return;}
    if(l===j.selection.l&&c===j.selection.c){j.selection=null;retirerClasse('access');G.jeu.uniteMoved=null;entrerEnAction(l,c);return;}
    if(la.unite&&la.proprio===j.quiJoue&&!aDejaAgi(l,c)&&j.actionsRestantes>0){
      j.selection=null;retirerClasse('sel');retirerClasse('access');selectionnerUniteJeu(l,c);return;}
    j.selection=null;retirerClasse('sel');retirerClasse('access');msg('Sélection annulée.');return;
  }
  if(la.unite&&la.proprio===j.quiJoue) selectionnerUniteJeu(l,c);
}

// ── VICTOIRE ──
function verifierVictoire(){
  var c1=compterCases('j1'),c2=compterCases('j2'),u1=compterUnites('j1'),u2=compterUnites('j2');
  var g=null,r='';
  if(c1>=SEUIL_VICTOIRE){g='j1';r=c1+' cases';}
  if(c2>=SEUIL_VICTOIRE){g='j2';r=c2+' cases';}
  if(u2===0&&u1>0){g='j1';r='Forces adverses éliminées';}
  if(u1===0&&u2>0){g='j2';r='Forces adverses éliminées';}
  if(g){arreterTimer();G.dernierGagnant=g;SON.jouer('victoire');
    document.getElementById('vt').textContent='🏆 '+G.joueurs[g].nom+' — Victoire !';
    document.getElementById('vs').textContent=r+' · Tour '+G.tour;
    document.getElementById('ev').classList.add('visible');}
}

// ════════════════════════════════════════════════════════════
//  IA (mise à jour : 2 actions, tank distance, formation)
// ════════════════════════════════════════════════════════════
function iaTour(){
  if(G.jeu.actionsRestantes<=0){setTimeout(function(){
    if(!document.getElementById('bs').disabled)onSuivant();
    else if(!document.getElementById('bf').disabled)onFinTour();},800);return;}
  var dispo=[];
  for(var l=0;l<TAILLE;l++)for(var c=0;c<TAILLE;c++)
    if(G.grille[l][c].unite&&G.grille[l][c].proprio==='j2'&&!aDejaAgi(l,c))dispo.push({l:l,c:c});
  if(dispo.length===0){setTimeout(function(){
    if(!document.getElementById('bs').disabled)onSuivant();
    else if(!document.getElementById('bf').disabled)onFinTour();},800);return;}
  var best=null,bestS=-999;
  for(var i=0;i<dispo.length;i++){var a=evaluerUnite(dispo[i].l,dispo[i].c);if(a.score>bestS){bestS=a.score;best=a;}}
  if(DIFFICULTE==='facile'&&Math.random()<TAUX_ERREUR_IA){
    var u=dispo[Math.floor(Math.random()*dispo.length)];
    best={type:'passer',l:u.l,c:u.c,score:0};
    var dep=casesAccessibles(u.l,u.c);
    if(dep.length>0&&Math.random()>.5){var d=dep[Math.floor(Math.random()*dep.length)];
      best={type:'deplacer',l:u.l,c:u.c,destL:d.l,destC:d.c,score:1};}}
  if(best)executerActionIA(best);
}
function evaluerUnite(l,c){
  var best={type:'passer',l:l,c:c,score:0};
  var att=casesAttaquables(l,c);
  for(var a=0;a<att.length;a++){var ci=att[a];var mf=forceEffective(l,c,false);var sf=G.grille[ci.l][ci.c].unite.f;
    var s=10+(mf-sf)*3;
    if(DIFFICULTE==='difficile'&&casesAttaquablesDepuis(ci.l,ci.c)<=1)s+=3;
    if(s>best.score)best={type:'attaquer',l:l,c:c,cibleL:ci.l,cibleC:ci.c,score:s};}
  var dep=casesAccessibles(l,c);
  for(var d=0;d<dep.length;d++){var de=dep[d];var dc=Math.abs(de.l-3.5)+Math.abs(de.c-3.5);var sp=7-dc;
    if(G.grille[de.l][de.c].type==='bonus')sp+=4;
    if(G.grille[de.l][de.c].type==='piege'&&G.grille[de.l][de.c].revele&&G.grille[l][c].unite.type!=='cavalier')sp-=3;
    // IA vérifie bonus formation pour soldat
    if(G.grille[l][c].unite.type==='soldat'){var adj=0;
      DIRECTIONS.forEach(function(dir){var nl2=de.l+dir[0],nc2=de.c+dir[1];
        if(dansGrille(nl2,nc2)&&G.grille[nl2][nc2].unite&&G.grille[nl2][nc2].proprio==='j2')adj++;});
      if(adj>0)sp+=3;}
    sp+=casesCapturablesDepuis(de.l,de.c)*2;
    if(DIFFICULTE==='difficile')sp-=compterMenacesDepuis(de.l,de.c)*2;
    if(sp>best.score)best={type:'deplacer',l:l,c:c,destL:de.l,destC:de.c,score:sp};}
  var cap=casesCapturables(l,c);
  for(var cp=0;cp<cap.length;cp++){var sc=5+(4-Math.abs(cap[cp].l-3.5)-Math.abs(cap[cp].c-3.5));
    if(sc>best.score)best={type:'capturer',l:l,c:c,capL:cap[cp].l,capC:cap[cp].c,score:sc};}
  // Défendre : +1 si attaqué MAIS bloque attaque au prochain tour
  // Score réduit car pénalité lourde. Seulement si menacé ET pas déjà en défense.
  if(att.length>0&&!estEnDefense(l,c)&&!estBloqueAttaque(l,c)){
    var sd=1; // score faible car sacrifie le prochain tour
    if(DIFFICULTE==='facile') sd=3; // IA facile défend plus souvent (naïve)
    if(DIFFICULTE==='difficile'&&G.grille[l][c].type==='bonus') sd=4; // protège un bonus
    if(DIFFICULTE==='difficile'&&compterMenacesDepuis(l,c)>=2) sd=5; // très menacé
    if(sd>best.score)best={type:'defendre',l:l,c:c,score:sd};
  }
  return best;
}
function casesCapturablesDepuis(l,c){var n=0;DIRECTIONS.forEach(function(d){var nl=l+d[0],nc=c+d[1];if(dansGrille(nl,nc)&&G.grille[nl][nc].proprio==='neutre'&&!G.grille[nl][nc].unite)n++;});return n;}
function casesAttaquablesDepuis(l,c){var n=0;DIRECTIONS.forEach(function(d){var nl=l+d[0],nc=c+d[1];if(dansGrille(nl,nc)&&G.grille[nl][nc].unite&&G.grille[nl][nc].proprio!=='j2')n++;});return n;}
function compterMenacesDepuis(l,c){var n=0;DIRECTIONS.forEach(function(d){var nl=l+d[0],nc=c+d[1];if(dansGrille(nl,nc)&&G.grille[nl][nc].unite&&G.grille[nl][nc].proprio==='j1')n++;});return n;}
function executerActionIA(action){
  var u=G.grille[action.l][action.c].unite,n=nomUnite(u.type);
  switch(action.type){
    case 'attaquer':msg('🤖 '+n+' attaque');
      setTimeout(function(){resoudreCombat(action.l,action.c,action.cibleL,action.cibleC);setTimeout(iaTour,DELAI_IA);},DELAI_IA);break;
    case 'deplacer':msg('🤖 '+n+' se déplace');
      setTimeout(function(){deplacerUnite(action.l,action.c,action.destL,action.destC);
        setTimeout(function(){iaActionApresDeplacer(action.destL,action.destC);},DELAI_IA);},DELAI_IA);break;
    case 'capturer':msg('🤖 '+n+' capture');
      setTimeout(function(){capturerCase(action.l,action.c,action.capL,action.capC);setTimeout(iaTour,DELAI_IA);},DELAI_IA);break;
    case 'defendre':msg('🤖 '+n+' défend 🛡');
      setTimeout(function(){G.jeu.enDefense.push({l:action.l,c:action.c});G.jeu.bloquesAttaque.push({l:action.l,c:action.c,tour:G.tour});terminerAction(action.l,action.c);rafraichirGrille();setTimeout(iaTour,DELAI_IA);},DELAI_IA);break;
    default:msg('🤖 '+n+' passe');
      setTimeout(function(){terminerAction(action.l,action.c);setTimeout(iaTour,DELAI_IA);},DELAI_IA);break;}
}
function iaActionApresDeplacer(l,c){
  var att=casesAttaquables(l,c),cap=casesCapturables(l,c);
  if(att.length>0){var ci=att[0];var mf=forceEffective(l,c,false);
    if(mf>=G.grille[ci.l][ci.c].unite.f||DIFFICULTE==='difficile'){
      resoudreCombat(l,c,ci.l,ci.c);setTimeout(iaTour,DELAI_IA);return;}}
  if(cap.length>0){capturerCase(l,c,cap[0].l,cap[0].c);setTimeout(iaTour,DELAI_IA);return;}
  terminerAction(l,c);cacherAction();cacherCombat();setTimeout(iaTour,DELAI_IA);
}
function onRejouer(){
  arreterTimer();
  document.getElementById('ev').classList.remove('visible');
  document.getElementById('ppl').classList.remove('visible');
  document.getElementById('ppl').innerHTML='';
  document.getElementById('pde').style.display='none';
  document.getElementById('bs').style.display='none';
  document.getElementById('bf').style.display='none';
  document.getElementById('em').classList.add('visible');
  document.getElementById('smd').classList.remove('visible');
  document.getElementById('grille').innerHTML='';
  cacherAction();cacherCombat(); initialiserJeu();
}
