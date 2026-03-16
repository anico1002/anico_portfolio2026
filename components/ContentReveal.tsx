"use client";

import { useScroll, useSpring, useTransform, motion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Wraps post-hero content with a spring-based translateY so it
 * rises faster ("magnet" effect) as the sticky hero comes into view.
 */
export default function ContentReveal({ children }: { children: ReactNode }) {
  const { scrollY } = useScroll();
  // Over the first 350px of scroll, content rushes up an extra 100px
  const rawY = useTransform(scrollY, [0, 350], [0, -100]);
  const y = useSpring(rawY, { stiffness: 380, damping: 38 });

  return (
    <motion.div style={{ y }} className="relative z-10 bg-white">
      {children}
    </motion.div>
  );
}
