# Commonplace Stationery

The shop's website, rebuilt from scratch one piece at a time. Plain static HTML and CSS, no build step.

## Run it locally

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

## What's here

- `index.html`: the home page (storefront, wordmark, next workshop, store hours)
- `brands.html`: the brands the shop carries
- `events.html`: upcoming workshops and events, each with a sign-up button
- `about.html`: About Us (the dashed box marks copy the shop still needs to write)
- `js/hours.js`: open/closed status from the store hours
- `js/workshop.js`, `js/config.js`: event sign-up form; sign-ups go to the "Commonplace Event Sign-ups" Google Sheet through the web app URL set in `js/config.js`
- `google-apps-script/Code.gs`: the script that lives in that Google Sheet (Extensions > Apps Script); event spot limits are set at the top
- `css/styles.css`: colors and fonts live as CSS variables at the top
- `assets/img/wordmark.webp`, `assets/img/storefront.webp`: brand artwork
- `brand/palette.png`: the proposed color palette

## Palette

| Name | Hex | Use |
| --- | --- | --- |
| French Blue | `#6E8DB5` | Hero color: shelves, logo mark, stamps |
| Warm Cream | `#F4EEE1` | Walls and backgrounds, not stark white |
| Natural Oak | `#C49A6C` | Counter, journaling table, crates |
| Ink Navy | `#23324A` | Text, logo type, price cards |
| Tomato Red | `#C8452F` | Small pops: "new in" tags, events |
| Ochre | `#D9A441` | Optional second pop, used sparingly |
| Blue Gingham | pattern | Table runner, tissue, Instagram borders |

Hex codes are close matches. Confirm the blue against the real shelves before ordering signage.
