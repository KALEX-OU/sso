import { createI18nServer } from "next-international/server";

export const {
  getI18n,
  getScopedI18n,
  getCurrentLocale
} = createI18nServer({
  it: () => import("./it"),
  en: () => import("./en"),
  es: () => import("./es")
});
