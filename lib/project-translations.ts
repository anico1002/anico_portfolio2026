import { type Project } from "./projects";

type ProjectTranslation = Partial<
  Pick<
    Project,
    | "subtitle"
    | "description"
    | "overview"
    | "challenge"
    | "process"
    | "outcome"
    | "role"
    | "deliverables"
    | "stats"
  >
>;

const es: Record<string, ProjectTranslation> = {
  "asphalt-unite": {
    subtitle: "Rediseñando una franquicia de carreras icónica para la era del esport",
    description:
      "Rediseño completo de UI/UX de la nueva entrega de la franquicia Asphalt, navegación multiplataforma para consola, con un lenguaje visual audaz inspirado en los esports.",
    deliverables: ["Diseño UI/UX", "Dirección de Arte", "Branding Esports", "Navegación Consola", "Prototipado"],
    overview:
      "Asphalt Unite es un nuevo capítulo de la franquicia de carreras de Gameloft, un título construido desde cero para consola y diseñado para competir en el panorama de los esports. Me incorporé como diseñador principal de UI/UX, con la tarea de repensar cada pantalla de la interfaz: desde la presentación de clases de vehículos y los flujos del menú principal hasta las experiencias de garaje y los elementos del HUD en partida.",
    challenge:
      "El reto central era unir dos mundos: la herencia mobile-first de la franquicia y las exigencias de una experiencia nativa en consola. Los jugadores de consola navegan exclusivamente con mando, esperan alta densidad de información en pantallas grandes y tienen un contexto de uso radicalmente diferente al del jugador móvil. Al mismo tiempo, el rebranding hacia los esports implicaba alejarse de la dirección visual anterior y avanzar hacia algo más agresivo, gráfico y pensado para la retransmisión.",
    process:
      "Empecé con una auditoría exhaustiva de juegos de carreras de consola de referencia, estudiando patrones de navegación en Forza Horizon, Gran Turismo y Need for Speed, y realicé pruebas de usuario internas para identificar fricciones en los flujos legacy móviles. Las pantallas de clase (A, C, D) se convirtieron en el epicentro del nuevo lenguaje visual: renders a gran formato, tipografía audaz y un sistema de colores por categoría legible al instante desde el sofá. El menú principal se rediseñó como una entrada animada que transmite escala y energía antes de la primera carrera.",
    outcome:
      "La UI rediseñada se lanzó como la identidad visual definitiva de Asphalt Unite, estableciendo la estética esports que acompañará a la franquicia en consola y PC. Las pruebas de usuario internas mostraron un 40% menos de errores de navegación respecto al prototipo anterior, y la dirección de arte fue aprobada de forma unánime por los stakeholders editoriales en la primera presentación.",
    stats: [
      { text: "40% · Menos errores de nav." },
      { text: "3 · Sistemas de clase" },
      { text: "Consola · Plataforma principal" },
      { text: "2023 · Año de lanzamiento" },
    ],
  },

  metacampus: {
    subtitle: "Una identidad renovada para el hub educativo en la frontera de Web3 e IA",
    description:
      "Identidad corporativa y web para un hub educativo especializado en Web3, Inteligencia Artificial y el Metaverso, limpia, geométrica y construida para un espacio en rápida evolución.",
    deliverables: ["Identidad Corporativa", "Diseño Web", "Prototipo Figma", "Sistema Visual"],
    overview:
      "Metacampus es un hub educativo centrado en tecnologías emergentes: Web3, Inteligencia Artificial y el Metaverso. Como empresa joven en la vanguardia de estos campos, necesitaba una identidad que resultara simultáneamente creíble y energética, capaz de atraer tanto a clientes corporativos como a alumnos individuales. Lideré el proceso de diseño completo, desde el concepto inicial hasta el sistema de diseño entregado y el prototipo interactivo en Figma.",
    challenge:
      "El brief pedía una estética fresca y limpia que transmitiera educación y aprendizaje. Pero el riesgo en el branding de tecnología emergente es caer en los mismos clichés visuales, gradientes de neón, blobs 3D abstractos, paletas solo en modo oscuro, que usa cualquier startup de cripto o IA. Necesitaba crear algo genuinamente moderno sin disolverme en el ruido de la categoría.",
    process:
      "El concepto surgió de la propia estructura de Metacampus: la empresa se organiza en torno a cuatro pilares fundamentales (Web3, IA, Metaverso, Comunidad). Tomé las formas geométricas ya asociadas a esos pilares y las usé como bloques constructivos de todo el lenguaje visual, desde el logotipo hasta los divisores de sección y la rejilla de la UI. El resultado es una identidad que es intrínsecamente educativa (muestra cómo las partes forman el todo) a la vez que visualmente dinámica y adaptable.",
    outcome:
      "Metacampus lanzó con la nueva identidad en 2023 y la utilizó en toda su presencia digital, incluyendo un website prototipado en Figma entregado al equipo de desarrollo. El sistema geométrico resultó lo suficientemente flexible para extenderse a plantillas de redes sociales, presentaciones y materiales de eventos sin perder coherencia.",
    stats: [
      { text: "4 · Pilares de marca" },
      { text: "2023 · Año de lanzamiento" },
      { text: "Web3 · Sector" },
      { text: "Figma · Prototipo entregado" },
    ],
  },

  "asphalt-9": {
    subtitle: "Game UI para uno de los juegos de carreras para móvil más descargados de la historia",
    description:
      "Diseño de UI/UX para Asphalt 9: Legends, el juego de carreras para móvil de Gameloft que superó los 200 millones de descargas en todo el mundo.",
    deliverables: ["Diseño Game UI", "Diseño HUD", "Flujos de Menú", "Pantallas de Vehículos", "Producción de Assets"],
    overview:
      "Asphalt 9: Legends es la novena entrega de la franquicia de carreras insignia de Gameloft y el juego de carreras para móvil más ambicioso jamás construido en su momento de lanzamiento. Fui parte del equipo de UI/UX en Gameloft Barcelona, trabajando en la interfaz desde la preproducción hasta el lanzamiento: diseñando sistemas de menú, pantallas de exposición de vehículos, el HUD en partida y las superficies sociales y multijugador que definirían cómo cientos de millones de jugadores experimentarían el juego.",
    challenge:
      "La UI de juegos móviles opera bajo restricciones extremas: áreas táctiles muy pequeñas, una fracción de segundo para comunicar información crítica durante la partida, y la necesidad de servir a la vez a niños de 7 años y adultos competitivos en la misma pantalla. Asphalt 9 también tenía que superar la calidad visual de todo lo que la franquicia había hecho antes, la tecnología visual del juego era líder en el sector y la UI debía estar a la altura sin abrumar a los jugadores.",
    process:
      "El trabajo de diseño abarcó toda la interfaz: desde la arquitectura de información de alto nivel (¿cómo navegas un juego con más de 900 coches y decenas de modos?) hasta elementos individuales del HUD (¿cómo muestras velocidad, nitro y posición sin tapar el espectáculo en pantalla?). Las pantallas de vehículos se diseñaron para parecer fotografía de automoción, gran formato, iluminación dramática, elementos visuales mínimos, mientras que el sistema de menú usaba una metáfora espacial coherente para que los jugadores siempre supieran dónde estaban en el juego.",
    outcome:
      "Asphalt 9: Legends se lanzó en julio de 2018 con un éxito crítico y comercial arrollador. Alcanzó más de 200 millones de descargas y se convirtió en el juego de carreras más rentable tanto en iOS como en Android. La dirección visual y el diseño de UI establecieron la plantilla para todos los títulos Asphalt posteriores.",
    stats: [
      { text: "200M+ · Descargas" },
      { text: "#1 · Juego de carreras, iOS y Android" },
      { text: "2018 · Año de lanzamiento" },
      { text: "900+ · Coches en el juego" },
    ],
  },

  "netflix-app": {
    subtitle: "Un rediseño personal que explora nuevas interacciones dentro del sistema de marca de Netflix",
    description:
      "Un prototipo interactivo en Protopie que rediseña la app de Netflix, nuevas interacciones, un carrusel de películas vistas y un menú principal reinventado, todo dentro de las directrices de marca de Netflix.",
    deliverables: ["Diseño UI/UX", "Prototipo Interactivo", "Diseño de Interacción"],
    overview:
      "Este fue un proyecto personal, una exploración de cómo podría ser una app de Netflix rediseñada. El objetivo no era reemplazar el diseño actual de Netflix (que es excelente) sino usar las restricciones de un sistema de marca consolidado como brief creativo: ¿qué nuevas interacciones son posibles dentro de estas reglas? ¿Qué funcionalidades harían la experiencia genuinamente mejor?",
    challenge:
      "Rediseñar un producto usado por cientos de millones de personas significa trabajar bajo el peso del hábito establecido. Cualquier cambio debe sentirse como una mejora, no como una ruptura, los usuarios deben pensar 'exactamente lo que necesitaba' y no 'esto es diferente'. La restricción adicional de permanecer dentro de las directrices de marca de Netflix significaba que la innovación tenía que venir de la interacción y la arquitectura de información, no de la novedad visual.",
    process:
      "Construí el prototipo completo en Protopie, una herramienta de alta fidelidad que permite lógica condicional compleja, interacciones basadas en física y micro-animaciones realistas. Las dos funcionalidades clave: un carrusel de 'películas vistas' que reorganiza el contenido según el historial de visualización (facilitando encontrar lo que quieres volver a ver) y un menú principal reinventado que reduce la fatiga de decisión mostrando colecciones editoriales personalizadas.",
    outcome:
      "El prototipo fue completamente interactivo y compartible, publicado en Protopie para que cualquiera pudiera probarlo. Demostró que es posible conseguir mejoras de usabilidad significativas dentro del lenguaje de diseño existente de Netflix, y generó una respuesta notable al compartirse en comunidades de diseño.",
    stats: [
      { text: "Protopie · Herramienta de prototipado" },
      { text: "2019 · Año" },
      { text: "100% · Cumple la marca" },
      { text: "Personal · Proyecto" },
    ],
  },

  telepport: {
    subtitle: "Diseñando la primera plataforma para teletransportarte a cualquier lugar del mundo",
    description:
      "Diseño de plataforma para Telepport de Visyon, el primer hub centralizado de contenido para visores de realidad virtual, que permite a los creadores distribuir experiencias inmersivas a cualquier dispositivo HMD.",
    deliverables: ["Diseño de Plataforma", "Diseño UX", "UI Inmersiva", "Sistema de Contenido"],
    overview:
      "Telepport fue una de las primeras plataformas comerciales construidas para la distribución de contenido inmersivo, diseñada en un momento en que la realidad virtual era todavía una tecnología de consumo incipiente y las convenciones para el diseño inmersivo apenas existían. Trabajando con Visyon en 2014, diseñé la interfaz de la plataforma que permitiría a los creadores publicar vídeo 360°, imágenes inmersivas y experiencias 3D en dispositivos de realidad virtual.",
    challenge:
      "Diseñar para VR en 2014 significaba diseñar sin convenciones establecidas, sin una base de usuarios madura y sin ejemplos de referencia. Cada decisión de interacción, ¿cómo navegas sin ratón? ¿cómo señalas profundidad y enfoque en un espacio sin cursor físico?, había que inventarla desde cero. El reto adicional era construir algo accesible para creadores no técnicos y a la vez suficientemente potente para estudios y medios.",
    process:
      "El proceso de diseño fue muy iterativo y orientado a la investigación. Realizamos sesiones de usabilidad con los primeros dispositivos HMD (principalmente Oculus DK1 y DK2) y adaptamos la interfaz en función de lo que causaba desorientación o confusión. La UI de la plataforma se diseñó en capas: una interfaz 2D plana para el panel de control web (donde los creadores subían y gestionaban contenido) y una UI espacial separada para la experiencia de visualización inmersiva.",
    outcome:
      "Telepport se lanzó como la primera plataforma de su tipo y fue adoptada por grandes organizaciones de medios y estudios de contenido que buscaban distribuir contenido VR. El proyecto estableció patrones de diseño fundamentales para plataformas de contenido inmersivo que influyeron en cómo el sector abordó la publicación de VR en los años siguientes.",
    stats: [
      { text: "2014 · Año de lanzamiento" },
      { text: "Primera · Plataforma de contenido HMD" },
      { text: "VR/360° · Formatos de contenido" },
      { text: "Visyon · Cliente" },
    ],
  },

  fundfy: {
    subtitle: "Una landing page premium para un club de inversión privado exclusivo",
    description:
      "Landing page corporativa para Fundfy, un club de inversión europeo regulado que ofrece carteras gestionadas de cripto y activos digitales combinadas con experiencias de lifestyle exclusivas.",
    deliverables: ["Diseño Landing Page", "Diseño Visual", "Diseño UX", "Dirección de Arte"],
    overview:
      "Fundfy es un club de inversión privado regulado, con licencia MiCA en Europa, que ofrece a sus miembros acceso a carteras de cripto y activos digitales gestionadas profesionalmente junto con experiencias de lifestyle exclusivas: supercoches de lujo, náutica, eventos privados. El encargo consistía en diseñar una landing page que convirtiera a candidatos de alto patrimonio en miembros, comunicando simultáneamente credibilidad regulatoria, rentabilidades demostradas y exclusividad premium.",
    challenge:
      "La tensión fundamental del brief era confianza versus aspiración. Los productos de inversión exigen un diseño sobrio y creíble, datos, estructura, señales regulatorias. Pero la diferenciación de Fundfy es su dimensión de lifestyle: la promesa de un club, no solo de un fondo. Demasiado financiero y pierde personalidad; demasiado orientado al lifestyle y los inversores escépticos no convertirán. El segundo reto era comunicar productos de cartera complejos (cuatro niveles con distintos horizontes temporales y perfiles de rentabilidad) sin abrumar a visitantes con distintos niveles de sofisticación financiera.",
    process:
      "Establecí una estética premium en modo oscuro como base, suficientemente oscura para transmitir exclusividad y modernidad, con la jerarquía tipográfica necesaria para comunicar seriedad. La sección hero lidera con marca y transformación antes de presentar las credenciales. La sección de carteras usa una rejilla de tarjetas estructurada que permite comparar los cuatro niveles de un vistazo. La sección de experiencias rompe la densidad financiera con fotografía inmersiva, supercoches, yates, reforzando el posicionamiento de club.",
    outcome:
      "La landing page se lanzó en 2024 como la principal superficie de conversión de Fundfy. El diseño tiende con éxito el puente entre producto financiero regulado y marca de lifestyle exclusiva, una combinación que diferencia a Fundfy en el cada vez más concurrido espacio europeo de inversión en cripto. La página está activa en fundfy.io.",
    stats: [
      { text: "+450% · Rentabilidad acumulada desde 2018" },
      { text: "MiCA · Regulación europea" },
      { text: "4 · Niveles de cartera diseñados" },
      { text: "2024 · Año de lanzamiento" },
    ],
  },

  "swift-translator": {
    subtitle: "Un traductor para la barra de menú de macOS que no te interrumpe",
    description:
      "SwifT es un traductor ligero para la barra de menú de macOS, selecciona texto en cualquier lugar, pulsa ⌥⌘T, listo. Diseñado y desarrollado desde cero: app, icono y landing page.",
    role: "Diseñador & Desarrollador",
    deliverables: ["Diseño App macOS", "Landing Page", "Icono de App", "Identidad de Marca"],
    overview:
      "SwifT nació de una frustración personal: traducir texto en macOS implicaba cambiar de app, abrir pestañas del navegador, copiar y pegar. Todas las soluciones existentes interrumpían el flujo de trabajo. Así que construí una que no lo hacía. SwifT vive en la barra de menú, no requiere configuración, cuenta ni claves de API, seleccionas texto en cualquier aplicación, pulsas un atajo y recibes la traducción como notificación nativa de macOS. El diseño cubre toda la superficie del producto: la UI de la app, el icono y la landing page de marketing.",
    challenge:
      "El reto del producto era la simplicidad radical. La mayoría de herramientas de traducción son ricas en funciones para justificar su existencia, SwifT tenía que justificar la suya a través de la ausencia de funciones. Cada decisión de diseño fue una sustracción: sin panel de preferencias, sin historial, sin flujo de incorporación. La interfaz tenía que desaparecer. Para la landing page, el reto era comunicar un producto tan simple que toda la propuesta de valor cabe en una frase, sin que la página pareciera vacía o mal diseñada.",
    process:
      "La app para macOS se construyó como un NSStatusItem (solo barra de menú, sin icono en el Dock) usando Swift y AppKit. El motor de traducción usa una cadena de respaldo de tres niveles: el framework de Traducción de Apple (macOS 26+, completamente privado), Google Translate (sin clave de API) y MyMemory como último recurso. La landing page se diseñó para reflejar la filosofía del producto, limpia, rápida, tipografía con criterio, un único CTA. El icono usa una 'S' geométrica que se lee bien tanto a 16px en la barra de menú como a 512px en la App Store.",
    outcome:
      "SwifT es gratuito, se distribuye como binario universal (arm64 + x86_64) y se instala en menos de 30 segundos mediante un .pkg firmado. La landing page convierte visitantes con un único CTA 'Descargar Gratis' y sin fricción de registro. 14 idiomas disponibles en el lanzamiento, con una arquitectura diseñada para añadir más sin cambios en la UI.",
    stats: [
      { text: "1 · Atajo para traducir" },
      { text: "14 · Idiomas al lanzamiento" },
      { text: "~4 MB · Tamaño de la app" },
      { text: "Gratis · Para siempre" },
    ],
  },

  "disney-karting": {
    subtitle: "Una propuesta de dirección de arte para un juego de karting Disney con un tono más maduro",
    description:
      "Propuesta propia de UI/UX y dirección de arte para un juego de karting Disney, manteniendo la estética icónica de la franquicia mientras se introduce un tono visual más maduro que amplía el público objetivo más allá del infantil.",
    deliverables: ["Dirección de Arte", "Diseño UI/UX", "Diseño de Personajes", "Propuesta Game UI"],
    overview:
      "En 2020 desarrollé una propuesta de dirección de arte y UI/UX por iniciativa propia para un juego de karting Disney en Gameloft Barcelona. El concepto se construyó en torno a una premisa sencilla pero ambiciosa: ¿cómo sería un juego de karting Disney diseñado para atraer por igual a fans adultos de la IP y a jugadores más jóvenes? El resultado es un sistema visual que honra los icónicos personajes y el valor de marca de Disney, empujando la estética hacia un territorio más audaz y cinematográfico.",
    challenge:
      "La tensión central al diseñar con la IP de Disney es su doble audiencia: una propiedad construida para niños que es genuinamente amada por adultos. La mayoría de juegos con licencia resuelven esto adoptando una estética primero infantil, que funciona pero deja mucho público potencial sobre la mesa. El reto era encontrar un lenguaje visual suficientemente premium y maduro para atraer a un público más amplio, sin perder nunca la calidez, el color y el reconocimiento de los personajes que hacen valiosa la IP de Disney.",
    process:
      "La propuesta cubre toda la superficie de UI/UX: flujos de selección de personaje, personalización del kart, HUD de carrera e imagen clave de marketing. Las pantallas de personajes se diseñaron con un encuadre cinematográfico, renders a gran formato, iluminación dramática y una paleta de color extraída del mundo canónico de cada personaje. El sistema de personalización se construyó para sentirse como una función real del juego. Se exploraron múltiples direcciones visuales antes de llegar al enfoque que mejor equilibraba las exigencias de marca de Disney con el tono más maduro del concepto.",
    outcome:
      "La propuesta funcionó como referencia creativa interna y guía de dirección de arte en Gameloft Barcelona, demostrando cómo podría verse un título de karting Disney de alta calidad con la inversión creativa adecuada. El proyecto sigue siendo uno de los paquetes conceptuales más completos de mi portfolio por iniciativa propia, cubriendo UI, diseño de personajes, personalización de kart y assets de marketing desde un único brief visual coherente.",
    stats: [
      { text: "29 · Pantallas diseñadas" },
      { text: "2020 · Año" },
      { text: "Disney · IP" },
      { text: "Personal · Iniciativa" },
    ],
  },

  "gm-world": {
    subtitle: "Identidad de marca para un foro global en la frontera de Web3, IA y el Metaverso",
    description:
      "Desarrollo de marca e identidad corporativa para GM World!, el foro global anual de Metacampus centrado en Web3, Inteligencia Artificial y el Metaverso, diseñado para evolucionar con cada ciudad anfitriona.",
    deliverables: ["Identidad de Marca", "Sistema Visual", "Assets Corporativos", "Plantillas Digitales"],
    overview:
      "GM World! es el foro global anual organizado por Metacampus, una empresa de educación en Web3, que reúne a líderes del sector, creadores e innovadores en torno a la inteligencia artificial, el Metaverso y la tecnología descentralizada. En 2024 desarrollé la identidad de marca completa y los assets visuales del foro, creando un sistema lo suficientemente flexible para evolucionar con cada edición manteniendo una identidad central consistente.",
    challenge:
      "El foro es internacional por diseño, cada edición tiene lugar en una ciudad anfitriona diferente, con un contexto cultural distinto. La marca necesitaba ser suficientemente neutra a nivel global para funcionar en cualquier lugar, y al mismo tiempo adaptable para absorber el carácter local sin perder coherencia. También tenía que posicionar a GM World! como un evento profesional serio, no como otro vehículo de hype de Web3.",
    process:
      "La identidad se construye sobre un sistema tipográfico modular y audaz que actúa como principal vehículo de diseño. En lugar de depender de un sistema complejo de ilustración o iconografía que requeriría ser repensado para cada ciudad, la tipografía en sí se convierte en el lienzo para la adaptación local, el color, la textura y las referencias fotográficas de cada ciudad anfitriona pueden integrarse en las letras sin cambiar la identidad estructural.",
    outcome:
      "La identidad de GM World! se lanzó con la edición del foro de 2024 y se adoptó en toda la marca del evento: diseño de escenario, promoción digital, materiales impresos y assets de ponentes. El sistema modular es lo suficientemente flexible para extenderse a ediciones futuras sin requerir un rediseño completo cada año.",
    stats: [
      { text: "2024 · Año de lanzamiento" },
      { text: "Global · Alcance del evento" },
      { text: "Web3 · Sector" },
      { text: "Metacampus · Cliente" },
    ],
  },

  "asphalt-xtreme": {
    subtitle: "UI/UX, logotipo y diseño de marketing para el título de carreras off-road de Gameloft",
    description:
      "Diseño de UI/UX, creación del logotipo, tipografía personalizada y assets de campaña de marketing para Asphalt Xtreme, la entrega de carreras off-road de Gameloft Barcelona dentro de la franquicia Asphalt.",
    deliverables: ["Diseño Game UI/UX", "Diseño de Logo", "Tipografía Personalizada", "Assets de Marketing"],
    overview:
      "Asphalt Xtreme es la entrega off-road de la franquicia Asphalt de Gameloft, una salida de la fórmula de carreras urbanas que definía Asphalt 8 y posteriormente Asphalt 9. Me incorporé al proyecto en Gameloft Barcelona como diseñador de UI/UX, trabajando en toda la interfaz del juego: desde el logotipo personalizado y el sistema tipográfico hasta los flujos de menú, el diseño del HUD y los assets de marketing para el lanzamiento en octubre de 2016.",
    challenge:
      "La marca Asphalt está estrechamente asociada a las carreras de alta velocidad y los entornos urbanos. Xtreme necesitaba señalar un tipo de juego diferente, más crudo, más agresivo, off-road, mientras seguía siendo instantáneamente reconocible como parte de la franquicia. La UI tenía que llevar esa doble identidad: suficientemente familiar para los fans existentes, visualmente distinta para comunicar la nueva dirección del juego.",
    process:
      "Diseñé un logotipo exclusivo para Asphalt Xtreme que aportaba una calidad más rústica y artesanal a la tipografía habitualmente limpia de la franquicia, formas angulares, texturas desgastadas, energía. La UI de los menús y el HUD se diseñaron en torno a una paleta terrosa y de alto contraste que evocaba tierra, polvo y terreno en lugar de luces de ciudad. Los assets de marketing completaron el paquete: composiciones de key art, gráficos promocionales y capturas para App Store y Google Play.",
    outcome:
      "Asphalt Xtreme se lanzó en octubre de 2016 con un sólido rendimiento comercial, extendiendo la franquicia Asphalt a la categoría de carreras off-road. El título alcanzó más de 100 millones de descargas y consolidó la presencia de Gameloft en este nuevo segmento.",
    stats: [
      { text: "100M+ · Descargas" },
      { text: "2016 · Año de lanzamiento" },
      { text: "Off-road · Nueva categoría" },
      { text: "Gameloft · Estudio" },
    ],
  },

  "nike-shop": {
    subtitle: "Un prototipo en Protopie que explora el e-commerce con vídeo como protagonista para Nike",
    description:
      "Un prototipo interactivo completamente funcional en Protopie que reimagina la experiencia de e-commerce de Nike, explorando la presentación de producto con vídeo como elemento principal e interacciones experimentales dentro del sistema visual de la marca.",
    deliverables: ["Diseño UX", "Prototipo Interactivo", "Diseño de Interacción"],
    overview:
      "Un prototipo personal que explora cómo podría ser una experiencia de e-commerce de Nike con el vídeo como protagonista. El proyecto aprovecha las capacidades avanzadas de interacción de Protopie para construir un concepto completamente interactivo, reemplazando la fotografía de producto estática por clips de vídeo en bucle cortos y reinventando los flujos de navegación y compra en torno a ese formato de contenido más rico.",
    challenge:
      "Nike lidera la innovación en retail físico, pero su experiencia de compra digital ha permanecido relativamente conservadora para una marca tan expresiva. El reto de diseño era crear algo tan audaz y centrado en el producto como las tiendas físicas de Nike, usando el movimiento y la interacción para llevar esa misma energía a la pantalla.",
    process:
      "El prototipo completo se construyó en Protopie, aprovechando la capacidad de la herramienta para gestionar assets de vídeo, interacciones basadas en física y lógica condicional compleja. El vídeo reemplaza a la imagen estática como medio principal de presentación del producto a lo largo de todo el flujo de compra, desde la navegación por categorías hasta la página de producto individual.",
    outcome:
      "Un prototipo interactivo completo que demuestra una aproximación premium con el vídeo como protagonista para el retail digital de Nike. Publicado en Protopie para su visualización y feedback en la comunidad de diseño.",
    stats: [
      { text: "Protopie · Herramienta" },
      { text: "2019 · Año" },
      { text: "Vídeo primero · Concepto" },
      { text: "Personal · Proyecto" },
    ],
  },

  hawkers: {
    subtitle: "Un concepto de e-commerce interactivo para la marca de gafas española, construido en Protopie",
    description:
      "Concepto de e-commerce personal para Hawkers, la marca española de gafas, rediseñando la experiencia de compra para que esté a la altura de la personalidad irreverente y digital-native de la marca. Construido íntegramente en Protopie.",
    deliverables: ["Diseño UX", "Prototipo Interactivo", "Diseño E-Commerce"],
    overview:
      "Hawkers construyó su marca alrededor de la personalidad y las redes sociales, una marca de gafas digital-native con un punto de vista muy definido. Este prototipo personal reimagina su experiencia de e-commerce para que sea tan singular como la propia marca: juguetona, visual y sin disculpas centrada en el producto. El concepto completo fue construido y prototipado en Protopie.",
    challenge:
      "Hawkers tiene una identidad de marca expresiva que su retail digital no refleja del todo. El reto de diseño era crear un concepto de e-commerce con la misma energía que su marketing, audaz, rápido, orientado a la imagen, sin sacrificar la claridad y la eficiencia de conversión que requiere el diseño de retail.",
    process:
      "Construido íntegramente en Protopie, el prototipo explora una interfaz de compra visualmente rica que pone el producto en primer plano. La navegación, las páginas de producto y el flujo de compra se rediseñaron para crear una experiencia más inmersiva y coherente con la marca, que se siente como una extensión natural de cómo Hawkers se comunica en redes sociales.",
    outcome:
      "Un prototipo interactivo completo que muestra una dirección alternativa de e-commerce para Hawkers. Publicado en Protopie para su visualización interactiva y compartido dentro de la comunidad de diseño.",
    stats: [
      { text: "Protopie · Herramienta" },
      { text: "2019 · Año" },
      { text: "Marca primero · Enfoque" },
      { text: "Personal · Proyecto" },
    ],
  },

  "some-logos": {
    subtitle: "Una selección de logotipos e identidades de marca a través de sectores y escalas",
    description:
      "Una colección curada de logotipos e identidades de marca creados para clientes en hostelería, salud, tecnología, retail y entretenimiento, cada uno desarrollado en respuesta a un brief y un público específicos.",
    deliverables: ["Diseño de Logo", "Identidad de Marca", "Sistemas Visuales", "Guías de Uso"],
    overview:
      "Una selección de logotipos e identidades de marca creados para clientes de distintos sectores y escalas, desde hostelería y salud hasta tecnología, retail y entretenimiento. Cada marca fue desarrollada en respuesta a un brief, un público y un contexto competitivo específicos, a lo largo de una década de trabajo freelance y en estudio.",
    challenge:
      "El diseño de logotipos es engañosamente limitado: toda la identidad de una marca debe comunicarse en una única marca que funcione a 16px y a 1600px, en color y en blanco y negro, en contextos digitales y físicos. Cada proyecto aquí presentó una versión diferente de ese reto fundamental, distintos sectores, distintas personalidades de marca, distintos vocabularios formales.",
    process:
      "Cada marca se desarrolló a través de un proceso iterativo: investigación del sector y el panorama competitivo, generación de conceptos en múltiples direcciones, refinamiento a través del feedback del cliente, y finalización con guías de uso de marca completas. La colección abarca distintos enfoques estilísticos, logotipos tipográficos, monogramas, emblemas, símbolos abstractos, reflejo de la variedad de briefs recibidos.",
    outcome:
      "Un portfolio diverso de marcas desplegadas en identidades corporativas para empresas en España e internacionalmente, abarcando los sectores de hostelería, salud, medios, tecnología y retail. Cada marca ha estado en uso activo por su cliente desde su entrega.",
    stats: [
      { text: "16+ · Marcas diseñadas" },
      { text: "10+ · Años de trabajo" },
      { text: "Multi · Sectorial" },
      { text: "España · Origen" },
    ],
  },
};

export function getLocalizedProject(project: Project, locale: string): Project {
  if (locale === "en") return project;
  // Hardcoded translations from project-translations.ts
  const t = locale === "es" ? es[project.slug] : undefined;
  // Inline translations from content.txt [block.locale] sections
  const inline = project.localizations?.[locale];
  if (!t && !inline) return project;
  return { ...project, ...(t ?? {}), ...(inline ?? {}) };
}
