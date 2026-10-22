/* Commonplace — shared site behavior. No build step, no dependencies. */

(function () {
  const { CATEGORIES, PRODUCTS, art } = window.Commonplace;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const money = (n) => "$" + n.toFixed(2).replace(/\.00$/, "");
  const money2 = (n) => "$" + n.toFixed(2);
  const byId = (id) => PRODUCTS.find((p) => p.id === id);
  const catName = (id) => (CATEGORIES.find((c) => c.id === id) || {}).name || "";
  const FREE_SHIP = 40;

  const BADGES = {
    pup: '<span class="badge badge--pup"><img src="assets/img/pup-head.webp" alt="">Pup’s pick</span>',
    new: '<span class="badge badge--new">New</span>',
    staff: '<span class="badge">Staff pick</span>',
    low: '<span class="badge badge--low">Almost gone</span>'
  };

  const productArt = (p, eager) => p.img
    ? `<img class="photo" src="${p.img}" alt="" width="800" height="800"${eager ? "" : ' loading="lazy"'}>`
    : art(p.art[0], p.art[1], p.bg);
  const priceFor = (p, option) => (option && /^\$\d/.test(option) ? parseFloat(option.slice(1)) : p.price);

  /* ---------- Cart (localStorage) ---------- */
  const KEY = "commonplace-cart";
  const Cart = {
    read() {
      try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; }
    },
    write(items) {
      try { localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) { /* storage unavailable */ }
      updateCount(true);
      document.dispatchEvent(new CustomEvent("cart:change"));
    },
    add(id, qty = 1, option = null) {
      const items = Cart.read();
      const hit = items.find((i) => i.id === id && i.option === option);
      if (hit) hit.qty += qty; else items.push({ id, qty, option });
      Cart.write(items);
    },
    set(index, qty) {
      const items = Cart.read();
      if (!items[index]) return;
      if (qty <= 0) items.splice(index, 1); else items[index].qty = Math.min(qty, 99);
      Cart.write(items);
    },
    count() { return Cart.read().reduce((n, i) => n + i.qty, 0); },
    subtotal() {
      return Cart.read().reduce((s, i) => {
        const p = byId(i.id);
        return p ? s + priceFor(p, i.option) * i.qty : s;
      }, 0);
    }
  };

  function updateCount(bump) {
    $$(".cart-count").forEach((el) => {
      const n = Cart.count();
      el.textContent = n;
      el.dataset.count = n;
      if (bump) { el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump"); }
    });
  }

  /* ---------- Toast ---------- */
  let toastTimer;
  function toast(html) {
    let t = $(".toast");
    if (!t) {
      t = document.createElement("div");
      t.className = "toast";
      t.setAttribute("role", "status");
      t.setAttribute("aria-live", "polite");
      document.body.appendChild(t);
    }
    t.innerHTML = `<img src="assets/img/pup-head.webp" alt=""><span>${html}</span>`;
    requestAnimationFrame(() => t.classList.add("show"));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 3200);
  }

  function addToCart(id, qty = 1, option = null, btn) {
    const p = byId(id);
    if (!p) return;
    Cart.add(id, qty, option);
    toast(`<strong>${p.name}</strong> is in your basket. <a href="cart.html">View basket</a>`);
    if (btn) {
      const label = btn.textContent;
      btn.classList.add("added");
      btn.textContent = "Added ✓";
      setTimeout(() => { btn.classList.remove("added"); btn.textContent = label; }, 1500);
    }
  }

  /* ---------- Product cards ---------- */
  function card(p) {
    return `
      <article class="product-card reveal">
        <a class="thumb" href="product.html?id=${p.id}" aria-label="${p.name}">
          ${p.badge ? BADGES[p.badge] : ""}${productArt(p)}
        </a>
        <div class="meta">
          <span class="cat">${catName(p.cat)}</span>
          <h3><a href="product.html?id=${p.id}">${p.name}</a></h3>
          <div class="row">
            <span class="price">${p.options && p.cat === "gifts" ? "from " : ""}${money(p.price)}${p.compare ? `<s>${money(p.compare)}</s>` : ""}</span>
            <button class="add-btn" type="button" data-add="${p.id}">Add to basket</button>
          </div>
        </div>
      </article>`;
  }

  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-add]");
    if (!b) return;
    const p = byId(b.dataset.add);
    addToCart(p.id, 1, p.options ? p.options.values[0] : null, b);
  });

  /* ---------- Header / nav ---------- */
  function initNav() {
    const toggle = $(".nav-toggle");
    const nav = $(".main-nav");
    if (!toggle || !nav) return;
    const backdrop = document.createElement("div");
    backdrop.className = "nav-backdrop";
    document.body.appendChild(backdrop);
    const set = (open) => {
      nav.classList.toggle("open", open);
      backdrop.classList.toggle("show", open);
      toggle.setAttribute("aria-expanded", open);
      document.body.style.overflow = open ? "hidden" : "";
    };
    toggle.addEventListener("click", () => set(!nav.classList.contains("open")));
    backdrop.addEventListener("click", () => set(false));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") set(false); });
  }

  function initReveal() {
    const els = $$(".reveal:not(.in)");
    if (!("IntersectionObserver" in window)) { els.forEach((el) => el.classList.add("in")); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -40px 0px" });
    els.forEach((el) => io.observe(el));
  }

  /* ---------- Shop hours / open status ---------- */
  // Sun..Sat, 24h opening/closing. Keep in sync with the hours tables in the HTML.
  const HOURS = [[11, 17], [10, 18], [10, 18], [10, 18], [10, 20], [10, 20], [9, 18]];
  function initHours() {
    const now = new Date();
    const day = now.getDay();
    $$(".hours tr[data-day]").forEach((tr) => { if (+tr.dataset.day === day) tr.classList.add("today"); });
    $$("[data-open-status]").forEach((el) => {
      const h = HOURS[day];
      const t = now.getHours() + now.getMinutes() / 60;
      const open = h && t >= h[0] && t < h[1];
      el.classList.toggle("closed", !open);
      el.textContent = open ? "Open now. Come say hi!" : "Closed right now. The pup is napping.";
    });
  }

  /* ---------- Page: home ---------- */
  function initHome() {
    const cats = $("#home-categories");
    if (cats) {
      cats.innerHTML = CATEGORIES.map((c) => `
        <a class="cat-card reveal" href="shop.html?cat=${c.id}">
          <div class="cat-art" style="background:${c.bg}">${art(c.art[0], c.art[1], c.bg)}</div>
          <h3>${c.name}</h3><span>${c.blurb}</span>
        </a>`).join("");
    }
    const feat = $("#home-featured");
    if (feat) feat.innerHTML = PRODUCTS.filter((p) => p.featured).slice(0, 8).map(card).join("");
  }

  /* ---------- Page: shop ---------- */
  function initShop() {
    const grid = $("#shop-grid");
    if (!grid) return;
    const params = new URLSearchParams(location.search);
    const state = { cat: params.get("cat") || "all", sort: "featured", q: params.get("q") || "" };
    if (state.cat !== "all" && !CATEGORIES.some((c) => c.id === state.cat)) state.cat = "all";

    const cats = [{ id: "all", name: "Everything" }].concat(CATEGORIES);
    const countFor = (id) => (id === "all" ? PRODUCTS.length : PRODUCTS.filter((p) => p.cat === id).length);
    $("#filter-list").innerHTML = cats.map((c) =>
      `<li><button type="button" data-cat="${c.id}">${c.name}<span class="n">${countFor(c.id)}</span></button></li>`).join("");
    $("#filter-chips").innerHTML = cats.map((c) => `<button type="button" data-cat="${c.id}">${c.name}</button>`).join("");

    const search = $("#shop-search");
    search.value = state.q;

    function render() {
      $$("[data-cat]").forEach((b) => b.setAttribute("aria-pressed", b.dataset.cat === state.cat));
      const q = state.q.trim().toLowerCase();
      let list = PRODUCTS.filter((p) => (state.cat === "all" || p.cat === state.cat) &&
        (!q || (p.name + " " + p.short + " " + catName(p.cat)).toLowerCase().includes(q)));
      if (state.sort === "low") list = list.slice().sort((a, b) => a.price - b.price);
      if (state.sort === "high") list = list.slice().sort((a, b) => b.price - a.price);
      if (state.sort === "name") list = list.slice().sort((a, b) => a.name.localeCompare(b.name));
      if (state.sort === "rating") list = list.slice().sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
      if (state.sort === "featured") list = list.slice().sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

      $("#shop-title").textContent = state.cat === "all" ? "The whole shop" : catName(state.cat);
      $("#shop-count").textContent = `${list.length} ${list.length === 1 ? "item" : "items"}`;
      grid.innerHTML = list.length ? list.map(card).join("") : `
        <div class="empty-state" style="grid-column:1/-1">
          <img src="assets/img/pup-walking.webp" alt="">
          <p>Hmm, the pup sniffed everywhere and couldn’t find that.<br>Try a different word or category.</p>
        </div>`;
      initReveal();

      const url = new URL(location.href);
      state.cat === "all" ? url.searchParams.delete("cat") : url.searchParams.set("cat", state.cat);
      q ? url.searchParams.set("q", state.q) : url.searchParams.delete("q");
      history.replaceState(null, "", url);
    }

    document.addEventListener("click", (e) => {
      const b = e.target.closest("[data-cat]");
      if (!b) return;
      state.cat = b.dataset.cat;
      render();
    });
    $("#shop-sort").addEventListener("change", (e) => { state.sort = e.target.value; render(); });
    search.addEventListener("input", (e) => { state.q = e.target.value; render(); });
    render();
  }

  /* ---------- Page: product ---------- */
  function initProduct() {
    const root = $("#pdp");
    if (!root) return;
    const id = new URLSearchParams(location.search).get("id");
    const p = byId(id) || PRODUCTS[0];
    document.title = `${p.name} · Commonplace`;
    const stars = "★★★★★".slice(0, Math.round(p.rating)) + "☆☆☆☆☆".slice(0, 5 - Math.round(p.rating));
    const altBgs = ["#e2e7d6", "#f2cfbf", "#dfe6ef"];
    const views = [p.bg].concat(altBgs.filter((b) => b !== p.bg).slice(0, 2));

    $("#pdp-crumbs").innerHTML = `<a href="index.html">Home</a> / <a href="shop.html">Shop</a> / <a href="shop.html?cat=${p.cat}">${catName(p.cat)}</a> / ${p.name}`;
    root.innerHTML = `
      <div class="pdp-gallery">
        <div class="main-img">${productArt(p, true)}</div>
        ${p.img ? `<p class="photo-credit">Photo: ${p.credit || "see <a href=\"credits.html\">photo credits</a>"}</p>` : `<div class="pdp-thumbs" role="group" aria-label="Choose a backdrop">
          ${views.map((bg, i) => `<button type="button" data-bg="${bg}" aria-pressed="${i === 0}" aria-label="View ${i + 1}">${art(p.art[0], p.art[1], bg)}</button>`).join("")}
        </div>`}
      </div>
      <div class="pdp-info">
        ${p.badge ? `<div style="position:relative;height:34px;margin-bottom:8px">${BADGES[p.badge].replace('class="badge', 'style="position:static" class="badge')}</div>` : ""}
        <span class="eyebrow">${catName(p.cat)}</span>
        <h1>${p.name}</h1>
        <div class="rating"><span class="stars" aria-hidden="true">${stars}</span> ${p.rating.toFixed(1)} · ${p.reviews} reviews</div>
        <p class="price" style="margin:14px 0 0" id="pdp-price">${money(p.price)}${p.compare ? `<s>${money(p.compare)}</s>` : ""}</p>
        <p class="lede">${p.desc}</p>
        ${p.options ? `
          <div class="option-group"><fieldset>
            <legend class="option-label">${p.options.label}</legend>
            <div class="swatches">
              ${p.options.values.map((v, i) => `<label><input type="radio" name="opt" value="${v}" ${i === 0 ? "checked" : ""}><span>${v}</span></label>`).join("")}
            </div>
          </fieldset></div>` : ""}
        <div class="buy-row">
          <div class="qty">
            <button type="button" data-step="-1" aria-label="Decrease quantity">−</button>
            <input type="number" id="pdp-qty" value="1" min="1" max="99" aria-label="Quantity">
            <button type="button" data-step="1" aria-label="Increase quantity">+</button>
          </div>
          <button class="btn" type="button" id="pdp-add">Add to basket</button>
        </div>
        <ul class="perks">
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 7h11v10H3zM14 10h4l3 3v4h-7"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>Free shipping on orders over $${FREE_SHIP}</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="8" width="18" height="13" rx="1"/><path d="M12 8v13M3 12h18M12 8c-2-4-6-4-6-1s6 1 6 1zm0 0c2-4 6-4 6-1s-6 1-6 1z"/></svg>Free gift wrapping, always</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 10l9-6 9 6v10H3z"/><path d="M9 20v-6h6v6"/></svg>Pick up in the shop (usually ready in 2 hours)</li>
        </ul>
        <details class="acc" open><summary>Details</summary><div class="acc-body"><ul>${p.details.map((d) => `<li>${d}</li>`).join("")}</ul></div></details>
        <details class="acc"><summary>Shipping & returns</summary><div class="acc-body">Orders ship in 1–2 business days, wrapped in recycled kraft paper and tied with twine. Unused items can be returned within 30 days.</div></details>
        <details class="acc"><summary>A note from the shop</summary><div class="acc-body">Everything we stock is something we’ve used ourselves. If you’re nearby, come try it at the shop. The pens are uncapped and the kettle’s usually on.</div></details>
      </div>`;

    const qty = $("#pdp-qty");
    root.addEventListener("click", (e) => {
      const s = e.target.closest("[data-step]");
      if (s) qty.value = Math.max(1, Math.min(99, (+qty.value || 1) + +s.dataset.step));
      const t = e.target.closest("[data-bg]");
      if (t) {
        $$(".pdp-thumbs button").forEach((b) => b.setAttribute("aria-pressed", b === t));
        $(".main-img", root).innerHTML = art(p.art[0], p.art[1], t.dataset.bg);
      }
    });
    root.addEventListener("change", (e) => {
      if (e.target.name === "opt") $("#pdp-price").innerHTML = money(priceFor(p, e.target.value));
    });
    $("#pdp-add").addEventListener("click", (e) => {
      const opt = $('input[name="opt"]:checked', root);
      addToCart(p.id, Math.max(1, +qty.value || 1), opt ? opt.value : null, e.currentTarget);
    });

    const related = PRODUCTS.filter((x) => x.cat === p.cat && x.id !== p.id)
      .concat(PRODUCTS.filter((x) => x.featured && x.cat !== p.cat))
      .slice(0, 4);
    $("#related").innerHTML = related.map(card).join("");
  }

  /* ---------- Page: cart ---------- */
  function initCart() {
    const root = $("#cart-root");
    if (!root) return;
    let wrap = false;

    function render() {
      const items = Cart.read().filter((i) => byId(i.id));
      if (!items.length) {
        root.innerHTML = `
          <div class="empty-state">
            <img src="assets/img/pup-walking.webp" alt="Our illustrated shop dog trotting along">
            <h2>Your basket is empty</h2>
            <p>Even the pup checked twice. Let’s find you something lovely.</p>
            <a class="btn" href="shop.html">Browse the shop</a>
          </div>`;
        return;
      }
      const sub = Cart.subtotal();
      const ship = sub >= FREE_SHIP ? 0 : 5.95;
      const left = Math.max(0, FREE_SHIP - sub);
      root.innerHTML = `
        <div class="cart-layout">
          <div>
            <ul class="cart-list">
              ${items.map((i, idx) => {
                const p = byId(i.id);
                return `
                <li class="cart-item">
                  <a class="ci-img" href="product.html?id=${p.id}" aria-hidden="true" tabindex="-1">${productArt(p)}</a>
                  <div>
                    <h3><a href="product.html?id=${p.id}">${p.name}</a></h3>
                    <div class="ci-sub">${i.option ? `${p.options.label}: ${i.option} · ` : ""}${money2(priceFor(p, i.option))} each</div>
                    <div class="ci-actions">
                      <div class="qty">
                        <button type="button" data-idx="${idx}" data-d="-1" aria-label="Decrease quantity">−</button>
                        <input type="number" value="${i.qty}" min="1" max="99" data-idx="${idx}" aria-label="Quantity for ${p.name}">
                        <button type="button" data-idx="${idx}" data-d="1" aria-label="Increase quantity">+</button>
                      </div>
                      <button class="link-btn" type="button" data-remove="${idx}">Remove</button>
                    </div>
                  </div>
                  <div class="ci-price price">${money2(priceFor(p, i.option) * i.qty)}</div>
                </li>`;
              }).join("")}
            </ul>
            <p style="margin-top:20px"><a class="link-arrow" href="shop.html">Keep browsing</a></p>
          </div>
          <aside class="summary" aria-label="Order summary">
            <h2>Your order</h2>
            <div class="line"><span>Subtotal</span><span>${money2(sub)}</span></div>
            <div class="line"><span>Shipping</span><span>${ship ? money2(ship) : "Free"}</span></div>
            ${wrap ? `<div class="line"><span>Gift wrap</span><span>Free</span></div>` : ""}
            <div class="line total"><span>Total</span><span>${money2(sub + ship)}</span></div>
            <div class="ship-meter">
              ${left > 0 ? `You’re <strong>${money2(left)}</strong> away from free shipping.` : "You’ve unlocked <strong>free shipping</strong>! 🎉"}
              <div class="bar"><span style="width:${Math.min(100, (sub / FREE_SHIP) * 100)}%"></span></div>
            </div>
            <label class="check"><input type="checkbox" id="gift-wrap" ${wrap ? "checked" : ""}> Wrap it up in kraft paper & twine (free)</label>
            <label class="form" style="margin:6px 0 18px"><span style="font-weight:600;font-size:.92rem">Gift note (optional)</span>
              <textarea class="field" rows="3" id="gift-note" placeholder="Write a little something…"></textarea></label>
            <button class="btn btn--block" type="button" id="checkout">Checkout</button>
            <p style="font-size:.85rem;color:var(--ink-faint);margin:12px 0 0;text-align:center">Prefer to pick up? Choose “in-store pickup” at checkout.</p>
          </aside>
        </div>`;
    }

    root.addEventListener("click", (e) => {
      const d = e.target.closest("[data-d]");
      if (d) { const i = Cart.read()[+d.dataset.idx]; Cart.set(+d.dataset.idx, i.qty + +d.dataset.d); }
      const r = e.target.closest("[data-remove]");
      if (r) Cart.set(+r.dataset.remove, 0);
      if (e.target.id === "checkout") toast("Checkout isn’t connected yet. This is a preview site!");
    });
    root.addEventListener("change", (e) => {
      if (e.target.matches("input[data-idx]")) Cart.set(+e.target.dataset.idx, Math.max(1, +e.target.value || 1));
      if (e.target.id === "gift-wrap") { wrap = e.target.checked; render(); }
    });
    document.addEventListener("cart:change", render);
    render();
  }

  /* ---------- Forms (demo only) ---------- */
  function initForms() {
    $$("form[data-demo]").forEach((f) => {
      f.addEventListener("submit", (e) => {
        e.preventDefault();
        const ok = f.querySelector(".form-success");
        if (ok) { ok.classList.add("show"); f.querySelectorAll("input, textarea, select, button").forEach((el) => (el.disabled = true)); }
        toast(f.dataset.demo);
      });
    });
    $$("[data-reserve]").forEach((b) => b.addEventListener("click", () => {
      toast(`Seat request noted for <strong>${b.dataset.reserve}</strong> (demo).`);
      b.textContent = "Requested ✓";
      b.disabled = true;
    }));
  }

  /* ---------- Boot ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    $$(".year").forEach((el) => (el.textContent = new Date().getFullYear()));
    updateCount(false);
    initNav();
    initHome();
    initShop();
    initProduct();
    initCart();
    initHours();
    initForms();
    initReveal();
  });
  window.addEventListener("storage", (e) => { if (e.key === KEY) updateCount(false); });
})();
