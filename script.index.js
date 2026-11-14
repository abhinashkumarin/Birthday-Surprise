/*!
 * Birthday Surprise — a cinematic, interactive birthday web experience.
 * Vanilla JavaScript, no dependencies, no build step.
 *
 * Flow:  name + 5 photos → title card → 3D cake → light candles → wish → blow →
 *        candles lift off → knife cuts the cake → fireworks + balloon name →
 *        photo gallery (Queen frame) → farewell → long glass-card message.
 *
 * Modules: CONFIG · State · Audio_ · Cake · Knife · FX · Balloons · Lights/Deco ·
 *          Photos · Gallery · Avatar · Message · timeline (init at the bottom).
 * License: MIT
 */
/* =========================================================
   CONFIG — everything you may want to change
   (the name and the 5 photos are collected on the first screen;
   the message, signature, songs and timing live here)
   ========================================================= */
const CONFIG = {
  lightLabel: 'Light the Candles ✦',
  lightHint: 'tap to light the candles',
  buttonLabel: 'Make a Wish ✦',
  hint: 'tap to blow out the candles',
  cutLabel: 'Cut the Cake ✦',
  cutHint: 'tap to cut the cake',
  defaultFrom: 'yours truly',
  from: '',                                  // sender name used in the signature, e.g. 'Rahul' (can also be passed as ?from=Rahul)
  photo: 'assets/photo.jpg',                 // optional fallback photo
  message: [                                 // {name} is replaced with the entered name (1000+ words)
    "{name}, first of all, a heartfelt Happy Birthday! Today is entirely yours. This website, this light, these balloons, this cake and all these photos exist only so that today you can feel just how special you are. It is a little gift from me, and every part of it is dedicated to your smile.",
    // "Sometimes we keep searching for big words to tell someone what they mean to us, but the honest truth is that finding a person like you is not easy. There is a light in your laughter that changes the mood of a room without saying a word. When you arrive, conversations feel lighter, and when you leave, the silence feels a little longer.",
    // "This year must have taught you a lot. Some days were very sweet, some were heavy with exhaustion, and some were days when it felt like you could not go on any longer. But look at you, still standing, still smiling. Not everyone has that courage, {name}. So today, please take a little pride in yourself.",
    // "The best thing about you is that you think about others far more than you ever think about yourself. You care for everyone, you look after everyone, and you never make a show of it. Today I have one small request: look after yourself too. Take the biggest slice of cake for yourself, listen to your favourite song, and laugh openly for no reason at all.",
    // "I remember those little things that you may have even forgotten, but which are the most precious memories to me. That pointless laughter, those conversations that ran late into the night, those tiny fights that meant nothing and were sorted out in a second. Moments like these are not found in books; they simply build a home in our hearts.",
    // "In the rush of life, all of us lose ourselves somewhere along the way. But looking at you, it feels like real happiness is not in big things, it is in small ones. A hot cup of tea, a good conversation, a true friend, and a smile that comes straight from the heart. You taught me this without even trying, and for that, thank you.",
    // "My biggest prayer for you today is that all your dreams come true. The ones you said out loud, and the ones you quietly kept in your heart. May your hard work bear fruit, may every thorn on your path turn into a flower, and may the roads open up by themselves wherever you step.",
    // "I also pray that your health always stays good, your mind always stays at peace, and that you are always surrounded by people who value you. People who accept you not just on good days, but in every state you are in. Because you deserve the kind of love that is given without conditions, without being weighed on any scale.",
    // "If a day ever comes when everything feels scattered, just remember that you are not alone. Hard times come, and they pass. However long the night may be, the morning always arrives. And when that morning comes, in its light you will look even more beautiful and even stronger than before.",
    // "Do you know what you are? You are like a lamp that does not go out even in a strong wind. You are like a flower that never forgets to bloom even among thorns. You are like a song that, once heard, stays on your lips all day. And truth be told, you are every bit a Queen, which is why this crown was made for you.",
    // "For the year ahead, I only want to tell you this: learn more, travel more, laugh more, and love more, starting with yourself. Meet new people, choose new paths, make mistakes and learn to laugh at them. Life comes only once, and you have to live it with full grace, just like a Queen.",
    // "Whatever light there is in this website is nothing before your light. Whatever balloons float up are lighter than your happiness. Whatever fireworks burst are smaller than your dreams. It was just an attempt to make you feel today the kind of special that you deserve every single day.",
    // "Whenever you feel like you are somehow less, look at the photos above. They all have one thing in common: your real smile. That is your greatest strength. Never lose it, no matter what the world says, no matter what the circumstances. Because that very smile lights up someone's day, and perhaps mine too.",
    // "So today, set aside all your complaints, postpone all your worries until tomorrow, and join the celebration with an open heart. Eat cake, sing songs, dance, take photos, and live every moment as if it were the most beautiful day of your life.",
    // "And yes, one thing that perhaps was never said directly: many things become easier because of you. One line from you, one laugh, or just you saying that everything will be fine, truly gives courage. So today, the salute is not only for you, but also for that goodness in you which you share with people without a second thought.",
    // "Every day spent with you is like a little story, with a bit of laughter, a bit of teasing, and a lot of belonging. I hope this story keeps adding beautiful pages just like this.",
    // "Once again, from the depths of my heart, Happy Birthday {name}. May your life be filled with so much happiness that you cannot count it, so much love that you cannot hold it all, and so much success that the world takes your name. Keep smiling always, keep shining always, and always remember how priceless you are.",
    // "One last wish for tonight: when you close your eyes to sleep, may there be only peace in your heart, a soft smile on your face, and just one word on your lips, thank you. Thank you for that day, for those people, and for every moment that brought you this far."
  ],
  pace: 1.3,                                 // global speed factor: 1 = fast, higher = calmer (scales every pause and animation)
  charDelay: 14,                             // typewriter speed in ms per letter
  colors: ['#f4b6c2', '#ffc766', '#3fa6a0', '#ff7a6b', '#b79be0', '#7fd1ae'],
  sparkColors: ['#ffc766', '#ffe3a3', '#ff8a3d', '#fff4e0', '#f4b6c2'],
  timing: { floatMs: 6400, holdMs: 5200 },
  // One song per scene. Put the files in `assets/audio/` (any extension: mp3, m4a, opus, ogg, wav).
  audio: {
    dirs: ['assets/audio/', 'assets/'],                       // looks in audio/ first, then in assets/
    exts: ['mp3', 'm4a', 'opus', 'ogg', 'wav','mpeg'],
    tracks: {
      ambient:     { file: 'ambient',           title: 'Ambient',                   vol: .4,  loop: true },   // title card ("a surprise for you")
      intro:       { file: 'channa-ve',         title: 'Channa Ve',                 vol: .45, loop: true },   // cake build-up, lighting the candles, the wish
      knife:       { file: 'je-tu-meri-jaan',   title: 'Je Tu Meri Jaan Vi Mangle', vol: .5,  loop: true },   // from removing the candles to cutting the cake
      celebration: { file: 'happy-birthday',    title: 'Happy Birthday',            vol: .75, loop: false, then: 'intro' }, // fireworks + balloons + gallery
      message:     { file: 'tainu-khabar-nahi', title: 'Tainu Khabar Nahi',         vol: .5,  loop: true }    // the final long message
    }
  }
};

const $ = s => document.querySelector(s);
const wait = ms => new Promise(r => setTimeout(r, ms * (CONFIG.pace || 1)));
const rnd = (a, b) => a + Math.random() * (b - a);
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = innerWidth < 700;
const ease = { outCubic: t => 1 - Math.pow(1 - t, 3), outBack: t => { const c = 1.9; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); } };

/* =========================================================
   STATE — the entered name is used everywhere
   ========================================================= */
const S = { display: '', first: '', letters: [], from: '', lines: [] };

function setName(raw) {
  const clean = raw.trim().replace(/\s+/g, ' ');
  S.display = clean.replace(/(^|\s)\S/g, c => c.toUpperCase());
  S.first = S.display.split(' ')[0];
  S.letters = [...S.first.toUpperCase()].filter(ch => /\p{L}/u.test(ch)).slice(0, 9);
  if (!S.letters.length) S.letters = ['❤'];
}
function applyName() {
  document.title = `A surprise for ${S.display}`;
  $('#capName').textContent = S.display;
  $('#cardName').textContent = `Happy Birthday, ${S.display}`;
  $('#est').textContent = `est. ${new Date().getFullYear()} · a surprise for ${S.display}`;
  $('#initial').textContent = S.letters[0];
  $('#introText').textContent = `${S.display}, a surprise for you…`;
  $('#photo').alt = S.display;
  S.lines = CONFIG.message.map(l => l.split('{name}').join(S.display));
  S.from = new URLSearchParams(location.search).get('from') || CONFIG.from || '';
  $('#sign').textContent = `— with love, ${S.from || CONFIG.defaultFrom}`;
}
function setPhoto(src) {
  const im = $('#photo');
  im.onload = () => { im.hidden = false; };
  im.onerror = () => { im.hidden = true; };
  im.src = src;
}

/* =========================================================
   AUDIO — files + Web Audio fallbacks
   ========================================================= */
const Audio_ = {
  ctx: null, master: null, on: true, synthTimer: null, tracks: {}, now: null, npTimer: null,
  init() {
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.master = this.ctx.createGain(); this.master.connect(this.ctx.destination);
    } catch (e) {}
    try { this.on = localStorage.getItem('music') !== 'off'; } catch (e) {}
    for (const [name, def] of Object.entries(CONFIG.audio.tracks)) this.tracks[name] = this.load(name, def);
    // iOS/Android: unlock the other tracks inside this tap (user gesture) so they can start later on their own
    Object.values(this.tracks).slice(1).forEach(t => this.unlock(t));
    this.apply();
  },
  load(name, def) {
    const el = new Audio(), t = { name, def, el, i: 0, ok: null };
    t.ready = new Promise(res => { t.done = res; });
    el.preload = 'auto'; el.loop = !!def.loop; el.volume = 0;
    const cands = CONFIG.audio.dirs.flatMap(d => CONFIG.audio.exts.map(x => `${d}${def.file}.${x}`));
    const next = () => {                                        // try the next file name / extension
      if (t.i >= cands.length) { t.ok = false; t.done(); return; }
      el.src = cands[t.i++];
    };
    el.addEventListener('error', next);
    el.addEventListener('canplay', () => { t.ok = true; t.done(); });
    el.addEventListener('ended', () => { if (this.now === name && def.then) this.scene(def.then); });
    next();
    return t;
  },
  unlock(t) {
    const el = t.el;
    t.ready.then(() => { if (!t.ok) return; el.muted = true; return el.play(); }).then(() => { if (this.now !== t.name) { el.pause(); el.currentTime = 0; } el.muted = !this.on; })
      .catch(() => { el.muted = !this.on; });
  },
  apply() {
    Object.values(this.tracks).forEach(t => { t.el.muted = !this.on; });
    if (this.master) this.master.gain.value = this.on ? 1 : 0;
    $('#music').classList.toggle('off', !this.on);
  },
  toggle() {
    this.on = !this.on; this.apply();
    try { localStorage.setItem('music', this.on ? 'on' : 'off'); } catch (e) {}
  },
  fadeTo(a, vol, ms) {
    const from = a.volume, t0 = performance.now();
    const step = t => { const k = Math.min((t - t0) / ms, 1); a.volume = Math.max(0, Math.min(1, from + (vol - from) * k)); if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  },
  duck(f) { const t = this.tracks[this.now]; if (t) this.fadeTo(t.el, t.def.vol * f, 900); },
  /* crossfade: the old song fades out while the new one fades in */
  async scene(name, fade = 1800) {
    const t = this.tracks[name]; if (!t || this.now === name) return;
    const prev = this.tracks[this.now]; this.now = name;
    this.synthStop();
    if (prev) { this.fadeTo(prev.el, 0, fade); setTimeout(() => { if (this.now !== prev.name) prev.el.pause(); }, fade + 150); }
    this.nowPlaying(t.def.title);
    await Promise.race([t.ready, wait(5000)]);                  // wait for the file to load (the extension fallback may still be running)
    if (this.now !== name) return;
    if (t.ok === false) { name === 'celebration' ? this.synthParty() : this.synthAmbient(); return; }
    try { t.el.currentTime = 0; } catch (e) {}
    try { await t.el.play(); this.fadeTo(t.el, t.def.vol, Math.max(2200, fade)); }
    catch (e) { name === 'celebration' ? this.synthParty() : this.synthAmbient(); }   // no audio file found: fall back to a soft synthesised tune
  },
  nowPlaying(title) {
    const el = $('#np'); if (!title || !el) return;
    el.textContent = '♪ ' + title; el.classList.add('show');
    clearTimeout(this.npTimer); this.npTimer = setTimeout(() => el.classList.remove('show'), 5500);
  },
  tone(f, d, type = 'sine', v = .06, when = 0) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime + when, o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.type = type; o.frequency.value = f;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + .05); g.gain.exponentialRampToValueAtTime(.0001, t + d);
    o.connect(g); g.connect(this.master); o.start(t); o.stop(t + d + .1);
  },
  noise(d, v, freq) {
    if (!this.ctx) return;
    const n = this.ctx.sampleRate * d, buf = this.ctx.createBuffer(1, n, this.ctx.sampleRate), data = buf.getChannelData(0);
    for (let i = 0; i < n; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / n);
    const s = this.ctx.createBufferSource(), f = this.ctx.createBiquadFilter(), g = this.ctx.createGain();
    s.buffer = buf; f.type = 'lowpass'; f.frequency.value = freq; g.gain.value = v;
    s.connect(f); f.connect(g); g.connect(this.master); s.start();
  },
  poof() { this.noise(.5, .5, 900); },
  pop() { this.noise(.25, .35, 1800); this.tone(120, .2, 'triangle', .08); },
  swish() { this.noise(.45, .22, 4200); },
  chime() { [784, 988, 1319].forEach((f, i) => this.tone(f, 1.2, 'sine', .05, i * .12)); },
  synthAmbient() {
    const n = [262, 330, 392, 330, 294, 392, 440, 392]; let i = 0;
    this.synthTimer = setInterval(() => this.tone(n[i++ % n.length], 2.4, 'sine', .05), 900);
  },
  synthParty() {
    const n = [392, 494, 587, 494, 440, 523, 659, 523]; let i = 0;
    this.synthTimer = setInterval(() => this.tone(n[i++ % n.length], 1, 'triangle', .06), 380);
  },
  synthStop() { clearInterval(this.synthTimer); }
};

/* =========================================================
   CAKE + CANDLES
   ========================================================= */
const Cake = {
  candleEls: [], lock: false,
  build() {
    // HAPPY on the top tier, BIRTHDAY on the middle tier — wax letters, each with its own flame
    const box = $('#candles'), pal = [['#fff1a0', '#ffd23f', '#c99a00'], ['#c58be0', '#8e3fb5', '#4d1a70'], ['#ffc08a', '#ff8a3d', '#b3470a'],
      ['#ff8f86', '#e5322f', '#8a0f10'], ['#8fd0ff', '#2f8fd8', '#124f8a'], ['#ffb0d0', '#ff5f9e', '#a31f5c']];
    const fxMap = { H: 22, P: 20, Y: 18, B: 20, R: 20, D: 20 }, wMap = { I: 24, Y: 56 };
    const rows = [{ word: 'HAPPY', pitch: .112, half: .28, cy: -.025, e0: 0, e1: .75 }, { word: 'BIRTHDAY', pitch: .0975, half: .4, cy: .2, e0: -.4, e1: .8 }];
    let n = 0;
    rows.forEach(row => [...row.word].forEach((ch, i, arr) => {
      const x = (i - (arr.length - 1) / 2) * row.pitch, ey = row.e0 + row.e1 * Math.sqrt(Math.max(0, 1 - Math.pow(x / row.half, 2)));
      const c = pal[n++ % pal.length], w = wMap[ch] || 54, fx = fxMap[ch] || 50, el = document.createElement('div');
      const g = `<text x="30" y="88" textLength="${w}" lengthAdjust="spacingAndGlyphs"`;
      el.className = 'lc unlit'; el.dataset.cx = x.toFixed(3);
      el.style.cssText = `--cx:${x.toFixed(3)};--cy:${row.cy};--ey:${ey.toFixed(2)};--r:${rnd(-3, 3).toFixed(1)}deg;--k:${rnd(.94, 1.06).toFixed(2)};--fx:${fx}%;--c1:${c[0]};--c2:${c[1]};--c3:${c[2]}`;
      el.innerHTML = `<svg viewBox="0 0 60 92" aria-hidden="true"><g text-anchor="middle" font-weight="700" font-size="118" style="font-family:Fredoka,'Baloo 2','Arial Rounded MT Bold','Trebuchet MS',sans-serif">`
        + `${g} style="fill:var(--c3);stroke:var(--c3);stroke-width:9;stroke-linejoin:round">${ch}</text>`
        + `${g} style="fill:var(--c2)">${ch}</text>`
        + `<text x="28.6" y="86.4" textLength="${w}" lengthAdjust="spacingAndGlyphs" style="fill:var(--c1);opacity:.55">${ch}</text></g></svg>`
        + `<i class="flame" style="--d:${rnd(.6, 1.1).toFixed(2)}s"></i>`;
      box.appendChild(el); this.candleEls.push(el);
    }));
  },
  garland() {
    const g = ['#3f6a3a', '#5b8a45', '#2f5232', '#7da04f']; let h = '';
    for (let i = 0; i < 34; i++) {
      const t = i / 33, x = (t * 100).toFixed(1), y = 6 + Math.sin(t * Math.PI) * 10 + rnd(-3, 3);
      h += `<i class="lf" style="left:${x}%;top:${y.toFixed(1)}px;--r:${rnd(-70, 70).toFixed(0)}deg;--c:${g[i % 4]}"></i>`;
      if (i % 4 === 1) h += `<b class="fl" style="left:${x}%;top:${(y - 3).toFixed(1)}px"></b>`;
    }
    $('#garland').innerHTML = h;
  },
  async enter() {
    $('#cake').classList.add('plate-in'); $('#shadow').classList.add('in');
    await wait(500);
    for (const t of ['.t-bot', '.t-mid', '.t-top']) { $(t).classList.add('in'); await wait(450); }
    document.querySelectorAll('.tier').forEach(t => t.classList.add('drip'));
    $('#garland').classList.add('in'); $('.arch').classList.add('on');
    await wait(700);
    for (const c of this.candleEls) { c.classList.add('in'); await wait(200); }
    $('#neon').classList.add('on');
    const cr = $('#cake').getBoundingClientRect();
    this.topRel = Math.min(...this.candleEls.map(e => e.getBoundingClientRect().top)) - cr.top;   // used to place the balloon name row
    Audio_.scene('intro', 3200);                                // once the cake is built, the ambient track slowly crossfades into the next song
    Avatar.enter();
    await wait(600);
    await Avatar.say('Today is my birthday! ✦', 1800);
    setUI(true, CONFIG.lightLabel, CONFIG.lightHint); phase = 'light';
  },
  extinguish() {
    Audio_.poof();
    this.candleEls.forEach(c => {
      c.classList.add('out');
      for (let i = 0; i < 3; i++) {
        const s = document.createElement('span'); s.className = 'smoke'; s.style.animationDelay = i * .35 + 's';
        c.appendChild(s); setTimeout(() => s.remove(), 3200);
      }
    });
  },
  async removeCandles() {                                       // after blowing, all candles lift off the cake
    Audio_.tone(990, .5, 'triangle', .04);
    this.candleEls.forEach((el, i) => {
      el.style.transition = `transform .9s cubic-bezier(.5,0,.8,.4) ${i * 55}ms, opacity .6s ${i * 55 + 300}ms`;
      el.style.transform = `translateY(${-rnd(45, 95)}px) rotate(${rnd(-30, 30)}deg) scale(.7)`; el.style.opacity = 0;
    });
    await wait(1500);
  },
  freeze(on) { this.lock = on; $('#cake').style.animationPlayState = on ? 'paused' : 'running'; },
  parallax() {
    addEventListener('pointermove', e => { if (!this.lock) $('#cake').style.setProperty('--ry', ((e.clientX / innerWidth - .5) * 12).toFixed(1) + 'deg'); });
    addEventListener('deviceorientation', e => { if (!this.lock && e.gamma != null) $('#cake').style.setProperty('--ry', Math.max(-10, Math.min(10, e.gamma / 4)) + 'deg'); });
  }
};

/* =========================================================
   KNIFE — glides in, makes two cuts, lifts the slice out
   ========================================================= */
const Knife = {
  el: $('#knife'), hover: null,
  P: (x, y, r = 0) => `translate(${x}px,${y}px) rotate(${r}deg)`,
  async enter() {
    const c = $('#cake').offsetWidth, P = this.P;
    Audio_.swish();
    const kr = this.el.getBoundingClientRect(), hd = Avatar.hand();             // the knife flies in from her hand
    await this.el.animate([{ opacity: 0, transform: P(hd.x - (kr.left + kr.width / 2), hd.y - kr.bottom, 40) }, { offset: .12, opacity: 1 }, { opacity: 1, transform: P(-c * .075, -c * .22) }],
      { duration: 1500 * CONFIG.pace, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'forwards' }).finished;
    this.hover = this.el.animate([{ transform: P(-c * .075, -c * .22) }, { transform: P(-c * .075, -c * .26) }],
      { duration: 1300 * CONFIG.pace, direction: 'alternate', iterations: Infinity, easing: 'ease-in-out' });
  },
  crumbs(x, y, n = 10, cols = ['#fff1d6', '#f4a5b8', '#5a301f', '#f6e3b0']) {
    const wrap = $('#cakeWrap'), cake = $('#cake'), bx = cake.offsetLeft + cake.offsetWidth / 2 + x, by = cake.offsetTop + y;
    for (let i = 0; i < n; i++) {
      const s = document.createElement('i'), z = rnd(2, 5), dx = rnd(-28, 28);
      s.className = 'crumb'; s.style.cssText = `left:${bx}px;top:${by}px;width:${z}px;height:${z}px;background:${cols[i % cols.length]}`;
      wrap.appendChild(s);
      s.animate([{ transform: 'translate(0,0)', opacity: 1 }, { offset: .4, transform: `translate(${dx * .6}px,${-rnd(8, 26)}px)`, opacity: 1 }, { transform: `translate(${dx}px,${rnd(40, 90)}px)`, opacity: 0 }],
        { duration: rnd(650, 1050), easing: 'ease-in', fill: 'forwards' }).finished.then(() => s.remove());
    }
  },
  async cut() {
    const c = $('#cake').offsetWidth, w = c * .075, H = c * .66, P = this.P, k = this.el, ez = 'cubic-bezier(.5,0,.3,1)', D = 1650 * CONFIG.pace;
    if (this.hover) this.hover.cancel();
    document.body.classList.add('slomo'); Audio_.duck(.25);               // slow-motion mood: the song ducks
    Avatar.pose('cut');
    const dive = async (x, line) => {
      Audio_.swish();
      line.animate([{ transform: 'scaleY(0)' }, { offset: .25, transform: 'scaleY(0)' }, { transform: 'scaleY(1)' }], { duration: D, easing: ez, fill: 'forwards' });
      setTimeout(() => this.crumbs(x, c * .02, 8), D * .3);                // the knife enters the cake
      await k.animate([{ transform: P(x, -c * .22) }, { transform: P(x, H) }], { duration: D, easing: ez, fill: 'forwards' }).finished;
      this.crumbs(x, c * .6, 6, ['#5a301f', '#4b2517', '#c99a76']);
    };
    await dive(-w, $('#cl1'));
    k.classList.add('creamy');                                             // cream sticks to the blade
    await k.animate([{ transform: P(-w, H) }, { transform: P(-w, -c * .22) }, { transform: P(w, -c * .22) }], { duration: 1300 * CONFIG.pace, easing: 'ease-in-out', fill: 'forwards' }).finished;
    await dive(w, $('#cl2'));
    // the slice comes free
    $('#slice').style.opacity = 1; $('#cavity').style.opacity = 1;
    $('#cl1').style.opacity = 0; $('#cl2').style.opacity = 0;
    Audio_.chime(); this.crumbs(0, c * .15, 18);
    k.animate([{ transform: P(w, H), opacity: 1 }, { transform: P(c * 1.1, -c * .7, 40), opacity: 0 }], { duration: 1500 * CONFIG.pace, easing: 'ease-in', fill: 'forwards' });
    const end = `translate(${c * .385}px,${c * .47}px) scale(.42) rotate(-6deg)`;
    await $('#slice').animate([
      { transform: 'none', opacity: 1 },
      { offset: .16, transform: `translate(0,${c * .015}px) scale(1.03)`, opacity: 1 },                          // loosens slowly
      { offset: .36, transform: `translate(0,${c * .07}px) scale(1.16) rotate(2deg)`, opacity: 1 },             // pulled forward
      { offset: .62, transform: `translate(${c * .17}px,${c * .03}px) scale(.88) rotate(-5deg)`, opacity: 1 },  // lifted in an arc
      { offset: .88, transform: end, opacity: 1 },
      { transform: end, opacity: 0 }
    ], { duration: 2400 * CONFIG.pace, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'forwards' }).finished;
    $('#serve').classList.add('in'); Audio_.pop(); this.crumbs(c * .39, c * .82, 10);
    document.body.classList.remove('slomo'); Audio_.duck(1);
    Avatar.pose('cheer');
    await wait(900);
  }
};

/* =========================================================
   PARTICLES — sparklers + sky shots (canvas)
   ========================================================= */
const FX = {
  cv: $('#fx'), ps: [], rockets: [], glows: [], run: false, last: 0, nextRocket: 0, finale: 5,
  cap: isMobile ? 650 : 1300,
  resize() {
    const d = Math.min(devicePixelRatio || 1, 2);
    this.W = innerWidth; this.H = innerHeight;
    this.cv.width = this.W * d; this.cv.height = this.H * d;
    this.c = this.cv.getContext('2d'); this.c.setTransform(d, 0, 0, d, 0, 0);
  },
  start() {
    if (this.run) return;
    this.resize(); addEventListener('resize', () => this.resize());
    this.run = true; this.last = performance.now(); requestAnimationFrame(t => this.loop(t));
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && this.run) { this.last = performance.now(); requestAnimationFrame(t => this.loop(t)); }
    });
  },
  spark(x, y, vx, vy, life, color, g = 260, w = 1.3, drag = 1, lim = this.cap, crack = false) {
    if (this.ps.length < lim) this.ps.push({ x, y, px: x, py: y, vx, vy, life, max: life, color, g, w, drag, crack });
  },
  launch() {
    const s = Math.random(), W = this.W, H = this.H; let x, vx;
    if (s < .3) { x = rnd(W * .03, W * .16); vx = rnd(50, 120); }
    else if (s < .6) { x = rnd(W * .84, W * .97); vx = -rnd(50, 120); }
    else { x = rnd(W * .25, W * .75); vx = rnd(-30, 30); }
    this.rockets.push({ x, vx, y: H, ty: rnd(H * .12, H * .5), vy: -rnd(520, 700) });
  },
  burst(x, y, type, color) {
    Audio_.pop();
    const k = Math.max(.9, Math.min(1.5, this.W / 700)), lim = this.cap * 1.4;
    const n = (reduce ? .5 : 1) * ({ ring: 72, willow: 70, crackle: 90, peony: 110, heart: 90 }[type]);
    for (let i = 0; i < n; i++) {
      const a = type === 'ring' ? i / n * Math.PI * 2 : Math.random() * Math.PI * 2;
      if (type === 'willow') this.spark(x, y, Math.cos(a) * rnd(60, 240) * k, Math.sin(a) * rnd(60, 240) * k, rnd(2.6, 3.8), '#ffc766', 150, 1.8, 1.6, lim);
      else if (type === 'crackle') this.spark(x, y, Math.cos(a) * rnd(80, 300) * k, Math.sin(a) * rnd(80, 300) * k, rnd(1.4, 2), '#fff4e0', 110, 1.8, 1.2, lim, true);
      else if (type === 'ring') this.spark(x, y, Math.cos(a) * 300 * k, Math.sin(a) * 300 * k, 1.8, color, 80, 2, 1.1, lim);
      else if (type === 'heart') {
        const t = i / n * Math.PI * 2, hx = 16 * Math.pow(Math.sin(t), 3), hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        this.spark(x, y, hx * 12 * k, hy * 12 * k, 2.1, i % 2 ? '#ff7a9a' : '#f4b6c2', 60, 2.2, 1.1, lim);
      }
      else this.spark(x, y, Math.cos(a) * rnd(80, 330) * k, Math.sin(a) * rnd(80, 330) * k, rnd(1.5, 2.4), color, 90, 2, 1.1, lim);
    }
    this.glows.push({ x, y, r: 150 * k, life: .7, max: .7, color: ['#ffc766', '#ff8a3d', '#f4b6c2', '#ffc766'][Math.random() * 4 | 0] });
    if (!reduce) { const f = $('#flash'); f.style.opacity = .14; setTimeout(() => f.style.opacity = 0, 90); }
  },
  snapBurst(x, y) { for (let i = 0; i < 14; i++) { const a = rnd(0, 6.28), s = rnd(40, 120); this.spark(x, y, Math.cos(a) * s, Math.sin(a) * s, rnd(.4, .8), '#fff4e0', 60, 1.2, 2); } },
  loop(t) {
    if (!this.run || document.hidden) return;
    const dt = Math.min((t - this.last) / 1000, .033); this.last = t;
    const c = this.c;
    c.globalCompositeOperation = 'destination-out'; c.fillStyle = 'rgba(0,0,0,.25)'; c.fillRect(0, 0, this.W, this.H);
    c.globalCompositeOperation = 'lighter'; c.lineCap = 'round';
    // burst glows
    for (let i = this.glows.length - 1; i >= 0; i--) {
      const g = this.glows[i]; g.life -= dt;
      if (g.life <= 0) { this.glows.splice(i, 1); continue; }
      const gr = c.createRadialGradient(g.x, g.y, 0, g.x, g.y, g.r);
      gr.addColorStop(0, g.color + 'aa'); gr.addColorStop(1, g.color + '00');
      c.globalAlpha = g.life / g.max * .2; c.fillStyle = gr; c.fillRect(g.x - g.r, g.y - g.r, g.r * 2, g.r * 2);
    }
    c.globalAlpha = 1;
    // sparklers around the cake
    const r = $('#cake').getBoundingClientRect();
    const em = [[r.left - 8, r.bottom - 6], [r.right + 8, r.bottom - 6], [r.left + r.width * .22, r.bottom + 4], [r.right - r.width * .22, r.bottom + 4], [r.left + r.width / 2, r.bottom + 8]];
    for (const [ex, ey] of em) for (let i = 0; i < (reduce || isMobile ? 2 : 4); i++) {
      const a = -Math.PI / 2 + rnd(-1.2, 1.2), s = rnd(60, 220);
      this.spark(ex, ey, Math.cos(a) * s, Math.sin(a) * s, rnd(.3, .8), Math.random() < .25 ? '#fff' : CONFIG.sparkColors[Math.random() * 2 | 0], 300, 1.1, 1);
    }
    // sky shots
    this.nextRocket -= dt;
    if (this.nextRocket <= 0) {
      this.nextRocket = reduce ? rnd(1.2, 2) : rnd(.45, 1);
      for (let k = Math.random() < .35 ? 2 : 1; k > 0; k--) this.launch();
    }
    this.finale -= dt;
    if (this.finale <= 0 && !reduce) { this.finale = 9; for (let j = 0; j < 5; j++) setTimeout(() => this.run && this.launch(), j * 170); }
    for (let i = this.rockets.length - 1; i >= 0; i--) {
      const q = this.rockets[i]; q.y += q.vy * dt; q.x += q.vx * dt;
      this.spark(q.x + rnd(-1, 1), q.y, rnd(-15, 15), rnd(30, 90), .55, '#ffe3a3', 60, 1.6);
      if (q.y <= q.ty) {
        this.burst(q.x, q.y, ['peony', 'ring', 'willow', 'crackle', 'heart'][Math.random() * 5 | 0], CONFIG.sparkColors[Math.random() * CONFIG.sparkColors.length | 0]);
        this.rockets.splice(i, 1);
      }
    }
    // particles
    for (let i = this.ps.length - 1; i >= 0; i--) {
      const p = this.ps[i]; p.life -= dt;
      if (p.life <= 0) {
        if (p.crack) for (let j = 0; j < 3; j++) { const a = rnd(0, 6.28), s = rnd(60, 160); this.spark(p.x, p.y, Math.cos(a) * s, Math.sin(a) * s, .25, '#fff', 0, 1.6, 2, this.cap * 1.4); }
        this.ps.splice(i, 1); continue;
      }
      p.px = p.x; p.py = p.y; p.vy += p.g * dt; p.vx *= 1 - p.drag * dt; p.vy *= 1 - p.drag * dt * .5;
      p.x += p.vx * dt; p.y += p.vy * dt;
      const a = p.life / p.max; c.globalAlpha = Math.min(1, a * 1.4) * (Math.random() < .12 ? .4 : 1);
      c.strokeStyle = p.color; c.lineWidth = p.w; c.beginPath(); c.moveTo(p.px, p.py); c.lineTo(p.x, p.y); c.stroke();
    }
    c.globalAlpha = 1;
    requestAnimationFrame(t => this.loop(t));
  }
};


/* =========================================================
   BALLOON TYPES — pink hearts, gold, black glitter, clear confetti (+ curly ribbons)
   ========================================================= */
const BT = {
  heart1: { cls: 'ty-heart', c: ['#ffd6e0', '#ff8fa8', '#d9496f'], lc: '#fff', rib: '#e8a98f' },
  heart2: { cls: 'ty-heart', c: ['#ffc2d1', '#ff6f91', '#c2305a'], lc: '#fff', rib: '#e8a98f' },
  heart3: { cls: 'ty-heart', c: ['#ffe0d6', '#ff9a8a', '#d9604f'], lc: '#fff', rib: '#e8a98f' },
  gold:   { cls: 'ty-gold',  c: ['#ffe38a', '#f2b632', '#a8741a'], lc: '#5a3a08', rib: '#f2c14e' },
  black:  { cls: 'ty-black', c: ['#6a6a6a', '#262626', '#050505'], lc: '#ffd35a', rib: '#f2c14e' },
  clear:  { cls: 'ty-clear', c: ['#ffffff', '#dfe9ff', '#b9c9ee'], lc: '#ffffff', rib: '#f2c14e' }
};
const bstyle = t => `--c1:${t.c[0]};--c2:${t.c[1]};--c3:${t.c[2]};--lc:${t.lc};--rib:${t.rib}`;
const RIBBON = '<svg class="rib" viewBox="0 0 30 80" preserveAspectRatio="none" aria-hidden="true"><path d="M15 0C25 8 5 18 15 26S25 44 15 52S5 70 15 80"/></svg>';

/* =========================================================
   BALLOONS — float, snap into a row behind the cake, hold
   ========================================================= */
const Balloons = {
  list: [], mode: 'float', t0: 0, tSnap: 0,
  shade(hex, k) { const n = parseInt(hex.slice(1), 16); const f = v => Math.max(0, Math.min(255, v * k | 0)); return `rgb(${f(n >> 16)},${f(n >> 8 & 255)},${f(n & 255)})`; },
  spawn() {
    const box = $('#balloons'), W = innerWidth, H = innerHeight, n = S.letters.length;
    this.s = Math.min(96, W / (n + 1.4));
    box.style.setProperty('--s', this.s + 'px');
    S.letters.forEach((ch, i) => {
      const t = BT[['heart1', 'gold', 'black', 'clear', 'heart2', 'gold', 'black', 'heart3', 'clear'][i % 9]], el = document.createElement('div');
      el.className = 'balloon' + (t.cls === 'ty-heart' ? ' has-heart' : '');
      el.style.cssText = `--s:${this.s * rnd(.85, 1.05)}px;${bstyle(t)}`;
      el.innerHTML = `<div class="body ${t.cls}"></div><i class="knot"></i><svg viewBox="0 0 30 80" preserveAspectRatio="none"><path d="M15 0C15 8 15 18 15 26S15 44 15 52S15 70 15 80"/></svg>`;
      el.querySelector('.body').textContent = ch;
      box.appendChild(el);
      this.list.push({ el, path: el.querySelector('path'), delay: i * .45, bx: W * (.12 + .76 * (i / Math.max(n - 1, 1))) + rnd(-20, 20), amp: rnd(14, 40), f: rnd(.8, 1.6), ph: rnd(0, 6), yf: H * rnd(.18, .7), x: 0, y: H + 120, rot: 0, w: parseFloat(el.style.getPropertyValue('--s')) });
    });
    this.t0 = performance.now(); requestAnimationFrame(t => this.frame(t));
  },
  targets() {
    const W = innerWidth, n = this.list.length, gap = Math.min(W / (n + .6), this.s * 1.05);
    const capTop = $('#cake').getBoundingClientRect().top + (Cake.topRel ?? -60) - 22, y = Math.max(64, capTop - this.s * 1.18 * .9);
    return this.list.map((b, i) => ({ x: W / 2 + (i - (n - 1) / 2) * gap, y }));
  },
  snap() {
    const tg = this.targets();
    this.list.forEach((b, i) => { b.sx = b.x; b.sy = b.y; b.sr = b.rot; b.tx = tg[i].x; b.ty = tg[i].y; b.done = false; });
    this.tSnap = performance.now(); this.mode = 'snap';
  },
  frame(now) {
    if (this.mode === 'gone') return;
    const H = innerHeight;
    this.list.forEach((b, i) => {
      let x, y, rot, k = 1;
      if (this.mode === 'float') {
        const t = (now - this.t0) / 1000 - b.delay;
        if (t < 0) return;
        b.el.style.opacity = 1;
        const rise = ease.outCubic(Math.min(t / 3.6, 1));
        x = b.bx + Math.sin(t * b.f + b.ph) * b.amp;
        y = H + 120 + (b.yf - H - 120) * rise + Math.sin(t * .9 + b.ph) * 14;
        rot = Math.sin(t * b.f + b.ph) * 8;
      } else {
        const t = (now - this.tSnap) / 1000 - i * .14;
        const e = ease.outBack(Math.max(0, Math.min(t / 1.4, 1)));
        if (this.mode === 'snap' && t >= 1.4 && !b.done) { b.done = true; FX.snapBurst(b.tx, b.ty); Audio_.tone(660 + i * 90, .5, 'sine', .04); }
        const bob = this.mode === 'hold' ? Math.sin(now / 600) * 2.5 : 0;
        x = b.sx + (b.tx - b.sx) * e; y = b.sy + (b.ty - b.sy) * e + bob;
        rot = b.sr * (1 - e); k = 1 - Math.max(0, Math.min(t / 1.4, 1));
      }
      b.x = x; b.y = y; b.rot = rot;
      b.el.style.transform = `translate(${x - b.w / 2}px,${y}px) rotate(${rot}deg)`;
      const a = k * (9 + Math.sin(now / 450 + i) * 3);
      b.path.setAttribute('d', `M15 0C${15 + a} 8 ${15 - a} 18 15 26S${15 + a} 44 15 52S${15 - a} 70 15 80`);
    });
    requestAnimationFrame(t => this.frame(t));
  }
};

/* =========================================================
   LIGHTS — string lights, greenery, Edison pendants, fairy lights
   ========================================================= */
const Lights = {
  build() {
    const W = innerWidth, m = W < 700, n = Math.ceil(W / (m ? W / 4 : 120)), sw = W / n, sag = m ? 16 : 24, per = m ? 3 : 4;
    const cols = ['#ffc766', '#f4b6c2', '#ff8a3d', '#3fa6a0', '#b79be0', '#fff4e0']; let d = 'M0 0', bulbs = '';
    for (let i = 0; i < n; i++) {
      const x0 = i * sw; d += ` Q${x0 + sw / 2} ${sag * 2} ${x0 + sw} 0`;
      for (let j = 1; j <= per; j++) {
        const t = j / (per + 1);
        bulbs += `<i class="bulb" style="left:${(x0 + t * sw).toFixed(1)}px;top:${(4 * sag * t * (1 - t)).toFixed(1)}px;--c:${cols[(i * per + j) % 6]};animation-delay:-${(Math.random() * 3).toFixed(2)}s"></i>`;
      }
    }
    const gr = ['#3f6a3a', '#5b8a45', '#2f5232', '#7da04f']; let g = '';
    for (let x = 14; x < W; x += m ? 50 : 70) {
      const L = rnd(20, m ? 34 : 50), sx = rnd(-8, 8), c = 3 + (Math.random() * 3 | 0);
      g += `<path d="M${x} 0Q${x + sx} ${L / 2} ${x + sx / 2} ${L}" stroke="#2c4a2b" stroke-width="1" fill="none"/>`;
      for (let k = 1; k <= c; k++) {
        const cx = (x + sx * (k / c) * .6 + (k % 2 ? 4 : -4)).toFixed(1), cy = (L * k / c).toFixed(1), a = ((k % 2 ? 35 : -35) + rnd(-15, 15)).toFixed(0);
        g += `<ellipse cx="${cx}" cy="${cy}" rx="3" ry="7" transform="rotate(${a} ${cx} ${cy})" fill="${gr[(k + (x | 0)) % 4]}"/>`;
      }
    }
    const px = m ? [.55, .7, .84] : [.3, .42, .55, .68, .8, .92], Ls = [34, 64, 40, 76, 30, 58]; let pend = '';
    px.forEach((p, i) => pend += `<div class="pend" style="left:${(p * W).toFixed(0)}px;--L:${m ? Ls[i] * .7 | 0 : Ls[i]}px;animation-delay:-${(i * .9).toFixed(1)}s"><i class="sock"></i><i class="glass"></i></div>`);
    $('#lights').innerHTML = `<svg width="${W}" height="${sag * 2 + 4}"><g>${g}</g><path class="wire" d="${d}"/></svg>${bulbs}${pend}`;
    $('#fairy').innerHTML = Array.from({ length: Math.floor(W / 14) }, () =>
      `<i style="left:${rnd(0, 100).toFixed(1)}%;bottom:${rnd(3, 34).toFixed(0)}px;animation-delay:-${rnd(0, 3).toFixed(1)}s"></i>`).join('');
  }
};
Lights.build(); addEventListener('resize', () => Lights.build());

/* DECO — balloon garland, bokeh, rising balloons, marquee letters */
const Deco = {
  build() {
    const cols = ['#f2a98b', '#e8b45a', '#f4b6c2', '#ff7a6b', '#3fa6a0', '#fff4e0', '#b79be0'], k = innerWidth < 700 ? .7 : 1; let h = '', i = 0;
    for (const [x, y, s] of [[-4, 18, 92], [4, 28, 70], [-3, 40, 84], [7, 46, 58], [-2, 56, 76], [9, 34, 52], [3, 66, 64], [-3, 76, 80], [8, 62, 48]])
      for (const side of ['left', 'right']) {
        const c = cols[i++ % cols.length];
        h += `<i class="dball${i % 3 ? '' : ' far'}" style="${side}:${x}vw;top:${y}vh;--s:${s * k | 0}px;--c1:${Balloons.shade(c, 1.25)};--c2:${c};--c3:${Balloons.shade(c, .55)};animation-delay:-${rnd(0, 5).toFixed(1)}s"></i>`;
      }
    for (let j = 0; j < 16; j++)
      h += `<i class="bk" style="--x:${rnd(0, 100).toFixed(0)}%;--y:${rnd(8, 92).toFixed(0)}%;--s:${rnd(40, 140).toFixed(0)}px;--o:${rnd(.12, .35).toFixed(2)};--t:${rnd(6, 12).toFixed(0)}s"></i>`;
    $('#deco').innerHTML = h;
  },
  rise() {
    const keys = Object.keys(BT); let h = '';
    for (let j = 0; j < 12; j++) {
      const t = BT[keys[(j * 5) % keys.length]], s = rnd(34, 64) * (innerWidth < 700 ? .8 : 1);
      h += `<i class="rb ${t.cls}" style="--x:${rnd(2, 94).toFixed(0)}%;--s:${s | 0}px;--t:${rnd(9, 16).toFixed(1)}s;--d:-${rnd(0, 12).toFixed(1)}s;--dx:${rnd(-60, 60) | 0}px;${bstyle(t)}">${RIBBON}</i>`;
    }
    $('#rise').innerHTML = h;
  },
  confetti() {
    const box = $('#petals'), n = reduce ? 12 : innerWidth < 700 ? 28 : 46, cols = ['#ffd23f', '#8e3fb5', '#e5322f', '#2f8fd8', '#3fb57a', '#ff7ab0', '#fff4e0']; let h = '';
    for (let i = 0; i < n; i++)
      h += `<i class="cf" style="--x:${rnd(0, 100).toFixed(1)}%;--w:${rnd(5, 9).toFixed(0)}px;--h:${rnd(8, 14).toFixed(0)}px;--c:${cols[i % cols.length]};--t:${rnd(6, 12).toFixed(1)}s;--d:-${rnd(0, 10).toFixed(1)}s;--dx:${rnd(-70, 70) | 0}px"></i>`;
    box.insertAdjacentHTML('beforeend', h);
  }
};
const Marquee = {
  build() {
    let i = 0;
    $('#mq').innerHTML = ['HAPPY', 'BIRTHDAY'].map(w => `<div class="row">${[...w].map(c => `<span style="--i:${i++}">${c}</span>`).join('')}</div>`).join('');
  }
};


/* =========================================================
   PHOTOS — exactly 5 photos are required; one of them becomes the Queen (centre) photo
   ========================================================= */
const Photos = {
  list: [], queen: 0, max: 5,
  init() {
    this.input = $('#inPhotos'); this.box = $('#slots');
    this.input.addEventListener('change', () => { this.add([...this.input.files]); this.input.value = ''; });
    $('#inName').addEventListener('input', () => this.gate());
    this.render();
  },
  async add(files) {
    for (const f of files) {
      if (this.list.length >= this.max) break;
      if (f.type && !f.type.startsWith('image/')) continue;
      this.list.push({ url: await this.prep(f) });
    }
    this.render();
  },
  async prep(f) {                                           // downscale very large photos to 1600px with high-quality smoothing (sharp, EXIF-correct, light on memory)
    try {
      const bmp = await createImageBitmap(f), k = Math.min(1, 1600 / Math.max(bmp.width, bmp.height));
      if (k === 1 && f.size < 1.5e6) { if (bmp.close) bmp.close(); return URL.createObjectURL(f); }
      const c = document.createElement('canvas'); c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k);
      const x = c.getContext('2d'); x.imageSmoothingQuality = 'high'; x.drawImage(bmp, 0, 0, c.width, c.height);
      const blob = await new Promise(r => c.toBlob(r, 'image/jpeg', .92));
      return URL.createObjectURL(blob || f);
    } catch (e) { return URL.createObjectURL(f); }
  },
  remove(i) {
    URL.revokeObjectURL(this.list[i].url); this.list.splice(i, 1);
    if (this.queen >= this.list.length) this.queen = 0;
    this.render();
  },
  ready() { return !!$('#inName').value.trim() && this.list.length === this.max; },
  gate() {
    const n = this.list.length, h = $('#pickHint');
    $('#begin').disabled = !this.ready(); $('#pickCount').textContent = `${n}/${this.max}`;
    h.classList.toggle('ok', n === this.max);
    h.textContent = n < this.max
      ? `${this.max - n} more photo${this.max - n === 1 ? '' : 's'} needed. Tap a photo to make it the ♛ Queen: it will appear in the centre, with a crown.`
      : 'All set ✦ The Queen photo ♛ is glowing. To change it, tap another photo.';
  },
  render() {
    this.box.innerHTML = '';
    for (let i = 0; i < this.max; i++) {
      const p = this.list[i], s = document.createElement('div');
      s.className = 'slot' + (p ? ' on' : '') + (p && i === this.queen ? ' queen' : '');
      s.tabIndex = 0; s.setAttribute('role', 'button');
      if (p) {
        s.setAttribute('aria-label', `Photo ${i + 1}: make Queen`);
        s.innerHTML = '<img alt=""><span class="qb">♛ Queen</span><span class="x" role="button" aria-label="Remove">×</span>';
        s.querySelector('img').src = p.url;
        s.querySelector('.x').addEventListener('click', e => { e.stopPropagation(); this.remove(i); });
        s.addEventListener('click', () => { this.queen = i; this.render(); });
      } else {
        s.setAttribute('aria-label', 'Add a photo');
        s.addEventListener('click', () => this.input.click());
      }
      s.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); s.click(); } });
      this.box.appendChild(s);
    }
    this.gate();
  }
};

/* =========================================================
   GALLERY — Queen frame (with crown) + 4 decorated frames
   ========================================================= */
const Gallery = {
  bloom(a, b) {
    const p = [0, 72, 144, 216, 288].map(r => `<ellipse cx="0" cy="-9" rx="7.5" ry="10.5" fill="${a}" stroke="rgba(0,0,0,.14)" stroke-width=".5" transform="rotate(${r})"/>`).join('');
    const q = [36, 108, 180, 252, 324].map(r => `<ellipse cx="0" cy="-5" rx="4.5" ry="7" fill="${b}" transform="rotate(${r})"/>`).join('');
    return `<svg viewBox="-20 -20 40 40" aria-hidden="true">${p}${q}<circle r="3.2" fill="#fff4e0" opacity=".85"/></svg>`;
  },
  cluster(cls, n) {
    const pal = [['#ff9db6', '#e0587c'], ['#ffd3dc', '#f4a5b8'], ['#fff4e0', '#ffc766'], ['#ffb3a3', '#ff7a6b'], ['#d9c2f2', '#b79be0']];
    const pts = [[50, 52], [24, 66], [76, 64], [36, 30], [66, 32], [10, 42]]; let h = '';
    for (let i = 0; i < 4; i++) h += `<i class="lf2" style="left:${rnd(15, 85).toFixed(0)}%;top:${rnd(25, 80).toFixed(0)}%;--r:${rnd(-70, 70).toFixed(0)}deg"></i>`;
    for (let i = 0; i < n; i++) {
      const c = pal[(i + (Math.random() * 5 | 0)) % 5], s = rnd(34, 48);
      h += `<div class="bl" style="left:${pts[i][0]}%;top:${pts[i][1]}%;width:${s.toFixed(0)}%;animation-delay:-${rnd(0, 4).toFixed(1)}s">${this.bloom(c[0], c[1])}</div>`;
    }
    return `<div class="bq ${cls}">${h}</div>`;
  },
  crown: `<svg class="crown" viewBox="0 0 200 112" aria-hidden="true"><defs>
    <linearGradient id="crG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff1b8"/><stop offset=".5" stop-color="#e8b04a"/><stop offset="1" stop-color="#9a6516"/></linearGradient>
    <radialGradient id="crM" cx=".35" cy=".3"><stop offset="0" stop-color="#fff"/><stop offset=".45" stop-color="#ff9db6"/><stop offset="1" stop-color="#b5173f"/></radialGradient>
    <radialGradient id="crP" cx=".35" cy=".3"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#d9c9a8"/></radialGradient></defs>
    <path d="M12 100L20 44L52 72L76 24L88 62L100 8L112 62L124 24L148 72L180 44L188 100Z" fill="url(#crG)" stroke="#8a5a14" stroke-width="2" stroke-linejoin="round"/>
    <rect x="10" y="90" width="180" height="18" rx="7" fill="url(#crG)" stroke="#8a5a14" stroke-width="2"/>
    <circle cx="20" cy="40" r="7" fill="url(#crP)"/><circle cx="76" cy="20" r="7" fill="url(#crP)"/><circle cx="100" cy="5" r="8" fill="url(#crM)"/><circle cx="124" cy="20" r="7" fill="url(#crP)"/><circle cx="180" cy="40" r="7" fill="url(#crP)"/>
    <circle cx="100" cy="99" r="6" fill="url(#crM)"/><circle cx="64" cy="99" r="4.5" fill="url(#crP)"/><circle cx="136" cy="99" r="4.5" fill="url(#crP)"/><circle cx="32" cy="99" r="4" fill="url(#crM)"/><circle cx="168" cy="99" r="4" fill="url(#crM)"/></svg>`,
  build() {
    const L = Photos.list, q = L[Photos.queen], o = L.filter((_, i) => i !== Photos.queen);
    const fig = (p, role, shape, extra) => `<figure class="fr fr-${shape} ${role}"><div class="gf"><img src="${p.url}" alt=""></div>${extra}</figure>`;
    const xs = [6, 26, 50, 74, 94, 15, 85], ys = [-.05, -.16, -.27, -.16, -.05, -.3, -.3];
    const spk = xs.map((x, i) => `<i class="sp" style="--x:${x}%;--y:${ys[i]};--d:-${(i * .27).toFixed(2)}s"></i>`).join('');
    $('#gWall').innerHTML =
      fig(o[0], 'o1', 'oval', this.cluster('c', 3)) + fig(o[1], 'i1', 'rect', this.cluster('c', 3)) +
      fig(q, 'queen', 'queen', this.crown + `<div class="sparks">${spk}</div>` + this.cluster('l', 6) + this.cluster('r', 6) + '<figcaption class="cap script" id="gCap"></figcaption>') +
      fig(o[2], 'i2', 'rect', this.cluster('c', 3)) + fig(o[3], 'o2', 'oval', this.cluster('c', 3));
    $('#gCap').textContent = S.display; $('#gTitle').textContent = S.display;
    const k = innerWidth < 700 ? .75 : 1;
    const mk = list => list.map(([key, x, y, s], i) => { const t = BT[key];
      return `<i class="gb ${t.cls}" style="--x:${x}%;--y:${y}%;--s:${s * k | 0}px;${bstyle(t)};--d:-${i}s">${RIBBON}</i>`; }).join('');
    $('#bunchL').innerHTML = mk([['gold', 6, 8, 74], ['black', 44, 0, 80], ['clear', 24, 24, 72], ['gold', 56, 32, 58], ['black', 4, 38, 58]]);
    $('#bunchR').innerHTML = mk([['heart1', 18, 6, 86], ['heart2', 48, 0, 78], ['heart3', 30, 28, 72], ['heart1', 6, 38, 56]]);
  },
  async show() {
    document.body.classList.add('gal'); document.body.dataset.scene = 'gallery';
    this.build();
    const g = $('#gallery'); g.scrollTop = 0; g.classList.add('show');
    await wait(1400);
    for (const k of ['o1', 'o2', 'i1', 'i2', 'queen']) {
      g.querySelector('.fr.' + k).classList.add('in'); Audio_.tone(440 + Math.random() * 300, .6, 'sine', .04); await wait(700);
    }
    await wait(500);
    g.querySelector('.crown').classList.add('on'); g.querySelector('.sparks').classList.add('on'); Audio_.chime();
    await wait(1600);
    $('#gNext').classList.add('show');
    await new Promise(r => $('#gNext').addEventListener('click', r, { once: true }));
    g.classList.remove('show'); await wait(1500);
    document.body.classList.remove('gal');
  }
};

/* =========================================================
   AVATAR — the rigged character: lights the candles, blows them out, hands over the knife
   ========================================================= */
const Avatar = {
  el: $('#avatar'), talking: false, alive: false,
  build() {},                                                   // the character is made of static PNG layers (assets/rig)
  /* screen position of an invisible anchor that rotates with its body part */
  anchor(sel) { const r = this.el.querySelector(sel).getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; },
  hand() { return this.anchor('.rg-arm.r .pt.hand'); },        // right palm: the match and the knife start here
  mouthPos() { return this.anchor('.rg-head .pt.mouth'); },    // the wind starts here
  enter() { this.el.classList.add('show'); this.pose('idle'); this.life(); },
  pose(p) {
    this.el.dataset.pose = p;
    if (p === 'cheer') { this.setMouth('wide'); setTimeout(() => this.setMouth('closed'), 1800); }
  },
  setMouth(m) { this.el.dataset.mouth = m; },
  /* random blinking (every 2.4 - 6 s) */
  life() {
    if (this.alive) return; this.alive = true;
    let next = performance.now() + 2500;
    const tick = t => {
      if (t > next) { const l = this.el.querySelector('.rg-lids'); l.classList.add('blink'); setTimeout(() => l.classList.remove('blink'), 260); next = t + 2400 + Math.random() * 3600; }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  },
  /* lip movement while she speaks */
  async talk(ms) {
    this.talking = true; const n = Math.ceil(ms * CONFIG.pace / 170);
    for (let i = 0; i < n && this.talking; i++) {
      this.setMouth(['o', 'wide', 'wide', 'o', 'closed', 'wide'][Math.random() * 6 | 0]);
      await new Promise(r => setTimeout(r, 90 + Math.random() * 120));
    }
    this.setMouth('closed');
  },
  async say(text, ms = 2000, pose) {
    if (pose) this.pose(pose);
    const b = $('#avBubble'); b.textContent = text; b.classList.add('show');
    const t = this.talk(ms);
    await wait(ms); this.talking = false; await t;
    b.classList.remove('show'); await wait(250);
  },
  /* flying match lights the wax letters one by one */
  async lightAll() {
    const g = this.hand(), m = $('#fmatch'), P = (x, y, r) => `translate(${x}px,${y}px) rotate(${r}deg)`;
    let cur = P(g.x - 4, g.y, 18);
    m.style.display = 'block'; m.style.opacity = 1;
    for (const [i, el] of Cake.candleEls.entries()) {
      const r = el.getBoundingClientRect(), fx = parseFloat(el.style.getPropertyValue('--fx')) / 100;
      const to = P(r.left + r.width * fx - 4, r.top + 9, 18);               // the match flame touches the wick
      await m.animate([{ transform: cur }, { transform: to }], { duration: 240 * CONFIG.pace, easing: 'ease-in-out', fill: 'forwards' }).finished;
      el.classList.remove('unlit'); el.classList.add('pop'); Audio_.tone(700 + i * 40, .35, 'sine', .035);
      cur = to; await wait(120);
    }
    await m.animate([{ transform: cur, opacity: 1 }, { transform: cur + ' translateY(-24px)', opacity: 0 }], { duration: 500 * CONFIG.pace, fill: 'forwards' }).finished;
    m.style.display = 'none';
  },
  /* cheeks puff, wind streaks fly to the cake, flames bend and go out */
  async blow() {
    this.pose('blow'); this.setMouth('o'); Audio_.noise(1.1, .28, 2400);
    const mo = this.mouthPos(), hx = mo.x, hy = mo.y;
    const rs = Cake.candleEls.map(e => e.getBoundingClientRect());
    const tx = rs.reduce((a, r) => a + r.left + r.width / 2, 0) / rs.length, ty = rs.reduce((a, r) => a + r.top, 0) / rs.length;
    for (let i = 0; i < 9; i++) {
      const w = document.createElement('i'); w.className = 'wind'; document.body.appendChild(w);
      const sy = hy + rnd(-12, 12), ey = ty + rnd(-30, 40), ang = Math.atan2(ey - sy, tx - hx) * 180 / Math.PI;
      w.animate([{ transform: `translate(${hx}px,${sy}px) rotate(${ang}deg) scaleX(.4)`, opacity: 0 }, { offset: .2, opacity: .85 },
        { transform: `translate(${tx + rnd(-60, 60)}px,${ey}px) rotate(${ang}deg) scaleX(1.8)`, opacity: 0 }],
        { duration: rnd(600, 900), delay: i * 70, easing: 'ease-out', fill: 'forwards' }).finished.then(() => w.remove());
    }
    await wait(500);
    Cake.candleEls.forEach(e => e.classList.add('bend'));
    await wait(520);
    Cake.candleEls.forEach(e => e.classList.remove('bend'));
    Cake.extinguish();
    await wait(700);
    this.pose('idle'); this.setMouth('closed');
  },
  /* last: she steps forward, says her line, walks away → message */
  async farewell() {
    const a = this.el; a.classList.remove('gone'); a.classList.add('show', 'big');
    await wait(1000);
    await this.say("I am going to read the message… ✦", 3000, 'wave');
    this.pose('walk'); a.classList.add('exit'); await wait(1100);
    a.classList.remove('show', 'big', 'exit'); a.classList.add('gone');
  }
};

/* =========================================================
   SUBTITLES + MESSAGE
   ========================================================= */
const Sub = {
  async say(t, ms = 2400) { const s = $('#sub'); s.textContent = t; s.classList.add('show'); await wait(ms); s.classList.remove('show'); }
};
const Message = {
  follow(card, el) {
    const a = el.getBoundingClientRect(), b = card.getBoundingClientRect();
    if (a.bottom > b.bottom - 50) card.scrollTop += a.bottom - b.bottom + 90;
  },
  async show() {
    document.body.classList.add('msgmode'); document.body.dataset.scene = 'message';
    const full = $('#full'), box = $('#typed'), card = $('.card'), skip = $('#skip');
    S.lines.forEach(l => { const p = document.createElement('p'); p.textContent = l; full.appendChild(p); });
    $('#msg').classList.add('show'); $('#mq').classList.add('on');
    await wait(1600);
    let fast = false, follow = true;
    skip.classList.add('show'); skip.onclick = () => { fast = true; skip.classList.remove('show'); };
    ['wheel', 'touchmove'].forEach(ev => card.addEventListener(ev, () => { follow = false; }, { passive: true }));
    for (const line of S.lines) {
      const p = document.createElement('p'), cur = document.createElement('span'), ch = [...line];
      cur.className = 'cursor'; box.appendChild(p); p.appendChild(cur);
      for (let i = 0; i < ch.length; i++) {
        if (fast) { cur.before(ch.slice(i).join('')); break; }
        cur.before(ch[i]);
        if (i % 24 === 0 && follow) this.follow(card, cur);
        await wait(CONFIG.charDelay);
      }
      cur.remove(); if (follow) this.follow(card, p);
      await wait(fast ? 0 : 280);
    }
    skip.classList.remove('show');
    $('#sign').classList.add('show'); if (follow) card.scrollTo({ top: card.scrollHeight, behavior: 'smooth' });
    await wait(1500); $('#replay').classList.add('show');
  },
  petals() {
    const box = $('#petals'), n = reduce ? 10 : 26;
    for (let i = 0; i < n; i++) {
      const p = document.createElement('i'); p.className = 'petal';
      p.style.cssText = `left:${rnd(0, 100)}%;--dx:${rnd(-80, 80)}px;animation-duration:${rnd(9, 16)}s;animation-delay:${rnd(0, 8)}s;transform:scale(${rnd(.6, 1.2)})`;
      box.appendChild(p);
    }
  }
};

/* =========================================================
   TIMELINE
   wish → candles out → knife → cut → fireworks + balloons → message
   ========================================================= */
let phase = 'idle';
function setUI(show, label, hint) {
  const b = $('#wish'), t = $('#hint');
  if (show) { b.textContent = label; t.textContent = hint; b.hidden = t.hidden = false; b.classList.remove('hide'); t.classList.remove('hide'); }
  else { b.classList.add('hide'); t.classList.add('hide'); }
}
async function onAction() {
  if (phase === 'light') await lightCandles();
  else if (phase === 'wish') await blowOut();
  else if (phase === 'cut') await cutAndCelebrate();
}
async function lightCandles() {                             // 1) light the candles
  phase = 'busy'; setUI(false);
  await Avatar.say('Lighting the candles…', 1500, 'light');
  await Avatar.lightAll();
  Avatar.pose('idle');
  await Avatar.say('Now I will make a lovely wish ✦', 2200);
  setUI(true, CONFIG.buttonLabel, CONFIG.hint); phase = 'wish';
}
async function blowOut() {                                  // 2) wish → blow → remove candles → knife
  phase = 'busy'; setUI(false);
  await Avatar.say('Wish made… now I will blow them out!', 1800);
  await Avatar.blow();
  Audio_.scene('knife');                                    // candles out → switch to the knife-scene song
  await Cake.removeCandles();
  Avatar.say('Candles removed ✦', 1800);
  document.body.classList.add('cine'); $('#neon').classList.add('dim');
  Sub.say(`Did you make a wish, ${S.first}?`, 2400);
  await Knife.enter();
  setUI(true, CONFIG.cutLabel, CONFIG.cutHint); phase = 'cut';
}
async function cutAndCelebrate() {                          // 3) cutting the cake
  phase = 'busy'; setUI(false);
  Avatar.say('Now I will cut the cake!', 1800);
  Sub.say('A sweet little moment…', 3200);
  Cake.freeze(true);
  await Knife.cut();
  await celebrate();
}
async function celebrate() {
  document.body.classList.remove('cine'); Cake.freeze(false);
  document.body.classList.add('lit');                       // room ignites
  FX.start(); Audio_.scene('celebration');
  for (let i = 0; i < 4; i++) setTimeout(() => FX.launch(), i * 220);
  await wait(1800);
  $('#neon').classList.add('off'); document.body.classList.add('balloons');
  Deco.rise(); Deco.confetti(); Balloons.spawn();                            // balloons float
  await wait(CONFIG.timing.floatMs);
  Balloons.snap();                                          // snap into a row
  await wait(2800);
  Balloons.mode = 'hold'; $('#balloons').classList.add('glow'); document.body.classList.add('hold'); Avatar.pose('idle');
  await wait(CONFIG.timing.holdMs);
  $('#balloons').classList.add('away');                     // balloons leave
  await wait(1200); Balloons.mode = 'gone';
  await Gallery.show();                                     // 5 photos, queen frame
  await Avatar.farewell();                                  // "I am going to read the message"
  Audio_.scene('message'); Message.petals(); await Message.show();   // glass message
}

/* =========================================================
   INIT
   ========================================================= */
$('#music').addEventListener('click', () => Audio_.toggle());
$('#wish').addEventListener('click', onAction);
$('#cake').addEventListener('click', onAction);
$('#cake').addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onAction(); } });
$('#replay').addEventListener('click', () => {
  location.search = new URLSearchParams({ name: S.display }).toString();
});

document.body.dataset.scene = 'intro';
$('#inName').value = new URLSearchParams(location.search).get('name') || '';

Cake.build(); Cake.garland(); Cake.parallax(); Deco.build(); Marquee.build(); Photos.init();

$('#setup').addEventListener('submit', async e => {
  e.preventDefault();
  if (!Photos.ready()) return;                              // name + 5 photos are required
  setName($('#inName').value); applyName();
  setPhoto(Photos.list[Photos.queen].url);                  // the Queen photo becomes the profile picture
  Avatar.build();
  Audio_.init(); Audio_.scene('ambient');                     // this tap unlocks audio
  $('#setup').classList.add('hide'); await wait(800);
  $('#setup').hidden = true; $('#introText').hidden = false;
  await wait(5200);                                         // the ambient track keeps playing here
  $('#intro').classList.add('gone'); document.body.classList.add('started'); document.body.dataset.scene = 'cake';
  await wait(1300);
  Cake.enter();
});