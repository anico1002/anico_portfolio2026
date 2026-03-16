"use client";

const FALLBACK = "VISUAL & USER EXPERIENCE · UI/UX VIDEOGAMES · BRAND ART DIRECTOR · INTERACTIVE PROTOTYPE · WEB3 & VR DESIGNER · ";

interface MarqueeProps {
  text?: string;
}

export default function Marquee({ text: textProp }: MarqueeProps) {
  const text = textProp || FALLBACK;
  const cls = "shrink-0 font-display text-5xl md:text-7xl font-extrabold tracking-tight text-muted-foreground/20";
  return (
    <section className="py-8 border-y border-border overflow-hidden">
      <div className="flex whitespace-nowrap animate-marquee">
        <span className={cls}>{text}</span>
        <span className={cls}>{text}</span>
      </div>
    </section>
  );
}
