import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { getEnrichedProjects } from "@/lib/scan-project";
import ProyectoDetail from "@/components/ProyectoDetail";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

/** Contenido textual desde content.txt; sin caché para que los cambios se vean al actualizar el archivo */
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const projects = getEnrichedProjects();
  const project = projects.find((p) => p.slug === slug);
  if (!project) return { title: "Project" };
  return {
    title: `${project.name} | anico Senior Designer`,
    description: project.description || project.subtitle,
  };
}

export default async function ProyectoPage({ params }: Props) {
  const { slug } = await params;
  const projects = getEnrichedProjects();
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();

  const project = projects[index];
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-6 flex justify-between items-center mix-blend-difference">
        <Link
          href="/"
          className="flex items-center gap-2 group leading-none text-white [&_img]:invert"
        >
          <ArrowLeft className="w-5 h-5 flex-shrink-0 mt-0.5 group-hover:-translate-x-1 transition-transform" />
          <Image
            src="/anico_logo.svg"
            alt="anico"
            width={91}
            height={20}
            className="h-[22px] w-auto hidden md:block"
          />
        </Link>
        <span className="text-white text-sm font-medium">{project.year}</span>
      </header>
      <main className="overflow-x-hidden">
        <ProyectoDetail project={project} prev={prev} next={next} />
      </main>
      <Footer showBackToHome />
    </>
  );
}
