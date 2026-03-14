const BASE = "https://anico.es/wp-content/uploads/2024/12";

export type Project = {
  id: number;
  slug: string;
  index: string;
  name: string;
  subtitle: string;
  client: string;
  category: string;
  year: string;
  role: string;
  deliverables: string[];
  tags: string[];
  description: string;
  size: "regular" | "regular";
  palette: number; // 1–5, tints the image container bg while loading
  thumbnail: string;
  /** Hero image for project page: from xxx_hero.(png|jpg|...) in project folder */
  heroImage?: string;
  /** Hero video for project page: from xxx_hero.(mp4|webm|mov) in project folder */
  heroVideo?: string;
  images: (string | string[])[]; // string[] = fade slider group
  // Enriched at runtime by lib/scan-project.ts (server-only)
  sections?: { title?: string; images: (string | string[])[]; videos?: string[] }[];
  videos?: string[];
  links?: { label: string; url: string }[];
  /** CTA button from content.txt [button] (download / visit web) */
  ctaButton?: { label: string; url: string };
  /** Locale overrides from content.txt [block.locale] sections */
  localizations?: Record<string, Partial<Pick<Project, "overview" | "challenge" | "process" | "outcome" | "stats">>>;
  // Case study content
  overview: string;
  challenge: string;
  process: string;
  outcome: string;
  stats: { text: string }[];
};

export const projects: Project[] = [
  {
    id: 6,
    slug: "fundfy",
    index: "02",
    name: "Fundfy",
    subtitle: "A premium landing page for an exclusive private investment club",
    client: "Fundfy Investment Club SL",
    category: "Landing Page Design",
    year: "2024",
    role: "Senior Designer",
    deliverables: ["Landing Page Design", "Visual Design", "UX Design", "Art Direction"],
    tags: ["Fintech", "Landing Page", "Dark Mode"],
    description:
      "Corporate landing page for Fundfy, a regulated European investment club offering managed crypto and digital asset portfolios combined with exclusive lifestyle experiences.",
    size: "regular",
    palette: 2,
    thumbnail: "/projects/fundfy/01_hero.png",
    images: [
      "/projects/fundfy/01_hero.png",
      "/projects/fundfy/03_portfolios.png",
      "/projects/fundfy/04_experiences.png",
      "/projects/fundfy/05_mobile.png",
      "/projects/fundfy/03_portfolios.png",
    ],
    overview:
      "Fundfy is a regulated private investment club, MiCA-licensed in Europe, offering members access to professionally managed crypto and digital asset portfolios alongside exclusive lifestyle experiences: luxury supercars, sailing, private events. The brief was to design a landing page that converted high-net-worth prospects into members, while simultaneously communicating regulatory credibility, proven returns, and premium exclusivity.",
    challenge:
      "The fundamental tension in the brief was trust versus aspiration. Investment products demand sober, credible design, data, structure, regulatory signals. But Fundfy's differentiation is its lifestyle dimension: the promise of a club, not just a fund. Too financial and it loses its personality; too lifestyle-forward and sceptical investors won't convert. The secondary challenge was communicating complex portfolio products (four distinct investment tiers with different time horizons and return profiles) without overwhelming visitors who arrive with varying levels of financial sophistication.",
    process:
      "I established a dark-mode premium aesthetic as the foundation, dark enough to feel exclusive and modern, with enough typographic hierarchy to communicate seriousness. The hero section leads with brand and transformation ('Transform Your Financial Life') before presenting credentials. The portfolio section uses a structured card grid that lets users compare the four tiers at a glance. The experiences section breaks the financial density with immersive photography, supercars, yachts, reinforcing the club positioning. Real-time market data (via TradingView) was integrated to signal professional-grade infrastructure.",
    outcome:
      "The landing page launched in 2024 as Fundfy's primary conversion surface. The design successfully bridges the gap between regulated financial product and exclusive lifestyle brand, a combination that differentiates Fundfy in the increasingly crowded European crypto investment space. The page is live at fundfy.io.",
    stats: [
      { text: "+450% Cumulative returns since 2018" },
      { text: "MiCA European regulation" },
      { text: "4 Portfolio tiers designed" },
      { text: "2024 Launch year" },
    ],
  },

  {
    id: 9,
    slug: "gm-world",
    index: "03",
    name: "GM World!",
    subtitle: "Brand identity for a global forum at the frontier of Web3, AI, and the Metaverse",
    client: "Metacampus",
    category: "Brand Identity & Web",
    year: "2024",
    role: "Senior Designer",
    deliverables: ["Brand Identity", "Visual System", "Corporate Assets", "Digital Templates"],
    tags: ["Branding", "Web3", "Art Direction"],
    description:
      "Brand development and corporate identity for GM World!, Metacampus's annual global forum focused on Web3, Artificial Intelligence, and the Metaverse, designed to evolve with each host city.",
    size: "regular",
    palette: 2,
    thumbnail: `${BASE}/GM.png`,
    images: [
      `${BASE}/GM1.png`,
      `${BASE}/GM2.png`,
      `${BASE}/GM3.png`,
      `${BASE}/GM4.png`,
      `${BASE}/GM5.png`,
      `${BASE}/GM6.png`,
      `${BASE}/GM7.png`,
      `${BASE}/GM8.png`,
      `${BASE}/GM9.png`,
      `${BASE}/GM_mobile.png`,
    ],
    overview:
      "GM World! is the annual global forum organised by Metacampus, a Web3 education company, bringing together industry leaders, creators, and innovators around the themes of artificial intelligence, the Metaverse, and decentralised technology. In 2024 I developed the full brand identity and visual assets for the forum, creating a system flexible enough to evolve with each edition while maintaining a consistent core identity.",
    challenge:
      "The forum is international by design, each edition takes place in a different host city, with a different cultural context. The brand needed to be globally neutral enough to work anywhere, while also adaptable enough to absorb local character without losing coherence. It also had to position GM World! as a serious professional event, not just another Web3 hype vehicle.",
    process:
      "The identity is built around a bold, modular typographic system that serves as the primary design vehicle. Rather than relying on a complex illustration or iconographic system that would need to be rethought for each city, the typography itself becomes the canvas for local adaptation, colour, texture, and photographic references from each host city can be layered into the letterforms without changing the structural identity. Corporate assets, digital templates, and environmental signage all derive from the same typographic grid.",
    outcome:
      "The GM World! identity launched with the 2024 forum edition and was adopted across the full event brand: stage design, digital promotion, printed materials, and speaker assets. The modular system is flexible enough to extend to future editions without requiring a full redesign each year.",
    stats: [
      { text: "2024 Launch year" },
      { text: "Global Event scope" },
      { text: "Web3 Industry" },
      { text: "Metacampus Client" },
    ],
  },

  {
    id: 1,
    slug: "asphalt-unite",
    index: "04",
    name: "Asphalt Unite",
    subtitle: "Redesigning a flagship racing franchise for the esports era",
    client: "Gameloft Barcelona",
    category: "Video Game UI/UX",
    year: "2023",
    role: "Senior Designer",
    deliverables: ["UI/UX Design", "Art Direction", "Esports Branding", "Console Navigation", "Prototyping"],
    tags: ["Game UI/UX", "Art Direction", "Esports"],
    description:
      "Full UI/UX redesign of the Asphalt franchise's new entry, cross-platform navigation built for console, with a bold esports-inspired visual language.",
    size: "regular",
    palette: 1,
    thumbnail: `${BASE}/AU.png`,
    images: [
      `${BASE}/AU1.png`,
      [`${BASE}/A92023_class-A_esports2.png`, `${BASE}/A92023_Class-A_clean.png`],
      [`${BASE}/A92023_class-C_esports2.png`, `${BASE}/A92023_Class-C_clean.png`],
      [`${BASE}/A92023_class-D_esports2.png`, `${BASE}/A92023_Class-D_clean.png`],
      `${BASE}/Main_Menu_A9-ezgif.com-optimize.gif`,
      `${BASE}/splash_02.jpg`,
      `${BASE}/Porsche_Garage_Alberto.png`,
      `${BASE}/AU2.png`,
      `${BASE}/AU4.png`,
      `${BASE}/AU5.png`,
      `${BASE}/AU7.png`,
      `${BASE}/AU8.png`,
      `${BASE}/AU9.png`,
      `${BASE}/AU12.png`,
      `${BASE}/AU11.png`,
      `${BASE}/AU10.png`,
      `${BASE}/AU13.png`,
      `${BASE}/AU14.png`,
    ],
    overview:
      "Asphalt Unite is a new chapter in Gameloft's long-running racing franchise, a title built from the ground up for console platforms and designed to compete in the esports arena. I joined the project as the lead UI/UX designer, tasked with rethinking every surface of the game's interface: from vehicle class presentation and main menu flows to garage experiences and in-game HUD elements.",
    challenge:
      "The core challenge was bridging two worlds: the franchise's existing mobile-first heritage and the demands of a console-native experience. Console players navigate entirely with a gamepad, expect high information density on large screens, and bring a very different context of use than mobile players. At the same time, the esports rebrand meant departing from the game's previous visual direction and moving toward something more aggressive, graphic, and broadcast-ready.",
    process:
      "I began with a deep audit of competitive console racers, studying navigation patterns in Forza Horizon, Gran Turismo, and Need for Speed, and ran internal playtests to identify friction points in the legacy mobile flows. The vehicle class screens (A, C, D) became the centrepiece of the new visual language: large-format renders, bold typography, and a colour-coded tier system that reads instantly on a TV from the couch. The main menu was redesigned as an animated entry point that communicates scale and energy before a single race begins.",
    outcome:
      "The redesigned UI shipped as the definitive visual identity for Asphalt Unite, establishing the esports aesthetic that will carry the franchise forward on console and PC platforms. Internal user testing showed a 40% reduction in navigation errors compared to the previous prototype, and the art direction received unanimous approval from the publishing stakeholders on first presentation.",
    stats: [
      { text: "40% Fewer nav errors" },
      { text: "3 Vehicle class systems" },
      { text: "Console Primary platform" },
      { text: "2023 Ship year" },
    ],
  },

  {
    id: 2,
    slug: "metacampus",
    index: "05",
    name: "Metacampus",
    subtitle: "A fresh identity for the education hub at the frontier of Web3 and AI",
    client: "Metacampus",
    category: "Brand Identity & Web",
    year: "2023",
    role: "Senior Designer",
    deliverables: ["Corporate Identity", "Web Design", "Figma Prototype", "Visual System"],
    tags: ["Branding", "Web Design", "Web3"],
    description:
      "Corporate identity and website for an educational hub specialising in Web3, Artificial Intelligence, and the Metaverse, clean, geometric, and built for a rapidly evolving space.",
    size: "regular",
    palette: 2,
    thumbnail: `${BASE}/metacampus.png`,
    images: [
      `${BASE}/MC1.png`,
      `${BASE}/MC2a.png`,
      `${BASE}/MC2b.png`,
      `${BASE}/MC2c.png`,
      `${BASE}/MC3.png`,
    ],
    overview:
      "Metacampus is an educational hub focused on emerging technologies: Web3, Artificial Intelligence, and the Metaverse. As a young company at the vanguard of these fields, they needed an identity that felt simultaneously credible and energetic, capable of attracting both enterprise clients and individual learners. I led the full design process from initial concept to delivered design system and interactive Figma prototype.",
    challenge:
      "The brief called for a 'fresh, clean aesthetic that conveyed education and learning.' But the risk with emerging-tech branding is defaulting to the same visual clichés, neon gradients, abstract 3D blobs, dark-mode-only palettes, that every crypto and AI startup uses. I needed to create something that felt genuinely modern without disappearing into the noise of the category.",
    process:
      "The concept grew from Metacampus's own structure: the company is organised around four core pillars (Web3, AI, Metaverse, Community). I took the geometric shapes already associated with those pillars and used them as the building blocks of the entire visual language, from the logomark to the section dividers to the UI grid. The result is an identity that is inherently educational (it shows how the parts make the whole) while remaining visually dynamic and adaptable across digital touchpoints.",
    outcome:
      "Metacampus launched with the new identity in 2023 and used it across their full digital presence, including a Figma-prototyped website delivered for the development team. The geometric system proved flexible enough to extend into social media templates, presentation decks, and event materials without losing coherence.",
    stats: [
      { text: "4 Brand pillars" },
      { text: "2023 Launch year" },
      { text: "Web3 Industry" },
      { text: "Figma Prototype delivered" },
    ],
  },

  {
    id: 8,
    slug: "disney-karting",
    index: "06",
    name: "Disney Karting",
    subtitle: "A self-initiated art direction proposal for a Disney karting game with a more mature edge",
    client: "Gameloft Barcelona",
    category: "Video Game UI/UX",
    year: "2020",
    role: "Senior Designer",
    deliverables: ["Art Direction", "UI/UX Design", "Character Design", "Game UI Proposal"],
    tags: ["Game UI/UX", "Art Direction", "Disney"],
    description:
      "Self-initiated UI/UX and art direction proposal for a Disney karting game, maintaining the franchise's iconic brand aesthetics while introducing a more mature visual tone that broadens the target audience beyond children.",
    size: "regular",
    palette: 4,
    thumbnail: `${BASE}/disney.png`,
    images: [
      `${BASE}/disney1.png`,
      `${BASE}/Disney2.png`,
      `${BASE}/Disney3.png`,
      `${BASE}/Disney4.png`,
      `${BASE}/Disney5.png`,
      `${BASE}/Disney6.png`,
      `${BASE}/Disney7.png`,
      `${BASE}/Disney8.png`,
      `${BASE}/Disney9.png`,
      `${BASE}/Disney10.png`,
      [`${BASE}/Character_Selection1.jpg`, `${BASE}/Character_Selection1b.jpg`],
      `${BASE}/Character_Selection2.jpg`,
      `${BASE}/collection.png`,
      `${BASE}/Disney11.png`,
      `${BASE}/Disney12.png`,
      `${BASE}/Disney13.png`,
      `${BASE}/Disney14-1920x1080.png`,
      `${BASE}/Disney15.jpg`,
      `${BASE}/Disney16-1920x1080.png`,
      [`${BASE}/Character_Selection3.jpg`, `${BASE}/Character_Selection3b.jpg`],
      `${BASE}/Character_Selection4.jpg`,
      `${BASE}/03_Character.jpg`,
      `${BASE}/04_Character.jpg`,
      `${BASE}/character_grey.jpg`,
      `${BASE}/decal_suite.jpg`,
      `${BASE}/Disney17.png`,
      `${BASE}/Disney18.png`,
    ],
    overview:
      "In 2020 I developed a self-initiated art direction and UI/UX proposal for a Disney karting game at Gameloft Barcelona. The concept was built around a simple but ambitious premise: what would a Disney karting game look like if it were designed to appeal equally to adult fans of the IP and to younger players? The result is a visual system that honours Disney's iconic characters and brand equity while pushing the aesthetic into bolder, more cinematic territory.",
    challenge:
      "The core tension in designing for Disney IP is the brand's dual audience: a property built for children that is genuinely loved by adults. Most licensed games resolve this by defaulting to a child-first aesthetic, which works but leaves significant audience on the table. The challenge here was to find a visual language that reads as premium and mature enough to appeal to a broader demographic, while never losing the warmth, colour, and character recognition that make Disney IP valuable in the first place.",
    process:
      "The proposal covers the full UI/UX surface: character selection flows, kart customisation, race HUD, and marketing key art. Character screens were designed with a cinematic framing, large-format character renders, dramatic lighting, and a colour palette drawn from each character's canonical world rather than a generic brand palette. The decal and customisation system was built to feel like a proper game feature, not an afterthought. Multiple visual directions were explored before landing on the approach that best balanced Disney's brand requirements with the more mature tone the concept demanded.",
    outcome:
      "The proposal served as an internal creative benchmark and art direction reference at Gameloft Barcelona, demonstrating what a high-quality Disney karting title could look and feel like with the right creative investment. The project remains one of the most complete self-initiated concept packages in my portfolio, covering UI, character design, kart customisation, and marketing assets from a single cohesive visual brief.",
    stats: [],
  },

  {
    id: 4,
    slug: "netflix-app",
    index: "07",
    name: "Netflix App",
    subtitle: "A self-initiated redesign exploring new interactions within Netflix's brand system",
    client: "Self Project",
    category: "App UI/UX Redesign",
    year: "2019",
    role: "Senior Designer",
    deliverables: ["UI/UX Design", "Interactive Prototype", "Interaction Design"],
    tags: ["App Design", "Prototyping", "Self Project"],
    description:
      "A fully interactive Protopie prototype redesigning the Netflix app, new interactions, a 'seen movies' carousel, and a reimagined main menu, all within Netflix's brand guidelines.",
    size: "regular",
    palette: 4,
    thumbnail: `${BASE}/netflix.png`,
    images: [
      `${BASE}/netflix_app.gif`,
      `${BASE}/netflix.png`,
      `${BASE}/netflix.png`,
      `${BASE}/netflix_app.gif`,
      `${BASE}/netflix.png`,
    ],
    overview:
      "This was a self-initiated project, a personal exploration of what a redesigned Netflix app might look and feel like. The goal wasn't to replace Netflix's existing design (which is excellent) but to use the constraints of an established brand system as a creative brief: what new interactions are possible within these rules? What features would make the experience meaningfully better?",
    challenge:
      "Redesigning a product used by hundreds of millions of people means working under the weight of established habit. Any change has to feel like an improvement, not a departure, users should feel 'that's exactly what I wanted' rather than 'this is different.' The additional constraint of staying strictly within Netflix's brand guidelines meant the innovation had to come from interaction and information architecture, not visual novelty.",
    process:
      "I built the entire prototype in Protopie, a high-fidelity interactive tool that allows for complex conditional logic, physics-based interactions, and realistic micro-animations. The two centrepiece features: a 'seen movies' carousel that reorganises content based on viewing history (making re-watches easier to find) and a reimagined main menu that reduces the decision fatigue of the current grid by surfacing personalised editorial collections.",
    outcome:
      "The prototype was fully interactive and shareable, published on Protopie for anyone to try. It demonstrated that significant usability improvements are achievable within Netflix's existing design language, and generated significant engagement when shared in design communities.",
    stats: [
      { text: "Protopie Prototype tool" },
      { text: "2019 Year" },
      { text: "100% Brand compliant" },
      { text: "Self Initiated" },
    ],
  },

  {
    id: 11,
    slug: "nike-shop",
    index: "08",
    name: "Nike Shop",
    subtitle: "A self-initiated Protopie prototype exploring video-first e-commerce for Nike",
    client: "Self Project",
    category: "App UI/UX Redesign",
    year: "2019",
    role: "Senior Designer",
    deliverables: ["UX Design", "Interactive Prototype", "Interaction Design"],
    tags: ["App Design", "Prototyping", "E-Commerce"],
    description:
      "A fully interactive Protopie prototype reimagining Nike's e-commerce experience, exploring video-first product presentation and experimental interaction patterns within the brand's visual system.",
    size: "regular",
    palette: 5,
    thumbnail: `${BASE}/nike.png`,
    images: [
      `${BASE}/nike_shop_ok.gif`,
    ],
    overview:
      "A self-initiated prototype exploring what a video-first Nike e-commerce experience might look and feel like. The project uses Protopie's advanced interaction capabilities to build a fully interactive concept, replacing static product photography with short looping video clips and reimagining browsing and checkout flows around that richer content format.",
    challenge:
      "Nike leads in physical retail innovation but its digital shopping experience has remained relatively conservative for such an expressive brand. The challenge was to design something that felt as bold and product-focused as Nike's physical stores, using motion and interaction to bring the same energy to the screen.",
    process:
      "The entire prototype was built in Protopie, taking advantage of the tool's ability to handle video assets, physics-based interactions, and complex conditional logic. Video replaces static imagery as the primary product presentation medium throughout the shopping journey, from category browsing to the individual product page.",
    outcome:
      "A fully interactive prototype demonstrating a premium, video-first approach to Nike's digital retail. Published on Protopie for sharing and feedback in the design community.",
    stats: [
      { text: "Protopie Tool" },
      { text: "2019 Year" },
      { text: "Video-first Concept" },
      { text: "Self Initiated" },
    ],
  },

  {
    id: 12,
    slug: "hawkers",
    index: "09",
    name: "Hawkers",
    subtitle: "An interactive e-commerce concept for the Spanish eyewear brand, built in Protopie",
    client: "Self Project",
    category: "App UI/UX Redesign",
    year: "2019",
    role: "Senior Designer",
    deliverables: ["UX Design", "Interactive Prototype", "E-Commerce Design"],
    tags: ["App Design", "Prototyping", "E-Commerce"],
    description:
      "Self-initiated e-commerce concept for Hawkers, the Spanish eyewear brand, redesigning the shopping experience to match the brand's irreverent, digital-native personality. Built entirely in Protopie.",
    size: "regular",
    palette: 4,
    thumbnail: `${BASE}/hawkers.png`,
    images: [
      `${BASE}/hawkers_shop.gif`,
    ],
    overview:
      "Hawkers built its brand around personality and social media, a digital-native eyewear brand with a strong point of view. This self-initiated prototype reimagines its e-commerce experience to feel as distinctive as the brand itself: playful, visual, and unapologetically product-focused. The entire concept was built and prototyped in Protopie.",
    challenge:
      "Hawkers has an expressive brand identity that its digital retail experience doesn't fully reflect. The design challenge was to create an e-commerce concept with the same energy as its marketing, bold, fast, image-led, without sacrificing the clarity and conversion efficiency that retail design requires.",
    process:
      "Built entirely in Protopie, the prototype explores a visually rich shopping interface that puts the product front and centre. Navigation, product pages, and checkout flow were redesigned to create a more immersive, brand-consistent experience that feels like a natural extension of how Hawkers communicates on social media.",
    outcome:
      "A complete interactive prototype demonstrating an alternative e-commerce direction for Hawkers. Published on Protopie for interactive viewing and shared within the design community.",
    stats: [
      { text: "Protopie Tool" },
      { text: "2019 Year" },
      { text: "Brand-led Approach" },
      { text: "Self Initiated" },
    ],
  },

  {
    id: 3,
    slug: "asphalt-9",
    index: "10",
    name: "Asphalt 9",
    subtitle: "Game UI for one of the most-downloaded mobile racers of all time",
    client: "Gameloft Barcelona",
    category: "Video Game UI/UX",
    year: "2018",
    role: "Senior Designer",
    deliverables: ["Game UI Design", "HUD Design", "Menu Flows", "Vehicle Screens", "Asset Production"],
    tags: ["Game UI/UX", "Mobile", "HUD Design"],
    description:
      "UI/UX design for Asphalt 9: Legends, the flagship mobile racing game from Gameloft that went on to be downloaded over 200 million times worldwide.",
    size: "regular",
    palette: 3,
    thumbnail: `${BASE}/A9.png`,
    images: [
      `${BASE}/A9_1.png`,
      `${BASE}/A9_2.png`,
      `${BASE}/A9_3.png`,
      `${BASE}/A9_6a.png`,
      `${BASE}/A9_6b.png`,
    ],
    overview:
      "Asphalt 9: Legends is the ninth entry in Gameloft's flagship racing franchise and the most ambitious mobile racing game ever built at the time of launch. I was part of the UI/UX team at Gameloft Barcelona, working on the interface from pre-production through ship: designing menu systems, vehicle showcase screens, the in-game HUD, and the social and multiplayer surfaces that would define how hundreds of millions of players experience the game.",
    challenge:
      "Mobile game UI operates under extreme constraints: tiny touch targets, a fraction of a second to communicate critical information during gameplay, and the need to serve both 7-year-olds and competitive adult players on the same screen. Asphalt 9 also had to push visual quality beyond anything the franchise had done before, the game's visual technology was industry-leading and the UI had to match that ambition without overwhelming players.",
    process:
      "The design work spanned the full interface: from high-level information architecture (how do you navigate a game with 900+ cars and dozens of game modes?) to individual HUD elements (how do you show speed, nitro, and position without blocking the spectacle on screen?). Vehicle showcase screens were designed to feel like automotive photography, large format, dramatic lighting, minimal chrome, while the menu system used a consistent spatial metaphor to help players always know where they were in the game.",
    outcome:
      "Asphalt 9: Legends launched in July 2018 to critical and commercial success. It reached over 200 million downloads and became the top-grossing racing game on both iOS and Android. The visual direction and UI design established the template for all subsequent Asphalt titles.",
    stats: [
      { text: "200M+ Downloads" },
      { text: "#1 Racing game, iOS & Android" },
      { text: "2018 Launch year" },
      { text: "900+ Cars in-game" },
    ],
  },

  {
    id: 10,
    slug: "asphalt-xtreme",
    index: "11",
    name: "Asphalt Xtreme",
    subtitle: "UI/UX, logo, and marketing design for Gameloft's off-road racing title",
    client: "Gameloft Barcelona",
    category: "Video Game UI/UX",
    year: "2016",
    role: "Senior Designer",
    deliverables: ["Game UI/UX", "Logo Design", "Custom Typography", "Marketing Assets"],
    tags: ["Game UI/UX", "Logo", "Mobile"],
    description:
      "UI/UX design, logo creation, custom typography, and marketing campaign assets for Asphalt Xtreme, Gameloft Barcelona's off-road racing entry in the Asphalt franchise.",
    size: "regular",
    palette: 3,
    thumbnail: `${BASE}/AXT.png`,
    images: [
      `${BASE}/AXT1.png`,
      `${BASE}/AXT2.png`,
      `${BASE}/AXT3.png`,
      `${BASE}/AXT4.png`,
      `${BASE}/AXT5.png`,
      [`${BASE}/AXT6_1.png`, `${BASE}/AXT6_2.png`, `${BASE}/AXT6_3.png`, `${BASE}/AXT6_4.png`],
      `${BASE}/AXT7.png`,
      `${BASE}/AXT8.png`,
    ],
    overview:
      "Asphalt Xtreme is the off-road entry in Gameloft's Asphalt franchise, a departure from the street racing formula that defined Asphalt 8 and later Asphalt 9. I joined the project at Gameloft Barcelona as UI/UX designer, working across the full game interface: from the custom logo and typography system to the menu flows, HUD design, and marketing assets that would launch the title in October 2016.",
    challenge:
      "The Asphalt brand is closely associated with high-speed street racing and urban environments. Xtreme needed to signal a different kind of game, rawer, more aggressive, off-road, while remaining instantly recognisable as part of the franchise. The UI had to carry that dual identity: familiar enough for existing fans, visually distinct enough to communicate the new gameplay direction.",
    process:
      "I designed a custom wordmark for Asphalt Xtreme that brought a more rugged, hand-crafted quality to the franchise's typically clean typography, angular forms, weathered texture, energy. The menu UI and HUD were designed around an earthy, high-contrast palette that referenced dirt, dust, and terrain rather than city lights. Marketing assets completed the package: key art layouts, promotional graphics, and App Store / Google Play screenshots.",
    outcome:
      "Asphalt Xtreme launched in October 2016 to strong commercial performance, extending the Asphalt franchise into the off-road racing category. The title reached over 100 million downloads and established Gameloft's presence in this new segment.",
    stats: [
      { text: "100M+ Downloads" },
      { text: "2016 Launch year" },
      { text: "Off-road New category" },
      { text: "Gameloft Studio" },
    ],
  },

  {
    id: 5,
    slug: "telepport",
    index: "12",
    name: "Telepport",
    subtitle: "Designing the first platform to teleport you anywhere in the world",
    client: "Visyon",
    category: "Immersive Platform Design",
    year: "2014",
    role: "Senior Designer",
    deliverables: ["Platform Design", "UX Design", "Immersive UI", "Content System"],
    tags: ["VR", "Immersive", "Platform"],
    description:
      "Platform design for Visyon's Telepport, the first centralised hub for head-mounted display content, allowing creators to distribute immersive experiences to any HMD device.",
    size: "regular",
    palette: 5,
    thumbnail: `${BASE}/telepport.png`,
    images: [
      `${BASE}/telepport1.png`,
      `${BASE}/telepport3.png`,
      `${BASE}/telepport4.png`,
      `${BASE}/telepport5.png`,
      `${BASE}/telepport1.png`,
    ],
    overview:
      "Telepport was one of the earliest commercial platforms built for immersive content distribution, designed at a moment when VR was still a nascent consumer technology and the tools and conventions for immersive design barely existed. Working with Visyon in 2014, I designed the platform interface that would allow creators to publish 360° video, immersive images, and 3D experiences to head-mounted display devices.",
    challenge:
      "Designing for VR in 2014 meant designing without established conventions, without a mature user base, and without reference examples. Every interaction decision, how do you navigate without a mouse? how do you signal depth and focus in a space with no physical cursor?, had to be invented from first principles. The additional challenge was building something accessible enough for non-technical content creators while powerful enough for studios and broadcasters.",
    process:
      "The design process was heavily iterative and research-driven. We ran usability sessions with early HMD devices (primarily Oculus DK1 and DK2) and adapted the interface based on what caused disorientation or confusion. The platform UI was designed in layers: a flat 2D interface for the web dashboard (where creators uploaded and managed content) and a separate spatial UI for the immersive viewing experience itself.",
    outcome:
      "Telepport launched as the first platform of its kind and was adopted by major media organisations and content studios looking to distribute VR content. The project established foundational design patterns for immersive content platforms that influenced how the industry approached VR publishing in the years that followed.",
    stats: [
      { text: "2014 Launch year" },
      { text: "First HMD content platform" },
      { text: "VR/360° Content formats" },
      { text: "Visyon Client" },
    ],
  },

  {
    id: 13,
    slug: "some-logos",
    index: "13",
    name: "Some Logos",
    subtitle: "A selection of logo and brand identity marks across industries and scales",
    client: "Various",
    category: "Brand Identity",
    year: "2014 – 2024",
    role: "Senior Designer",
    deliverables: ["Logo Design", "Brand Identity", "Visual Systems", "Usage Guidelines"],
    tags: ["Branding", "Logo", "Identity"],
    description:
      "A curated collection of logo and brand identity marks created for clients across hospitality, healthcare, technology, retail, and entertainment, each developed in response to a specific brief and audience.",
    size: "regular",
    palette: 1,
    thumbnail: `${BASE}/some_logos.gif`,
    images: [
      `${BASE}/hostalneutral.png`,
      `${BASE}/thisplay.png`,
      `${BASE}/boost.png`,
      `${BASE}/doctordent.png`,
      `${BASE}/intecocert.png`,
      `${BASE}/twoweeks.png`,
      `${BASE}/tapeart.png`,
      `${BASE}/idoforyou.png`,
      `${BASE}/rsf.png`,
      `${BASE}/mitjasalou.png`,
      `${BASE}/reevolucio.png`,
      `${BASE}/neuronic.png`,
      `${BASE}/telepport-1.png`,
      `${BASE}/norpresso.png`,
      `${BASE}/srtatempleton.png`,
      `${BASE}/ACT.png`,
    ],
    overview:
      "A selection of logo and brand identity marks created for clients across different industries and scales, from hospitality and healthcare to technology, retail, and entertainment. Each mark was developed in response to a specific brief, audience, and competitive context, spanning a decade of freelance and studio work.",
    challenge:
      "Logo design is deceptively constrained: the entire identity of a brand must be communicated in a single mark that works at 16px and 1600px, in colour and in black and white, in digital and physical contexts. Each project here presented a different version of that fundamental challenge, different industries, different brand personalities, different formal vocabularies.",
    process:
      "Each mark was developed through an iterative process: research into the category and competitive landscape, concept generation across multiple directions, refinement through client feedback, and finalisation with full brand usage guidelines. The collection spans different stylistic approaches, wordmarks, monograms, emblems, abstract symbols, reflecting the variety of briefs received.",
    outcome:
      "A diverse portfolio of marks deployed across brand identities for companies in Spain and internationally, covering hospitality, health, media, tech, and retail sectors. Each mark has been in active use by its client since delivery.",
    stats: [
      { text: "16+ Marks designed" },
      { text: "10+ Years span" },
      { text: "Multi Industry" },
      { text: "Spain Based" },
    ],
  }

];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getAdjacentProject(
  slug: string,
  direction: "next" | "prev"
): Project | undefined {
  const idx = projects.findIndex((p) => p.slug === slug);
  if (idx === -1) return undefined;
  if (direction === "next") return projects[(idx + 1) % projects.length];
  return projects[(idx - 1 + projects.length) % projects.length];
}
