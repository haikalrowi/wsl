"use client";

import { useSyncExternalStore } from "react";

export function UseClient(props: React.PropsWithChildren) {
  return (
    useSyncExternalStore(
      () => () => {},
      () => true,
      () => false,
    ) && props.children
  );
}
