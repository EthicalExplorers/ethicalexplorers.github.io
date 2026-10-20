/**
 * Ethical Explorers — Automatic Sitemap Generator
 * Automatically syncs all static pages and dynamic blog posts from data/posts.json into sitemap.xml
 * for Google Search Console and other search engines.
 * 
 * Also generates a sitemap_index.xml wrapper for better Google Search Console compatibility.
 */

const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://ethicalexplorers.github.io';
const ROOT_DIR = path.resolve(__dirname, '..');
const POSTS_PATH = path.join(ROOT_DIR, 'data', 'posts.json');
const SITEMAP_PATH = path.join(ROOT_DIR, 'sitemap.xml');
const SITEMAP_INDEX_PATH = path.join(ROOT_DIR, 'sitemap_index.xml');

// Current date formatted as YYYY-MM-DD
const today = new Date().toISOString().split('T')[0];

// Static Core Pages (Google-compliant URLs without fragment # hashes)
const staticPages = [
  { path: '', priority: '1.0', changefreq: 'daily' },
  { path: '?p=blog', priority: '0.9', changefreq: 'daily' },
  { path: '?p=labs', priority: '0.85', changefreq: 'weekly' },
  { path: '?p=videos', priority: '0.8', changefreq: 'weekly' },
  { path: '?p=about', priority: '0.7', changefreq: 'monthly' },
  { path: '?p=contact', priority: '0.6', changefreq: 'monthly' },
  { path: '?p=privacy', priority: '0.3', changefreq: 'yearly' },
  { path: '?p=terms', priority: '0.3', changefreq: 'yearly' },
  { path: '?p=disclaimer', priority: '0.3', changefreq: 'yearly' }
];

/**
 * Escape special XML characters in URLs
 */
function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function generateSitemap() {
  console.log('⚡ Generating sitemap for Ethical Explorers...');

  let posts = [];
  try {
    if (fs.existsSync(POSTS_PATH)) {
      const data = fs.readFileSync(POSTS_PATH, 'utf8');
      posts = JSON.parse(data);
      console.log(`✓ Loaded ${posts.length} blog articles from data/posts.json`);
    } else {
      console.warn('! data/posts.json not found, using static pages only.');
    }
  } catch (err) {
    console.error('Error reading data/posts.json:', err.message);
  }

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  // 1. Add Static Pages
  staticPages.forEach(page => {
    const loc = page.path ? `${SITE_URL}/${page.path}` : `${SITE_URL}/`;
    xml += '  <url>\n';
    xml += `    <loc>${escapeXml(loc)}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += '  </url>\n';
  });

  // 2. Add Dynamic Blog Posts (Google-compliant query route)
  posts.forEach(post => {
    const postDate = post.date || today;
    const postSlug = encodeURIComponent(post.id || post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'));

    xml += '  <url>\n';
    xml += `    <loc>${escapeXml(`${SITE_URL}/?p=blog/${postSlug}`)}</loc>\n`;
    xml += `    <lastmod>${postDate}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.8</priority>\n`;
    xml += '  </url>\n';
  });

  xml += '</urlset>\n';

  // Write main sitemap.xml
  fs.writeFileSync(SITEMAP_PATH, xml, 'utf8');
  console.log(`✅ Updated sitemap.xml with ${staticPages.length + posts.length} total URLs`);

  // 3. Generate sitemap_index.xml wrapper (better GSC compatibility)
  let indexXml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  indexXml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  indexXml += '  <sitemap>\n';
  indexXml += `    <loc>${SITE_URL}/sitemap.xml</loc>\n`;
  indexXml += `    <lastmod>${today}</lastmod>\n`;
  indexXml += '  </sitemap>\n';
  indexXml += '</sitemapindex>\n';

  fs.writeFileSync(SITEMAP_INDEX_PATH, indexXml, 'utf8');
  console.log(`✅ Updated sitemap_index.xml (wrapper for GSC)`);
}

generateSitemap();
