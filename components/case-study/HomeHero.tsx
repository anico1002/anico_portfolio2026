"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { endCurtain, useCurtain } from "@/components/case-study/Curtain";
import { MaskText } from "@/components/case-study/primitives";
import { DUR, EASE } from "@/lib/maqueta/motion";

/* Cabecera de la home de una sección (2026-10-12; antes era un titular estático y se sentía
   muy quieta). Continúa la entrada partida sin corte: pase de imágenes a pantalla completa
   con el titular de la sección en el centro y, después, la imagen se recoge con una máscara de
   abajo arriba hasta la mitad de la pantalla: abajo queda el texto de intro con aire y, al pie,
   la barra de logo y menú, que al hacer scroll se queda pegada arriba.

   Llegando desde la entrada, el telón del layout está encima con la misma imagen y velo: esta cabecera arranca idéntica y, cuando ha pintado esa imagen, le pide al telón
   que se funda (`endCurtain`). Entrando directo, la imagen aparece con la máscara de siempre
   y hace la misma retirada. */

const SLIDE_MS = 2600; // cada diapositiva del pase (fundido + zoom lento de salida)

/** Ventana pequeña dentro de la frase (opción «imagen» del énfasis, a prueba): pasa las imágenes de
    la sección en corte rápido, como un montaje. Solo se ve con `?em=imagen` (CSS `.inline-media`). */
function InlineMedia({ slides, open }: { slides: readonly string[]; open: boolean }) {
  const [k, setK] = useState(0);
  useEffect(() => {
    if (!open) return;
    const id = setInterval(() => setK((n) => (n + 1) % slides.length), 700);
    return () => clearInterval(id);
  }, [open, slides.length]);
  return (
    <span className={`inline-media ${open ? "is-open" : ""}`} aria-hidden>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={slides[k]} alt="" />
    </span>
  );
}

/** Palabras que cambian en el titular (2026-10-12; quita estaticidad a la intro): cada 2,4 s la
    palabra sale por arriba y entra la siguiente por abajo, letra a letra en ola, con el mismo gesto
    que el hover del menú. El hueco se ajusta suave al ancho de cada palabra. */
const ROT_STAGGER = 0.02; // s entre letras (el menú usa 15 ms; las palabras aquí son más largas)
const letter = {
  enter: { y: "110%" },
  show: (i: number) => ({ y: "0%", transition: { duration: DUR.base, ease: EASE.inOut, delay: i * ROT_STAGGER } }),
  leave: (i: number) => ({ y: "-110%", transition: { duration: DUR.base, ease: EASE.inOut, delay: i * ROT_STAGGER } }),
};

function Rotating({ words, run }: { words: string[]; run: boolean }) {
  const [k, setK] = useState(0);
  const [w, setW] = useState<number[]>([]);
  const measure = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const m = () => setW([...(measure.current?.children ?? [])].map((c) => c.getBoundingClientRect().width));
    m();
    document.fonts?.ready.then(m);
    window.addEventListener("resize", m);
    return () => window.removeEventListener("resize", m);
  }, [words]);
  // Ancho del hueco: mientras sale la palabra anterior, el mayor de los dos (para no cortarla);
  // cuando ya ha salido, el de la nueva.
  const [prev, setPrev] = useState<number | null>(null);
  useEffect(() => {
    if (!run) return;
    let t = 0;
    const id = setInterval(() => {
      setK((n) => {
        const next = (n + 1) % words.length;
        setPrev(n);
        clearTimeout(t);
        t = window.setTimeout(() => setPrev(null), (DUR.base + words[n].length * ROT_STAGGER) * 1000);
        return next;
      });
    }, 2400);
    return () => {
      clearInterval(id);
      clearTimeout(t);
    };
  }, [run, words]);
  const width = w[k] ? Math.max(w[k], prev != null ? w[prev] ?? 0 : 0) : undefined;
  return (
    <span className="rot" style={width ? { width } : undefined}>
      <span className="sr-only">{words[k]}</span>
      <span ref={measure} aria-hidden className="rot-measure">
        {words.map((x) => (
          <span key={x}>{x}</span>
        ))}
      </span>
      <AnimatePresence initial={false}>
        <motion.span key={words[k]} aria-hidden className="rot-word" initial="enter" animate="show" exit="leave">
          {[...words[k]].map((ch, i) => (
            <motion.span key={i} className="inline-block" custom={i} variants={letter}>
              {ch === " " ? "\u00a0" : ch}
            </motion.span>
          ))}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/** `*palabras*` del titular → palabras clave (`.kw`; cómo se destacan lo decide el CSS, `?em=`).
    `[m]` → ventana con imágenes dentro de la frase. `{a|b|c}` → palabras que cambian. */
const withEm = (t: string, slides: readonly string[], open: boolean) =>
  t.split(/(\*[^*]+\*|\[m\]|\{[^}]+\})/).map((part, i) =>
    part.startsWith("{") ? (
      <Rotating key={i} words={part.slice(1, -1).split("|")} run={open} />
    ) : part === "[m]" ? (
      <InlineMedia key={i} slides={slides} open={open} />
    ) : part.startsWith("*") ? (
      <em key={i} className="kw">
        {part.slice(1, -1)}
      </em>
    ) : (
      part
    )
  );

export default function HomeHero({
  title,
  slides,
  nav,
}: {
  title: string;
  slides: readonly string[];
  /** La barra (logo + menú), montada en modo `docked`: aparece al pie y se pega arriba. */
  nav: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  const curtain = useCurtain();
  // Se decide en el primer render: si hay telón, arrancar igual que él (su imagen).
  const [arrived] = useState(() => !!curtain);
  const [i, setI] = useState(() => Math.max(0, curtain ? slides.indexOf(curtain.src) : 0));
  const [retracted, setRetracted] = useState(false);
  const first = useRef<HTMLImageElement>(null);

  // Relevo con el telón: cuando la primera imagen está pintada, el telón se funde; la retirada
  // empieza cuando el fundido ya va por la mitad. Directo: la máscara de entrada y luego retirada.
  useEffect(() => {
    let t = 0;
    const go = () => {
      if (arrived) endCurtain();
      t = window.setTimeout(() => setRetracted(true), (arrived ? DUR.slow + DUR.fast : DUR.base + DUR.fast) * 1000);
    };
    const img = first.current;
    if (img && !(img.complete && img.naturalWidth)) img.decode().then(go, go);
    else go();
    return () => clearTimeout(t);
  }, [arrived]);

  // Pase de imágenes (siempre en marcha: también en la franja).
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setI((n) => (n + 1) % slides.length), SLIDE_MS);
    return () => clearInterval(id);
  }, [reduce, slides.length]);

  const full = "inset(0% 0% 0% 0%)";
  const clipped = "inset(0% 0% 50% 0%)"; // la imagen se queda en la mitad de arriba
  const hiddenBelow = "inset(100% 0% 0% 0%)";

  return (
    <>
      <section className="relative h-[100svh] w-full overflow-hidden">
        <motion.div
          className="absolute inset-0 overflow-hidden"
          initial={{ clipPath: arrived || reduce ? full : hiddenBelow }}
          animate={{ clipPath: retracted ? clipped : full }}
          transition={retracted ? { duration: DUR.slow, ease: EASE.inOut } : { duration: DUR.base, ease: EASE.inOut }}
        >
          <AnimatePresence initial={false}>
            <motion.img
              key={slides[i]}
              ref={first}
              src={slides[i]}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ opacity: { duration: DUR.base, ease: EASE.inOut }, scale: { duration: DUR.drift, ease: EASE.out } }}
            />
          </AnimatePresence>
          {/* Degradado del color de fondo arriba, bajo el logo: así nunca pasa por debajo un gris medio
              (donde la mezcla por diferencia dejaría el logo gris sobre gris). Como en los casos. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[18%]"
            style={{ background: "linear-gradient(to bottom, color-mix(in srgb, var(--case-bg) 55%, transparent), transparent)" }}
          />
          {/* Velo: el del telón (para que el relevo sea exacto) y se aclara al recogerse. */}
          <motion.div
            aria-hidden
            className="absolute inset-0 bg-black"
            initial={{ opacity: 0.45 }}
            animate={{ opacity: retracted ? 0.15 : 0.45 }}
            transition={{ duration: DUR.slow, ease: EASE.inOut }}
          />
          {/* Precarga del resto del pase. */}
          <div className="hidden">
            {slides.map((s) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={s} src={s} alt="" />
            ))}
          </div>
        </motion.div>

        {/* Mitad de abajo: el texto de intro con aire, que entra cuando la imagen ya se recoge. */}
        <div className="absolute inset-x-0 bottom-[3.5rem] top-1/2 px-4 pt-8 md:px-6 md:pt-12">
          <div className="grid grid-cols-12 gap-x-4 md:gap-x-6">
            <h1 className="col-span-12 md:col-span-8">
              {retracted ? (
                <MaskText delay={DUR.slow / 2}>
                  <span className="block t-hero">{withEm(title, slides, true)}</span>
                </MaskText>
              ) : (
                <span className="block t-hero opacity-0">{withEm(title, slides, false)}</span>
              )}
            </h1>
          </div>
        </div>
      </section>
      {/* La barra al pie de la cabecera (Yakushev): aparece cuando la imagen se recoge y, al hacer
          scroll, sube con la página y se queda pegada arriba. Va fuera de la sección para que el
          `sticky` dure toda la página. */}
      <motion.div
        className="pointer-events-none sticky top-0 z-50 -mt-[3.5rem] mix-blend-difference"
        initial={{ opacity: 0 }}
        animate={{ opacity: retracted ? 1 : 0 }}
        transition={{ duration: DUR.base, ease: EASE.out, delay: retracted ? DUR.slow / 2 : 0 }}
      >
        {nav}
      </motion.div>
    </>
  );
}
