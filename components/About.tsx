"use client";

import { useApp } from "@/context/AppContext";
import { translations } from "@/lib/i18n";
import ScrollReveal from "./ScrollReveal";

export default function About() {
  const { locale } = useApp();
  const t = translations[locale].about;

  return (
    <section id="about" className="py-24 md:py-32 px-6 md:px-12 lg:px-24 bg-muted">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <ScrollReveal className="relative" y={50}>
            <div className="aspect-[4/5] bg-accent overflow-hidden relative">
              <img
                src="/about.webp"
                alt=""
                className="absolute inset-0 w-full h-full object-cover object-right"
              />
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.1} y={50}>
            <div>
              <p className="text-muted-foreground text-sm tracking-widest uppercase mb-4">
                {t.title}
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-semibold mb-6 leading-tight">
                {t.headline}
              </h2>
              {t.bio.map((paragraph, i) => (
                <p
                  key={i}
                  className="text-muted-foreground text-lg mb-6 leading-relaxed"
                >
                  {paragraph}
                </p>
              ))}
              <div className="pt-6 border-t border-border">
                <p className="text-muted-foreground text-sm tracking-widest uppercase mb-4">
                  {t.disciplinesTitle}
                </p>
                <div className="flex flex-wrap gap-2">
                  {t.disciplines.map((d, i) => (
                    <span
                      key={i}
                      className="inline-block px-4 py-2 text-sm font-medium border border-border bg-background rounded-full text-muted-foreground"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
