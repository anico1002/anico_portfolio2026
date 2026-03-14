import "server-only";
import fs from "fs";
import path from "path";

const HERO_IMGS_DIR = "public/hero-imgs";
const MEDIA_EXTS = /\.(jpg|jpeg|png|gif|webp|avif|mp4|webm|mov)$/i;

/**
 * Returns the list of image paths in /hero-imgs for the home hero carousel.
 * Add images to public/hero-imgs/ and they will be shown in order (alphabetically by filename).
 */
export function getHeroImages(): string[] {
  const dir = path.join(process.cwd(), HERO_IMGS_DIR);
  if (!fs.existsSync(dir)) return [];

  const files = fs
    .readdirSync(dir)
    .filter((f) => MEDIA_EXTS.test(f))
    .sort();

  return files.map((f) => `/hero-imgs/${f}`);
}
