const base = import.meta.env.BASE_URL.replace(/\/?$/, "/");
const key = "hmip-explore-language";

document.querySelectorAll<HTMLAnchorElement>(".language-switcher a[lang]").forEach((link) => {
  link.addEventListener("click", () => {
    try { localStorage.setItem(key, link.lang); } catch { /* Browser storage may be unavailable. */ }
  });
});

if (window.location.pathname === base) {
  let saved: string | null = null;
  try { saved = localStorage.getItem(key); } catch { /* Use browser language. */ }
  const preferred = saved || navigator.languages.find((language) => /^(ca|es|en)(-|$)/i.test(language))?.slice(0, 2).toLowerCase();
  if (preferred === "es" || preferred === "en") {
    window.location.replace(`${base}${preferred}/${window.location.search}${window.location.hash}`);
  }
}
