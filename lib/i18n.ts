const START_YEAR = 1998; // 2026 - 28 = 1998
export const yoe = new Date().getFullYear() - START_YEAR;

export const translations = {
  en: {
    nav: { work: "Projects", about: "About", contact: "Contact" },
    hero: {
      eyebrow: `Senior Designer · ${yoe}+ years of craft`,
      headline: "Crafting digital\nExperiences",
      desc: `Product design, game UI/UX and brand art direction. ${yoe} years engineering scalable architectures and high-fidelity interfaces at the intersection of digital product, emerging platforms and gaming.`,
      cta: "View projects",
      scroll: "Scroll",
    },
    work: { title: "Selected\nWork", period: "2014–2026" },
    about: {
      title: "About me",
      headline: "Senior Designer",
      bio: [
        `Senior Designer with ${yoe}+ years of experience in interactive design, specialising in video game UI/UX, brand art direction, and immersive technology.`,
        "Passionate about new technologies, art, illustration, and design. Over more than a decade I've focused specifically on game UI/UX, working with studios like Gameloft Barcelona on titles that have been downloaded hundreds of millions of times.",
        "I collaborate as a freelancer with agencies, studios, and direct clients across brand identity, web, and emerging platforms including Web3 and VR. Based in Spain. Open to new projects.",
      ],
      disciplinesTitle: "Disciplines",
      disciplines: [
        "Interactive Design",
        "Game UI/UX",
        "Brand Art Direction",
        "UX Prototyping",
        "Web3 & VR Design",
        "Illustration",
        "Figma",
        "Protopie",
      ],
    },
    contact: {
      eyebrow: "Contact",
      title: "Have a project in mind?",
      desc: "I'm always open to new interesting projects. Let's talk about how I can help you.",
      email: "hola@anico.es",
      copyright: `© ${new Date().getFullYear()} anico. All rights reserved.`,
      footerTagline: "",
    },
    skills: {
      eyebrow: "Skills",
      title: "What I do",
      items: [
        { number: "01", title: "Product Design", desc: "End-to-end digital product design, from initial research to final handoff to the development team." },
        { number: "02", title: "Design Systems", desc: "Creation of scalable design systems that maintain consistency and accelerate development." },
        { number: "03", title: "UX Research", desc: "User research, usability testing, and data analysis to make evidence-based decisions." },
      ],
    },
    project: {
      back: "All Work",
      overview: "Overview",
      challenge: "The Challenge",
      process: "Process",
      outcomes: "Outcomes",
      nextProject: "Next Project",
      client: "Client",
      year: "Year",
      role: "Role",
      deliverables: "Deliverables",
    },
  },
  es: {
    nav: { work: "Proyectos", about: "Sobre mí", contact: "Contacto" },
    hero: {
      eyebrow: "Senior Designer con base en Madrid",
      headline: "Diseño experiencias digitales que conectan personas con productos",
      desc: "Especializado en diseño de producto, sistemas de diseño y experiencias centradas en el impacto.",
      cta: "Ver proyectos",
      scroll: "Scroll",
    },
    work: { title: "Trabajo\nSeleccionado", period: "2014–2026" },
    about: {
      title: "Sobre mí",
      headline: "Senior Designer",
      bio: [
        `Senior Designer con ${yoe}+ años de experiencia en diseño interactivo, especializado en UI/UX para videojuegos, dirección de arte de marca y tecnología inmersiva.`,
        "Apasionado por las nuevas tecnologías, el arte, la ilustración y el diseño. Durante más de una década me he centrado en game UI/UX, trabajando con estudios como Gameloft Barcelona en títulos descargados cientos de millones de veces.",
        "Colaboro como freelance con agencias, estudios y clientes en identidad de marca, web y plataformas emergentes como Web3 y VR. Con base en España. Abierto a nuevos proyectos.",
      ],
      disciplinesTitle: "Disciplinas",
      disciplines: [
        "Diseño interactivo",
        "Game UI/UX",
        "Dirección de arte de marca",
        "Prototipado UX",
        "Web3 y diseño VR",
        "Ilustración",
        "Figma",
        "Protopie",
      ],
    },
    contact: {
      eyebrow: "Contacto",
      title: "¿Tienes un proyecto en mente?",
      desc: "Siempre estoy abierto a proyectos interesantes. Hablemos de cómo puedo ayudarte.",
      email: "hola@anico.es",
      copyright: `© ${new Date().getFullYear()} anico. Todos los derechos reservados.`,
      footerTagline: "",
    },
    skills: {
      eyebrow: "Skills",
      title: "Qué hago",
      items: [
        { number: "01", title: "Diseño de producto", desc: "Diseño de producto digital de principio a fin, desde la investigación inicial hasta la entrega al equipo de desarrollo." },
        { number: "02", title: "Sistemas de diseño", desc: "Creación de sistemas de diseño escalables que mantienen la consistencia y aceleran el desarrollo." },
        { number: "03", title: "UX Research", desc: "Investigación de usuarios, tests de usabilidad y análisis de datos para decisiones basadas en evidencia." },
      ],
    },
    project: {
      back: "Todo el trabajo",
      overview: "Resumen",
      challenge: "El Reto",
      process: "Proceso",
      outcomes: "Resultados",
      nextProject: "Siguiente Proyecto",
      client: "Cliente",
      year: "Año",
      role: "Rol",
      deliverables: "Entregables",
    },
  },
};

export type Locale = "en" | "es";
