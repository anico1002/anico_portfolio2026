"use client";

import { animate, motion, useMotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Lines from "@/components/case-study/Lines";
import { FadeIn } from "@/components/case-study/primitives";
import { useReduce } from "@/lib/maqueta/reduce";
import { G, geist } from "./tokens";

/* Momentos firma (Gloop): los juegos, donde la marca se suelta. La ruleta de la app decide el juego de
   la noche; aquí, una tira de portadas que gira, frena y se para en un juego, una y otra vez mientras
   se ve. 2026-10-13: cada portada con su filtro de color. La forma de enseñarlo (otro lateral más tras
   el proceso) está en revisión: coverflow, cartas verticales o ruleta a pantalla completa. */

const GAMES = [
  { name: "Culpable", img: "/maqueta/gloop/media/photo-fingersup.jpg", color: G.accent },
  { name: "Podium", img: "/maqueta/gloop/media/photo-tierlist.jpg", color: G.lime },
  { name: "De 0 a 100", img: "/maqueta/gloop/media/photo-radiotrivia.jpg", color: G.cyan },
  { name: "Fiestómetro", img: "/maqueta/gloop/media/photo-xativometre.jpg", color: G.magenta },
  { name: "Clones", img: "/maqueta/gloop/media/photo-clones.jpg", color: G.brand },
];
const LOOPS = 6; // la tira se repite para poder girar varias vueltas

export default function GameRoulette() {
  const box = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const [pick, setPick] = useState(0);
  const [landed, setLanded] = useState(true);
  const [on, setOn] = useState(false);
  const reduce = useReduce();

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver((es) => setOn(es.some((e) => e.isIntersecting)), { rootMargin: "-20% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!on || reduce) return;
    let alive = true;
    let stop: (() => void) | undefined;
    let current = 0;
    const spin = async () => {
      while (alive) {
        const el = box.current;
        if (!el) return;
        const card = el.querySelector<HTMLElement>("[data-card]");
        const w = card ? card.offsetWidth + 16 : 300;
        const next = (current + 7 + Math.floor(Math.random() * GAMES.length)) % GAMES.length;
        // Varias vueltas y frenada sobre `next`, centrado en la ventana.
        const index = GAMES.length * (LOOPS - 2) + next;
        const target = -(index * w) + el.offsetWidth / 2 - w / 2 + 8;
        setLanded(false);
        x.set(-(current * w) + el.offsetWidth / 2 - w / 2 + 8);
        const a = animate(x, target, { duration: 2.6, ease: [0.12, 0.8, 0.2, 1] });
        stop = () => a.stop();
        await a;
        if (!alive) return;
        current = next;
        setPick(next);
        setLanded(true);
        await new Promise((r) => setTimeout(r, 2400));
      }
    };
    spin();
    return () => {
      alive = false;
      stop?.();
    };
  }, [on, reduce, x]);

  const strip = Array.from({ length: LOOPS }, () => GAMES).flat();

  return (
    <div className={geist.variable}>
      <div className="grid grid-cols-12 gap-x-4 px-4 md:gap-x-6 md:px-6">
        <div className="col-span-12 md:col-span-7">
          <p className="t-label t-tag text-[var(--case-muted)]">Momentos firma</p>
          <Lines className="mt-4 t-statement">Cuando toca jugar, la marca se suelta.</Lines>
          <FadeIn className="mt-8 max-w-[44ch]">
            <p className="t-body text-[var(--case-muted)]">
              La ruleta decide el juego de la noche. Cada uno, con su color y su propia personalidad.
            </p>
          </FadeIn>
        </div>
      </div>
      <div ref={box} className="relative mt-16 overflow-hidden py-6 md:mt-24" style={{ background: G.base }}>
        <motion.div className="flex w-max gap-4" style={{ x }}>
          {strip.map((g, k) => {
            const isPick = landed && k % GAMES.length === pick;
            return (
              <figure
                key={k}
                data-card
                className="relative aspect-[16/10] w-[70vw] shrink-0 overflow-hidden md:w-[28rem]"
                style={{ borderRadius: "0 18px 18px 18px" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={g.img} alt="" loading="lazy" className="h-full w-full object-cover" style={{ filter: "grayscale(1) contrast(1.1)" }} />
                {/* Filtro de color del juego: la foto en grises teñida con su color. */}
                <span aria-hidden className="absolute inset-0" style={{ background: g.color, mixBlendMode: "multiply" }} />
                <span aria-hidden className="absolute inset-0" style={{ background: g.color, mixBlendMode: "soft-light", opacity: 0.6 }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                <figcaption
                  className="absolute bottom-4 left-5 text-[clamp(1.6rem,3vw,2.6rem)] font-extrabold leading-none text-white"
                  style={{ fontFamily: "var(--font-gloop)" }}
                >
                  {g.name}
                </figcaption>
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 transition-opacity duration-500"
                  style={{ boxShadow: `inset 0 0 0 3px ${g.color}`, borderRadius: "0 18px 18px 18px", opacity: isPick ? 1 : 0 }}
                />
              </figure>
            );
          })}
        </motion.div>
        {/* Marca central de la ruleta */}
        <span aria-hidden className="pointer-events-none absolute left-1/2 top-0 h-3 w-[2px] -translate-x-1/2 bg-white" />
        <span aria-hidden className="pointer-events-none absolute bottom-0 left-1/2 h-3 w-[2px] -translate-x-1/2 bg-white" />
      </div>
    </div>
  );
}
