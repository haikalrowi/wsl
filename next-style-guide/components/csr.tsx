"use client";

import { useSyncExternalStore } from "react";

export function Csr(props: React.PropsWithChildren) {
  const isCsr = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  return isCsr && props.children;
}
