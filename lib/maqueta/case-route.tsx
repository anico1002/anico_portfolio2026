import "server-only";
import { notFound } from "next/navigation";
import CaseTemplate from "@/components/case-study/CaseTemplate";
import GamesTemplate from "@/components/case-study/GamesTemplate";
import { BESPOKE, CASES, caseBySlug, urlSection } from "@/lib/maqueta/cases";
import { getCaseMedia, getGameBlocks, moreCases } from "@/lib/maqueta/media";
import { GAMES_INTRO, pageMeta, productIntro } from "@/lib/maqueta/meta";

/* Casos con plantilla, en /product/<slug> (Product y Marca y web) y /games/<slug>: las dos rutas
   (app/(site)/product/[slug] y games/[slug]) comparten esto. Product: caso de éxito (CaseTemplate). Games y Marca y
   web: escaparate gráfico (GamesTemplate, lib/maqueta/games.ts). Los que tienen página propia (BESPOKE) no se
   generan aquí para no duplicar rutas. */
export type UrlSection = "product" | "games";

export const paramsFor = (section: UrlSection) =>
  CASES.filter((c) => !BESPOKE.has(c.slug) && urlSection(c.slug) === section).map((c) => ({ slug: c.slug }));

export function caseMetadata(slug: string) {
  const c = caseBySlug(slug);
  return c ? pageMeta(c.name, { slug, description: c.section === "games" ? GAMES_INTRO : productIntro() }) : {};
}

export function renderCase(slug: string, section: UrlSection) {
  const copy = caseBySlug(slug);
  const media = copy && getCaseMedia(copy);
  // Cada caso solo en su sección: /product/asphalt-9 no existe (en desarrollo se podría pedir a mano).
  if (!copy || !media || urlSection(slug) !== section) notFound();
  const nextCard = moreCases(slug);
  // Games y «Marca y web» (2026-10-15): escaparate vertical si el caso tiene bloques en games.ts.
  const blocks = getGameBlocks(slug);
  if (blocks) return <GamesTemplate copy={copy} media={media} blocks={blocks} next={nextCard} />;
  return <CaseTemplate copy={copy} media={media} next={nextCard} />;
}
