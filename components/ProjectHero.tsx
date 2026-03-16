"use client";

import Image from "next/image";
import { useScroll, useTransform, motion } from "framer-motion";

interface ProjectHeroProps {
  src: string | null;
  alt: string;
  category: string;
  title: string;
  videoSrc?: string;
}

const isLocalPath = (s: string) => s.startsWith("/");

export default function ProjectHero({ src, alt, category, title, videoSrc }: ProjectHeroProps) {
  // Window-level scroll — needed because section is sticky
  const { scrollY } = useScroll();
  const imageY         = useTransform(scrollY, [0, 900], ["0%", "30%"]);
  const contentY       = useTransform(scrollY, [0, 450], ["0%", "80px"]);
  const contentOpacity = useTransform(scrollY, [0, 360], [1, 0]);

  return (
    <section className="relative h-screen overflow-hidden sticky top-0 z-0 bg-muted">
      {(videoSrc || src) && (
        <motion.div className="absolute inset-0" style={{ y: imageY }}>
          {videoSrc ? (
            <video
              src={videoSrc}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : isLocalPath(src!) ? (
            <img
              src={src!}
              alt={alt}
              className="absolute inset-0 w-full h-full object-cover"
              fetchPriority="high"
            />
          ) : (
            <Image
              src={src!}
              alt={alt}
              fill
              className="object-cover"
              priority
              unoptimized={src!.endsWith(".gif")}
              sizes="100vw"
            />
          )}
        </motion.div>
      )}
      <div className="absolute inset-0 bg-black/40" />
      <motion.div
        className="relative h-full flex flex-col justify-end px-6 md:px-12 lg:px-24 pb-16 md:pb-24"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <p className="text-white/70 text-sm tracking-widest uppercase mb-4">
          {category}
        </p>
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-white max-w-4xl">
          {title}
        </h1>
      </motion.div>
    </section>
  );
}
