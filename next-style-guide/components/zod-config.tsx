"use client";

import { useCurrentLocale } from "@/locales/client";
import z from "zod";
import { en, ja } from "zod/locales";

export function ZodConfig() {
  const currentLocale = useCurrentLocale();

  z.config({ en, ja }[currentLocale]());

  return <></>;
}
