"use client";

import dynamic from "next/dynamic";

const Csr_ = ({ children }: React.PropsWithChildren) => {
  return children;
};

export const Csr = dynamic(async () => Csr_, { ssr: false });
