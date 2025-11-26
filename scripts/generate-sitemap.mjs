import { promises as fs } from 'node:fs';
import path from 'node:path';

const SITE_URL = 'https://www.lumiso.app';

const STATIC_PATHS = ['/'];

const buildUrlEntry = (route) => `
  <url>
    <loc>${SITE_URL.replace(/\/$/, '')}${route}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${route === '/' ? '1.0' : '0.6'}</priority>
  </url>`;

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${STATIC_PATHS.map(buildUrlEntry).join('\n')}
</urlset>
`;

const outputPath = path.join(process.cwd(), 'public', 'sitemap.xml');
await fs.writeFile(outputPath, sitemap.trim() + '\n', 'utf8');
console.log(`Generated ${outputPath}`);
