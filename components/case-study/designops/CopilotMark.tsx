"use client";

// The copilot's mark.
// Icon sizes (< 64) are a still halftone of the copilot's sphere, symmetric like a logo (see `halftone`);
// the animated sphere (`sphere`), the gradient donut (`donut`) and the tile grid (`pixel`) stay available
// through `kind`:
//   28 → on the dark (rail logo, panel card, folded panel, mobile)
//   20 → on the light canvas (copilot labels, header, ⌘K) and, in white, inside copilot buttons
// Big (onboarding): the flat donut drawn as a grid of fine square tiles that stay put, with the light
// moving through them; the left half dissolves into soft light, so the O reads as the D of DesignOps.
// It has a thinking state.
// Colour: the gradient (--g1…--g4) turns around the ring and a brighter band sweeps over it.
// White: the same sweep, as brightness only. Reduced motion = one still frame.

import { useEffect, useRef } from "react";

type RGB = [number, number, number];

function readColor(el: Element, name: string): RGB {
  const m = getComputedStyle(el).getPropertyValue(name).trim().match(/^#?([0-9a-f]{6})$/i);
  if (!m) return [139, 92, 255];
  const n = parseInt(m[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** Colour at f (0…1) around the ring, cycling through the stops and back to the first. */
function ramp(stops: RGB[], f: number): RGB {
  const x = (((f % 1) + 1) % 1) * stops.length;
  const i = Math.floor(x), k = x - i;
  const a = stops[i], b = stops[(i + 1) % stops.length];
  return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
}

/** Icon sizes: a thick gradient donut with a small hole. The whole ring stays as a faint base; the right
 *  half, the bowl of the D, draws itself top to bottom with round ends, holds, shrinks to a dot that runs
 *  round the left half back to the top, and draws again. Thinking: the same loop, quicker and without the hold. */
function donut(ctx: CanvasRenderingContext2D, size: number, dpr: number, tone: "color" | "white", read: () => RGB[], thinking: { current: boolean }, reduce: boolean) {
  const lw = size * 0.3, r = size / 2 - lw / 2 - size * 0.02, mid = size / 2, top = -Math.PI / 2;
  const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2);
  let stops = read();
  // The faint base is pixels: the ring as a grid of small square tiles (13 × 13 at icon sizes, fine 2.5px tiles
  // when big), each tinted by where it sits in the turning gradient. Whole device pixels, so tiles stay crisp.
  const CELLS = size >= 64 ? Math.floor(size / 2.5) : 13;
  const px = Math.floor((size * dpr) / CELLS) / dpr;
  const sq = px - Math.max(1, Math.round(px * 0.18 * dpr)) / dpr;
  const off = Math.round(((size - CELLS * px) / 2) * dpr) / dpr;
  const outer = r + lw / 2, inner = r - lw / 2;
  const tiles: { x: number; y: number; a: number; k: number }[] = [];
  for (let gy = 0; gy < CELLS; gy++) for (let gx = 0; gx < CELLS; gx++) {
    const x0 = off + gx * px, y0 = off + gy * px;
    let hit = 0;
    for (let sy = 0; sy < 6; sy++) for (let sx = 0; sx < 6; sx++) {
      const d = Math.hypot(x0 + ((sx + 0.5) / 6) * px - mid, y0 + ((sy + 0.5) / 6) * px - mid);
      if (d <= outer && d >= inner) hit++;
    }
    if (hit / 36 < 0.2) continue;
    tiles.push({ x: x0, y: y0, a: Math.atan2(y0 + px / 2 - mid, x0 + px / 2 - mid), k: Math.min(1, (hit / 36) * 1.15) });
  }
  const base = (rot: number, alpha: number) => {
    for (const d of tiles) {
      const [r, g, b] = tone === "white" ? [255, 255, 255] : ramp(stops, (d.a - rot) / (Math.PI * 2));
      ctx.fillStyle = `rgba(${r | 0},${g | 0},${b | 0},${(alpha * d.k).toFixed(3)})`;
      ctx.fillRect(d.x, d.y, sq, sq);
    }
  };
  const paint = (from: number, to: number, rot: number, alpha: number, cap: CanvasLineCap) => {
    if (to < from) return;
    let st: string | CanvasGradient;
    if (tone === "white") st = `rgba(255,255,255,${alpha})`;
    else {
      const g = ctx.createConicGradient(rot, mid, mid);
      [...stops, stops[0]].forEach(([r, gg, b], i, a) => g.addColorStop(i / (a.length - 1), `rgb(${r},${gg},${b})`));
      st = g;
    }
    ctx.save();
    ctx.globalAlpha = tone === "white" ? 1 : alpha;
    ctx.strokeStyle = st; ctx.lineWidth = lw; ctx.lineCap = cap;
    ctx.beginPath(); ctx.arc(mid, mid, r, top + from, top + to); ctx.stroke();
    ctx.restore();
  };
  // Each mark starts at its own point of the loop, so a screen full of them doesn't pulse in step
  let raf = 0, frames = 0, phase = Math.random(), spin = Math.random() * 6, last = performance.now();
  const frame = (now: number) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const fast = thinking.current;
    const T = fast ? 1.4 : 6;
    phase = (phase + dt / T) % 1;
    spin += dt * (fast ? 2.6 : 0.9);
    if (++frames % 90 === 0) stops = read();
    const k = (a: number, b: number) => ease(Math.min(1, Math.max(0, (phase - a) / (b - a))));
    const [A, B, C, D] = fast ? [0, 0.3, 0.55, 0.95] : [0, 0.14, 0.62, 0.74];  // draw, hold, shrink, travel
    const E = fast ? 1 : 0.9;
    const draw = k(A, B), shrink = k(C, D), run = k(D, E);
    const head = (draw + run) * Math.PI, tail = (shrink + run) * Math.PI;
    ctx.clearRect(0, 0, size, size);
    base(spin, tone === "white" ? 0.35 : 0.3);                                     // the whole donut in pixels, faint, always there
    paint(tail, Math.max(tail + 0.02, head), spin, 1, "round");                   // the D's bowl (a dot while it runs)
    if (!reduce) raf = requestAnimationFrame(frame);
  };
  if (reduce) { phase = 0.3; }
  raf = requestAnimationFrame(frame);
  return () => cancelAnimationFrame(raf);
}

/** The sphere: a turning ball of nodes whose right side gathers into a thick crescent (the bowl of a D)
 *  while the left stays an open sphere. It turns to the right: nodes travel left to right and slide into
 *  the crescent as they pass the middle. While the copilot thinks or talks, soft random pulses swell the nodes out in
 *  different places, like syllables, and they fall back as pixels. Big: the pointer kicks nodes away,
 *  harder the faster it moves, and they spring back on their own. */
function sphere(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, size: number, tone: "color" | "white", read: () => RGB[], thinking: { current: boolean }, reduce: boolean,
  shape: { current: { ring: boolean; explode: boolean } }, ext = size) {
  const big = size >= 80;
  const ss = (a: number, b: number, x: number) => { const k = Math.min(1, Math.max(0, (x - a) / (b - a))); return k * k * (3 - 2 * k); };
  const rnd = (n: number) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
  const n = big ? 2200 : 120;
  const P = Array.from({ length: n }, (_, i) => {
    const y = 1 - ((i + 0.5) / n) * 2, rr = Math.sqrt(1 - y * y), th = i * 2.39996;
    return { i, p: [Math.cos(th) * rr, y, Math.sin(th) * rr], s: rnd(i + 1), j: [rnd(i + 2) - 0.5, rnd(i + 3) - 0.5], vx: 0, vy: 0, ox: 0, oy: 0 };
  });
  let stops = read();
  let mouse: { x: number; y: number } | null = null, speed = 0;
  const move = (ev: PointerEvent) => {
    const r = canvas.getBoundingClientRect(), m = { x: ev.clientX - r.left, y: ev.clientY - r.top };
    if (mouse) speed = Math.min(40, Math.hypot(m.x - mouse.x, m.y - mouse.y));
    mouse = m;
  };
  const leave = () => { mouse = null; };
  // the canvas is wider than the ball (room for the burst) and lets clicks through, so the pointer is read on the window
  if (big) { window.addEventListener("pointermove", move); document.addEventListener("pointerleave", leave); }
  const white = tone === "white";
  const boost = (a: number) => (big ? Math.min(1, a * (white ? 1 : 1.45)) : Math.min(1, a * 1.5 * (white ? 1 : 1.45)));
  const col = (f: number, a: number) => {
    if (white) return `rgba(255,255,255,${boost(a).toFixed(3)})`;
    const [r, g, b] = ramp(stops, f);
    return `rgba(${r | 0},${g | 0},${b | 0},${boost(a).toFixed(3)})`;
  };
  let pulses: { at: number; amp: number; ang: number; dur: number }[] = [];
  // Icon sizes stand still, like a logo: one frame of the ball with the D full, no turning and no pulses.
  const still = !big;
  // ring: 0 = the ball, 1 = the nodes spread out into a flat ring (the score's ring takes over from there).
  // gone: 0…1 as it explodes into the dashboard.
  let ring = shape.current.ring ? 1 : 0, gone = 0;
  let raf = 0, frames = 0, t = still ? 1.2 : Math.random() * 10, e = 0, last = performance.now(), nextPulse = 0;
  const frame = (now: number) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (!still) {
      e += ((thinking.current ? 1 : 0) - e) * Math.min(1, dt * 3);
      t += dt * (1 + e * 1.6);
      ring = Math.min(1, Math.max(0, ring + (shape.current.ring ? dt : -dt) / 1.1));
      gone = shape.current.explode ? Math.min(1, gone + dt / 1.3) : 0;
    }
    const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2);
    const rk = ease(ring), boom = gone * gone;
    if (++frames % 90 === 0) stops = read();
    const sec = now / 1000;
    // while it thinks or talks, a run of soft pulses at random places
    if (!still && thinking.current && sec >= nextPulse) {
      pulses.push({ at: sec, amp: 0.1 + Math.random() * 0.22, ang: Math.random() * Math.PI * 2, dur: 0.35 + Math.random() * 0.35 });
      nextPulse = sec + 0.16 + Math.random() * 0.32;
    }
    pulses = pulses.filter((u) => sec - u.at < u.dur);
    const live = pulses.map((u) => { const k = (sec - u.at) / u.dur; return { ...u, v: k <= 0 ? 0 : Math.sin(Math.PI * k) ** 2 }; });
    speed *= 0.85;
    const c = ext / 2, sc = size * (big ? 0.29 : 0.36), ry = t * (0.35 + e * 0.5), rx = 0.35;
    const m = still ? 1 : 0.85 + 0.15 * Math.sin(t * 0.7);
    const cy = Math.cos(ry), sy = Math.sin(ry), cx = Math.cos(rx), sx = Math.sin(rx);
    ctx.clearRect(0, 0, ext, ext);
    ctx.globalCompositeOperation = white ? "lighter" : "source-over";
    for (const q of P) {
      let [x, y, z] = q.p;
      [x, z] = [x * cy + z * sy, -x * sy + z * cy];
      [y, z] = [y * cx - z * sx, y * sx + z * cx];
      // right side: as the ball turns, nodes travel left to right and, past the middle, slide sideways into a
      // thick band near the rim, so the crescent fills from the left instead of growing out of the centre
      const w = m * ss(-0.1, 0.45, x);
      const len = Math.hypot(x, y) || 1, band = 0.66 + 0.36 * Math.pow(len, 0.6) + (q.s - 0.5) * 0.05;
      const tx = Math.abs(y) < band ? Math.sqrt(band * band - y * y) : x;
      let nx = x + (tx - x) * w, ny = y;
      // each live pulse pushes the nodes near its direction outward, softly, then lets go
      const ang = Math.atan2(ny, nx);
      let burst = 0;
      for (const u of live) { const d = Math.atan2(Math.sin(ang - u.ang), Math.cos(ang - u.ang)); burst += u.amp * u.v * Math.exp(-(d * d) / 1.1); }
      const fly = burst * (0.5 + q.s);
      nx += (nx / len + q.j[0] * 0.5) * fly; ny += (ny / len + q.j[1] * 0.5) * fly;
      if (rk > 0) {
        // into the ring: each node opens out to its own place round the score's circle, overshooting a little
        // on the way, like the ball unfolding
        const ra = (q.i * 2.39996) % (Math.PI * 2), rr = (1 + (q.s - 0.5) * 0.07) * (1 + 0.22 * Math.sin(Math.PI * rk));
        nx += (Math.cos(ra) * rr - nx) * rk; ny += (Math.sin(ra) * rr - ny) * rk;
      }
      if (boom > 0) {   // explode: everything flies outward, each at its own speed
        const k = 1 + boom * (1.4 + q.s * 1.6);
        nx = nx * k + q.j[0] * boom * 0.6; ny = ny * k + q.j[1] * boom * 0.6;
      }
      const dep = z * 0.5 + 0.5;
      if (big) {
        if (mouse) {   // a wide area, each node kicked a little differently, so the shape breaks unevenly
          const dx = c + (nx + q.ox) * sc - mouse.x, dy = c + (ny + q.oy) * sc - mouse.y, dist = Math.hypot(dx, dy), R = size * 0.34;
          if (dist < R) {
            const f = (1 - dist / R) ** 1.5 * (0.004 + speed * 0.0016) * (0.4 + q.s * 1.2);
            q.vx += (dx / (dist || 1) + q.j[0] * 0.9) * f; q.vy += (dy / (dist || 1) + q.j[1] * 0.9) * f;
          }
        }
        q.vx = (q.vx - q.ox * 0.035) * 0.93; q.vy = (q.vy - q.oy * 0.035) * 0.93;   // a soft spring home
        q.ox += q.vx; q.oy += q.vy;
        nx += q.ox; ny += q.oy;
      }
      const b = Math.min(1, burst * 2.5 + gone * 1.5);
      let alpha = Math.min(1, (0.14 + 0.86 * Math.max(dep, w)) * (0.4 + 0.6 * w) + b * 0.3) * (1 - b * q.s * 0.4);
      alpha = (alpha + (0.8 - alpha) * rk) * (1 - ss(0.88, 1, ring)) * (1 - ss(0.35, 1, gone));   // the drawn ring takes over at the end
      // small: crescent nodes a touch heavier than the ball's, so the D still reads at icon size
      const rad = (big ? 0.6 + dep * 0.8 + w * 1.1 : Math.max(0.9, size / 15) * (0.5 + 0.3 * dep + 0.35 * w)) * (1 + b * 0.6);
      ctx.fillStyle = col(Math.atan2(ny, nx) / (Math.PI * 2) - t / 7, alpha);
      if (b > 0.05) ctx.fillRect(c + nx * sc - rad / 2, c + ny * sc - rad / 2, rad, rad);   // pixels while it talks
      else { ctx.beginPath(); ctx.arc(c + nx * sc, c + ny * sc, rad / 2 + 0.1, 0, 7); ctx.fill(); }
    }
    if (!reduce && !still) raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);
  return () => { cancelAnimationFrame(raf); window.removeEventListener("pointermove", move); document.removeEventListener("pointerleave", leave); };
}

/** The icon: the copilot as a still halftone, symmetric top to bottom so it works as a logo. A
 *  pattern of round dots on concentric rings, biggest along the right rim where the sphere's crescent is,
 *  shrinking towards the left. */
function halftone(ctx: CanvasRenderingContext2D, size: number, dpr: number, tone: "color" | "white", read: () => RGB[]) {
  const ss = (a: number, b: number, x: number) => { const k = Math.min(1, Math.max(0, (x - a) / (b - a))); return k * k * (3 - 2 * k); };
  // Dots sit on concentric rings, not a square grid, so the outline stays round; each ring starts at the
  // right (angle 0), so it mirrors exactly top to bottom
  const RINGS = 4, c = size / 2, R = size / 2 - size * 0.05, gap = R / (RINGS - 0.35);
  const stops = read();
  ctx.clearRect(0, 0, size, size);
  const dots: [number, number][] = [[0, 0]];   // a single dot at the centre, no tight inner ring around it
  for (let k = 1; k <= RINGS; k++) {
    const rr = R - (RINGS - k) * gap;
    if (rr < gap * 0.8) continue;
    const n = Math.max(6, Math.round((2 * Math.PI * rr) / gap));
    for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; dots.push([Math.cos(a) * rr, Math.sin(a) * rr]); }
  }
  for (const [dx, dy] of dots) {
    const x = dx / R, r = Math.hypot(dx, dy) / R;
    // a halftone of the sphere's light: heaviest along the right rim (the crescent), lighter inside it,
    // shrinking towards the left to the faintest trace of the ball
    const ink = Math.max(0.1, ((x + 1) / 2) ** 2.2 * (0.5 + 0.5 * ss(0.45, 0.95, r)));
    const d = gap * 1.12 * Math.sqrt(ink);   // dot area follows the ink, as in print
    if (d * dpr < 1) continue;
    // colour runs left to right (violet → pink → coral), the same above and below the middle
    const [cr, cg, cb] = tone === "white" ? [255, 255, 255] : ramp(stops, Math.min(0.5, 0.3 - 0.25 * x));
    ctx.fillStyle = `rgb(${cr | 0},${cg | 0},${cb | 0})`;
    ctx.beginPath(); ctx.arc(c + dx, c + dy, d / 2, 0, Math.PI * 2); ctx.fill();
  }
}

export function CopilotMark({ size = 20, tone = "color", thinking = false, className, kind, ring = false, explode = false }: {
  size?: number; tone?: "color" | "white"; thinking?: boolean; className?: string; kind?: "halftone" | "sphere" | "donut" | "pixel";
  /** sphere only: open out into the score's ring, or explode into the page */ ring?: boolean; explode?: boolean;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const thinkingRef = useRef(thinking);
  thinkingRef.current = thinking;
  // the big sphere draws on a canvas twice its size, so its burst into the dashboard isn't cut off
  const ext = (kind ?? (size < 64 ? "halftone" : "pixel")) === "sphere" && size >= 80 ? size * 2 : size;
  const shapeRef = useRef({ ring, explode });
  shapeRef.current = { ring, explode };

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const dpr = Math.max(2, Math.min(3, window.devicePixelRatio || 1));
    canvas.width = ext * dpr;
    canvas.height = ext * dpr;
    ctx.scale(dpr, dpr);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const read = () => (tone === "white" ? [[255, 255, 255]] as RGB[] : ["--g1", "--g2", "--g3", "--g4"].map((n) => readColor(canvas, n)));
    let stops = read();

    const k = kind ?? (size < 64 ? "halftone" : "pixel");
    if (k === "halftone") { halftone(ctx, size, dpr, tone, read); return; }
    if (k === "sphere") return sphere(canvas, ctx, size, tone, read, thinkingRef, reduce, shapeRef, ext);
    if (k === "donut") return donut(ctx, size, dpr, tone, read, thinkingRef, reduce);

    // Icons share one 13 × 13 grid (only the tile size changes); the big mark uses fine 4px tiles.
    // Tiles are kept where they fall inside the ring. Worked in whole device pixels so every tile stays crisp.
    const big = size >= 64;
    const CELLS = big ? Math.floor(size / 4) : 13; // big: fine 4px tiles; icons: the 13-tile grid
    const px = Math.floor((size * dpr) / CELLS) / dpr;   // tile pitch in CSS px
    const sq = px - Math.max(1, Math.round(px * 0.18 * dpr)) / dpr; // gap: ~18% of the tile, at least one device pixel
    const c = size / 2, off = Math.round(((size - CELLS * px) / 2) * dpr) / dpr;
    const R = (CELLS * px) / 2, inner = R * 0.42;
    // Edge tiles fade by how much of them falls inside the ring, so the hole and the outline read
    // round even on a coarse grid
    const pts: { x: number; y: number; f: number; k: number; p: number }[] = [];
    for (let gy = 0; gy < CELLS; gy++) for (let gx = 0; gx < CELLS; gx++) {
      const x0 = off + gx * px, y0 = off + gy * px;
      let hit = 0;
      for (let sy = 0; sy < 6; sy++) for (let sx = 0; sx < 6; sx++) {
        const r = Math.hypot(x0 + ((sx + 0.5) / 6) * px - c, y0 + ((sy + 0.5) / 6) * px - c);
        if (r <= R && r >= inner) hit++;
      }
      const k = hit / 36;
      if (k < 0.2 || x0 < c - px / 2 - 0.01) continue; // left half dissolves into light: the O reads as a D
      const cx = x0 + px / 2, cy = y0 + px / 2;
      pts.push({ x: x0, y: y0, f: (Math.atan2(cx - c, c - cy) / (Math.PI * 2) + 1) % 1, k: Math.min(1, k * 1.15), p: Math.random() * Math.PI * 2 });
    }

    // Thinking: the light turns faster and the tiles flicker, eased in and out
    let raf = 0, frames = 0, t = 0, energy = thinkingRef.current ? 1 : 0, last = performance.now();
    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      energy += ((thinkingRef.current ? 1 : 0) - energy) * Math.min(1, dt * 3);
      t += dt * (1 + energy * 1.6);
      if (++frames % 90 === 0) stops = read(); // follows a theme switch
      ctx.clearRect(0, 0, size, size);
      const turn = t / 5;      // the gradient goes round once every 5 s
      const sweep = t / 2.4;   // a brighter band chases it, a little faster

      // Left half: the same ring as a dim, soft light, cut straight at the stem and fading out, so the
      // light sits on the D
      const stem = c - px / 2;
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, stem, size);
      ctx.clip();
      ctx.filter = `blur(${(size * 0.06).toFixed(2)}px)`;
      ctx.lineWidth = R - inner;
      for (let k = 0; k < 36; k++) {
        const f0 = k / 36;
        const [r, g, b] = ramp(stops, f0 + 1 / 72 - turn);
        ctx.strokeStyle = `rgba(${r | 0},${g | 0},${b | 0},${tone === "white" ? 0.3 : 0.38})`;
        ctx.beginPath();
        ctx.arc(c, c, (R + inner) / 2, f0 * Math.PI * 2 - Math.PI / 2, (f0 + 1.3 / 36) * Math.PI * 2 - Math.PI / 2);
        ctx.stroke();
      }
      ctx.filter = "none";
      ctx.globalCompositeOperation = "destination-in";
      const fade = ctx.createLinearGradient(stem, 0, 0, 0);
      fade.addColorStop(0, "rgba(0,0,0,1)");
      fade.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = fade;
      ctx.fillRect(0, 0, stem, size);
      ctx.restore();
      for (const d of pts) {
        const [r, g, b] = ramp(stops, d.f - turn);
        const band = Math.cos((d.f - sweep) * Math.PI * 2) * 0.5 + 0.5;
        // big: tiles shimmer a little at rest, more while thinking
        const flicker = 1 - ((big ? 0.3 : 0) + energy * 0.45) * (0.5 + 0.5 * Math.sin(t * (big ? 3 : 7) + d.p * 3)) ** 3;
        const alpha = (tone === "white" ? 0.6 + 0.4 * band ** 2 : 0.85 + 0.15 * band ** 2) * flicker;
        ctx.fillStyle = `rgba(${r | 0},${g | 0},${b | 0},${(alpha * d.k).toFixed(3)})`;
        ctx.fillRect(d.x, d.y, sq, sq);
      }
      if (!reduce) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [size, tone, kind, ext]);

  return <canvas ref={ref} className={`copilot-mark ${className ?? ""}`} style={{ width: ext, height: ext, pointerEvents: ext > size ? "none" : undefined }} aria-hidden="true" />;
}
