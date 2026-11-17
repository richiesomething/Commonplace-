// Commonplace Stationery: Cloudflare Worker.
// Pages, styles and images are static assets served by Cloudflare directly.
// This script only handles /api/* requests:
//   /api/square/status  is the Square connection working? (yes/no only)
//   /api/shop           the shop's items, prices and stock labels, from Square
//
// Secret (set in Cloudflare: Workers & Pages > commonplace > Settings >
// Variables and Secrets): SQUARE_ACCESS_TOKEN, the shop's Square production
// access token. It is never sent to the browser.

import { buildShop, SQUARE_API, SQUARE_VERSION } from "./shop-data.js";

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}

async function square(env, path) {
  return fetch(SQUARE_API + path, {
    headers: {
      Authorization: `Bearer ${env.SQUARE_ACCESS_TOKEN}`,
      "Square-Version": SQUARE_VERSION,
      Accept: "application/json",
    },
  });
}

// ---------- Shop: items and stock from Square (see shop-data.js) ----------
const SHOP_CACHE_SECONDS = 300; // ask Square at most every 5 minutes

async function shopResponse(request, env, ctx) {
  const cache = caches.default;
  const key = new Request(new URL("/api/shop", request.url).toString());
  const hit = await cache.match(key);
  if (hit) return hit;
  let body;
  try {
    body = await buildShop(env.SQUARE_ACCESS_TOKEN);
  } catch (err) {
    return json({ ok: false, error: String(err.message || err) }, 502);
  }
  const res = new Response(JSON.stringify(body), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": `public, max-age=${SHOP_CACHE_SECONDS}`,
    },
  });
  ctx.waitUntil(cache.put(key, res.clone()));
  return res;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Is the Square connection set up? Reports only yes/no, never the token or shop data.
    if (url.pathname === "/api/square/status") {
      if (!env.SQUARE_ACCESS_TOKEN) return json({ connected: false, reason: "no_token" });
      try {
        const res = await square(env, "/locations");
        if (!res.ok) return json({ connected: false, reason: `square_${res.status}` });
        const data = await res.json();
        return json({ connected: true, locations: (data.locations || []).length });
      } catch (err) {
        return json({ connected: false, reason: "network" });
      }
    }

    if (url.pathname === "/api/shop") {
      if (!env.SQUARE_ACCESS_TOKEN) return json({ ok: false, error: "no_token" }, 503);
      return shopResponse(request, env, ctx);
    }

    if (url.pathname.startsWith("/api/")) return json({ error: "not_found" }, 404);

    // Everything else is a normal page or file.
    return env.ASSETS.fetch(request);
  },
};
