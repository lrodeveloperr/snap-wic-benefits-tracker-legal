import fs from "node:fs";
import path from "node:path";

const repositoryRoot = path.resolve(import.meta.dirname, "..");
const siteDirectory = "site-source";
const siteRoot = path.join(repositoryRoot, siteDirectory);
const canonicalBase =
  "https://lrodeveloperr.github.io/grocery-benefits-tracker/";
const legacyBrand = /SNAP[\u2010-\u2015-]EBT\s*(?:&|&amp;)?\s*WIC Benefits Tracker/i;
const legacySlug = "snap-wic-benefits-tracker-legal";
const expectedPages = {
  "index.html": "",
  "privacy/index.html": "privacy/",
  "terms/index.html": "terms/",
  "support/index.html": "support/",
  "official-sources/index.html": "official-sources/",
  "delete-data/index.html": "delete-data/",
  "es/index.html": "es/",
  "es/privacidad/index.html": "es/privacidad/",
  "es/terminos/index.html": "es/terminos/",
  "es/soporte/index.html": "es/soporte/",
  "es/fuentes-oficiales/index.html": "es/fuentes-oficiales/",
  "es/eliminar-datos/index.html": "es/eliminar-datos/",
};
const failures = [];

function fail(message) {
  failures.push(message);
}

function read(relativePath) {
  return fs.readFileSync(path.join(repositoryRoot, relativePath), "utf8");
}

function extract(html, expression, label, file) {
  const value = html.match(expression)?.[1];
  if (!value) fail(`${file}: missing ${label}`);
  return value || "";
}

for (const [relativeFile, route] of Object.entries(expectedPages)) {
  const repositoryPath = path.join(siteDirectory, relativeFile);
  const html = read(repositoryPath);
  const title = extract(html, /<title>([^<]+)<\/title>/, "title", repositoryPath);
  const description = extract(
    html,
    /<meta name="description" content="([^"]+)">/,
    "description",
    repositoryPath,
  );
  const canonical = extract(
    html,
    /<link rel="canonical" href="([^"]+)">/,
    "canonical URL",
    repositoryPath,
  );
  const openGraphTitle = extract(
    html,
    /<meta property="og:title" content="([^"]+)">/,
    "Open Graph title",
    repositoryPath,
  );
  const openGraphDescription = extract(
    html,
    /<meta property="og:description" content="([^"]+)">/,
    "Open Graph description",
    repositoryPath,
  );
  const openGraphUrl = extract(
    html,
    /<meta property="og:url" content="([^"]+)">/,
    "Open Graph URL",
    repositoryPath,
  );
  const expectedCanonical = `${canonicalBase}${route}`;

  if (!title.includes("Grocery Benefits Tracker"))
    fail(`${repositoryPath}: final app name is absent from title`);
  if (canonical !== expectedCanonical)
    fail(`${repositoryPath}: canonical URL is ${canonical}`);
  if (openGraphTitle !== title)
    fail(`${repositoryPath}: Open Graph title differs from title`);
  if (openGraphDescription !== description)
    fail(`${repositoryPath}: Open Graph description differs from description`);
  if (openGraphUrl !== canonical)
    fail(`${repositoryPath}: Open Graph URL differs from canonical URL`);
  if (!html.includes('<meta property="og:site_name" content="Grocery Benefits Tracker">'))
    fail(`${repositoryPath}: missing final Open Graph site name`);
  if (!html.includes('<meta name="robots" content="index,follow">'))
    fail(`${repositoryPath}: missing robots instruction`);
  if ((html.match(/rel="alternate" hreflang=/g) || []).length !== 3)
    fail(`${repositoryPath}: incomplete English/Spanish alternate URLs`);
  if (!html.includes('rel="icon"') || !html.includes('rel="apple-touch-icon"'))
    fail(`${repositoryPath}: icon metadata is incomplete`);
  if (!html.includes('rel="manifest"'))
    fail(`${repositoryPath}: manifest is not linked`);
  if (/<script\b/i.test(html))
    fail(`${repositoryPath}: unexpected script found`);
  if (legacyBrand.test(html))
    fail(`${repositoryPath}: exact rejected app brand remains`);
  if (html.toLowerCase().includes(legacySlug))
    fail(`${repositoryPath}: legacy public slug remains`);

  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const reference = match[1];
    if (/^(?:https?:|mailto:|#)/.test(reference)) continue;
    const cleanReference = reference.split(/[?#]/)[0];
    if (!cleanReference) continue;
    let target = path.resolve(
      path.dirname(path.join(siteRoot, relativeFile)),
      cleanReference,
    );
    if (cleanReference.endsWith("/")) target = path.join(target, "index.html");
    if (!fs.existsSync(target))
      fail(`${repositoryPath}: broken local reference ${reference}`);
  }
}

for (const [relativeFile, route] of Object.entries(expectedPages)) {
  const repositoryPath = path.join("docs", relativeFile);
  const html = read(repositoryPath);
  const expectedTarget = `${canonicalBase}${route}`;
  const refreshTarget = extract(
    html,
    /<meta http-equiv="refresh" content="0; url=([^"]+)">/,
    "legacy-route migration target",
    repositoryPath,
  );
  const canonical = extract(
    html,
    /<link rel="canonical" href="([^"]+)">/,
    "legacy-route canonical URL",
    repositoryPath,
  );
  if (refreshTarget !== expectedTarget)
    fail(`${repositoryPath}: migration target is ${refreshTarget}`);
  if (canonical !== expectedTarget)
    fail(`${repositoryPath}: canonical URL is ${canonical}`);
  if (!html.includes('<meta name="robots" content="noindex,follow">'))
    fail(`${repositoryPath}: legacy route is not excluded from indexing`);
  if (legacyBrand.test(html))
    fail(`${repositoryPath}: exact rejected app brand remains`);
  if (html.toLowerCase().includes(legacySlug))
    fail(`${repositoryPath}: legacy slug appears in migration content`);
  if (/<script\b/i.test(html))
    fail(`${repositoryPath}: migration page uses an unexpected script`);
}

const manifest = JSON.parse(read(`${siteDirectory}/site.webmanifest`));
if (manifest.name !== "Grocery Benefits Tracker — Legal & Support")
  fail(`${siteDirectory}/site.webmanifest: incorrect name`);
if (manifest.id !== "./" || manifest.start_url !== "./" || manifest.scope !== "./")
  fail(`${siteDirectory}/site.webmanifest: id, start_url, or scope escapes the clean site path`);
if (manifest.icons?.[0]?.src !== "assets/brand-logo.png")
  fail(`${siteDirectory}/site.webmanifest: incorrect icon path`);

const textPaths = [
  "README.md",
  "APP-INTEGRATION.md",
  `${siteDirectory}/site.webmanifest`,
  ...Object.keys(expectedPages).map((file) => path.join(siteDirectory, file)),
];
for (const textPath of textPaths) {
  const text = read(textPath);
  if (legacyBrand.test(text)) fail(`${textPath}: exact rejected app brand remains`);
  if (text.toLowerCase().includes(legacySlug))
    fail(`${textPath}: legacy public slug remains`);
  if (text.includes("fns.usda.gov"))
    fail(`${textPath}: superseded USDA FNS URL remains`);
  if (text.includes("GoodUse Studios"))
    fail(`${textPath}: Google Play developer-name casing is incorrect`);
}

const privacy = read(`${siteDirectory}/privacy/index.html`);
for (const heading of [
  "Information stored in the tracker",
  "Identity and credentials the tracker does not request",
  "Reports, exports, backups, and imports",
  "Advertising and store privacy disclosures",
  "Advertising configuration and choices",
  "Purchases",
  "Local notifications",
  "Support communications",
  "Official sources and external pages",
  "Retention and deletion",
  "Privacy Mode, device storage, and backups",
  "Security and incidents",
  "Adults and children's privacy",
  "Website hosting",
  "Canadian privacy accountability and requests",
  "International processing",
  "Changes",
  "Contact",
]) {
  if (!privacy.includes(heading)) fail(`English privacy policy: missing ${heading}`);
}
for (const disclosure of [
  "stored locally on your device",
  "does not require a SNAP, PAN, EBT, or WIC account login",
  "Google AdMob",
  "non-personalized ads",
  "They are not uploaded to an operator-controlled account",
  "GitHub Pages",
  "Independent local-first tracker",
]) {
  if (!privacy.includes(disclosure))
    fail(`English privacy policy: missing disclosure “${disclosure}”`);
}

const terms = read(`${siteDirectory}/terms/index.html`);
for (const heading of [
  "Acceptance of these Terms",
  "Independent application",
  "Not an official benefit account or balance checker",
  "No eligibility, retailer, or product determination",
  "Advertising and purchases",
  "Official sources and external pages",
  "Adults only",
  "Disclaimers",
  "Entire agreement and contact",
]) {
  if (!terms.includes(heading)) fail(`English terms: missing ${heading}`);
}

for (const file of [
  `${siteDirectory}/official-sources/index.html`,
  `${siteDirectory}/es/fuentes-oficiales/index.html`,
]) {
  const sources = read(file);
  for (const currentUrl of [
    "https://www.fna.usda.gov/snap/supplemental-nutrition-assistance-program",
    "https://www.fna.usda.gov/snap/retailer-locator",
    "https://www.fna.usda.gov/wic",
  ]) {
    if (!sources.includes(currentUrl))
      fail(`${file}: missing current USDA source ${currentUrl}`);
  }
  if (!sources.includes("FNA") || !sources.includes("FNS"))
    fail(`${file}: missing USDA FNA/FNS transition explanation`);
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log(
  `Verified ${Object.keys(expectedPages).length} policy pages, clean metadata, local links, manifest, disclosures, and zero rejected-brand/legacy-slug occurrences.`,
);
