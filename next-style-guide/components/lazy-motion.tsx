"use client";

import { LazyMotion as LazyMotion_ } from "motion/react";

async function features() {
  const { domAnimation } = await import("@/lib/motion");

  return domAnimation;
}

export function LazyMotion({ children }: React.PropsWithChildren) {
  return (
    <LazyMotion_ features={features} strict>
      {children}
    </LazyMotion_>
  );
}
