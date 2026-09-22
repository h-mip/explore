import { demoCharts, type HomeLocale } from "./home";

// These weights are the Home page's synthetic preview series, normalized to a share.
// Keep production CSV loading separate from page copy when approved H-MIP data arrives.
function toShares(weights: readonly number[]) {
  const total = weights.reduce((sum, value) => sum + value, 0);
  return weights.map((value) => (value / total) * 100);
}

export const hourlyShares = toShares(demoCharts.hour);
export const monthlyShares = toShares(demoCharts.month);

export const monthLabels = {
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  es: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"],
  ca: ["gen", "feb", "març", "abr", "maig", "juny", "jul", "ag", "set", "oct", "nov", "des"],
} satisfies Record<HomeLocale, string[]>;

export const whenContent = {
  en: {
    metaTitle: "When bites happen — H-MIP Explore",
    metaDescription: "Explore illustrative hourly and seasonal patterns of mosquito bite reports in Catalonia.",
    eyebrow: "Time patterns",
    title: "When are people most likely to be bitten?",
    lead: "These charts describe when people report bites — a pattern shaped by mosquito activity and by people's daily routines.",
    badge: "Synthetic chart data",
    dataLabel: "Share of demo reports",
    tableSummary: "Data & method",
    tableCaption: "Underlying synthetic distribution",
    tableValue: "Share of reports",
    sourceNote: "Illustrative values only; these are not H-MIP findings.",
    scrollHint: "Scroll the chart horizontally on small screens.",
    hour: {
      eyebrow: "By hour of day",
      title: "Bites build toward the evening",
      takeaway: "In this synthetic example, 34% of reports fall between 18:00 and 21:00.",
      text: "Reported bites reflect exposure: the overlap between mosquito activity and people's routines.",
      chartTitle: "Share of demo bite reports by hour",
      chartNote: "The tallest demo bars fall around dusk. Exact values are available in the table below.",
      tableLabel: "Hour",
      method: "Illustrative hourly weights normalized to 100%. No sampling uncertainty is estimated for this demo. Production text and values will come from approved H-MIP files.",
    },
    month: {
      eyebrow: "By month",
      title: "The pattern is strongly seasonal",
      takeaway: "In this synthetic example, 61% of reports fall in July–September.",
      text: "The demo distribution rises in late spring and is highest in midsummer. The actual seasonal pattern awaits reviewed project data.",
      chartTitle: "Share of demo bite reports by month",
      chartNote: "Month names and exact values are available in the table below.",
      tableLabel: "Month",
      method: "Illustrative monthly weights normalized to 100%. No sampling uncertainty is estimated for this demo. Production text and values will come from approved H-MIP files.",
    },
  },
  es: {
    metaTitle: "Cuándo ocurren las picaduras — H-MIP Explora",
    metaDescription: "Explora patrones ilustrativos por hora y estación de las picaduras de mosquito registradas en Cataluña.",
    eyebrow: "Patrones temporales",
    title: "¿Cuándo es más probable recibir picaduras?",
    lead: "Estos gráficos muestran cuándo se registran picaduras, un patrón influido por la actividad de los mosquitos y las rutinas de las personas.",
    badge: "Datos gráficos sintéticos",
    dataLabel: "Proporción de registros de ejemplo",
    tableSummary: "Datos y método",
    tableCaption: "Distribución sintética subyacente",
    tableValue: "Proporción de registros",
    sourceNote: "Valores ilustrativos; no son resultados de H-MIP.",
    scrollHint: "Desplaza el gráfico horizontalmente en pantallas pequeñas.",
    hour: {
      eyebrow: "Por hora del día",
      title: "Las picaduras aumentan hacia la tarde",
      takeaway: "En este ejemplo sintético, el 34 % de los registros se sitúa entre las 18:00 y las 21:00.",
      text: "Las picaduras registradas reflejan la exposición: el encuentro entre la actividad de los mosquitos y las rutinas de las personas.",
      chartTitle: "Proporción de registros de ejemplo por hora",
      chartNote: "Las barras de ejemplo más altas se sitúan cerca del atardecer. Los valores exactos están en la tabla.",
      tableLabel: "Hora",
      method: "Pesos horarios ilustrativos normalizados al 100 %. No se estima la incertidumbre muestral en esta demostración. Los textos y valores definitivos procederán de archivos aprobados por H-MIP.",
    },
    month: {
      eyebrow: "Por mes",
      title: "El patrón es marcadamente estacional",
      takeaway: "En este ejemplo sintético, el 61 % de los registros se concentra entre julio y septiembre.",
      text: "La distribución de ejemplo aumenta a finales de primavera y alcanza su máximo en pleno verano. El patrón real espera los datos revisados del proyecto.",
      chartTitle: "Proporción de registros de ejemplo por mes",
      chartNote: "Los nombres de los meses y los valores exactos están en la tabla.",
      tableLabel: "Mes",
      method: "Pesos mensuales ilustrativos normalizados al 100 %. No se estima la incertidumbre muestral en esta demostración. Los textos y valores definitivos procederán de archivos aprobados por H-MIP.",
    },
  },
  ca: {
    metaTitle: "Quan es produeixen les picades — H-MIP Explora",
    metaDescription: "Explora patrons il·lustratius per hora i estació de les picades de mosquit registrades a Catalunya.",
    eyebrow: "Patrons temporals",
    title: "Quan és més probable rebre picades?",
    lead: "Aquests gràfics mostren quan es registren picades, un patró influït per l'activitat dels mosquits i les rutines de les persones.",
    badge: "Dades gràfiques sintètiques",
    dataLabel: "Proporció de registres d'exemple",
    tableSummary: "Dades i mètode",
    tableCaption: "Distribució sintètica subjacent",
    tableValue: "Proporció de registres",
    sourceNote: "Valors il·lustratius; no són resultats d'H-MIP.",
    scrollHint: "Desplaça el gràfic horitzontalment en pantalles petites.",
    hour: {
      eyebrow: "Per hora del dia",
      title: "Les picades augmenten cap al vespre",
      takeaway: "En aquest exemple sintètic, el 34 % dels registres se situa entre les 18.00 i les 21.00 h.",
      text: "Les picades registrades reflecteixen l'exposició: la coincidència entre l'activitat dels mosquits i les rutines de les persones.",
      chartTitle: "Proporció de registres d'exemple per hora",
      chartNote: "Les barres d'exemple més altes se situen prop del capvespre. Els valors exactes són a la taula.",
      tableLabel: "Hora",
      method: "Pesos horaris il·lustratius normalitzats al 100 %. No s'estima la incertesa mostral en aquesta demostració. Els textos i valors definitius vindran dels fitxers aprovats per H-MIP.",
    },
    month: {
      eyebrow: "Per mes",
      title: "El patró és marcadament estacional",
      takeaway: "En aquest exemple sintètic, el 61 % dels registres es concentra entre juliol i setembre.",
      text: "La distribució d'exemple augmenta a finals de primavera i assoleix el màxim en ple estiu. El patró real espera les dades revisades del projecte.",
      chartTitle: "Proporció de registres d'exemple per mes",
      chartNote: "Els noms dels mesos i els valors exactes són a la taula.",
      tableLabel: "Mes",
      method: "Pesos mensuals il·lustratius normalitzats al 100 %. No s'estima la incertesa mostral en aquesta demostració. Els textos i valors definitius vindran dels fitxers aprovats per H-MIP.",
    },
  },
} as const;
