"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowDown } from "lucide-react";
import { useScroll, useTransform, motion } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { translations } from "@/lib/i18n";

interface HeroProps {
  heroImages: string[];
  profileHero?: { eyebrow: string; headline: string; desc: string };
}

export default function Hero({ heroImages, profileHero }: HeroProps) {
  const { locale } = useApp();
  const base = translations[locale].hero;
  const t = profileHero ? { ...base, ...profileHero } : base;
  const [shuffled, setShuffled] = useState(heroImages);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const arr = [...heroImages];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setShuffled(arr);
    setActiveIndex(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const contentY = useTransform(scrollYProgress, [0, 0.5], ["0%", "80px"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  useEffect(() => {
    if (shuffled.length === 0) return;
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % shuffled.length);
    }, 5000);
    return () => clearInterval(id);
  }, [shuffled.length]);

  const headlineLines = t.headline.split("\n");

  return (
    <section ref={ref} className="h-screen relative overflow-hidden">
      {/* Background: imágenes en public/hero-imgs, loop infinito */}
      <motion.div className="absolute inset-0 overflow-hidden bg-muted" style={{ y: imageY }}>
        {shuffled.map((src, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{
              zIndex: i === activeIndex ? 1 : 0,
              opacity: i === activeIndex ? 1 : 0,
            }}
          >
            <Image
              src={src}
              alt=""
              fill
              className="object-cover"
              sizes="100vw"
              unoptimized={src.endsWith(".gif") || src.startsWith("/hero-imgs/")}
              priority={i === 0}
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-black/60 z-10" />
      </motion.div>

      {/* Bloque de texto alineado al logo (mismo padding que header) y pegado al bottom */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 pb-20 pl-6 pr-6 md:pl-12 md:pr-12 z-10"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <p className="text-white/70 mb-4 text-sm tracking-widest uppercase">
          {t.eyebrow}
        </p>
        <div className="flex flex-col font-display font-semibold leading-[0.9] mb-6 text-white">
          {headlineLines.map((line, i) => (
            <span key={i} className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl">
              {line}
            </span>
          ))}
        </div>
        <p className="text-white/70 text-lg md:text-xl max-w-2xl">{t.desc}</p>
      </motion.div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
        <ArrowDown className="w-6 h-6 text-white animate-bounce-down" />
      </div>
    </section>
  );
}
