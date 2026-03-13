import "server-only";
import fs from "fs";
import path from "path";
import { parseContent, type ContentLink, type ContentStat, type ContentMeta, type ContentTextBlock, type ContentButton } from "./parse-content";
import { projects, type Project } from "./projects";

const IMAGE_EXTS = /\.(jpg|jpeg|png|gif|webp|avif)$/i;

export interface ScannedSection {
  title?: string;
  images: (string | string[])[];
}

export interface ScannedProject {
  thumbnail: string;
  /** Hero image for project page: file named *_hero.(png|jpg|...) in project root */
  heroImage?: string;
  /** Sections with titles (populated when sub-folders exist) */
  sections: ScannedSection[];
  /** Flat image list — fallback / used by hero floating cards */
  images: (string | string[])[];
  links: ContentLink[];
  stats: ContentStat[];
  /** CTA button from [button] in content.txt (download / visit web) */
  ctaButton?: ContentButton;
  /** Parsed key:value metadata from content.txt */
  meta: ContentMeta;
  /** Default-locale text blocks from content.txt */
  text: ContentTextBlock;
  /** Locale-variant text blocks, e.g. locales.es.overview */
  locales: Record<string, ContentTextBlock>;
}

/* ── helpers ─────────────────────────────────────────────────── */

function isImage(name: string) {
  return IMAGE_EXTS.test(name);
}

/**
 * Numeric position for sorting. Supports:
 * - AXT6_1.png → 6 (position), letter "1"
 * - dk_01.png, dk_05a.png → 1, 5
 * - MC1.png, MC2a.png → 1, 2 (no underscore before number)
 */
function imgNum(name: string): number {
  const m1 = name.match(/_(\d+)_(\d+)\./i);
  if (m1) return parseInt(m1[1], 10);
  const m2 = name.match(/_(\d+)([a-z])?\./i);
  if (m2) return parseInt(m2[1], 10);
  const m3 = name.match(/(\d+)([a-z])?\.(?:png|jpe?g|gif|webp|avif)$/i);
  if (m3) return parseInt(m3[1], 10);
  return 9999;
}

/** Letter/sub index for ordering same-number group (1a,1b or 6_1,6_2). */
function imgLetter(name: string): string {
  const m1 = name.match(/_(\d+)_(\d+)\./i);
  if (m1) return m1[2];
  const m2 = name.match(/_(\d+)([a-z])\./i);
  if (m2) return m2[2].toLowerCase();
  const m3 = name.match(/(\d+)([a-z])\.(?:png|jpe?g|gif|webp|avif)$/i);
  if (m3) return m3[2].toLowerCase();
  return "";
}

/**
 * Given a directory and a URL prefix, reads image files and groups
 * same-numbered files (a, b, c…) into fade-slider arrays.
 */
function buildImageList(dir: string, urlPrefix: string): (string | string[])[] {
  const files = fs.readdirSync(dir)
    .filter((f) => isImage(f) && !f.replace(IMAGE_EXTS, "").endsWith("_thumb") && !f.replace(IMAGE_EXTS, "").endsWith("_hero"));

  // Group by numeric position
  const groups = new Map<number, string[]>();
  for (const f of files) {
    const n = imgNum(f);
    if (!groups.has(n)) groups.set(n, []);
    groups.get(n)!.push(f);
  }

  return Array.from(groups.entries())
    .sort(([a], [b]) => a - b)
    .map(([, group]) => {
      const sorted = group.sort((a, b) =>
        imgLetter(a).localeCompare(imgLetter(b))
      );
      const urls = sorted.map((f) => `${urlPrefix}/${f}`);
      return urls.length === 1 ? urls[0] : urls;
    });
}

/* ── main export ─────────────────────────────────────────────── */

export function getScannedProject(slug: string): ScannedProject | null {
  const projectDir = path.join(process.cwd(), "public", "projects", slug);
  if (!fs.existsSync(projectDir)) return null;

  const urlBase = `/projects/${slug}`;
  const allEntries = fs.readdirSync(projectDir);

  /* ── Thumbnail ── */
  const thumbFile = allEntries
    .filter((f) => isImage(f) && f.replace(IMAGE_EXTS, "").endsWith("_thumb"))
    .sort()[0];
  const thumbnail = thumbFile ? `${urlBase}/${thumbFile}` : "";

  /* ── Hero image (xxx_hero.png en la raíz de la carpeta del proyecto) ── */
  const heroFile = allEntries
    .filter((f) => isImage(f) && f.replace(IMAGE_EXTS, "").endsWith("_hero"))
    .sort()[0];
  const heroImage = heroFile ? `${urlBase}/${heroFile}` : undefined;

  /* ── content.txt ── */
  const contentPath = path.join(projectDir, "content.txt");
  const parsed = fs.existsSync(contentPath)
    ? parseContent(fs.readFileSync(contentPath, "utf-8"))
    : null;

  /* ── Sections (sub-folders named NN_Title) ── */
  const subDirs = allEntries
    .filter((f) => {
      if (!fs.statSync(path.join(projectDir, f)).isDirectory()) return false;
      return /^\d/.test(f); // must start with a digit
    })
    .sort();

  let sections: ScannedSection[] = [];
  let images: (string | string[])[] = [];

  if (subDirs.length > 0) {
    sections = subDirs.map((dir) => {
      // "01_Game-UI" → "Game UI"
      const title = dir.replace(/^\d+[-_]?/, "").replace(/[-_]/g, " ").trim() || undefined;
      const sectionDir = path.join(projectDir, dir);
      const imgs = buildImageList(sectionDir, `${urlBase}/${dir}`);
      return { title, images: imgs };
    });
    images = sections.flatMap((s) => s.images);
  } else {
    images = buildImageList(projectDir, urlBase);
  }

  return {
    thumbnail,
    heroImage,
    sections,
    images,
    links:     parsed?.links     ?? [],
    stats:     parsed?.stats     ?? [],
    ctaButton: parsed?.button,
    meta:      parsed?.meta      ?? {},
    locales:   parsed?.locales   ?? {},
    text: {
      overview:  parsed?.overview,
      challenge: parsed?.challenge,
      process:   parsed?.process,
      outcome:   parsed?.outcome,
    },
  };
}

/**
 * Constructs a minimal Project object from a ScannedProject.
 * Used for folders that have no matching entry in projects.ts.
 */
export function buildProjectFromScanned(slug: string, scanned: ScannedProject): Project {
  const m = scanned.meta;
  const deliverables = m.deliverables ? m.deliverables.split(",").map((s) => s.trim()) : [];
  const tags         = m.tags         ? m.tags.split(",").map((s) => s.trim())         : [];

  return {
    id:           0,
    slug,
    index:        String(m.order ?? 99).padStart(2, "0"),
    name:         m.name      ?? slug,
    subtitle:     m.subtitle  ?? "",
    client:       m.client    ?? "",
    category:     m.category  ?? "",
    year:         m.year      ?? "",
    role:         m.role      ?? "",
    deliverables,
    tags,
    description:  m.subtitle  ?? "",
    size:         "regular",
    aspectRatio:  m.aspect_ratio ?? "4/3",
    palette:      1,
    thumbnail:    scanned.thumbnail,
    heroImage:    scanned.heroImage,
    images:       scanned.images,
    sections:     scanned.sections.length ? scanned.sections : undefined,
    links:        scanned.links.length    ? scanned.links    : undefined,
    overview:       scanned.text.overview  ?? "",
    challenge:      scanned.text.challenge ?? "",
    process:        scanned.text.process   ?? "",
    outcome:        scanned.text.outcome   ?? "",
    stats:          scanned.stats,
    ctaButton:      scanned.ctaButton,
    localizations:  Object.keys(scanned.locales).length ? scanned.locales : undefined,
  };
}

/** Returns slugs of all folders in public/projects/ that contain a content.txt */
export function discoverProjectSlugs(): string[] {
  const dir = path.join(process.cwd(), "public", "projects");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => {
      const full = path.join(dir, f);
      return (
        fs.statSync(full).isDirectory() &&
        fs.existsSync(path.join(full, "content.txt"))
      );
    });
}

/** Slugs of projects to hide from the portfolio (home and project list). */
const DISABLED_PROJECT_SLUGS = ["fundfy", "some-logos", "telepport"];

/** Same enriched list as home: hardcoded projects + scanned data + discovered folders, sorted by index. */
export function getEnrichedProjects(): Project[] {
  const enriched: Project[] = projects.map((p) => {
    const scanned = getScannedProject(p.slug);
    if (!scanned) return p;
    return {
      ...p,
      thumbnail: scanned.thumbnail || p.thumbnail,
      heroImage: scanned.heroImage ?? p.heroImage,
      images:    scanned.images.length    ? scanned.images    : p.images,
      sections:  scanned.sections.length  ? scanned.sections  : undefined,
      links:     scanned.links.length     ? scanned.links     : p.links,
      ctaButton: scanned.ctaButton ?? p.ctaButton,
      stats:         scanned.stats,
      overview:      scanned.text.overview  ?? p.overview,
      challenge:     scanned.text.challenge ?? p.challenge,
      process:       scanned.text.process   ?? p.process,
      outcome:       scanned.text.outcome   ?? p.outcome,
      localizations: Object.keys(scanned.locales).length > 0 ? { ...p.localizations, ...scanned.locales } : p.localizations,
    };
  });
  const hardcodedSlugs = new Set(projects.map((p) => p.slug));
  for (const slug of discoverProjectSlugs()) {
    if (hardcodedSlugs.has(slug)) continue;
    const scanned = getScannedProject(slug);
    if (scanned) enriched.push(buildProjectFromScanned(slug, scanned));
  }
  enriched.sort((a, b) => {
    const oa = a.index ? parseInt(a.index) : 99;
    const ob = b.index ? parseInt(b.index) : 99;
    return oa - ob;
  });
  return enriched.filter((p) => !DISABLED_PROJECT_SLUGS.includes(p.slug));
}
