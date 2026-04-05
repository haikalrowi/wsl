"use client";

import dynamic from "next/dynamic";

export const Csr = dynamic(
  async () => (props: React.PropsWithChildren) => props.children,
  { ssr: false },
);
