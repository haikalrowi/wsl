"use client";

import { useSyncExternalStore } from "react";

export function ClientOnly(props: React.PropsWithChildren) {
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  return isClient && props.children;
}
