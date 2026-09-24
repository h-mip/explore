import type { Locale } from "../utils/urls";
import { siteSettings } from "./siteSettings";

const demoBadge = {
  en: "Synthetic demo data",
  es: "Datos sintéticos de prueba",
  ca: "Dades sintètiques de prova",
};

export function surveyBadge(locale: Locale, publishedBadge: string) {
  return siteSettings.surveyDemo ? demoBadge[locale] : publishedBadge;
}
