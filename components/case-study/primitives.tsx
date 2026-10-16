"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { endFlight } from "@/components/case-study/Flight";
import { DUR, EASE, STAGGER } from "@/lib/maqueta/motion";
import { useBooted } from "@/lib/maqueta/boot";
import LazyVideo from "@/components/case-study/LazyVideo";
import { useReduce } from "@/lib/maqueta/reduce";

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

/** ¿Ha entrado ya en pantalla? (una vez). Sustituye a `whileInView` de framer-motion: en Safari,
    al llegar a una página navegando (no recargando), su detector no se disparaba nunca y los
    bloques se quedaban invisibles (2026-10-12). Este usa el IntersectionObserver del navegador
    directamente, que sí funciona. `margin` como el rootMargin de CSS. */
export function useSeen<T extends Element>(ref: React.RefObject<T | null>, margin = "0px") {
  const [seen, setSeen] = useState(false);
  // En la primera carga no se vigila hasta que la tipografía está lista (Boot, D6).
  const booted = useBooted();
  useEffect(() => {
    const el = ref.current;
    if (!el || seen || !booted) return;
    const io = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting)) {
          setSeen(true);
          io.disconnect();
        }
      },
      { rootMargin: margin }
    );
    io.observe(el);
    // Lo último de una página puede quedar a menos de ese margen del borde de abajo, y entonces no
    // llegaría a entrar nunca (el pie de «Sobre mí» en móvil, 2026-10-13): si ya no se puede bajar
    // más y el bloque está en pantalla, entra.
    const atEnd = () => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
        setSeen(true);
        io.disconnect();
      }
    };
    atEnd();
    window.addEventListener("scroll", atEnd, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", atEnd);
    };
  }, [ref, margin, seen, booted]);
  return seen;
}

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
  const reduce = useReduce();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [speed / 2, -speed / 2]);
  if (reduce) return <div ref={ref} className={className}>{children}</div>;
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
  const reduce = useReduce();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const innerY = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);
  const seen = useSeen(ref, "-10% 0px");

  if (reduce) return <div ref={ref} className={className}>{children}</div>;
  return (
    <Parallax speed={speed} className={className}>
      <motion.div
        ref={ref}
        className="overflow-hidden"
        initial={{ clipPath: CLOSED[from] }}
        animate={{ clipPath: seen ? "inset(0% 0% 0% 0%)" : CLOSED[from] }}
        transition={{ duration: DUR.base, ease: EASE.inOut }}
      >
        <motion.div
          initial={{ scale: 1.3 }}
          animate={{ scale: seen ? 1 : 1.3 }}
          transition={{ duration: DUR.base, ease: EASE.inOut }}
        >
          {/* Parallax interno: escala 1.12 para que el desplazamiento no deje bordes. */}
          <motion.div style={{ y: innerY, scale: 1.12 }}>{children}</motion.div>
        </motion.div>
      </motion.div>
    </Parallax>
  );
}

/** Entrada de gráficos (2026-10-13, Gloop): el mismo gesto que `MaskReveal` (máscara que se abre en una
    dirección mientras el contenido baja de escala), pero sin el parallax interno ni la escala que se queda:
    en una pieza de interfaz recreada, esa escala recortaría los bordes. Para cajas planas (sin sombra
    por fuera, que la máscara cortaría). */
export function GraphicReveal({
  children,
  from = "bottom",
  className = "",
}: {
  children: React.ReactNode;
  from?: From;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReduce();
  const seen = useSeen(ref, "-10% 0px");
  if (reduce) return <div ref={ref} className={className}>{children}</div>;
  // Se vigila el contenedor, no la capa recortada: Chrome da por no visible un elemento recortado del
  // todo con clip-path y la entrada no se disparaba nunca.
  return (
    <div ref={ref} className={className}>
      <motion.div
        className="h-full"
        initial={{ clipPath: CLOSED[from] }}
        animate={{ clipPath: seen ? "inset(0% 0% 0% 0%)" : CLOSED[from] }}
        transition={{ duration: DUR.slow, ease: EASE.inOut }}
      >
        <motion.div
          className="h-full"
          initial={{ scale: 1.12 }}
          animate={{ scale: seen ? 1 : 1.12 }}
          transition={{ duration: DUR.slow, ease: EASE.inOut }}
        >
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
}

/** Momento grande: una ventana recortada en el centro que se abre con el scroll
    hasta quedar a sangre, con el contenido desescalándose y en parallax. */
export function WindowReveal({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReduce();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const inset = useTransform(scrollYProgress, [0.05, 0.5], [18, 0]);
  const side = useTransform(scrollYProgress, [0.05, 0.5], [26, 0]);
    const clipPath = useTransform(
    [inset, side],
    ([i, s]) => `inset(${i}% ${s}% ${i}% ${s}%)`
  );
  const scale = useTransform(scrollYProgress, [0, 0.5], [1.3, 1]);
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  if (reduce) return <div ref={ref} className="h-[100svh] w-full">{children}</div>;

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
  const reduce = useReduce();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      // Margen por abajo dentro de la máscara (y compensado fuera): sin él, el recorte se come
      // los trazos que bajan de la línea (g, j, p) de la última línea.
      className={`pb-[0.25em] -mb-[0.25em] ${className}`}
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
  const reduce = useReduce();
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
  // B4 · Llegando desde la home (fase 2 de Metalab): espera 0,2 s y la imagen se recoge en 1,2 s
  // descubriendo el titular, que entra a mitad de recorrido.
  const retractAt = flown ? 0.2 : 1.1;
  const textDelay = retractAt + (flown ? DUR.slow / 2 : 0.45);
  const posterFade = textDelay + 1.6;

  const clip = reduce
    ? { initial: false as const, animate: { clipPath: band } }
    : flown
      ? {
          initial: { clipPath: full },
          animate: { clipPath: band },
          transition: { duration: DUR.slow, ease: EASE.inOut, delay: retractAt },
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

      {/* Sin degradado arriba (quitado el 2026-10-13: en claro era una bruma blanca sobre la foto). El
          logo y el menú se leen solos con la mezcla por diferencia. */}
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
    return <LazyVideo className={cls} src={src} aria-label={alt} />;
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
          <span className="absolute left-4 top-4 border border-[var(--case-line)] px-2.5 py-1 t-label t-tag text-[var(--case-muted)]">
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

/** Entrada de bloques de texto con máscara (2026-10-12; antes desenfoque → foco, que en Safari
    daba problemas): barrido de abajo arriba mientras el bloque sube un poco. Mismo gesto que el
    resto de la maqueta. (Conserva el nombre `FadeIn` para no tocar todos los usos.) */
export function FadeIn({
  children,
  delay = 0,
  className = "",
  margin = "-12% 0px",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  /** Cuánto debe entrar en pantalla antes de aparecer (rootMargin). */
  margin?: string;
}) {
  const reduce = useReduce();
  const ref = useRef<HTMLDivElement>(null);
  const seen = useSeen(ref, margin);
  // La máscara abierta deja aire alrededor del bloque, en % de su alto (2026-10-13): antes iba a ras
  // y con un margen de 0,25 em del cuerpo, que con letra gigante se quedaba corto y cortaba el «¿» de
  // «¿Hablamos?». En % vale para cualquier tipografía y tamaño. Cerrada va a ras (si no, lo que cuelga
  // por debajo de la línea asomaría antes de tiempo).
  const hidden = { clipPath: "inset(100% -5% 0% -5%)", y: 40 };
  return (
    <motion.div
      ref={ref}
      // Margen por abajo dentro de la máscara para no cortar g, j, p (ver MaskText).
      className={`pb-[0.25em] -mb-[0.25em] ${className}`}
      initial={reduce ? false : hidden}
      animate={reduce || seen ? { clipPath: "inset(-30% -5% -30% -5%)", y: 0 } : hidden}
      transition={{ clipPath: { duration: DUR.base, ease: EASE.inOut, delay }, y: { duration: DUR.base, ease: EASE.out, delay } }}
    >
      {children}
    </motion.div>
  );
}

/** Antetítulo (los «Introduction», «The vision»… de Metalab), con el mismo estilo que los datos. */
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="mb-6 t-label t-tag text-[var(--case-muted)]">
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
function FitTitle({ text, delay, sup }: { text: string; delay: number; sup?: string }) {
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
    // La máscara lleva 0,22 veces el cuerpo de aire arriba y abajo (compensado con margen negativo:
    // no mueve nada). Con el interlineado de 0,88 las g, p, j y los acentos se salían de la caja y
    // se cortaban (2026-10-13). El titular arranca un 140 % más abajo para no asomar en ese aire.
    <div
      ref={box}
      className="-my-[calc(var(--fit,44px)*0.22)] w-full overflow-hidden py-[calc(var(--fit,44px)*0.22)]"
    >
      <motion.h1
        ref={h}
        className="w-max max-w-none font-bold leading-[0.88] tracking-[-0.055em] [font-size:var(--fit,clamp(44px,9vw,200px))] [white-space:var(--fit-ws,nowrap)]"
        initial={{ y: "140%" }}
        animate={{ y: "0%" }}
        transition={{ duration: DUR.base, ease: EASE.inOut, delay }}
      >
        {text}
        {/* El año, en pequeño al lado del nombre, como el recuento de «Product (14)» del menú (prueba 2026-10-17). */}
        {sup && <sup className="cap-sup ml-[0.12em] t-small font-normal tracking-normal text-[var(--case-muted)]">({sup})</sup>}
      </motion.h1>
    </div>
  );
}

/** Cabecera común a todos los casos (2026-10-12): titular arriba a la izquierda a todo el
    ancho y en una línea; ficha debajo, a la derecha. */
export function CaseHeroOverlay({ name, facts, delay }: { name: string; facts: [string, string][]; delay: number }) {
  // Ficha resumida (2026-10-17): el año junto al nombre; debajo, a la derecha, lo que se hizo y el rol. «Para» se
  // quita (el nombre ya está en grande) y «Qué hice» va sin rótulo.
  const get = (...keys: string[]) => facts.find(([k]) => keys.includes(k))?.[1];
  const year = get("Año")?.split(" · ")[0];
  const did = get("Qué hice", "Entregables");
  const role = get("Rol");
  return (
    <div className="flex h-full flex-col justify-between gap-6 px-4 pb-6 pt-4 md:px-6 md:pb-7 md:pt-3">
      <FitTitle text={name} delay={delay} sup={year} />
      <div className="grid grid-cols-12 gap-x-4 md:gap-x-6">
        <div className="col-span-12 md:col-span-4 md:col-start-8 lg:col-span-3 lg:col-start-9">
          <MaskText delay={delay + 2 * STAGGER}>
            <div className="t-small">
              {did && <p className="text-balance">{did}</p>}
              {role && (
                <p className="mt-1">
                  <span className="text-[var(--case-muted)]">Rol: </span>
                  {role}
                </p>
              )}
            </div>
          </MaskText>
        </div>
      </div>
    </div>
  );
}

/** Medio de cabecera pensado para la franja (2026-10-16). Tras la apertura, CaseHero solo deja ver el 56 % de
    arriba: en escritorio va un vídeo compuesto con el dispositivo entero en esa franja (scripts/mockups/hero_band.py);
    en móvil, la miniatura 16:10 ocupando solo la franja, donde el dispositivo cabe a lo ancho. */
export function BandMedia({ desktop, mobile, label, zoom = 1.3 }: { desktop: string; mobile: string; label: string; zoom?: number }) {
  return (
    <div className="relative h-full w-full bg-[var(--case-ph)]">
      <div className="hidden h-full md:block">
        <Placeholder ratio="auto" className="h-full" src={desktop} label={label} />
      </div>
      {/* En móvil la miniatura no se recorta a lo alto: se escala para que el dispositivo quepa a lo ancho
          (`zoom` = ancho del vídeo / ancho de pantalla) y se centra en la franja. */}
      <div className="absolute inset-x-0 top-0 h-[56%] overflow-hidden md:hidden">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ width: `${zoom * 100}%` }}>
          <Placeholder ratio="16/10" src={mobile} label={label} />
        </div>
      </div>
    </div>
  );
}
