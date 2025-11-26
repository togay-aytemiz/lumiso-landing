import { marked } from 'marked';

export type LegalDoc = {
  id: string;
  slug: string;
  version: string;
  lastUpdated: string;
  title: string;
  html: string;
};

export const preferredOrder = ['terms', 'privacy', 'kvkk', 'cookie-policy', 'communication-consent', 'dpa'];

const rawDocs = import.meta.glob('../legal/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});

const parseFrontmatter = (raw: string) => {
  const match = raw.match(/^---\s*[\r\n]+([\s\S]*?)\r?\n---\s*[\r\n]*/);
  if (!match) return { data: {}, content: raw };

  const fm = match[1]
    .split(/\r?\n/)
    .filter(Boolean)
    .reduce<Record<string, string>>((acc, line) => {
      const [key, ...rest] = line.split(':');
      if (!key || rest.length === 0) return acc;
      const value = rest.join(':').trim().replace(/^"+|"+$/g, '').replace(/^'+|'+$/g, '');
      acc[key.trim()] = value;
      return acc;
    }, {});

  const content = raw.slice(match[0].length);
  return { data: fm, content };
};

const parsedDocs: LegalDoc[] = Object.entries(rawDocs)
  .filter(([path]) => !path.endsWith('README.md'))
  .map(([path, raw]) => {
    const { data, content } = parseFrontmatter(raw as string);
    const id = (data.id as string | undefined)?.trim();
    if (!id) {
      throw new Error(`Missing "id" in frontmatter for ${path}`);
    }

    const version = (data.version as string | undefined)?.trim() ?? '';
    const lastUpdated = (data.last_updated as string | undefined)?.trim() ?? '';
    const title = (data.document_title as string | undefined)?.trim() ?? id;

    let body = content.trimStart();
    body = body.replace(/^\s*# [^\n]+\s*\n+/, '').trimStart();

    const html = marked.parse(body) as string;

    return {
      id,
      slug: id,
      version,
      lastUpdated,
      title,
      html,
    };
  })
  .sort((a, b) => {
    const aIndex = preferredOrder.indexOf(a.slug);
    const bIndex = preferredOrder.indexOf(b.slug);
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    return a.title.localeCompare(b.title, 'tr');
  });

export const legalDocs = parsedDocs;
export const legalDocSlugs = new Set(parsedDocs.map((doc) => doc.slug));

export const legalManifest = parsedDocs.reduce<Record<string, { version: string; last_updated: string }>>(
  (acc, doc) => {
    acc[doc.slug] = { version: doc.version, last_updated: doc.lastUpdated };
    return acc;
  },
  {}
);

export const getLegalDoc = (slug: string) => parsedDocs.find((doc) => doc.slug === slug);
