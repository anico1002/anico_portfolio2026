/**
 * Parses a project's content.txt file.
 *
 * Format:
 *   key: value          ← single-line metadata at the top
 *
 *   [overview]          ← named block (multi-line, default locale)
 *   Long text here...
 *
 *   [overview.es]       ← same block, Spanish locale variant
 *   Texto en español...
 *
 *   [stats]             ← one line = one box, exact text shown
 *   200M+ Downloads
 *   #1 Racing game, iOS & Android
 *
 *   [links]             ← each line: "label | url"
 *   View on Behance | https://...
 *
 *   [button]            ← single CTA: one line "Label https://..."
 *   Download now! https://apps.apple.com/...
 */

export interface ContentMeta {
  name?: string;
  subtitle?: string;
  client?: string;
  category?: string;
  year?: string;
  role?: string;
  deliverables?: string;
  tags?: string;
  /** Phone mockup aspect ratio override, e.g. "9/16" (iPhone 8) or "393/852" (modern iPhone) */
  phoneRatio?: string;
}

export interface ContentLink {
  label: string;
  url: string;
}

/** Una línea = un stat; se muestra el texto exacto en la caja */
export interface ContentStat {
  text: string;
}

export type ContentTextBlock = {
  overview?: string;
  challenge?: string;
  process?: string;
  outcome?: string;
};

/** CTA button: "Label https://..." in [button] block */
export interface ContentButton {
  label: string;
  url: string;
}

export interface ParsedContent {
  meta: ContentMeta;
  overview?: string;
  challenge?: string;
  process?: string;
  outcome?: string;
  stats: ContentStat[];
  links: ContentLink[];
  /** CTA button (download / visit web) from [button] block */
  button?: ContentButton;
  /** Locale variants: key = locale code ("es", "fr", …) */
  locales: Record<string, ContentTextBlock>;
}

export function parseContent(text: string): ParsedContent {
  const lines = text.split(/\r?\n/);
  const result: ParsedContent = { meta: {}, stats: [], links: [], locales: {} };

  let currentBlock: string | null = null;
  let currentLocale: string | null = null; // null = default locale
  let blockLines: string[] = [];

  const TEXT_BLOCKS = new Set(["overview", "challenge", "process", "outcome"]);

  function flushBlock() {
    if (currentBlock === null) return;
    const content = blockLines.join("\n").trim();

    if (currentBlock === "button" && currentLocale === null) {
      const line = content.split("\n")[0]?.trim() ?? "";
      const urlMatch = line.match(/\s+(https?:\/\/\S+)$/);
      if (urlMatch) {
        result.button = {
          label: line.slice(0, urlMatch.index).trim(),
          url: urlMatch[1].trim(),
        };
      }
    } else if (currentLocale !== null && TEXT_BLOCKS.has(currentBlock)) {
      // Locale variant → store in locales map
      if (!result.locales[currentLocale]) result.locales[currentLocale] = {};
      (result.locales[currentLocale] as Record<string, string>)[currentBlock] = content;
    } else {
      switch (currentBlock) {
        case "overview":  result.overview  = content; break;
        case "challenge": result.challenge = content; break;
        case "process":   result.process   = content; break;
        case "outcome":   result.outcome   = content; break;
        case "stats":
          result.stats = content
            .split("\n")
            .map((l) => l.trim())
            .filter(Boolean)
            .map((line) => ({ text: line }));
          break;
        case "links":
          result.links = content
            .split("\n")
            .filter((l) => l.includes("|"))
            .map((l) => {
              const idx = l.indexOf("|");
              return { label: l.slice(0, idx).trim(), url: l.slice(idx + 1).trim() };
            });
          break;
      }
    }

    blockLines = [];
    currentBlock = null;
    currentLocale = null;
  }

  for (const line of lines) {
    // Block header: [overview], [overview.es], [stats], etc.
    const blockMatch = line.match(/^\[(\w+)(?:\.(\w+))?\]\s*$/);
    if (blockMatch) {
      flushBlock();
      currentBlock  = blockMatch[1].toLowerCase();
      currentLocale = blockMatch[2]?.toLowerCase() ?? null;
      continue;
    }

    if (currentBlock !== null) {
      blockLines.push(line);
      continue;
    }

    // Key: value line (metadata)
    const kvMatch = line.match(/^(\w+):\s*(.+)$/);
    if (kvMatch) {
      const key = kvMatch[1].toLowerCase();
      const val = kvMatch[2].trim();
      (result.meta as Record<string, string>)[key] = val;
    }
  }

  flushBlock();
  return result;
}
