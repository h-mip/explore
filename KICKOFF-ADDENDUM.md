# H-MIP Bites Phase 1: kick-off addendum to spec v1.2

**Date:** 22 September 2026 · **For:** Escala Development S.L. · **From:** John Palmer (H-MIP)

Only two points differ from *Phase 1 Specifications for Quotation v1.2*: the web address, and the removal of some content. Everything else is as specified.

## 1. Web address: `h-mip.com/explore` (TECH-07)

- The site is a GitHub Pages **project site** in the `h-mip` organisation, in a repository named **`explore`**. The organisation site (`h-mip/h-mip.github.io`) already serves `https://h-mip.com`, so the repository is published automatically at **`https://h-mip.com/explore/`**. The main site already has an "Explore" link waiting for this content.
- The repository must be created in the **h-mip organisation** (not in a contractor account), and its name must not change after launch, because it is the URL.
- A path replaces the subdomain in TECH-07, so no DNS work is needed. The site must be configured for the base path (e.g. Astro `site: 'https://h-mip.com'`, `base: '/explore'`), so that all links, assets, per-language URLs (`/explore/ca/…`, `/explore/es/…`, `/explore/en/…`), `hreflang` links and the sitemap include it.
- **Staging (TECH-06):** a second repository, `explore-staging` → `https://h-mip.com/explore-staging/`. It is public, so it must carry a `noindex` meta tag and be kept out of the sitemap.

## 2. No prevention advice on the site

The site presents project results only. It gives no advice.

- **HOME-02:** only the "help science" call to action linking to Mosquito Alert remains. The "protect yourself" section is removed.
- **ACT-03:** each activity and place type keeps its short description (from `taxonomy.csv`), with no prevention tips. The "Activities and tips" / "Places and tips" sections of the prototype become simple descriptions of the categories, or can be dropped if the charts already make them clear.
- **Data:** `tips.csv` is dropped from Appendix A.
- **Prototype and stories:** ignore the tips in the prototype and in its placeholder stories.
- **Unchanged:** the charts of bites by activity and by place type (ACT-01, ACT-02, ACT-04).
