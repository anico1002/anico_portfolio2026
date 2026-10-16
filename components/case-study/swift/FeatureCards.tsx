"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import HorizontalPin from "@/components/case-study/HorizontalPin";
import Keys, { KeyCap } from "@/components/case-study/Keys";
import { useReduce } from "@/lib/maqueta/reduce";
import { DUR, EASE } from "@/lib/maqueta/motion";

/* «Everything you need. Nothing you don't.» (el titular de la landing de SwifT) y sus cuatro funciones como
   cards que pasan con el scroll. Rehechas el 2026-10-16 con el feedback de Alberto: cada card enseña la
   función de verdad, con la interfaz real de la app (textos y orden del menú de StatusBarController.swift):
   1. las apps pasan en bandas laterales, en patrón (antes las etiquetas «vibraban»);
   2. auto-flip con una traducción real en bucle y las teclas que se pulsan encima;
   3. el menú se despliega y descarga el modelo (2,49 GB), y después se desinstala;
   4. la esquina de un MacBook con su barra de menús: clic en el rayo y se abre el menú. */

const V = "#7c3aed";
const SF = { fontFamily: '-apple-system, "SF Pro Text", "Inter", system-ui, sans-serif' } as const;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Bucle que solo corre con la card en pantalla. `run` recibe `alive()` para cortar a mitad. */
function useLoop(run: (alive: () => boolean) => Promise<void>) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  const reduce = useReduce();
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((es) => setOn(es.some((e) => e.isIntersecting)), { rootMargin: "0px -5% 0px -5%" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!on || reduce) return;
    let alive = true;
    (async () => {
      while (alive) await run(() => alive);
    })();
    return () => {
      alive = false;
    };
    // `run` es estable en la práctica (se declara en el componente y solo usa setters).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [on, reduce]);
  return { ref, reduce };
}

/* ── 1 · Select & translate: las apps pasan en bandas, como un patrón ──────────────────────────── */

const ROWS = [
  ["Xcode", "Safari", "Slack", "Mail", "Notas", "Figma"],
  ["PDF", "Mensajes", "Pages", "Notion", "Chrome", "Word"],
  ["Terminal", "Keynote", "WhatsApp", "Linear", "Calendario", "Teams"],
];

function Apps() {
  return (
    <div className="-mx-7 flex flex-col gap-3 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)] md:-mx-9">
      {ROWS.map((row, r) => (
        <div
          key={r}
          className="flex w-max gap-3"
          style={{ animation: `marquee ${22 + r * 4}s linear infinite ${r % 2 ? "reverse" : "normal"}`, willChange: "transform" }}
        >
          {[...row, ...row].map((a, k) => (
            <span
              key={k}
              className="whitespace-nowrap rounded-full px-5 py-2.5 text-[1.15rem] font-medium tracking-tight md:text-[1.35rem]"
              style={a === "Slack" || a === "Notion" || a === "Keynote" ? { background: V, color: "#fff" } : { background: "var(--case-bg)" }}
            >
              {a}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

/* ── 2 · Auto-flip: se escribe, ⌥⌘T y la frase se da la vuelta sola ───────────────────────────── */

const FLIPS = [
  { from: "ES", to: "EN", src: "¿Nos vemos el lunes?", out: "See you on Monday?" },
  { from: "EN", to: "ES", src: "Thanks, that works for me.", out: "Gracias, me va bien." },
];

function Key({ k, lit }: { k: string; lit: boolean }) {
  // La misma tecla que en titulares y textos (components/case-study/Keys.tsx), a tamaño de demo.
  return (
    <span className="text-[22px] font-medium text-[var(--case-fg)]">
      <KeyCap k={k} lit={lit} />
    </span>
  );
}

function Flip() {
  const [i, setI] = useState(0);
  const [typed, setTyped] = useState(0);
  const [phase, setPhase] = useState<"type" | "select" | "keys" | "done">("type");
  const [keys, setKeys] = useState<string[]>([]);
  const [lit, setLit] = useState(-1);
  const f = FLIPS[i];

  const { ref, reduce } = useLoop(async (alive) => {
    for (let n = 0; n < FLIPS.length && alive(); n++) {
      const src = FLIPS[n].src;
      setI(n);
      setPhase("type");
      setTyped(0);
      setLit(-1);
      for (let c = 1; c <= src.length && alive(); c++) {
        setTyped(c);
        const ch = src[c - 1];
        setKeys([ch === " " ? "espacio" : ch.toUpperCase()]);
        setLit(0);
        await sleep(ch === " " ? 120 : 75);
      }
      if (!alive()) return;
      await sleep(350);
      setPhase("select");
      setKeys(["⌘", "A"]);
      setLit(0);
      await sleep(160);
      setLit(1);
      await sleep(550);
      setPhase("keys");
      setKeys(["⌥", "⌘", "T"]);
      for (let k = 0; k < 3 && alive(); k++) {
        setLit(k);
        await sleep(170);
      }
      await sleep(260);
      if (!alive()) return;
      setPhase("done");
      setLit(-1);
      await sleep(2200);
    }
  });

  const shown = reduce ? f.out : phase === "done" ? f.out : f.src.slice(0, typed);
  const selected = !reduce && (phase === "select" || phase === "keys");

  return (
    <div ref={ref} className="flex w-full flex-col gap-5" style={SF}>
      <div className="relative rounded-[0.9rem] bg-[var(--case-bg)] px-5 pb-5 pt-4">
        <div className="flex items-center justify-between text-[12px] text-[var(--case-muted)]">
          <span>To: Ana</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={`${i}-${phase === "done"}`}
              className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
              style={phase === "done" || reduce ? { background: V, color: "#fff" } : { background: "transparent" }}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: DUR.fast, ease: EASE.out }}
            >
              {phase === "done" || reduce ? `↺ ${f.from} → ${f.to}` : f.from}
            </motion.span>
          </AnimatePresence>
        </div>
        <p className="mt-3 min-h-[2.2em] text-[1.35rem] leading-snug tracking-tight md:text-[1.5rem]">
          <span
            className="rounded-[4px]"
            style={{ background: selected ? "rgba(124,58,237,0.22)" : "transparent", transition: "background 0.2s" }}
          >
            {shown}
          </span>
          {!reduce && phase === "type" && <span className="ml-[1px] inline-block h-[1.1em] w-[2px] translate-y-[0.18em] animate-pulse bg-[var(--case-fg)]" />}
        </p>
      </div>
      {/* Las teclas que se pulsan, encima de la escena */}
      <div className="flex h-11 items-center justify-center gap-2">
        {!reduce &&
          phase !== "done" &&
          keys.map((k, n) => (
            <Key key={`${k}-${n}`} k={k} lit={phase === "type" ? true : lit >= n} />
          ))}
      </div>
    </div>
  );
}

/* ── Piezas de macOS compartidas por las cards 3 y 4 ─────────────────────────────────────────────── */

function Rayo({ className = "h-[14px] w-[14px]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 229 229" className={className} aria-hidden>
      <path d="M2.13726 123.562L140.468 1.51353C145.34 -2.78524 152.39 2.82934 149.744 8.90058L96.5395 130.949C95.5683 133.177 93.4461 134.606 91.1089 134.606H5.9824C0.413093 134.606 -2.12328 127.321 2.13726 123.562Z" fill="currentColor" />
      <path d="M227.863 106.438L89.5321 228.486C84.6599 232.785 77.6098 227.171 80.2564 221.099L133.46 99.051C134.432 96.8231 136.554 95.394 138.891 95.394H224.018C229.587 95.394 232.123 102.679 227.863 106.438Z" fill="currentColor" />
    </svg>
  );
}

function Cursor({ x, y, down }: { x: number | string; y: number | string; down: boolean }) {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      className="pointer-events-none absolute z-20 h-5 w-5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]"
      animate={{ left: x, top: y, scale: down ? 0.86 : 1 }}
      transition={{ left: { duration: DUR.base, ease: EASE.inOut }, top: { duration: DUR.base, ease: EASE.inOut }, scale: { duration: 0.12 } }}
      aria-hidden
    >
      <path d="M5 2.5v17.2l4.3-4.1 2.7 6.2 2.6-1.1-2.7-6.1h6z" fill="#000" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" />
    </motion.svg>
  );
}

function MenuItem({ children, hot, dim, check }: { children: React.ReactNode; hot?: boolean; dim?: boolean; check?: boolean }) {
  return (
    <div
      className="mx-[5px] flex items-center gap-1.5 rounded-[5px] px-2 py-[3px] transition-colors duration-100"
      style={{ background: hot ? "#0a84ff" : "transparent", color: hot ? "#fff" : dim ? "rgba(0,0,0,0.3)" : "#1d1d1f" }}
    >
      <span className="w-3 text-[11px]">{check ? "✓" : ""}</span>
      {children}
    </div>
  );
}

const Sep = () => <div className="mx-[10px] my-[4px] h-px bg-black/10" />;

/* ── 3 · En tu Mac: el menú descarga el modelo y luego lo desinstala ─────────────────────────────── */

type ModelState = "none" | "downloading" | "installed";

function OnDevice() {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<ModelState>("none");
  const [pct, setPct] = useState(0);
  const [hot, setHot] = useState(false);
  const [cur, setCur] = useState<{ x: string; y: string; down: boolean }>({ x: "40%", y: "70%", down: false });
  const [toast, setToast] = useState<string | null>(null);

  const click = async (alive: () => boolean) => {
    setCur((c) => ({ ...c, down: true }));
    await sleep(130);
    if (alive()) setCur((c) => ({ ...c, down: false }));
  };

  const { ref, reduce } = useLoop(async (alive) => {
    // Clic en el rayo: se abre el menú
    setState("none");
    setPct(0);
    setOpen(false);
    setHot(false);
    setCur({ x: "78%", y: "62%", down: false });
    await sleep(700);
    setCur({ x: "83%", y: "4px", down: false });
    await sleep(900);
    await click(alive);
    setOpen(true);
    await sleep(500);
    // Baja hasta «Download TranslateGemma 4B (2,49 GB)…»
    setCur({ x: "52%", y: "92px", down: false });
    await sleep(850);
    setHot(true);
    await sleep(300);
    await click(alive);
    setHot(false);
    setState("downloading");
    for (let p = 0; p <= 100 && alive(); p += 2) {
      setPct(p);
      await sleep(p < 20 || p > 85 ? 55 : 30);
    }
    if (!alive()) return;
    setState("installed");
    setOpen(false);
    setToast("TranslateGemma 4B is ready");
    setCur({ x: "40%", y: "70%", down: false });
    await sleep(2200);
    setToast(null);
    await sleep(500);
    // Y para quitarlo, el mismo menú: «Uninstall … (2,49 GB)»
    setCur({ x: "83%", y: "4px", down: false });
    await sleep(900);
    await click(alive);
    setOpen(true);
    await sleep(450);
    setCur({ x: "52%", y: "92px", down: false });
    await sleep(850);
    setHot(true);
    await sleep(300);
    await click(alive);
    setHot(false);
    setOpen(false);
    setState("none");
    setToast("Model removed · 2,49 GB free again");
    setCur({ x: "40%", y: "70%", down: false });
    await sleep(2400);
    setToast(null);
    await sleep(600);
  });

  const s: ModelState = reduce ? "installed" : state;

  return (
    <div ref={ref} className="relative h-[15rem] w-full overflow-hidden rounded-[0.9rem] text-[12.5px]" style={{ ...SF, background: "linear-gradient(160deg,#c9c3f2 0%,#e9d7ee 55%,#f6e7da 100%)" }}>
      {/* Barra de menús */}
      <div className="flex h-6 items-center justify-end gap-3.5 bg-white/55 px-3 text-[12px] text-[#1d1d1f] backdrop-blur-md">
        <span className="flex h-[18px] w-[22px] items-center justify-center rounded-[4px]" style={{ background: open ? "rgba(0,0,0,0.12)" : "transparent" }}>
          <motion.span animate={state === "downloading" && !reduce ? { opacity: [1, 0.35, 1] } : { opacity: 1 }} transition={{ duration: 1.2, repeat: state === "downloading" ? Infinity : 0 }}>
            <Rayo />
          </motion.span>
        </span>
        <span className="font-medium">9:41</span>
      </div>

      {/* Menú de SwifT */}
      <AnimatePresence>
        {(open || reduce) && (
          <motion.div
            className="absolute right-[12px] top-[26px] z-10 w-[min(19.5rem,calc(100%-1.5rem))] overflow-hidden whitespace-nowrap rounded-[9px] bg-white/85 py-[5px] shadow-[0_12px_40px_-8px_rgba(0,0,0,0.35)] ring-1 ring-black/10 backdrop-blur-xl"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.18 } }}
            transition={{ duration: 0.16 }}
          >
            <MenuItem check>
              Enabled <span className="text-black/40">⌥⌘T</span>
            </MenuItem>
            <MenuItem check>Auto-flip&nbsp;&nbsp;↺</MenuItem>
            <Sep />
            {s === "downloading" ? (
              <div className="mx-[5px] px-2 py-1 pl-[26px]">
                <p>Downloading TranslateGemma 4B — {pct}%</p>
                <div className="mt-1.5 h-[6px] w-full overflow-hidden rounded-full bg-black/10">
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "#0a84ff" }} />
                </div>
              </div>
            ) : (
              <MenuItem hot={hot}>
                {s === "installed" ? "Uninstall TranslateGemma 4B (2,49 GB)" : "Download TranslateGemma 4B (2,49 GB)…"}
              </MenuItem>
            )}
            {s === "downloading" && <MenuItem>Cancel download</MenuItem>}
            <Sep />
            <MenuItem>Quit SwifT</MenuItem>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Aviso del sistema al terminar */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast}
            className="absolute right-2 top-8 z-10 flex w-[15.5rem] items-center gap-2.5 rounded-[14px] bg-white/80 p-2.5 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.35)] ring-1 ring-black/5 backdrop-blur-xl"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40, transition: { duration: DUR.fast } }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] text-white" style={{ background: V }}>
              <Rayo className="h-4 w-4" />
            </span>
            <span className="text-[12px] font-semibold leading-tight text-[#1d1d1f]">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {!reduce && <Cursor x={cur.x} y={cur.y} down={cur.down} />}
    </div>
  );
}

/* ── 4 · Fuera de tu camino: la esquina de un MacBook, clic en el rayo y se abre el menú ─────────── */

function MacCorner() {
  const [open, setOpen] = useState(false);
  const [cur, setCur] = useState<{ x: string; y: string; down: boolean }>({ x: "30%", y: "80%", down: false });
  const { ref, reduce } = useLoop(async (alive) => {
    setOpen(false);
    setCur({ x: "30%", y: "80%", down: false });
    await sleep(900);
    setCur({ x: "61%", y: "36px", down: false });
    await sleep(1000);
    if (!alive()) return;
    setCur((c) => ({ ...c, down: true }));
    await sleep(130);
    setCur((c) => ({ ...c, down: false }));
    setOpen(true);
    await sleep(2600);
    setOpen(false);
    await sleep(400);
  });
  const show = open || reduce;

  return (
    <div ref={ref} className="relative h-[15rem] w-full overflow-hidden" style={SF}>
      {/* El perfil del MacBook: tapa de aluminio, bisel negro con esquina redonda y el notch */}
      <div className="absolute -right-[6px] left-6 top-3 h-[18rem] rounded-tl-[26px] bg-gradient-to-b from-[#d9dade] to-[#b9bbc1] p-[5px] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.5)]">
        <div className="h-full rounded-tl-[22px] bg-[#0b0b0c] p-[9px] pr-0">
          <div className="relative h-full overflow-hidden rounded-tl-[14px]" style={{ background: "linear-gradient(170deg,#3b2a7a 0%,#7c3aed 45%,#e8a6c8 100%)" }}>
            {/* Notch */}
            <div className="absolute left-[18%] top-0 z-10 h-[22px] w-[5.5rem] rounded-b-[9px] bg-[#0b0b0c]" />
            {/* Barra de menús */}
            <div className="flex h-[22px] items-center justify-end gap-3 bg-black/25 pl-3 pr-4 text-[11.5px] font-medium text-white backdrop-blur-md">
              <span className="flex h-[17px] w-[21px] items-center justify-center rounded-[4px]" style={{ background: show ? "rgba(255,255,255,0.25)" : "transparent" }}>
                <Rayo className="h-[13px] w-[13px]" />
              </span>
              <svg viewBox="0 0 20 14" className="h-[11px] w-[15px]" aria-hidden>
                <path d="M10 13.2 6.6 9.6a4.8 4.8 0 0 1 6.8 0zM3.8 6.9a8.8 8.8 0 0 1 12.4 0l-1.4 1.4a6.8 6.8 0 0 0-9.6 0zM1 4.1a12.8 12.8 0 0 1 18 0l-1.4 1.4a10.8 10.8 0 0 0-15.2 0z" fill="currentColor" />
              </svg>
              <span className="flex items-center">
                <span className="h-[10px] w-[20px] rounded-[3px] border border-white/80 p-[1px]">
                  <span className="block h-full w-[70%] rounded-[1.5px] bg-white" />
                </span>
              </span>
              <span>Vie 9:41</span>
            </div>
            <AnimatePresence>
              {show && (
                <motion.div
                  className="absolute right-1 top-[25px] w-[12.5rem] rounded-[9px] bg-white/85 py-[5px] text-[12px] shadow-[0_12px_40px_-8px_rgba(0,0,0,0.45)] ring-1 ring-black/10 backdrop-blur-xl"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, transition: { duration: 0.18 } }}
                  transition={{ duration: 0.16 }}
                >
                  <MenuItem check>
                    Enabled <span className="text-black/40">⌥⌘T</span>
                  </MenuItem>
                  <Sep />
                  <MenuItem>Target Language&nbsp;&nbsp;›</MenuItem>
                  <MenuItem check>Auto-flip&nbsp;&nbsp;↺</MenuItem>
                  <MenuItem>Auto-replace&nbsp;&nbsp;↩</MenuItem>
                  <Sep />
                  <MenuItem>Quit SwifT</MenuItem>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      {!reduce && <Cursor x={cur.x} y={cur.y} down={cur.down} />}
    </div>
  );
}

const CARDS = [
  { name: "Select & translate", body: <>Select text in any app (Xcode, Safari, Slack, a PDF), press <Keys keys={["⌥", "⌘", "T"]} className="text-[0.85em]" /> and you’re done. System-wide.</>, art: <Apps /> },
  { name: "Auto-flip", body: "Writing in Spanish but need it in English? It detects the direction and flips it on its own when needed.", art: <Flip /> },
  { name: "On your Mac", body: "Translates with its own AI, on your Mac and offline. Install it from the menu and remove it from the same place.", art: <OnDevice /> },
  { name: "Stays out of your way", body: "It lives in the menu bar. No Dock icon, no welcome screens, no subscription. Instant translation that lives on your Mac.", art: <MacCorner /> },
];

export default function FeatureCards() {
  return (
    <HorizontalPin
      head={
        <div className="grid grid-cols-12 gap-x-4 md:gap-x-6">
          <div className="col-span-12 md:col-span-7">
            <p className="t-label t-tag text-[var(--case-muted)]">Cuatro funciones</p>
            <p className="mt-4 t-h2">Everything you need. Nothing you don&rsquo;t.</p>
          </div>
          <p className="col-span-12 mt-6 t-body text-[var(--case-muted)] md:col-span-3 md:col-start-10 md:mt-24">
            The landing page headline sums up the product: every decision was a subtraction.
          </p>
        </div>
      }
    >
      {CARDS.map((c, k) => (
        <article
          key={c.name}
          className="flex min-h-[30rem] w-full shrink-0 flex-col justify-between overflow-hidden rounded-[18px] bg-[var(--case-ph)] p-7 md:h-[34rem] md:w-[28rem] md:p-9"
        >
          <div className="flex min-h-[15rem] items-center">{c.art}</div>
          <div>
            <p className="t-label t-tag text-[var(--case-muted)]">0{k + 1}</p>
            <p className="mt-3 t-title">{c.name}</p>
            <p className="mt-3 t-body text-[var(--case-muted)]">{c.body}</p>
          </div>
        </article>
      ))}
    </HorizontalPin>
  );
}
