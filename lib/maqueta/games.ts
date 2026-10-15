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
      eyebrow: "Dirección de arte",
      title: "Explorar antes de decidir.",
      bleed: true,
      body: "Auditoría de los grandes de consola —Forza Horizon, Gran Turismo, Need for Speed— y playtests internos para localizar la fricción heredada del móvil.",
      items: [
        seq("02_First-Art-Direction-Exploration/A92023_01", "abcdef"),
        "02_First-Art-Direction-Exploration/A92023_02.mp4",
        "02_First-Art-Direction-Exploration/A92023_03.png",
      ],
    },
    {
      eyebrow: "Design system",
      title: "Un sistema pensado para el mando.",
      body: "Paleta, botones, barras de navegación y sus estados, documentados para consola y móvil.",
      // La primera lámina abre con «DESIGN SYSTEM» en grande: lo dice ya el titular del bloque.
      items: [{ src: "03_Game-UI/AU_1.png", crop: { top: 340 } }, "03_Game-UI/AU_2.png", "03_Game-UI/AU_3.png"],
    },
    {
      eyebrow: "Cards",
      title: "Clases de vehículo que se leen desde el sofá.",
      body: "Renders a gran formato, tipografía contundente y un sistema de niveles por color que se lee al instante en una televisión.",
      items: ["03_Game-UI/AU_4.png"],
    },
    {
      eyebrow: "Pantallas de consola",
      title: "Un menú que transmite escala antes de la primera carrera.",
      items: [seq("04_Console-screens/AU_7", "abcdefg")],
    },
  ],

  cybertitans: [
    { bleed: true, items: ["01_Game-UI/CT_1.png"] },
    {
      eyebrow: "UI del juego",
      title: "Precisión quirúrgica para mucha información.",
      body: "Del HUD de combate a matchmaking, tienda e inventario: un design system modular para escritorio y móvil.",
      items: ["01_Game-UI/CT_2.png", "01_Game-UI/CT_3.png"],
    },
    {
      eyebrow: "Logo y tipografía",
      title: "Una tipografía hecha a medida como ADN técnico.",
      body: "Diseñada para leerse en cualquier punto de contacto y alejarse de los tópicos ciberpunk.",
      items: ["02_Logo-& -Typeface-Design/CT_logo_1.png", "02_Logo-& -Typeface-Design/CT_logo_2.png"],
    },
    {
      eyebrow: "Prototipos",
      title: "El combate y la escalera competitiva, en movimiento.",
      bleed: true,
      items: ["03_Crystal-Battle-Prototype/cybertitans_battle.mp4", "04_Ladder-Prototype/cybertitans_ladder.mp4"],
    },
  ],

  "disney-karting": [
    { bleed: true, items: ["01_Game-UI/dk_01.png"] },
    {
      eyebrow: "UI del juego",
      title: "La calidez de Disney con estándares casi AAA.",
      body: "Paletas vivas, tipografía expresiva e iconografía protagonizada por los personajes.",
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
  act: [
    { bleed: true, items: ["ACT_10.png"] },
    {
      eyebrow: "Logo",
      title: "Tres letras en un solo trazo.",
      body: "Las letras de ACT encajan una dentro de otra hasta formar un único símbolo.",
      items: ["ACT_9.png"],
    },
    {
      eyebrow: "La home",
      title: "Todo empieza con una pregunta.",
      body: "¿Empresa o talento de élite? La portada se lo pregunta a cada visitante y le abre su propio camino.",
      items: ["ACT_1.png", "ACT_2.png", "ACT_3.png", "ACT_4.png", "ACT_5.png"],
    },
    {
      eyebrow: "Interacción",
      title: "Elegir lado con el cursor.",
      body: "Al pasar por encima, cada mitad se tiñe del azul de la marca.",
      items: [seq("ACT_6", "abc")],
    },
    {
      eyebrow: "El recorrido",
      title: "Una segunda carrera, paso a paso.",
      body: "Las páginas interiores ordenan mucha información para que quien contrata detecte el talento de un vistazo.",
      items: ["ACT_8.png", "ACT_11.png"],
    },
    {
      eyebrow: "Comunidad",
      title: "La misma energía, fuera de la web.",
      bleed: true,
      body: "Piezas para redes y un punto de encuentro en Discord.",
      items: ["ACT_7.png"],
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
