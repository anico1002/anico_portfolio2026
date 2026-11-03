export const dynamic = "force-static";
import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/maqueta/meta";

// Web pública desde el 2026-11-02 (antes, enlace privado en /new con todo bloqueado): abierta a los buscadores y a
// los de IA (GEO). Fuera solo las tipografías con licencia, que no son contenido.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/fonts-licencia/", "/no-contar/"] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
