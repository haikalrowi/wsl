import { createI18nServer } from "next-international/server";

export const {
  //
  getStaticParams,
  getCurrentLocale,
  getI18n,
  getScopedI18n,
} = createI18nServer({
  en: () => import("./en"),
  ja: () => import("./ja"),
});
