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
| `404.html` | Friendly not-found page |

## Editing

- **Products & categories:** `js/products.js` (names, prices, descriptions, options, illustrations)
- **Colors & fonts:** CSS variables at the top of `css/styles.css`
- **Mascot art:** `assets/pup-*.svg` (cartoon versions of the shop dog photo in `assets/img/`)
- **Hours:** the `HOURS` array in `js/main.js`, plus the hours shown in `visit.html` and the footer

The basket is saved in the browser (localStorage). Forms, checkout and workshop reservations are demo-only.
Address, phone, email and reviews are placeholders.
