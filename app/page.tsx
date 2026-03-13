import { getEnrichedProjects } from "@/lib/scan-project";
import { getHeroImages } from "@/lib/get-hero-images";
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

  return (
    <>
      <Nav />
      <main className="overflow-x-hidden">
        <Hero heroImages={heroImages} />
        <Marquee />
        <Work projects={projects} />
        <About />
        <Contact />
        <Footer />
      </main>
    </>
  );
}
