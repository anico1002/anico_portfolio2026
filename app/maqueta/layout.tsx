import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import SmoothScroll from "@/components/case-study/SmoothScroll";

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

export default function MaquetaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${sans.variable} ${mono.variable}`}>
      {/* `overflow-x: hidden` global convierte html/body en contenedor de scroll y rompe
          `position: sticky`; `clip` recorta igual sin romperlo. Y `scroll-behavior: smooth`
          global pelea con Lenis: aquí lo apagamos. */}
      <style>{`html, body { overflow-x: clip; } html { scroll-behavior: auto; }`}</style>
      <SmoothScroll />
      {children}
    </div>
  );
}
