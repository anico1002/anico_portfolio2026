"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { translations } from "@/lib/i18n";
import type { Project } from "@/lib/projects";
import { getLocalizedProject } from "@/lib/project-translations";
import ScrollReveal from "./ScrollReveal";
import ImageFadeSlideshow from "./ImageFadeSlideshow";
import ProjectHero from "./ProjectHero";

const isThumb = (src: string) => /_thumb|thumb\.(png|jpg|jpeg|gif|webp)/i.test(src);

/** Imagen de hero: xxx_hero en carpeta del proyecto, o si no existe la primera imagen del proyecto. */
function getProjectHeroImage(project: Project): string | null {
  if (project.heroImage) return project.heroImage;
  if (project.sections?.length) {
    const first = project.sections[0].images[0];
    if (first) {
      const src = Array.isArray(first) ? first[0] : first;
      if (src && typeof src === "string" && !isThumb(src)) return src;
    }
  }
  if (project.images?.length) {
    const first = project.images[0];
    const src = Array.isArray(first) ? first[0] : first;
    if (src && typeof src === "string" && !isThumb(src)) return src;
  }
  if (project.thumbnail && !isThumb(project.thumbnail)) return project.thumbnail;
  return null;
}

export type ContentBlock =
  | { sectionTitle?: string; type: "image"; urls: [string] }
  | { sectionTitle?: string; type: "slideshow"; urls: string[] };

/** Bloques de contenido por sección: imagen única o slideshow (1a,1b,1c). */
function getProjectContentBlocks(project: Project): ContentBlock[] {
  const blocks: ContentBlock[] = [];
  const push = (sectionTitle: string | undefined, img: string | string[]) => {
    const urls = Array.isArray(img) ? img.filter((s) => s && !isThumb(s)) : [img];
    if (urls.length === 0) return;
    if (urls.length === 1) blocks.push({ sectionTitle, type: "image", urls: [urls[0]] });
    else blocks.push({ sectionTitle, type: "slideshow", urls });
  };

  if (project.sections?.length) {
    for (const section of project.sections) {
      for (const img of section.images) {
        const src = Array.isArray(img) ? img[0] : img;
        if (src && !isThumb(src)) push(section.title, img);
      }
    }
  } else {
    for (const img of project.images) {
      const src = Array.isArray(img) ? img[0] : img;
      if (src && !isThumb(src)) push(undefined, img);
    }
  }
  return blocks;
}

/** Agrupa bloques por sectionTitle para aplicar layout por sección. */
function groupBlocksBySection(blocks: ContentBlock[]): { title?: string; blocks: ContentBlock[] }[] {
  const groups: { title?: string; blocks: ContentBlock[] }[] = [];
  let current: { title?: string; blocks: ContentBlock[] } | null = null;
  for (const b of blocks) {
    if (!current || current.title !== b.sectionTitle) {
      current = { title: b.sectionTitle, blocks: [] };
      groups.push(current);
    }
    current.blocks.push(b);
  }
  return groups;
}

interface ProyectoDetailProps {
  project: Project;
  prev: Project;
  next: Project;
}

export default function ProyectoDetail({ project, prev, next }: ProyectoDetailProps) {
  const { locale } = useApp();
  const t = translations[locale].project;
  const p = getLocalizedProject(project, locale);
  const heroImage = getProjectHeroImage(project);
  const contentBlocks = getProjectContentBlocks(project);

  return (
    <>
      <ProjectHero
        src={heroImage}
        alt={p.name}
        category={p.category}
        title={p.name}
      />

      <div className="relative bg-white z-10">
        {/* Meta grid */}
        <section className="py-24 md:py-32 px-6 md:px-12 lg:px-24">
          <div className="max-w-6xl mx-auto">
            <ScrollReveal>
            <div className="grid md:grid-cols-4 gap-8 md:gap-16 mb-16 md:mb-24">
              <div>
                <p className="text-muted-foreground text-sm tracking-widest uppercase mb-2">
                  {t.client}
                </p>
                <p className="font-display text-lg font-medium">{p.client}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm tracking-widest uppercase mb-2">
                  {t.role}
                </p>
                <p className="font-display text-lg font-medium">{p.role}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm tracking-widest uppercase mb-2">
                  {t.deliverables}
                </p>
                <p className="font-display text-lg font-medium">
                  {p.deliverables?.slice(0, 2).join(", ") ?? "-"}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm tracking-widest uppercase mb-2">
                  {t.year}
                </p>
                <p className="font-display text-lg font-medium">{p.year}</p>
              </div>
            </div>
            {p.overview && (
              <div className="max-w-3xl">
                <h2 className="font-display text-3xl md:text-4xl font-semibold mb-6">
                  {t.overview}
                </h2>
                <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
                  {p.overview}
                </p>
              </div>
            )}
            {p.ctaButton && (
              <div className="mt-8">
                <a
                  href={p.ctaButton.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-8 py-4 bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"
                >
                  {p.ctaButton.label}
                </a>
              </div>
            )}
            </ScrollReveal>
          </div>
        </section>

        {/* Challenge / Process */}
        {(p.challenge || p.process) && (
          <section className="py-24 md:py-32 px-6 md:px-12 lg:px-24 bg-muted">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-16 md:gap-24">
                {p.challenge && (
                  <div className="relative">
                    <span className="font-display text-8xl md:text-9xl font-bold text-primary/5 absolute -top-8 -left-4">
                      01
                    </span>
                    <div className="relative">
                      <p className="text-muted-foreground text-sm tracking-widest uppercase mb-4">
                        {t.challenge}
                      </p>
                      <h3 className="font-display text-2xl md:text-3xl font-semibold mb-6">
                        {locale === "es" ? "El reto" : "Problem to solve"}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {p.challenge}
                      </p>
                    </div>
                  </div>
                )}
                {p.process && (
                  <div className="relative">
                    <span className="font-display text-8xl md:text-9xl font-bold text-primary/5 absolute -top-8 -left-4">
                      02
                    </span>
                    <div className="relative">
                      <p className="text-muted-foreground text-sm tracking-widest uppercase mb-4">
                        {t.process}
                      </p>
                      <h3 className="font-display text-2xl md:text-3xl font-semibold mb-6">
                        {locale === "es" ? "Mi enfoque" : "My approach"}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {p.process}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Imágenes por sección: una sola columna, full width, altura natural, sin huecos */}
        {contentBlocks.length > 0 && (() => {
          const groups = groupBlocksBySection(contentBlocks);
          return (
            <section className="px-6 md:px-12 lg:px-24 overflow-x-hidden">
              {groups.map((group, sectionIndex) => (
                <div key={sectionIndex} className="max-w-6xl mx-auto">
                  {group.title && (
                    <div className="pt-16 pb-6">
                      <h2 className="font-display text-2xl md:text-3xl font-semibold text-primary text-left">
                        {group.title}
                      </h2>
                    </div>
                  )}
                  <div className="w-screen relative left-1/2 -translate-x-1/2 md:relative md:left-0 md:translate-x-0 md:w-full flex flex-col gap-0">
                    {group.blocks.map((block, i) =>
                      block.type === "image" ? (
                        <div key={i} className="relative w-full bg-muted shrink-0">
                          {/* Imagen a ancho completo, altura natural, sin recorte */}
                          <img
                            src={block.urls[0]}
                            alt={`${p.name} ${group.title ?? ""} ${i + 1}`}
                            className="w-full h-auto block object-contain"
                          />
                        </div>
                      ) : (
                        <div key={i} className="relative w-full shrink-0">
                          <ImageFadeSlideshow
                            urls={block.urls}
                            alt={`${p.name} ${group.title ?? ""} ${i + 1}`}
                          />
                        </div>
                      )
                    )}
                  </div>
                </div>
              ))}
            </section>
          );
        })()}

        {/* Outcomes / Project impact — solo si hay contenido en content.txt */}
        {p.stats && p.stats.length > 0 && (
          <section className="py-24 md:py-32 px-6 md:px-12 lg:px-24 bg-primary text-primary-foreground">
            <div className="max-w-6xl mx-auto">
              <p className="text-primary-foreground/60 text-sm tracking-widest uppercase mb-2">
                {t.outcomes}
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-semibold mb-16">
                {locale === "es" ? "Impacto del proyecto" : "Project impact"}
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {p.stats.map((stat, i) => (
                  <div
                    key={i}
                    className="border border-primary-foreground/20 p-6 hover:border-primary-foreground/50 transition-colors"
                  >
                    <span className="text-primary-foreground/40 text-sm font-display">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="font-display text-lg font-medium mt-4 text-primary-foreground">
                      {stat.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Prev / Next + footer va en el layout */}
        <section className="border-t border-border">
          <div className="grid md:grid-cols-2">
            <Link
              href={`/proyecto/${prev.slug}`}
              className="group relative overflow-hidden py-16 md:py-24 px-6 md:px-12 border-r border-border hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-4">
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-2 transition-transform" />
                <div>
                  <p className="text-muted-foreground text-sm mb-1">
                    {locale === "es" ? "Proyecto anterior" : "Previous project"}
                  </p>
                  <p className="font-display text-xl md:text-2xl font-semibold group-hover:text-secondary transition-colors">
                    {prev.name}
                  </p>
                </div>
              </div>
            </Link>
            <Link
              href={`/proyecto/${next.slug}`}
              className="group relative overflow-hidden py-16 md:py-24 px-6 md:px-12 hover:bg-muted transition-colors text-right"
            >
              <div className="flex items-center justify-end gap-4">
                <div>
                  <p className="text-muted-foreground text-sm mb-1">
                    {t.nextProject}
                  </p>
                  <p className="font-display text-xl md:text-2xl font-semibold group-hover:text-secondary transition-colors">
                    {next.name}
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </div>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
