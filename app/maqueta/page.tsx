"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import SiteNav from "@/components/case-study/SiteNav";
import { DUR, EASE, STAGGER, inOrOut, reducedMotion } from "@/lib/maqueta/motion";
import { startCurtain } from "@/components/case-study/Curtain";
import { SLIDES } from "@/lib/maqueta/sections";
import { SECTION_COUNT } from "@/lib/maqueta/cases";
import SlideMedia, { posterOf, useSlideshow } from "@/components/case-study/SlideMedia";
import Img from "@/components/case-study/Img";
import { BASE } from "@/lib/maqueta/base";

/* Entrada de la maqueta (elegida 2026-10-12; adonde lleva el logo): pantalla partida por la mitad, Product a la izquierda
   y Games a la derecha. Titulares juntos en el centro, pegados a la línea central; un párrafo corto
   justificado abajo, en el lado exterior y en espejo, que solo aparece al pasar por encima.
   Al pasar, esa mitad se ensancha un poco, pasa un pase de proyectos de fondo y la otra se
   atenúa. En táctil todo se ve siempre. La alternativa A, descartada, sigue en /maqueta/entrada-a. */


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
    text: "Apps, digital products, brand and web. From the first idea to native code, with prototypes you can actually touch.",
    href: `${BASE}/home`,
    slides: [...SLIDES.product],
  },
  {
    key: "games",
    label: "Games",
    text: "Game UI/UX: menus, HUDs and visual systems for titles played by hundreds of millions of people.",
    href: `${BASE}/games`,
    slides: [...SLIDES.games],
  },
];

/** Pase de fondo: fundido con un ligero zoom de salida (1,08 → 1) en cada diapositiva. Imágenes en
    corte rápido; los vídeos (miniaturas en movimiento) se dejan un poco más. */
function Slides({ srcs, active, frozen = false }: { srcs: string[]; active: boolean; frozen?: boolean }) {
  const { i } = useSlideshow(srcs, active && !frozen, 1600, 3200);
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
        <SlideMedia key={srcs[i]} src={srcs[i]} playing={active} />
      </AnimatePresence>
      {/* Velo para que el texto blanco se lea sobre cualquier imagen. */}
      <div className="absolute inset-0 bg-black/45" />
      {/* Precarga del resto de diapositivas (sin mostrar). */}
      <div className="hidden">
        {srcs.map((s) => (
           
          <Img key={s} src={posterOf(s)} alt="" />
        ))}
      </div>
    </motion.div>
  );
}

/** Número de proyectos de la sección junto al titular, como el recuento del menú: «Product (7)» (2026-10-17;
    antes «01»/«02»). Mismo tratamiento: entre paréntesis, en gris y alineado a la altura de la mayúscula. */
function Count({ k }: { k: Side["key"] }) {
  return (
    <sup className="cap-sup ml-[0.12em] t-small font-normal tracking-normal opacity-60">
      <span aria-hidden>({SECTION_COUNT[k]})</span>
      <span className="sr-only">, {SECTION_COUNT[k]} projects</span>
    </sup>
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
    const els = [...half.querySelectorAll<HTMLElement>("[data-slides] [data-slide]")];
    const el = els.sort((a, b) => +getComputedStyle(b).opacity - +getComputedStyle(a).opacity)[0];
    const m = el && getComputedStyle(el).transform;
    const scale = m && m !== "none" ? new DOMMatrixReadOnly(m).a : 1;
    const time = el instanceof HTMLVideoElement ? el.currentTime : undefined;
    startCurtain({ src: el?.dataset.slide ?? s.slides[0], scale, from: BASE, time, at: performance.now() });
    router.push(s.href);
  };
  useEffect(() => {
    const id = requestAnimationFrame(() => setTouch(noHover()));
    return () => cancelAnimationFrame(id);
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
            // Cada mitad en el color de su sección (2026-10-17): Product en negro y Games en blanco, sin línea en medio.
            className={`relative overflow-hidden ${other ? "min-h-0" : "min-h-[50svh] md:min-h-[100svh]"} ${left ? "bg-black text-white" : "bg-white text-black"}`}
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
                // Movimiento reducido (F3): sin mitad que crece ni telón, cambio directo de página.
                if (reducedMotion()) return router.push(s.href);
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
                animate={{ opacity: off ? 0.18 : 1 }} // la mitad no elegida casi se funde con el fondo
                transition={{ duration: inOrOut(off), ease: EASE.inOut }}
              >
                {/* Titulares juntos en el centro de la pantalla, cada uno pegado a la línea central
                    con un pequeño margen: «Product» a su izquierda y «Games» a su derecha. En móvil (mitades
                    apiladas) van a su lado y justo encima de su párrafo, formando un bloque con él (`--ph` = alto
                    del párrafo): Product a la izquierda, Games a la derecha. */}
                <div
                  className={`absolute inset-0 flex justify-center overflow-hidden px-4 md:items-center md:px-0 ${left ? "items-end pb-5 md:justify-end md:pb-0 md:pr-5" : "items-start pt-5 md:justify-start md:pt-0 md:pl-5"}`}
                >
                  {/* Máscara ajustada al titular: entra desde abajo y sale por arriba sin verse fuera. Con el
                      tracking tan cerrado, la última letra se sale de su caja (la «s» de Games se cortaba): el
                      titular lleva 0,1 em de aire a cada lado y la máscara lo compensa con margen negativo, así
                      que la posición no cambia. Por la derecha lleva además 0,055 em, lo que el tracking negativo de
                      `.t-d3` le quita a la última letra: sin eso la caja queda más estrecha que la tinta y, al
                      centrarla, la palabra se ve corrida a la derecha (medido: 1,75 px a 390). */}
                  <div className="-mx-[0.1em] overflow-hidden pb-[0.06em] t-d3">
                    <motion.p
                      className="flex items-center whitespace-nowrap pl-[0.1em] pr-[0.155em] t-d3"
                      initial={{ y: "110%" }}
                      // Al elegir, los dos titulares se van con la máscara del borde (como la imagen): la
                      // mitad crece ya sin texto y el nombre no reaparece en el telón ni en la home.
                      animate={chosen ? { y: "0%", clipPath: exitClip(chosen, stacked) } : { y: "0%", clipPath: OPEN }}
                      transition={chosen ? EXIT : { duration: DUR.base, ease: EASE.inOut, delay: (1 + i) * STAGGER }}
                    >
                      {/* Número pequeño centrado con el titular: delante de la P de «Product» y detrás de
                          la s de «Games» (antes iba repetido abajo como «01 — Product»). */}
                      {/* En un span: dentro del flex, el número se alinea con la línea base de la palabra. */}
                      <span>
                        {s.label}
                        <Count k={s.key} />
                      </span>
                    </motion.p>
                  </div>
                </div>
                {/* Ancho: dos columnas y media de la rejilla (con 3 una frase quedaba en 2 líneas y con 2 pasaban a 4). Párrafo desplazado abajo, en el lado exterior (en espejo); solo al pasar por
                    encima (en táctil, siempre). */}
                <motion.div
                  data-para
                  className={`absolute bottom-6 hidden md:bottom-8 md:w-[calc((100vw-312px)/12*2.5+48px)] md:block ${left ? "left-4 md:left-6" : "right-4 md:right-6"}`}
                  initial={false}
                  animate={chosen ? { clipPath: exitClip(chosen, stacked), opacity: 1, y: 0 } : { clipPath: OPEN, opacity: on ? 1 : 0, y: on ? 0 : 16 }}
                  transition={chosen ? EXIT : { duration: inOrOut(on), ease: EASE.out, delay: on ? STAGGER : 0 }}
                >
                  <p
                    lang="en"
                    className={`hyphens-auto text-justify t-small ${left ? "[text-align-last:left]" : "[text-align-last:right]"}`}
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
