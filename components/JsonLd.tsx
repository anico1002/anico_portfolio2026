// JSON-LD structured data for schema.org — improves SEO and GEO (AI search engines)

interface PersonSchemaProps {
  description: string;
}

export function PersonSchema({ description }: PersonSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Alberto Nicolás",
    alternateName: "anico",
    jobTitle: "Senior Designer",
    description,
    url: "https://anico.design",
    email: "hola@anico.es",
    sameAs: ["https://es.linkedin.com/in/anico", "https://anico.design"],
    knowsAbout: [
      "Game UI/UX Design",
      "Brand Art Direction",
      "Interactive Design",
      "Product Design",
      "Web3 Design",
      "VR Design",
      "UX Prototyping",
      "Figma",
      "Protopie",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface CreativeWorkSchemaProps {
  name: string;
  description: string;
  url: string;
  image?: string;
  year?: string;
}

export function CreativeWorkSchema({ name, description, url, image, year }: CreativeWorkSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name,
    description,
    url,
    ...(image ? { image } : {}),
    ...(year ? { dateCreated: year } : {}),
    author: {
      "@type": "Person",
      name: "Alberto Nicolás",
      alternateName: "anico",
      url: "https://anico.design",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
