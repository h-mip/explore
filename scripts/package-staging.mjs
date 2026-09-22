import { access, cp, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join, relative, sep } from 'node:path';

const source = fileURLToPath(new URL('../dist/', import.meta.url));
const target = fileURLToPath(new URL('../staging-dist/', import.meta.url));
const downloads = new Set(['data/layer_h3.csv', 'data/layer_municipality.csv', 'data/layers.csv']);

try {
  await access(target);
  throw new Error('staging-dist already exists; use a clean checkout for packaging');
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

await cp(source, target, {
  recursive: true,
  filter: (path) => {
    const name = relative(source, path).split(sep).join('/');
    if (name === 'generated' || name.startsWith('generated/')) return false;
    if (name.startsWith('data/') && !downloads.has(name)) return false;
    return true;
  },
});
await writeFile(join(target, '_headers'), '/*\n  X-Robots-Tag: noindex, nofollow\n');

console.log('Prepared staging-dist with only the three linked draft CSV downloads.');
