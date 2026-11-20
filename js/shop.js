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
  const subnav = document.getElementById("shop-subnav");
  const title = document.getElementById("shop-title");
  const search = document.getElementById("shop-search");
  const updated = document.getElementById("shop-updated");

  let items = [];
  let names = {}; // slug -> category name
  let category = new URLSearchParams(location.search).get("cat") || "";

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
    const catName = names[(item.categories || [])[0]] || item.category;
    if (catName) body.append(el("p", "shop-cat", catName));
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
      (!category || (i.categories || []).includes(category)) &&
      (!q || (i.name + " " + i.description + " " + i.category).toLowerCase().includes(q)));
    grid.replaceChildren(...shown.map(card));
    status.hidden = shown.length > 0;
    if (!shown.length) status.textContent = q ? `Nothing matches "${search.value.trim()}". Try another word.` : "Nothing in this category right now. Check back soon.";
    title.textContent = category && names[category] ? names[category] : "Shop";
  }

  // Submenu: highlight the current category and filter without reloading the page.
  function markSubnav() {
    subnav.querySelectorAll("a").forEach((a) => {
      if ((a.dataset.cat || "") === category) {
        a.setAttribute("aria-current", "page");
        // keep the chosen category visible in the scrolling row on phones
        subnav.scrollLeft = a.offsetLeft - (subnav.clientWidth - a.offsetWidth) / 2;
      }
      else a.removeAttribute("aria-current");
    });
  }
  subnav.addEventListener("click", (e) => {
    const a = e.target.closest("a[data-cat]");
    if (!a || !items.length) return;
    e.preventDefault();
    category = a.dataset.cat || "";
    history.replaceState(null, "", a.getAttribute("href"));
    markSubnav();
    render();
  });
  markSubnav();

  load().then((data) => {
    if (!data) {
      status.textContent = "We couldn't load the shop just now. Please try again in a little while.";
      return;
    }
    // In-stock items first, then A to Z.
    items = data.items.slice().sort((a, b) =>
      (a.stock === "sold_out") - (b.stock === "sold_out") || a.name.localeCompare(b.name));
    if (!items.length) {
      status.textContent = "Our shelves are filling up. New arrivals are being added, so check back soon.";
      document.querySelector(".shop-tools").hidden = true;
      return;
    }
    (data.categories || []).forEach((c) => { names[c.slug] = c.name; });
    render();
    if (data.updated) {
      const t = new Date(data.updated);
      updated.textContent = "Stock last updated " + t.toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) + ".";
      updated.hidden = false;
    }
  });

  search.addEventListener("input", render);
})();
