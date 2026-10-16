import { IBM_Plex_Mono, IBM_Plex_Serif } from "next/font/google";

/* Tokens de Interactius (lib/tokens.ts del repo interactius-brandguidelines) para recrear sus piezas dentro del
   caso, pero en neutro: la página juega con blanco y negro, así que el beige y los grises cálidos de la marca
   pasan a grises puros (feedback de Alberto, 2026-10-17). Los acentos siguen ligados a cada servicio. */

export const IX = {
  dark: "#0A0A0A",
  white: "#FFFFFF",
  grey: "#EBEBEB",
  light: "#F3F3F3",
  mid: "#E0E0E0",
  ash: "#737373",
  ashDark: "#404040",
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
