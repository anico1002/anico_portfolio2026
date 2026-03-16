# INIT — Estado del proyecto (anico portfolio)

Documento único para que cualquier IA entienda el proyecto sin leer el resto del código. **Leer solo este archivo.**

---

## 1. Qué es el proyecto

- **Portfolio web** de **anico**, Senior Designer.
- **Idioma:** solo inglés (locale fijado a `"en"` en `context/AppContext.tsx`; no hay detección de idioma).
- **Título/marca:** "anico | Senior Designer" (metadata y títulos de proyecto).

---

## 2. Stack técnico

- **Next.js 16**, React 19, TypeScript.
- **Tailwind CSS 4** (PostCSS).
- **framer-motion** (parallax, scroll, animaciones).
- **lucide-react** (iconos).
- **Fuente:** Inter (Google Font) en toda la app.

---

## 3. Estructura de carpetas y archivos clave

```
app/
  layout.tsx          # Root layout, metadata, AppProvider, ViewportEffects
  page.tsx            # Home: Nav, Hero, Marquee, Work, About, Contact, Footer
  globals.css         # Tailwind, marquee, bounce-down
  proyecto/[slug]/page.tsx   # Página de detalle de proyecto

components/
  Nav.tsx             # Header fijo: logo SVG (anico_logo.svg) + Projects, About, Contact
  Hero.tsx            # Hero home: carousel de imágenes (heroImages prop), parallax, título en 2 líneas, flecha abajo con bounce
  Marquee.tsx         # Banda de texto infinito (disciplinas)
  Work.tsx            # Masonry grid de proyectos (cards con thumbnail, nombre, categoría, año). Layout flex con columnas explícitas via useColumnCount hook (md=2cols, 2xl=3cols); orden row-first (izq→der, arriba→abajo); alturas libres por ratio natural del thumb
  About.tsx           # Foto (public/about.webp, object-right) + bio + disciplinas en labels/pills; ScrollReveal entrada vertical (y=50) como el resto
  Contact.tsx         # Título + descripción + 2 iconos: Mail (mailto) y LinkedIn (enlace)
  Footer.tsx          # Copyright centrado; en proyecto muestra "Back to home"
  ProyectoDetail.tsx  # Detalle: ProjectHero, meta, overview, botón CTA (sin icono), challenge/process, bloques de imágenes (full width en móvil), outcomes (stats con numeritos 01/02…), sin Tools/Design stack, prev/next
  ProjectHero.tsx     # Hero de proyecto: imagen con parallax, título que baja al scroll
  ImageFadeSlideshow.tsx  # Carrusel por fade (1a,1b,1c…); detecta aspect ratio de la primera imagen, full width, sin fondo gris, object-cover
  ScrollReveal.tsx    # Reveal al scroll (framer-motion): entrada vertical por defecto (y=60, x=0); About/Work usan y
  ScrollProgress.tsx  # Barra de progreso de scroll (arriba)
  ViewportEffects.tsx # ScrollProgress (barra de scroll); CustomCursor eliminado
  CustomCursor.tsx    # Existe pero no se usa (cursor del sistema)
  Skills.tsx          # Existe pero NO se usa en la home (eliminado del page)

lib/
  i18n.ts             # Traducciones en/en (solo en se usa); about, contact, hero, nav, work, project, skills, contact
  projects.ts         # Lista estática de proyectos (Project type) + getProjectBySlug
  scan-project.ts     # getScannedProject(slug), getEnrichedProjects(); mezcla projects + carpetas en public/projects/
  get-hero-images.ts  # getHeroImages(): lee public/hero-imgs y devuelve URLs para el hero home
  project-translations.ts  # getLocalizedProject(project, locale)
  parse-content.ts    # Parse de content.txt por proyecto

context/
  AppContext.tsx      # locale = "en" fijo (sin detección)

public/
  anico_logo.svg      # Logo de marca (usado en Nav y header de proyecto)
  about.webp         # Foto de la sección About (img nativo, object-right)
  hero-imgs/          # Imágenes del carousel del hero home (orden alfabético, loop infinito)
  projects/           # Una carpeta por proyecto: <slug>/; opcional xxx_hero.(png|jpg|…) = imagen hero bajo el titular; content.txt; subcarpetas 01_Titulo, 02_Titulo…
```

---

## 4. Datos y contenido

- **Proyectos:** Definidos en `lib/projects.ts` y enriquecidos con `lib/scan-project.ts`:
  - Si existe `public/projects/<slug>/`, se escanean imágenes y subcarpetas `NN_Nombre` (secciones). **Imagen hero:** archivo `*_hero.(png|jpg|…)` en la raíz de la carpeta del proyecto (ej. `Disney_hero.png`) → se usa como hero bajo el titular; si no existe, se usa la primera imagen del proyecto.
  - **content.txt es la fuente de verdad del texto:** overview, challenge, process, outcome se fusionan desde el escaneo en getEnrichedProjects; variantes `[overview.es]` etc. en localizations. Página de proyecto con `dynamic = "force-dynamic"` para que los cambios en content.txt se vean al recargar.
  - content.txt: metadata, `[overview]`, `[button]` (una línea: "Label https://..."), `[challenge]`, `[process]`, `[outcome]`, `[stats]` (una línea = una caja, texto exacto; numeritos 01, 02… dentro de cada caja), `[links]`.
  - Imágenes se agrupan por número (1a, 1b → slideshow; una sola → imagen).
  - **Ocultos en la lista:** `DISABLED_PROJECT_SLUGS = ["fundfy", "some-logos", "telepport"]` en scan-project.ts.

- **Hero home:** Imágenes desde `public/hero-imgs/` (getHeroImages()). Loop infinito entre todas. Sin rayitas ni nombre de proyecto; solo flecha abajo con animación bounce.

- **About:** Texto en `lib/i18n.ts` (about.bio, about.disciplines). Imagen local `public/about.webp` (etiqueta `<img>`, object-right). Disciplinas como pills/labels.

- **Contacto:** Email `hola@anico.es` (i18n + mailto). Solo iconos: Mail y LinkedIn (https://es.linkedin.com/in/anico). Sin Dribbble ni GitHub.

- **Footer:** Copyright "© 2026 anico. All rights reserved." (i18n). Centrado. Sin "Designed with".

---

## 5. Páginas y flujos

- **Home (/):** Nav → Hero (imágenes de hero-imgs, parallax, título "Crafting digital" / "Experiences") → Marquee → Work (grid proyectos) → About → Contact → Footer.

- **Proyecto (/proyecto/[slug]):** Header fijo (flecha back + logo + año). ProyectoDetail: **hero** (imagen `xxx_hero` en carpeta del proyecto, o primera imagen si no hay), meta, overview, **botón CTA** sin icono (si `[button]` en content.txt), challenge/process, bloques de imágenes, outcomes, prev/next. **Contenido textual:** solo content.txt (overview, challenge, process, outcome); actualizar ese archivo y recargar.
  - **Imágenes:** una columna; full width; sin huecos. Imagen única: altura natural. **Slideshow (1a,1b,1c…):** ImageFadeSlideshow detecta el aspect ratio de la primera imagen y ajusta la caja a esa altura (sin fondo gris); object-cover; todas las fotos del mismo slideshow pueden ser la misma medida para elegir altura libremente.
  - **Outcomes:** solo si hay `[stats]` con líneas; cada línea = una caja con numerito 01, 02… y el texto exacto; grid 4 columnas.
  - **Sin módulo Tools / Design stack.** Al final prev/next. Footer "Back to home".

---

## 6. Convenciones de UI

- **Logo:** `public/anico_logo.svg`, tamaño ~0.7x (h-[22px] w-auto). En headers con texto blanco se usa `invert` para que se vea claro.
- **Cursor:** cursor del sistema (CustomCursor eliminado; body sin cursor-none).
- **Barra de scroll:** ScrollProgress fija arriba, por encima del hero.
- **Contenedor de contenido:** `max-w-6xl mx-auto` con padding `px-6 md:px-12` (y en proyecto `lg:px-24` en la section) para alinear textos y bloques.
- **Imágenes en detalle de proyecto (móvil):** full width como el hero; wrapper `w-screen relative left-1/2 -translate-x-1/2` en móvil, `md:relative md:left-0 md:translate-x-0 md:w-full` en desktop; sección con `overflow-x-hidden`.
- **Imágenes locales de proyectos:** Rutas `/projects/<slug>/...`; en muchos sitios se usa `unoptimized` o `<img>` para evitar fallos de carga.

---

## 7. Estado actual resumido

| Área            | Estado |
|----------------|--------|
| Idioma         | Solo inglés (locale "en") |
| Hero home      | Imágenes en `public/hero-imgs/`, loop infinito, parallax, sin indicadores |
| About          | Foto `public/about.webp`, disciplinas en pills; animación entrada vertical (y=50), sin stats ni "That's me" |
| Contact        | hola@anico.es, solo Mail + LinkedIn |
| Footer         | © 2026, centrado, sin tagline |
| Logo           | anico_logo.svg en Nav y header proyecto (0.7x) |
| Proyectos      | Masonry grid, orden row-first; thumbs con ratio natural (cambia dimensiones del archivo para controlar altura); enriquecidos desde `lib/projects.ts` + `public/projects/<slug>/`; 3 slugs deshabilitados |
| Página proyecto| Texto desde content.txt; botón CTA sin icono; imágenes/slideshows full width (slideshow: aspect ratio detectado, sin fondo gris); Outcomes con numeritos; sin Tools/Design stack; force-dynamic |

---

## 8. Cómo seguir trabajando

- **Añadir hero home:** Añadir imágenes en `public/hero-imgs/` (orden alfabético). **Hero de un proyecto:** poner en la carpeta del proyecto una imagen `*_hero.png` (o .jpg, etc.), ej. `Disney_hero.png` en `public/projects/disney-karting/`.
- **Cambiar textos:** `lib/i18n.ts` (home, about, contact, etc.). **Textos de proyectos:** solo `public/projects/<slug>/content.txt` ([overview], [challenge], [process], [outcome]); recargar la página del proyecto.
- **Cambiar email/contacto:** `lib/i18n.ts` → contact.email; enlace LinkedIn en `components/Contact.tsx`.
- **Cambiar copyright:** `lib/i18n.ts` → contact.copyright.
- **Añadir/quitar proyectos:** `lib/projects.ts` y/o carpetas en `public/projects/`; deshabilitar en `DISABLED_PROJECT_SLUGS` en scan-project.ts.
- **Foto About:** Sustituir `public/about.webp` o cambiar la ruta en About.tsx.

---

*Última actualización: Hero de proyecto desde imagen xxx_hero.(png|jpg|…) en la carpeta del proyecto; slideshow con aspect ratio detectado; contenido desde content.txt. Next 16, React 19, Tailwind 4, solo inglés.*
