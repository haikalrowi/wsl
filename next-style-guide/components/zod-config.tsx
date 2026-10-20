"use client";

import { z } from "@/lib/zod";
import { useCurrentLocale } from "@/locales/client";
import { en, ja } from "zod/locales";

export function ZodConfig() {
  const currentLocale = useCurrentLocale();

  z.config({ en, ja }[currentLocale]());

  return <></>;
}
