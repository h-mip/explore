import { readdir, readFile } from 'node:fs/promises';

const root = new URL('../staging-dist/', import.meta.url);
const files = await readdir(root, { recursive: true });
const pages = files.filter((file) => file.endsWith('.html'));
if (pages.length !== 18) throw new Error(`Expected 18 staging pages, found ${pages.length}`);
if (files.some((file) => /(^|\/)sitemap.*\.xml$/.test(file))) {
  throw new Error('Staging must not publish a sitemap');
}
const headers = await readFile(new URL('_headers', root), 'utf8');
if (!headers.includes('X-Robots-Tag: noindex, nofollow')) {
  throw new Error('Staging must send a noindex header');
}

for (const file of pages) {
  const html = await readFile(new URL(file, root), 'utf8');
  if (!/<meta name="robots" content="noindex, nofollow"\s*\/?>/.test(html)) {
    throw new Error(`${file} lacks the staging noindex tag`);
  }
  if (/\b(?:href|src)="\/explore\//.test(html)) {
    throw new Error(`${file} still links to the production base path`);
  }
}

for (const path of ['data/layer_h3.csv', 'data/layer_municipality.csv', 'data/layers.csv']) {
  if (!files.includes(path)) throw new Error(`Missing staging download: ${path}`);
}
const publicCsvs = files.filter((file) => file.startsWith('data/') && file.endsWith('.csv'));
if (publicCsvs.length !== 3 || files.some((file) => file.startsWith('generated/'))) {
  throw new Error('Staging includes obsolete public prototype data');
}

console.log(`Checked ${pages.length} noindex staging pages and all three CSV downloads.`);
