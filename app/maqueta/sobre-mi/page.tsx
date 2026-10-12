import Link from "next/link";
import SiteNav from "@/components/case-study/SiteNav";
import { Eyebrow, FadeIn, MaskReveal } from "@/components/case-study/primitives";

/* Sobre mí: textos de public/profile.txt (web actual), en castellano. Estructura de
   plastic.design: declaración, bio, disciplinas, con quién he trabajado y contacto. */

const theme = {
  "--case-bg": "#0A0A0B",
  "--case-fg": "#F4F4F5",
  "--case-muted": "rgba(244,244,245,0.55)",
  "--case-line": "rgba(244,244,245,0.16)",
  "--case-ph": "rgba(244,244,245,0.07)",
} as React.CSSProperties;

const wrap = "px-4 md:px-6";
const grid = "grid grid-cols-12 gap-x-4 md:gap-x-6";
const mono = "font-[family-name:var(--font-case-mono)] uppercase tracking-[0.08em]";
const tBody = "text-[clamp(16px,1.35vw,18px)] leading-[1.55]";

const YEARS = new Date().getFullYear() - 1998; // career_start de profile.txt

const disciplines = [
  "Diseño de producto",
  "UX/UI de videojuegos",
  "Dirección de arte de marca",
  "Prototipado interactivo",
  "Diseño Web3 y VR",
  "Ilustración",
  "Apps nativas con IA",
];

const clients = ["Gameloft Barcelona", "MasterChef World", "Metacampus", "LitLab Games", "Obliq Productions"];

export default function About() {
  return (
    <main
      style={theme}
      className="relative min-h-screen bg-[var(--case-bg)] font-[family-name:var(--font-case-sans)] text-[var(--case-fg)] antialiased"
    >
      <SiteNav active="about" />

      <header className={`pt-32 md:pt-44 ${wrap}`}>
        <div className={grid}>
          <FadeIn className="col-span-12 md:col-span-11">
            <Eyebrow>Sobre mí</Eyebrow>
            <h1 className="text-[clamp(40px,6.4vw,104px)] font-medium leading-[1.02] tracking-[-0.04em]">
              {YEARS} años diseñando interfaces que la gente usa de verdad.
            </h1>
          </FadeIn>
        </div>
      </header>

      <div className={`mt-16 md:mt-24 ${wrap}`}>
        <MaskReveal from="bottom" speed={40}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/about.webp" alt="Alberto Nicolás" className="block h-auto w-full" style={{ aspectRatio: "1296/630" }} />
        </MaskReveal>
      </div>

      <section className={`pt-24 md:pt-40 ${wrap}`}>
        <div className={`${grid} gap-y-10`}>
          <FadeIn className="col-span-12 md:col-span-5">
            <p className="text-[clamp(26px,3.1vw,44px)] leading-[1.18] tracking-[-0.03em]">
              Diseñador sénior especializado en diseño interactivo, UI/UX de videojuegos, dirección de arte de
              marca y tecnologías inmersivas.
            </p>
          </FadeIn>
          <FadeIn delay={0.1} className="col-span-12 space-y-5 md:col-span-5 md:col-start-8 md:pt-3">
            <p className={`text-[var(--case-muted)] ${tBody}`}>
              Me apasionan la tecnología, el arte, la ilustración y el diseño. Durante más de una década me he
              centrado en la UI/UX de videojuegos, con estudios como Gameloft Barcelona, en títulos descargados
              cientos de millones de veces.
            </p>
            <p className={`text-[var(--case-muted)] ${tBody}`}>
              Hoy colaboro como freelance con agencias, estudios y clientes directos en producto digital, identidad
              de marca, web y plataformas emergentes. Con la IA como herramienta, llevo los productos de la idea a
              un prototipo que se puede tocar y a código listo para desarrollo.
            </p>
            <p className={`text-[var(--case-muted)] ${tBody}`}>Desde Barcelona. Abierto a nuevos proyectos.</p>
          </FadeIn>
        </div>
      </section>

      <section className={`pt-24 md:pt-40 ${wrap}`}>
        <div className={`${grid} gap-y-12`}>
          <FadeIn className="col-span-12 md:col-span-5">
            <p className={`mb-6 text-[12px] text-[var(--case-muted)] ${mono}`}>Qué hago</p>
            <ul className="border-t border-[var(--case-line)]">
              {disciplines.map((d) => (
                <li key={d} className="border-b border-[var(--case-line)] py-3 text-[clamp(18px,1.6vw,22px)] tracking-[-0.01em]">
                  {d}
                </li>
              ))}
            </ul>
          </FadeIn>
          <FadeIn delay={0.1} className="col-span-12 md:col-span-5 md:col-start-8">
            <p className={`mb-6 text-[12px] text-[var(--case-muted)] ${mono}`}>Con quién he trabajado</p>
            <ul className="border-t border-[var(--case-line)]">
              {clients.map((d) => (
                <li key={d} className="border-b border-[var(--case-line)] py-3 text-[clamp(18px,1.6vw,22px)] tracking-[-0.01em]">
                  {d}
                </li>
              ))}
            </ul>
          </FadeIn>
        </div>
      </section>

      <footer className={`mt-40 pb-12 md:mt-64 ${wrap}`}>
        <FadeIn>
          <Eyebrow>Contacto</Eyebrow>
          <Link
            href="/maqueta/contacto"
            className="block text-[clamp(56px,11vw,180px)] font-extrabold leading-[0.85] tracking-[-0.055em] transition-opacity hover:opacity-70"
          >
            ¿Hablamos?
          </Link>
        </FadeIn>
      </footer>
    </main>
  );
}
