"use client";

import { LazyMotion as LazyMotion_ } from "motion/react";

async function features() {
  const { domAnimation } = await import("motion/react");
  return domAnimation;
}

export function LazyMotion(props: React.PropsWithChildren) {
  return (
    <LazyMotion_ features={features} strict>
      {props.children}
    </LazyMotion_>
  );
}
