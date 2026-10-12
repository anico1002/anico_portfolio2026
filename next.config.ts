import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
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
    return [{ source: "/", destination: "/maqueta", permanent: false }];
  },
  outputFileTracingExcludes: {
    "*": [
      "./public/projects/**/*",
      "./public/hero-imgs/**/*",
    ],
  },
};

export default nextConfig;
