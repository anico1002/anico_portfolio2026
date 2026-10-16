import "server-only";
import fs from "fs";
import path from "path";
import { getScannedProject } from "@/lib/scan-project";
import { caseBySlug, casesIn, productInOrder, type CaseCopy } from "./cases";
import { GAME_BLOCKS } from "./games";

/* Medios de un caso de la maqueta a partir de public/projects/<slug>/ (los de la web
   actual), repartidos por capítulos y con sus medidas: las láminas llevan texto pegado al
   borde, así que se maquetan a su proporción natural y nunca se recortan. */

export type MediaItem =
  | { type: "img"; src: string; w: number; h: number }
  | { type: "slides"; srcs: string[]; w: number; h: number }
  | { type: "video"; src: string };

export type CaseMedia = {
  thumb: string;
  hero?: { src: string; video: boolean };
  phone?: { src: string; video: boolean; ratio: string; bg?: string };
  chapters: MediaItem[][];
  /** Capítulos que sobran (secciones sin texto en el contenido): su título de carpeta. */
  extraTitles: string[];
};

/** Ancho y alto leyendo solo la cabecera (PNG, JPEG, GIF, WebP). */
function dims(publicUrl: string): { w: number; h: number } {
  const file = path.join(process.cwd(), "public", decodeURIComponent(publicUrl));
  const b = fs.readFileSync(file);
  if (b.readUInt32BE(0) === 0x89504e47) return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
  if (b.toString("ascii", 0, 3) === "GIF") return { w: b.readUInt16LE(6), h: b.readUInt16LE(8) };
  if (b.toString("ascii", 8, 12) === "WEBP") {
    const chunk = b.toString("ascii", 12, 16);
    if (chunk === "VP8X") return { w: 1 + b.readUIntLE(24, 3), h: 1 + b.readUIntLE(27, 3) };
    if (chunk === "VP8 ") return { w: b.readUInt16LE(26) & 0x3fff, h: b.readUInt16LE(28) & 0x3fff };
    const bits = b.readUInt32LE(21);
    return { w: (bits & 0x3fff) + 1, h: ((bits >> 14) & 0x3fff) + 1 };
  }
  // JPEG: recorrer marcadores hasta un SOF.
  let i = 2;
  while (i < b.length) {
    const marker = b[i + 1];
    const len = b.readUInt16BE(i + 2);
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker))
      return { h: b.readUInt16BE(i + 5), w: b.readUInt16BE(i + 7) };
    i += 2 + len;
  }
  return { w: 16, h: 9 };
}

const toItem = (x: string | string[]): MediaItem =>
  Array.isArray(x) ? { type: "slides", srcs: x, ...dims(x[0]) } : { type: "img", src: x, ...dims(x) };

export function getCaseMedia(copy: CaseCopy): CaseMedia | null {
  const s = getScannedProject(copy.slug);
  if (!s) return null;

  const hero = copy.hero
    ? { src: copy.hero, video: /\.(mp4|webm|mov)$/i.test(copy.hero) }
    : s.heroVideo
    ? { src: s.heroVideo, video: true }
    : s.heroImage
      ? { src: s.heroImage, video: false }
      : undefined;

  const phone = s.phoneMockup && {
    src: s.phoneMockup.mediaUrl,
    video: s.phoneMockup.isVideo,
    ratio: copy.phoneRatio ?? "393/852",
    bg: s.phoneMockup.bgUrl,
  };

  let groups: MediaItem[][];
  let extraTitles: string[] = [];
  if (s.sections.length) {
    groups = s.sections.map((sec) => [
      ...sec.images.map(toItem),
      ...(sec.videos ?? []).map((src): MediaItem => ({ type: "video", src })),
    ]);
    extraTitles = s.sections.slice(copy.chapters.length).map((sec) => sec.title ?? "");
  } else {
    // Sin subcarpetas: cada capítulo se lleva `take` grupos; lo que sobre, al último.
    const all = s.images.map(toItem);
    groups = [];
    let at = 0;
    copy.chapters.forEach((c, i) => {
      const n = i === copy.chapters.length - 1 ? all.length - at : (c.take ?? 0);
      groups.push(all.slice(at, at + n));
      at += n;
    });
  }

  return { thumb: copy.thumb ?? s.thumbnail, hero, phone, chapters: groups, extraTitles };
}

/** Miniatura de un caso cualquiera (Gloop incluido) para «Siguiente caso». */
export function thumbOf(slug: string): string | undefined {
  if (slug === "gloop") return "/maqueta/gloop/media/hero-mock.mp4";
  return caseBySlug(slug)?.thumb ?? (getScannedProject(slug)?.thumbnail || undefined);
}

/* ── Games: escaparate gráfico (lib/maqueta/games.ts) ─────────────────────────────────────── */

export type GameMedia =
  | { type: "img"; src: string; w: number; h: number; cropTop?: number; cropLeft?: number; bg?: string }
  | { type: "slides"; srcs: string[]; w: number; h: number }
  | { type: "video"; src: string };

export type ResolvedGameBlock = { eyebrow?: string; title?: string; body?: string; bleed?: boolean; items: GameMedia[] };

/** Los bloques de un juego con la URL y las medidas de cada lámina. Lo que no exista en disco se
    salta (y se avisa en el servidor) en lugar de romper la página. */
export function getGameBlocks(slug: string): ResolvedGameBlock[] | null {
  const plan = GAME_BLOCKS[slug];
  if (!plan) return null;
  // Rutas relativas a public/projects/<slug>/, o absolutas desde public/ si empiezan por «/».
  const rel = (p: string) => (p.startsWith("/") ? p : `/projects/${slug}/${p}`);
  const url = (p: string) => encodeURI(rel(p));
  const exists = (p: string) => {
    const ok = fs.existsSync(path.join(process.cwd(), "public", rel(p)));
    if (!ok) console.warn(`[games] falta ${slug}/${p}`);
    return ok;
  };
  return plan.map((b) => ({
    ...b,
    items: b.items.flatMap((it): GameMedia[] => {
      if (Array.isArray(it)) {
        const srcs = it.filter(exists).map(url);
        return srcs.length ? [{ type: "slides", srcs, ...dims(srcs[0]) }] : [];
      }
      if (typeof it === "string") {
        if (!exists(it)) return [];
        if (/\.(mp4|webm|mov)$/i.test(it)) return [{ type: "video", src: url(it) }];
        return [{ type: "img", src: url(it), ...dims(url(it)) }];
      }
      return exists(it.src) ? [{ type: "img", src: url(it.src), ...dims(url(it.src)), cropTop: it.crop?.top, cropLeft: it.crop?.left, bg: it.bg }] : [];
    }),
  }));
}

/* ── Final de los casos: carrusel de proyectos (CaseEnd, 2026-10-16) ──────────────────────────── */

export type MoreItem = { name: string; href: string; thumb?: string; year: string };

/** Los proyectos de la misma sección que el caso (Product + Marca y web, o Games), empezando por el
    siguiente y sin el propio caso. Solo los que tienen página. */
export function moreCases(slug: string): { items: MoreItem[]; all: { label: string; href: string } } {
  const section = caseBySlug(slug)?.section ?? "product";
  const games = section === "games";
  const list: MoreItem[] = (
    games
      ? casesIn("games")
      : [{ name: "Gloop", slug: "gloop", year: "2026" } as Pick<CaseCopy, "name" | "slug" | "year">, ...productInOrder(), ...casesIn("brand")]
  ).map((c) => ({ name: c.name, href: `/maqueta/${c.slug}`, thumb: thumbOf(c.slug), year: c.year }));
  const i = list.findIndex((x) => x.href === `/maqueta/${slug}`);
  const items = [...list.slice(i + 1), ...list.slice(0, Math.max(0, i))];
  return { items, all: games ? { label: "Ver todos los juegos", href: "/maqueta/games" } : { label: "Ver todos los proyectos", href: "/maqueta/home" } };
}
export type MoreCases = ReturnType<typeof moreCases>;
