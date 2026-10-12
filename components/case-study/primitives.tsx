"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { endFlight } from "@/components/case-study/Flight";
import { DUR, EASE, STAGGER } from "@/lib/maqueta/motion";

/* Piezas de la maqueta de caso de estudio.
   Los colores salen de variables CSS que fija cada caso (--case-bg, --case-fg…),
   así cada proyecto elige su fondo sin depender de un modo claro/oscuro. */

type Kind = "imagen" | "vídeo" | "diagrama" | "código";
type From = "top" | "bottom" | "left" | "right";

// Curvas y duraciones: siempre los tokens de lib/maqueta/motion.ts.

// Máscara cerrada según la dirección por la que entra la cortinilla.
const CLOSED: Record<From, string> = {
  top: "inset(0% 0% 100% 0%)",
  bottom: "inset(100% 0% 0% 0%)",
  left: "inset(0% 100% 0% 0%)",
  right: "inset(0% 0% 0% 100%)",
};

/** Parallax externo (gesto Yakushev): el bloque entero se desplaza a su propia
    velocidad mientras cruza la pantalla. `speed` en px de recorrido total
    (positivo = va más lento que el scroll, negativo = más rápido). */
export function Parallax({
  children,
  speed = 60,
  className = "",
}: {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [speed / 2, -speed / 2]);
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div ref={ref} className={className} style={{ y }}>
      {children}
    </motion.div>
  );
}

/** Medio completo: parallax externo + MaskReveal de Metalab (0,8 s, Power3.easeInOut: la
    máscara se abre en una dirección mientras el contenido baja de escala 1,3 a 1) +
    parallax interno sutil, con la
    imagen moviéndose en sentido contrario dentro de su marco. */
export function MaskReveal({
  children,
  from = "bottom",
  speed = 60,
  className = "",
}: {
  children: React.ReactNode;
  from?: From;
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const innerY = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  if (reduce) return <div className={className}>{children}</div>;
  return (
    <Parallax speed={speed} className={className}>
      <motion.div
        ref={ref}
        className="overflow-hidden"
        initial={{ clipPath: CLOSED[from] }}
        whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: DUR.base, ease: EASE.inOut }}
      >
        <motion.div
          initial={{ scale: 1.3 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: DUR.base, ease: EASE.inOut }}
        >
          {/* Parallax interno: escala 1.12 para que el desplazamiento no deje bordes. */}
          <motion.div style={{ y: innerY, scale: 1.12 }}>{children}</motion.div>
        </motion.div>
      </motion.div>
    </Parallax>
  );
}

/** Momento grande: una ventana recortada en el centro que se abre con el scroll
    hasta quedar a sangre, con el contenido desescalándose y en parallax. */
export function WindowReveal({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const inset = useTransform(scrollYProgress, [0.05, 0.5], [18, 0]);
  const side = useTransform(scrollYProgress, [0.05, 0.5], [26, 0]);
    const clipPath = useTransform(
    [inset, side],
    ([i, s]) => `inset(${i}% ${s}% ${i}% ${s}%)`
  );
  const scale = useTransform(scrollYProgress, [0, 0.5], [1.3, 1]);
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  if (reduce) return <div className="h-[100svh] w-full">{children}</div>;

  return (
    <div ref={ref} className="relative h-[120svh] w-full">
      <motion.div className="absolute inset-0 overflow-hidden" style={{ clipPath }}>
        <motion.div className="h-full w-full" style={{ scale, y }}>
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
}

// Transición home → caso (como HOMEPAGE_TO_CASE_STUDY de Metalab): la miniatura crece EN
// LA HOME hasta pantalla completa (1,5 s, Power4.easeInOut) y solo entonces se cambia de
// página. La home deja esta marca para que el caso arranque ya con la imagen a pantalla
// completa, sin entrada propia: así no se nota el cambio.
export const FLIGHT_KEY = "case-flight";
export const FLIGHT_S = DUR.screen;

/** ¿Se llega al caso desde la miniatura de la home (imagen ya a pantalla completa)? */
function readFlight(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(FLIGHT_KEY) === "landed";
  } catch {
    return false;
  }
}

/** Bloque de texto que entra con barrido de máscara desde abajo (0,8 s, Power3.easeInOut)
    mientras sube 90 px (Power3.easeOut), como los textos de Metalab. */
export function MaskText({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ clipPath: CLOSED.bottom, y: 90 }}
      animate={{ clipPath: "inset(0% 0% 0% 0%)", y: 0 }}
      transition={{
        clipPath: { duration: DUR.base, ease: EASE.inOut, delay },
        y: { duration: DUR.base, ease: EASE.out, delay },
      }}
    >
      {children}
    </motion.div>
  );
}

/** Cabecera del caso. Si se llega desde la home, la imagen ya viene a pantalla completa
    (creció allí); si no, entra con la máscara de Metalab. Después se enmascara hacia arriba
    y queda como franja de cabecera, y en el hueco de abajo entra `overlay` (titular y
    ficha) con barridos de máscara. La portada funde al vídeo (`children`) cuando exista.
    Con el scroll, parallax sutil de la imagen. */
export function CaseHero({
  poster,
  children,
  overlay,
  videoReady = false,
}: {
  poster: React.ReactNode;
  children: React.ReactNode;
  overlay: (textDelay: number) => React.ReactNode;
  /** Mientras no haya vídeo real, la portada se queda (no funde a un placeholder). */
  videoReady?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  // Se lee en el primer render: así la cabecera sabe si debe aparecer ya montada.
  const [flown] = useState(readFlight);
  useEffect(() => {
    try {
      sessionStorage.removeItem(FLIGHT_KEY);
    } catch {}
    if (!flown) return;
    // Llegando desde la home: la capa del vuelo sigue encima. Se retira cuando la portada ya
    // está pintada (y, si es vídeo, en el mismo fotograma), así no hay parpadeo.
    const m = ref.current?.querySelector("[data-poster] img, [data-poster] video") as HTMLImageElement | HTMLVideoElement | null;
    if (!m) endFlight();
    else if (m instanceof HTMLVideoElement) endFlight(m);
    else m.decode().then(() => endFlight(), () => endFlight());
  }, [flown]);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const mediaY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);

  // Secuencia: imagen a pantalla completa → se enmascara hacia arriba (máscara de Metalab,
  // 0,8 s, Power3.easeInOut) y queda como franja de cabecera → entran titular y ficha en
  // el hueco de abajo. Si se entra directo, antes la imagen aparece con su máscara.
  const BAND = 44; // % de pantalla que la imagen deja libre abajo para los textos
  const full = "inset(0% 0% 0% 0%)";
  const band = `inset(0% 0% ${BAND}% 0%)`;
  const retractAt = flown ? 0.35 : 1.1;
  const textDelay = retractAt + 0.45;
  const posterFade = textDelay + 1.6;

  const clip = reduce
    ? { initial: false as const, animate: { clipPath: band } }
    : flown
      ? {
          initial: { clipPath: full },
          animate: { clipPath: band },
          transition: { duration: DUR.base, ease: EASE.inOut, delay: retractAt },
        }
      : {
          initial: { clipPath: CLOSED.bottom },
          animate: { clipPath: [CLOSED.bottom, full, full, band] },
          transition: { duration: DUR.base + 0.3 + 0.8, ease: EASE.inOut, times: [0, 0.42, 0.58, 1] },
        };

  return (
    <section ref={ref} className="relative h-[100svh] w-full overflow-hidden">
      <motion.div className="absolute inset-0" {...clip}>
        <motion.div className="absolute inset-0" style={reduce ? undefined : { y: mediaY }}>
          {children}
          <motion.div
            data-poster
            className="absolute inset-0"
            initial={{ opacity: 1 }}
            animate={{ opacity: videoReady ? 0 : 1 }}
            transition={{ duration: DUR.slow, ease: EASE.inOut, delay: posterFade }}
          >
            {poster}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Degradado arriba para que la nav se lea sobre la imagen. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[18%]"
        style={{ background: "linear-gradient(to bottom, color-mix(in srgb, var(--case-bg) 55%, transparent), transparent)" }}
      />
      <div className="absolute inset-x-0 bottom-0" style={{ height: `${BAND}%` }}>
        {overlay(textDelay)}
      </div>
    </section>
  );
}

/** Imagen o vídeo real (por extensión). Vídeo: en bucle, mudo y en línea, como el hero
    del portfolio. Cubre el contenedor (object-cover). */
function Media({ src, alt }: { src: string; alt: string }) {
  const cls = "absolute inset-0 h-full w-full object-cover";
  if (/\.(mp4|webm|mov)$/i.test(src))
    return <video className={cls} src={src} autoPlay muted loop playsInline aria-label={alt} />;
  // eslint-disable-next-line @next/next/no-img-element
  return <img className={cls} src={src} alt={alt} />;
}

/** Caja con el medio real (`src`) o, mientras no exista, gris con la indicación de qué
    imagen va ahí. */
export function Placeholder({
  kind = "imagen",
  label,
  ratio = "16/9",
  src,
  className = "",
}: {
  kind?: Kind;
  label: string;
  ratio?: string;
  src?: string;
  className?: string;
}) {
  return (
    <div
      className={`relative w-full overflow-hidden bg-[var(--case-ph)] ${className}`}
      style={{ aspectRatio: ratio }}
    >
      {src ? (
        <Media src={src} alt={label} />
      ) : (
        <>
          <span className="absolute left-4 top-4 border border-[var(--case-line)] px-2.5 py-1 font-[family-name:var(--font-case-mono)] t-label uppercase tracking-[0.08em] text-[var(--case-muted)]">
            {kind === "vídeo" ? "▶ vídeo" : kind}
          </span>
          <p className="absolute inset-x-4 bottom-4 max-w-[46ch] t-small text-[var(--case-muted)]">
            {label}
          </p>
        </>
      )}
    </div>
  );
}

/** Móvil (proporción iPhone 393×852): pantalla real (`src`) o placeholder gris. */
export function Phone({
  label,
  src,
  ratio = "393/852",
  className = "",
}: {
  label: string;
  src?: string;
  /** Proporción real de la grabación, si no es la del iPhone moderno. */
  ratio?: string;
  className?: string;
}) {
  return (
    <div className={`w-full ${className}`}>
      <div
        className="relative mx-auto w-full overflow-hidden rounded-[13%/6%] border border-[var(--case-line)] bg-[var(--case-ph)]"
        style={{ aspectRatio: ratio }}
      >
        {src ? (
          <Media src={src} alt={label} />
        ) : (
          <>
            <div className="absolute left-1/2 top-[2.4%] h-[3.2%] w-[30%] -translate-x-1/2 rounded-full bg-[var(--case-bg)]" />
            <p className="absolute inset-x-[10%] bottom-[6%] text-center t-label text-[var(--case-muted)]">
              {label}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

/** Aparición con desenfoque → foco (el gesto de los textos de Yakushev). */
export function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 32, filter: "blur(14px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{ duration: DUR.slow, delay, ease: EASE.out }}
    >
      {children}
    </motion.div>
  );
}

/** Antetítulo en mono (los «Introduction», «The vision»… de Metalab). */
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="mb-6 font-[family-name:var(--font-case-mono)] t-label text-[var(--case-muted)]">
      {children}
    </p>;
}

/** Pie de texto que acompaña a un medio grande. */
export function Caption({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`max-w-[34ch] t-small text-[var(--case-muted)] ${className}`}>
      {children}
    </p>
  );
}

/** Titular del caso en una sola línea a todo el ancho: mide el texto y ajusta el cuerpo para
    llenar el hueco (tope 12vw / 200 px). Si en pantallas estrechas quedara por debajo de 44 px,
    se permite partirlo en dos líneas. Sin estado: escribe el estilo directamente. */
function FitTitle({ text, delay }: { text: string; delay: number }) {
  const box = useRef<HTMLDivElement>(null);
  const h = useRef<HTMLHeadingElement>(null);
  useLayoutEffect(() => {
    // El tamaño va en variables CSS del contenedor: motion.h1 reescribe su propio `style` al
    // animar y pisaría un fontSize puesto en el titular.
    const fit = () => {
      const el = h.current;
      const b = box.current;
      if (!el || !b) return;
      b.style.setProperty("--fit-ws", "nowrap");
      b.style.setProperty("--fit", "100px");
      el.style.width = "";
      const size = Math.min(window.innerWidth * 0.12, 200, (100 * b.clientWidth) / el.scrollWidth);
      if (size < 44) {
        b.style.setProperty("--fit-ws", "normal");
        b.style.setProperty("--fit", "44px");
        el.style.width = "100%";
      } else b.style.setProperty("--fit", `${size}px`);
    };
    fit();
    document.fonts?.ready.then(fit);
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [text]);
  return (
    <div ref={box} className="w-full overflow-hidden">
      <motion.h1
        ref={h}
        className="w-max max-w-none font-extrabold leading-[0.88] tracking-[-0.045em] [font-size:var(--fit,clamp(44px,9vw,200px))] [white-space:var(--fit-ws,nowrap)]"
        initial={{ y: "100%" }}
        animate={{ y: "0%" }}
        transition={{ duration: DUR.base, ease: EASE.inOut, delay }}
      >
        {text}
      </motion.h1>
    </div>
  );
}

/** Cabecera común a todos los casos (2026-10-12): titular arriba a la izquierda a todo el
    ancho y en una línea; ficha debajo, a la derecha. */
export function CaseHeroOverlay({ name, facts, delay }: { name: string; facts: [string, string][]; delay: number }) {
  return (
    <div className="flex h-full flex-col justify-between gap-6 px-4 pb-6 pt-4 md:px-6 md:pb-7 md:pt-3">
      <FitTitle text={name} delay={delay} />
      <div className="grid grid-cols-12 gap-x-4 md:gap-x-6">
        <div className="col-span-12 md:col-span-5 md:col-start-8 lg:col-span-4 lg:col-start-9">
          <MaskText delay={delay + 2 * STAGGER}>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
              {facts.map(([k, v]) => (
                <div key={k}>
                  <dt className="font-[family-name:var(--font-case-mono)] t-label uppercase tracking-[0.08em] text-[var(--case-muted)]">
                    {k}
                  </dt>
                  <dd className="mt-1 t-small">{v}</dd>
                </div>
              ))}
            </dl>
          </MaskText>
        </div>
      </div>
    </div>
  );
}
