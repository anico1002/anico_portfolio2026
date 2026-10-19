/* Metadatos de la web nueva (auditoría 2026-10-19). Fuera de buscadores (enlace privado, memoria
   «produccion-anico-new»), pero con título, descripción e imagen propios: es lo que sale al pegar el enlace en
   WhatsApp, LinkedIn o un email. Antes heredaba la tarjeta de la web vieja y títulos internos («Gloop · maqueta»).
   Las descripciones son los textos de entrada de cada home, no copy nuevo. */
import type { Metadata } from "next";
import { yearsOfExperience } from "@/lib/maqueta/years";
import { thumbOf } from "@/lib/maqueta/media";

export const SITE_URL = "https://anico.design";
export const productIntro = () => `${yearsOfExperience()}+ years designing interfaces, now with AI as a building tool. Strategy, UX/UI, design systems and prototypes you can touch.`;
export const GAMES_INTRO =
  "Over a decade shaping how millions of players navigate, compete and stay hooked. Game UI/UX for leading studios, from first concept to worldwide launch.";

const posterOf = (src: string) => src.replace(/\.mp4$/i, "-poster.jpg"); // como en LazyVideo (módulo de cliente)
const OG = { url: "/maqueta/og.jpg", width: 1200, height: 630, alt: "anico — Product & Game Design" };

// noindex en todas sus formas; las imágenes y los vídeos los cubre además la cabecera X-Robots-Tag (next.config.ts).
const robots: Metadata["robots"] = {
  index: false,
  follow: false,
  nocache: true,
  googleBot: { index: false, follow: false, noimageindex: true, "max-snippet": 0 },
};

// Función y no constante: los años suben solos y las páginas se regeneran a diario (lib/maqueta/years.ts).
export const siteMeta = (): Metadata => ({
  metadataBase: new URL(SITE_URL),
  title: { default: "anico — Product & Game Design", template: "%s — anico" },
  description: productIntro(),
  robots,
  alternates: { canonical: null },
  openGraph: { type: "website", siteName: "anico", locale: "en_US", title: "anico — Product & Game Design", description: productIntro(), images: [OG] },
  twitter: { card: "summary_large_image", title: "anico — Product & Game Design", description: productIntro(), images: [OG.url] },
});

/** Página de sección o de caso: su título y, en los casos, el primer fotograma de su miniatura como imagen. */
export function pageMeta(title: string, { slug, description = productIntro() }: { slug?: string; description?: string } = {}): Metadata {
  const thumb = slug ? thumbOf(slug) : undefined;
  const image = thumb ? (/\.mp4$/i.test(thumb) ? posterOf(thumb) : thumb) : OG.url;
  const full = `${title} — anico`;
  return {
    title,
    description,
    openGraph: { type: "website", siteName: "anico", locale: "en_US", title: full, description, images: [image] },
    twitter: { card: "summary_large_image", title: full, description, images: [image] },
  };
}
