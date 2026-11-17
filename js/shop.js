// Shop page: shows the shop's items and stock from shop.json.
// On the GitHub preview, shop.json is rebuilt from Square every ~15 minutes.
// On commonplacestationery.com it can come from the Worker at /api/shop instead.
(function () {
  const SOURCES = ["shop.json", "/api/shop"]; // first one that answers wins
  const STOCK = {
    in_stock: { label: "In stock", cls: "is-in" },
    few_left: { label: "Only a few left", cls: "is-few" },
    sold_out: { label: "Sold out", cls: "is-out" },
  };

  const grid = document.getElementById("shop-grid");
  const status = document.getElementById("shop-status");
  const filters = document.getElementById("shop-filters");
  const search = document.getElementById("shop-search");
  const updated = document.getElementById("shop-updated");

  let items = [];
  let category = "All";

  async function load() {
    for (const src of SOURCES) {
      try {
        const res = await fetch(src + (src.includes("?") ? "&" : "?") + "t=" + Date.now(), { cache: "no-store" });
        if (!res.ok) continue;
        const data = await res.json();
        if (data && data.ok && Array.isArray(data.items)) return data;
      } catch (e) { /* try the next source */ }
    }
    return null;
  }

  function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function card(item) {
    const s = STOCK[item.stock] || STOCK.in_stock;
    const art = el("article", "shop-item" + (item.stock === "sold_out" ? " is-sold-out" : ""));
    const photo = el("div", "shop-photo");
    if (item.image) {
      const img = new Image();
      img.src = item.image;
      img.alt = item.name;
      img.loading = "lazy";
      img.decoding = "async";
      photo.append(img);
    } else {
      photo.classList.add("is-empty");
      photo.append(el("span", "shop-photo-mark", "C"));
    }
    const body = el("div", "shop-body");
    if (item.category) body.append(el("p", "shop-cat", item.category));
    body.append(el("h3", "shop-name", item.name));
    if (item.description) body.append(el("p", "shop-desc", item.description));
    const foot = el("div", "shop-foot");
    if (item.price) foot.append(el("span", "shop-price", item.price));
    foot.append(el("span", "shop-stock " + s.cls, s.label));
    body.append(foot);
    art.append(photo, body);
    return art;
  }

  function render() {
    const q = search.value.trim().toLowerCase();
    const shown = items.filter((i) =>
      (category === "All" || (i.category || "More") === category) &&
      (!q || (i.name + " " + i.description + " " + i.category).toLowerCase().includes(q)));
    grid.replaceChildren(...shown.map(card));
    status.hidden = shown.length > 0;
    if (!shown.length) status.textContent = q ? `Nothing matches "${search.value.trim()}". Try another word.` : "Nothing in this category right now.";
  }

  function buildFilters() {
    const cats = [...new Set(items.map((i) => i.category || "More"))].sort((a, b) =>
      a === "More" ? 1 : b === "More" ? -1 : a.localeCompare(b));
    if (cats.length < 2) { filters.hidden = true; return; }
    ["All", ...cats].forEach((c) => {
      const b = el("button", "shop-chip", c);
      b.type = "button";
      b.setAttribute("aria-pressed", String(c === category));
      b.addEventListener("click", () => {
        category = c;
        filters.querySelectorAll(".shop-chip").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
        render();
      });
      filters.append(b);
    });
  }

  load().then((data) => {
    if (!data) {
      status.textContent = "We couldn't load the shop just now. Please try again in a little while.";
      return;
    }
    // Group by category ("More" last), sold-out items last within each, then A to Z.
    const catKey = (i) => (i.category ? "0" + i.category.toLowerCase() : "1");
    items = data.items.slice().sort((a, b) =>
      catKey(a).localeCompare(catKey(b)) ||
      (a.stock === "sold_out") - (b.stock === "sold_out") ||
      a.name.localeCompare(b.name));
    if (!items.length) {
      status.textContent = "Our shelves are filling up. New arrivals are being added, so check back soon.";
      document.querySelector(".shop-tools").hidden = true;
      return;
    }
    buildFilters();
    render();
    if (data.updated) {
      const t = new Date(data.updated);
      updated.textContent = "Stock last updated " + t.toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) + ".";
      updated.hidden = false;
    }
  });

  search.addEventListener("input", render);
})();
