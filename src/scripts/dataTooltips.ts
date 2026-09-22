// One tooltip for chart and map marks. Values come from the mark's current data-tooltip attribute.
const tooltip = document.createElement("div");
tooltip.id = "data-tooltip";
tooltip.className = "data-tooltip";
tooltip.setAttribute("role", "tooltip");
tooltip.hidden = true;
document.body.append(tooltip);

let active: Element | null = null;

function position() {
  if (!active || tooltip.hidden) return;
  const anchor = active.getBoundingClientRect();
  const box = tooltip.getBoundingClientRect();
  const left = Math.max(8, Math.min(window.innerWidth - box.width - 8, anchor.left + anchor.width / 2 - box.width / 2));
  const above = anchor.top - box.height - 10;
  tooltip.style.left = `${left}px`;
  tooltip.style.top = `${above >= 8 ? above : Math.min(window.innerHeight - box.height - 8, anchor.bottom + 10)}px`;
}

function hide() {
  active = null;
  tooltip.hidden = true;
}

function show(target: Element) {
  const value = target.getAttribute("data-tooltip");
  if (!value) return;
  if (active !== target) {
    hide();
    active = target;
  }
  tooltip.textContent = value;
  tooltip.hidden = false;
  position();
}

const markFor = (target: EventTarget | null) => target instanceof Element ? target.closest("[data-tooltip]") : null;

document.addEventListener("pointerover", (event) => {
  const mark = markFor(event.target);
  if (mark) show(mark);
});
document.addEventListener("pointerout", (event) => {
  if (active && event.relatedTarget instanceof Node && active.contains(event.relatedTarget)) return;
  if (markFor(event.target) === active) hide();
});
document.addEventListener("focusin", (event) => {
  const mark = markFor(event.target);
  if (mark) show(mark);
});
document.addEventListener("focusout", (event) => {
  if (markFor(event.target) === active) hide();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") hide();
  if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
  const target = markFor(event.target);
  const group = target?.closest("[data-tooltip-group]");
  if (!target || !group) return;
  const marks = [...group.querySelectorAll<HTMLElement | SVGElement>("[data-tooltip]")];
  const current = marks.indexOf(target as HTMLElement | SVGElement);
  if (current < 0) return;
  event.preventDefault();
  const next = event.key === "Home" ? 0 : event.key === "End" ? marks.length - 1
    : (current + (["ArrowRight", "ArrowDown"].includes(event.key) ? 1 : -1) + marks.length) % marks.length;
  marks[current].setAttribute("tabindex", "-1");
  marks[next].setAttribute("tabindex", "0");
  (marks[next] as HTMLElement).focus();
});
window.addEventListener("scroll", position, true);
window.addEventListener("resize", position);
