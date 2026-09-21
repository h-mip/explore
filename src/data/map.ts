// Illustration only. Geometry and values are schematic; replace this module with
// reviewed H-MIP layer data and metadata before presenting research estimates.
export interface DemoPlace {
  id: string;
  name: string;
  comarca: string;
  x: number;
  y: number;
  base: number;
}

export interface DemoCell {
  id: string;
  x: number;
  y: number;
  path: string;
  base: number;
  near: string;
}

export const demoPlaces: DemoPlace[] = [
  { id: "lleida", name: "Lleida", comarca: "Segrià", x: 285, y: 310, base: 49 },
  { id: "girona", name: "Girona", comarca: "Gironès", x: 695, y: 192, base: 58 },
  { id: "barcelona", name: "Barcelona", comarca: "Barcelonès", x: 670, y: 386, base: 72 },
  { id: "tarragona", name: "Tarragona", comarca: "Tarragonès", x: 525, y: 445, base: 66 },
  { id: "badalona", name: "Badalona", comarca: "Barcelonès", x: 698, y: 368, base: 70 },
  { id: "sabadell", name: "Sabadell", comarca: "Vallès Occidental", x: 620, y: 337, base: 62 },
  { id: "terrassa", name: "Terrassa", comarca: "Vallès Occidental", x: 588, y: 335, base: 60 },
  { id: "mataro", name: "Mataró", comarca: "Maresme", x: 743, y: 332, base: 68 },
  { id: "reus", name: "Reus", comarca: "Baix Camp", x: 492, y: 428, base: 61 },
  { id: "vic", name: "Vic", comarca: "Osona", x: 590, y: 260, base: 45 },
  { id: "figueres", name: "Figueres", comarca: "Alt Empordà", x: 730, y: 145, base: 55 },
  { id: "manresa", name: "Manresa", comarca: "Bages", x: 505, y: 325, base: 52 },
];

export const outline: [number, number][] = [
  [150, 105], [245, 70], [365, 80], [470, 64], [555, 95], [650, 75],
  [760, 112], [825, 170], [850, 235], [818, 300], [845, 354],
  [792, 415], [704, 450], [644, 507], [548, 494], [474, 520],
  [366, 506], [304, 468], [232, 444], [174, 390], [134, 329],
  [146, 274], [118, 218], [135, 160],
];

export const outlinePoints = outline.map(([x, y]) => `${x},${y}`).join(" ");
export const palette = ["#f0dc70", "#a6c977", "#4d9a85", "#2e6f8b", "#4a3d78"] as const;
const season = [0.22, 0.18, 0.2, 0.28, 0.44, 0.68, 0.9, 1, 0.86, 0.58, 0.34, 0.24];

export function scoreForBase(base: number, month: number): number {
  const factor = season[Math.max(1, Math.min(12, month)) - 1];
  return Math.max(0, Math.min(100, Math.round(base * 0.35 + base * factor * 0.72)));
}

export function levelForScore(score: number): number {
  return Math.max(0, Math.min(4, Math.floor(score / 20)));
}

function insideOutline(x: number, y: number): boolean {
  let inside = false;
  for (let i = 0, j = outline.length - 1; i < outline.length; j = i++) {
    const [xi, yi] = outline[i];
    const [xj, yj] = outline[j];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

function nearestPlace(x: number, y: number): DemoPlace {
  return demoPlaces.reduce((nearest, place) =>
    (place.x - x) ** 2 + (place.y - y) ** 2 < (nearest.x - x) ** 2 + (nearest.y - y) ** 2 ? place : nearest,
  );
}

function hexPath(x: number, y: number, radius: number): string {
  return Array.from({ length: 6 }, (_, point) => {
    const angle = (Math.PI / 3) * point + Math.PI / 6;
    const px = (x + radius * Math.cos(angle)).toFixed(1);
    const py = (y + radius * Math.sin(angle)).toFixed(1);
    return `${point === 0 ? "M" : "L"}${px} ${py}`;
  }).join(" ") + " Z";
}

export const demoCells: DemoCell[] = (() => {
  const cells: DemoCell[] = [];
  const radius = 27;
  const dx = Math.sqrt(3) * radius;
  for (let row = 0, y = 88; y < 520; row++, y += radius * 1.5) {
    for (let x = 138 + (row % 2 ? dx / 2 : 0); x < 850; x += dx) {
      if (!insideOutline(x, y)) continue;
      const near = nearestPlace(x, y);
      const variation = Math.round(Math.sin(x * 0.031 + y * 0.019) * 8);
      cells.push({ id: `cell-${cells.length}`, x, y, path: hexPath(x, y, radius - 1), base: Math.max(8, Math.min(95, near.base + variation)), near: near.name });
    }
  }
  return cells;
})();

export const mapContent = {
  en: {
    metaTitle: "Map explorer — H-MIP Bites", metaDescription: "Explore a clearly labelled synthetic map demonstration of human–mosquito interaction in Catalonia.",
    eyebrow: "Explore by place", title: "Map explorer", lead: "Explore how an interaction map could change by place and month. Select a sample area for a plain-language reading and monthly profile.", badge: "Synthetic map data",
    controls: "Map controls", layerStep: "01 · View", layerLabel: "Layer", grid: "Illustrative grid", places: "Sample places", gridHint: "Schematic cells; these are not H3 data or geographic estimates.", placesHint: "Sample municipality points; positions are illustrative.",
    searchStep: "02 · Place", searchLabel: "Find a sample place", searchPlaceholder: "Search sample municipalities", searchButton: "Find", searchMiss: "No matching sample place.",
    timeStep: "03 · Time", timeLabel: "Month", play: "Play", pause: "Pause", monthAria: "Select month",
    legendStep: "04 · Legend", legendTitle: "Synthetic interaction index", levels: ["Very low", "Low", "Medium", "High", "Very high"], legendNote: "Colours represent invented values on a 0–100 index; they are not risk advice.",
    selectedStep: "05 · Selected area", near: "Near", selectedNote: "Illustrative value", valueUnit: "out of 100", peak: "Demo profile peaks in summer.",
    methodStep: "06 · Method", methodTitle: "About this demonstration", methodText: "The outline, grid, place positions and monthly values are schematic. They do not show H-MIP observations, model results, H3 cells or official boundaries. This layout is ready to connect to reviewed project data and its methods, uncertainty and attribution.",
    mapAria: "Interactive schematic map of Catalonia with synthetic values", schematic: "Schematic Catalonia illustration · no geographic measurements", zoomIn: "Zoom in", zoomOut: "Zoom out",
    mapView: "Map view", tableView: "Accessible table", viewLabel: "Map or table view", tableLabel: "Sample places and synthetic monthly values", tableCaption: "Synthetic sample values for", municipality: "Municipality", comarca: "Comarca", index: "Index", tableFilter: "Filter places", rows: "places shown", sort: "Sort by", emptyTable: "No matching places.",
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    monthShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  },
  es: {
    metaTitle: "Explorador del mapa — H-MIP Bites", metaDescription: "Explora una demostración cartográfica claramente identificada con datos sintéticos sobre Cataluña.",
    eyebrow: "Explorar por lugar", title: "Explorador del mapa", lead: "Explora cómo podría cambiar un mapa de interacción según el lugar y el mes. Selecciona una zona de ejemplo para ver una lectura sencilla y su perfil mensual.", badge: "Datos cartográficos sintéticos",
    controls: "Controles del mapa", layerStep: "01 · Vista", layerLabel: "Capa", grid: "Cuadrícula ilustrativa", places: "Lugares de ejemplo", gridHint: "Celdas esquemáticas; no son datos H3 ni estimaciones geográficas.", placesHint: "Puntos de municipios de ejemplo; las posiciones son ilustrativas.",
    searchStep: "02 · Lugar", searchLabel: "Buscar un lugar de ejemplo", searchPlaceholder: "Buscar municipios de ejemplo", searchButton: "Buscar", searchMiss: "No hay un lugar de ejemplo que coincida.",
    timeStep: "03 · Tiempo", timeLabel: "Mes", play: "Reproducir", pause: "Pausar", monthAria: "Seleccionar mes",
    legendStep: "04 · Leyenda", legendTitle: "Índice de interacción sintético", levels: ["Muy bajo", "Bajo", "Medio", "Alto", "Muy alto"], legendNote: "Los colores representan valores inventados de un índice de 0 a 100; no son consejos sobre el riesgo.",
    selectedStep: "05 · Zona seleccionada", near: "Cerca de", selectedNote: "Valor ilustrativo", valueUnit: "de 100", peak: "El perfil de ejemplo alcanza su máximo en verano.",
    methodStep: "06 · Método", methodTitle: "Sobre esta demostración", methodText: "El contorno, la cuadrícula, las posiciones y los valores mensuales son esquemáticos. No muestran observaciones de H-MIP, resultados de modelos, celdas H3 ni límites oficiales. Este diseño está preparado para incorporar datos revisados del proyecto junto con sus métodos, incertidumbre y atribución.",
    mapAria: "Mapa esquemático interactivo de Cataluña con valores sintéticos", schematic: "Ilustración esquemática de Cataluña · sin mediciones geográficas", zoomIn: "Acercar", zoomOut: "Alejar",
    mapView: "Ver mapa", tableView: "Tabla accesible", viewLabel: "Vista de mapa o tabla", tableLabel: "Lugares de ejemplo y valores mensuales sintéticos", tableCaption: "Valores sintéticos de ejemplo para", municipality: "Municipio", comarca: "Comarca", index: "Índice", tableFilter: "Filtrar lugares", rows: "lugares visibles", sort: "Ordenar por", emptyTable: "No hay lugares que coincidan.",
    months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
    monthShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
  },
  ca: {
    metaTitle: "Explorador del mapa — H-MIP Bites", metaDescription: "Explora una demostració cartogràfica clarament identificada amb dades sintètiques sobre Catalunya.",
    eyebrow: "Explora per lloc", title: "Explorador del mapa", lead: "Explora com podria canviar un mapa d'interacció segons el lloc i el mes. Selecciona una zona d'exemple per veure una lectura senzilla i el seu perfil mensual.", badge: "Dades cartogràfiques sintètiques",
    controls: "Controls del mapa", layerStep: "01 · Vista", layerLabel: "Capa", grid: "Graella il·lustrativa", places: "Llocs d'exemple", gridHint: "Cel·les esquemàtiques; no són dades H3 ni estimacions geogràfiques.", placesHint: "Punts de municipis d'exemple; les posicions són il·lustratives.",
    searchStep: "02 · Lloc", searchLabel: "Cerca un lloc d'exemple", searchPlaceholder: "Cerca municipis d'exemple", searchButton: "Cerca", searchMiss: "No hi ha cap lloc d'exemple que coincideixi.",
    timeStep: "03 · Temps", timeLabel: "Mes", play: "Reprodueix", pause: "Pausa", monthAria: "Selecciona el mes",
    legendStep: "04 · Llegenda", legendTitle: "Índex d'interacció sintètic", levels: ["Molt baix", "Baix", "Mitjà", "Alt", "Molt alt"], legendNote: "Els colors representen valors inventats d'un índex de 0 a 100; no són consells sobre el risc.",
    selectedStep: "05 · Zona seleccionada", near: "A prop de", selectedNote: "Valor il·lustratiu", valueUnit: "de 100", peak: "El perfil d'exemple arriba al màxim a l'estiu.",
    methodStep: "06 · Mètode", methodTitle: "Sobre aquesta demostració", methodText: "El contorn, la graella, les posicions i els valors mensuals són esquemàtics. No mostren observacions d'H-MIP, resultats de models, cel·les H3 ni límits oficials. Aquest disseny està preparat per incorporar dades revisades del projecte amb els seus mètodes, incertesa i atribució.",
    mapAria: "Mapa esquemàtic interactiu de Catalunya amb valors sintètics", schematic: "Il·lustració esquemàtica de Catalunya · sense mesuraments geogràfics", zoomIn: "Apropa", zoomOut: "Allunya",
    mapView: "Mostra el mapa", tableView: "Taula accessible", viewLabel: "Vista de mapa o taula", tableLabel: "Llocs d'exemple i valors mensuals sintètics", tableCaption: "Valors sintètics d'exemple per a", municipality: "Municipi", comarca: "Comarca", index: "Índex", tableFilter: "Filtra llocs", rows: "llocs visibles", sort: "Ordena per", emptyTable: "No hi ha llocs que coincideixin.",
    months: ["Gener", "Febrer", "Març", "Abril", "Maig", "Juny", "Juliol", "Agost", "Setembre", "Octubre", "Novembre", "Desembre"],
    monthShort: ["Gen", "Feb", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Oct", "Nov", "Des"],
  },
} as const;

export type MapLocale = keyof typeof mapContent;
