import { Geist } from "next/font/google";

/* Tokens reales de Gloop (lib/theme.ts del repo Gloop-app = GloopColor.swift del nativo), para recrear
   piezas de la app dentro del caso sin usar capturas. Solo los que hacen falta aquí. */

export const G = {
  base: "#0B0613",
  surface: "#140C20",
  brand: "#9F4AFA", // en directo · la voz de Gloop
  brandDeep: "#5200CD",
  accent: "#FA0D50", // algo te espera (y el logo)
  lime: "#C5E621", // lo tuyo
  magenta: "#C616E9",
  cyan: "#16D4E9",
  danger: "#F5343A", // irreversible
  fill6: "rgba(255,255,255,0.06)",
  fill8: "rgba(255,255,255,0.08)",
  fill15: "rgba(255,255,255,0.15)",
  text70: "rgba(255,255,255,0.7)",
  text50: "rgba(255,255,255,0.5)",
} as const;

/** Geist, la tipografía de la app (una sola variable, titulares a 800). Solo para las piezas recreadas. */
export const geist = Geist({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-gloop", preload: false });
