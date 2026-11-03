# Commonplace

A minimal static site template for Commonplace: plain HTML and CSS, no build step.

## Files

| File | What it is |
| --- | --- |
| `index.html` | Home page |
| `404.html` | Not-found page |
| `css/styles.css` | Styles (colors are the variables at the top) |
| `assets/img/logo.webp` | Logo |
| `assets/favicon.png` | Browser tab icon |

## Run it locally

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

## Deploying

Hosted on Cloudflare Pages: pushing to `master` updates the live site. Other branches get preview URLs.

The earlier full storefront (shop, cart, workshops, etc.) is in git history at commit `5ac383f`.
