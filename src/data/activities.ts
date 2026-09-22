import type { HomeLocale } from "./home";

// Synthetic shares from the approved design prototype. These are not H-MIP findings.
export const demoActivityShares = [23, 18, 15, 13, 11, 9, 7, 4] as const;
export const demoPlaceShares = [24, 18, 16, 14, 10, 8, 6, 4] as const;

export const categoryLabels = {
  en: {
    activities: ["Eating or drinking outdoors", "Walking", "Gardening", "Sport or exercise", "At work", "Socialising outdoors", "Commuting", "Other"],
    places: ["Home garden or balcony", "Street or square", "Park or green space", "Outdoor café or terrace", "Workplace", "Home indoors", "Public transport", "Other"],
  },
  es: {
    activities: ["Comer o beber al aire libre", "Pasear", "Jardinería", "Deporte o ejercicio", "En el trabajo", "Reunirse al aire libre", "Desplazarse", "Otras"],
    places: ["Jardín o balcón de casa", "Calle o plaza", "Parque o zona verde", "Cafetería o terraza", "Lugar de trabajo", "Dentro de casa", "Transporte público", "Otros"],
  },
  ca: {
    activities: ["Menjar o beure a l'aire lliure", "Passejar", "Jardineria", "Esport o exercici", "A la feina", "Trobar-se a l'aire lliure", "Desplaçar-se", "Altres"],
    places: ["Jardí o balcó de casa", "Carrer o plaça", "Parc o zona verda", "Cafeteria o terrassa", "Lloc de treball", "Dins de casa", "Transport públic", "Altres"],
  },
} satisfies Record<HomeLocale, { activities: string[]; places: string[] }>;

export const activitiesContent = {
  en: {
    metaTitle: "Activities & places — H-MIP Explora",
    metaDescription: "Explore illustrative shares of mosquito bite reports by activity and place in Catalonia.",
    eyebrow: "Exposure in everyday life",
    title: "What are people doing when they get bitten?",
    lead: "Compare where people are and what they are doing when bites are reported. These distributions are examples until H-MIP data is ready.",
    badge: "Synthetic activity data",
    sourceNote: "Illustrative values only; these are not H-MIP findings.",
    measure: "Share of demo reports",
    methodSummary: "Data & method",
    tableValue: "Share of reports",
    activity: {
      eyebrow: "By activity",
      heading: "Everyday routines shape exposure",
      takeaway: "In this demo, eating or drinking outdoors accounts for 23% of reported bites.",
      text: "A large share of reports can reflect how much time people spend in an activity. It does not, by itself, show the bite risk per hour.",
      tableLabel: "Activity",
      method: "Shares are synthetic and sum to 100% across the listed categories. A relative bite rate requires time-spent data and an approved H-MIP method; neither is inferred from these shares.",
    },
    place: {
      eyebrow: "By place",
      heading: "Bites happen in familiar places",
      takeaway: "In this demo, home gardens and balconies account for 24% of reported bites.",
      text: "The place categories describe where a bite was reported. They are not a map of mosquito abundance or a measure of risk for a location.",
      tableLabel: "Place",
      method: "Shares are synthetic and sum to 100% across the listed categories. Production categories and definitions will come from approved H-MIP data and documentation.",
    },
  },
  es: {
    metaTitle: "Actividades y lugares — H-MIP Explora",
    metaDescription: "Explora proporciones ilustrativas de picaduras registradas por actividad y lugar en Cataluña.",
    eyebrow: "Exposición en la vida cotidiana",
    title: "¿Qué hace la gente cuando recibe picaduras?",
    lead: "Compara dónde están las personas y qué hacen cuando registran picaduras. Estas distribuciones son ejemplos hasta disponer de los datos de H-MIP.",
    badge: "Datos sintéticos de actividades",
    sourceNote: "Valores ilustrativos; no son resultados de H-MIP.",
    measure: "Proporción de registros de ejemplo",
    methodSummary: "Datos y método",
    tableValue: "Proporción de registros",
    activity: {
      eyebrow: "Por actividad",
      heading: "Las rutinas cotidianas influyen en la exposición",
      takeaway: "En este ejemplo, comer o beber al aire libre representa el 23 % de las picaduras registradas.",
      text: "Una proporción alta puede reflejar cuánto tiempo se dedica a una actividad. Por sí sola, no indica el riesgo de picadura por hora.",
      tableLabel: "Actividad",
      method: "Las proporciones son sintéticas y suman el 100 % entre las categorías indicadas. Una tasa relativa de picaduras requiere datos de tiempo dedicado y un método aprobado por H-MIP; no se deduce de estas proporciones.",
    },
    place: {
      eyebrow: "Por lugar",
      heading: "Las picaduras ocurren en lugares conocidos",
      takeaway: "En este ejemplo, jardines y balcones de casa representan el 24 % de las picaduras registradas.",
      text: "Las categorías indican dónde se registró una picadura. No son un mapa de abundancia de mosquitos ni una medida de riesgo de cada lugar.",
      tableLabel: "Lugar",
      method: "Las proporciones son sintéticas y suman el 100 % entre las categorías indicadas. Las categorías y definiciones definitivas procederán de datos y documentación aprobados por H-MIP.",
    },
  },
  ca: {
    metaTitle: "Activitats i llocs — H-MIP Explora",
    metaDescription: "Explora proporcions il·lustratives de picades registrades per activitat i lloc a Catalunya.",
    eyebrow: "Exposició en la vida quotidiana",
    title: "Què fa la gent quan rep picades?",
    lead: "Compara on són les persones i què fan quan registren picades. Aquestes distribucions són exemples fins que es disposi de les dades d'H-MIP.",
    badge: "Dades sintètiques d'activitats",
    sourceNote: "Valors il·lustratius; no són resultats d'H-MIP.",
    measure: "Proporció de registres d'exemple",
    methodSummary: "Dades i mètode",
    tableValue: "Proporció de registres",
    activity: {
      eyebrow: "Per activitat",
      heading: "Les rutines quotidianes influeixen en l'exposició",
      takeaway: "En aquest exemple, menjar o beure a l'aire lliure representa el 23 % de les picades registrades.",
      text: "Una proporció alta pot reflectir quant de temps es dedica a una activitat. Per si sola, no indica el risc de picada per hora.",
      tableLabel: "Activitat",
      method: "Les proporcions són sintètiques i sumen el 100 % entre les categories indicades. Una taxa relativa de picades requereix dades del temps dedicat i un mètode aprovat per H-MIP; no es dedueix d'aquestes proporcions.",
    },
    place: {
      eyebrow: "Per lloc",
      heading: "Les picades passen en llocs coneguts",
      takeaway: "En aquest exemple, jardins i balcons de casa representen el 24 % de les picades registrades.",
      text: "Les categories indiquen on es va registrar una picada. No són un mapa d'abundància de mosquits ni una mesura de risc de cada lloc.",
      tableLabel: "Lloc",
      method: "Les proporcions són sintètiques i sumen el 100 % entre les categories indicades. Les categories i definicions definitives vindran de dades i documentació aprovades per H-MIP.",
    },
  },
} as const;
