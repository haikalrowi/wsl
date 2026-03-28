"use client";

import dynamic from "next/dynamic";

export const ClientOnly = dynamic(
  async () => (props: React.PropsWithChildren) => props.children,
  { ssr: false },
);
