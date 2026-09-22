import { demoCells, demoPlaces, draftLevel, draftMeta, formatProbability, levelForScore, mapContent, palette, scoreForBase, type DemoCell, type MapLocale } from "../data/map";

type Layer = "grid" | "draft" | "places";
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
  const requestedLayer = params.get("layer");
  const state = {
    layer: (["grid", "draft", "places"].includes(requestedLayer ?? "") ? requestedLayer : "grid") as Layer,
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
  const searchResults = find<HTMLElement>("[data-place-search] [role=listbox]");
  const searchClear = find<HTMLButtonElement>("[data-search-clear]");
  const searchStatus = find<HTMLElement>("[data-search-status]");
  const tableFilter = find<HTMLInputElement>("[data-table-filter]");
  const tableBody = find<HTMLTableSectionElement>("tbody");
  let sortKey: "name" | "comarca" | "score" = "name";
  let sortDirection = 1;
  let timer: ReturnType<typeof setInterval> | null = null;
  type SearchResult = { kind: "place" | "cell"; id: string; label: string; detail: string };
  let suggestions: SearchResult[] = [];
  let activeSuggestion = -1;

  const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase(locale).trim();
  const isDraft = () => state.layer === "draft";
  const cellValue = (cell: DemoCell, month: number) => isDraft() ? cell.draft.months[month - 1] : scoreForBase(cell.base, month);
  const level = (value: number) => isDraft() ? draftLevel(value) : levelForScore(value);
  const format = (value: number) => isDraft() ? formatProbability(value) : `${value} / 100`;
  const activeShape = () => shapes.find((shape) => shape.dataset.areaId === state.area);

  function searchMatches(rawQuery: string): SearchResult[] {
    const query = normalize(rawQuery);
    const rank = (name: string, detail: string) => {
      const primary = normalize(name);
      const secondary = normalize(detail);
      return primary === query ? 0 : primary.startsWith(query) ? 1 : primary.includes(query) ? 2 : secondary.includes(query) ? 3 : 4;
    };
    const places: SearchResult[] = demoPlaces
      .filter((place) => !query || normalize(`${place.name} ${place.comarca}`).includes(query))
      .sort((a, b) => rank(a.name, a.comarca) - rank(b.name, b.comarca) || a.name.localeCompare(b.name, locale))
      .map((place) => ({ kind: "place", id: place.id, label: place.name, detail: place.comarca }));
    const h3Query = query.replace(/^h3\s*/, "");
    const cells: SearchResult[] = h3Query.length >= 3 && /^[0-9a-f]+$/.test(h3Query)
      ? demoCells.filter((cell) => cell.id.startsWith(h3Query) || cell.id.includes(h3Query))
        .sort((a, b) => rank(a.id, a.near) - rank(b.id, b.near) || a.id.localeCompare(b.id))
        .map((cell) => ({ kind: "cell", id: cell.id, label: `H3 ${cell.id}`, detail: `${copy.searchNear} ${cell.near}` }))
      : [];
    return query ? [...places, ...cells].slice(0, 7) : places;
  }

  function closeSuggestions() {
    searchResults.hidden = true;
    searchInput.setAttribute("aria-expanded", "false");
    searchInput.removeAttribute("aria-activedescendant");
    suggestions = [];
    activeSuggestion = -1;
  }

  function setActiveSuggestion(index: number) {
    activeSuggestion = index;
    searchResults.querySelectorAll<HTMLElement>("[role=option]").forEach((option, optionIndex) => {
      option.setAttribute("aria-selected", String(optionIndex === index));
      if (optionIndex === index) option.scrollIntoView({ block: "nearest" });
    });
    if (index >= 0) searchInput.setAttribute("aria-activedescendant", `map-search-option-${index}`);
    else searchInput.removeAttribute("aria-activedescendant");
  }

  function selectSuggestion(result: SearchResult) {
    if (result.kind === "place") {
      const place = demoPlaces.find((item) => item.id === result.id)!;
      state.area = state.layer === "places" ? place.id : demoCells.reduce((nearest, cell) =>
        (cell.x - place.x) ** 2 + (cell.y - place.y) ** 2 < (nearest.x - place.x) ** 2 + (nearest.y - place.y) ** 2 ? cell : nearest,
      ).id;
      searchInput.value = place.name;
    } else {
      state.area = result.id;
      if (state.layer === "places") state.layer = "draft";
      searchInput.value = result.id;
    }
    searchClear.hidden = false;
    searchStatus.textContent = "";
    state.view = "map";
    closeSuggestions();
    render();
  }

  function showSuggestions() {
    searchClear.hidden = !searchInput.value;
    suggestions = searchMatches(searchInput.value);
    searchResults.replaceChildren();
    if (!suggestions.length) { closeSuggestions(); return; }
    suggestions.forEach((result, index) => {
      const option = document.createElement("button");
      option.type = "button";
      option.id = `map-search-option-${index}`;
      option.setAttribute("role", "option");
      option.setAttribute("aria-selected", "false");
      const title = document.createElement("strong");
      title.textContent = result.label;
      const detail = document.createElement("small");
      detail.textContent = result.detail;
      option.append(title, detail);
      option.addEventListener("pointerenter", () => setActiveSuggestion(index));
      option.addEventListener("click", () => selectSuggestion(result));
      searchResults.append(option);
    });
    searchResults.hidden = false;
    searchInput.setAttribute("aria-expanded", "true");
    setActiveSuggestion(-1);
  }

  function stopPlayback() {
    if (timer !== null) clearInterval(timer);
    timer = null;
    playButton.setAttribute("aria-pressed", "false");
    playButton.textContent = `▶ ${copy.play}`;
  }

  function updateUrl() {
    const query = new URLSearchParams({ layer: state.layer, month: String(state.month), area: state.area, view: state.view });
    if (state.zoom > 1) query.set("zoom", state.zoom.toFixed(1));
    const currentUrl = new URL(window.location.href);
    currentUrl.search = query.toString();
    window.history.replaceState(null, "", currentUrl.href);
    document.querySelectorAll<HTMLAnchorElement>(".language-switcher a[lang]").forEach((link) => {
      const targetUrl = new URL(link.href);
      targetUrl.search = query.toString();
      link.href = `${targetUrl.pathname}${targetUrl.search}${targetUrl.hash}`;
    });
  }

  function updateTable() {
    if (state.view !== "table") return;
    const grid = state.layer !== "places";
    const filter = normalize(tableFilter.value);
    const rows = grid
      ? demoCells.map((cell) => ({ id: cell.id, name: cell.near, comarca: cell.id, score: cellValue(cell, state.month) }))
      : demoPlaces.map((place) => ({ id: place.id, name: place.name, comarca: place.comarca, score: scoreForBase(place.base, state.month) }));
    const sorted = rows.filter((row) => !filter || normalize(`${row.name} ${row.comarca}`).includes(filter))
      .sort((a, b) => (sortKey === "score" ? a.score - b.score : a[sortKey].localeCompare(b[sortKey], locale)) * sortDirection);
    const fragment = document.createDocumentFragment();
    for (const row of sorted) {
      const tr = document.createElement("tr");
      tr.dataset.rowId = row.id;
      const th = document.createElement("th");
      th.scope = "row";
      th.textContent = row.name;
      const area = document.createElement("td");
      area.textContent = row.comarca;
      const value = document.createElement("td");
      value.className = "num";
      value.textContent = isDraft() ? formatProbability(row.score) : String(row.score);
      tr.append(th, area, value);
      fragment.append(tr);
    }
    tableBody.replaceChildren(fragment);
    const caption = state.layer === "draft" ? copy.draftTableCaption : grid ? copy.gridTableCaption : copy.tableCaption;
    find<HTMLElement>("[data-table-caption]").textContent = `${caption} ${copy.months[state.month - 1]} · ${sorted.length} ${grid ? sorted.length === 1 ? copy.cellRowSingular : copy.cellRows : sorted.length === 1 ? copy.rowSingular : copy.rows}`;
    find<HTMLElement>("[data-empty-table]").hidden = sorted.length > 0;
    find<HTMLElement>("[data-empty-table]").textContent = grid ? copy.emptyCells : copy.emptyTable;
    tableFilter.placeholder = grid ? copy.h3FilterPlaceholder : copy.searchPlaceholder;
    find<HTMLElement>("[data-table-filter-label]").textContent = grid ? copy.cellFilter : copy.tableFilter;
    const headers = [grid ? copy.nearbyColumn : copy.municipality, grid ? copy.h3Column : copy.comarca, isDraft() ? copy.probabilityColumn : copy.index];
    root.querySelectorAll<HTMLButtonElement>("[data-sort]").forEach((button, index) => {
      button.textContent = `${headers[index]} ↕`;
      button.setAttribute("aria-label", `${copy.sort} ${headers[index]}`);
    });
    find<HTMLElement>("[data-table-panel]").setAttribute("aria-label", `${caption} ${copy.months[state.month - 1]}`);
  }

  function render() {
    if (state.layer !== "places" && demoPlaces.some((place) => place.id === state.area)) {
      const place = demoPlaces.find((item) => item.id === state.area)!;
      state.area = demoCells.reduce((nearest, cell) => (cell.x - place.x) ** 2 + (cell.y - place.y) ** 2 < (nearest.x - place.x) ** 2 + (nearest.y - place.y) ** 2 ? cell : nearest).id;
    }
    if (state.layer === "places" && demoCells.some((cell) => cell.id === state.area)) {
      const cell = demoCells.find((item) => item.id === state.area)!;
      state.area = demoPlaces.reduce((nearest, place) => (place.x - cell.x) ** 2 + (place.y - cell.y) ** 2 < (nearest.x - cell.x) ** 2 + (nearest.y - cell.y) ** 2 ? place : nearest).id;
    }
    const draft = isDraft();
    const gridVisible = state.layer !== "places";
    gridLayer.setAttribute("display", gridVisible ? "inline" : "none");
    placesLayer.setAttribute("display", gridVisible ? "none" : "inline");
    gridLayer.setAttribute("aria-hidden", String(!gridVisible));
    placesLayer.setAttribute("aria-hidden", String(gridVisible));
    root.querySelectorAll<HTMLButtonElement>("[data-layer]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.layer === state.layer)));
    find<HTMLElement>("[data-layer-hint]").textContent = state.layer === "draft" ? copy.draftHint : state.layer === "grid" ? copy.gridHint : copy.placesHint;
    find<HTMLElement>("[data-map-badge]").textContent = draft ? copy.draftBadge : copy.badge;
    find<HTMLElement>("[data-map-caption]").textContent = draft ? copy.draftSchematic : copy.schematic;
    find<SVGElement>("[data-map-svg]").setAttribute("aria-label", draft ? copy.draftMapAria : copy.mapAria);
    find<HTMLElement>("[data-bottom-note]").textContent = draft ? `${copy.draftBadge} · ${copy.draftSchematic}` : `${copy.badge} · ${copy.schematic}`;
    find<HTMLElement>("[data-legend-title]").textContent = draft ? copy.draftLegendTitle : copy.legendTitle;
    find<HTMLElement>("[data-legend-note]").textContent = draft ? copy.draftLegendNote : copy.legendNote;
    const breaks = draftMeta.classBreaks;
    const draftRanges = [`<${breaks[0]}%`, ...breaks.slice(0, -1).map((value, index) => `${value}–<${breaks[index + 1]}%`), `≥${breaks.at(-1)}%`];
    find<HTMLElement>("[data-legend-labels]").querySelectorAll("span").forEach((label, index) => { label.textContent = draft ? draftRanges[index] : copy.levels[index]; });
    find<HTMLElement>("[data-legend-breaks]").hidden = draft;
    find<HTMLElement>("[data-legend-breaks]").textContent = "0–19 · 20–39 · 40–59 · 60–79 · 80–100";
    find<HTMLElement>("[data-method-text]").textContent = draft ? copy.draftMethodText : copy.methodText;
    find<HTMLElement>("[data-method-title]").textContent = draft ? copy.draftMethodTitle : copy.methodTitle;
    find<HTMLElement>("[data-profile-note]").textContent = draft ? copy.draftProfileNote : copy.peak;

    shapes.forEach((shape) => {
      const cell = demoCells.find((item) => item.id === shape.dataset.areaId);
      const score = cell ? cellValue(cell, state.month) : scoreForBase(Number(shape.dataset.base), state.month);
      shape.setAttribute("fill", palette[cell ? level(score) : levelForScore(score)]);
      shape.setAttribute("tabindex", shape.dataset.areaId === state.area ? "0" : "-1");
      shape.classList.toggle("is-selected", shape.dataset.areaId === state.area);
      const label = cell ? `H3 ${cell.id} · ${copy.near} ${cell.near}` : shape.dataset.near;
      shape.setAttribute("aria-label", `${label}: ${cell ? format(score) : `${score} ${copy.valueUnit}`}`);
      shape.setAttribute("data-tooltip", `${label} · ${copy.months[state.month - 1]}: ${cell ? format(score) : `${score} / 100`}`);
      const title = shape.querySelector("title");
      title?.remove();
    });

    const selected = activeShape();
    if (selected) {
      const cell = demoCells.find((item) => item.id === selected.dataset.areaId);
      const score = cell ? cellValue(cell, state.month) : scoreForBase(Number(selected.dataset.base), state.month);
      find<HTMLElement>("[data-selected-name]").textContent = cell ? `H3 ${cell.id} · ${copy.near} ${cell.near}` : selected.dataset.near ?? "";
      find<HTMLElement>("[data-selected-reading]").textContent = `${copy.months[state.month - 1]} · ${draft && cell ? draftRanges[level(score)] : copy.levels[levelForScore(score)]}`;
      find<HTMLElement>("[data-selected-score]").textContent = cell ? format(score) : `${score} / 100`;
      find<HTMLElement>("[data-selected-note]").textContent = draft && cell ? `${copy.draftSelectedNote} (${cell.draft.count} ${cell.draft.count === 1 ? copy.sourceCellSingular : copy.sourceCells})` : copy.selectedNote;
      const confidence = find<HTMLElement>("[data-confidence]");
      confidence.hidden = !(draft && cell);
      if (draft && cell) confidence.textContent = `${copy.confidenceLabel}: ${copy.confidenceLevels[0]} ${cell.draft.confidence.low} · ${copy.confidenceLevels[1]} ${cell.draft.confidence.medium} · ${copy.confidenceLevels[2]} ${cell.draft.confidence.high}`;
      const profile = cell ? Array.from({ length: 12 }, (_, index) => cellValue(cell, index + 1)) : Array.from({ length: 12 }, (_, index) => scoreForBase(Number(selected.dataset.base), index + 1));
      const peak = draft && cell ? Math.max(...profile) : 100;
      find<HTMLElement>("[data-profile]").querySelectorAll<HTMLElement>("span").forEach((mark, index) => {
        const bar = mark.querySelector("i")!;
        bar.style.height = `${Math.max(2, profile[index] / peak * 100)}%`;
        const label = `${copy.months[index]}: ${draft && cell ? formatProbability(profile[index]) : `${profile[index]} / 100`}`;
        mark.setAttribute("aria-label", label);
        mark.setAttribute("data-tooltip", label);
      });
    }

    monthInput.value = String(state.month);
    find<HTMLElement>("[data-month-name]").textContent = copy.months[state.month - 1];
    root.querySelectorAll<HTMLElement>(".month-ticks span").forEach((tick, index) => tick.classList.toggle("active", index === state.month - 1));
    mapContentGroup.setAttribute("transform", `translate(395 365) scale(${state.zoom}) translate(-395 -365)`);
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
      if (event.key === "Enter" || event.key === " ") { event.preventDefault(); select(); return; }
      if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) return;
      event.preventDefault();
      const current = state.layer === "places" ? demoPlaces.find((item) => item.id === state.area) : demoCells.find((cell) => cell.id === state.area);
      if (!current) return;
      const options = state.layer === "places" ? demoPlaces : demoCells;
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
      if (next) { state.area = next.id; render(); shapes.find((item) => item.dataset.areaId === next.id)?.focus(); }
    });
  });

  root.querySelectorAll<HTMLButtonElement>("[data-layer]").forEach((button) => button.addEventListener("click", () => { state.layer = button.dataset.layer as Layer; render(); }));
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
  searchInput.addEventListener("focus", showSuggestions);
  searchInput.addEventListener("click", showSuggestions);
  searchInput.addEventListener("input", () => { searchStatus.textContent = ""; showSuggestions(); });
  searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Escape") { closeSuggestions(); return; }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (searchResults.hidden) showSuggestions();
      if (suggestions.length) setActiveSuggestion((activeSuggestion + (event.key === "ArrowDown" ? 1 : -1) + suggestions.length) % suggestions.length);
    }
    if (event.key === "Enter" && !searchResults.hidden && activeSuggestion >= 0) {
      event.preventDefault();
      selectSuggestion(suggestions[activeSuggestion]);
    }
  });
  searchClear.addEventListener("click", () => { searchInput.value = ""; searchClear.hidden = true; searchStatus.textContent = ""; searchInput.focus(); showSuggestions(); });
  document.addEventListener("pointerdown", (event) => { if (!searchForm.contains(event.target as Node)) closeSuggestions(); });
  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!searchInput.value.trim()) { searchInput.focus(); showSuggestions(); return; }
    const match = searchMatches(searchInput.value)[0];
    if (match) selectSuggestion(match);
    else { closeSuggestions(); searchStatus.textContent = copy.searchMiss; }
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
