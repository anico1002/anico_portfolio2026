"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { EASE } from "@/lib/maqueta/motion";
import { CopilotMark } from "./CopilotMark";

/* «Ask the Copilot», recreado en código y en bucle (feedback 2026-11-01: junto a la bola, el campo de búsqueda y lo
   que pasa al pulsar una sugerencia, sin puntero). Sigue al prototipo: se pulsa una sugerencia, la pregunta se escribe
   en el campo y se envía, la bola piensa, y la respuesta llega palabra a palabra con su pequeño gráfico debajo.
   Preguntas y respuestas son las del prototipo, tal cual. `onThink` avisa a la bola para que pulse. */

const INK = "#2C2357";
const AI_GRADIENT = "linear-gradient(120deg, var(--g3), var(--g2) 45%, var(--g1) 75%, var(--g4))";

type Q = { q: string; a: string; w: "impact" | "teams" | "batch" };
const QS: Q[] = [
  {
    q: "What breaks if I change action-primary?",
    a: "Nothing breaks inside the system: 5 components read the token and update on their own. The risk is outside it. 2 places use a hand-picked blue and would stay behind.",
    w: "impact",
  },
  {
    q: "Which team skips the system the most?",
    a: "Payments, at 75. They have 9 open drifts and 7 of them came from AI tools. Their agent can't see Brand DS, so it invents colors.",
    w: "teams",
  },
  {
    q: "What can I fix in one go?",
    a: "The 6 color drifts in the payment flow. Same pull request, same kind of fix, and together they're worth 6 points.",
    w: "batch",
  },
];
const CHIPS = [QS[1].q, QS[0].q, QS[2].q];

type Phase = "idle" | "press" | "type" | "send" | "think" | "answer";

/** Respuesta palabra a palabra. */
function Stream({ text, run }: { text: string; run: boolean }) {
  const words = text.split(" ");
  const [n, setN] = useState(run ? 0 : words.length);
  useEffect(() => {
    if (!run) return;
    setN(0);
    const id = setInterval(() => setN((k) => (k >= words.length ? k : k + 1)), 55);
    return () => clearInterval(id);
  }, [text, run, words.length]);
  return (
    <p className="text-[15px] leading-[22px]" style={{ color: INK }}>
      {words.slice(0, n).join(" ")}
    </p>
  );
}

function Widget({ w }: { w: Q["w"] }) {
  const pill = "inline-flex items-center rounded-full border border-[#E3E7EE] bg-white px-3 py-1 text-[12px]";
  const up = (k: number) => ({ initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, ease: EASE.out, delay: 0.15 + k * 0.08 } });
  if (w === "impact")
    return (
      <div className="flex flex-wrap items-center gap-2">
        <motion.span {...up(0)} className={`${pill} font-mono`} style={{ color: INK }}>action-primary</motion.span>
        <motion.span {...up(1)} className="text-[12px] text-[#2C2357]/50">→</motion.span>
        <motion.span {...up(2)} className={pill} style={{ color: INK }}>5 components</motion.span>
        <motion.span {...up(3)} className={pill} style={{ color: INK }}>16 screens</motion.span>
        <motion.span {...up(4)} className={`${pill} border-[#F0459B]/40`} style={{ color: "#C2286F" }}>2 hand-picked blues</motion.span>
      </div>
    );
  if (w === "teams")
    return (
      <div className="grid grid-cols-[96px_1fr_28px] items-center gap-x-3 gap-y-1.5 text-[12px]" style={{ color: INK }}>
        {[["Payments", 75], ["Marketing web", 78], ["Approvals", 86], ["Travel", 91]].map(([t, v], k) => (
          <div key={t as string} className="contents">
            <span className={k === 0 ? "font-medium" : "text-[#2C2357]/60"}>{t}</span>
            <span className="h-1.5 overflow-hidden rounded-full bg-[#2C2357]/[.07]">
              <motion.span
                className="block h-full rounded-full"
                style={{ background: k === 0 ? AI_GRADIENT : "#2C2357", opacity: k === 0 ? 1 : 0.35 }}
                initial={{ width: 0 }}
                animate={{ width: `${v}%` }}
                transition={{ duration: 0.9, ease: EASE.out, delay: 0.15 + k * 0.1 }}
              />
            </span>
            <span className="text-right tabular-nums">{v}</span>
          </div>
        ))}
      </div>
    );
  return (
    <motion.span
      {...up(0)}
      className="inline-flex h-10 items-center gap-2 self-start rounded-full px-5 text-[13px] font-medium text-white"
      style={{ background: AI_GRADIENT }}
    >
      <CopilotMark size={18} kind="halftone" tone="white" />
      Review the 6 drifts · +6
    </motion.span>
  );
}

/** Corre en bucle mientras `run`. */
export default function AskDemo({ run, onThink }: { run: boolean; onThink: (on: boolean) => void }) {
  const still = useReducedMotion();
  const [qi, setQi] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [typed, setTyped] = useState("");
  const think = useRef(onThink);
  think.current = onThink;
  const q = QS[qi];

  useEffect(() => {
    if (!run) return;
    if (still) {
      setTyped(QS[0].q);
      setPhase("answer");
      return;
    }
    const timers: number[] = [];
    let alive = true;
    const at = (ms: number, f: () => void) => timers.push(window.setTimeout(() => alive && f(), ms));
    const cycle = (i: number) => {
      const Q = QS[i];
      setQi(i);
      setTyped("");
      setPhase("idle");
      at(1600, () => setPhase("press"));
      at(1900, () => {
        setPhase("type");
        let k = 0;
        const id = window.setInterval(() => {
          if (!alive) return clearInterval(id);
          k += 1;
          setTyped(Q.q.slice(0, k));
          if (k >= Q.q.length) clearInterval(id);
        }, 26);
      });
      const tEnd = 1900 + Q.q.length * 26 + 250;
      at(tEnd, () => setPhase("send"));
      at(tEnd + 350, () => {
        setPhase("think");
        think.current(true);
      });
      at(tEnd + 1900, () => {
        setPhase("answer");
        think.current(false);
      });
      at(tEnd + 1900 + Q.a.split(" ").length * 55 + 3600, () => cycle((i + 1) % QS.length));
    };
    // espera a que la bola termine de formarse
    at(2400, () => cycle(0));
    return () => {
      alive = false;
      timers.forEach(clearTimeout);
      think.current(false);
    };
  }, [run, still]);

  const asked = phase === "send" || phase === "think" || phase === "answer";
  return (
    <div className="flex w-full max-w-[600px] flex-col gap-3 text-left" aria-hidden>
      {/* Encima del campo: las sugerencias o, ya preguntado, la conversación */}
      <div className="relative min-h-[250px] md:min-h-[210px]">
        <AnimatePresence mode="wait" initial={false}>
          {!asked ? (
            <motion.div
              key="chips"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.4, ease: EASE.out }}
              className="absolute inset-x-0 bottom-0 flex flex-col gap-2"
            >
              <span className="text-[12px] text-[#2C2357]/50">Try asking</span>
              <div className="flex flex-wrap gap-2">
                {CHIPS.map((c) => {
                  const hit = c === q.q && (phase === "press" || phase === "type");
                  return (
                    <motion.span
                      key={c}
                      animate={{ scale: hit && phase === "press" ? 0.96 : 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 26 }}
                      className={`inline-flex items-center rounded-full border px-3.5 py-2 text-[13px] transition-colors duration-200 ${hit ? "border-[#2C2357]/25 bg-[#F1EEFB]" : "border-[#E3E7EE] bg-white"}`}
                      style={{ color: INK }}
                    >
                      {c}
                    </motion.span>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={`a-${qi}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.45, ease: EASE.out }}
              className="absolute inset-x-0 bottom-0 flex flex-col gap-3"
            >
              <span className="self-end rounded-2xl rounded-br-md bg-[#F1EEFB] px-3.5 py-2 text-[13px]" style={{ color: INK }}>
                {q.q}
              </span>
              <div className="flex items-start gap-2.5">
                <span className="mt-0.5 shrink-0">
                  <CopilotMark size={18} kind="halftone" />
                </span>
                <div className="flex min-w-0 flex-col gap-3">
                  {phase === "answer" ? (
                    <>
                      <Stream text={q.a} run={!still} />
                      <Widget w={q.w} />
                    </>
                  ) : (
                    <span className="flex h-[22px] items-center gap-1" aria-label="Thinking">
                      {[0, 1, 2].map((k) => (
                        <motion.i
                          key={k}
                          className="block h-1.5 w-1.5 rounded-full"
                          style={{ background: INK }}
                          animate={{ opacity: [0.2, 0.8, 0.2] }}
                          transition={{ duration: 1, repeat: Infinity, delay: k * 0.18 }}
                        />
                      ))}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* El campo, con el borde de la luz del Copilot */}
      <div className="rounded-[20px] p-[1.5px] shadow-[0_18px_40px_-22px_rgba(139,92,255,.55)]" style={{ background: AI_GRADIENT }}>
        <div className="flex flex-col gap-3 rounded-[18.5px] bg-white px-4 pb-3 pt-3.5">
          <span className="min-h-[22px] text-[15px] leading-[22px]" style={{ color: typed && !asked ? INK : "rgba(44,35,87,.45)" }}>
            {typed && !asked ? (
              <>
                {typed}
                <motion.i
                  className="ml-px inline-block h-[17px] w-[1.5px] translate-y-[3px]"
                  style={{ background: INK }}
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.9, repeat: Infinity }}
                />
              </>
            ) : (
              "Ask the Copilot, or paste a Figma link"
            )}
          </span>
          <div className="flex items-center gap-3 text-[#2C2357]/45">
            <span className="ml-auto rounded-md bg-[#2C2357]/[.06] px-1.5 py-0.5 text-[11px]">⌘K</span>
            <motion.span
              className="grid h-8 w-8 place-items-center rounded-full text-white"
              animate={{
                scale: phase === "send" ? 0.9 : 1,
                opacity: typed && !asked ? 1 : phase === "send" ? 1 : 0.45,
              }}
              transition={{ type: "spring", stiffness: 500, damping: 24 }}
              style={{ background: AI_GRADIENT }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 19V5M5 12l7-7 7 7" />
              </svg>
            </motion.span>
          </div>
        </div>
      </div>
    </div>
  );
}
