// ════════════════════════════════════════════════════════════
//  AFFICHAGE v3 — SVG pièces, dés, timer, tutoriel
// ════════════════════════════════════════════════════════════

function cel(l,c){return document.getElementById('c-'+l+'-'+c);}
function msg(txt){document.getElementById('msg').textContent=txt;}
function retirerClasse(cls){document.querySelectorAll('.'+cls).forEach(function(el){el.classList.remove(cls);});}

function toggleTheme(){
  var h=document.documentElement,t=h.getAttribute('data-theme')==='dark'?'light':'dark';
  h.setAttribute('data-theme',t);document.getElementById('bt').textContent=t==='dark'?'☀':'🌙';
}

// ═══ SVG PIÈCES D'ÉCHECS MILITAIRES ═══
function couleursPiece(camp){
  if(camp==='j1') return{fill:'#e8e3d6',stroke:'#555',accent:'#8694a8'};
  return{fill:'#1a1a1a',stroke:'#888',accent:'#555'};
}
function svgTank(camp){
  var c=couleursPiece(camp);
  return '<svg class="u-piece" viewBox="0 0 45 45">'
    +'<rect x="8" y="37" width="29" height="5" rx="1.5" fill="'+c.fill+'" stroke="'+c.stroke+'" stroke-width="1.2"/>'
    +'<rect x="10" y="34" width="25" height="4" rx="1" fill="'+c.fill+'" stroke="'+c.stroke+'" stroke-width="1"/>'
    +'<path d="M12 34 L10 22 H35 L33 34 Z" fill="'+c.fill+'" stroke="'+c.stroke+'" stroke-width="1.2"/>'
    +'<rect x="15" y="16" width="15" height="8" rx="2" fill="'+c.fill+'" stroke="'+c.stroke+'" stroke-width="1.2"/>'
    +'<rect x="30" y="18" width="10" height="3.5" rx="1.5" fill="'+c.fill+'" stroke="'+c.stroke+'" stroke-width="1"/>'
    +'<circle cx="14" cy="36" r="1.5" fill="'+c.accent+'"/><circle cx="20" cy="36" r="1.5" fill="'+c.accent+'"/>'
    +'<circle cx="26" cy="36" r="1.5" fill="'+c.accent+'"/><circle cx="32" cy="36" r="1.5" fill="'+c.accent+'"/>'
    +'<circle cx="22.5" cy="28" r="2.5" fill="none" stroke="'+c.accent+'" stroke-width=".7"/></svg>';
}
function svgSoldat(camp){
  var c=couleursPiece(camp);
  return '<svg class="u-piece" viewBox="0 0 45 45">'
    +'<ellipse cx="22.5" cy="40" rx="11" ry="3" fill="'+c.fill+'" stroke="'+c.stroke+'" stroke-width="1.2"/>'
    +'<path d="M16 25 H29 Q30 30 31 37 H14 Q15 30 16 25 Z" fill="'+c.fill+'" stroke="'+c.stroke+'" stroke-width="1.2"/>'
    +'<rect x="16" y="29" width="13" height="2" rx=".5" fill="'+c.accent+'" opacity=".6"/>'
    +'<rect x="19" y="19" width="7" height="7" rx="1" fill="'+c.fill+'" stroke="'+c.stroke+'" stroke-width="1"/>'
    +'<circle cx="22.5" cy="14" r="6" fill="'+c.fill+'" stroke="'+c.stroke+'" stroke-width="1.2"/>'
    +'<path d="M16.5 14 Q16 8 22.5 6 Q29 8 28.5 14" fill="'+c.fill+'" stroke="'+c.stroke+'" stroke-width="1.2"/>'
    +'<line x1="16" y1="15" x2="29" y2="15" stroke="'+c.stroke+'" stroke-width="1"/></svg>';
}
function svgCavalier(camp){
  var c=couleursPiece(camp);
  return '<svg class="u-piece" viewBox="0 0 45 45">'
    +'<ellipse cx="22.5" cy="40" rx="11" ry="3" fill="'+c.fill+'" stroke="'+c.stroke+'" stroke-width="1.2"/>'
    +'<path d="M14 37 L12 40 H33 L31 37 Z" fill="'+c.fill+'" stroke="'+c.stroke+'" stroke-width="1"/>'
    +'<path d="M15 37 L14 28 Q14 22 18 18 L27 18 Q31 22 31 28 L30 37 Z" fill="'+c.fill+'" stroke="'+c.stroke+'" stroke-width="1"/>'
    +'<path d="M17 20 Q15 14 14 10 Q13 6 18 4 L20 4 Q22 6 22 10 L24 18 Z" fill="'+c.fill+'" stroke="'+c.stroke+'" stroke-width="1.2"/>'
    +'<path d="M14 10 Q10 9 9 12 Q8 15 11 16 L14 14 Z" fill="'+c.fill+'" stroke="'+c.stroke+'" stroke-width="1.2"/>'
    +'<path d="M16 5 L14 2 L18 4" fill="'+c.fill+'" stroke="'+c.stroke+'" stroke-width=".8"/>'
    +'<circle cx="12" cy="11" r="1" fill="'+c.stroke+'"/>'
    +'<path d="M18 4 Q20 8 20 14 L18 14 Q17 8 17 5" fill="'+c.accent+'" opacity=".4"/></svg>';
}
function svgUnite(type,camp){
  if(type==='tank')return svgTank(camp);if(type==='soldat')return svgSoldat(camp);
  if(type==='cavalier')return svgCavalier(camp);return '';
}
function nomUnite(type){
  if(type==='tank')return 'Tank';if(type==='soldat')return 'Soldat';
  if(type==='cavalier')return 'Cavalier';return type;
}

// ═══ SVG DÉS ═══
function svgDe(v){
  var pts={1:[[20,20]],2:[[12,12],[28,28]],3:[[12,12],[20,20],[28,28]],
    4:[[12,12],[28,12],[12,28],[28,28]],5:[[12,12],[28,12],[20,20],[12,28],[28,28]],
    6:[[12,12],[28,12],[12,20],[28,20],[12,28],[28,28]]};
  var s='<svg viewBox="0 0 40 40" width="32" height="32"><rect x="2" y="2" width="36" height="36" rx="5" fill="var(--bg-cell-alt)" stroke="var(--gold)" stroke-width="1.5"/>';
  (pts[v]||[]).forEach(function(p){s+='<circle cx="'+p[0]+'" cy="'+p[1]+'" r="3.5" fill="var(--txt2)"/>';});
  return s+'</svg>';
}
function svgDeVide(){
  return '<svg viewBox="0 0 40 40" width="32" height="32"><rect x="2" y="2" width="36" height="36" rx="5" fill="var(--bg-cell-alt)" stroke="var(--border2)" stroke-width="1.5" stroke-dasharray="4 3"/><text x="20" y="24" text-anchor="middle" font-size="14" fill="var(--txt-vdim)">?</text></svg>';
}

// ═══ RAFRAÎCHIR ═══
function rafraichirTout(){rafraichirScores();rafraichirGrille();rafraichirActif();
  if(G.phase==='placement')rafraichirPanneauPlacement();}
function rafraichirScores(){
  G.joueurs.j1.cases=compterCases('j1');G.joueurs.j2.cases=compterCases('j2');
  document.getElementById('nb1').textContent=G.joueurs.j1.cases;
  document.getElementById('nb2').textContent=G.joueurs.j2.cases;
  document.getElementById('nu1').textContent=compterUnites('j1');
  document.getElementById('nu2').textContent=compterUnites('j2');
  document.getElementById('tour-lbl').textContent='Tour '+G.tour;
}
function rafraichirActif(){
  var ja=G.phase==='placement'?G.pl.actif:G.jeu.quiJoue;
  document.getElementById('sc1').classList.toggle('on',ja==='j1');
  document.getElementById('sc2').classList.toggle('on',ja==='j2');
  document.getElementById('n2').textContent=G.joueurs.j2.nom;
}
function rafraichirGrille(){
  for(var l=0;l<TAILLE;l++)for(var c=0;c<TAILLE;c++){
    var el=cel(l,c),ca=G.grille[l][c];
    el.classList.remove('ow1','ow2','bonus','piege');
    if(ca.proprio==='j1')el.classList.add('ow1');
    if(ca.proprio==='j2')el.classList.add('ow2');
    if(ca.revele&&ca.type==='bonus')el.classList.add('bonus');
    if(ca.revele&&ca.type==='piege')el.classList.add('piege');
    afficherUnite(el,ca.unite,ca.proprio,l,c);
  }
}
function afficherUnite(el,unite,proprio,l,c){
  var old=el.querySelector('.u-wrap');if(old)old.remove();
  var ob=el.querySelector('.u-badge');if(ob)ob.remove();
  if(!unite)return;
  var wrap=document.createElement('div');wrap.className='u-wrap';
  var forceAff=unite.f;
  // Indicateur force effective
  var bf=bonusFormation(l,c);
  var lblForce='+'+unite.f;
  if(bf>0) lblForce='+'+unite.f+' <span style="color:var(--vert);font-size:6px">⬆+'+bf+'</span>';
  wrap.innerHTML=svgUnite(unite.type,proprio)+'<span class="u-f">'+lblForce+'</span>';
  el.appendChild(wrap);
  // Badges : 🛡 si en défense (ce tour) ou bloqué attaque (tour suivant)
  var badges='';
  if(estEnDefense(l,c)||estBloqueAttaque(l,c)) badges+='<div class="badge-sh">🛡</div>';
  if(badges){var bd=document.createElement('div');bd.className='u-badge';bd.innerHTML=badges;el.appendChild(bd);}
}

// ═══ PLACEMENT ═══
function rafraichirPanneauPlacement(){
  var pl=G.pl,j=G.joueurs[pl.actif],list=pl.actif==='j1'?pl.listJ1:pl.listJ2;
  var cont=document.getElementById('ppl');cont.innerHTML='';cont.classList.add('visible');
  if(G.mode==='jvo'&&pl.actif==='j2'){cont.innerHTML='<span id="tpl">🤖 IA déploie...</span>';return;}
  var titre=document.createElement('span');titre.id='tpl';
  titre.textContent=j.nom+' · '+list.length+' restante'+(list.length>1?'s':'');cont.appendChild(titre);
  list.forEach(function(u,i){
    var btn=document.createElement('button');
    btn.className='bu'+(pl.choix===i?' ch':'');
    btn.innerHTML=nomUnite(u.type)+' <span class="f" style="font-size:7px;color:var(--txt-dim)">+'+u.f+'</span>';
    btn.onclick=function(){selectionnerUnitePl(i);};cont.appendChild(btn);
  });
}

// ═══ PANNEAU ACTION ═══
function afficherPanneauAction(l,c,att,cap){
  var pan=document.getElementById('pa');pan.classList.add('visible');
  var u=G.grille[l][c].unite;
  pan.innerHTML='<span id="ta">'+nomUnite(u.type)+' ('+l+','+c+')</span>';
  if(att.length>0) pan.appendChild(btnAct('⚔ Attaquer','att',function(){
    if(att.length===1)resoudreCombat(l,c,att[0].l,att[0].c);else msg('Cliquez un ennemi rouge');}));
  if(cap.length>0) pan.appendChild(btnAct('⚑ Capturer','def',function(){
    if(cap.length===1)capturerCase(l,c,cap[0].l,cap[0].c);else msg('Cliquez une case orange');}));
  pan.appendChild(btnAct('🛡 Défendre','def',function(){
    G.jeu.enDefense.push({l:l,c:c});
    G.jeu.bloquesAttaque.push({l:l,c:c,tour:G.tour});
    SON.jouer('defense');
    terminerAction(l,c);cacherCombat();rafraichirGrille();
    msg('🛡 Position défensive');}));
  pan.appendChild(btnAct('— Passer','pas',function(){SON.jouer('passer');terminerAction(l,c);cacherCombat();msg('Tour passé — libre au prochain tour');}));
}
function btnAct(txt,cls,cb){var b=document.createElement('button');b.className='ba '+cls;b.textContent=txt;b.addEventListener('click',cb);return b;}
function cacherAction(){document.getElementById('pa').classList.remove('visible');}
function cacherCombat(){document.getElementById('pc').classList.remove('visible');}

// ═══ COMBAT (latéral) ═══
function afficherCombat(uA,dA,fA,sA,uD,dD,fD,sD,gagnant){
  var pan=document.getElementById('pc');pan.classList.add('visible');
  var campA=G.jeu.quiJoue,campD=campA==='j1'?'j2':'j1';
  var cA=campA==='j1'?'var(--allies-b)':'var(--axis-b)',cD=campA==='j1'?'var(--axis-b)':'var(--allies-b)';
  var rc=gagnant==='att'?'gagne':gagnant==='def'?'tient':'egal';
  var rt=gagnant==='att'?'Victoire ('+sA+' > '+sD+')':gagnant==='def'?'Défense tient ('+sD+' ≥ '+sA+')':'Égalité ('+sA+' = '+sD+')';
  pan.innerHTML='<button class="cclose" onclick="cacherCombat()">✕</button>'
    +'<div class="cr"><div class="cc"><div class="cq" style="color:'+cA+'">ATT</div>'
    +'<div class="ci">'+svgUnite(uA.type,campA).replace('u-piece','u-piece" style="width:28px;height:28px')+'</div>'
    +'<div class="cd">'+svgDe(dA).replace(/32/g,'20')+' +'+fA+'</div>'
    +'<div class="ct" style="color:'+cA+'">'+sA+'</div></div>'
    +'<div class="cvs">⚔</div>'
    +'<div class="cc"><div class="cq" style="color:'+cD+'">DEF</div>'
    +'<div class="ci">'+svgUnite(uD.type,campD).replace('u-piece','u-piece" style="width:28px;height:28px')+'</div>'
    +'<div class="cd">'+svgDe(dD).replace(/32/g,'20')+' +'+fD+'</div>'
    +'<div class="ct" style="color:'+cD+'">'+sD+'</div></div></div>'
    +'<div class="cres '+rc+'">'+rt+'</div>';
  clearTimeout(pan._t);pan._t=setTimeout(function(){cacherCombat();},7000);
}

// ═══ TIMER ANIMÉ ═══
function afficherTimer(s){
  var el=document.getElementById('t-txt'),arc=document.getElementById('t-arc');if(!el||!arc)return;
  el.textContent=s+'s';var off=113.1*(1-s/DUREE_TIMER);arc.style.strokeDashoffset=off;
  el.classList.remove('warn','crit');arc.classList.remove('warn','crit');
  if(s<=10){el.classList.add('crit');arc.classList.add('crit');}
  else if(s<=20){el.classList.add('warn');arc.classList.add('warn');}
}

// ═══ TUTORIEL (8 étapes) ═══
var ETAPES_TUTORIEL=[
  {titre:'Bienvenue, Commandant !',texte:'Ce guide vous accompagne pas à pas.'},
  {titre:'Déploiement',texte:'Placez vos 5 unités dans votre zone. Cliquez une unité dans le panneau, puis une case.'},
  {titre:'Vos forces',texte:'Tank (+3, lent, tire à distance 2) — Soldat (+2, +1 si allié adjacent) — Cavalier (+1, rapide 2 cases, ignore les pièges).'},
  {titre:'Lancer de dé',texte:'Chaque tour : les deux camps lancent un dé. Le plus grand joue en premier.'},
  {titre:'2 actions par tour',texte:'Vous n\'avez que 2 actions par tour. Choisissez bien vos unités ! Vous pouvez aussi passer la main avant.'},
  {titre:'Capacités spéciales',texte:'🐴 Cavalier : ignore les pièges. 🎯 Tank : attaque à distance 2 en ligne droite. ⚔ Soldat : +1 quand un allié est adjacent.'},
  {titre:'Défendre vs Passer',texte:'🛡 Défendre donne +1 si attaqué MAIS bloque votre attaque au tour suivant (🚫). Passer ne donne rien mais vous restez libre au prochain tour. Choix stratégique !'},
  {titre:'Combat',texte:'Score = dé + force + bonus case. Attaquant gagne si strictement supérieur.'},
  {titre:'Victoire',texte:'Contrôlez 33 cases ou éliminez l\'ennemi. Bonne chance !'}
];
function lancerTutoriel(){G.tutoriel.actif=true;G.tutoriel.etape=0;afficherEtapeTutoriel();}
function afficherEtapeTutoriel(){
  var tut=document.getElementById('tut'),e=ETAPES_TUTORIEL[G.tutoriel.etape],n=G.tutoriel.etape+1,t=ETAPES_TUTORIEL.length;
  tut.classList.add('visible');
  tut.innerHTML='<div class="tc"><div class="te">Étape '+n+'/'+t+'</div>'
    +'<div class="tt">'+e.titre+'</div><div class="tx">'+e.texte+'</div>'
    +'<div class="ta">'+(n<t?'<button class="bc pr" onclick="etapeSuivanteTuto()">Suivant ▸</button>'
    :'<button class="bc pr" onclick="fermerTutoriel()">Commencer !</button>')
    +'<button class="tp" onclick="fermerTutoriel()">Passer</button></div></div>';
}
function etapeSuivanteTuto(){G.tutoriel.etape++;afficherEtapeTutoriel();}
function fermerTutoriel(){G.tutoriel.actif=false;document.getElementById('tut').classList.remove('visible');}
function toggleRegles(){document.getElementById('pr').classList.toggle('visible');}
