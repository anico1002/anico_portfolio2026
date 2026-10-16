import type { Metadata } from "next";
import { Bitter, DM_Serif_Display, Familjen_Grotesk, Instrument_Sans, PT_Serif } from "next/font/google";
import SmoothScroll from "@/components/case-study/SmoothScroll";
import PageTheme from "@/components/case-study/PageTheme";
import { THEMES } from "@/lib/maqueta/theme";
import FlightLayer from "@/components/case-study/Flight";
import CurtainLayer from "@/components/case-study/Curtain";
import PortalLayer from "@/components/case-study/Portal";
import Boot from "@/components/case-study/Boot";
import AnimatedFavicon from "@/components/case-study/AnimatedFavicon";
import "./system.css";

// Tipografía de la maqueta (2026-10-12): Instrument Sans para todo y una serif en cursiva para palabras
// destacadas de los titulares (`*palabras*` → `.kw`; desde el 2026-10-13, DM Serif Display). Antes era
// Geist (elegida frente a Inter y Bricolage el 2026-10-11). Los titulillos también van en Instrument
// Sans (`.t-tag`); Geist Mono se quitó. Nada de esto toca el resto del portfolio.
const sans = Instrument_Sans({ variable: "--font-instrument", subsets: ["latin"] });

// Prueba de PP Neue Montreal (Pangram Pangram, 2026-10-15): pasa a ser la sans de toda la maqueta e
// Instrument Sans queda de respaldo. El archivo vive en public/fonts-licencia/ (fuera de git: el repo
// es público y la fuente no se puede redistribuir); si falta, la web sigue en Instrument Sans.
// @font-face en system.css. Volver atrás = quitar "PP Neue Montreal" de --font-case-sans.


// Cursiva de las palabras destacadas: DM Serif Display Italic (2026-10-13, elegida por Alberto entre las
// pruebas del 12). Sustituye a Playfair, que al lado de la sans quedaba demasiado fina, sobre todo en claro.
// Antes se probaron Instrument Serif (estrecha), Playfair, ácido, gris, barras, anchura y otras.
const serif = DM_Serif_Display({ variable: "--font-case-serif", subsets: ["latin"], weight: "400", style: "italic" });

// Tipografías del cambio de las palabras clave (FontFlip, prueba 2026-10-17). Elegidas midiendo contra PP Neue
// Montreal el ancho de «digital products» y la altura de las minúsculas (ancho / altura x): PT Serif 1,06 / 0,98,
// Bitter 1,04 / 1,00 y Familjen Grotesk 1,00 / 0,98. Así no hay saltos ni cambia el peso. Las monos se descartaron:
// todas un 45–50 % más anchas.
const flipSerif = PT_Serif({ variable: "--font-flip-serif", subsets: ["latin"], weight: "400" });
const flipMono = Bitter({ variable: "--font-flip-mono", subsets: ["latin"], weight: "400" });
const flipGrot = Familjen_Grotesk({ variable: "--font-flip-grot", subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  title: "Maqueta · caso de estudio",
  robots: { index: false, follow: false },
  // La «a» fija; AnimatedFavicon la hace rodar por las letras del logo (E5).
  icons: { icon: "/maqueta/favicon.svg" },
};

// Fondo negro/blanco puros. Desde el 2026-10-17, el color lo decide cada página (lib/maqueta/theme.ts); antes había
// un selector sol/luna en el menú (2026-10-12) y antes aún cada caso tenía su color. Los colores salen de estas variables; las páginas no fijan ninguno.
const themes = `
  #case-root { --font-case-sans: "Satoshi", "PP Neue Montreal", var(--font-instrument), sans-serif; }
  #case-root, #case-root[data-case-theme="dark"] {
    --case-bg: #000000; --case-fg: #F4F4F5;
    --case-muted: rgba(244,244,245,0.56); --case-line: rgba(244,244,245,0.16); --case-ph: rgba(244,244,245,0.07);
    color-scheme: dark;
  }
  #case-root[data-case-theme="light"] {
    --case-bg: #FFFFFF; --case-fg: #0A0A0B;
    --case-muted: rgba(10,10,11,0.56); --case-line: rgba(10,10,11,0.14); --case-ph: rgba(10,10,11,0.06);
    color-scheme: light;
  }
  body:has(#case-root) { background: #000000; }
  body:has(#case-root[data-case-theme="light"]) { background: #FFFFFF; }
  /* Sin fundido de fondo: el cambio de color entre páginas queda tapado por la cortinilla o el vuelo. */
`;

// Antes de pintar: el color de la página (lib/maqueta/theme.ts), sin parpadeo. Ya no hay selector sol/luna.
const pick = `(function(){var r=document.getElementById('case-root');var m=${JSON.stringify(THEMES)};var p=location.pathname.replace(/\\/$/,'');r.dataset.caseTheme=m[p]||'dark';try{localStorage.removeItem('case-theme')}catch(e){}})();`;

export default function MaquetaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div id="case-root" data-case-theme="dark" suppressHydrationWarning className={`${sans.variable} ${serif.variable} ${flipSerif.variable} ${flipMono.variable} ${flipGrot.variable}`}>
      <script dangerouslySetInnerHTML={{ __html: pick }} />
      {/* `overflow-x: hidden` global convierte html/body en contenedor de scroll y rompe
          `position: sticky`; `clip` recorta igual sin romperlo. Y `scroll-behavior: smooth`
          global pelea con Lenis: aquí lo apagamos. */}
      <style>{`html, body { overflow-x: clip; } html { scroll-behavior: auto; }${themes}`}</style>
      <SmoothScroll />
      <PageTheme />
      {children}
      {/* Capa de la transición home → caso: vive aquí para sobrevivir al cambio de página. */}
      <FlightLayer />
      {/* Telón de la entrada → home de sección (barrido de abajo arriba al llegar). */}
      <CurtainLayer />
      {/* Transición «portal» de todos los demás enlaces (B1). */}
      <PortalLayer />
      {/* Primera carga: tapa la página hasta que llega la tipografía (D6). */}
      <Boot />
      <AnimatedFavicon />
    </div>
  );
}
