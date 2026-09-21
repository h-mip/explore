import { demoCells, demoPlaces, levelForScore, mapContent, palette, scoreForBase, type MapLocale } from "../data/map";

const root = document.querySelector<HTMLElement>("[data-map-explorer]");

if (root) {
  const locale = root.dataset.locale as MapLocale;
  const copy = mapContent[locale];
  const find = <T extends Element>(selector: string): T => {
    const element = root.querySelector<T>(selector);
    if (!element) throw new Error(`Missing map element: ${selector}`);
    return element;
  };
  const initialArea = root.dataset.initialArea ?? demoCells[0].id;
  const allAreas = new Set([...demoCells.map((cell) => cell.id), ...demoPlaces.map((place) => place.id)]);
  const params = new URLSearchParams(window.location.search);
  const requestedMonth = Number(params.get("month"));
  const requestedZoom = Number(params.get("zoom"));
  const state = {
    layer: params.get("layer") === "places" ? "places" : "grid",
    month: Number.isInteger(requestedMonth) && requestedMonth >= 1 && requestedMonth <= 12 ? requestedMonth : 8,
    area: allAreas.has(params.get("area") ?? "") ? params.get("area")! : initialArea,
    view: params.get("view") === "table" ? "table" : "map",
    zoom: Number.isFinite(requestedZoom) && requestedZoom >= 1 && requestedZoom <= 2 ? requestedZoom : 1,
  };
  const gridLayer = find<SVGGElement>("[data-grid-layer]");
  const placesLayer = find<SVGGElement>("[data-places-layer]");
  const mapContentGroup = find<SVGGElement>("[data-map-content]");
  const shapes = [...root.querySelectorAll<SVGElement>("[data-area-id]")];
  const monthInput = find<HTMLInputElement>("[data-month]");
  const playButton = find<HTMLButtonElement>("[data-play]");
  const searchForm = find<HTMLFormElement>("[data-place-search]");
  const searchInput = find<HTMLInputElement>("#map-place-search");
  const searchStatus = find<HTMLElement>("[data-search-status]");
  const tableFilter = find<HTMLInputElement>("[data-table-filter]");
  const tableBody = find<HTMLTableSectionElement>("tbody");
  const tableRows = [...tableBody.querySelectorAll<HTMLTableRowElement>("[data-row-id]")];
  let sortKey: "name" | "comarca" | "score" = "name";
  let sortDirection = 1;
  let timer: ReturnType<typeof setInterval> | null = null;

  const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase(locale).trim();
  const activeShape = () => shapes.find((shape) => shape.dataset.areaId === state.area);

  function stopPlayback() {
    if (timer !== null) clearInterval(timer);
    timer = null;
    playButton.setAttribute("aria-pressed", "false");
    playButton.textContent = `▶ ${copy.play}`;
  }

  function updateUrl() {
    const query = new URLSearchParams({ layer: state.layer, month: String(state.month), area: state.area, view: state.view });
    if (state.zoom > 1) query.set("zoom", state.zoom.toFixed(1));
    window.history.replaceState(null, "", `${window.location.pathname}?${query}${window.location.hash}`);
    document.querySelectorAll<HTMLAnchorElement>(".language-switcher a[lang]").forEach((link) => {
      link.href = `${new URL(link.href).pathname}?${query}`;
    });
  }

  function updateTable() {
    const filter = normalize(tableFilter.value);
    const sorted = [...tableRows].sort((first, second) => {
      const a = demoPlaces.find((place) => place.id === first.dataset.rowId)!;
      const b = demoPlaces.find((place) => place.id === second.dataset.rowId)!;
      const result = sortKey === "score" ? scoreForBase(a.base, state.month) - scoreForBase(b.base, state.month) : a[sortKey].localeCompare(b[sortKey], locale);
      return result * sortDirection;
    });
    let visible = 0;
    sorted.forEach((row) => {
      const place = demoPlaces.find((item) => item.id === row.dataset.rowId)!;
      row.querySelector<HTMLElement>("[data-row-score]")!.textContent = String(scoreForBase(place.base, state.month));
      row.hidden = !!filter && !normalize(`${place.name} ${place.comarca}`).includes(filter);
      if (!row.hidden) visible++;
      tableBody.append(row);
    });
    find<HTMLElement>("[data-table-caption]").textContent = `${copy.tableCaption} ${copy.months[state.month - 1]} · ${visible} ${copy.rows}`;
    find<HTMLElement>("[data-empty-table]").hidden = visible > 0;
  }

  function render() {
    if (state.layer === "grid" && demoPlaces.some((place) => place.id === state.area)) {
      const place = demoPlaces.find((item) => item.id === state.area)!;
      state.area = demoCells.reduce((nearest, cell) => (cell.x - place.x) ** 2 + (cell.y - place.y) ** 2 < (nearest.x - place.x) ** 2 + (nearest.y - place.y) ** 2 ? cell : nearest).id;
    }
    if (state.layer === "places" && demoCells.some((cell) => cell.id === state.area)) {
      const cell = demoCells.find((item) => item.id === state.area)!;
      state.area = demoPlaces.reduce((nearest, place) => (place.x - cell.x) ** 2 + (place.y - cell.y) ** 2 < (nearest.x - cell.x) ** 2 + (nearest.y - cell.y) ** 2 ? place : nearest).id;
    }

    gridLayer.setAttribute("display", state.layer === "grid" ? "inline" : "none");
    placesLayer.setAttribute("display", state.layer === "places" ? "inline" : "none");
    gridLayer.setAttribute("aria-hidden", String(state.layer !== "grid"));
    placesLayer.setAttribute("aria-hidden", String(state.layer !== "places"));
    root.querySelectorAll<HTMLButtonElement>("[data-layer]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.layer === state.layer)));
    find<HTMLElement>("[data-layer-hint]").textContent = state.layer === "grid" ? copy.gridHint : copy.placesHint;

    shapes.forEach((shape) => {
      const base = Number(shape.dataset.base);
      const score = scoreForBase(base, state.month);
      const isGrid = shape.classList.contains("map-cell");
      shape.setAttribute("fill", palette[levelForScore(score)]);
      shape.setAttribute("tabindex", shape.dataset.areaId === state.area ? "0" : "-1");
      shape.classList.toggle("is-selected", shape.dataset.areaId === state.area);
      shape.setAttribute("aria-label", `${isGrid ? `${copy.near} ` : ""}${shape.dataset.near}: ${score} ${copy.valueUnit}`);
      const title = shape.querySelector("title");
      if (title) title.textContent = `${shape.dataset.near} · ${score} / 100`;
    });

    const selected = activeShape();
    if (selected) {
      const base = Number(selected.dataset.base);
      const score = scoreForBase(base, state.month);
      find<HTMLElement>("[data-selected-name]").textContent = `${state.layer === "grid" ? `${copy.near} ` : ""}${selected.dataset.near}`;
      find<HTMLElement>("[data-selected-reading]").textContent = `${copy.months[state.month - 1]} · ${copy.levels[levelForScore(score)]}`;
      find<HTMLElement>("[data-selected-score]").textContent = `${score} / 100`;
      find<HTMLElement>("[data-profile]").querySelectorAll<HTMLElement>("i").forEach((bar, index) => { bar.style.height = `${scoreForBase(base, index + 1)}%`; });
    }

    monthInput.value = String(state.month);
    find<HTMLElement>("[data-month-name]").textContent = copy.months[state.month - 1];
    root.querySelectorAll<HTMLElement>(".month-ticks span").forEach((tick, index) => tick.classList.toggle("active", index === state.month - 1));
    mapContentGroup.setAttribute("transform", `translate(480 290) scale(${state.zoom}) translate(-480 -290)`);
    find<HTMLElement>("[data-map-shell]").hidden = state.view === "table";
    find<HTMLElement>("[data-table-panel]").hidden = state.view === "map";
    root.querySelectorAll<HTMLButtonElement>("[data-view]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.view === state.view)));
    updateTable();
    updateUrl();
  }

  shapes.forEach((shape) => {
    const select = () => { state.area = shape.dataset.areaId!; render(); };
    shape.addEventListener("click", select);
    shape.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") { event.preventDefault(); select(); }
      if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) return;
      event.preventDefault();
      const current = state.layer === "grid" ? demoCells.find((cell) => cell.id === state.area) : demoPlaces.find((place) => place.id === state.area);
      if (!current) return;
      const options = state.layer === "grid" ? demoCells : demoPlaces;
      const candidates = options.filter((item) => {
        if (event.key === "ArrowRight") return item.x > current.x + 1;
        if (event.key === "ArrowLeft") return item.x < current.x - 1;
        if (event.key === "ArrowDown") return item.y > current.y + 1;
        return item.y < current.y - 1;
      });
      const next = candidates.reduce<typeof current | null>((best, item) => {
        const dx = item.x - current.x;
        const dy = item.y - current.y;
        const distance = (event.key === "ArrowLeft" || event.key === "ArrowRight") ? dx * dx + 4 * dy * dy : 4 * dx * dx + dy * dy;
        if (!best) return item;
        const bx = best.x - current.x;
        const by = best.y - current.y;
        const bestDistance = (event.key === "ArrowLeft" || event.key === "ArrowRight") ? bx * bx + 4 * by * by : 4 * bx * bx + by * by;
        return distance < bestDistance ? item : best;
      }, null);
      if (next) {
        state.area = next.id;
        render();
        shapes.find((item) => item.dataset.areaId === next.id)?.focus();
      }
    });
  });

  root.querySelectorAll<HTMLButtonElement>("[data-layer]").forEach((button) => button.addEventListener("click", () => { state.layer = button.dataset.layer as "grid" | "places"; render(); }));
  root.querySelectorAll<HTMLButtonElement>("[data-view]").forEach((button) => button.addEventListener("click", () => { state.view = button.dataset.view as "map" | "table"; stopPlayback(); render(); }));
  monthInput.addEventListener("input", () => { state.month = Number(monthInput.value); render(); });
  playButton.addEventListener("click", () => {
    if (timer !== null) { stopPlayback(); return; }
    playButton.setAttribute("aria-pressed", "true");
    playButton.textContent = `❚❚ ${copy.pause}`;
    timer = setInterval(() => { state.month = state.month % 12 + 1; render(); }, 900);
  });
  document.addEventListener("visibilitychange", () => { if (document.hidden) stopPlayback(); });
  root.querySelectorAll<HTMLButtonElement>("[data-zoom]").forEach((button) => button.addEventListener("click", () => { state.zoom = Math.max(1, Math.min(2, Math.round((state.zoom + (button.dataset.zoom === "in" ? 0.2 : -0.2)) * 10) / 10)); render(); }));
  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const query = normalize(searchInput.value);
    const match = demoPlaces.find((place) => normalize(place.name) === query) ?? demoPlaces.find((place) => normalize(place.name).includes(query) || normalize(place.comarca).includes(query));
    if (!query || !match) { searchStatus.textContent = copy.searchMiss; return; }
    searchStatus.textContent = "";
    searchInput.value = match.name;
    state.area = match.id;
    state.layer = "places";
    state.view = "map";
    render();
  });
  tableFilter.addEventListener("input", updateTable);
  root.querySelectorAll<HTMLButtonElement>("[data-sort]").forEach((button) => button.addEventListener("click", () => {
    const key = button.dataset.sort as typeof sortKey;
    if (sortKey === key) sortDirection *= -1;
    else { sortKey = key; sortDirection = 1; }
    updateTable();
  }));
  render();
}
