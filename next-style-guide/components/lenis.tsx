"use client";

import { Lenis as Lenis_ } from "lenis/react";

export function Lenis(props: React.PropsWithChildren) {
  return (
    <Lenis_ root options={{}}>
      {props.children}
    </Lenis_>
  );
}
