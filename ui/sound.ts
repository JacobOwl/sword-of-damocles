// Sound, made in the browser with the Web Audio API: no recordings, nothing downloaded (see docs/art-direction.md).
// A lyre phrase opens each season, the harbour breathes underneath (wind in winter, cicadas in summer), a low drone
// sounds while a plot you know of has a name, and a pebble clicks when you act. Off until the player turns it on;
// the choice is remembered on this device. Nothing here reads or changes the game's dice.
import type { GameState } from "../src/core/index.ts";
import { knownDanger } from "./ambient.ts";

const KEY = "sword-of-damocles-sound";
let on = false;
try { on = localStorage.getItem(KEY) === "on"; } catch { /* storage may be blocked */ }

let ctx: AudioContext | null = null;
let master: GainNode;
let bed: { gain: GainNode; filter: BiquadFilterNode; cic: GainNode } | null = null;
let drone: { gain: GainNode } | null = null;
let lastSeason = -1;

export const soundOn = () => on;

function audio(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AC = (window as any).AudioContext ?? (window as any).webkitAudioContext;
  if (!AC) return null;
  if (!ctx) {
    ctx = new AC() as AudioContext;
    master = ctx.createGain();
    master.gain.value = 0.55;
    // A touch of room: a short feedback delay, like stone walls.
    const d = ctx.createDelay(); d.delayTime.value = 0.19;
    const fb = ctx.createGain(); fb.gain.value = 0.22;
    const wet = ctx.createGain(); wet.gain.value = 0.25;
    master.connect(ctx.destination); master.connect(d); d.connect(fb); fb.connect(d); d.connect(wet); wet.connect(ctx.destination);
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function noiseBuffer(c: AudioContext, seconds: number) {
  const b = c.createBuffer(1, c.sampleRate * seconds, c.sampleRate);
  const d = b.getChannelData(0);
  let last = 0;
  for (let i = 0; i < d.length; i++) { const w = Math.random() * 2 - 1; last = (last + 0.02 * w) / 1.02; d[i] = last * 3.5; } // brown-ish
  return b;
}

// ---------- The lyre: a plucked string (Karplus-Strong), tuned to a Dorian scale on E ----------
const SCALE = [164.8, 174.6, 196.0, 220.0, 246.9, 261.6, 293.7, 329.6, 349.2, 392.0];
const cache = new Map<number, AudioBuffer>();
function pluckBuffer(c: AudioContext, f: number) {
  const hit = cache.get(f);
  if (hit) return hit;
  const len = Math.floor(c.sampleRate * 2.4);
  const b = c.createBuffer(1, len, c.sampleRate);
  const d = b.getChannelData(0);
  const p = Math.round(c.sampleRate / f);
  const ring = new Float32Array(p);
  for (let i = 0; i < p; i++) ring[i] = Math.random() * 2 - 1;
  for (let i = 0, j = 0; i < len; i++, j = (j + 1) % p) {
    const next = ring[(j + 1) % p];
    d[i] = ring[j];
    ring[j] = 0.4985 * (ring[j] + next);
  }
  cache.set(f, b);
  return b;
}
function pluck(c: AudioContext, f: number, at: number, vol = 0.35) {
  const src = c.createBufferSource(); src.buffer = pluckBuffer(c, f);
  const g = c.createGain(); g.gain.value = vol;
  const lp = c.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 2600;
  src.connect(lp); lp.connect(g); g.connect(master);
  src.start(at);
}
function phrase(steps: number[], start = 3, gap = 0.34) {
  const c = audio(); if (!c) return;
  let i = start, t = c.currentTime + 0.05;
  for (const s of steps) { i = Math.max(0, Math.min(SCALE.length - 1, i + s)); pluck(c, SCALE[i], t); t += gap * (0.85 + Math.random() * 0.3); }
}

// ---------- The bed: wind and water, cicadas in summer ----------
function ensureBed(c: AudioContext) {
  if (bed) return bed;
  const src = c.createBufferSource(); src.buffer = noiseBuffer(c, 6); src.loop = true;
  const filter = c.createBiquadFilter(); filter.type = "lowpass"; filter.frequency.value = 500;
  const gain = c.createGain(); gain.gain.value = 0;
  const lfo = c.createOscillator(); lfo.frequency.value = 0.09;
  const lfoAmt = c.createGain(); lfoAmt.gain.value = 0.025;
  lfo.connect(lfoAmt); lfoAmt.connect(gain.gain);
  src.connect(filter); filter.connect(gain); gain.connect(master);
  // Cicadas: high, narrow noise, pulsed fast.
  const csrc = c.createBufferSource(); csrc.buffer = noiseBuffer(c, 3); csrc.loop = true;
  const bp = c.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 5200; bp.Q.value = 9;
  const pulse = c.createOscillator(); pulse.frequency.value = 38;
  const cic = c.createGain(); cic.gain.value = 0;
  const pulseAmt = c.createGain(); pulseAmt.gain.value = 0;
  pulse.connect(pulseAmt); pulseAmt.connect(cic.gain);
  csrc.connect(bp); bp.connect(cic); cic.connect(master);
  src.start(); lfo.start(); csrc.start(); pulse.start();
  bed = { gain, filter, cic: pulseAmt };
  return bed;
}

function setBed(c: AudioContext, season: number) {
  const b = ensureBed(c);
  const q = season % 4; // autumn, winter, spring, summer
  const t = c.currentTime;
  b.gain.gain.setTargetAtTime([0.05, 0.075, 0.04, 0.035][q], t, 1.5);
  b.filter.frequency.setTargetAtTime([520, 380, 700, 900][q], t, 1.5);
  b.cic.gain.setTargetAtTime(q === 3 ? 0.05 : q === 2 ? 0.012 : 0, t, 2);
}

// ---------- The drone: while a known plot has a name ----------
function setDrone(c: AudioContext, level: number) {
  if (!drone) {
    const gain = c.createGain(); gain.gain.value = 0;
    const lp = c.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 240;
    for (const f of [55, 55.6, 82.4]) { const o = c.createOscillator(); o.type = "sawtooth"; o.frequency.value = f; o.connect(lp); o.start(); }
    lp.connect(gain); gain.connect(master);
    drone = { gain };
  }
  drone.gain.gain.setTargetAtTime(level >= 3 ? 0.09 : level === 2 ? 0.035 : 0, c.currentTime, 2.5);
}

function silence() {
  if (!ctx) return;
  const t = ctx.currentTime;
  bed?.gain.gain.setTargetAtTime(0, t, 0.3); bed?.cic.gain.setTargetAtTime(0, t, 0.3);
  drone?.gain.gain.setTargetAtTime(0, t, 0.3);
}

// ---------- What the screens call ----------
export function update(g: GameState | null) {
  if (!on || !g) { silence(); return; }
  const c = audio(); if (!c) return;
  setBed(c, g.over ? g.over.season : g.season);
  setDrone(c, g.over ? 0 : knownDanger(g).stage);
  if (g.season !== lastSeason && !g.over) {
    if (lastSeason >= 0) phrase(g.season % 4 === 3 ? [0, 2, 1, -1, 2] : g.season % 4 === 1 ? [0, -1, -1, 1, -2] : [0, 1, 1, -2, 1]);
    lastSeason = g.season;
  }
}
export function tick() {
  if (!on) return;
  const c = audio(); if (!c) return;
  const src = c.createBufferSource(); src.buffer = noiseBuffer(c, 0.06);
  const bp = c.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 1900; bp.Q.value = 3;
  const g = c.createGain(); g.gain.setValueAtTime(0.5, c.currentTime); g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.06);
  src.connect(bp); bp.connect(g); g.connect(master); src.start();
}
export function ending(reason: string) {
  if (!on) return;
  if (reason === "survived") phrase([0, 2, 2, 1, 2, 1], 2, 0.42);
  else phrase([0, -1, -2, -1, -2], 7, 0.55);
}
export function toggle(g: GameState | null) {
  on = !on;
  try { localStorage.setItem(KEY, on ? "on" : "off"); } catch { /* ignore */ }
  if (on) { lastSeason = g?.season ?? -1; update(g); phrase([0, 2, -1, 1], 3, 0.3); } else silence();
  return on;
}
