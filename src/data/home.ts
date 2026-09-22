// The charts and headline findings below remain illustrative; the Home map image is generated separately from draft model data.
export const demoCharts = {
  hour: [2, 2, 2, 2, 3, 4, 5, 7, 9, 11, 13, 14, 16, 18, 20, 23, 24, 27, 38, 43, 37, 18, 9, 4],
  month: [2, 3, 4, 7, 12, 24, 45, 48, 36, 15, 9, 7],
  place: [42, 34, 24],
  activity: [68, 54, 41, 29],
} as const;

export const homeContent = {
  en: {
    hero: {
      eyebrow: "Human–mosquito interaction in Catalonia",
      title: "Where and when do mosquitoes bite people in Catalonia?",
      lead: "H-MIP studies how exposure to mosquito bites changes with place, time and everyday activity — combining field research, citizen science and spatial modelling.",
      primary: "Explore the evidence",
      secondary: "See headline patterns",
      context: [["Focus", "Tiger mosquito"], ["Area", "Catalonia"], ["Research", "Human–mosquito interaction"]],
      previewTitle: "Draft model map preview",
      previewLabel: "Draft 2025 model",
      previewCaption: "Original H3 resolution-7 cells · draft model estimates for August",
      low: "Low",
      mid: "Mid",
      high: "High",
    },
    findings: {
      eyebrow: "Headline findings",
      title: "A quick read of the patterns",
      badge: "Synthetic data",
      items: [
        { label: "Time of day", value: "34%", text: "of demo bites occur between 18:00–21:00.", chart: "hour" },
        { label: "Season", value: "61%", text: "of demo observations fall in July–September.", chart: "month" },
        { label: "Place", value: "42%", text: "of demo bites occur in or around the home.", chart: "place" },
        { label: "Activity", value: "1.7×", text: "demo relative bite rate while eating outdoors.", chart: "activity" },
      ],
      chartDescription: "Illustrative distribution; not an H-MIP result",
    },
    explore: {
      eyebrow: "Explore the evidence",
      title: "Three ways into the data",
      intro: "The map uses draft 2025 model estimates. Time and activity previews still use clearly labeled synthetic values.",
      items: [
        { label: "Where people get bitten", title: "Patterns across Catalonia", text: "Explore how place can shape human–mosquito interaction.", status: "Explore the map", chart: "spatial" },
        { label: "When bites happen", title: "Hour by hour", text: "See how reported interaction can vary across the day and through the year.", status: "Explore time patterns", chart: "hour" },
        { label: "What people are doing", title: "Activities & places", text: "Compare reported bite share across everyday activities and places.", status: "Explore activities", chart: "activity" },
      ],
    },
    action: {
      scienceEyebrow: "Help science",
      scienceTitle: "Contribute observations through Mosquito Alert",
      scienceText: "Citizen science helps researchers understand where mosquitoes are present and how people encounter them.",
      scienceList: ["Report mosquito sightings.", "Report breeding sites in public space.", "Support long-term surveillance."],
      scienceLink: "Visit Mosquito Alert",
    },
  },
  es: {
    hero: {
      eyebrow: "Interacción entre personas y mosquitos en Cataluña",
      title: "¿Dónde y cuándo pican los mosquitos a las personas en Cataluña?",
      lead: "H-MIP estudia cómo cambia la exposición a las picaduras según el lugar, el momento y las actividades cotidianas, combinando investigación de campo, ciencia ciudadana y modelización espacial.",
      primary: "Explorar los datos",
      secondary: "Ver los patrones destacados",
      context: [["Foco", "Mosquito tigre"], ["Ámbito", "Cataluña"], ["Investigación", "Interacción entre personas y mosquitos"]],
      previewTitle: "Vista previa del mapa del modelo",
      previewLabel: "Modelo provisional de 2025",
      previewCaption: "Celdas H3 originales de resolución 7 · estimaciones provisionales de agosto",
      low: "Bajo",
      mid: "Medio",
      high: "Alto",
    },
    findings: {
      eyebrow: "Datos destacados",
      title: "Una lectura rápida de los patrones",
      badge: "Datos sintéticos",
      items: [
        { label: "Hora del día", value: "34 %", text: "de las picaduras de ejemplo ocurren entre las 18:00 y las 21:00.", chart: "hour" },
        { label: "Estación", value: "61 %", text: "de las observaciones de ejemplo se concentran entre julio y septiembre.", chart: "month" },
        { label: "Lugar", value: "42 %", text: "de las picaduras de ejemplo ocurren en casa o cerca de ella.", chart: "place" },
        { label: "Actividad", value: "1,7×", text: "tasa relativa de picaduras de ejemplo al comer al aire libre.", chart: "activity" },
      ],
      chartDescription: "Distribución ilustrativa; no es un resultado de H-MIP",
    },
    explore: {
      eyebrow: "Explorar los datos",
      title: "Tres formas de acercarse a los datos",
      intro: "El mapa utiliza estimaciones provisionales del modelo de 2025. Las vistas temporales y de actividades aún usan valores sintéticos claramente identificados.",
      items: [
        { label: "Dónde ocurren las picaduras", title: "Patrones en Cataluña", text: "Explora cómo el lugar puede influir en la interacción entre personas y mosquitos.", status: "Explorar el mapa", chart: "spatial" },
        { label: "Cuándo ocurren", title: "Hora a hora", text: "Observa cómo puede variar la interacción registrada a lo largo del día y del año.", status: "Explorar patrones temporales", chart: "hour" },
        { label: "Qué hace la gente", title: "Actividades y lugares", text: "Compara la proporción de picaduras registradas entre actividades y lugares cotidianos.", status: "Explorar actividades", chart: "activity" },
      ],
    },
    action: {
      scienceEyebrow: "Ayuda a la ciencia",
      scienceTitle: "Comparte observaciones con Mosquito Alert",
      scienceText: "La ciencia ciudadana ayuda a comprender dónde hay mosquitos y cómo se encuentran con las personas.",
      scienceList: ["Comunica avistamientos de mosquitos.", "Comunica lugares de cría en espacios públicos.", "Apoya el seguimiento a largo plazo."],
      scienceLink: "Visitar Mosquito Alert",
    },
  },
  ca: {
    hero: {
      eyebrow: "Interacció entre persones i mosquits a Catalunya",
      title: "On i quan piquen els mosquits a les persones a Catalunya?",
      lead: "H-MIP estudia com canvia l’exposició a les picades segons el lloc, el moment i les activitats quotidianes, combinant recerca de camp, ciència ciutadana i modelització espacial.",
      primary: "Explora les dades",
      secondary: "Mira els patrons destacats",
      context: [["Focus", "Mosquit tigre"], ["Àmbit", "Catalunya"], ["Recerca", "Interacció entre persones i mosquits"]],
      previewTitle: "Vista prèvia del mapa del model",
      previewLabel: "Model provisional de 2025",
      previewCaption: "Cel·les H3 originals de resolució 7 · estimacions provisionals d’agost",
      low: "Baix",
      mid: "Mitjà",
      high: "Alt",
    },
    findings: {
      eyebrow: "Dades destacades",
      title: "Una lectura ràpida dels patrons",
      badge: "Dades sintètiques",
      items: [
        { label: "Hora del dia", value: "34 %", text: "de les picades d’exemple es produeixen entre les 18.00 i les 21.00 h.", chart: "hour" },
        { label: "Estació", value: "61 %", text: "de les observacions d’exemple es concentren entre juliol i setembre.", chart: "month" },
        { label: "Lloc", value: "42 %", text: "de les picades d’exemple es produeixen a casa o a prop.", chart: "place" },
        { label: "Activitat", value: "1,7×", text: "taxa relativa de picades d’exemple en menjar a l’aire lliure.", chart: "activity" },
      ],
      chartDescription: "Distribució il·lustrativa; no és un resultat d’H-MIP",
    },
    explore: {
      eyebrow: "Explora les dades",
      title: "Tres maneres d’apropar-se a les dades",
      intro: "El mapa utilitza estimacions provisionals del model de 2025. Les vistes temporals i d'activitats encara fan servir valors sintètics clarament identificats.",
      items: [
        { label: "On es produeixen les picades", title: "Patrons a Catalunya", text: "Explora com el lloc pot influir en la interacció entre persones i mosquits.", status: "Explora el mapa", chart: "spatial" },
        { label: "Quan es produeixen", title: "Hora a hora", text: "Observa com pot variar la interacció registrada al llarg del dia i de l’any.", status: "Explora els patrons temporals", chart: "hour" },
        { label: "Què fa la gent", title: "Activitats i llocs", text: "Compara la proporció de picades registrades entre activitats i llocs quotidians.", status: "Explora les activitats", chart: "activity" },
      ],
    },
    action: {
      scienceEyebrow: "Ajuda la ciència",
      scienceTitle: "Comparteix observacions amb Mosquito Alert",
      scienceText: "La ciència ciutadana ajuda a entendre on hi ha mosquits i com es troben amb les persones.",
      scienceList: ["Comunica avistaments de mosquits.", "Comunica llocs de cria en espais públics.", "Dona suport al seguiment a llarg termini."],
      scienceLink: "Visita Mosquito Alert",
    },
  },
} as const;

export type HomeLocale = keyof typeof homeContent;
