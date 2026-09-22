import type { HomeLocale } from "./home";

export const activitiesContent = {
  en: {
    metaTitle: "Activities & places — H-MIP Explore", metaDescription: "Explore supplied draft bite-report shares by activity, place and season in Catalonia.",
    eyebrow: "Exposure in everyday life", title: "What are people doing when bites are reported?",
    lead: "Compare the activity and place recorded with a bite report. These draft shares describe reports, not an individual's risk in each situation.",
    badge: "Supplied draft data", sourceNote: "Source: H-MIP activities_places.csv and taxonomy.csv (draft/reference data; interpretation pending review).",
    measure: "Share of reports", methodSummary: "Data & method", tableValue: "Share of reports", lower: "Lower bound", upper: "Upper bound",
    rate: "Source rate*", rateNote: "*The supplied file includes a rate for all-year activities, but its definition and unit are not documented. It is shown as a source value, not interpreted as a relative bite risk.",
    seasonLabel: "Season", seasons: { all: "All year", summer: "June–September", rest: "Rest of the year" },
    activity: {
      eyebrow: "By activity", heading: "Activities recorded with bites", takeaway: "The leading activity in the selected season accounts for {value}% of reports.",
      text: "A high share may also reflect how long people spend in an activity. It does not establish risk per hour.",
      tableLabel: "Activity", method: "Shares and supplied lower/upper bounds come directly from activities_places.csv. The interval method is not documented. Activity labels come from taxonomy.csv.",
    },
    place: {
      eyebrow: "By place", heading: "Places recorded with bites", takeaway: "The leading place in the selected season accounts for {value}% of reports.",
      text: "Place shares describe reported locations, not mosquito abundance or the risk associated with being in a location.",
      tableLabel: "Place", method: "Shares and supplied lower/upper bounds come directly from activities_places.csv. The interval method is not documented. Place labels come from taxonomy.csv.",
    },
  },
  es: {
    metaTitle: "Actividades y lugares — H-MIP Explora", metaDescription: "Explora las proporciones provisionales de registros por actividad, lugar y temporada en Cataluña.",
    eyebrow: "Exposición en la vida cotidiana", title: "¿Qué hace la gente cuando se registran picaduras?",
    lead: "Compara la actividad y el lugar asociados a un registro de picadura. Estas proporciones provisionales describen registros, no el riesgo individual en cada situación.",
    badge: "Datos provisionales facilitados", sourceNote: "Fuente: H-MIP activities_places.csv y taxonomy.csv (datos provisionales/de referencia; interpretación pendiente de revisión).",
    measure: "Proporción de registros", methodSummary: "Datos y método", tableValue: "Proporción de registros", lower: "Límite inferior", upper: "Límite superior",
    rate: "Tasa de origen*", rateNote: "*El archivo facilitado incluye una tasa para las actividades del año completo, pero no documenta su definición ni su unidad. Se muestra como valor de origen, sin interpretarla como riesgo relativo de picadura.",
    seasonLabel: "Temporada", seasons: { all: "Todo el año", summer: "Junio–septiembre", rest: "Resto del año" },
    activity: {
      eyebrow: "Por actividad", heading: "Actividades registradas con picaduras", takeaway: "La actividad principal de la temporada seleccionada representa el {value} % de los registros.",
      text: "Una proporción alta puede reflejar también cuánto tiempo se dedica a una actividad. No demuestra el riesgo por hora.",
      tableLabel: "Actividad", method: "Las proporciones y los límites facilitados proceden de activities_places.csv. El método del intervalo no está documentado. Las etiquetas proceden de taxonomy.csv.",
    },
    place: {
      eyebrow: "Por lugar", heading: "Lugares registrados con picaduras", takeaway: "El lugar principal de la temporada seleccionada representa el {value} % de los registros.",
      text: "Las proporciones describen lugares registrados, no la abundancia de mosquitos ni el riesgo de estar en cada lugar.",
      tableLabel: "Lugar", method: "Las proporciones y los límites facilitados proceden de activities_places.csv. El método del intervalo no está documentado. Las etiquetas proceden de taxonomy.csv.",
    },
  },
  ca: {
    metaTitle: "Activitats i llocs — H-MIP Explora", metaDescription: "Explora les proporcions provisionals de registres per activitat, lloc i temporada a Catalunya.",
    eyebrow: "Exposició en la vida quotidiana", title: "Què fa la gent quan es registren picades?",
    lead: "Compara l'activitat i el lloc associats a un registre de picada. Aquestes proporcions provisionals descriuen registres, no el risc individual en cada situació.",
    badge: "Dades provisionals facilitades", sourceNote: "Font: H-MIP activities_places.csv i taxonomy.csv (dades provisionals/de referència; interpretació pendent de revisió).",
    measure: "Proporció de registres", methodSummary: "Dades i mètode", tableValue: "Proporció de registres", lower: "Límit inferior", upper: "Límit superior",
    rate: "Taxa d'origen*", rateNote: "*El fitxer facilitat inclou una taxa per a les activitats de tot l'any, però no en documenta la definició ni la unitat. Es mostra com a valor d'origen, sense interpretar-la com a risc relatiu de picada.",
    seasonLabel: "Temporada", seasons: { all: "Tot l'any", summer: "Juny–setembre", rest: "Resta de l'any" },
    activity: {
      eyebrow: "Per activitat", heading: "Activitats registrades amb picades", takeaway: "L'activitat principal de la temporada seleccionada representa el {value} % dels registres.",
      text: "Una proporció alta també pot reflectir quant de temps es dedica a una activitat. No demostra el risc per hora.",
      tableLabel: "Activitat", method: "Les proporcions i els límits facilitats provenen d'activities_places.csv. El mètode de l'interval no està documentat. Les etiquetes provenen de taxonomy.csv.",
    },
    place: {
      eyebrow: "Per lloc", heading: "Llocs registrats amb picades", takeaway: "El lloc principal de la temporada seleccionada representa el {value} % dels registres.",
      text: "Les proporcions descriuen llocs registrats, no l'abundància de mosquits ni el risc de ser-hi.",
      tableLabel: "Lloc", method: "Les proporcions i els límits facilitats provenen d'activities_places.csv. El mètode de l'interval no està documentat. Les etiquetes provenen de taxonomy.csv.",
    },
  },
} satisfies Record<HomeLocale, unknown>;
