import type { HomeLocale } from "./home";

export const monthLabels = {
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  es: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"],
  ca: ["gen", "feb", "març", "abr", "maig", "juny", "jul", "ag", "set", "oct", "nov", "des"],
} satisfies Record<HomeLocale, string[]>;

const shared = {
  en: {
    metaTitle: "When bites are reported — H-MIP Explore",
    metaDescription: "Explore supplied draft hourly and monthly distributions of mosquito bite reports in Catalonia.",
    eyebrow: "Time patterns", title: "When are bites reported?",
    lead: "The supplied draft data show when bites were reported. These shares describe reports, not a person's chance of being bitten at a given hour or month.",
    badge: "Supplied draft data", dataLabel: "Share of reports", tableSummary: "Data & method",
    tableCaption: "Values from temporal.csv", tableValue: "Share of reports", lower: "Lower bound", upper: "Upper bound",
    sourceNote: "Source: H-MIP temporal.csv (supplied draft/reference values; scientific interpretation awaits review).",
    scrollHint: "Scroll the chart horizontally on small screens.",
    settingTitle: "Indoors and outdoors", settingIntro: "The same draft file groups reports by setting; no interval bounds are supplied for these two values.",
    settingLabels: { outdoor: "Outdoor", indoor: "Indoor" }, sample: "Reported sample size",
    hour: {
      eyebrow: "By hour of day", title: "Reports concentrate in the evening",
      takeaway: "{value}% of the supplied hourly shares fall from 18:00 to before 21:00.",
      text: "This distribution describes the time of reports. It does not isolate mosquito activity from people's exposure or reporting patterns.",
      chartTitle: "Share of reports by hour", chartNote: "Bars show the supplied share; lower and upper bounds are listed in the data table.",
      tableLabel: "Hour", method: "Shares and lower/upper bounds come directly from temporal.csv. The source does not define the interval method, so these bounds are not labeled as confidence intervals.",
    },
    month: {
      eyebrow: "By month", title: "Reports peak in summer",
      takeaway: "{value}% of the supplied monthly shares fall in July–September.",
      text: "The monthly distribution describes reports in the supplied draft dataset, not a population-wide risk estimate.",
      chartTitle: "Share of reports by month", chartNote: "Bars show the supplied share; lower and upper bounds are listed in the data table.",
      tableLabel: "Month", method: "Shares and lower/upper bounds come directly from temporal.csv. The source does not define the interval method, so these bounds are not labeled as confidence intervals.",
    },
  },
  es: {
    metaTitle: "Cuándo se registran picaduras — H-MIP Explora",
    metaDescription: "Explora las distribuciones horarias y mensuales provisionales de picaduras registradas en Cataluña.",
    eyebrow: "Patrones temporales", title: "¿Cuándo se registran picaduras?",
    lead: "Los datos provisionales facilitados muestran cuándo se registraron picaduras. Estas proporciones describen registros, no la probabilidad individual de recibir una picadura en una hora o mes concretos.",
    badge: "Datos provisionales facilitados", dataLabel: "Proporción de registros", tableSummary: "Datos y método",
    tableCaption: "Valores de temporal.csv", tableValue: "Proporción de registros", lower: "Límite inferior", upper: "Límite superior",
    sourceNote: "Fuente: H-MIP temporal.csv (valores provisionales/de referencia; interpretación científica pendiente de revisión).",
    scrollHint: "Desplaza el gráfico horizontalmente en pantallas pequeñas.",
    settingTitle: "Interior y exterior", settingIntro: "El mismo archivo provisional agrupa los registros por entorno; no se proporcionan límites de intervalo para estos dos valores.",
    settingLabels: { outdoor: "Exterior", indoor: "Interior" }, sample: "Tamaño de muestra indicado",
    hour: {
      eyebrow: "Por hora del día", title: "Los registros se concentran por la tarde",
      takeaway: "El {value} % de las proporciones horarias facilitadas corresponde al periodo de las 18:00 a antes de las 21:00.",
      text: "Esta distribución describe la hora de los registros. No separa la actividad de los mosquitos de la exposición o de los patrones de notificación de las personas.",
      chartTitle: "Proporción de registros por hora", chartNote: "Las barras muestran la proporción facilitada; los límites figuran en la tabla.",
      tableLabel: "Hora", method: "Las proporciones y los límites proceden directamente de temporal.csv. El archivo no define el método del intervalo, por lo que no se presentan como intervalos de confianza.",
    },
    month: {
      eyebrow: "Por mes", title: "Los registros alcanzan su máximo en verano",
      takeaway: "El {value} % de las proporciones mensuales facilitadas corresponde a julio–septiembre.",
      text: "La distribución mensual describe los registros del conjunto provisional facilitado, no una estimación del riesgo poblacional.",
      chartTitle: "Proporción de registros por mes", chartNote: "Las barras muestran la proporción facilitada; los límites figuran en la tabla.",
      tableLabel: "Mes", method: "Las proporciones y los límites proceden directamente de temporal.csv. El archivo no define el método del intervalo, por lo que no se presentan como intervalos de confianza.",
    },
  },
  ca: {
    metaTitle: "Quan es registren picades — H-MIP Explora",
    metaDescription: "Explora les distribucions horàries i mensuals provisionals de picades registrades a Catalunya.",
    eyebrow: "Patrons temporals", title: "Quan es registren picades?",
    lead: "Les dades provisionals facilitades mostren quan es van registrar picades. Aquestes proporcions descriuen registres, no la probabilitat individual de rebre una picada en una hora o un mes concrets.",
    badge: "Dades provisionals facilitades", dataLabel: "Proporció de registres", tableSummary: "Dades i mètode",
    tableCaption: "Valors de temporal.csv", tableValue: "Proporció de registres", lower: "Límit inferior", upper: "Límit superior",
    sourceNote: "Font: H-MIP temporal.csv (valors provisionals/de referència; interpretació científica pendent de revisió).",
    scrollHint: "Desplaça el gràfic horitzontalment en pantalles petites.",
    settingTitle: "Interior i exterior", settingIntro: "El mateix fitxer provisional agrupa els registres per entorn; no s'han facilitat límits d'interval per a aquests dos valors.",
    settingLabels: { outdoor: "Exterior", indoor: "Interior" }, sample: "Mida de mostra indicada",
    hour: {
      eyebrow: "Per hora del dia", title: "Els registres es concentren al vespre",
      takeaway: "El {value} % de les proporcions horàries facilitades correspon al període de les 18.00 a abans de les 21.00 h.",
      text: "Aquesta distribució descriu l'hora dels registres. No separa l'activitat dels mosquits de l'exposició o dels patrons de notificació de les persones.",
      chartTitle: "Proporció de registres per hora", chartNote: "Les barres mostren la proporció facilitada; els límits figuren a la taula.",
      tableLabel: "Hora", method: "Les proporcions i els límits provenen directament de temporal.csv. El fitxer no defineix el mètode de l'interval, de manera que no es presenten com a intervals de confiança.",
    },
    month: {
      eyebrow: "Per mes", title: "Els registres arriben al màxim a l'estiu",
      takeaway: "El {value} % de les proporcions mensuals facilitades correspon a juliol–setembre.",
      text: "La distribució mensual descriu els registres del conjunt provisional facilitat, no una estimació del risc poblacional.",
      chartTitle: "Proporció de registres per mes", chartNote: "Les barres mostren la proporció facilitada; els límits figuren a la taula.",
      tableLabel: "Mes", method: "Les proporcions i els límits provenen directament de temporal.csv. El fitxer no defineix el mètode de l'interval, de manera que no es presenten com a intervals de confiança.",
    },
  },
};

export const whenContent = shared satisfies Record<HomeLocale, typeof shared.en>;
