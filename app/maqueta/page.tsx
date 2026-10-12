"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import SiteNav from "@/components/case-study/SiteNav";
import { DUR, EASE, STAGGER, inOrOut } from "@/lib/maqueta/motion";
import { startCurtain } from "@/components/case-study/Curtain";
import { SLIDES } from "@/lib/maqueta/sections";

/* Entrada de la maqueta (elegida 2026-10-12; adonde lleva el logo): pantalla partida por la mitad, Product a la izquierda
   y Games a la derecha. Titulares juntos en el centro, pegados a la línea central; un párrafo corto
   justificado abajo, en el lado exterior y en espejo, que solo aparece al pasar por encima.
   Al pasar, esa mitad se ensancha un poco, pasa un pase de proyectos de fondo y la otra se
   atenúa. En táctil todo se ve siempre. La alternativa A, descartada, sigue en /maqueta/entrada-a. */

const mono = "font-[family-name:var(--font-case-mono)] uppercase tracking-[0.08em]";

type Side = {
  key: "product" | "games";
  label: string;
  text: string;
  href: string;
  slides: string[];
};

const sides: Side[] = [
  {
    key: "product",
    label: "Product",
    text: "Apps, producto digital, marca y web. Diseño de la idea al código nativo, con prototipos que se pueden tocar.",
    href: "/maqueta/home",
    slides: [...SLIDES.product],
  },
  {
    key: "games",
    label: "Games",
    text: "UI/UX de videojuegos: menús, HUD y sistemas visuales para títulos jugados por cientos de millones de personas.",
    href: "/maqueta/games",
    slides: [...SLIDES.games],
  },
];

/** Pase de fondo: fundido con un ligero zoom de salida (1,08 → 1) en cada diapositiva. */
function Slides({ srcs, active, frozen = false }: { srcs: string[]; active: boolean; frozen?: boolean }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!active || frozen) return;
    const t = setInterval(() => setI((n) => (n + 1) % srcs.length), 1600);
    return () => clearInterval(t);
  }, [active, frozen, srcs.length]);
  return (
    <motion.div
      aria-hidden
      data-slides
      className="absolute inset-0 overflow-hidden"
      initial={false}
      animate={{ opacity: active ? 1 : 0 }}
      transition={{ duration: inOrOut(active), ease: EASE.inOut }}
    >
      <AnimatePresence initial={false}>
        <motion.img
          key={srcs[i]}
          src={srcs[i]}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ opacity: { duration: DUR.base, ease: EASE.inOut }, scale: { duration: DUR.drift, ease: EASE.out } }}
        />
      </AnimatePresence>
      {/* Velo para que el texto blanco se lea sobre cualquier imagen. */}
      <div className="absolute inset-0 bg-black/45" />
      {/* Precarga del resto de diapositivas (sin mostrar). */}
      <div className="hidden">
        {srcs.map((s) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={s} src={s} alt="" />
        ))}
      </div>
    </motion.div>
  );
}

/** «01» / «02» en tamaño de etiqueta, alineado con la parte alta de las mayúsculas del titular. */
function Num({ n, side }: { n: number; side: "left" | "right" }) {
  return (
    <span className={`inline-block align-top t-label opacity-70 ${mono} ${side === "left" ? "mr-2 md:mr-3" : "ml-2 md:ml-3"}`}>
      0{n}
    </span>
  );
}

// Sin ratón (móvil/tableta) no hay «pasar por encima»: ahí los dos pases van siempre.
const noHover = () => typeof window !== "undefined" && window.matchMedia("(hover: none)").matches;

export default function EntryB() {
  const [hover, setHover] = useState<Side["key"] | null>(null);
  const [touch, setTouch] = useState(false);
  // Al elegir una mitad: crece hasta cubrir la pantalla (titular al centro) y, al terminar, el
  // telón del layout toma el relevo y se levanta con un barrido sobre la home de esa sección.
  const [chosen, setChosen] = useState<Side["key"] | null>(null);
  const handed = useRef(false);
  const router = useRouter();
  const handOff = (s: Side, half: HTMLElement) => {
    if (handed.current) return;
    handed.current = true;
    // La diapositiva visible ahora mismo (la de más opacidad) y su escala exacta.
    const imgs = [...half.querySelectorAll<HTMLImageElement>("[data-slides] img")];
    const img = imgs.sort((a, b) => +getComputedStyle(b).opacity - +getComputedStyle(a).opacity)[0];
    const m = img && getComputedStyle(img).transform;
    const scale = m && m !== "none" ? new DOMMatrixReadOnly(m).a : 1;
    startCurtain({ src: img?.getAttribute("src") ?? s.slides[0], scale, label: s.label, from: "/maqueta" });
    router.push(s.href);
  };
  useEffect(() => {
    const id = requestAnimationFrame(() => setTouch(noHover()));
    return () => cancelAnimationFrame(id);
  }, []);
  // En móvil el titular va pegado encima del párrafo: cada mitad guarda el alto de su párrafo.
  useEffect(() => {
    const ro = new ResizeObserver((es) =>
      es.forEach((e) => (e.target.parentElement as HTMLElement)?.style.setProperty("--ph", `${e.target.getBoundingClientRect().height}px`))
    );
    document.querySelectorAll("[data-para]").forEach((el) => ro.observe(el));
    return () => ro.disconnect();
  }, []);
  return (
    <main className="relative flex min-h-[100svh] flex-col overflow-hidden bg-[var(--case-bg)] font-[family-name:var(--font-case-sans)] text-[var(--case-fg)] antialiased md:flex-row">
      <SiteNav active={null} menu={false} />
      {sides.map((s, i) => {
        const left = i === 0;
        const picked = chosen === s.key;
        const other = chosen !== null && !picked;
        const on = picked || (!chosen && (touch || hover === s.key));
        const off = other || (!chosen && !touch && hover !== null && !on);
        return (
          <motion.div
            key={s.key}
            className={`relative overflow-hidden ${other ? "min-h-0" : "min-h-[50svh] md:min-h-[100svh]"} ${left || chosen ? "" : "md:border-l md:border-[var(--case-line)]"}`}
            initial={false}
            animate={{ flexGrow: chosen ? (picked ? 1 : 0) : on && !touch ? 1.25 : 1 }}
            style={{ flexBasis: 0 }}
            transition={{ duration: chosen ? DUR.slow : inOrOut(on), ease: chosen ? EASE.screen : EASE.inOut }}
            // El relevo lo da la mitad que se cierra: la elegida no siempre cambia de valor (en
            // táctil ya está a 1, crece solo porque la otra encoge) y entonces no avisaría nunca.
            onAnimationComplete={() => {
              const c = other && sides.find((x) => x.key === chosen);
              if (c) handOff(c, document.querySelector(`[data-half="${c.key}"]`) as HTMLElement);
            }}
            data-half={s.key}
            onMouseEnter={() => !touch && setHover(s.key)}
            onMouseLeave={() => !touch && setHover(null)}
          >
            <Link
              href={s.href}
              className="group absolute inset-0 block"
              aria-label={s.label}
              onClick={(e) => {
                e.preventDefault();
                if (!chosen) setChosen(s.key);
              }}
            >
              <Slides srcs={s.slides} active={on} frozen={picked} />
              <motion.div
                className={`relative h-full hov ${on ? "text-white" : ""}`}
                initial={false}
                animate={{ opacity: off ? 0.35 : 1 }}
                transition={{ duration: inOrOut(off), ease: EASE.inOut }}
              >
                {/* Titulares juntos en el centro de la pantalla, cada uno pegado a la línea central
                    con un pequeño margen: «Product» a su izquierda y «Games» a su derecha. En móvil (mitades
                    apiladas) van a su lado y justo encima de su párrafo, formando un bloque con él (`--ph` = alto
                    del párrafo): Product a la izquierda, Games a la derecha. */}
                <div
                  className={`absolute inset-0 flex overflow-hidden ${picked ? "items-center justify-center" : `items-end pb-[calc(var(--ph,0px)+2.5rem)] md:items-center md:pb-0 ${left ? "justify-start px-4 md:justify-end md:pl-0 md:pr-5" : "justify-end px-4 md:justify-start md:pl-5 md:pr-0"}`}`}
                >
                  <motion.p
                    layout="position"
                    className="whitespace-nowrap t-d3"
                    initial={{ y: "110%" }}
                    animate={{ y: "0%" }}
                    transition={{ duration: DUR.base, ease: EASE.inOut, delay: (1 + i) * STAGGER, layout: { duration: DUR.slow, ease: EASE.screen } }}
                  >
                    {/* Número pequeño pegado arriba del titular: delante de la P de «Product» y detrás de
                        la s de «Games» (antes iba repetido abajo como «01 — Product»). */}
                    {left && <Num n={i + 1} side="left" />}
                    {s.label}
                    {!left && <Num n={i + 1} side="right" />}
                  </motion.p>
                </div>
                {/* Párrafo desplazado abajo, en el lado exterior (en espejo); solo al pasar por
                    encima (en táctil, siempre). */}
                <motion.div
                  data-para
                  className={`absolute bottom-6 max-w-[30ch] md:bottom-8 ${left ? "left-4 md:left-6" : "right-4 md:right-6"}`}
                  initial={false}
                  animate={{ opacity: on && !chosen ? 1 : 0, y: on && !chosen ? 0 : 16 }}
                  transition={{ duration: chosen ? DUR.fast : inOrOut(on), ease: EASE.out, delay: on && !chosen ? STAGGER : 0 }}
                >
                  <p
                    lang="es"
                    className={`hyphens-auto text-justify t-body ${left ? "[text-align-last:left]" : "[text-align-last:right]"}`}
                  >
                    {s.text}
                  </p>
                </motion.div>
              </motion.div>
            </Link>
          </motion.div>
        );
      })}
    </main>
  );
}
