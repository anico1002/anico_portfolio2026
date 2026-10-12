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

const mono = "t-tag"; // titulillos: estilo único en app/maqueta/system.css

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

/** «01» / «02» en tamaño de etiqueta, centrado en vertical con la palabra del titular. */
function Num({ n, side }: { n: number; side: "left" | "right" }) {
  return (
    <span className={`inline-block t-label opacity-70 ${mono} ${side === "left" ? "mr-2 md:mr-3" : "ml-2 md:ml-3"}`}>
      0{n}
    </span>
  );
}

/** Salida de los textos al elegir una mitad (2026-10-12): máscara que avanza en la misma dirección
    y al mismo ritmo que el borde entre las dos mitades, como se va la imagen de fondo. En escritorio
    el borde se mueve en horizontal; en móvil (mitades apiladas), en vertical. */
const EXIT = { duration: DUR.slow, ease: EASE.screen };
const OPEN = "inset(0% 0% 0% 0%)";
/** Recorte final según qué mitad se elige: el borde avanza hacia la otra y va tapando los textos. */
const exitClip = (picked: Side["key"], stacked: boolean) =>
  picked === "product"
    ? stacked ? "inset(100% 0% 0% 0%)" : "inset(0% 0% 0% 100%)"
    : stacked ? "inset(0% 0% 100% 0%)" : "inset(0% 100% 0% 0%)";

// Sin ratón (móvil/tableta) no hay «pasar por encima»: ahí los dos pases van siempre.
const noHover = () => typeof window !== "undefined" && window.matchMedia("(hover: none)").matches;

export default function EntryB() {
  const [hover, setHover] = useState<Side["key"] | null>(null);
  const [touch, setTouch] = useState(false);
  // Al elegir una mitad: crece hasta cubrir la pantalla (los titulares se van al clicar) y, al terminar, el
  // telón del layout toma el relevo y se levanta con un barrido sobre la home de esa sección.
  const [chosen, setChosen] = useState<Side["key"] | null>(null);
  // ¿Mitades apiladas (móvil)? Se mira al elegir, para que la máscara siga al borde.
  const [stacked, setStacked] = useState(false);
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
    startCurtain({ src: img?.getAttribute("src") ?? s.slides[0], scale, from: "/maqueta" });
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
                if (chosen) return;
                setStacked(!window.matchMedia("(min-width: 768px)").matches);
                setChosen(s.key);
              }}
            >
              <Slides srcs={s.slides} active={on} frozen={picked} />
              <motion.div
                className={`relative h-full ${on ? "text-white" : ""}`}
                // Solo el color con CSS: la opacidad (atenuar la otra mitad) la anima framer. Si la clase
                // del hover también la transicionaba, las dos se pisaban y la atenuación iba a saltos.
                style={{ transition: "color var(--dur-fast) var(--ease-out)" }}
                initial={false}
                animate={{ opacity: off ? 0.35 : 1 }}
                transition={{ duration: inOrOut(off), ease: EASE.inOut }}
              >
                {/* Titulares juntos en el centro de la pantalla, cada uno pegado a la línea central
                    con un pequeño margen: «Product» a su izquierda y «Games» a su derecha. En móvil (mitades
                    apiladas) van a su lado y justo encima de su párrafo, formando un bloque con él (`--ph` = alto
                    del párrafo): Product a la izquierda, Games a la derecha. */}
                <div
                  className={`absolute inset-0 flex overflow-hidden ${`items-end pb-[calc(var(--ph,0px)+2.5rem)] md:items-center md:pb-0 ${left ? "justify-start px-4 md:justify-end md:pl-0 md:pr-5" : "justify-end px-4 md:justify-start md:pl-5 md:pr-0"}`}`}
                >
                  {/* Máscara ajustada al titular: entra desde abajo y sale por arriba sin verse fuera. */}
                  <div className="overflow-hidden pb-[0.06em]">
                    <motion.p
                      className="flex items-center whitespace-nowrap t-d3"
                      initial={{ y: "110%" }}
                      // Al elegir, los dos titulares se van con la máscara del borde (como la imagen): la
                      // mitad crece ya sin texto y el nombre no reaparece en el telón ni en la home.
                      animate={chosen ? { y: "0%", clipPath: exitClip(chosen, stacked) } : { y: "0%", clipPath: OPEN }}
                      transition={chosen ? EXIT : { duration: DUR.base, ease: EASE.inOut, delay: (1 + i) * STAGGER }}
                    >
                      {/* Número pequeño centrado con el titular: delante de la P de «Product» y detrás de
                          la s de «Games» (antes iba repetido abajo como «01 — Product»). */}
                      {left && <Num n={i + 1} side="left" />}
                      {s.label}
                      {!left && <Num n={i + 1} side="right" />}
                    </motion.p>
                  </div>
                </div>
                {/* Párrafo desplazado abajo, en el lado exterior (en espejo); solo al pasar por
                    encima (en táctil, siempre). */}
                <motion.div
                  data-para
                  className={`absolute bottom-6 max-w-[30ch] md:bottom-8 ${left ? "left-4 md:left-6" : "right-4 md:right-6"}`}
                  initial={false}
                  animate={chosen ? { clipPath: exitClip(chosen, stacked), opacity: 1, y: 0 } : { clipPath: OPEN, opacity: on ? 1 : 0, y: on ? 0 : 16 }}
                  transition={chosen ? EXIT : { duration: inOrOut(on), ease: EASE.out, delay: on ? STAGGER : 0 }}
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
