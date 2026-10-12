import SiteNav from "@/components/case-study/SiteNav";
import { Eyebrow, FadeIn } from "@/components/case-study/primitives";

/* Contacto: email y LinkedIn de public/profile.txt; texto del bloque [contact]. */

const wrap = "px-4 md:px-6";
const mono = "font-[family-name:var(--font-case-mono)] uppercase tracking-[0.08em]";

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
          <Eyebrow>Contacto</Eyebrow>
          <h1 className="text-[clamp(64px,13vw,220px)] font-extrabold leading-[0.85] tracking-[-0.055em]">¿Hablamos?</h1>
          <p className="mt-8 max-w-[38ch] text-[clamp(18px,1.6vw,22px)] leading-[1.45] text-[var(--case-muted)]">
            ¿Tienes un proyecto en mente? Siempre estoy abierto a proyectos interesantes. Cuéntame en qué puedo
            ayudarte.
          </p>
        </FadeIn>
      </section>

      <section className={`mt-24 pb-12 ${wrap}`}>
        <FadeIn delay={0.1}>
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
                  <span className={`text-[12px] text-[var(--case-muted)] ${mono}`}>{k}</span>
                  <span className="text-[clamp(28px,4.4vw,64px)] font-medium tracking-[-0.035em] transition-opacity group-hover:opacity-70">
                    {v} <span aria-hidden>↗</span>
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
