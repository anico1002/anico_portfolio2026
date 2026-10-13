/* Games como escaparate gráfico (2026-10-13, Alberto): a diferencia de Product, aquí no hay casos
   de éxito largos. Las láminas ya estaban diseñadas para ir una encima de otra con continuidad,
   así que se maquetan en vertical, a todo el ancho y sin hueco, como en la web actual; los cortes
   son los puntos donde cambia de tema la serie, y en cada uno va un texto breve (titulillo +
   titular + como mucho una línea) con el estilo del resto de la web.

   Rutas relativas a public/projects/<slug>/ (los originales no se tocan). Un array = pase de
   diapositivas (series a, b, c…). `crop` recorta en pantalla, sin generar archivos, la franja de
   arriba de una lámina cuando lleva dibujado un título que ya dice el texto del bloque. */

export type GameItem =
  | string
  | string[]
  | { src: string; crop: { top: number } };

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
};
