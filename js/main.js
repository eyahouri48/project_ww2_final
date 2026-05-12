// ════════════════════════════════════════════════════════════
//  MAIN v3
// ════════════════════════════════════════════════════════════
var URL_PARAMS={};
function afficherDifficulte(){document.getElementById('smd').classList.add('visible');}
function choisirMode(mode,diff){
  G.mode=mode; G.phase='placement';
  if(mode==='jvo'){G.joueurs.j2.nom=URL_PARAMS.j2nom||'Axe 🤖';appliquerDifficulte(diff||'normal');}
  else{G.joueurs.j2.nom=URL_PARAMS.j2nom||'Axe';}
  G.joueurs.j1.nom=URL_PARAMS.j1nom||'Alliés';
  document.getElementById('em').classList.remove('visible');
  document.getElementById('smd').classList.remove('visible');
  document.getElementById('ppl').classList.add('visible');
  document.getElementById('n1').textContent=G.joueurs.j1.nom;
  document.getElementById('n2').textContent=G.joueurs.j2.nom;
  creerGrilleHTML();
  var vu=false;try{vu=localStorage.getItem('tuto_vu')==='1';}catch(e){}
  if(!vu){lancerTutoriel();try{localStorage.setItem('tuto_vu','1');}catch(e){}}
  document.getElementById('de1').innerHTML=svgDeVide();
  document.getElementById('de2').innerHTML=svgDeVide();
  rafraichirTout();
}
function creerGrilleHTML(){
  var cont=document.getElementById('grille');cont.innerHTML='';
  for(var l=0;l<TAILLE;l++)for(var c=0;c<TAILLE;c++){
    var el=document.createElement('div');
    el.className='c '+((l+c)%2===0?'c0':'c1');el.id='c-'+l+'-'+c;
    if(ZONE_J1.includes(l))el.classList.add('zj1');
    if(ZONE_J2.includes(l))el.classList.add('zj2');
    var coord=document.createElement('span');coord.className='coord';coord.textContent=l+','+c;el.appendChild(coord);
    (function(ll,cc){el.addEventListener('click',function(){clicCase(ll,cc);});})(l,c);
    cont.appendChild(el);
  }
}
function quitterPartie(){
  arreterTimer();
  if(URL_PARAMS.mode){var u='carte.html?mode='+URL_PARAMS.mode;if(URL_PARAMS.diff)u+='&diff='+URL_PARAMS.diff;window.location.href=u;}
  else window.location.href='index.html';
}
function retourCarteAvecResultat(gagnant){
  if(URL_PARAMS.j1id&&URL_PARAMS.j2id){
    window.location.href='carte.html?mode='+URL_PARAMS.mode+'&diff='+(URL_PARAMS.diff||'')
      +'&gagnant='+gagnant+'&j1id='+URL_PARAMS.j1id+'&j2id='+URL_PARAMS.j2id;}
}
initialiserJeu();
(function(){
  var p=new URLSearchParams(window.location.search);
  URL_PARAMS={mode:p.get('mode'),diff:p.get('diff'),
    j1nom:p.get('j1nom')?decodeURIComponent(p.get('j1nom')):null,
    j2nom:p.get('j2nom')?decodeURIComponent(p.get('j2nom')):null,
    j1id:p.get('j1id'),j2id:p.get('j2id')};
  if(URL_PARAMS.mode==='jvj'||URL_PARAMS.mode==='jvo')choisirMode(URL_PARAMS.mode,URL_PARAMS.diff||'normal');
})();
