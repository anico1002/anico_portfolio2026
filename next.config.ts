import type { NextConfig } from "next";
import { BASE } from "./lib/maqueta/base";

// Cabeceras (auditoría 2026-10-19).
// - Seguridad básica para todo el sitio. Sin CSP estricta: hay scripts y estilos en línea (tema antes de pintar,
//   PhoneMockup), y una CSP con 'unsafe-inline' apenas protege; frame-ancestors sí, para que nadie la incruste.
// - La web nueva (/new, y /maqueta mientras exista) es un enlace privado: fuera de buscadores también sus imágenes,
//   vídeos y fuentes, que el <meta name="robots"> no cubre.
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
      ...["/new", "/new/:path*", "/maqueta", "/maqueta/:path*", "/opt/maqueta/:path*", "/fonts-licencia/:path*"].map((source) => ({ source, headers: NOINDEX })),
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
  // Demo de la maqueta (2026-10-12): en el proyecto de Vercel aparte «anico-maqueta» la raíz lleva
  // directamente a /maqueta. En anico.design (otro proyecto) esto no se activa.
  async redirects() {
    if (!process.env.VERCEL_PROJECT_PRODUCTION_URL?.startsWith("anico-maqueta")) return [];
    return [{ source: "/", destination: BASE, permanent: false }];
  },
  outputFileTracingExcludes: {
    "*": [
      "./public/projects/**/*",
      "./public/hero-imgs/**/*",
    ],
  },
};

export default nextConfig;
