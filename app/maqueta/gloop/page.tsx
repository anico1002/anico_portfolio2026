"use client";

import NextCase from "@/components/case-study/NextCase";
import SiteNav from "@/components/case-study/SiteNav";
import {
  Caption,
  CaseHero,
  CaseHeroOverlay,
  Eyebrow,
  FadeIn,
  MaskReveal,
  Parallax,
  Phone,
  Placeholder,
  WindowReveal,
} from "@/components/case-study/primitives";
import { STAGGER } from "@/lib/maqueta/motion";
import Lines from "@/components/case-study/Lines";
import SiteFooter from "@/components/case-study/SiteFooter";

/* Maqueta del caso de estudio de Gloop.
   Cajas y móviles grises = imágenes/vídeos que produce Alberto; el texto es borrador
   (en castellano para revisarlo; la web final va en inglés).
   Fondo blanco/negro común a toda la maqueta (selector sol/luna en el menú). */

// Énfasis por contraste de peso dentro de la misma familia (sin serif cursiva).
const em = "font-bold not-italic";
const mono = "t-tag"; // titulillos: estilo único en app/maqueta/system.css
const wrap = "px-4 md:px-6";
const grid = "grid grid-cols-12 gap-x-4 md:gap-x-6";

// Escala tipográfica (referencia Metalab a 1300 px: 56 · 40 · 20 · 16).
const tIntro = "t-intro";
const tStatement = "t-statement";
const tTitle = "t-title";
const tBody = "t-body";

const section = `pt-36 md:pt-56 ${wrap}`;

export default function GloopCase() {
  return (
    <main
      className="relative isolate min-h-screen bg-[var(--case-bg)] font-[family-name:var(--font-case-sans)] text-[var(--case-fg)] antialiased"
    >
      {/* Nav mínima */}
      <SiteNav />

      {/* 0 · Cabecera a pantalla completa. Desde la home, la miniatura crece hasta aquí
          (transición de página) y se queda como cabecera; encima entran, con barridos de
          máscara, el titular, la ficha y la intro. Composición asimétrica: titular abajo a
          la izquierda; ficha e intro en la columna de la derecha. */}
      <CaseHero
        videoReady
        poster={
          <Placeholder
            ratio="auto"
            className="h-full"
            src="/maqueta/gloop/cover.jpg"
            label="IMAGEN DE PORTADA · la misma que la miniatura de Gloop en la home."
          />
        }
        overlay={(t) => (
          <CaseHeroOverlay
            name="Gloop"
            delay={t}
            facts={[
              ["Proyecto", "App social para grupos de amigos"],
              ["Rol", "Lead Product Designer"],
              ["Entregables", "Estrategia · UX/UI · Design system · App nativa iOS"],
              ["Año", "2026 · En desarrollo"],
            ]}
          />
        )}
      >
        <Placeholder
          kind="vídeo"
          ratio="auto"
          className="h-full"
          src="/maqueta/gloop/media/hero.mp4"
          label="VÍDEO · la portada funde a él unos segundos después de llegar. App final en bucle, 1920×1080 mín."
        />
      </CaseHero>

      {/* 1 · Intro (al hacer scroll) a la izquierda + un móvil con el vídeo-resumen a la derecha */}
      <section className={`pt-24 md:pt-36 ${wrap}`}>
        <div className={`${grid} items-start gap-y-14`}>
          <div className="col-span-12 md:col-span-5 md:sticky md:top-28">
            <FadeIn>
              <Eyebrow>Introducción</Eyebrow>
            </FadeIn>
            <Lines className="t-title" delay={STAGGER}>
              La vida de un grupo de amigos está repartida entre chats, planes y fotos que nadie
              vuelve a mirar. Gloop la reúne en un solo lugar y la convierte en juego. Diseñé el
              producto de principio a fin, de la estrategia a una{" "}
              <em className={em}>app nativa lista para desarrollo</em>.
            </Lines>
          </div>
          {/* Un solo móvil: vídeo-resumen del flujo completo de la app, de principio a fin.
              Patrón común a todos los casos: primero la visión de conjunto, luego el detalle. */}
          <Parallax speed={90} className="col-span-12 md:col-span-4 md:col-start-8">
            <FadeIn>
              <Phone
                src="/maqueta/gloop/media/phone-overview.mp4"
                label="VÍDEO · overview del flujo completo de la app funcionando, de la primera pantalla al final (≈ 40–60 s en bucle)."
                className="mx-auto max-w-[360px]"
              />
            </FadeIn>
          </Parallax>
        </div>
      </section>

      {/* 3 · Prototipo vivo: antetítulo + frase, medio grande con pie lateral */}
      <section className={section}>
        <div className={grid}>
          <div className="col-span-12 md:col-span-8 md:col-start-3">
            <FadeIn>
              <Eyebrow>Prototipar para decidir</Eyebrow>
            </FadeIn>
            <Lines as="h2" className={tStatement} delay={STAGGER}>
              Validar cada decisión sobre producto real, no sobre maquetas.
            </Lines>
          </div>
        </div>
        <div className={`${grid} mt-16 items-end gap-y-6 md:mt-24`}>
          <FadeIn className="order-2 col-span-12 md:order-1 md:col-span-2">
            <Caption>
              Un prototipo de alta fidelidad desarrollado con IA recorre los diez escenarios de uso de
              principio a fin. Cada iteración se revisa en el dispositivo.
            </Caption>
          </FadeIn>
          <div className="m-bleed order-1 col-span-12 md:order-2 md:col-span-10">
            <MaskReveal from="top">
              <Placeholder
                kind="vídeo"
                src="/maqueta/gloop/media/prototipo.jpg"
                label="Prototipo navegable en un móvil sobre fondo de color (o fotograma de los vídeos por escenario). Horizontal."
              />
            </MaskReveal>
          </div>
        </div>
      </section>

      {/* 4 · Decisiones: tres filas alternas */}
      <section className={section}>
        <div className={grid}>
          <div className="col-span-12 md:col-span-8 md:col-start-3">
            <FadeIn>
              <Eyebrow>Las decisiones</Eyebrow>
            </FadeIn>
            <Lines as="h2" className={tStatement} delay={STAGGER}>
              Menos fricción en cada paso. Más razones para volver.
            </Lines>
          </div>
        </div>

        {[
          {
            t: "Entrar sin esperas",
            d: "Unirse a un equipo cuesta un toque. La confianza la aporta quien invita; la moderación actúa después, con cada entrada visible para todo el grupo.",
            src: "/maqueta/gloop/media/decision-unirse.mp4",
            ph: "Flujo de unirse a un equipo: invitación → dentro. 2–3 pantallas o vídeo corto.",
          },
          {
            t: "Un juego al día, por equipo",
            d: "Una pregunta diaria sobre alguien del grupo, que se responde en un minuto. El hábito que mantiene vivo cada equipo entre una salida y la siguiente.",
            src: "/maqueta/gloop/media/decision-diario.mp4",
            ph: "El juego del día dentro de un equipo: pregunta → respuesta → ranking.",
          },
          {
            t: "La noche elige el juego",
            d: "Al empezar la noche, una ruleta escoge el juego según quién está presente. Cero menús en la mesa de un bar.",
            src: "/maqueta/gloop/media/decision-ruleta.mp4",
            ph: "Vídeo de la ruleta: tarjeta → ruleta a pantalla completa → intro del juego.",
          },
        ].map((r, i) => (
          <div key={r.t} className={`${grid} mt-24 items-center gap-y-8 md:mt-40`}>
            <div className={`col-span-12 md:col-span-6 ${i % 2 ? "md:col-start-7 md:order-2" : "md:col-start-1"}`}>
              <MaskReveal from={i % 2 ? "right" : "left"} speed={i % 2 ? 150 : 90}>
                <Placeholder kind={i === 2 ? "vídeo" : "imagen"} ratio="4/5" src={r.src} label={r.ph} />
              </MaskReveal>
            </div>
            <div className={`col-span-12 md:col-span-4 ${i % 2 ? "md:col-start-2 md:order-1" : "md:col-start-8"}`}>
              <FadeIn>
                <p className={`${mono} t-label text-[var(--case-muted)]`}>0{i + 1}</p>
              </FadeIn>
              <Lines as="h3" className={`mt-3 ${tTitle}`} delay={STAGGER}>
                {r.t}
              </Lines>
              <FadeIn delay={2 * STAGGER}>
                <p className={`mt-4 text-[var(--case-muted)] ${tBody}`}>{r.d}</p>
              </FadeIn>
            </div>
          </div>
        ))}
      </section>

      {/* 5 · Pensar en los bordes: rejilla de tarjetas */}
      <section className={section}>
        <div className={`${grid} gap-y-6`}>
          <FadeIn className="col-span-12 md:col-span-3">
            <Eyebrow>Sin cabos sueltos</Eyebrow>
            <p className={tBody}>
              Un producto social se pone a prueba en sus casos límite: cuentas abiertas al cerrar la
              noche, grupos de dos, contenido que denunciar. Cada uno tiene una respuesta diseñada.
            </p>
          </FadeIn>
          {["Moderación: denunciar y bloquear", "Cerrar la noche con deudas", "Noches de 2 personas"].map((c, i) => (
            <div key={c} className="col-span-12 md:col-span-3">
              <MaskReveal from="bottom" speed={[60, 150, 100][i]}>
                <Placeholder ratio="3/4" label={`Tarjeta · ${c}`} />
              </MaskReveal>
            </div>
          ))}
        </div>
      </section>

      {/* 6 · La app por dentro: grupos por funcionalidad + vídeo */}
      <section className={section}>
        <div className={grid}>
          <div className="col-span-12 md:col-span-8 md:col-start-3">
            <FadeIn>
              <Eyebrow>La experiencia</Eyebrow>
            </FadeIn>
            <Lines as="h2" className={tStatement} delay={STAGGER}>
              Cuatro espacios alrededor de un mismo equipo: el grupo, la noche, los recuerdos y la cuenta.
            </Lines>
          </div>
        </div>
        <div className={`${grid} mt-16 gap-y-6 md:mt-24`}>
          <div className="m-bleed col-span-12 md:col-span-7">
            <MaskReveal from="top" speed={50}>
              <Placeholder ratio="4/3" src="/maqueta/gloop/media/exp-equipos.jpg" label="Equipos · composición con 2–3 pantallas del equipo y su foto como héroe." />
            </MaskReveal>
          </div>
          <div className="col-span-12 md:col-span-5 md:mt-28">
            <MaskReveal from="bottom" speed={170}>
              <Placeholder ratio="3/4" src="/maqueta/gloop/media/exp-noche.mp4" label="Noche · la noche en marcha (caras 2×2, marcador)." />
            </MaskReveal>
          </div>
          <div className="col-span-12 md:col-span-5">
            <MaskReveal from="top" speed={130}>
              <Placeholder ratio="3/4" src="/maqueta/gloop/media/exp-momentos.mp4" label="Momentos · visor tipo Stories / revelado a las 24 h." />
            </MaskReveal>
          </div>
          <div className="m-bleed col-span-12 md:col-span-7 md:mt-28">
            <MaskReveal from="bottom" speed={60}>
              <Placeholder ratio="4/3" src="/maqueta/gloop/media/exp-cuenta.mp4" label="La Cuenta · gastos, deudas calculadas, marcar pagado." />
            </MaskReveal>
          </div>
        </div>
      </section>

      {/* Vídeo de flujo: entrada normal (máscara). La única ventana que crece con el scroll
          se reserva para el momento fuerte, la app nativa. */}
      <div className={`mt-24 md:mt-32 ${wrap}`}>
        <MaskReveal from="bottom" speed={50} className="m-bleed">
          <Placeholder
            kind="vídeo"
            ratio="21/9"
            src="/maqueta/gloop/media/flujo-dia.mp4"
            label="Vídeo de flujo: un día cualquiera con tu equipo (recorte del vídeo 1)."
          />
        </MaskReveal>
      </div>

      {/* 7 · Experiencias y sus juegos */}
      <section className={section}>
        <div className={`${grid} items-end gap-y-6`}>
          <div className="col-span-12 md:col-span-4">
            <FadeIn>
              <Eyebrow>Experiencias</Eyebrow>
            </FadeIn>
            <Lines as="h2" className={tStatement} delay={STAGGER}>
              Dinámicas de fiesta llevadas a producto.
            </Lines>
            <FadeIn delay={2 * STAGGER}>
              <Caption className="mt-5">
                Formatos cortos para jugar en grupo y en persona, pensados para entenderse en segundos.
              </Caption>
            </FadeIn>
          </div>
          {["Podium", "Culpable", "De 0 a 100", "Clones"].map((g, i) => (
            <Parallax key={g} speed={[60, 150, 90, 180][i]} className="col-span-6 md:col-span-2">
              <FadeIn delay={i * STAGGER}>
                <Phone label={g} src={({ Podium: "/maqueta/gloop/media/game-podium.jpg", Culpable: "/maqueta/gloop/media/game-culpable.jpg", "De 0 a 100": "/maqueta/gloop/media/game-de0a100.jpg" } as Record<string, string>)[g]} />
              </FadeIn>
            </Parallax>
          ))}
        </div>
      </section>

      {/* 8 · ⭐ Del diseño al código nativo */}
      <section className={section}>
        <div className={grid}>
          <div className="col-span-12 md:col-span-10">
            <FadeIn>
              <Eyebrow>Del diseño al código</Eyebrow>
            </FadeIn>
            <Lines className={tIntro} delay={STAGGER}>
              El handoff es una <em className={`${em}`}>app nativa en SwiftUI</em>: funciona
              en dispositivo y vive en el repositorio del equipo de desarrollo.
            </Lines>
          </div>
        </div>
      </section>

      <div className="mt-24 md:mt-32">
        <WindowReveal>
          <Placeholder
            kind="vídeo"
            ratio="auto"
            className="h-full"
            src="/maqueta/gloop/media/nativa.mp4"
            label="La app nativa corriendo en el iPhone (grabación real o en mano). Liquid Glass, gestos, hápticos."
          />
        </WindowReveal>
      </div>

      <section className={`pt-24 md:pt-32 ${wrap}`}>
        <div className={`${grid} items-start gap-y-6`}>
          <div className="m-bleed col-span-12 md:col-span-8">
            <MaskReveal from="left" speed={50}>
              <Placeholder ratio="16/10" label="UI kit en el navegador: una regla con captura del simulador + código Swift con botón de copiar." />
            </MaskReveal>
          </div>
          <div className="col-span-12 md:col-span-4">
            <MaskReveal from="right" speed={160}>
              <Placeholder kind="diagrama" ratio="4/5" label="Las cuatro capas: comportamiento nativo · controles nativos vestidos · superficies de marca · momentos firma." />
            </MaskReveal>
            <FadeIn>
              <Caption className="mt-5">
                Un sistema documentado regla a regla, con el porqué de cada decisión y su código en
                Swift. El criterio de base: lo nativo primero, la marca donde aporta significado y lo
                propio solo en los momentos clave.
              </Caption>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 9 · Cómo trabajo con IA: flujo + cifras gigantes (gesto Yakushev) */}
      <section className={section}>
        <div className={grid}>
          <div className="col-span-12 md:col-span-8 md:col-start-3">
            <FadeIn>
              <Eyebrow>Diseño con IA</Eyebrow>
            </FadeIn>
            <Lines as="h2" className={tStatement} delay={STAGGER}>
              La IA acelera la construcción. El criterio sigue siendo de diseño.
            </Lines>
            <FadeIn delay={2 * STAGGER}>
              <p className={`mt-6 max-w-[52ch] text-[var(--case-muted)] ${tBody}`}>
                Claude Code interviene en el prototipado, en los vídeos de recorrido y en el desarrollo
                en SwiftUI. Ninguna pantalla avanza sin pasar antes por revisión de diseño.
              </p>
            </FadeIn>
          </div>
        </div>
        <div className="m-bleed mt-16 md:mt-24">
          <MaskReveal from="bottom">
            <Placeholder kind="diagrama" ratio="21/9" label="Flujo: idea → prototipo en código → vídeos automáticos → app nativa → repo del dev. Con iconos/capturas de cada paso." />
          </MaskReveal>
        </div>
        <div className="mt-28 md:mt-40">
          {[
            ["10", "escenarios de uso prototipados"],
            ["03", "idiomas desde el primer día"],
            ["01", "app nativa en manos de desarrollo"],
          ].map(([n, l]) => (
            <FadeIn key={l}>
              <div className={`${grid} items-end border-t border-[var(--case-line)] pt-4`}>
                <p className="col-span-12 t-d1 md:col-span-7">
                  {n}
                </p>
                <p className={`col-span-12 pb-3 md:col-span-4 md:col-start-9 ${tBody} text-[var(--case-muted)]`}>{l}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* 10 · Estado + siguiente caso */}
      <section className={section}>
        <div className={grid}>
          <div className="col-span-12 md:col-span-8 md:col-start-3">
            <FadeIn>
              <Eyebrow>Próximos pasos</Eyebrow>
            </FadeIn>
            <Lines className={tStatement} delay={STAGGER}>
              Gloop está en desarrollo. La base nativa y el sistema ya están con el equipo; la siguiente fase lleva las experiencias completas a la app.
            </Lines>
          </div>
        </div>
      </section>

      <section className="mt-36 overflow-hidden md:mt-56">
        <NextCase name="El Reto MasterChef" href="/maqueta/elreto-masterchef" thumb="/projects/elreto-masterchef/ElReto_thumb.png" />
      </section>
      {/* Pie común (E2): «¿Hablamos?» + franja con email, LinkedIn y volver arriba. */}
      <SiteFooter />
    </main>
  );
}
