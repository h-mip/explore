export type Locale = "en" | "es" | "ca";

export function internalUrl(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/?$/, "/");
  return `${base}${path.replace(/^\/+/, "")}`;
}

export const routes = {
  en: {
    home: internalUrl("en/"),
    map: internalUrl("en/map/"),
    when: internalUrl("en/when/"),
    activities: internalUrl("en/activities/"),
    data: internalUrl("en/data/"),
    about: internalUrl("en/about/"),
  },
  es: {
    home: internalUrl("es/"),
    map: internalUrl("es/mapa/"),
    when: internalUrl("es/cuando/"),
    activities: internalUrl("es/actividades/"),
    data: internalUrl("es/datos/"),
    about: internalUrl("es/sobre/"),
  },
  ca: {
    home: internalUrl(""),
    map: internalUrl("mapa/"),
    when: internalUrl("quan/"),
    activities: internalUrl("activitats/"),
    data: internalUrl("dades/"),
    about: internalUrl("sobre/"),
  },
} as const;
