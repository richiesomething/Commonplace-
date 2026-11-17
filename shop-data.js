// Commonplace Stationery: read the shop's items and stock from Square.
// Shared by worker.js (Cloudflare) and scripts/build-preview.mjs (GitHub).

export const SQUARE_API = "https://connect.squareup.com/v2";
export const SQUARE_VERSION = "2025-01-23";

// Sends the browser only what a customer should see: name, description,
// price, photo, category and a stock label. Never exact counts or costs.

const FEW_LEFT = 3;             // "Only a few left" at this many or fewer

async function squareJSON(token, path, body) {
  const res = await fetch(SQUARE_API + path, {
    method: body ? "POST" : "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Square-Version": SQUARE_VERSION,
      Accept: "application/json",
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`square_${res.status}`);
  return res.json();
}

async function listCatalog(token) {
  const objects = [];
  let cursor = "";
  do {
    const q = `/catalog/list?types=ITEM,CATEGORY,IMAGE${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ""}`;
    const page = await squareJSON(token, q);
    objects.push(...(page.objects || []));
    cursor = page.cursor || "";
  } while (cursor);
  return objects;
}

// IN_STOCK quantity per variation id, summed across locations.
async function stockCounts(token, variationIds) {
  const counts = {};
  for (let i = 0; i < variationIds.length; i += 500) {
    let cursor;
    do {
      const page = await squareJSON(token, "/inventory/counts/batch-retrieve", {
        catalog_object_ids: variationIds.slice(i, i + 500),
        states: ["IN_STOCK"],
        ...(cursor ? { cursor } : {}),
      });
      for (const c of page.counts || []) {
        counts[c.catalog_object_id] = (counts[c.catalog_object_id] || 0) + Number(c.quantity || 0);
      }
      cursor = page.cursor;
    } while (cursor);
  }
  return counts;
}

// ---------- Shop categories ----------
// The Shop submenu. An item goes in every category whose words appear in its
// name. If the item has a category in Square with one of these names, that
// is used instead. Edit the word lists to change how items are sorted.
export const SHOP_CATEGORIES = [
  { slug: "notebooks", name: "Notebooks & Journals",
    words: ["notebook", "notebooks", "journal", "journals", "planner", "planners", "workbook", "diary", "sketchbook", "voyager"] },
  { slug: "stickers", name: "Stickers & Washi",
    words: ["sticker", "stickers", "washi", "tape", "ephemera", "flakes"] },
  { slug: "paper", name: "Paper & Scrapbooking",
    words: ["paper", "papers", "pad", "booklet", "scrapbook", "scrapbooking", "cardstock", "notepad", "envelope", "envelopes"] },
  { slug: "cards", name: "Cards",
    words: ["card", "cards", "postcard", "postcards"] },
  { slug: "pens", name: "Pens, Markers & Ink",
    words: ["pen", "pens", "marker", "markers", "highlighter", "highlighters", "mildliner", "ink", "inks", "gel", "fineliner", "pencil", "pencils", "brush"] },
  { slug: "tools", name: "Stamps, Tools & Bags",
    words: ["stamp", "stamps", "scissors", "trimmer", "punch", "clip", "clips", "ruler", "frame", "frames", "embroidery", "bag", "bags", "pouch", "pouches", "keeper", "case", "tabs", "glue", "stencil", "bookmark", "bookmarks", "calligraphy"] },
  { slug: "faith", name: "Faith",
    words: ["bible", "prayer", "psalm", "psalms", "scripture", "christian", "faith", "jesus", "lord", "god", "verse", "sermon", "devotional"],
    // Bible references like "Psalm 34:8" or "1 Peter 1:6"
    pattern: /\b\d?\s?[a-z]+\s\d{1,3}:\d{1,3}\b/i },
];

function categorize(name, squareCategory) {
  const fromSquare = SHOP_CATEGORIES.find((c) => c.name.toLowerCase() === (squareCategory || "").toLowerCase());
  if (fromSquare) return [fromSquare.slug];
  const words = new Set(name.toLowerCase().replace(/[^a-z0-9]+/g, " ").split(" "));
  return SHOP_CATEGORIES
    .filter((c) => c.words.some((w) => words.has(w)) || (c.pattern && c.pattern.test(name)))
    .map((c) => c.slug);
}

function formatMoney(cents) {
  return "$" + (cents / 100).toFixed(2);
}

export async function buildShop(token) {
  const objects = await listCatalog(token);
  const categories = {};
  const images = {};
  for (const o of objects) {
    if (o.type === "CATEGORY" && !o.is_deleted) categories[o.id] = o.category_data?.name || "";
    if (o.type === "IMAGE" && !o.is_deleted) images[o.id] = o.image_data?.url || "";
  }

  const items = objects.filter((o) => {
    const d = o.item_data;
    if (o.type !== "ITEM" || o.is_deleted || !d) return false;
    if (d.is_archived) return false;
    if (d.ecom_visibility === "HIDDEN") return false; // hide an item by setting its online visibility to Hidden in Square
    if (d.product_type && d.product_type !== "REGULAR") return false;
    return (d.variations || []).length > 0;
  });

  const trackedIds = [];
  for (const it of items) {
    for (const v of it.item_data.variations) {
      const vd = v.item_variation_data || {};
      const tracked = vd.track_inventory || (vd.location_overrides || []).some((l) => l.track_inventory);
      if (tracked) trackedIds.push(v.id);
    }
  }
  const counts = trackedIds.length ? await stockCounts(token, trackedIds) : {};
  const tracked = new Set(trackedIds);

  const out = items.map((it) => {
    const d = it.item_data;
    const prices = [];
    let anyUntracked = false;
    let qty = 0;
    let anyMarkedSoldOut = false;
    for (const v of d.variations) {
      const vd = v.item_variation_data || {};
      if (vd.pricing_type !== "VARIABLE_PRICING" && vd.price_money?.amount != null) prices.push(vd.price_money.amount);
      if ((vd.location_overrides || []).some((l) => l.sold_out)) anyMarkedSoldOut = true;
      if (tracked.has(v.id)) qty += Math.max(0, counts[v.id] || 0);
      else anyUntracked = true;
    }
    let stock = "in_stock";
    if (!anyUntracked) stock = qty <= 0 ? "sold_out" : qty <= FEW_LEFT ? "few_left" : "in_stock";
    if (anyMarkedSoldOut && !anyUntracked && qty <= 0) stock = "sold_out";

    const catIds = [...(d.categories || []).map((c) => c.id), d.category_id, d.reporting_category?.id].filter(Boolean);
    const category = catIds.map((id) => categories[id]).find(Boolean) || "";
    const imageId = (d.image_ids || [])[0];
    const min = prices.length ? Math.min(...prices) : null;
    const max = prices.length ? Math.max(...prices) : null;

    return {
      id: it.id,
      name: d.name || "",
      description: (d.description_plaintext || "").slice(0, 400),
      category,
      categories: categorize(d.name || "", category),
      image: imageId ? images[imageId] || "" : "",
      price: min == null ? "" : min === max ? formatMoney(min) : `${formatMoney(min)} – ${formatMoney(max)}`,
      stock,
    };
  });

  out.sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
  const categoryList = SHOP_CATEGORIES.map(({ slug, name }) => ({ slug, name }));
  return { ok: true, updated: new Date().toISOString(), categories: categoryList, items: out };
}
