"use client";

import { type ReactNode } from "react";
import ScrollProgress from "./ScrollProgress";

export default function ViewportEffects({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <ScrollProgress />
    </>
  );
}
