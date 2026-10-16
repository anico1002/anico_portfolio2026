"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Lines from "@/components/case-study/Lines";
import { FadeIn, WindowReveal } from "@/components/case-study/primitives";
import { useReduce } from "@/lib/maqueta/reduce";
import { DUR, EASE } from "@/lib/maqueta/motion";
import { G, geist } from "./tokens";

/* Momentos Gloop (antes «Momentos firma»): los juegos, donde la marca se suelta.
   2026-10-14 (feedback de Alberto): la ruleta de la app a pantalla completa, para dar un golpe de color entre
   tanto negro. Una ventana se abre con el scroll hasta quedar a sangre (WindowReveal) y dentro gira la ruleta
   como en la app (decision-ruleta.mp4): cada juego a pantalla entera, su foto en grises teñida de su color y el
   nombre en el centro; corta rápido, frena y se para en uno con «Tonight’s game» (en inglés desde el 2026-10-17, como toda la web). Y vuelta a girar mientras se ve. */

const GAMES = [
  { name: "Guilty", img: "/maqueta/gloop/media/photo-fingersup.jpg", color: G.cyan },
  { name: "Podium", img: "/maqueta/gloop/media/photo-tierlist.jpg", color: G.lime },
  { name: "0 to 100", img: "/maqueta/gloop/media/photo-radiotrivia.jpg", color: G.magenta },
  { name: "Party Meter", img: "/maqueta/gloop/media/photo-xativometre.jpg", color: G.accent },
  { name: "Clones", img: "/maqueta/gloop/media/photo-clones.jpg", color: G.brand },
];
/* Pausas entre cortes: rápido al principio y cada vez más lento, como la ruleta de la app. */
const TICKS = [70, 70, 75, 80, 90, 100, 115, 135, 160, 195, 240, 300, 380, 480];
const HOLD_MS = 2600;

export default function GameRoulette() {
  const box = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(1);
  const [landed, setLanded] = useState(true);
  const [on, setOn] = useState(false);
  const reduce = useReduce();

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver((es) => setOn(es.some((e) => e.isIntersecting)), { rootMargin: "-25% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!on || reduce) return;
    let alive = true;
    const t: number[] = [];
    const wait = (ms: number) => new Promise((r) => t.push(window.setTimeout(r, ms)));
    (async () => {
      let k = 0;
      while (alive) {
        setLanded(false);
        for (const ms of TICKS) {
          if (!alive) return;
          k = (k + 1) % GAMES.length;
          setI(k);
          await wait(ms);
        }
        if (!alive) return;
        setLanded(true);
        await wait(HOLD_MS);
      }
    })();
    return () => {
      alive = false;
      t.forEach(clearTimeout);
    };
  }, [on, reduce]);

  const g = GAMES[i];
  return (
    <div className={geist.variable}>
      <div className="grid grid-cols-12 gap-x-4 px-4 md:gap-x-6 md:px-6">
        <div className="col-span-12 md:col-span-7">
          <p className="t-label t-tag text-[var(--case-muted)]">Gloop Moments</p>
          <Lines className="mt-4 t-statement">When it’s time to play, the brand lets loose.</Lines>
          <FadeIn className="mt-8 max-w-[44ch]">
            <p className="t-body text-[var(--case-muted)]">
              The wheel picks the game of the night, and each game arrives with its own color and character.
            </p>
          </FadeIn>
        </div>
      </div>
      <div ref={box} className="mt-16 md:mt-24">
        <WindowReveal>
          <div className="relative h-full w-full overflow-hidden" style={{ background: g.color }}>
            {/* La foto del juego en grises, teñida con su color (corte seco entre juegos, como en la app). */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {/* El color manda (como en la app): la foto en grises solo le da textura, en «superponer». */}
            <img src={g.img} alt="" className="absolute inset-0 h-full w-full object-cover" style={{ filter: "grayscale(1) contrast(1.2) brightness(1.15)", mixBlendMode: "overlay" }} />
            <span aria-hidden className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/35" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white" style={{ fontFamily: "var(--font-gloop)" }}>
              <AnimatePresence>
                {landed && (
                  <motion.p
                    key="won"
                    className="mb-4 text-[clamp(0.8rem,1.2vw,1.1rem)] font-semibold uppercase tracking-[0.2em]"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: DUR.base, ease: EASE.out }}
                  >
                    Tonight’s game
                  </motion.p>
                )}
              </AnimatePresence>
              <motion.p
                className="text-center font-extrabold uppercase leading-none tracking-[-0.02em]"
                initial={false}
                animate={{ fontSize: landed ? "clamp(4rem, 13vw, 13rem)" : "clamp(2.6rem, 8vw, 8rem)" }}
                transition={{ duration: DUR.base, ease: EASE.out }}
              >
                {g.name}
              </motion.p>
            </div>
          </div>
        </WindowReveal>
      </div>
    </div>
  );
}
