// Builds the GitHub Pages preview of the site into _site/.
// - copies the site files (skipping what .assetsignore lists)
// - writes _site/shop.json with the shop's items and stock from Square
// - marks every page as a preview: hidden from search engines, with a small banner
//
// Usage: SQUARE_ACCESS_TOKEN=... node scripts/build-preview.mjs
import { cp, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { buildShop } from "../shop-data.js";

const OUT = "_site";
const token = process.env.SQUARE_ACCESS_TOKEN;
if (!token) {
  console.error("SQUARE_ACCESS_TOKEN is not set.");
  process.exit(1);
}

const ignore = new Set(
  (await readFile(".assetsignore", "utf8"))
    .split("\n").map((l) => l.trim()).filter((l) => l && !l.startsWith("#")),
);
ignore.add(OUT);

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT);
for (const name of await readdir(".")) {
  if (ignore.has(name)) continue;
  await cp(name, join(OUT, name), { recursive: true });
}

const shop = await buildShop(token);
await writeFile(join(OUT, "shop.json"), JSON.stringify(shop));
await writeFile(join(OUT, ".nojekyll"), "");

const banner =
  '<div style="background:#23324A;color:#F4EEE1;text-align:center;font:500 13px/1.4 Georgia,serif;' +
  'padding:6px max(16px,env(safe-area-inset-left,0px))">Preview site. The live site is ' +
  '<a href="https://commonplacestationery.com" style="color:#D9A441">commonplacestationery.com</a>.</div>';
for (const name of await readdir(OUT)) {
  if (!name.endsWith(".html")) continue;
  const path = join(OUT, name);
  let html = await readFile(path, "utf8");
  html = html.replace("<head>", '<head>\n  <meta name="robots" content="noindex, nofollow">');
  html = html.replace("<body>", "<body>\n  " + banner);
  await writeFile(path, html);
}

console.log(`Built ${OUT}/ with ${shop.items.length} shop items (updated ${shop.updated}).`);
