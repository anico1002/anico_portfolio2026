"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { translations } from "@/lib/i18n";
import type { Project } from "@/lib/projects";
import { getLocalizedProject } from "@/lib/project-translations";

interface ProjectContentProps {
  project: Project;
  next: Project;
}

function FadeImage({ src, alt }: { src: string | string[]; alt: string }) {
  const srcs = Array.isArray(src) ? src : [src];
  return (
    <div className="relative w-full h-full">
      <Image
        src={srcs[0]}
        alt={alt}
        fill
        className="object-cover"
        unoptimized={srcs[0].endsWith(".gif")}
      />
    </div>
  );
}

export default function ProjectContent({ project, next }: ProjectContentProps) {
  const { locale } = useApp();
  const t = translations[locale].project;
  const p = getLocalizedProject(project, locale);

  // Flatten all images for gallery
  const allImages: string[] = [];
  if (p.sections && p.sections.length > 0) {
    for (const section of p.sections) {
      for (const img of section.images) {
        const first = Array.isArray(img) ? img[0] : img;
        if (first) allImages.push(first);
      }
    }
  } else {
    for (const img of p.images) {
      const first = Array.isArray(img) ? img[0] : img;
      if (first) allImages.push(first);
    }
  }

  const heroImage = p.thumbnail || allImages[0] || "";
  const featuredImage = allImages[0] || "";
  const galleryImages = allImages.slice(1, 5);

  return (
    <>
      {/* Hero */}
      <section className="relative h-screen overflow-hidden">
        {p.heroVideo ? (
          <video
            src={p.heroVideo}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : heroImage ? (
          <Image
            src={heroImage}
            alt={p.name}
            fill
            className="object-cover"
            priority
            unoptimized={heroImage.endsWith(".gif")}
          />
        ) : null}
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 h-full flex flex-col justify-end pb-16 px-6 md:px-12 lg:px-24 max-w-6xl mx-auto w-full">
          <p className="text-white/70 text-sm tracking-widest uppercase mb-4">
            {p.category}
          </p>
          <h1
            className="font-display font-semibold text-white leading-tight"
            style={{ fontSize: "clamp(2.5rem, 8vw, 6rem)" }}
          >
            {p.name}
          </h1>
        </div>
        {/* Year badge */}
        <div className="absolute top-20 right-6 md:right-12 z-10 bg-white/10 backdrop-blur-sm px-4 py-2">
          <span className="text-white text-sm font-medium">{p.year}</span>
        </div>
      </section>

      {/* Project info */}
      <section className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-24">
          {/* Metadata 4-col */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 mb-16 pb-16 border-b border-[#e5e5e5]">
            {[
              { label: t.client, value: p.client },
              { label: t.year, value: p.year },
              { label: t.role, value: p.role },
              { label: t.deliverables, value: p.deliverables.slice(0, 2).join(", ") },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-[#737373] text-xs tracking-widest uppercase mb-2">{item.label}</p>
                <p className="font-display font-medium text-[#0a0a0a]">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Overview */}
          {p.overview && (
            <div className="max-w-3xl">
              <p className="text-[#737373] text-sm tracking-widest uppercase mb-6">{t.overview}</p>
              <p className="text-[#0a0a0a] text-lg md:text-xl leading-relaxed">{p.overview}</p>
            </div>
          )}
        </div>
      </section>

      {/* Featured image */}
      {featuredImage && (
        <div className="bg-[#f5f5f5]" style={{ aspectRatio: "16/9" }}>
          <div className="relative w-full h-full max-w-6xl mx-auto">
            <Image
              src={featuredImage}
              alt={p.name}
              fill
              className="object-cover"
              unoptimized={featuredImage.endsWith(".gif")}
            />
          </div>
        </div>
      )}

      {/* Challenge / Process */}
      {(p.challenge || p.process) && (
        <section className="py-24 md:py-32 bg-[#f5f5f5]">
          <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-24">
            <div className="grid lg:grid-cols-2 gap-16 md:gap-24">
              {p.challenge && (
                <div className="relative">
                  <p className="absolute -top-8 left-0 font-display font-semibold text-[#0a0a0a]/5 text-8xl md:text-9xl select-none">
                    01
                  </p>
                  <p className="text-[#737373] text-xs tracking-widest uppercase mb-4 relative z-10">
                    {t.challenge}
                  </p>
                  <p className="text-[#0a0a0a] leading-relaxed relative z-10">{p.challenge}</p>
                </div>
              )}
              {p.process && (
                <div className="relative">
                  <p className="absolute -top-8 left-0 font-display font-semibold text-[#0a0a0a]/5 text-8xl md:text-9xl select-none">
                    02
                  </p>
                  <p className="text-[#737373] text-xs tracking-widest uppercase mb-4 relative z-10">
                    {t.process}
                  </p>
                  <p className="text-[#0a0a0a] leading-relaxed relative z-10">{p.process}</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Gallery */}
      {galleryImages.length > 0 && (
        <section className="py-24 md:py-32">
          <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-24">
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-[#0a0a0a] mb-12">
              {locale === "es" ? "Diseños del proyecto" : "Project designs"}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {galleryImages.map((img, i) => (
                <div
                  key={i}
                  className="relative overflow-hidden bg-[#f5f5f5] group"
                  style={{ aspectRatio: "16/9" }}
                >
                  <Image
                    src={img}
                    alt={`${p.name} ${i + 1}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    unoptimized={img.endsWith(".gif")}
                  />
                  <div className="absolute inset-0 bg-[#0a0a0a]/0 group-hover:bg-[#0a0a0a]/10 transition-colors duration-300" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Sections with titles (if exist) */}
      {p.sections && p.sections.length > 0 && (
        <section className="py-0 md:py-0">
          {p.sections.map((section, si) => (
            <div key={si} className="mb-16">
              {section.title && (
                <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-24 mb-8">
                  <h3 className="font-display text-2xl font-semibold text-[#0a0a0a]">
                    {section.title}
                  </h3>
                </div>
              )}
              <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-24 grid md:grid-cols-2 gap-4">
                {section.images.slice(0, 4).map((img, ii) => {
                  const src = Array.isArray(img) ? img[0] : img;
                  return (
                    <div
                      key={ii}
                      className="relative overflow-hidden bg-[#f5f5f5]"
                      style={{ aspectRatio: "4/3" }}
                    >
                      <Image
                        src={src}
                        alt={`${section.title || p.name} ${ii + 1}`}
                        fill
                        className="object-cover"
                        unoptimized={src.endsWith(".gif")}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Results / stats */}
      {p.stats && p.stats.length > 0 && (
        <section className="py-24 md:py-32 bg-[#0a0a0a] text-white">
          <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-24">
            <p className="text-white/50 text-sm tracking-widest uppercase mb-12">
              {t.outcomes}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {p.stats.map((stat, i) => (
                <div
                  key={i}
                  className="border border-white/20 p-6 hover:border-white/50 transition-colors duration-200"
                >
                  <p className="text-white/30 text-xs mb-4 font-display">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <p className="font-display text-2xl font-semibold">{stat.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Outcome */}
      {p.outcome && (
        <section className="py-24 md:py-32">
          <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-24 max-w-3xl">
            <p className="text-[#737373] text-sm tracking-widest uppercase mb-6">{t.outcomes}</p>
            <p className="text-[#0a0a0a] text-lg leading-relaxed">{p.outcome}</p>
          </div>
        </section>
      )}

      {/* Design stack (tags) */}
      {p.tags && p.tags.length > 0 && (
        <section className="py-16 border-t border-[#e5e5e5] text-center">
          <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-24">
            <p className="text-[#737373] text-sm tracking-widest uppercase mb-8">
              {locale === "es" ? "Herramientas y disciplinas" : "Design stack"}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {p.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-2 border border-[#e5e5e5] text-sm text-[#404040] font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Links */}
      {p.links && p.links.length > 0 && (
        <section className="py-16 border-t border-[#e5e5e5]">
          <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-24 flex flex-wrap gap-4 justify-center">
            {p.links.map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors duration-200 ${
                  i === 0
                    ? "bg-[#0a0a0a] text-white hover:bg-[#404040]"
                    : "border border-[#e5e5e5] text-[#0a0a0a] hover:border-[#0a0a0a]"
                }`}
              >
                {link.label}
                <ExternalLink size={14} />
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Next project navigation */}
      <section className="border-t border-[#e5e5e5]">
        <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-24 grid md:grid-cols-2">
          <Link
            href="/"
            className="flex items-center gap-4 py-12 md:border-r border-[#e5e5e5] group"
          >
            <ArrowLeft size={20} className="text-[#737373] group-hover:text-[#0a0a0a] transition-colors duration-200" />
            <div>
              <p className="text-[#737373] text-xs tracking-widest uppercase mb-1">
                {locale === "es" ? "Volver" : "Back to"}
              </p>
              <p className="font-display font-semibold text-[#0a0a0a]">
                {locale === "es" ? "Todo el trabajo" : "All projects"}
              </p>
            </div>
          </Link>
          <Link
            href={`/work/${next.slug}`}
            className="flex items-center justify-end gap-4 py-12 md:pl-12 group"
          >
            <div className="text-right">
              <p className="text-[#737373] text-xs tracking-widest uppercase mb-1">
                {t.nextProject}
              </p>
              <p className="font-display font-semibold text-[#0a0a0a] group-hover:text-[#404040] transition-colors duration-200">
                {next.name}
              </p>
            </div>
            <ArrowRight size={20} className="text-[#737373] group-hover:text-[#0a0a0a] transition-colors duration-200 shrink-0" />
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32 text-center">
        <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-24">
          <h2 className="font-display text-3xl md:text-5xl font-semibold text-[#0a0a0a] mb-8">
            {locale === "es" ? "¿Trabajamos juntos?" : "Want to work together?"}
          </h2>
          <a
            href="mailto:anico.es@gmail.com"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#0a0a0a] text-white font-medium text-sm hover:bg-[#404040] transition-colors duration-200"
          >
            {locale === "es" ? "Hablemos" : "Get in touch"}
            <ExternalLink size={16} />
          </a>
        </div>
      </section>
    </>
  );
}
