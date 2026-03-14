import { getEnrichedProjects } from "@/lib/scan-project";
import { getHeroImages } from "@/lib/get-hero-images";
import { getProfileConfig } from "@/lib/scan-profile";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Work from "@/components/Work";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  const projects = getEnrichedProjects();
  const heroImages = getHeroImages();
  const profile = getProfileConfig();

  return (
    <>
      <Nav />
      <main className="overflow-x-hidden">
        <Hero heroImages={heroImages} profileHero={profile.hero} />
        <Marquee text={profile.marquee} />
        <Work projects={projects} />
        <About profileAbout={profile.about} />
        <Contact profileContact={profile.contact} email={profile.email} linkedin={profile.linkedin} />
        <Footer />
      </main>
    </>
  );
}
