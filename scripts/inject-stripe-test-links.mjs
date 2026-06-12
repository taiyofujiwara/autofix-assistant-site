#!/usr/bin/env node
// inject-stripe-test-links.mjs
// Syncs ops/stripe/links.json TEST Autofix link_url values into site/index.html's inline JSON block
// Usage: node site/scripts/inject-stripe-test-links.mjs [path/to/links.json] [path/to/index.html]

import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const linksPath = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.resolve(__dirname, '../../ops/stripe/links.json');
const htmlPath = process.argv[3]
  ? path.resolve(process.argv[3])
  : path.resolve(__dirname, '../index.html');

function get(obj, p, d) {
  return p.split('.').reduce((o, k) => (o && o[k] != null ? o[k] : undefined), obj) ?? d;
}

function buildMinimalConfig(links) {
  const base = get(links, 'test.autofix', {});
  const out = {
    test: {
      autofix: {
        setup: { link_url: get(base, 'setup.link_url', '') || '' },
        tiers: {
          tier_a: { link_url: get(base, 'tiers.tier_a.link_url', '') || '' },
          tier_b: { link_url: get(base, 'tiers.tier_b.link_url', '') || '' },
          tier_c: { link_url: get(base, 'tiers.tier_c.link_url', '') || '' }
        }
      }
    }
  };
  return out;
}

function replaceInlineJson(html, jsonStr) {
  const re = /(<script id="stripe-test-links"[^>]*>)([\s\S]*?)(<\/script>)/;
  if (!re.test(html)) {
    throw new Error('Could not find <script id="stripe-test-links" ...> block in index.html');
  }
  return html.replace(re, (_, openTag, _old, closeTag) => `${openTag}${jsonStr}${closeTag}`);
}

try {
  if (!fs.existsSync(linksPath)) throw new Error(`links.json not found at ${linksPath}`);
  if (!fs.existsSync(htmlPath)) throw new Error(`index.html not found at ${htmlPath}`);

  const links = JSON.parse(fs.readFileSync(linksPath, 'utf8'));
  const mini = buildMinimalConfig(links);
  const jsonStr = JSON.stringify(mini);

  const html = fs.readFileSync(htmlPath, 'utf8');
  const updated = replaceInlineJson(html, jsonStr);
  if (updated === html) {
    console.log('No changes made (content identical).');
  } else {
    fs.writeFileSync(htmlPath, updated, 'utf8');
    console.log('Injected TEST Stripe links into index.html successfully.');
  }
} catch (err) {
  console.error(`[inject-stripe-test-links] Error:`, err.message);
  process.exit(1);
}

