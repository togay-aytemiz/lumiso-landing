import { promises as fs } from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const ROOT = process.cwd();
const LEGAL_DIR = path.join(ROOT, 'legal');
const OUTPUT_PATH = path.join(ROOT, 'public', 'legal_versions.json');
const PREFERRED_ORDER = ['terms', 'privacy', 'kvkk', 'cookie-policy', 'communication-consent', 'dpa'];

const readLegalFiles = async () => {
  const entries = await fs.readdir(LEGAL_DIR);
  const markdownFiles = entries.filter((file) => file.endsWith('.md') && file !== 'README.md');

  const docs = [];

  for (const file of markdownFiles) {
    const fullPath = path.join(LEGAL_DIR, file);
    const raw = await fs.readFile(fullPath, 'utf8');
    const { data } = matter(raw);

    const id = (data.id ?? '').trim();
    const version = (data.version ?? '').trim();
    const lastUpdated = (data.last_updated ?? '').trim();

    if (!id || !version || !lastUpdated) {
      throw new Error(`Missing required frontmatter fields in ${file}. Needed: id, version, last_updated.`);
    }

    docs.push({ id, version, last_updated: lastUpdated });
  }

  docs.sort((a, b) => {
    const aIndex = PREFERRED_ORDER.indexOf(a.id);
    const bIndex = PREFERRED_ORDER.indexOf(b.id);
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    return a.id.localeCompare(b.id, 'tr');
  });

  return docs;
};

const buildManifest = (docs) =>
  docs.reduce((acc, doc) => {
    acc[doc.id] = { version: doc.version, last_updated: doc.last_updated };
    return acc;
  }, {});

const main = async () => {
  const docs = await readLegalFiles();
  const manifest = buildManifest(docs);

  await fs.mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
  await fs.writeFile(OUTPUT_PATH, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  console.log(`Generated ${OUTPUT_PATH}`);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
