import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import SmoothScroll from "@/components/case-study/SmoothScroll";
import FlightLayer from "@/components/case-study/Flight";
import CurtainLayer from "@/components/case-study/Curtain";
import PortalLayer from "@/components/case-study/Portal";
import "./system.css";

// Maqueta de caso de estudio: Geist para todo (elegida frente a Inter y Bricolage,
// 2026-10-11) y Geist Mono para antetítulos y etiquetas. Nada de esto toca el resto
// del portfolio.
const sans = Geist({ variable: "--font-case-sans", subsets: ["latin"] });

const mono = Geist_Mono({
  variable: "--font-case-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Maqueta · caso de estudio",
  robots: { index: false, follow: false },
};

// Fondo negro/blanco con selector sol/luna en el menú (2026-10-12; antes cada caso
// tenía su color). Los colores salen de estas variables; las páginas no fijan ninguno.
const themes = `
  #case-root, #case-root[data-case-theme="dark"] {
    --case-bg: #0A0A0B; --case-fg: #F4F4F5;
    --case-muted: rgba(244,244,245,0.56); --case-line: rgba(244,244,245,0.16); --case-ph: rgba(244,244,245,0.07);
    color-scheme: dark;
  }
  #case-root[data-case-theme="light"] {
    --case-bg: #FFFFFF; --case-fg: #0A0A0B;
    --case-muted: rgba(10,10,11,0.56); --case-line: rgba(10,10,11,0.14); --case-ph: rgba(10,10,11,0.06);
    color-scheme: light;
  }
  body:has(#case-root) { background: #0A0A0B; }
  body:has(#case-root[data-case-theme="light"]) { background: #FFFFFF; }
  #case-root main { transition: background-color var(--dur-base) var(--ease-in-out), color var(--dur-base) var(--ease-in-out); }
`;

// Antes de pintar: la elección guardada o, si no hay, la del sistema. Así no parpadea.
const pick = `(function(){var r=document.getElementById('case-root');try{var t=localStorage.getItem('case-theme');if(t!=='light'&&t!=='dark')t=matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';r.dataset.caseTheme=t}catch(e){}})();`;

export default function MaquetaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div id="case-root" data-case-theme="dark" suppressHydrationWarning className={`${sans.variable} ${mono.variable}`}>
      <script dangerouslySetInnerHTML={{ __html: pick }} />
      {/* `overflow-x: hidden` global convierte html/body en contenedor de scroll y rompe
          `position: sticky`; `clip` recorta igual sin romperlo. Y `scroll-behavior: smooth`
          global pelea con Lenis: aquí lo apagamos. */}
      <style>{`html, body { overflow-x: clip; } html { scroll-behavior: auto; }${themes}`}</style>
      <SmoothScroll />
      {children}
      {/* Capa de la transición home → caso: vive aquí para sobrevivir al cambio de página. */}
      <FlightLayer />
      {/* Telón de la entrada → home de sección (barrido de abajo arriba al llegar). */}
      <CurtainLayer />
      {/* Transición «portal» de todos los demás enlaces (B1). */}
      <PortalLayer />
    </div>
  );
}
