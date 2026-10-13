import { IBM_Plex_Mono, IBM_Plex_Serif } from "next/font/google";

/* Tokens reales de Interactius (lib/tokens.ts del repo interactius-brandguidelines) para recrear sus piezas
   dentro del caso. Cada acento va ligado a un servicio. */

export const IX = {
  dark: "#1C1A17",
  white: "#FFFFFF",
  grey: "#E8E6E3",
  warmLight: "#F5F2ED",
  warmDark: "#E0DAD2",
  ash: "#75706B",
  ashDark: "#46433F",
  opal: "#B0B5B0", // pensamiento estratégico
  bordeaux: "#99335F", // diseño de experiencias (y alerta)
  emerald: "#5999A6", // transformación cultural
} as const;

/** Curva de la marca (lib/motion.ts): expo. */
export const IX_EXPO = [0.16, 1, 0.3, 1] as const;

export const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-ix-mono" });
export const plexSerif = IBM_Plex_Serif({ subsets: ["latin"], weight: ["300", "400"], variable: "--font-ix-serif" });

export const ixFonts = `${plexMono.variable} ${plexSerif.variable}`;
export const mono = { fontFamily: "var(--font-ix-mono), ui-monospace, monospace" } as const;
export const serif = { fontFamily: "var(--font-ix-serif), ui-serif, serif" } as const;
