"use client";

import { use } from "react";
import { browser } from "react-dom";

export function Csr(props: React.PropsWithChildren) {
  use(browser());

  return props.children;
}
