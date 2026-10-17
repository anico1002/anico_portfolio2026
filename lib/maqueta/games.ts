/* Games como escaparate gráfico (2026-10-13, Alberto): a diferencia de Product, aquí no hay casos
   de éxito largos. Las láminas ya estaban diseñadas para ir una encima de otra con continuidad,
   así que se maquetan en vertical, a todo el ancho y sin hueco, como en la web actual; los cortes
   son los puntos donde cambia de tema la serie, y en cada uno va un texto breve (titulillo +
   titular + como mucho una línea) con el estilo del resto de la web.

   Rutas relativas a public/projects/<slug>/ (los originales no se tocan). Un array = pase de
   diapositivas (series a, b, c…). Una ruta que empieza por «/» es de public/ (medios propios de la
   maqueta). `crop` recorta en pantalla, sin generar archivos, la franja de
   arriba de una lámina cuando lleva dibujado un título que ya dice el texto del bloque (`left`, la
   franja de la izquierda, para el título que va al lado del contenido y no encima).

   Desde 2026-10-15 los casos de «Marca y web» (Obliq, ACT, GM World!, Metacampus) se tratan igual:
   sus láminas también se diseñaron para enlazar unas con otras. Mismo criterio de cortes; donde la
   lámina abre con el titular numerado del manual («02/ ISOTYPE»…), se recorta y lo dice el texto. */

export type GameItem =
  | string
  | string[]
  | { src: string; crop?: { top?: number; left?: number }; bg?: string };

export type GameBlock = {
  /** Sin titulillo ni titular: lámina de portada (el logo del juego), justo después de la intro. */
  eyebrow?: string;
  title?: string;
  body?: string;
  /** A sangre (de borde a borde de la pantalla) con un parallax sutil dentro de cada imagen: para
      las láminas que lo aguantan (portadas, exploraciones de arte, marketing con fondo de color,
      pases fotográficos, vídeos). La documentación de UI se queda con márgenes. */
  bleed?: boolean;
  items: GameItem[];
};

const seq = (base: string, letters: string, ext = "png") => [...letters].map((l) => `${base}${l}.${ext}`);

export const GAME_BLOCKS: Record<string, GameBlock[]> = {
  "asphalt-unite": [
    { bleed: true, items: ["01/AU_1.png"] },
    {
      eyebrow: "Art direction",
      title: "Study the greats, then go our own way.",
      bleed: true,
      body: "We took apart Forza Horizon, Gran Turismo and Need for Speed, then ran internal playtests to find every flow that still felt like a phone.",
      items: [
        seq("02_First-Art-Direction-Exploration/A92023_01", "abcdef"),
        "02_First-Art-Direction-Exploration/A92023_02.mp4",
        "02_First-Art-Direction-Exploration/A92023_03.png",
      ],
    },
    {
      eyebrow: "Design system",
      title: "A design system built for the gamepad.",
      body: "Palette, buttons, navigation bars and every state, documented once for console, PC and mobile. One crossplatform system.",
      // La primera lámina abre con «DESIGN SYSTEM» en grande: lo dice ya el titular del bloque.
      items: [{ src: "03_Game-UI/AU_1.png", crop: { top: 340 } }, "03_Game-UI/AU_2.png", "03_Game-UI/AU_3.png"],
    },
    // Las cards, sin texto (Alberto, 2026-10-17): la imagen sube y sigue al design system.
    { items: ["03_Game-UI/AU_4.png"] },
    {
      eyebrow: "Console screens",
      title: "Events, garage and races, all one thumbstick away.",
      items: [seq("04_Console-screens/AU_7", "abcdefg")],
    },
  ],

  cybertitans: [
    { bleed: true, items: ["01_Game-UI/CT_1.png"] },
    {
      eyebrow: "Game UI",
      title: "Surgical precision for a crowded screen.",
      body: "From the combat HUD to matchmaking, shop and inventory: one modular design system for desktop and mobile.",
      items: ["01_Game-UI/CT_2.png", "01_Game-UI/CT_3.png"],
    },
    {
      eyebrow: "Logo and typeface",
      title: "Its own letters, its own voice.",
      body: "A typeface drawn for the game gives it a voice of its own: technical, confident and recognisable on any screen, from the menu to the poster.",
      items: ["02_Logo-& -Typeface-Design/CT_logo_1.png", "02_Logo-& -Typeface-Design/CT_logo_2.png"],
    },
    {
      eyebrow: "Prototypes",
      title: "Battles and rankings, in motion.",
      bleed: true,
      items: ["03_Crystal-Battle-Prototype/cybertitans_battle.mp4", "04_Ladder-Prototype/cybertitans_ladder.mp4"],
    },
  ],

  "disney-karting": [
    { bleed: true, items: ["01_Game-UI/dk_01.png"] },
    {
      eyebrow: "Game UI",
      title: "Disney charm, near-AAA polish.",
      body: "Bright palettes, expressive type and icons starring the characters themselves.",
      items: ["01_Game-UI/dk_02.png", "01_Game-UI/dk_03.png", "01_Game-UI/dk_04.png"],
    },
    {
      eyebrow: "Exploraciones gráficas",
      title: "Un tono maduro sin perder la magia.",
      bleed: true,
      body: "Rondas de exploración sobre las pantallas clave: selección de personaje, previa de carrera, clasificaciones y personalización.",
      items: [
        seq("02_Graphic-Explorations/dk_05", "abcdef"),
        ["a", "b", "c"].map((l) => `02_Graphic-Explorations/dk_06${l}.jpg`).concat(seq("02_Graphic-Explorations/dk_06", "de")),
        [
          "02_Graphic-Explorations/dk_07a.png",
          "02_Graphic-Explorations/dk_07b.png",
          "02_Graphic-Explorations/dk_07c.png",
          "02_Graphic-Explorations/dk_07d.jpg",
          "02_Graphic-Explorations/dk_07e.png",
          "02_Graphic-Explorations/dk_07f.jpg",
        ],
        seq("02_Graphic-Explorations/dk_08", "abcdef", "jpg"),
      ],
    },
    {
      eyebrow: "Marketing",
      title: "Un brief, una sola voz visual.",
      bleed: true,
      items: ["03_Marketing-Exploration/dk_1.png", "03_Marketing-Exploration/dk_2.png", "03_Marketing-Exploration/dk_3.png"],
    },
  ],

  "asphalt-9": [
    { bleed: true, items: ["01_Game-UI/A9_1.png"] },
    {
      eyebrow: "UI del juego",
      title: "Velocidad, nitro y posición, sin tapar el espectáculo.",
      body: "Los vehículos se presentan como fotografía de automoción; los menús, con una metáfora espacial para saber siempre dónde estás.",
      items: ["01_Game-UI/A9_2.png", "01_Game-UI/A9_3.png", "01_Game-UI/A9_4.png", "01_Game-UI/A9_5.png"],
    },
    {
      eyebrow: "Exploraciones de marketing",
      title: "La misma ambición fuera del juego.",
      bleed: true,
      items: [seq("02_Marketing-Exploration/A9_6", "abcdefg"), "02_Marketing-Exploration/A9_7.png"],
    },
    {
      eyebrow: "Exploraciones gráficas",
      title: "Probar el lenguaje hasta encontrarlo.",
      items: ["03_Graphic-Explorations/A9_8.png", "03_Graphic-Explorations/A9_9.png", "03_Graphic-Explorations/A9_10.png"],
    },
  ],

  "asphalt-xtreme": [
    { items: ["01_Game-UI/AXT1.png"] },
    {
      eyebrow: "UI del juego",
      title: "Tierra, polvo y contraste en lugar de luces de ciudad.",
      body: "Una identidad doble: familiar para los fans y lo bastante distinta para anunciar la nueva jugabilidad.",
      items: ["01_Game-UI/AXT2.png", "01_Game-UI/AXT3.png", "01_Game-UI/AXT4.png", "01_Game-UI/AXT5.png"],
    },
    {
      eyebrow: "Splash screens 3D",
      title: "Del boceto al render.",
      bleed: true,
      body: "Cada pantalla de carga, paso a paso: escenario, modelo, materiales y luz.",
      items: [seq("02_3D-Splash-screens-process/AXT6", "abcd"), "02_3D-Splash-screens-process/AXT7.png"],
    },
    {
      eyebrow: "Marketing",
      title: "Listo para las tiendas.",
      body: "Key art, piezas promocionales y capturas para App Store y Google Play.",
      items: ["03_Marketing-Exploration/AXT8.png"],
    },
  ],

  /* ───────────── EL RETO (2026-10-15, de caso a medida a proyecto vertical) ─────────────
     Abre con el recorrido completo de la app real en la mano sobre una mesa de tortitas desenfocada
     (recetas/elreto-flow.json); la cabecera y la miniatura, la misma app sobre la roca (elreto-hero-app.json). Cortes donde cambia el apartado del manual; los
     titulares que lleva la lámina («El Reto Brand Guidelines», «Brand Identity El Reto 2025»,
     «App proposal») se recortan y los dice el texto. 9–10 y 11–12 van enlazadas: no se parten. */
  "elreto-masterchef": [
    // Sin el logo naranja pegado (feedback 2026-10-17): solo la app real en la mano, sobre las tortitas.
    { bleed: true, items: ["/maqueta/elreto/media/flow.mp4"] },
    {
      eyebrow: "Brand guidelines",
      title: "A brand that lives alongside MasterChef.",
      body: "Logos for the app and the TV screen, colors and typefaces, ready for any format.",
      items: [{ src: "01/ElReto_2.png", crop: { top: 336 } }, "01/ElReto_3.png", "01/ElReto_4.png", "01/ElReto_5.png"],
    },
    {
      eyebrow: "Identity",
      title: "Gamification, under control.",
      body: "A competitive, aspirational system built to produce fast, in the app and on social.",
      items: [{ src: "02_Brand-Identity/ElReto_8.png", crop: { top: 400 } }],
    },
    {
      eyebrow: "Atmosphere",
      title: "Competition cooking.",
      bleed: true,
      body: "Premium game lighting and the flavor of every challenge: the brand comes alive on every screen.",
      // Feedback de Alberto (2026-10-15): fuera los textos de «Piezas» y «La app»; sus láminas van aquí.
      items: [
        "02_Brand-Identity/ElReto_9.png",
        "02_Brand-Identity/ElReto_10.png",
        "02_Brand-Identity/ElReto_11.png",
        "02_Brand-Identity/ElReto_12.png",
        { src: "02_Brand-Identity/ElReto_13.png", crop: { top: 240 } },
        "03_App-Design/ElReto_14.png",
      ],
    },
  ],

  /* ───────────── MARCA Y WEB (2026-10-15) ───────────── */

  // Cortes: home (1–4, una sola página) · estudio (5–9, otra página) · vídeo · manual. Sin lámina
  // de portada: el logo animado (GIF, casi todo negro) se perdía sobre el fondo oscuro; cierra el
  // manual, detrás de las aplicaciones.
  obliq: [
    // La home abre sin texto, justo después de la intro (2026-10-15, Alberto).
    { items: ["01/obliq_1.png", "01/obliq_2.png", "01/obliq_3.png", "01/obliq_4.png"] },
    {
      eyebrow: "El estudio",
      title: "Con la luz encendida.",
      body: "La página del estudio pasa al blanco para presentar al equipo, su manifiesto y los directores con los que trabaja.",
      items: ["01/obliq_5.png", "01/obliq_6.png", "01/obliq_7.png", "01/obliq_8.png", "01/obliq_9.png"],
    },
    {
      eyebrow: "En movimiento",
      title: "Vídeo pesado, carga ligera.",
      body: "Reels en alta calidad que entran sin mover una línea de la maqueta.",
      items: ["01/obliq_10.mp4"],
    },
    {
      eyebrow: "Logo y manual",
      title: "Todo parte de una línea oblicua.",
      bleed: true,
      body: "La «I» inclinada del logotipo marca el ángulo de todo el sistema, del isotipo a los patrones gráficos.",
      items: [
        seq("02_Logo-&-Brandbook/obliq_11", "abcdef"),
        "02_Logo-&-Brandbook/obliq_12.png",
        // El logo animado: el GIF original (transparente, 256 colores con borde tramado, 832 KB) pasado
        // a MP4 sobre blanco, con el borde limpio y a 1920 (228 KB). Fuera de public/projects para que
        // la web actual no lo cuente como lámina.
        "/maqueta/obliq/logo-anim.mp4",
      ],
    },
  ],

  // ACT_1–5 son la home de arriba abajo (la rejilla de fondo pasa de una a otra): no se parte.
  // Feedback de Alberto (2026-10-15): abre con la progresión del logo encima de todo, como en la web
  // actual; fuera los textos de «Logo», «Interacción» y «Comunidad» (sus láminas suben al bloque de
  // arriba). Pendiente: movimiento en el portátil (ACT_11) a partir de un prototipo de Figma suyo.
  act: [
    { bleed: true, items: ["ACT_9.png", "ACT_10.png"] },
    {
      eyebrow: "La home",
      title: "Todo empieza con una pregunta.",
      body: "¿Empresa o talento de élite? La portada se lo pregunta a cada visitante y le abre su propio camino.",
      items: ["ACT_1.png", "ACT_2.png", "ACT_3.png", "ACT_4.png", "ACT_5.png", seq("ACT_6", "abc")],
    },
    {
      eyebrow: "El recorrido",
      title: "Una segunda carrera, paso a paso.",
      body: "Las páginas interiores ordenan mucha información para que quien contrata detecte el talento de un vistazo.",
      items: ["ACT_8.png", "ACT_11.png", "ACT_7.png"],
    },
  ],

  // Las láminas son el manual, con sus titulares numerados («02/ ISOTYPE»…) dibujados arriba: cada
  // corte va donde empieza un apartado y el recorte quita ese titular, que pasa al texto. GM4 y GM5
  // comparten unos arcos de fondo casi blancos; se parten igual porque GM5 abre apartado (05).
  "gm-world": [
    { bleed: true, items: [{ src: "GM1.png", crop: { top: 180 } }] },
    {
      eyebrow: "Isotipo",
      title: "Cada ciudad, una inicial que se expande.",
      body: "W de World, E de Eindhoven, V de Valencia, B de Barcelona. La expansión habla de una tecnología que hace crecer todo lo que toca.",
      items: [{ src: "GM2.png", crop: { top: 400 } }],
    },
    {
      eyebrow: "Color",
      title: "Un degradado de base y un acento por sede.",
      bleed: true,
      body: "Eindhoven suma el naranja holandés; Valencia, el azul mediterráneo; Barcelona, el fucsia catalán.",
      items: [{ src: "GM3.png", crop: { top: 470 } }],
    },
    {
      eyebrow: "Recursos",
      title: "El símbolo, convertido en patrón.",
      body: "Sus curvas decoran las piezas, enmascaran imágenes y dan pie a la animación.",
      items: [{ src: "GM4.png", crop: { top: 370 } }],
    },
    {
      eyebrow: "Otros usos",
      title: "Un logotipo que se adapta al soporte.",
      items: [{ src: "GM5.png", crop: { top: 240 } }],
    },
    {
      eyebrow: "Aplicaciones",
      title: "Del escenario a la tarjeta del ponente.",
      bleed: true,
      body: "Acreditaciones, entradas, pulseras y pantallas para la edición de Eindhoven.",
      items: [{ src: "GM6.png", crop: { top: 245 } }],
    },
    {
      eyebrow: "La web",
      title: "Preparada para las próximas ediciones.",
      body: "Ponentes, programa y patrocinadores, con la cuenta atrás hasta el evento. También en el móvil.",
      // GM7–9 son una sola página. En la del móvil, «08/ MOBILE WEB VERSION» va al lado del iPhone.
      items: [
        { src: "GM7.png", crop: { top: 190 } },
        "GM8.png",
        "GM9.png",
        { src: "GM_mobile.png", crop: { left: 340 } },
      ],
    },
  ],

  // MC_2–5 comparten fondo gris; el corte va donde el manual pasa de los cimientos (01) a los
  // componentes (02). Sus rótulos van al lado del contenido y no se pueden recortar.
  metacampus: [
    { bleed: true, items: ["MC_1.png"] },
    {
      eyebrow: "Design system",
      title: "Cuatro pilares, cuatro formas, un sistema.",
      body: "Web3, IA, metaverso y comunidad. Cada pilar tiene su forma y su color, y juntos construyen todo el lenguaje, del logotipo a los botones.",
      items: ["MC_2.png", "MC_3.png", "MC_4.png"],
    },
    {
      eyebrow: "Componentes",
      title: "Flexible sin perder la coherencia.",
      body: "Navegación, buscador y acceso, prototipados en Figma y listos para desarrollo.",
      items: ["MC_5.png"],
    },
  ],
};
