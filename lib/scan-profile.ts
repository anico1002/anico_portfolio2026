import "server-only";
import fs from "fs";
import path from "path";

export interface ProfileConfig {
  careerStart: number;
  yoe: number;
  email: string;
  linkedin: string;
  meta: { title: string; description: string };
  hero: { eyebrow: string; headline: string; desc: string };
  about: { jobTitle: string; bio: string[]; disciplines: string[] };
  contact: { title: string; desc: string };
  marquee: string;
}

function applyTokens(str: string, yoe: number): string {
  return str.replace(/\{yoe\}/g, String(yoe));
}

export function getProfileConfig(): ProfileConfig {
  const filePath = path.join(process.cwd(), "public", "profile.txt");
  const raw = fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf-8") : "";

  // Parse key: value lines (outside blocks)
  const kv: Record<string, string> = {};
  const blocks: Record<string, string> = {};

  let currentBlock: string | null = null;
  const blockLines: string[] = [];

  for (const line of raw.split("\n")) {
    // Skip comments
    if (line.trim().startsWith("#")) continue;

    // Block header [name]
    const blockMatch = line.match(/^\[(\w+)\]$/);
    if (blockMatch) {
      if (currentBlock !== null) blocks[currentBlock] = blockLines.join("\n").trim();
      currentBlock = blockMatch[1];
      blockLines.length = 0;
      continue;
    }

    if (currentBlock !== null) {
      blockLines.push(line);
    } else {
      // key: value
      const idx = line.indexOf(":");
      if (idx > 0) {
        const key = line.slice(0, idx).trim();
        const val = line.slice(idx + 1).trim();
        kv[key] = val;
      }
    }
  }
  if (currentBlock !== null) blocks[currentBlock] = blockLines.join("\n").trim();

  const careerStart = parseInt(kv.career_start ?? "1998", 10);
  const yoe = new Date().getFullYear() - careerStart;
  const t = (s: string) => applyTokens(s, yoe);

  // Parse a block into key:value lines
  function blockKv(name: string): Record<string, string> {
    const result: Record<string, string> = {};
    for (const line of (blocks[name] ?? "").split("\n")) {
      const idx = line.indexOf(":");
      if (idx > 0) {
        result[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
      }
    }
    return result;
  }

  const hero = blockKv("hero");
  const about = blockKv("about");
  const contact = blockKv("contact");
  const meta = blockKv("meta");

  return {
    careerStart,
    yoe,
    email: kv.email ?? "hola@anico.es",
    linkedin: kv.linkedin ?? "https://es.linkedin.com/in/anico",
    meta: {
      title: t(meta.title ?? "anico | Senior Designer"),
      description: t(meta.description ?? ""),
    },
    hero: {
      eyebrow: t(hero.eyebrow ?? `Senior Designer · ${yoe}+ years of craft`),
      headline: t(hero.headline ?? "Crafting digital Experiences"),
      desc: t(hero.desc ?? ""),
    },
    about: {
      jobTitle: t(about.job_title ?? "Senior Designer"),
      bio: [
        t(about.bio1 ?? ""),
        t(about.bio2 ?? ""),
        t(about.bio3 ?? ""),
      ].filter(Boolean),
      disciplines: (about.disciplines ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    },
    contact: {
      title: t(contact.title ?? "Have a project in mind?"),
      desc: t(contact.desc ?? ""),
    },
    marquee: t((blocks.marquee ?? "").trim()),
  };
}
