/* Contenido de los casos de la maqueta (borrador en castellano; la web final va en inglés).
   Los medios salen de public/projects/<slug>/ (los mismos de la web actual); aquí solo
   va el texto y la dirección de cada caso. Fuente de los hechos: el content.txt de cada
   proyecto — nada inventado. Estructura de textos inspirada en plastic.design (resumen con
   el reto como pregunta, capítulos con titular-frase) y concisión de Metalab. */

export type CaseSection = "product" | "brand" | "games";

export type Chapter = {
  eyebrow: string;
  title: string;
  body?: string;
  /** Proyectos sin subcarpetas: cuántos grupos de imágenes se lleva este capítulo. */
  take?: number;
};

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

export const CASES: CaseCopy[] = [
  /* ───────────── PRODUCT ───────────── */
  {
    slug: "elreto-masterchef",
    section: "product",
    name: "El Reto MasterChef",
    line: "La experiencia MasterChef llevada al móvil",
    year: "2025",
    client: "MasterChef World",
    role: "Senior Designer",
    services: ["Identidad de marca", "Brand book", "UX/UI app", "Prototipo"],
    accent: "#F28142",
    accent2: "#B8401A",
    tagline: "Convertir a la audiencia de MasterChef en concursantes.",
    question: "¿Cómo se juega a un programa de cocina desde el sofá?",
    overview: [
      "El Reto es la extensión interactiva de MasterChef World: una app donde los espectadores dejan de mirar y empiezan a competir, con retos, rankings en tiempo real y contenido propio.",
      "El proyecto abarca el producto completo, del logotipo y el brand book a la interfaz de la app, con un objetivo claro: gamificar la cocina profesional sin perder el rigor del programa.",
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
      ["+9K", "usuarios de la app"],
      ["230K", "usuarios en total"],
      ["5M", "seguidores de la marca"],
      ["40K", "espectadores en el primer evento"],
    ],
    outcomeTitle: "Una marca y un producto listos para la temporada 2026.",
    outcome: "El Reto se lanzó con una identidad coherente y una app donde el contenido de los usuarios y el juego conviven de forma natural. Un estándar para gamificar formatos de televisión: la pantalla grande y el móvil, conectados.",
    cta: {
      label: "Abrir el prototipo",
      href: "https://cloud.protopie.io/p/bc6dc1340ee379915a5c03f6?ui=false&scaleToFit=true&enableHotspotHints=true&cursorType=touch&mockup=true&bgColor=%23141414&bgImage=undefined&playSpeed=1",
    },
  },
  {
    slug: "swift-project",
    section: "product",
    // Mockups en movimiento (motion/swift-hero → motion/mockup.py sobre las fotos de concepto).
    thumb: "/maqueta/swift/thumb.mp4",
    // Cabecera = la misma miniatura que crece desde la home (sin cambio de plano); el vídeo
    // horizontal del portátil se ve entero en el momento grande tras la intro.
    hero: "/maqueta/swift/thumb.mp4",
    feature: "/maqueta/swift/hero.mp4",
    name: "SwifT Translator",
    line: "Traductor para la barra de menús de macOS",
    year: "2026",
    role: "Diseño y desarrollo",
    services: ["Producto", "App macOS", "Icono", "Landing page"],
    accent: "#8A8A8A",
    light: true,
    tagline: "Traducir cualquier texto sin salir de lo que estás haciendo.",
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
    // Caso a medida (app/maqueta/interactius): estos campos solo alimentan la tarjeta y el «siguiente caso».
    slug: "interactius",
    section: "product",
    thumb: "/maqueta/interactius/cover.jpg",
    name: "Interactius",
    line: "Un manual de marca que se usa, no se lee",
    year: "2026",
    client: "Interactius",
    role: "Diseño de producto y de sistema",
    services: ["Manual de marca", "Generador de presentaciones", "API de marca"],
    accent: "#99335F",
    tagline: "Un manual de marca que no se lee: se usa.",
    question: "¿Y si la marca fuera una herramienta en lugar de un PDF?",
    overview: ["Una sola fuente de datos alimenta el manual, una API de marca, un validador de tono y un generador de presentaciones."],
    chapters: [],
    outcomeTitle: "La marca deja de ser un PDF que nadie abre.",
    outcome: "",
  },
  {
    slug: "netflix-app",
    section: "product",
    name: "Netflix App",
    line: "Nuevas interacciones dentro de las reglas de Netflix",
    year: "2019",
    role: "Senior Designer",
    services: ["UX/UI", "Prototipo interactivo", "Protopie"],
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
    line: "Comercio electrónico donde el vídeo es el producto",
    year: "2019",
    role: "Senior Designer",
    services: ["UX/UI", "Prototipo interactivo", "Protopie"],
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
    line: "Una tienda tan atrevida como la marca",
    year: "2019",
    role: "Senior Designer",
    services: ["UX/UI", "Prototipo interactivo", "Protopie"],
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
    line: "Identidad y web para una productora audiovisual",
    year: "2025",
    client: "Obliq Productions",
    role: "Senior Designer",
    services: ["Identidad", "Brand book", "Web"],
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
    cta: { label: "Visitar la web", href: "https://obliqproductions.com/" },
  },
  {
    slug: "act",
    section: "brand",
    name: "Athlete Career Training",
    line: "La segunda carrera de los deportistas de élite",
    year: "2024",
    client: "Metacampus",
    role: "Senior Designer",
    services: ["Identidad", "Plataforma web", "UX"],
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
    line: "Identidad para un foro global de Web3, IA y metaverso",
    year: "2024",
    client: "Metacampus",
    role: "Senior UI/UX Designer",
    services: ["Identidad de evento", "Sistema tipográfico", "Piezas gráficas"],
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
    line: "Identidad para un centro de formación en Web3 e IA",
    year: "2023",
    client: "Metacampus",
    role: "Senior UI/UX Designer",
    services: ["Identidad", "Design system", "Web"],
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
    line: "Una franquicia icónica, rediseñada para los esports",
    year: "2023",
    client: "Gameloft Barcelona",
    role: "Lead UI/UX Designer",
    services: ["Dirección de arte", "UX/UI", "Consola"],
    accent: "#C800FF",
    accent2: "#3B1BD6",
    tagline: "De la herencia móvil a la consola, con estética de retransmisión.",
    question: "¿Cómo se lleva un juego nacido en el móvil al salón y al mando?",
    overview: [
      "Asphalt Unite es un nuevo capítulo de la franquicia de carreras de Gameloft, construido desde cero para consola y pensado para competir en esports.",
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
    outcomeTitle: "La identidad esports que lleva la franquicia hacia delante.",
    outcome: "La nueva interfaz se convirtió en la identidad visual definitiva de Asphalt Unite en consola y PC. La dirección de arte se aprobó por unanimidad en su primera presentación.",
    cta: { label: "Descargar", href: "https://apps.apple.com/gt/app/asphalt-legends-carreras/id805603214" },
  },
  {
    slug: "cybertitans",
    section: "games",
    name: "CyberTitans",
    line: "Rediseño y marca para un auto-battler competitivo",
    year: "2024",
    client: "Elixir / LitLab Games",
    role: "Senior UI/UX Designer",
    services: ["UX/UI", "Identidad", "Tipografía a medida", "Design system"],
    accent: "#3CC8E0",
    accent2: "#C84EEE",
    tagline: "Estrategia hardcore y economía Web3, con estándares de producto.",
    question: "¿Cómo se maneja la complejidad de un juego cripto sin abrumar al jugador?",
    overview: [
      "CyberTitans es un auto-battler competitivo de LitLab Games. El encargo: rediseño completo de UI/UX y una nueva identidad de marca, con tipografía propia incluida.",
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
    outcomeTitle: "Un nuevo listón para el ecosistema de LitLab.",
    outcome: "La tipografía y el lenguaje visual se convirtieron en la columna vertebral de la marca, y la experiencia rebaja la barrera de entrada al gaming Web3 tanto para nativos cripto como para jugadores tradicionales.",
    cta: { label: "Ver en Steam", href: "https://store.steampowered.com/app/2350590/CyberTitans/?l=latam" },
  },
  {
    slug: "disney-karting",
    section: "games",
    name: "Disney Karting",
    line: "Un juego de karts Disney con un tono más adulto",
    year: "2020",
    client: "Gameloft Barcelona",
    role: "Senior UI/UX Designer",
    services: ["Dirección de arte", "UX/UI", "Marketing"],
    accent: "#0551E8",
    accent2: "#6A2BD9",
    tagline: "El universo Disney, llevado a un terreno más cinematográfico.",
    question: "¿Cómo sería un juego de karts Disney pensado también para adultos?",
    overview: [
      "Una propuesta de dirección de arte y UI/UX para un juego de karts de Disney, desarrollada en Gameloft Barcelona.",
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
    outcomeTitle: "Una referencia creativa interna.",
    outcome: "La propuesta sirvió en Gameloft Barcelona como referente de dirección de arte: lo que podría ser un juego de karts Disney con la inversión creativa adecuada. Uno de los paquetes de concepto más completos de mi portfolio.",
  },
  {
    slug: "asphalt-9",
    section: "games",
    name: "Asphalt 9: Legends",
    line: "UI para uno de los juegos de carreras más descargados",
    year: "2018",
    client: "Gameloft Barcelona",
    role: "Senior UI/UX Designer",
    services: ["UX/UI", "HUD", "Marketing"],
    accent: "#FD0055",
    accent2: "#2A2AD8",
    tagline: "Una interfaz a la altura del juego de carreras más ambicioso del móvil.",
    question: "¿Cómo se navega un juego con más de 300 coches sin perderse?",
    overview: [
      "Asphalt 9: Legends es la novena entrega de la franquicia insignia de Gameloft y, en su lanzamiento, el juego de carreras para móvil más ambicioso hecho hasta entonces.",
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
    outcomeTitle: "La plantilla de todos los Asphalt que vinieron después.",
    outcome: "Lanzado en julio de 2018, con éxito de crítica y ventas: el juego de carreras más taquillero en iOS y Android. Su dirección visual y su UI marcaron el camino de toda la saga.",
    cta: { label: "Descargar", href: "https://apps.apple.com/gt/story/id1441913825" },
  },
  {
    slug: "asphalt-xtreme",
    section: "games",
    name: "Asphalt Xtreme",
    line: "La saga Asphalt, fuera del asfalto",
    year: "2016",
    client: "Gameloft Barcelona",
    role: "Senior UI/UX Designer",
    services: ["Logo", "UX/UI", "HUD", "Marketing"],
    accent: "#E0542A",
    accent2: "#8A4A22",
    tagline: "Más crudo y más salvaje, sin dejar de ser Asphalt.",
    question: "¿Cómo se anuncia un juego distinto dentro de una saga tan reconocible?",
    overview: [
      "Asphalt Xtreme es la entrega todoterreno de la franquicia: un cambio respecto a las carreras urbanas que definieron Asphalt 8 y 9.",
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
    outcomeTitle: "Asphalt abre una categoría nueva.",
    outcome: "Lanzado en octubre de 2016 con buen rendimiento comercial, Asphalt Xtreme superó los 100 millones de descargas y llevó la franquicia a las carreras todoterreno.",
  },
];

/** Proyectos de la home de Product que aún no tienen caso (sin enlace). */
export const PENDING = [
  { name: "7News", type: "App", year: "2026" },
  { name: "Dovla", type: "App", year: "2026" },
  { name: "WineUp", type: "App", year: "" },
];

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
      : [{ name: "Gloop", slug: "gloop" }, ...casesIn("product"), ...casesIn("brand")];
  const i = list.findIndex((x) => x.slug === slug);
  const n = list[(i + 1) % list.length];
  return { name: n.name, slug: n.slug, href: `/maqueta/${n.slug}` };
}
