# Commonplace

A cozy stationery shop website. Plain static HTML/CSS/JS with no build step.

## Run it locally

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

Opening `index.html` directly also works, but a local server is closest to real hosting.

## Pages

| Page | What's there |
| --- | --- |
| `index.html` | Hero, categories, staff & pup picks, shop dog, services, workshops, reviews, newsletter |
| `shop.html` | Full catalogue with category filters, search and sorting (`?cat=pens`, `?q=pup`) |
| `product.html?id=…` | Product details, options, quantity, add to basket, related items |
| `cart.html` | Basket with quantities, free-shipping meter, gift wrap and gift note (checkout is a placeholder) |
| `workshops.html` | Upcoming classes and private parties |
| `about.html` | Shop story, values, and the pup behind the logo |
| `visit.html` | Hours (with live open/closed status), map, contact form, FAQ |
| `credits.html` | Photo credits and licenses for the product photos |
| `404.html` | Friendly not-found page |

## Editing

- **Products & categories:** `js/products.js` (names, prices, descriptions, options, illustrations)
- **Product photos:** `assets/products/<product-id>.webp`, square, about 800 px. They come from Wikimedia Commons under the licenses listed on `credits.html`; keep the credits when you keep a photo. To use your own photo, replace the file and remove its entry from `CREDITS` in `js/products.js`. Products without a photo fall back to an illustration.
- **Colors & fonts:** CSS variables at the top of `css/styles.css`
- **Logo & mascot:** `assets/img/logo.webp` (full logo), `logo-mark.webp` (circle used in the header/footer), `pup-walking.webp` and `pup-head.webp` (illustrated shop dog), `assets/favicon.png`
- **Hours:** the `HOURS` array in `js/main.js`, plus the hours shown in `visit.html` and the footer

The basket is saved in the browser (localStorage). Forms, checkout and workshop reservations are demo-only.
Address, phone, email and reviews are placeholders.
