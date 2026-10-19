import { SLIDES } from "@/lib/maqueta/sections";
import { yearsOfExperience } from "@/lib/maqueta/years";
import HomeView from "@/components/case-study/HomeView";
import { casesIn } from "@/lib/maqueta/cases";
import { thumbOf } from "@/lib/maqueta/media";
import { BASE } from "@/lib/maqueta/base";
import { GAMES_INTRO, pageMeta } from "@/lib/maqueta/meta";

// Se regenera a diario: los años de experiencia suben solos.
export const metadata = pageMeta("Games", { description: GAMES_INTRO });
export const revalidate = 86400;

/* Home de Games: UI/UX de videojuegos, del más reciente al más antiguo. */

export default function GamesHome() {
  // Disney Karting en el hueco grande y Asphalt 9 en el pequeño (2026-10-17: que se vea más Disney).
  const ORDER = ["asphalt-unite", "cybertitans", "asphalt-9", "disney-karting", "asphalt-xtreme"];
  const games = [...casesIn("games")].sort((a, b) => ORDER.indexOf(a.slug) - ORDER.indexOf(b.slug));
  const items = games.map((c) => ({
    name: c.name,
    line: c.line,
    type: c.services[0],
    year: c.year,
    thumb: thumbOf(c.slug),
    href: `${BASE}/${c.slug}`,
  }));
  return (
    <HomeView
      active="games"
      slides={SLIDES.games}
      title="Interfaces for games played by *hundreds of millions*."
      intro={GAMES_INTRO}
      items={items}
      years={yearsOfExperience()}
    />
  );
}
