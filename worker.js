// Commonplace Stationery: Cloudflare Worker.
// Pages, styles and images are static assets served by Cloudflare directly.
// This script only handles /api/* requests.
//
// Secret (set in Cloudflare: Workers & Pages > commonplace > Settings >
// Variables and Secrets): SQUARE_ACCESS_TOKEN, the shop's Square production
// access token. It is never sent to the browser.

const SQUARE_API = "https://connect.squareup.com/v2";
const SQUARE_VERSION = "2025-01-23";

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

export default {
  async fetch(request, env) {
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

    if (url.pathname.startsWith("/api/")) return json({ error: "not_found" }, 404);

    // Everything else is a normal page or file.
    return env.ASSETS.fetch(request);
  },
};
