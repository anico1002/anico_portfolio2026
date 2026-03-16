"use client";

import { useApp } from "@/context/AppContext";
import { translations } from "@/lib/i18n";
import ScrollReveal from "./ScrollReveal";

interface AboutProps {
  profileAbout?: { jobTitle: string; bio: string[]; disciplines: string[] };
}

export default function About({ profileAbout }: AboutProps) {
  const { locale } = useApp();
  const base = translations[locale].about;
  const t = profileAbout
    ? { ...base, headline: profileAbout.jobTitle, bio: profileAbout.bio, disciplines: profileAbout.disciplines }
    : base;

  return (
    <section id="about" className="py-24 md:py-32 px-6 md:px-12 lg:px-24 bg-muted">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-[3fr_2fr] gap-16 items-start">
          <ScrollReveal className="relative -mx-6 md:mx-0 -mt-24 md:mt-0" y={50}>
            <div className="aspect-[1296/630] bg-accent overflow-hidden relative">
              <img
                src="/about.webp"
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.1} y={50}>
            <div>
              <p className="text-muted-foreground text-sm tracking-widest uppercase mb-4">
                {t.title}
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight mb-6 leading-tight">
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
