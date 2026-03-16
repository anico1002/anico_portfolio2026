"use client";

import { useApp } from "@/context/AppContext";
import { translations } from "@/lib/i18n";
import ScrollReveal from "./ScrollReveal";

export default function Skills() {
  const { locale } = useApp();
  const t = translations[locale].skills;

  return (
    <section className="py-24 md:py-32 px-6 md:px-12 lg:px-24">
      <ScrollReveal className="text-center mb-16">
        <p className="text-muted-foreground text-sm tracking-widest uppercase mb-2">
          {t.eyebrow}
        </p>
        <h2 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight">
          {t.title}
        </h2>
      </ScrollReveal>
      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {t.items.map((item, i) => (
          <ScrollReveal key={i} delay={i * 0.1}>
          <div
            className="p-8 border border-border hover:border-primary transition-colors group"
          >
            <span className="text-muted-foreground text-sm">{item.number}</span>
            <h3 className="font-display text-xl font-extrabold tracking-tight mt-4 mb-3 group-hover:text-secondary transition-colors">
              {item.title}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {item.desc}
            </p>
          </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
