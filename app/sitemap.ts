export const dynamic = "force-static";
import type { MetadataRoute } from "next";
import { BESPOKE, CASES, caseHref } from "@/lib/maqueta/cases";
import { getCaseMedia } from "@/lib/maqueta/media";
import { SITE_URL } from "@/lib/maqueta/meta";

// Las páginas que existen de verdad (2026-11-02): portada, las dos secciones y cada caso publicado — los de página
// propia y los de plantilla que tienen medios (sin ellos la plantilla no se genera). Las URLs llevan barra final,
// como las sirve el export. deploy/build.mjs comprueba que cada una exista en el paquete.
export default function sitemap(): MetadataRoute.Sitemap {
  const slugs = [...BESPOKE, ...CASES.filter((c) => !BESPOKE.has(c.slug) && getCaseMedia(c)).map((c) => c.slug)];
  const url = (path: string) => `${SITE_URL}${path === "/" ? "/" : `${path}/`}`;
  return [
    { url: url("/"), changeFrequency: "monthly", priority: 1 },
    { url: url("/product"), changeFrequency: "monthly", priority: 0.9 },
    { url: url("/games"), changeFrequency: "monthly", priority: 0.9 },
    ...slugs.map((s) => ({ url: url(caseHref(s)), changeFrequency: "yearly" as const, priority: 0.8 })),
  ];
}
