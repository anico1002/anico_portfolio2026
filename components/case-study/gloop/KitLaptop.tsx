"use client";

import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Lines from "@/components/case-study/Lines";
import { FadeIn } from "@/components/case-study/primitives";
import { useReduce } from "@/lib/maqueta/reduce";
import { DUR, EASE } from "@/lib/maqueta/motion";
import { G, geist } from "./tokens";
import Img from "@/components/case-study/Img";

/* El design system de Gloop (rehecho el 2026-10-13 con el feedback de Alberto: «parte importante, que no
   pase tan rápido»). Los textos llegan sobre negro; después, parada de scroll: el portátil se queda fijo
   a la derecha, se enciende el brillo violeta y fucsia, y a la izquierda pasan Fundamentos, Componentes y
   Handoff. Cada palabra salta a su tramo del recorrido del kit (kit.mp4, sin versionar: 0–14 s
   fundamentos, 14–21 s componentes); para Handoff, sobre la pantalla sube un panel con código.
   En móvil (o con movimiento reducido) no hay parada: los tres pasos van en lista bajo el portátil. */

const STEPS = [
  { title: "Foundations", body: "Color, type, spacing, shape, glass and motion.", from: 0, to: 13.8 },
  { title: "Components", body: "Buttons, chips, cards, fields and navigation for iOS and Android.", from: 14.2, to: 21.2 },
  { title: "Handoff", body: "Tokens and code ready to copy. And the whole system, readable by AI.", from: 14.2, to: 21.2 },
];

/* MacBook real (2026-10-14). Tras probar el M7 (Mockupnest) y el M11 (Pixeden; descartado: «azulejos de lavabo»),
   Alberto pasó el «MacBook Pro Mockup 2» de mockups-design.com: frontal. De su PSD se usa la capa de luces, que es
   el mismo portátil con luz baja, llevada a negro (`kit-macbook.jpg`, scratchpad/md). Al ser frontal, la pantalla
   es un rectángulo: el vídeo del kit va encima en CSS, vivo, y salta a cada paso como antes. `kit-m7.jpg` y
   `kit-m11.jpg` se conservan por si se vuelve atrás. */
const MOCK = "/maqueta/gloop/media/kit-macbook.png"; // PNG recortado que pasó Alberto, con la pantalla hecha transparente
/** Pantalla dentro de la imagen, en % (izquierda, arriba, ancho, alto). */
const SCREEN = { l: 8.615, t: 3.596, w: 82.769, h: 78.708 };

const CODE = [
  ["struct", " GloopButton: View {"],
  ["  let", " title: String"],
  ["  var", " style: Style = .primary"],
  ["  var", " body: some View {"],
  ["", "    Text(title)"],
  ["", "      .font(.gloop(.nav))"],
  ["", "      .frame(height: 64)"],
  ["", "      .background(.white, in: .capsule)"],
  ["", "  }"],
  ["", "}"],
];

function Laptop({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full">
      <div className="rounded-t-[1.4rem] bg-[#0d0d0f] p-[1.6%] pb-[2.2%] shadow-[0_40px_120px_-30px_rgba(0,0,0,0.8)] ring-1 ring-white/10">
        <div className="relative overflow-hidden rounded-[0.4rem] bg-black" style={{ aspectRatio: "16 / 10" }}>
          {children}
        </div>
      </div>
      <div className="relative mx-[-6%] h-[1.1rem] rounded-b-[1.2rem] bg-gradient-to-b from-[#c9cbd0] to-[#8e9096] md:h-[1.5rem]">
        <span className="absolute left-1/2 top-0 h-[40%] w-[14%] -translate-x-1/2 rounded-b-[0.6rem] bg-[#a5a7ad]" />
      </div>
    </div>
  );
}

/** Vídeo del kit que se queda dentro del tramo del paso activo (salta al principio del tramo al cambiar). */
function KitVideo({ step, play }: { step: number; play: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const s = STEPS[step];
    if (v.currentTime < s.from || v.currentTime > s.to) v.currentTime = s.from;
    const keep = () => {
      if (v.currentTime > s.to || v.currentTime < s.from - 0.5) v.currentTime = s.from;
    };
    v.addEventListener("timeupdate", keep);
    if (play) v.play().catch(() => {});
    else v.pause();
    return () => v.removeEventListener("timeupdate", keep);
  }, [step, play]);
  return (
    <video
      ref={ref}
      className="absolute inset-0 h-full w-full object-cover object-left-top"
      src="/maqueta/gloop/media/kit.mp4"
      poster="/maqueta/gloop/media/kit-poster.jpg"
      muted
      playsInline
      loop
      preload="metadata"
      aria-label="A tour of the Gloop design system"
    />
  );
}

export default function KitLaptop() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReduce();
  const [wide, setWide] = useState(false);
  const [step, setStep] = useState(0);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const on = () => setWide(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  const pinned = wide && !reduce;
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  useMotionValueEvent(p, "change", (v) => {
    setInView(v > 0 && v < 1);
    setStep(v < 0.38 ? 0 : v < 0.68 ? 1 : 2);
  });
  // El brillo se enciende al llegar la parada y se apaga al soltarla.
  const glow = useTransform(p, [0, 0.12, 0.88, 1], [0, 1, 1, 0]);

  return (
    <section className={`mt-36 md:mt-56 ${geist.variable}`}>
      {/* Los textos, sobre negro. */}
      <div className="grid grid-cols-12 items-end gap-x-4 px-4 md:gap-x-6 md:px-6 md:[align-items:last_baseline]">
        <div className="col-span-12 md:col-span-6">
          <FadeIn>
            <p className="t-label t-tag text-[var(--case-muted)]">Design system</p>
          </FadeIn>
          <Lines as="h2" className="mt-4 t-statement text-balance">
            One design system that design and engineering read the same way.
          </Lines>
        </div>
      </div>

      {/* La parada. */}
      <div ref={ref} className="relative" style={pinned ? { height: "340vh" } : undefined}>
        <div className={pinned ? "sticky top-0 flex h-screen items-center overflow-hidden" : "relative overflow-hidden py-20"}>
          {/* Con el fondo dentro de la capa: así el «superponer» de la textura solo asoma donde hay brillo. */}
          <motion.div aria-hidden className="pointer-events-none absolute inset-0 isolate bg-[var(--case-bg)]" style={{ opacity: pinned ? glow : 1 }}>
            {/* Halos con degradado radial en vez de blur de 140 px (auditoría 2026-10-19: Safari lo recalculaba en cada
                fotograma de este escenario fijo, hasta 400 ms). La caja crece lo que antes añadía el desenfoque. */}
            <span className="absolute -left-40 top-[10%] -m-[140px] h-[calc(36rem+280px)] w-[calc(36rem+280px)] opacity-35" style={{ background: `radial-gradient(closest-side, ${G.brandDeep} 45%, transparent)` }} />
            <span className="absolute -right-32 bottom-[5%] -m-[140px] h-[calc(32rem+280px)] w-[calc(32rem+280px)] opacity-20" style={{ background: `radial-gradient(closest-side, ${G.accent} 45%, transparent)` }} />
            {/* Sin textura de foto encima (2026-10-14): a 1.100 px se veía blanda y Alberto prefirió quitarla. */}
          </motion.div>
          <div className="relative grid w-full grid-cols-12 items-center gap-x-4 gap-y-12 px-4 md:gap-x-6 md:px-6">
            {/* Los tres pasos: en escritorio, uno encendido cada vez. */}
            {/* Centrados en el hueco entre el margen y el portátil (feedback 2026-10-14: pegados al margen quedaban raros). */}
            <div className="order-2 col-span-12 md:col-span-4 md:col-start-9 md:flex md:justify-center">
            <div>
            {/* El párrafo de la sección, encima de los pasos (feedback 2026-10-14: arriba, junto al titular,
                quedaba muy despegado del portátil y de los pasos). */}
            <FadeIn className="mb-10 max-w-[30ch] md:mb-14">
              <p className="t-body text-[var(--case-muted)]">
                Gloop’s language, organized and production-ready. Every new screen is born with its DNA.
              </p>
            </FadeIn>
            <ol className="space-y-8 md:space-y-10">
              {STEPS.map((s, k) => {
                const on = !pinned || step === k;
                return (
                  <li key={s.title} className="relative">
                    {/* «01/Fundamentos»: el número cuelga por fuera y el texto se alinea con la palabra. */}
                    <motion.p
                      className="t-title"
                      animate={{ opacity: on ? 1 : 0.25 }}
                      transition={{ duration: DUR.base, ease: EASE.out }}
                    >
                      {/* En móvil va en línea: colgado por fuera, el recorte de la sección lo cortaba. */}
                      <span className="mr-2 whitespace-nowrap md:absolute md:right-full md:top-0 t-label t-tag leading-[inherit] text-[var(--case-muted)]" style={{ lineHeight: "inherit" }}>
                        0{k + 1}/
                      </span>
                      {s.title}
                    </motion.p>
                    <motion.p
                      className="mt-2 max-w-[30ch] t-small text-[var(--case-muted)]"
                      animate={{ opacity: on ? 1 : 0, height: on ? "auto" : 0 }}
                      transition={{ duration: DUR.base, ease: EASE.inOut }}
                    >
                      {s.body}
                    </motion.p>
                  </li>
                );
              })}
            </ol>
            </div>
            </div>
            {/* Grande y a la izquierda: sale por el borde de la pantalla sin miedo, mientras se vea la pantalla. */}
            <motion.div className="order-1 col-span-12 md:col-span-8 md:col-start-1 md:row-start-1 md:ml-[30px]">
              <div className="relative">
                {/* La pantalla debajo (el vídeo del kit, vivo) y el MacBook recortado encima: el PNG trae la pantalla
                    transparente, así el marco y la muesca son los de la plantilla. Sin movimiento de entrada. */}
                <div
                  className="absolute overflow-hidden bg-black"
                  style={{ left: `${SCREEN.l}%`, top: `${SCREEN.t}%`, width: `${SCREEN.w}%`, height: `${SCREEN.h}%` }}
                >
                  <KitVideo step={pinned ? step : 0} play={!pinned || inView} />
                </div>
                { }
                <Img src={MOCK} alt="The Gloop design system on a MacBook" className="relative block w-full" />
                {/* Handoff: el código sube sobre la pantalla. */}
                <motion.pre
                  className="absolute bottom-[26%] right-[14%] w-[36%] overflow-hidden rounded-[10px] p-[2.2%] text-[clamp(8px,0.9vw,13px)] leading-relaxed shadow-2xl"
                  style={{
                    background: "rgba(11,6,19,0.82)",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.14)",
                    color: G.text70,
                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                  }}
                  initial={false}
                  animate={{ opacity: pinned && step === 2 ? 1 : 0, y: pinned && step === 2 ? 0 : 30 }}
                  transition={{ duration: DUR.base, ease: EASE.out }}
                >
                  {CODE.map(([kw, rest], i) => (
                    <span key={i} className="block whitespace-pre">
                      <span style={{ color: G.brand }}>{kw}</span>
                      {rest}
                    </span>
                  ))}
                </motion.pre>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
