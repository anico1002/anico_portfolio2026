"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface ImageFadeSlideshowProps {
  urls: string[];
  alt: string;
  intervalMs?: number;
  className?: string;
}

/** Detecta la relación de aspecto de la primera imagen para que el contenedor no muestre fondo gris. */
function useAspectRatio(firstUrl: string | null) {
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);
  const measured = useRef<string | null>(null);

  useEffect(() => {
    if (!firstUrl || measured.current === firstUrl) return;
    measured.current = firstUrl;
    setAspectRatio(null);
    const img = new window.Image();
    img.onload = () => {
      if (img.naturalWidth && img.naturalHeight) {
        setAspectRatio(img.naturalWidth / img.naturalHeight);
      }
    };
    img.src = firstUrl;
  }, [firstUrl]);

  return aspectRatio;
}

export default function ImageFadeSlideshow({
  urls,
  alt,
  intervalMs = 4000,
  className = "",
}: ImageFadeSlideshowProps) {
  const [index, setIndex] = useState(0);
  const aspectRatio = useAspectRatio(urls[0] ?? null);

  useEffect(() => {
    if (urls.length < 2) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % urls.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [urls.length, intervalMs]);

  const unopt = (src: string) => src.endsWith(".gif") || src.startsWith("/projects/");

  const containerStyle = aspectRatio != null
    ? { aspectRatio: `${aspectRatio}` }
    : { aspectRatio: "16/9" as const };

  if (urls.length === 0) return null;
  if (urls.length === 1) {
    return (
      <div
        className={`relative w-full overflow-hidden ${className}`}
        style={containerStyle}
      >
        <Image
          src={urls[0]}
          alt={alt}
          fill
          className="object-cover"
          unoptimized={unopt(urls[0])}
          sizes="(max-width: 1152px) 100vw, 1152px"
        />
      </div>
    );
  }

  return (
    <div
      className={`relative w-full overflow-hidden ${className}`}
      style={containerStyle}
    >
      {urls.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === index ? 1 : 0 }}
        >
          <Image
            src={src}
            alt={`${alt} ${i + 1}`}
            fill
            className="object-cover"
            unoptimized={unopt(src)}
            sizes="(max-width: 1152px) 100vw, 1152px"
          />
        </div>
      ))}
    </div>
  );
}
