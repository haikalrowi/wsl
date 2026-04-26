"use client";

import { LazyMotion as LazyMotion_ } from "motion/react";

async function features() {
  const { domAnimation } = await import("@/lib/motion");

  return domAnimation;
}

export function LazyMotion(props: React.PropsWithChildren) {
  return (
    <LazyMotion_ features={features} strict>
      {props.children}
    </LazyMotion_>
  );
}
