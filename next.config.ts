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
  outputFileTracingExcludes: {
    "*": ["./public/**/*"],
  },
};

export default nextConfig;
