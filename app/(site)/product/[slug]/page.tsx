import { caseMetadata, paramsFor, renderCase } from "@/lib/maqueta/case-route";

// Casos con plantilla de Product: /product/<slug> (lib/maqueta/case-route.tsx).
export function generateStaticParams() {
  return paramsFor("product");
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  return caseMetadata((await params).slug);
}

export default async function ProductCasePage({ params }: { params: Promise<{ slug: string }> }) {
  return renderCase((await params).slug, "product");
}
