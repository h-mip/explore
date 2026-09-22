import geography from "./cataloniaGeometry.json";
import draft from "./cataloniaDraft.json";

// Geography comes from the supplied H3 cell IDs. The synthetic preview and draft model layer are labeled separately.
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
  draft: { months: number[]; count: number; confidence: { low: number; medium: number; high: number } };
}

const placeCoords = geography.places as Record<string, { x: number; y: number }>;
function syntheticBaseAt(id: string): number {
  const point = placeCoords[id];
  return geography.cells.reduce((nearest, cell) =>
    (cell.x - point.x) ** 2 + (cell.y - point.y) ** 2
      < (nearest.x - point.x) ** 2 + (nearest.y - point.y) ** 2 ? cell : nearest,
  ).base;
}

export const demoPlaces: DemoPlace[] = [
  { id: "lleida", name: "Lleida", comarca: "Segrià", ...placeCoords["lleida"], base: syntheticBaseAt("lleida") },
  { id: "girona", name: "Girona", comarca: "Gironès", ...placeCoords["girona"], base: syntheticBaseAt("girona") },
  { id: "barcelona", name: "Barcelona", comarca: "Barcelonès", ...placeCoords["barcelona"], base: syntheticBaseAt("barcelona") },
  { id: "tarragona", name: "Tarragona", comarca: "Tarragonès", ...placeCoords["tarragona"], base: syntheticBaseAt("tarragona") },
  { id: "badalona", name: "Badalona", comarca: "Barcelonès", ...placeCoords["badalona"], base: syntheticBaseAt("badalona") },
  { id: "sabadell", name: "Sabadell", comarca: "Vallès Occidental", ...placeCoords["sabadell"], base: syntheticBaseAt("sabadell") },
  { id: "terrassa", name: "Terrassa", comarca: "Vallès Occidental", ...placeCoords["terrassa"], base: syntheticBaseAt("terrassa") },
  { id: "mataro", name: "Mataró", comarca: "Maresme", ...placeCoords["mataro"], base: syntheticBaseAt("mataro") },
  { id: "reus", name: "Reus", comarca: "Baix Camp", ...placeCoords["reus"], base: syntheticBaseAt("reus") },
  { id: "vic", name: "Vic", comarca: "Osona", ...placeCoords["vic"], base: syntheticBaseAt("vic") },
  { id: "figueres", name: "Figueres", comarca: "Alt Empordà", ...placeCoords["figueres"], base: syntheticBaseAt("figueres") },
  { id: "manresa", name: "Manresa", comarca: "Bages", ...placeCoords["manresa"], base: syntheticBaseAt("manresa") },
];

export const draftMeta = {
  period: draft.period,
  units: draft.units,
  classBreaks: draft.classBreaks,
  method: draft.method,
};
export function draftLevel(value: number): number {
  const index = draftMeta.classBreaks.findIndex((breakValue) => value < breakValue);
  return index === -1 ? draftMeta.classBreaks.length : index;
}
export function formatProbability(value: number): string {
  return `${Number(value.toPrecision(2))}%`;
}
export const outlinePath = geography.outlinePath;
export const mapViewBox = geography.viewBox;
export const palette = ["#193754", "#2f718c", "#3d9d8b", "#83c77a", "#e5d875"] as const;
const season = [0.22, 0.18, 0.2, 0.28, 0.44, 0.68, 0.9, 1, 0.86, 0.58, 0.34, 0.24];

export function scoreForBase(base: number, month: number): number {
  const factor = season[Math.max(1, Math.min(12, month)) - 1];
  return Math.max(0, Math.min(100, Math.round(base * 0.35 + base * factor * 0.72)));
}

export function levelForScore(score: number): number {
  return Math.max(0, Math.min(4, Math.floor(score / 20)));
}

function nearestPlace(x: number, y: number): DemoPlace {
  return demoPlaces.reduce((nearest, place) =>
    (place.x - x) ** 2 + (place.y - y) ** 2 < (nearest.x - x) ** 2 + (nearest.y - y) ** 2 ? place : nearest,
  );
}

export const demoCells: DemoCell[] = geography.cells.map((cell) => ({
  ...cell,
  near: nearestPlace(cell.x, cell.y).name,
  draft: draft.cells[cell.id as keyof typeof draft.cells],
}));

export const mapContent = {
  en: {
    metaTitle: "Map explorer — H-MIP Explore", metaDescription: "Explore draft 2025 H3 model estimates and a clearly labeled synthetic map preview for Catalonia.",
    eyebrow: "Explore by place", title: "Map explorer", lead: "Explore how an interaction map could change by place and month. Select a sample area for a plain-language reading and monthly profile.", badge: "Synthetic map data", draftBadge: "Draft 2025 model · aggregated H3",
    controls: "Map controls", layerStep: "01 · View", layerLabel: "Layer", grid: "H3 grid preview", draftLayer: "2025 draft model", places: "Sample places", gridHint: "H3 geography from the supplied draft grid; all colours are synthetic.", draftHint: "Draft 2025 model estimates. Each displayed H3 cell is the mean of its underlying resolution-7 cells.", placesHint: "Sample municipality points; positions are illustrative.",
    searchStep: "02 · Place", searchLabel: "Find a place or H3 cell", searchPlaceholder: "Place, comarca, or H3 ID", searchButton: "Find", searchMiss: "No matching sample place or H3 cell.", searchHint: "Search 12 sample places or the displayed H3 cells.", searchClear: "Clear search", searchPlaceType: "Sample place", searchCellType: "H3 cell", searchNear: "Near",
    timeStep: "03 · Time", timeLabel: "Month", play: "Play", pause: "Pause", monthAria: "Select month",
    legendStep: "04 · Legend", legendTitle: "Synthetic interaction index", levels: ["Very low", "Low", "Medium", "High", "Very high"], legendNote: "Colours represent invented values on a 0–100 index; they are not risk advice.", draftLegendTitle: "Estimated probability (%) · draft", draftLegendNote: "Classes use the breaks supplied in layers.csv. Mean of source H3 estimates; not risk advice.",
    selectedStep: "05 · Selected area", near: "Near", selectedNote: "Illustrative value", draftSelectedNote: "Mean of source cells", confidenceLabel: "Source-cell confidence", confidenceLevels: ["Low", "Medium", "High"], sourceCells: "source cells", sourceCellSingular: "source cell", valueUnit: "out of 100", peak: "Demo profile peaks in summer.", draftProfileNote: "Monthly means of draft 2025 estimates; confidence is shown as source-cell counts.",
    methodStep: "06 · Method", methodTitle: "About this demonstration", methodText: "The outline and cell positions come from the supplied draft H3 grid, aggregated to resolution 6. All colours and monthly scores are synthetic, not H-MIP model results. The edge is an H3 footprint, not an official boundary; reviewed methods and attribution are still needed.", draftMethodTitle: "About the draft model", draftMethodText: "These are draft 2025 model estimates from the supplied H3 data. Each displayed resolution-6 cell shows the arithmetic mean of its resolution-7 source cells, not a population-weighted estimate. The edge is an H3 footprint, not an official boundary. Source-cell confidence counts are shown without combining them into a new confidence class. Scientific wording, methods and attribution still need review before launch.",
    mapAria: "Interactive H3 map of Catalonia with synthetic values", draftMapAria: "Interactive H3 map of Catalonia with draft 2025 model probabilities aggregated to resolution 6", schematic: "Draft H3 footprint · synthetic values · not an official boundary", draftSchematic: "Draft 2025 probabilities · mean of resolution-7 cells · H3 footprint", zoomIn: "Zoom in", zoomOut: "Zoom out",
    mapView: "Map view", tableView: "Accessible table", viewLabel: "Map or table view", tableLabel: "Sample places and synthetic monthly values", tableCaption: "Synthetic sample values for", draftTableCaption: "Draft H3 mean probabilities for", gridTableCaption: "Synthetic H3 preview for", cellRows: "cells shown", cellRowSingular: "cell shown", nearbyColumn: "Nearest sample place", h3Column: "H3 cell", probabilityColumn: "Probability (%)", municipality: "Municipality", comarca: "Comarca", index: "Index", tableFilter: "Filter places", cellFilter: "Filter H3 cells", h3FilterPlaceholder: "H3 ID or nearby sample place", emptyCells: "No matching H3 cells.", rows: "places shown", rowSingular: "place shown", sort: "Sort by", emptyTable: "No matching places.",
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    monthShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  },
  es: {
    metaTitle: "Explorador del mapa — H-MIP Explora", metaDescription: "Explora estimaciones provisionales del modelo H3 de 2025 y una vista previa cartográfica sintética de Cataluña.",
    eyebrow: "Explorar por lugar", title: "Explorador del mapa", lead: "Explora cómo podría cambiar un mapa de interacción según el lugar y el mes. Selecciona una zona de ejemplo para ver una lectura sencilla y su perfil mensual.", badge: "Datos cartográficos sintéticos", draftBadge: "Modelo provisional 2025 · H3 agrupado",
    controls: "Controles del mapa", layerStep: "01 · Vista", layerLabel: "Capa", grid: "Vista previa H3", draftLayer: "Modelo provisional 2025", places: "Lugares de ejemplo", gridHint: "Geografía H3 de la cuadrícula provisional; todos los colores son sintéticos.", draftHint: "Estimaciones del modelo provisional de 2025. Cada celda H3 visible es la media de sus celdas de resolución 7.", placesHint: "Puntos de municipios de ejemplo; las posiciones son ilustrativas.",
    searchStep: "02 · Lugar", searchLabel: "Buscar un lugar o celda H3", searchPlaceholder: "Lugar, comarca o ID H3", searchButton: "Buscar", searchMiss: "No hay lugares de ejemplo ni celdas H3 que coincidan.", searchHint: "Busca entre 12 lugares de ejemplo o las celdas H3 visibles.", searchClear: "Borrar búsqueda", searchPlaceType: "Lugar de ejemplo", searchCellType: "Celda H3", searchNear: "Cerca de",
    timeStep: "03 · Tiempo", timeLabel: "Mes", play: "Reproducir", pause: "Pausar", monthAria: "Seleccionar mes",
    legendStep: "04 · Leyenda", legendTitle: "Índice de interacción sintético", levels: ["Muy bajo", "Bajo", "Medio", "Alto", "Muy alto"], legendNote: "Los colores representan valores inventados de un índice de 0 a 100; no son consejos sobre el riesgo.", draftLegendTitle: "Probabilidad estimada (%) · provisional", draftLegendNote: "Las clases usan los cortes de layers.csv. Media de estimaciones H3; no es un consejo sobre el riesgo.",
    selectedStep: "05 · Zona seleccionada", near: "Cerca de", selectedNote: "Valor ilustrativo", draftSelectedNote: "Media de celdas originales", confidenceLabel: "Confianza de las celdas originales", confidenceLevels: ["Baja", "Media", "Alta"], sourceCells: "celdas originales", sourceCellSingular: "celda original", valueUnit: "de 100", peak: "El perfil de ejemplo alcanza su máximo en verano.", draftProfileNote: "Medias mensuales de las estimaciones provisionales de 2025; la confianza se muestra por número de celdas.",
    methodStep: "06 · Método", methodTitle: "Sobre esta demostración", methodText: "El contorno y las celdas proceden de la cuadrícula H3 provisional, agrupada a resolución 6. Todos los colores y valores mensuales son sintéticos, no resultados del modelo de H-MIP. El borde es una huella H3, no un límite oficial; faltan los métodos y atribuciones revisados.", draftMethodTitle: "Sobre el modelo provisional", draftMethodText: "Estas son estimaciones del modelo provisional de 2025 de los datos H3 suministrados. Cada celda visible de resolución 6 muestra la media aritmética de sus celdas originales de resolución 7, no una estimación ponderada por población. El borde es una huella H3, no un límite oficial. Los recuentos de confianza se muestran sin crear una clase nueva. Los métodos, la redacción científica y las atribuciones aún requieren revisión antes del lanzamiento.",
    mapAria: "Mapa H3 interactivo de Cataluña con valores sintéticos", draftMapAria: "Mapa H3 interactivo de Cataluña con probabilidades provisionales de 2025 agrupadas a resolución 6", schematic: "Huella H3 provisional · valores sintéticos · no es un límite oficial", draftSchematic: "Probabilidades provisionales de 2025 · media de celdas de resolución 7 · huella H3", zoomIn: "Acercar", zoomOut: "Alejar",
    mapView: "Ver mapa", tableView: "Tabla accesible", viewLabel: "Vista de mapa o tabla", tableLabel: "Lugares de ejemplo y valores mensuales sintéticos", tableCaption: "Valores sintéticos de ejemplo para", draftTableCaption: "Probabilidades medias H3 provisionales para", gridTableCaption: "Vista previa H3 sintética para", cellRows: "celdas visibles", cellRowSingular: "celda visible", nearbyColumn: "Lugar de ejemplo cercano", h3Column: "Celda H3", probabilityColumn: "Probabilidad (%)", municipality: "Municipio", comarca: "Comarca", index: "Índice", tableFilter: "Filtrar lugares", cellFilter: "Filtrar celdas H3", h3FilterPlaceholder: "ID H3 o lugar de ejemplo cercano", emptyCells: "No hay celdas H3 que coincidan.", rows: "lugares visibles", rowSingular: "lugar visible", sort: "Ordenar por", emptyTable: "No hay lugares que coincidan.",
    months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
    monthShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
  },
  ca: {
    metaTitle: "Explorador del mapa — H-MIP Explora", metaDescription: "Explora estimacions provisionals del model H3 de 2025 i una vista prèvia cartogràfica sintètica de Catalunya.",
    eyebrow: "Explora per lloc", title: "Explorador del mapa", lead: "Explora com podria canviar un mapa d'interacció segons el lloc i el mes. Selecciona una zona d'exemple per veure una lectura senzilla i el seu perfil mensual.", badge: "Dades cartogràfiques sintètiques", draftBadge: "Model provisional 2025 · H3 agrupat",
    controls: "Controls del mapa", layerStep: "01 · Vista", layerLabel: "Capa", grid: "Vista prèvia H3", draftLayer: "Model provisional 2025", places: "Llocs d'exemple", gridHint: "Geografia H3 de la graella provisional; tots els colors són sintètics.", draftHint: "Estimacions del model provisional de 2025. Cada cel·la H3 visible és la mitjana de les cel·les de resolució 7.", placesHint: "Punts de municipis d'exemple; les posicions són il·lustratives.",
    searchStep: "02 · Lloc", searchLabel: "Cerca un lloc o una cel·la H3", searchPlaceholder: "Lloc, comarca o ID H3", searchButton: "Cerca", searchMiss: "No hi ha llocs d'exemple ni cel·les H3 que coincideixin.", searchHint: "Cerca entre 12 llocs d'exemple o les cel·les H3 visibles.", searchClear: "Neteja la cerca", searchPlaceType: "Lloc d'exemple", searchCellType: "Cel·la H3", searchNear: "A prop de",
    timeStep: "03 · Temps", timeLabel: "Mes", play: "Reprodueix", pause: "Pausa", monthAria: "Selecciona el mes",
    legendStep: "04 · Llegenda", legendTitle: "Índex d'interacció sintètic", levels: ["Molt baix", "Baix", "Mitjà", "Alt", "Molt alt"], legendNote: "Els colors representen valors inventats d'un índex de 0 a 100; no són consells sobre el risc.", draftLegendTitle: "Probabilitat estimada (%) · provisional", draftLegendNote: "Les classes usen els llindars de layers.csv. Mitjana de les estimacions H3; no és cap consell sobre el risc.",
    selectedStep: "05 · Zona seleccionada", near: "A prop de", selectedNote: "Valor il·lustratiu", draftSelectedNote: "Mitjana de les cel·les originals", confidenceLabel: "Confiança de les cel·les originals", confidenceLevels: ["Baixa", "Mitjana", "Alta"], sourceCells: "cel·les originals", sourceCellSingular: "cel·la original", valueUnit: "de 100", peak: "El perfil d'exemple arriba al màxim a l'estiu.", draftProfileNote: "Mitjanes mensuals de les estimacions provisionals de 2025; la confiança es mostra per nombre de cel·les.",
    methodStep: "06 · Mètode", methodTitle: "Sobre aquesta demostració", methodText: "El contorn i les cel·les provenen de la graella H3 provisional, agrupada a resolució 6. Tots els colors i valors mensuals són sintètics, no resultats del model d'H-MIP. La vora és una empremta H3, no un límit oficial; encara calen els mètodes i les atribucions revisats.", draftMethodTitle: "Sobre el model provisional", draftMethodText: "Aquestes són estimacions del model provisional de 2025 a partir de les dades H3 subministrades. Cada cel·la visible de resolució 6 mostra la mitjana aritmètica de les cel·les originals de resolució 7, no una estimació ponderada per població. La vora és una empremta H3, no un límit oficial. Els recomptes de confiança es mostren sense crear cap classe nova. Els mètodes, el redactat científic i les atribucions encara s'han de revisar abans del llançament.",
    mapAria: "Mapa H3 interactiu de Catalunya amb valors sintètics", draftMapAria: "Mapa H3 interactiu de Catalunya amb probabilitats provisionals de 2025 agrupades a resolució 6", schematic: "Empremta H3 provisional · valors sintètics · no és un límit oficial", draftSchematic: "Probabilitats provisionals de 2025 · mitjana de cel·les de resolució 7 · empremta H3", zoomIn: "Apropa", zoomOut: "Allunya",
    mapView: "Mostra el mapa", tableView: "Taula accessible", viewLabel: "Vista de mapa o taula", tableLabel: "Llocs d'exemple i valors mensuals sintètics", tableCaption: "Valors sintètics d'exemple per a", draftTableCaption: "Probabilitats mitjanes H3 provisionals per a", gridTableCaption: "Vista prèvia H3 sintètica per a", cellRows: "cel·les visibles", cellRowSingular: "cel·la visible", nearbyColumn: "Lloc d'exemple proper", h3Column: "Cel·la H3", probabilityColumn: "Probabilitat (%)", municipality: "Municipi", comarca: "Comarca", index: "Índex", tableFilter: "Filtra llocs", cellFilter: "Filtra cel·les H3", h3FilterPlaceholder: "ID H3 o lloc d'exemple proper", emptyCells: "No hi ha cap cel·la H3 que coincideixi.", rows: "llocs visibles", rowSingular: "lloc visible", sort: "Ordena per", emptyTable: "No hi ha llocs que coincideixin.",
    months: ["Gener", "Febrer", "Març", "Abril", "Maig", "Juny", "Juliol", "Agost", "Setembre", "Octubre", "Novembre", "Desembre"],
    monthShort: ["Gen", "Feb", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Oct", "Nov", "Des"],
  },
} as const;

export type MapLocale = keyof typeof mapContent;
