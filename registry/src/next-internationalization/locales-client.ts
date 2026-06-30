"use client";

import { createI18nClient } from "next-international/client";

export const {
  //
  I18nProviderClient,
  useCurrentLocale,
  useI18n,
  useScopedI18n,
  useChangeLocale,
} = createI18nClient({
  en: () => import("./en"),
  ja: () => import("./ja"),
});
