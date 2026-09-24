import ca from "../content/site-copy/ca.json";
import es from "../content/site-copy/es.json";
import en from "../content/site-copy/en.json";

export const homeContent = { ca: ca.home, es: es.home, en: en.home };

export type HomeLocale = keyof typeof homeContent;
