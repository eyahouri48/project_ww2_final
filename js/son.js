// ════════════════════════════════════════════════════════════
//  SYSTÈME AUDIO — son.js
//  Musique (MP3) + effets Web Audio API
// ════════════════════════════════════════════════════════════

var SON = {
  ctx: null, volume: 0.5, mute: false, musique: null, initDone: false,

  init: function() {
    if (this.initDone) return;
    this.initDone = true;
    try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e) {}
    try {
      var v = localStorage.getItem('son_volume');
      var m = localStorage.getItem('son_mute');
      if (v !== null) this.volume = parseFloat(v);
      if (m !== null) this.mute = m === '1';
    } catch(e) {}
    this.majUI();
    this._initBoutons();
  },

  lancerMusique: function(src) {
    this.init();
    if (this.musique) { this.musique.pause(); this.musique = null; }
    this.musique = new Audio(src);
    this.musique.loop = true;
    this.musique.volume = this.mute ? 0 : this.volume * 0.25;
    this.musique.play().catch(function() {});
  },

  jouer: function(type) {
    this.init();
    if (this.mute || !this.ctx) return;
    var ctx = this.ctx, vol = this.volume;
    var g = ctx.createGain(); g.connect(ctx.destination); g.gain.value = vol;

    switch(type) {
      case 'de':        // Dé — bruit court
        this._bruit(ctx, g, 0.07); break;
      case 'move':      // Déplacement — pas lourd bref
        this._ton(ctx, g, 180, 0.04, 'sine');
        this._ton(ctx, g, 120, 0.03, 'sine'); break;
      case 'attaque':   // Impact de canon — grave et sourd
        g.gain.value = vol * 0.6;
        this._ton(ctx, g, 60, 0.12, 'sine');
        setTimeout(function(){SON._bruit(ctx, g, 0.04);}, 30); break;
      case 'capture':   // Tambour militaire — bref
        g.gain.value = vol * 0.5;
        this._ton(ctx, g, 100, 0.06, 'triangle');
        setTimeout(function(){SON._ton(ctx, g, 150, 0.05, 'triangle');}, 70); break;
      case 'defense':   // Métal — bouclier
        g.gain.value = vol * 0.4;
        this._ton(ctx, g, 600, 0.04, 'triangle');
        this._ton(ctx, g, 900, 0.03, 'triangle'); break;
      case 'piege':     // Explosion sourde
        g.gain.value = vol * 0.5;
        this._ton(ctx, g, 80, 0.1, 'sawtooth');
        this._bruit(ctx, g, 0.05); break;
      case 'bonus':     // Tintement bref
        g.gain.value = vol * 0.4;
        this._ton(ctx, g, 800, 0.04, 'sine');
        setTimeout(function(){SON._ton(ctx, g, 1000, 0.05, 'sine');}, 50); break;
      case 'tick':      // Timer tic
        g.gain.value = vol * 0.3;
        this._ton(ctx, g, 900, 0.02, 'sine'); break;
      case 'victoire':  // Fanfare brève
        this._ton(ctx, g, 523, 0.08, 'sine');
        setTimeout(function(){SON._ton(ctx, g, 659, 0.08, 'sine');}, 100);
        setTimeout(function(){SON._ton(ctx, g, 784, 0.1, 'sine');}, 200);
        setTimeout(function(){SON._ton(ctx, g, 1047, 0.15, 'sine');}, 350); break;
      case 'select':    // Sélection — clic doux
        g.gain.value = vol * 0.3;
        this._ton(ctx, g, 400, 0.025, 'triangle'); break;
      case 'hover':     // Survol bouton — tic subtil
        g.gain.value = vol * 0.15;
        this._ton(ctx, g, 700, 0.015, 'sine'); break;
      case 'clic':      // Clic bouton
        g.gain.value = vol * 0.25;
        this._ton(ctx, g, 500, 0.03, 'triangle');
        this._ton(ctx, g, 300, 0.02, 'triangle'); break;
      case 'carte':     // Ouverture carte — parchemin
        g.gain.value = vol * 0.3;
        this._bruit(ctx, g, 0.12); break;
      case 'passer':
        g.gain.value = vol * 0.2;
        this._ton(ctx, g, 250, 0.03, 'sine'); break;
      case 'erreur':
        g.gain.value = vol * 0.3;
        this._ton(ctx, g, 200, 0.06, 'square');
        setTimeout(function(){SON._ton(ctx, g, 150, 0.08, 'square');}, 80); break;
    }
  },

  jouerMP3: function(src) {
    this.init();
    if (this.mute) return;
    var a = new Audio(src); a.volume = this.volume; a.play().catch(function() {});
  },

  _ton: function(ctx, g, freq, dur, type) {
    var o = ctx.createOscillator(); o.type = type || 'sine';
    o.frequency.value = freq; o.connect(g); o.start(); o.stop(ctx.currentTime + dur);
  },
  _bruit: function(ctx, g, dur) {
    var n = ctx.sampleRate * dur, buf = ctx.createBuffer(1, n, ctx.sampleRate), d = buf.getChannelData(0);
    for (var i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * 0.3;
    var s = ctx.createBufferSource(); s.buffer = buf; s.connect(g); s.start();
  },

  setVolume: function(v) {
    this.volume = v;
    if (this.musique) this.musique.volume = this.mute ? 0 : v * 0.25;
    try { localStorage.setItem('son_volume', v); } catch(e) {}
    this.majUI();
  },
  toggleMute: function() {
    this.init(); this.mute = !this.mute;
    if (this.musique) this.musique.volume = this.mute ? 0 : this.volume * 0.25;
    try { localStorage.setItem('son_mute', this.mute ? '1' : '0'); } catch(e) {}
    this.majUI();
  },
  majUI: function() {
    var b = document.getElementById('btn-son'), s = document.getElementById('vol-slider');
    if (b) b.textContent = this.mute ? '🔇' : '🔊';
    if (s) s.value = this.volume * 100;
  },

  // Sons hover/clic sur tous les boutons
  _initBoutons: function() {
    document.addEventListener('mouseover', function(e) {
      var t = e.target;
      if (t.tagName === 'BUTTON' || t.classList.contains('pays') && t.classList.contains('sel')) {
        SON.jouer('hover');
      }
    });
    document.addEventListener('mousedown', function(e) {
      if (e.target.tagName === 'BUTTON') SON.jouer('clic');
    });
  }
};

document.addEventListener('click', function() { SON.init(); }, { once: true });
