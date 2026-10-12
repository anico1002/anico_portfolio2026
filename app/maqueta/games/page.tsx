import { SLIDES } from "@/lib/maqueta/sections";
import HomeView from "@/components/case-study/HomeView";
import { casesIn } from "@/lib/maqueta/cases";
import { thumbOf } from "@/lib/maqueta/media";

/* Home de Games: UI/UX de videojuegos, del más reciente al más antiguo. */

export default function GamesHome() {
  const items = casesIn("games").map((c) => ({
    name: c.name,
    line: c.line,
    type: c.services[0],
    year: c.year,
    thumb: thumbOf(c.slug),
    href: `/maqueta/${c.slug}`,
  }));
  return (
    <HomeView
      active="games"
      label="Games"
      slides={SLIDES.games}
      title="Interfaces para juegos que llegan a cientos de millones de jugadores."
      intro="Más de una década centrado en UI/UX de videojuegos, con estudios como Gameloft Barcelona: menús, HUD, sistemas visuales y marketing, de la preproducción al lanzamiento."
      items={items}
    />
  );
}
