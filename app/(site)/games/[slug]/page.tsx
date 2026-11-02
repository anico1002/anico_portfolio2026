import { caseMetadata, paramsFor, renderCase } from "@/lib/maqueta/case-route";

// Casos con plantilla de Games: /games/<slug> (lib/maqueta/case-route.tsx).
export function generateStaticParams() {
  return paramsFor("games");
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  return caseMetadata((await params).slug);
}

export default async function GamesCasePage({ params }: { params: Promise<{ slug: string }> }) {
  return renderCase((await params).slug, "games");
}
