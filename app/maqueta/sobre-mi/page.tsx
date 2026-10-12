import { TLink } from "@/components/case-study/Portal";
import SiteNav from "@/components/case-study/SiteNav";
import { Eyebrow, FadeIn, MaskReveal } from "@/components/case-study/primitives";
import { STAGGER } from "@/lib/maqueta/motion";

/* Sobre mí: textos de public/profile.txt (web actual), en castellano. Estructura de
   plastic.design: declaración, bio, disciplinas, con quién he trabajado y contacto. */

const wrap = "px-4 md:px-6";
const grid = "grid grid-cols-12 gap-x-4 md:gap-x-6";
const mono = "t-tag"; // titulillos: estilo único en app/maqueta/system.css
const tBody = "t-body";

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
      className="relative min-h-screen bg-[var(--case-bg)] font-[family-name:var(--font-case-sans)] text-[var(--case-fg)] antialiased"
    >
      <SiteNav active="about" />

      <header className={`pt-32 md:pt-44 ${wrap}`}>
        <div className={grid}>
          <FadeIn className="col-span-12 md:col-span-11">
            <Eyebrow>Sobre mí</Eyebrow>
            <h1 className="t-h1">
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
            <p className="t-statement">
              Diseñador sénior especializado en diseño interactivo, UI/UX de videojuegos, dirección de arte de
              marca y tecnologías inmersivas.
            </p>
          </FadeIn>
          <FadeIn delay={STAGGER} className="col-span-12 space-y-5 md:col-span-5 md:col-start-8 md:pt-3">
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
            <p className={`mb-6 t-label text-[var(--case-muted)] ${mono}`}>Qué hago</p>
            <ul className="border-t border-[var(--case-line)]">
              {disciplines.map((d) => (
                <li key={d} className="border-b border-[var(--case-line)] py-3 t-lead">
                  {d}
                </li>
              ))}
            </ul>
          </FadeIn>
          <FadeIn delay={STAGGER} className="col-span-12 md:col-span-5 md:col-start-8">
            <p className={`mb-6 t-label text-[var(--case-muted)] ${mono}`}>Con quién he trabajado</p>
            <ul className="border-t border-[var(--case-line)]">
              {clients.map((d) => (
                <li key={d} className="border-b border-[var(--case-line)] py-3 t-lead">
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
          <TLink
            href="/maqueta/contacto"
            className="block t-d2 hov hover:opacity-70"
          >
            ¿Hablamos?
          </TLink>
        </FadeIn>
      </footer>
    </main>
  );
}
