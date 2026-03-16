"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { useApp } from "@/context/AppContext";
import type { Project } from "@/lib/projects";
import ScrollReveal from "./ScrollReveal";

const FILTERS = [
  { label: "All",         match: (_tags: string[]) => true },
  { label: "Game UI/UX",  match: (t: string[]) => t.includes("Game UI/UX") },
  { label: "App Design",  match: (t: string[]) => t.includes("App Design") },
  { label: "Branding",    match: (t: string[]) => t.includes("Branding") },
  { label: "Prototyping", match: (t: string[]) => t.includes("Prototyping") },
  { label: "Web3 & VR",   match: (t: string[]) => t.includes("Web3") || t.includes("VR") },
];

function useColumnCount() {
  const [cols, setCols] = useState(1);
  useEffect(() => {
    const update = () => {
      if (window.matchMedia("(min-width: 1536px)").matches) setCols(3);
      else if (window.matchMedia("(min-width: 768px)").matches) setCols(2);
      else setCols(1);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return cols;
}

function getDisplayImage(project: Project): string | null {
  const isThumb = (src: string) => /_thumb|thumb\.(png|jpg|jpeg|gif|webp)/i.test(src);
  if (project.thumbnail && project.thumbnail.startsWith("/")) return project.thumbnail;
  for (const img of project.images) {
    const src = Array.isArray(img) ? img[0] : img;
    if (src && !isThumb(src)) return src;
  }
  if (project.sections) {
    for (const section of project.sections) {
      for (const img of section.images) {
        const src = Array.isArray(img) ? img[0] : img;
        if (src && !isThumb(src)) return src;
      }
    }
  }
  if (project.thumbnail) return project.thumbnail;
  return null;
}

interface WorkProps {
  projects: Project[];
}

export default function Work({ projects }: WorkProps) {
  const { locale } = useApp();
  const [activeFilter, setActiveFilter] = useState("All");
  const numCols = useColumnCount();

  const activeMatch = FILTERS.find((f) => f.label === activeFilter)!.match;
  const filtered = projects.filter((p) => activeMatch(p.tags ?? []));

  const columns = Array.from({ length: numCols }, (_, colIdx) =>
    filtered.filter((_, i) => i % numCols === colIdx)
  );

  return (
    <section id="projects" className="py-24 md:py-32 px-6 md:px-12 lg:px-24">
      <ScrollReveal className="flex justify-between items-end mb-16">
        <div>
          <p className="text-muted-foreground text-sm tracking-widest uppercase mb-2">
            Portfolio
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-semibold">
            {locale === "es" ? "Trabajo seleccionado" : "Selected projects"}
          </h2>
        </div>
        <div className="hidden md:flex items-center gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.label}
              onClick={() => setActiveFilter(f.label)}
              className={`px-3 py-1 text-xs font-medium border rounded-full transition-colors ${
                activeFilter === f.label
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-background text-muted-foreground hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
          <span className="text-muted-foreground text-sm ml-2">
            ({String(filtered.length).padStart(2, "0")})
          </span>
        </div>
      </ScrollReveal>

      <div className="flex gap-8 md:gap-12">
        {columns.map((colItems, colIdx) => (
          <div key={colIdx} className="flex-1 min-w-0 flex flex-col gap-8 md:gap-12">
            {colItems.map((project, i) => {
              const globalIdx = colIdx + i * numCols;
              const coverSrc = getDisplayImage(project);
              return (
                <ScrollReveal key={project.slug} delay={activeFilter === "All" ? globalIdx * 0.1 : 0} y={50}>
                  <Link
                    href={`/proyecto/${project.slug}`}
                    className="group block"
                  >
                    <article className="group cursor-pointer">
                      <div className="relative overflow-hidden bg-muted mb-6">
                        {coverSrc ? (
                          <Image
                            src={coverSrc}
                            alt={project.name}
                            width={0}
                            height={0}
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="w-full h-auto block"
                            unoptimized={coverSrc.endsWith(".gif") || coverSrc.startsWith("/projects/")}
                          />
                        ) : (
                          <div className="aspect-[4/3] bg-muted" />
                        )}
                        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-500" />
                        <ArrowUpRight className="absolute top-4 right-4 w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-display text-xl font-semibold mb-1 group-hover:text-secondary transition-colors">
                            {project.name}
                          </h3>
                          <p className="text-muted-foreground text-sm">
                            {project.category}
                          </p>
                        </div>
                        <span className="text-muted-foreground text-sm">
                          {project.year}
                        </span>
                      </div>
                    </article>
                  </Link>
                </ScrollReveal>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}
