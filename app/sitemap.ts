import type { MetadataRoute } from "next";
import { getEnrichedProjects } from "@/lib/scan-project";

export default function sitemap(): MetadataRoute.Sitemap {
  const projects = getEnrichedProjects();
  const projectEntries = projects.map((p) => ({
    url: `https://anico.design/proyecto/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: "https://anico.design",
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    ...projectEntries,
  ];
}
