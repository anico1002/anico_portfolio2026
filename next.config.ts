import type { NextConfig } from "next";
import { BESPOKE, CASES, caseHref } from "./lib/maqueta/cases";
import OLD from "./lib/maqueta/rutas-viejas.json";

// Cabeceras (auditoría 2026-10-19).
// - Seguridad básica para todo el sitio. Sin CSP estricta: hay scripts y estilos en línea (tema antes de pintar,
//   PhoneMockup), y una CSP con 'unsafe-inline' apenas protege; frame-ancestors sí, para que nadie la incruste.
// - Desde el 2026-11-02 la web es pública y se indexa; solo las tipografías con licencia quedan fuera de buscadores.
// - Caché de medios: un día y revalidación en segundo plano una semana. No `immutable`: los nombres no llevan hash
//   y a veces se rehace un archivo con el mismo nombre.
const SECURITY = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'; base-uri 'self'; object-src 'none'" },
];
const NOINDEX = [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive, noimageindex" }];
const MEDIA_CACHE = [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }];

// Export estático para servir la web nueva en un Apache (MindYourGap), fuera de Vercel.
// `EXPORT_STATIC=1 npm run build` → carpeta `out/`. En ese modo no hay optimizador de imágenes
// ni cabeceras/redirecciones de Next (no se soportan en export): todo eso lo pone el `.htaccess`.
const EXPORT = process.env.EXPORT_STATIC === "1";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // `trailingSlash` solo en export: genera `new/product/index.html` y Apache sirve `/new/product/`
  // con su DirectoryIndex sin reescrituras. En Vercel se deja como está (sin barra final).
  ...(EXPORT ? { output: "export" as const, trailingSlash: true } : {}),
  async headers() {
    if (EXPORT) return [];
    return [
      { source: "/:path*", headers: SECURITY },
      // El prototipo de DesignOps Copilot se navega dentro de la pantalla de su caso (iframe del mismo dominio,
      // 2026-11-01): solo esa carpeta se deja incrustar, y solo desde aquí. Va después: pisa la cabecera general.
      {
        source: "/maqueta/designops/app/:path*",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Content-Security-Policy", value: "frame-ancestors 'self'; base-uri 'self'; object-src 'none'" },
        ],
      },
      { source: "/fonts-licencia/:path*", headers: NOINDEX },
      ...["/maqueta/:path*", "/opt/:path*", "/fonts-licencia/:path*"].map((source) => ({ source, headers: MEDIA_CACHE })),
    ];
  },
  images: {
    // Apache no tiene el optimizador de Next: en export las imágenes se sirven tal cual.
    unoptimized: EXPORT,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "anico.es",
      },
    ],
  },
  // Redirecciones de URLs viejas y atajos (2026-11-02), para desarrollo y Vercel. En el hosting (export estático) las
  // escribe deploy/build.mjs en el .htaccess con la misma lógica. Atajo de cada caso: /gloop → /product/gloop.
  async redirects() {
    if (EXPORT) return [];
    const slugs = [...new Set([...BESPOKE, ...CASES.map((c) => c.slug)])];
    const to = (source: string, destination: string) => ({ source, destination, permanent: true });
    return [
      to("/new", "/"),
      to("/new/:section(product|games)", "/:section"),
      ...slugs.flatMap((s) => [to(`/${s}`, caseHref(s)), to(`/new/${s}`, caseHref(s)), to(`/proyecto/${s}`, caseHref(s))]),
      ...Object.entries(OLD).filter(([k]) => k.startsWith("/")).map(([k, v]) => to(k, v)),
      to("/proyecto/:slug", "/product"),
      to("/new/:path*", "/:path*"),
    ];
  },
  // El prototipo exportado de DesignOps Copilot (public/maqueta/designops/app) pide sus páginas como carpetas
  // (`/health/`) y sus datos como `/health/index.txt`. Apache y Cloudflare sirven el index.html de cada carpeta
  // solos; Next en desarrollo y en Vercel no, así que se lo indicamos aquí (2026-11-01).
  async rewrites() {
    if (EXPORT) return [];
    return [
      // Van detrás de los archivos de public/ (afterFiles): solo entran cuando la ruta no es un archivo real.
      { source: "/maqueta/designops/app", destination: "/maqueta/designops/app/index.html" },
      { source: "/maqueta/designops/app/:path*", destination: "/maqueta/designops/app/:path*/index.html" },
    ];
  },
  outputFileTracingExcludes: {
    "*": [
      "./public/projects/**/*",
      "./public/hero-imgs/**/*",
    ],
  },
};

export default nextConfig;
