import { weddingConfig } from '../data/weddingConfig';

/**
 * Background music engine.
 *  • Must be started from a user gesture (mobile autoplay rules).
 *  • Uses a Web Audio gain node for fades — iOS ignores <audio>.volume.
 *  • Plays the configured file; if none is set (or it fails), it
 *    synthesises a soft santoor + tanpura melody in Raga Mohanam.
 *  • Music lives outside React, so section changes never restart it.
 */

const cfg = weddingConfig.music;
const listeners = new Set();
let state = { started: false, playing: false, available: true };

let ctx = null;
let master = null;
let audioEl = null;
let synth = null;
let userMuted = false;

const emit = (patch) => {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
};

function fadeTo(value, seconds) {
  if (!master || !ctx) return;
  const now = ctx.currentTime;
  master.gain.cancelScheduledValues(now);
  master.gain.setValueAtTime(master.gain.value, now);
  master.gain.linearRampToValueAtTime(value, now + seconds);
}

function startFile() {
  audioEl = new Audio();
  audioEl.src = cfg.src;
  audioEl.loop = true;
  audioEl.preload = 'auto';
  audioEl.playsInline = true;
  audioEl.addEventListener('error', () => {
    // File missing or unsupported → fall back to the synthesised melody.
    audioEl = null;
    if (cfg.synthFallback && ctx) startSynth();
    else emit({ available: false, playing: false });
  });
  if (ctx) {
    ctx.createMediaElementSource(audioEl).connect(master);
  } else {
    audioEl.volume = cfg.volume;
  }
  audioEl.play().catch(() => {});
}

function startSynth() {
  if (synth || !ctx) return;
  synth = createRagaSynth(ctx, master);
  synth.start();
}

export const audioEngine = {
  subscribe(l) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  getState: () => state,

  /** Call synchronously inside a tap/click handler. */
  start() {
    if (state.started) return;
    // iOS mutes Web Audio when the ring/silent switch is on; 'playback' opts out.
    try {
      if (navigator.audioSession) navigator.audioSession.type = 'playback';
    } catch {
      /* unsupported — ignore */
    }
    const AC = window.AudioContext || window.webkitAudioContext;
    try {
      ctx = AC ? new AC() : null;
    } catch {
      ctx = null;
    }
    if (ctx) {
      master = ctx.createGain();
      master.gain.value = 0;
      master.connect(ctx.destination);
      ctx.resume?.();
    }

    if (cfg.src) startFile();
    else if (cfg.synthFallback && ctx) startSynth();
    else {
      emit({ available: false });
      return;
    }

    fadeTo(cfg.volume, 3.5);
    emit({ started: true, playing: true });
    document.addEventListener('visibilitychange', onVisibility);
  },

  toggle() {
    if (!state.started) return;
    if (state.playing) {
      userMuted = true;
      pause();
    } else {
      userMuted = false;
      resume();
    }
  },
};

function pause() {
  fadeTo(0, 0.6);
  if (!ctx && audioEl) audioEl.pause();
  window.setTimeout(() => {
    if (state.playing) return;
    audioEl?.pause();
    ctx?.suspend?.();
  }, 650);
  emit({ playing: false });
}

function resume() {
  ctx?.resume?.();
  audioEl?.play().catch(() => {});
  fadeTo(cfg.volume, 1.5);
  emit({ playing: true });
}

function onVisibility() {
  if (document.hidden && state.playing) pause();
  else if (!document.hidden && !userMuted && !state.playing) resume();
}

/* ───────────────────────── Raga Mohanam synth ───────────────────────── */

function createRagaSynth(ac, out) {
  const SA = 196; // G3 tonic
  // Mohanam / Bhupali: Sa Ri Ga Pa Dha
  const STEPS = [0, 2, 4, 7, 9];
  // Melody range: lower Pa .. upper Ga (scale-degree index → semitones)
  const degrees = [];
  for (let oct = -1; oct <= 2; oct++) STEPS.forEach((s) => degrees.push(s + oct * 12));
  const melody = degrees.filter((s) => s >= 7 && s <= 28); // Pa .. upper Ga
  const freq = (semi) => SA * Math.pow(2, semi / 12);

  // Reverb: generated stereo impulse response
  const reverb = ac.createConvolver();
  const len = Math.floor(ac.sampleRate * 3.6);
  const ir = ac.createBuffer(2, len, ac.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = ir.getChannelData(ch);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.2);
  }
  reverb.buffer = ir;
  const wet = ac.createGain();
  wet.gain.value = 0.42;
  const dry = ac.createGain();
  dry.gain.value = 0.8;
  const bus = ac.createGain();
  const tone = ac.createBiquadFilter();
  tone.type = 'lowpass';
  tone.frequency.value = 3200;
  bus.connect(tone);
  tone.connect(dry).connect(out);
  tone.connect(reverb).connect(wet).connect(out);

  // Karplus–Strong plucked string, tuned exactly via playbackRate
  const cache = new Map();
  function pluck(f, decay = 0.9965, seconds = 3) {
    const key = `${f.toFixed(2)}-${decay}`;
    if (cache.has(key)) return cache.get(key);
    const sr = ac.sampleRate;
    const period = Math.max(2, Math.round(sr / f));
    const n = Math.floor(sr * seconds);
    const buf = ac.createBuffer(1, n, sr);
    const d = buf.getChannelData(0);
    const ring = new Float32Array(period);
    let prev = 0;
    for (let i = 0; i < period; i++) {
      const r = Math.random() * 2 - 1;
      ring[i] = (r + prev) * 0.5; // softened excitation (less harsh attack)
      prev = r;
    }
    let idx = 0;
    let peak = 0;
    for (let i = 0; i < n; i++) {
      const nxt = (idx + 1) % period;
      const v = ring[idx];
      ring[idx] = decay * 0.5 * (ring[idx] + ring[nxt]);
      d[i] = v;
      if (Math.abs(v) > peak) peak = Math.abs(v);
      idx = nxt;
    }
    const fadeStart = Math.floor(n * 0.7);
    for (let i = 0; i < n; i++) {
      let g = 1 / (peak || 1);
      if (i < 120) g *= i / 120;
      if (i > fadeStart) g *= 1 - (i - fadeStart) / (n - fadeStart);
      d[i] *= g;
    }
    const entry = { buf, rate: f / (sr / (period + 0.5)) };
    cache.set(key, entry);
    return entry;
  }

  function play(f, when, gainValue, decay, seconds, pan = 0) {
    const { buf, rate } = pluck(f, decay, seconds);
    const src = ac.createBufferSource();
    src.buffer = buf;
    src.playbackRate.value = rate;
    const g = ac.createGain();
    g.gain.value = gainValue;
    let node = src.connect(g);
    if (ac.createStereoPanner) {
      const p = ac.createStereoPanner();
      p.pan.value = pan;
      node = node.connect(p);
    }
    node.connect(bus);
    src.start(when);
  }

  // Soft drone pad (Sa – Pa – Sa)
  const pad = ac.createGain();
  pad.gain.value = 0.0;
  const padFilter = ac.createBiquadFilter();
  padFilter.type = 'lowpass';
  padFilter.frequency.value = 700;
  pad.connect(padFilter).connect(bus);
  const oscs = [SA / 2, (SA * 3) / 4, SA].map((f, i) => {
    const o = ac.createOscillator();
    o.type = i === 0 ? 'sine' : 'triangle';
    o.frequency.value = f;
    o.detune.value = (i - 1) * 3;
    const g = ac.createGain();
    g.gain.value = i === 0 ? 0.5 : 0.22;
    o.connect(g).connect(pad);
    return o;
  });
  const lfo = ac.createOscillator();
  lfo.frequency.value = 0.07;
  const lfoGain = ac.createGain();
  lfoGain.gain.value = 0.025;
  lfo.connect(lfoGain).connect(pad.gain);

  // Scheduler
  const BEAT = 60 / 66;
  let nextTime = 0;
  let tanpuraTime = 0;
  let tanpuraStep = 0;
  let pos = melody.indexOf(12); // start on middle Sa
  let phraseLeft = 0;
  let timer = null;

  function nextNote() {
    if (phraseLeft <= 0) {
      phraseLeft = 5 + Math.floor(Math.random() * 6);
      return { rest: BEAT * (1.5 + Math.random() * 1.5) };
    }
    phraseLeft -= 1;
    const r = Math.random();
    const step = r < 0.38 ? 1 : r < 0.76 ? -1 : r < 0.88 ? 2 : -2;
    pos = Math.min(melody.length - 1, Math.max(0, pos + step));
    const durs = [0.5, 0.5, 1, 1, 1, 1.5, 2];
    let dur = durs[Math.floor(Math.random() * durs.length)];
    const semi = melody[pos];
    if (phraseLeft === 0) {
      // resolve phrases on Sa or Pa
      const targets = melody.map((s, i) => [s, i]).filter(([s]) => s % 12 === 0 || s % 12 === 7);
      const [s, i] = targets.reduce((a, b) => (Math.abs(b[1] - pos) < Math.abs(a[1] - pos) ? b : a));
      pos = i;
      return { semi: s, dur: 2.5 };
    }
    return { semi, dur };
  }

  function schedule() {
    const ahead = ac.currentTime + 0.6;
    while (nextTime < ahead) {
      const n = nextNote();
      if (n.rest) {
        nextTime += n.rest;
        continue;
      }
      const vel = 0.16 + Math.random() * 0.07;
      play(freq(n.semi), nextTime, vel, 0.9968, 3.2, (Math.random() - 0.5) * 0.5);
      // occasional gentle grace note an octave up
      if (Math.random() < 0.12) play(freq(n.semi + 12), nextTime + 0.02, vel * 0.3, 0.996, 2.4, 0.3);
      nextTime += n.dur * BEAT;
    }
    // Tanpura cycle: Pa  Sa'  Sa'  Sa
    const tanpura = [(SA * 3) / 4, SA, SA, SA / 2];
    while (tanpuraTime < ahead) {
      play(tanpura[tanpuraStep % 4], tanpuraTime, 0.07, 0.9993, 4.5, tanpuraStep % 2 ? -0.35 : 0.35);
      tanpuraStep += 1;
      tanpuraTime += BEAT * 1.25;
    }
  }

  return {
    start() {
      const t = ac.currentTime + 0.15;
      nextTime = t + BEAT * 2;
      tanpuraTime = t;
      oscs.forEach((o) => o.start(t));
      lfo.start(t);
      pad.gain.setValueAtTime(0, t);
      pad.gain.linearRampToValueAtTime(0.06, t + 6);
      schedule();
      timer = window.setInterval(schedule, 150);
    },
    stop() {
      window.clearInterval(timer);
    },
  };
}
