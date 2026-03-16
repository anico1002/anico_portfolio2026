"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { useScroll, useTransform, motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { translations } from "@/lib/i18n";
import type { HeroItem } from "@/lib/get-hero-images";

const SLIDE_DURATION = 5000;

interface HeroProps {
  heroImages: HeroItem[];
  profileHero?: { eyebrow: string; headline: string; desc: string };
}

export default function Hero({ heroImages, profileHero }: HeroProps) {
  const { locale } = useApp();
  const base = translations[locale].hero;
  const t = profileHero ? { ...base, ...profileHero } : base;
  const [shuffled, setShuffled] = useState(heroImages);
  const [activeIndex, setActiveIndex] = useState(0);
  const [progressKey, setProgressKey] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const zoomRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const arr = [...heroImages];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setShuffled(arr);
    setActiveIndex(0);
    setProgressKey(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    zoomRefs.current.forEach((el, i) => {
      if (!el) return;
      if (i === activeIndex) {
        el.style.animation = "none";
        void el.offsetHeight;
        el.style.animation = `hero-zoom ${SLIDE_DURATION}ms linear forwards`;
        el.style.transform = "";
      } else {
        el.style.animation = "none";
        el.style.transform = "scale(1.08)";
      }
    });
  }, [activeIndex]);

  // Window-level scroll (sticky section doesn't work with target-based progress)
  const { scrollY } = useScroll();
  const imageY    = useTransform(scrollY, [0, 900], ["0%", "30%"]);
  const contentY  = useTransform(scrollY, [0, 450], ["0%", "80px"]);
  const contentOpacity = useTransform(scrollY, [0, 360], [1, 0]);

  useEffect(() => {
    if (shuffled.length === 0) return;
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % shuffled.length);
      setProgressKey((k) => k + 1);
    }, SLIDE_DURATION);
    return () => clearInterval(id);
  }, [shuffled.length]);

  const headlineLines = t.headline.split("\n");
  const currentItem = shuffled[activeIndex];

  return (
    <section className="h-screen relative overflow-hidden sticky top-0 z-0">
      {/* Background carousel */}
      <motion.div className="absolute inset-0 overflow-hidden bg-muted" style={{ y: isMobile ? 0 : imageY }}>
        {shuffled.map((item, i) => {
          const isVideo = /\.(mp4|webm|mov)$/i.test(item.src);
          return (
            <div
              key={i}
              className="absolute inset-0 transition-opacity duration-1000"
              style={{
                zIndex: i === activeIndex ? 1 : 0,
                opacity: i === activeIndex ? 1 : 0,
              }}
            >
              <div
                ref={(el) => { zoomRefs.current[i] = el; }}
                className="absolute inset-0"
                style={{ willChange: 'transform' }}
              >
                {isVideo ? (
                  <video
                    src={item.src}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <Image
                    src={item.src}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="100vw"
                    unoptimized
                    priority={i === 0}
                  />
                )}
              </div>
            </div>
          );
        })}
        <div className="absolute inset-0 bg-black/60 z-10" />
      </motion.div>

      {/* Headline text */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 pb-20 pl-6 pr-6 md:pl-12 md:pr-12 z-10"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <p className="text-white/70 mb-4 text-sm tracking-widest uppercase">
          {t.eyebrow}
        </p>
        <div className="flex flex-col font-display font-extrabold tracking-tight leading-[0.9] mb-6 text-white">
          {headlineLines.map((line, i) => (
            <span key={i} className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl">
              {line}
            </span>
          ))}
        </div>
        <p className="text-white/70 text-lg md:text-xl max-w-2xl">{t.desc}</p>
      </motion.div>

      {/* Bottom right: project label + progress bars */}
      <div className="absolute bottom-14 md:bottom-6 right-6 md:right-12 z-20 hidden md:flex items-center gap-4">
        <AnimatePresence mode="wait">
          {currentItem?.projectName && currentItem?.projectSlug && (
            <motion.div
              key={currentItem.projectSlug}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35 }}
            >
              <Link
                href={`/proyecto/${currentItem.projectSlug}`}
                className="flex items-center gap-1 text-white/70 hover:text-white transition-colors text-xs tracking-widest uppercase"
              >
                <span>{currentItem.projectName}</span>
                <ArrowUpRight className="w-3 h-3 shrink-0" />
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-1.5">
          {shuffled.map((_, i) => (
            <div key={i} className="w-5 md:w-8 h-[2px] bg-white/25 overflow-hidden rounded-full">
              {i === activeIndex ? (
                <div key={progressKey} className="h-full bg-white animate-hero-progress" />
              ) : i < activeIndex ? (
                <div className="h-full w-full bg-white/60" />
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
        <ArrowDown className="w-6 h-6 text-white animate-bounce-down" />
      </div>
    </section>
  );
}
