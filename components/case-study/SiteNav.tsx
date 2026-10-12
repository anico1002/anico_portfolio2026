import Link from "next/link";
import ThemeToggle from "@/components/case-study/ThemeToggle";

/** Nav común de las maquetas: logo (lleva a la entrada) + menú + sol/luna. `mix-blend-difference`
    para que se lea sobre cualquier fondo (también encima de imágenes y vídeos). */
export default function SiteNav({ active = "product" }: { active?: "product" | "games" | "about" | "contact" | null }) {
  const items = [
    ["product", "Product", "/maqueta/home"],
    ["games", "Games", "/maqueta/games"],
    ["about", "Sobre mí", "/maqueta/sobre-mi"],
    ["contact", "Contacto", "/maqueta/contacto"],
  ] as const;
  return (
    <nav className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-4 py-4 mix-blend-difference md:px-6">
      <Link href="/maqueta" aria-label="anico · inicio">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/anico_logo.svg" alt="anico" className="h-[1.125rem] w-auto invert md:h-[1.375rem]" />
      </Link>
      <div className="flex items-center gap-3 whitespace-nowrap t-nav text-white md:gap-6">
        {items.map(([key, label, href]) => (
          <Link key={key} href={href} className={key === active ? "" : "opacity-50 hov hover:opacity-100"}>
            {label}
          </Link>
        ))}
        <ThemeToggle />
      </div>
    </nav>
  );
}
