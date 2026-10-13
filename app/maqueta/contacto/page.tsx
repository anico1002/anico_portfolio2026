import SiteNav from "@/components/case-study/SiteNav";
import { FadeIn } from "@/components/case-study/primitives";
import { STAGGER } from "@/lib/maqueta/motion";
import RollText from "@/components/case-study/RollText";
import Arrow from "@/components/case-study/Arrow";
import { invText } from "@/components/case-study/invText";

/* Contacto: email y LinkedIn de public/profile.txt; texto del bloque [contact]. */

const wrap = "px-4 md:px-6";
const mono = "t-tag"; // titulillos: estilo único en app/maqueta/system.css

const EMAIL = "anico.es@gmail.com";
const LINKEDIN = "https://es.linkedin.com/in/anico";

export default function Contact() {
  return (
    <main
      className="relative flex min-h-screen flex-col justify-between bg-[var(--case-bg)] font-[family-name:var(--font-case-sans)] text-[var(--case-fg)] antialiased"
    >
      <SiteNav active="contact" />

      <section className={`pt-32 md:pt-44 ${wrap}`}>
        <FadeIn>
          <h1 className="t-d2">{invText("¿Hablamos?")}</h1>
          <p className="mt-8 max-w-[38ch] t-lead text-[var(--case-muted)]">
            {invText(
              "¿Tienes un proyecto en mente? Siempre estoy abierto a proyectos interesantes. Cuéntame en qué puedo ayudarte."
            )}
          </p>
        </FadeIn>
      </section>

      <section className={`mt-24 pb-12 ${wrap}`}>
        <FadeIn delay={STAGGER}>
          <ul className="border-t border-[var(--case-line)]">
            {[
              ["Email", EMAIL, `mailto:${EMAIL}`],
              ["LinkedIn", "in/anico", LINKEDIN],
            ].map(([k, v, href]) => (
              <li key={k} className="border-b border-[var(--case-line)]">
                <a
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="group flex items-baseline justify-between py-6"
                >
                  <span className={`t-label text-[var(--case-muted)] ${mono}`}>{k}</span>
                  <span className="inline-flex items-center gap-3 t-statement font-medium">
                    <RollText text={v} /> <Arrow />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </FadeIn>
      </section>
    </main>
  );
}
