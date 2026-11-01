/* Contenido de los casos de la maqueta (borrador en castellano; la web final va en inglés).
   Los medios salen de public/projects/<slug>/ (los mismos de la web actual); aquí solo
   va el texto y la dirección de cada caso. Fuente de los hechos: el content.txt de cada
   proyecto — nada inventado. Estructura de textos inspirada en plastic.design (resumen con
   el reto como pregunta, capítulos con titular-frase) y concisión de Metalab. */
import { BASE } from "@/lib/maqueta/base";

export type CaseSection = "product" | "brand" | "games";

export type Chapter = {
  eyebrow: string;
  title: string;
  body?: string;
  /** Proyectos sin subcarpetas: cuántos grupos de imágenes se lleva este capítulo. */
  take?: number;
};

/* Roles (decididos por Alberto, 2026-10-17): solo cuatro y sin nivel suelto por proyecto. Lead Product Designer
   (apps), Brand Designer (identidad), Art Director (proyectos con más marca en general: El Reto, GM World!) y
   Lead UI/UX Designer (videojuegos). Y un quinto para los proyectos propios (DesignOps, SwifT y 7News; 2026-11-01):
   End-to-end Product Designer, porque no hubo equipo que liderar y sí todo el recorrido, de la idea al prototipo. */
export type CaseCopy = {
  slug: string;
  section: CaseSection;
  name: string;
  /** Una línea para la tarjeta de la home. */
  line: string;
  year: string;
  /** Para quién (vacío = proyecto propio). */
  client?: string;
  role: string;
  services: string[];
  /** Color de la marca del proyecto. Ya no tiñe el fondo (desde 2026-10-12 la maqueta va en
      negro/blanco con selector sol/luna); se guarda para fondos de mockups. */
  accent: string;
  accent2?: string;
  light?: boolean;
  /** Frase de cabecera: qué es, en una línea. */
  tagline: string;
  question: string;
  overview: string[];
  chapters: Chapter[];
  stats?: [string, string][];
  outcomeTitle: string;
  outcome: string;
  cta?: { label: string; href: string };
  /** Proporción real del vídeo de móvil (*_phone), si no es la del iPhone moderno. */
  phoneRatio?: string;
  /** Medios propios de la maqueta que sustituyen a los de la web actual (p. ej. mockups en
      movimiento hechos con motion/mockup.py). */
  thumb?: string;
  hero?: string;
  /** Medio que crece hasta pantalla completa con el scroll justo después de la intro. */
  feature?: string;
};

const ALL_CASES: CaseCopy[] = [
  /* ───────────── PRODUCT ───────────── */
  {
    slug: "elreto-masterchef",
    section: "product",
    // Miniatura y cabecera: el prototipo real en un móvil entre rocas negras (bucle corto,
    // scripts/mockups/recetas/elreto-hero-app.json: la app real, no la propuesta). La apertura con el recorrido completo va en games.ts.
    thumb: "/maqueta/elreto/media/hero-25d-v3.mp4", // 2026-10-18: las rocas flotan y toman el color de la pantalla (la de antes, hero.mp4)
    hero: "/maqueta/elreto/media/hero-25d-v3.mp4",
    name: "MasterChef", // antes «El Reto MasterChef»: partía los titulares (Alberto, 2026-10-16)
    line: "The MasterChef experience, in your pocket",
    year: "2025",
    client: "MasterChef World",
    role: "Art Director",
    services: ["Brand identity", "Brand book", "App UX/UI", "Prototype"],
    accent: "#F28142",
    accent2: "#B8401A",
    tagline: "Turning the MasterChef audience into contestants.",
    question: "How do you play a cooking show from the couch?",
    overview: [
      "El Reto is the interactive side of MasterChef World: an app where viewers stop watching and start competing, with challenges, live rankings and their own content.",
      "I designed the whole product, from the logo and brand book to the app interface, with one clear goal: gamify professional cooking without losing the show’s rigor.",
    ],
    chapters: [
      {
        eyebrow: "El producto",
        title: "Competitivo, pero con la sofisticación de una cocina profesional.",
        body: "La estética de competición culinaria premium tenía que convivir con un lenguaje de juego sin volverse técnica. Un sistema pensado primero para pantallas pequeñas: alto contraste, dinamismo y jerarquía clara para mucha información a la vez.",
      },
      {
        eyebrow: "Identidad",
        title: "Naranja MasterChef, degradados y una tipografía con carácter.",
        body: "La identidad se apoya en el naranja de la marca y en Unbounded. Los «background glows» dan atmósfera de juego premium y movimiento a la interfaz; el sistema escala de la microinteracción en la app a los grafismos de la emisión en televisión.",
      },
      {
        eyebrow: "Diseño de la app",
        title: "Rankings, vídeo y progreso en la misma pantalla.",
        body: "Tarjetas con bordes difuminados, indicadores de progreso circulares e iconografía lineal propia. El contenido de los usuarios y las mecánicas de juego conviven sin pelearse por la atención.",
      },
    ],
    stats: [
      ["+9K", "app users"],
      ["230K", "total users"],
      ["5M", "brand followers"],
      ["40K", "viewers at the first event"],
    ],
    outcomeTitle: "The world’s biggest cooking show, now playable on your phone.",
    outcome: "El Reto se lanzó con una identidad coherente y una app donde el contenido de los usuarios y el juego conviven de forma natural. Un estándar para gamificar formatos de televisión: la pantalla grande y el móvil, conectados.",
    // Sin botón al prototipo (2026-10-15, Alberto: no queda profesional).
  },
  {
    slug: "swift-project",
    section: "product",
    // Mockups en movimiento (motion/swift-hero → motion/mockup.py sobre las fotos de concepto).
    thumb: "/maqueta/swift/duo-thumb.mp4", // 2026-10-17: el iPhone Duo (la anterior, en thumb.mp4)
    // Cabecera = la misma miniatura que crece desde la home (sin cambio de plano); el vídeo
    // horizontal del portátil se ve entero en el momento grande tras la intro.
    hero: "/maqueta/swift/duo-thumb.mp4",
    feature: "/maqueta/swift/hero.mp4",
    name: "SwifT Translator",
    line: "Instant translation from the macOS menu bar",
    year: "2026",
    role: "End-to-end Product Designer",
    services: ["Product", "macOS app", "Logo", "Landing page"],
    accent: "#8A8A8A",
    light: true,
    tagline: "Traducir cualquier texto sin cambiar de aplicación.",
    question: "¿Y si la mejor herramienta de traducción fuera la que no se ve?",
    overview: [
      "Traducir en macOS obligaba a cambiar de app, abrir pestañas y copiar y pegar. Cada solución existente rompía el flujo de trabajo.",
      "SwifT vive en la barra de menús: sin configuración, sin cuenta y sin claves de API. Seleccionas un texto en cualquier app, pulsas un atajo y la traducción llega como notificación nativa.",
    ],
    chapters: [
      {
        eyebrow: "Simplicidad radical",
        title: "Cada decisión de diseño fue una resta.",
        body: "Sin panel de preferencias, sin historial, sin onboarding. La interfaz tenía que desaparecer. La mayoría de traductores justifican su existencia sumando funciones; SwifT la justifica por lo que no tiene.",
        take: 3,
      },
      {
        eyebrow: "Por dentro",
        title: "Privado primero, siempre con respuesta.",
        body: "Tres motores en cascada: la traducción en el dispositivo de Apple, totalmente privada; Google Translate sin clave; y MyMemory como último recurso. El icono, un rayo geométrico, se lee igual a 16 px en la barra que a 512 en la tienda.",
        take: 3,
      },
      {
        eyebrow: "Landing page",
        title: "Un producto que cabe en una frase merece una página que también.",
        body: "Tipografía con opinión, rapidez y un único botón de descarga. La página refleja la filosofía del producto sin parecer vacía.",
        take: 2,
      },
    ],
    stats: [
      ["14", "idiomas desde el lanzamiento"],
      ["<30 s", "para instalarla"],
      ["0", "cuentas, claves o configuración"],
    ],
    outcomeTitle: "Gratis, firmada y lista en medio minuto.",
    outcome: "Binario universal para Apple Silicon e Intel, instalador firmado y una landing que convierte con un solo botón. La arquitectura admite nuevos idiomas sin tocar la interfaz.",
    cta: { label: "Descargar gratis", href: "https://swift-translator.vercel.app" },
  },
  {
    // Caso a medida (app/new/interactius): estos campos solo alimentan la tarjeta y el «siguiente caso».
    slug: "interactius",
    section: "product",
    // Miniatura y cabecera (2026-10-16): el manual en el MacBook real (scene-mac.jpg + manual-web.mp4).
    thumb: "/maqueta/interactius/thumb.mp4",
    name: "Interactius",
    line: "A brand built to work with people and AI",
    year: "2026",
    client: "Interactius",
    role: "Brand Designer",
    services: ["Brand guidelines", "Deck generator", "Brand API"],
    accent: "#99335F",
    tagline: "Un manual de marca que no se lee: se usa.",
    question: "¿Y si la marca fuera una herramienta en lugar de un PDF?",
    overview: ["Una sola fuente de datos alimenta el manual, una API de marca, un validador de tono y un generador de presentaciones."],
    chapters: [],
    outcomeTitle: "La marca deja de ser un PDF que nadie abre.",
    outcome: "",
  },
  {
    // Caso a medida (app/new/designops, 2026-11-01): proyecto propio. Estos campos solo alimentan la tarjeta, el pase
    // de Product y el «siguiente caso». Miniatura: el iPad en perspectiva con el dashboard vivo (css_scene.mjs).
    slug: "designops",
    section: "product",
    thumb: "/maqueta/designops/media/hero-thumb.mp4",
    name: "DesignOps Copilot",
    line: "An AI copilot that keeps a design system in shape",
    year: "2026",
    role: "End-to-end Product Designer",
    services: ["Web app", "AI copilot", "Identity"],
    accent: "#2C2357",
    tagline: "A copilot for whoever looks after the design system.",
    question: "What does the person who owns a design system need when AI ships screens faster than anyone can review them?",
    overview: ["The command center for a design system: an AI copilot that turns drift into decisions."],
    chapters: [],
    outcomeTitle: "A design system that tells you what it needs.",
    outcome: "",
  },
  {
    // Caso a medida (app/new/7news): estos campos solo alimentan la tarjeta y el «siguiente caso».
    slug: "7news",
    section: "product",
    thumb: "/maqueta/7news/media/hero-25d-v3.mp4", // 2026-10-18: la luz de ventana cruza el muro (la de antes, hero.mp4)
    name: "7news",
    line: "A news reader that knows when you’re done",
    year: "2026",
    role: "End-to-end Product Designer",
    services: ["iOS app", "Apple Watch", "Logo"],
    accent: "#0A0A0B",
    tagline: "El día se acaba.",
    question: "¿Y si un lector de noticias supiera cuándo has terminado?",
    overview: ["Un lector de feeds nativo para iPhone y Apple Watch, sin IA ni servidor."],
    chapters: [],
    outcomeTitle: "Un lector que se termina.",
    outcome: "",
  },
  {
    // Caso a medida (app/new/wineup). Miniatura: el recorrido del prototipo en un móvil en la mano sobre un bar
    // de vinos desenfocado (scripts/mockups/hand3d_video.py).
    slug: "wineup",
    section: "product",
    thumb: "/maqueta/wineup/media/thumb-live2.mp4",
    name: "WineUp",
    line: "Where wine lovers meet",
    year: "2025",
    role: "Lead Product Designer",
    services: ["App", "UX/UI", "Prototype"],
    accent: "#CDE84F",
    tagline: "La comunidad de los amantes del vino.",
    question: "¿Cómo se reúne en una app a quien disfruta del vino y a quien sabe de vino?",
    overview: ["UX/UI de una app social para amantes del vino, con dos perfiles: WineLover y WineExpert."],
    chapters: [],
    outcomeTitle: "Una app para descubrir el vino con los que más saben y con los tuyos.",
    outcome: "",
  },
  {
    // Caso a medida (app/new/dovla): estos campos solo alimentan la tarjeta y el «siguiente caso».
    slug: "dovla",
    section: "product",
    // Móvil girando en estudio oscuro, render de Blender (2026-10-18, prueba). El de antes: media/hero.mp4.
    thumb: "/maqueta/dovla/media/hero-3d-bg.mp4", // 2026-10-18: el mismo móvil renderizado a 108 mm (en tarjetas pequeñas y en el pase de fondo se veía diminuto); un solo archivo para miniatura y pase; la cabecera sigue con hero-3d.mp4
    name: "Dovla",
    line: "The bank that doesn’t shout",
    year: "2026",
    role: "Lead Product Designer",
    services: ["Native iOS app", "UI kit", "Accessibility"],
    accent: "#42283E",
    tagline: "Wealth likes a quiet room.",
    question: "How does a private bank feel on a phone?",
    overview: ["A native iOS app for a private bank, built from one UI kit."],
    chapters: [],
    outcomeTitle: "Private banking for great fortunes, built on security and transparency.",
    outcome: "",
  },
  {
    slug: "netflix-app",
    section: "product",
    name: "Netflix App",
    line: "New interactions within Netflix’s rules",
    year: "2019",
    role: "Lead Product Designer",
    services: ["UX/UI", "Interactive prototype", "ProtoPie"],
    accent: "#E50914",
    tagline: "Las reglas de una marca consolidada, usadas como brief creativo.",
    question: "¿Qué interacciones nuevas caben dentro del sistema de Netflix?",
    overview: [
      "Un proyecto propio: imaginar cómo podría evolucionar la app de Netflix sin sustituir un diseño que ya es excelente.",
      "La restricción era el punto de partida. Dentro de su guía de marca, ¿qué funciones harían la experiencia de verdad mejor?",
    ],
    chapters: [
      {
        eyebrow: "El reto",
        title: "Mejorar sin que nadie sienta que algo ha cambiado.",
        body: "Cientos de millones de personas usan la app cada día. Cualquier cambio tenía que sentirse como «justo lo que quería», no como «esto es distinto». Con la identidad visual intacta, la innovación debía venir de la interacción y la arquitectura de la información.",
      },
      {
        eyebrow: "Las ideas",
        title: "Volver a ver lo que te gustó. Elegir sin agotarte.",
        body: "Un carrusel de «ya vistas» que reorganiza el contenido según tu historial y facilita repetir, y un menú principal replanteado que reduce la fatiga de decisión con colecciones editoriales personalizadas.",
      },
    ],
    outcomeTitle: "Un prototipo que cualquiera puede tocar.",
    outcome: "Totalmente interactivo y publicado en Protopie, con lógica condicional, físicas y microanimaciones realistas. Demostró que hay margen de mejora real sin salir del lenguaje de Netflix, y generó mucha conversación en comunidades de diseño.",
    cta: {
      label: "Abrir el prototipo",
      href: "https://cloud.protopie.io/p/V4jcv2wpqBc?ui=false&scaleToFit=true&enableHotspotHints=true&cursorType=touch&mockup=true&bgColor=%23F5F5F5&bgImage=undefined&playSpeed=1",
    },
  },
  {
    slug: "nike-shop",
    section: "product",
    name: "Nike Shop",
    line: "E-commerce where video sells the product",
    year: "2019",
    role: "Lead Product Designer",
    services: ["UX/UI", "Interactive prototype", "ProtoPie"],
    accent: "#9A9A9A",
    light: true,
    phoneRatio: "1126/2002",
    tagline: "La energía de una tienda Nike, en la pantalla del móvil.",
    question: "¿Cómo sería comprar en Nike si cada producto se moviera?",
    overview: [
      "Nike lidera la innovación en sus tiendas físicas, pero su compra digital seguía siendo conservadora para una marca tan expresiva.",
      "Este prototipo propio sustituye la fotografía estática por clips de vídeo en bucle y replantea la navegación y el pago alrededor de ese formato.",
    ],
    chapters: [
      {
        eyebrow: "El enfoque",
        title: "Vídeo primero, de la categoría a la ficha de producto.",
        body: "El vídeo es el medio principal de presentación en todo el recorrido. Movimiento e interacción para que la pantalla transmita lo mismo que una tienda insignia.",
      },
    ],
    outcomeTitle: "Una dirección premium para la tienda digital.",
    outcome: "Un prototipo completamente interactivo, construido en Protopie con vídeo, físicas y lógica condicional, publicado para compartirlo y recoger opiniones de la comunidad de diseño.",
    cta: {
      label: "Abrir el prototipo",
      href: "https://cloud.protopie.io/p/E5yJ3wbGufT?ui=false&scaleToFit=true&enableHotspotHints=true&cursorType=touch&mockup=true&bgColor=%23F5F5F5&bgImage=undefined&playSpeed=1",
    },
  },
  {
    slug: "hawkers",
    section: "product",
    name: "Hawkers",
    line: "A store as bold as the brand",
    year: "2019",
    role: "Lead Product Designer",
    services: ["UX/UI", "Interactive prototype", "ProtoPie"],
    accent: "#FF8FA6",
    light: true,
    tagline: "Una tienda online con la misma personalidad que sus redes.",
    question: "¿Cómo se vende con la energía de una marca nacida en redes sociales?",
    overview: [
      "Hawkers construyó su marca a base de personalidad y redes sociales, pero su tienda online no reflejaba esa voz.",
      "Este concepto propio replantea la experiencia de compra para que sea tan distintiva como la marca: visual, desenfadada y centrada en el producto.",
    ],
    chapters: [
      {
        eyebrow: "El reto",
        title: "Atrevida como su marketing, clara como una tienda.",
        body: "Rápida, visual y guiada por la imagen, sin sacrificar la claridad y la conversión que exige el comercio electrónico. Navegación, ficha de producto y pago, rediseñados como una extensión natural de su forma de comunicar.",
      },
    ],
    outcomeTitle: "Una alternativa completa, lista para probar.",
    outcome: "Un prototipo interactivo de principio a fin, publicado en Protopie y compartido con la comunidad de diseño.",
    cta: {
      label: "Abrir el prototipo",
      href: "https://cloud.protopie.io/p/iHQ8PA4fc3Y?ui=false&scaleToFit=true&enableHotspotHints=true&cursorType=touch&mockup=true&bgColor=%23F5F5F5&bgImage=undefined&playSpeed=1",
    },
  },

  /* ───────────── MARCA Y WEB ───────────── */
  {
    slug: "obliq",
    section: "brand",
    name: "OBLIQ",
    line: "Identity and web for a film production company",
    year: "2025",
    client: "Obliq Productions",
    role: "Brand Designer",
    services: ["Identity", "Brand book", "Web"],
    accent: "#BDBDBD",
    tagline: "Una marca que da estructura y deja que el trabajo ponga el alma.",
    question: "¿Cómo se diseña una marca que no le robe protagonismo al director?",
    overview: [
      "Obliq Productions es una productora definida por su mirada cinematográfica y su precisión técnica. Necesitaba una identidad tan pulida como sus producciones.",
      "El encargo cubría el ecosistema completo: una identidad minimalista, su manual de marca y una web corporativa pensada como galería de alta fidelidad para su portfolio.",
    ],
    chapters: [
      {
        eyebrow: "Web",
        title: "Una galería que se aparta para que hable la imagen.",
        body: "Modo oscuro para imitar la sala de cine, navegación mínima y marcos como recurso para ordenar el contenido. Todo el peso en el rendimiento: vídeo de alta calidad que carga sin romper la composición.",
      },
      {
        eyebrow: "Logo y manual",
        title: "Todo parte de una línea oblicua.",
        body: "La «I» inclinada del logotipo transmite una perspectiva propia y fija la precisión geométrica de todo el sistema tipográfico. El manual asegura la coherencia en cada punto de contacto.",
      },
    ],
    outcomeTitle: "Un estudio posicionado para proyectos de más nivel.",
    outcome: "Un kit de marca completo y una web en producción que se mantiene premium en un móvil o en un monitor de estudio. Desde el lanzamiento, la productora apunta a encargos comerciales y narrativos de mayor nivel.",
    // Sin enlace a la web (2026-10-15): la han cambiado y ya no es el diseño de Alberto.
  },
  {
    slug: "act",
    section: "brand",
    name: "Athlete Career Training",
    line: "A second career for elite athletes",
    year: "2024",
    client: "Metacampus",
    role: "Brand Designer",
    services: ["Identity", "Web platform", "UX"],
    accent: "#C25A43",
    tagline: "Convertir la disciplina deportiva en valor profesional.",
    question: "¿Cómo se diseña una transición que se sienta como un avance y no como empezar de cero?",
    overview: [
      "Los deportistas de élite tienen una mentalidad de alto rendimiento, pero dar el salto a una carrera fuera del deporte suele ser un camino fragmentado.",
      "ACT es una plataforma con sede en Londres que reúne a organizaciones deportivas, empresas y atletas. Con orientación apoyada en IA, traduce los logros deportivos en competencias para la empresa.",
    ],
    chapters: [
      {
        eyebrow: "Arquitectura",
        title: "Un mercado de tres lados que no abruma a nadie.",
        body: "Lejos de la estética de portal de empleo: un espacio que se siente como un centro de alto rendimiento. Habilidades, mentalidad y crecimiento como los tres pilares de la interfaz.",
        take: 3,
      },
      {
        eyebrow: "El recorrido",
        title: "El Transition Path: progresar, no reiniciar.",
        body: "Un motor de emparejamiento con IA convierte los logros deportivos en competencias profesionales. Datos densos, presentados con una experiencia limpia y motivadora para gente acostumbrada a la alta exigencia.",
        take: 4,
      },
      {
        eyebrow: "Para quien contrata",
        title: "Detectar talento de un vistazo.",
        body: "Los módulos de últimos talentos y últimas ofertas priorizan la lectura rápida, para que los reclutadores identifiquen perfiles de alto rendimiento desde un panel guiado por datos.",
        take: 4,
      },
    ],
    outcomeTitle: "El final de una carrera deportiva, convertido en un comienzo.",
    outcome: "ACT se lanzó como herramienta completa de transición profesional y hoy acoge una comunidad curada de atletas, con una vía estructurada para que las organizaciones acompañen a sus antiguos deportistas.",
  },
  {
    slug: "gm-world",
    section: "brand",
    name: "GM World!",
    line: "Identity for a global Web3, AI and metaverse forum",
    year: "2024",
    client: "Metacampus",
    role: "Art Director",
    services: ["Event identity", "Type system", "Graphic assets"],
    accent: "#7B3FD0",
    accent2: "#D9973F",
    tagline: "Una identidad que viaja de ciudad en ciudad sin perderse.",
    question: "¿Cómo se diseña una marca neutra en todas partes y local en cada edición?",
    overview: [
      "GM World! es el foro anual de Metacampus: líderes, creadores e innovadores alrededor de la inteligencia artificial, el metaverso y la tecnología descentralizada.",
      "Cada edición se celebra en una ciudad distinta. La identidad tenía que adaptarse a cada lugar y, a la vez, posicionar el foro como un evento profesional y serio.",
    ],
    chapters: [
      {
        eyebrow: "El sistema",
        title: "La tipografía es el lienzo.",
        body: "En lugar de un sistema de ilustración que habría que rehacer en cada sede, un sistema tipográfico modular y contundente. Color, textura y fotografía de cada ciudad se integran en las letras sin cambiar la estructura.",
        take: 3,
      },
      {
        eyebrow: "Aplicaciones",
        title: "Del escenario a la tarjeta del ponente.",
        body: "La identidad se desplegó en todo el evento: escenografía, promoción digital, impresos y piezas para ponentes.",
        take: 3,
      },
      {
        eyebrow: "Digital",
        title: "Preparada para las próximas ediciones.",
        take: 4,
      },
    ],
    outcomeTitle: "Una marca que crece con cada edición.",
    outcome: "Lanzada con la edición de 2024, el sistema modular puede extenderse a futuras sedes sin rediseñarlo cada año.",
  },
  {
    slug: "metacampus",
    section: "brand",
    name: "Metacampus",
    line: "Identity for a Web3 and AI learning hub",
    year: "2023",
    client: "Metacampus",
    role: "Brand Designer",
    services: ["Identity", "Design system", "Web"],
    accent: "#22B43C",
    accent2: "#E3268F",
    light: true,
    tagline: "Una marca de tecnología emergente que no se parece a todas las demás.",
    question: "¿Cómo se evitan los clichés de lo cripto sin dejar de parecer moderno?",
    overview: [
      "Metacampus es un centro de formación en Web3, inteligencia artificial y metaverso. Necesitaba una identidad creíble y con energía, capaz de atraer tanto a empresas como a estudiantes.",
      "Lideré el proceso completo, del concepto inicial al design system entregado e implementado en la plataforma.",
    ],
    chapters: [
      {
        eyebrow: "El concepto",
        title: "Cuatro pilares, cuatro formas, un sistema.",
        body: "La empresa se organiza en Web3, IA, metaverso y comunidad. Sus formas geométricas son las piezas de todo el lenguaje visual: del logotipo a los separadores y la rejilla de la interfaz. Una identidad que enseña cómo las partes forman el todo.",
        take: 2,
      },
      {
        eyebrow: "Aplicaciones",
        title: "Flexible sin perder la coherencia.",
        body: "El sistema se extendió a la web, prototipada en Figma para el equipo de desarrollo, y a redes sociales, presentaciones y materiales de eventos.",
        take: 3,
      },
    ],
    outcomeTitle: "Lanzada en 2023, en toda su presencia digital.",
    outcome: "Lejos de los degradados neón y las formas 3D abstractas del sector, Metacampus estrenó una identidad propia que funciona igual en una plantilla de redes que en un evento.",
  },

  /* ───────────── GAMES ───────────── */
  {
    slug: "asphalt-unite",
    section: "games",
    name: "Asphalt Unite",
    line: "An iconic racing franchise, rebuilt for console",
    year: "2023",
    client: "Gameloft Barcelona",
    role: "Lead UI/UX Designer",
    services: ["Art direction", "UX/UI", "Console"],
    accent: "#C800FF",
    accent2: "#3B1BD6",
    tagline: "Born on mobile. Rebuilt for console. Ready to race crossplatform.",
    question: "¿Cómo se lleva un juego nacido en el móvil al salón y al mando?",
    overview: [
      // Sin «pensado para competir en esports» (Alberto, 2026-10-17: no es cierto; de esports solo era la estética).
      "Asphalt Unite is the new chapter of Gameloft’s racing franchise, built from scratch for console and PC and playable crossplatform with mobile. As Lead UI/UX, I rethought the whole interface for the gamepad and the TV: vehicle classes, main menu, garage and HUD.",
      "Como lead de UI/UX, el encargo era replantear toda la interfaz: presentación de clases de vehículo, menú principal, garaje y HUD.",
    ],
    chapters: [
      {
        eyebrow: "El punto de partida",
        title: "Dos mundos: la herencia móvil y la exigencia de la consola.",
        body: "En consola se navega solo con mando, se espera más densidad de información en pantallas grandes y el contexto de uso es otro. El cambio a esports pedía además una dirección más agresiva, gráfica y lista para retransmitir.",
      },
      {
        eyebrow: "Primera dirección de arte",
        title: "Explorar antes de decidir.",
        body: "Auditoría de los grandes de consola —Forza Horizon, Gran Turismo, Need for Speed— y playtests internos para localizar la fricción de los flujos heredados del móvil.",
      },
      {
        eyebrow: "UI del juego",
        title: "Clases de vehículo que se leen desde el sofá.",
        body: "Las pantallas de clase se convirtieron en el centro del nuevo lenguaje: renders a gran formato, tipografía contundente y un sistema de niveles por color que se lee al instante en una televisión.",
      },
      {
        eyebrow: "Pantallas de consola",
        title: "Un menú que transmite escala antes de la primera carrera.",
      },
    ],
    stats: [
      ["-40%", "errores de navegación en tests internos"],
      ["1.000M+", "descargas"],
      ["2023", "lanzamiento"],
    ],
    outcomeTitle: "A billion downloads in, the legend shifts up a gear.",
    outcome: "La nueva interfaz se convirtió en la identidad visual definitiva de Asphalt Unite en consola y PC. La dirección de arte se aprobó por unanimidad en su primera presentación.",
    cta: { label: "Download", href: "https://apps.apple.com/gt/app/asphalt-legends-carreras/id805603214" },
  },
  {
    slug: "cybertitans",
    section: "games",
    name: "CyberTitans",
    line: "Redesign and brand for a competitive auto-battler",
    year: "2024",
    client: "Elixir / LitLab Games",
    role: "Lead UI/UX Designer",
    services: ["UX/UI", "Identity", "Custom typeface", "Design system"],
    accent: "#3CC8E0",
    accent2: "#C84EEE",
    tagline: "Hardcore strategy and a crypto economy, held to product standards.",
    question: "¿Cómo se maneja la complejidad de un juego cripto sin abrumar al jugador?",
    overview: [
      "CyberTitans is LitLab Games’ competitive auto-battler, with a marketplace, wallet and tokens built into the game. As Lead UI/UX, I redesigned the whole interface, from the combat HUD to the shop and inventory, and built a new brand around a custom typeface.",
      "El objetivo, elevar su presencia en el gaming Web3 uniendo una estética ciberpunk táctica con la precisión de un buen diseño de producto.",
    ],
    chapters: [
      {
        eyebrow: "UI del juego",
        title: "Precisión quirúrgica para mucha información.",
        body: "Mercado, monedero y gestión de tokens, además de la densidad propia del género. Todo el sistema se rearquitecturó, del HUD de combate a matchmaking, tienda e inventario, como un design system modular para escritorio y móvil.",
      },
      {
        eyebrow: "Logo y tipografía",
        title: "Una tipografía hecha a medida como ADN técnico.",
        body: "Diseñada para leerse en cualquier punto de contacto y alejarse de los tópicos ciberpunk: una identidad con autoridad, segura y lista para competir.",
      },
      { eyebrow: "Prototipo · Crystal Battle", title: "El combate, en movimiento." },
      { eyebrow: "Prototipo · Ladder", title: "La escalera competitiva, en movimiento." },
    ],
    outcomeTitle: "The arena is open. Titans, take your places.",
    outcome: "La tipografía y el lenguaje visual se convirtieron en la columna vertebral de la marca, y la experiencia rebaja la barrera de entrada al gaming Web3 tanto para nativos cripto como para jugadores tradicionales.",
    cta: { label: "Play on Steam", href: "https://store.steampowered.com/app/2350590/CyberTitans/?l=latam" },
  },
  {
    slug: "disney-karting",
    section: "games",
    name: "Disney Speedstorm",
    line: "Disney karting with a more grown-up edge",
    year: "2020",
    client: "Gameloft Barcelona",
    role: "Lead UI/UX Designer",
    services: ["Art direction", "UX/UI", "Marketing"],
    accent: "#0551E8",
    accent2: "#6A2BD9",
    tagline: "Disney’s heroes on the starting grid, from mobile to console.",
    question: "¿Cómo sería un juego de karts Disney pensado también para adultos?",
    overview: [
      "An early art direction and UI/UX proposal for a Disney kart racer, made at Gameloft Barcelona for console and mobile. The brief: a game that grown-up Disney fans and younger players would love equally, with a richer finish and real respect for the characters.",
      "La premisa: un juego que atraiga por igual a los fans adultos de la marca y a los jugadores más jóvenes, con un homenaje a sus personajes y un acabado más ambicioso.",
    ],
    chapters: [
      {
        eyebrow: "UI del juego",
        title: "La calidez de Disney con estándares casi AAA.",
        body: "Del análisis de personajes y propiedad intelectual nace un sistema con paletas vivas, tipografía expresiva e iconografía protagonizada por los personajes: selección, HUD de carrera, garaje, colección y personalización.",
      },
      {
        eyebrow: "Exploraciones gráficas",
        title: "Un tono maduro sin perder la magia.",
      },
      {
        eyebrow: "Marketing",
        title: "Un brief, una sola voz visual.",
      },
    ],
    outcomeTitle: "Every big game starts as a bold first draft.",
    outcome: "La propuesta sirvió en Gameloft Barcelona como referente de dirección de arte: lo que podría ser un juego de karts Disney con la inversión creativa adecuada. Uno de los paquetes de concepto más completos de mi portfolio.",
  },
  {
    slug: "asphalt-9",
    section: "games",
    name: "Asphalt 9: Legends",
    line: "UI for one of the most downloaded racing games ever",
    year: "2018",
    client: "Gameloft Barcelona",
    role: "Lead UI/UX Designer",
    services: ["UX/UI", "HUD", "Marketing"],
    accent: "#FD0055",
    accent2: "#2A2AD8",
    tagline: "An interface worthy of the most ambitious racing game on mobile.",
    question: "¿Cómo se navega un juego con más de 300 coches sin perderse?",
    overview: [
      "Asphalt 9: Legends is the ninth chapter of Gameloft’s flagship franchise and, at launch, the most ambitious mobile racing game ever made. In the UI/UX team, from pre-production to launch, I worked on the menus, the car showcases, the HUD and the social and multiplayer screens.",
      "Dentro del equipo de UI/UX, de la preproducción al lanzamiento: menús, exposición de vehículos, HUD y las superficies sociales y multijugador.",
    ],
    chapters: [
      {
        eyebrow: "UI del juego",
        title: "Velocidad, nitro y posición, sin tapar el espectáculo.",
        body: "Objetivos táctiles diminutos, una fracción de segundo para comunicar y jugadores de 7 años y competidores adultos en la misma pantalla. Los vehículos se presentan como fotografía de automoción; los menús, con una metáfora espacial coherente para saber siempre dónde estás.",
      },
      {
        eyebrow: "Exploraciones de marketing",
        title: "La misma ambición fuera del juego.",
      },
      {
        eyebrow: "Exploraciones gráficas",
        title: "Probar el lenguaje hasta encontrarlo.",
      },
    ],
    stats: [
      ["200M+", "descargas"],
      ["#1", "juego de carreras en iOS y Android"],
      ["300+", "coches en el juego"],
    ],
    outcomeTitle: "Some legends set the pace. This one set the course.",
    outcome: "Lanzado en julio de 2018, con éxito de crítica y ventas: el juego de carreras más taquillero en iOS y Android. Su dirección visual y su UI marcaron el camino de toda la saga.",
    cta: { label: "Download", href: "https://apps.apple.com/gt/story/id1441913825" },
  },
  {
    slug: "asphalt-xtreme",
    section: "games",
    name: "Asphalt Xtreme",
    line: "The Asphalt saga goes off-road",
    year: "2016",
    client: "Gameloft Barcelona",
    role: "Lead UI/UX Designer",
    services: ["Logo", "UX/UI", "HUD", "Marketing"],
    accent: "#E0542A",
    accent2: "#8A4A22",
    tagline: "Rougher, wilder and still unmistakably Asphalt.",
    question: "¿Cómo se anuncia un juego distinto dentro de una saga tan reconocible?",
    overview: [
      "Asphalt Xtreme takes the franchise off-road, a break from the street racing that defined Asphalt 8. I covered the whole interface, from the logo and type system to the menus, the HUD and the launch marketing.",
      "El trabajo cubrió toda la interfaz, del logotipo y el sistema tipográfico a los menús, el HUD y las piezas de marketing del lanzamiento de octubre de 2016.",
    ],
    chapters: [
      {
        eyebrow: "UI del juego",
        title: "Tierra, polvo y contraste en lugar de luces de ciudad.",
        body: "Menús y HUD con una paleta terrosa y de alto contraste. Una identidad doble: familiar para los fans y lo bastante distinta para anunciar la nueva jugabilidad.",
      },
      {
        eyebrow: "Splash screens 3D",
        title: "Del boceto al render.",
        body: "Un logotipo propio, más rudo y artesanal que la tipografía limpia habitual de la saga: formas angulosas, textura gastada y energía.",
      },
      {
        eyebrow: "Marketing",
        title: "Listo para las tiendas.",
        body: "Composiciones de key art, piezas promocionales y capturas para App Store y Google Play.",
      },
    ],
    stats: [
      ["100M+", "descargas"],
      ["2016", "lanzamiento"],
    ],
    outcomeTitle: "Asphalt leaves the asphalt behind.",
    outcome: "Lanzado en octubre de 2016 con buen rendimiento comercial, Asphalt Xtreme superó los 100 millones de descargas y llevó la franquicia a las carreras todoterreno.",
  },
];

/** Proyectos ocultos (Alberto, 2026-10-17): los de 2019 («demasiado viejos») y los de Marca y web. No se borran: se
    quedan en ALL_CASES por si se rescatan; quitarlos de aquí los vuelve a enseñar en homes, carruseles y rutas. */
const HIDDEN = new Set(["netflix-app", "nike-shop", "hawkers", "obliq", "act", "gm-world", "metacampus"]);
export const CASES: CaseCopy[] = ALL_CASES.filter((c) => !HIDDEN.has(c.slug));

/** Proyectos de la home de Product que aún no tienen caso (sin enlace). */
/** Proyectos de Product aún sin caso (van sin enlace). WineUp ya tiene el suyo desde el 2026-10-16. */
export const PENDING: { name: string; type: string; year: string }[] = [];

/** Orden de Product (2026-10-16): por fecha, lo más actual arriba. Estos van primero, en este orden (encajan
    con los huecos de la rejilla de la home); el resto de Product, después, por año descendente. */
// DesignOps Copilot abre Product, delante incluso de Gloop (2026-11-01, Alberto: «en principio irá el primero»).
export const PRODUCT_FIRST = ["designops", "swift-project", "7news", "dovla", "interactius", "elreto-masterchef", "wineup"];
export function productInOrder(): CaseCopy[] {
  const all = CASES.filter((c) => c.section === "product");
  const first = PRODUCT_FIRST.map((s) => all.find((c) => c.slug === s)).filter((c): c is CaseCopy => !!c);
  const rest = all.filter((c) => !PRODUCT_FIRST.includes(c.slug)).sort((a, b) => Number(b.year) - Number(a.year));
  return [...first, ...rest];
}

export const caseBySlug = (slug: string) => CASES.find((c) => c.slug === slug);
export const casesIn = (s: CaseSection) => CASES.filter((c) => c.section === s);

/** Proyectos que se ven en cada home, para el recuento del menú (D5, 2026-10-13): en Product,
    Gloop (página propia, fuera de CASES) + producto + pendientes + «Marca y web». */
export const SECTION_COUNT = {
  product: 1 + casesIn("product").length + PENDING.length + casesIn("brand").length,
  games: casesIn("games").length,
} as const;

/** Orden de lectura por sección (Gloop abre Product). Para «Siguiente caso». */
export function nextCase(slug: string): { name: string; href: string; slug: string } {
  const section = caseBySlug(slug)?.section ?? "product";
  const list =
    section === "games"
      ? casesIn("games")
      : (() => {
          // Gloop va justo detrás del primero de Product (DesignOps Copilot desde el 2026-11-01).
          const [first, ...rest] = productInOrder();
          return [first, { name: "Gloop", slug: "gloop" }, ...rest, ...casesIn("brand")];
        })();
  const i = list.findIndex((x) => x.slug === slug);
  const n = list[(i + 1) % list.length];
  return { name: n.name, slug: n.slug, href: `${BASE}/${n.slug}` };
}
