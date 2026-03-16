import "server-only";
import fs from "fs";
import path from "path";

const HERO_IMGS_DIR = "public/hero-imgs";
const MEDIA_EXTS = /\.(jpg|jpeg|png|gif|webp|avif|mp4|webm|mov)$/i;

export interface HeroItem {
  src: string;
  projectName?: string;
  projectSlug?: string;
}

/**
 * Parses hero-config.txt — format per line:
 *   filename | Project Name | slug
 * Lines starting with # are ignored.
 */
function parseHeroConfig(txt: string): Record<string, { name: string; slug: string }> {
  const result: Record<string, { name: string; slug: string }> = {};
  for (const raw of txt.split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const parts = line.split("|").map((s) => s.trim());
    if (parts.length < 3) continue;
    const [filename, name, slug] = parts;
    if (filename && name && slug) result[filename] = { name, slug };
  }
  return result;
}

/**
 * Returns the list of hero items for the home carousel.
 * Reads public/hero-imgs/ for media files and cross-references
 * public/hero-imgs/hero-config.txt for project name/slug mappings.
 */
export function getHeroImages(): HeroItem[] {
  const dir = path.join(process.cwd(), HERO_IMGS_DIR);
  if (!fs.existsSync(dir)) return [];

  let links: Record<string, { name: string; slug: string }> = {};
  const configPath = path.join(dir, "hero-config.txt");
  if (fs.existsSync(configPath)) {
    try {
      links = parseHeroConfig(fs.readFileSync(configPath, "utf-8"));
    } catch {}
  }

  const files = fs
    .readdirSync(dir)
    .filter((f) => MEDIA_EXTS.test(f))
    .sort();

  return files.map((f) => ({
    src: `/hero-imgs/${f}`,
    projectName: links[f]?.name,
    projectSlug: links[f]?.slug,
  }));
}
