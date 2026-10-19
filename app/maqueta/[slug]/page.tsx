import { notFound } from "next/navigation";
import CaseTemplate from "@/components/case-study/CaseTemplate";
import GamesTemplate from "@/components/case-study/GamesTemplate";
import { CASES, caseBySlug } from "@/lib/maqueta/cases";
import { getCaseMedia, getGameBlocks, moreCases } from "@/lib/maqueta/media";
import { GAMES_INTRO, pageMeta, productIntro } from "@/lib/maqueta/meta";

/* Casos de la maqueta salvo Gloop (que tiene página propia en /maqueta/gloop). Product:
   caso de éxito (CaseTemplate). Games y Marca y web: escaparate gráfico (GamesTemplate, lib/maqueta/games.ts). */

// Casos con página propia (ruta fija, que manda sobre esta): no se generan aquí para no duplicar rutas.
// El Reto pasó a proyecto vertical el 2026-10-15 (su página a medida queda en app/maqueta/_elreto-a-medida,
// carpeta privada que Next no publica).
const BESPOKE = new Set(["swift-project", "interactius", "7news", "dovla", "wineup"]);

export function generateStaticParams() {
  return CASES.filter((c) => !BESPOKE.has(c.slug)).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = caseBySlug(slug);
  return c ? pageMeta(c.name, { slug, description: c.section === "games" ? GAMES_INTRO : productIntro() }) : {};
}

export default async function CasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const copy = caseBySlug(slug);
  const media = copy && getCaseMedia(copy);
  if (!copy || !media) notFound();
  const nextCard = moreCases(slug);
  // Games y «Marca y web» (2026-10-15): escaparate vertical si el caso tiene bloques en games.ts.
  const blocks = getGameBlocks(slug);
  if (blocks) return <GamesTemplate copy={copy} media={media} blocks={blocks} next={nextCard} />;
  return <CaseTemplate copy={copy} media={media} next={nextCard} />;
}
