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
      slides={SLIDES.games}
      title="Interfaces for games played by *hundreds of millions*."
      intro="Over a decade shaping how millions of players navigate, compete and stay hooked. Game UI/UX for leading studios, from first concept to worldwide launch."
      items={items}
    />
  );
}
