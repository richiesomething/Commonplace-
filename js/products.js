/* Commonplace — product catalogue + illustrated product art.
   Everything here is placeholder data so the static site can be tested. */

(function () {
  const INK = "#3b2a20";
  const O = `stroke="${INK}" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"`;
  const shadow = (cx = 100, cy = 172, rx = 62) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="8" fill="${INK}" opacity=".12"/>`;

  // tiny sleeping pup glyph used on stickers, wax seals & totes
  const pupFace = (x, y, s = 1, eyes = "closed") => `
    <g transform="translate(${x} ${y}) scale(${s})">
      <path d="M-22 -6 L-20 -34 L-4 -18 Z" fill="#b8672e" ${O}/>
      <path d="M22 -6 L20 -34 L4 -18 Z" fill="#a85b27" ${O}/>
      <ellipse cx="0" cy="0" rx="26" ry="22" fill="#b8672e" ${O}/>
      <path d="M-15 6 C-13 -6 -4 -6 0 1 C4 -6 13 -6 15 6 C16 18 8 22 0 22 C-8 22 -16 18 -15 6 Z" fill="#f6e4cb"/>
      ${eyes === "closed"
        ? `<path d="M-14 1 q5 4 9 0 M5 1 q5 4 9 0" stroke="${INK}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`
        : `<circle cx="-9" cy="1" r="3" fill="${INK}"/><circle cx="9" cy="1" r="3" fill="${INK}"/>`}
      <ellipse cx="0" cy="10" rx="5.5" ry="4" fill="#6e3b2b"/>
    </g>`;

  const ART = {
    notebook: ({ c = "#b8672e", a = "#7f8f6f", dots = false }) => `
      ${shadow()}
      <rect x="56" y="30" width="92" height="134" rx="8" fill="${c}" ${O}/>
      <rect x="58" y="32" width="14" height="130" fill="#000" opacity=".14"/>
      <line x1="72" y1="30" x2="72" y2="164" ${O} opacity=".5"/>
      ${dots ? `<rect x="80" y="40" width="60" height="114" rx="4" fill="none" stroke="#fffaf1" stroke-width="2" stroke-dasharray="4 5" opacity=".7"/>` : ""}
      <rect x="86" y="60" width="50" height="28" rx="4" fill="#fffaf1" ${O}/>
      <path d="M94 70 h34 M94 78 h22" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M112 160 v26 l6 -6 l6 6 v-26" fill="${a}" ${O}/>
      <line x1="138" y1="30" x2="138" y2="164" stroke="${a}" stroke-width="6"/>`,

    pocket: ({ c = "#c9a77c", a = "#7f8f6f" }) => `
      ${shadow(100, 170, 70)}
      <rect x="36" y="56" width="64" height="100" rx="5" fill="${a}" ${O} transform="rotate(-10 68 106)"/>
      <rect x="70" y="50" width="64" height="104" rx="5" fill="#d9a86a" ${O}/>
      <rect x="104" y="46" width="64" height="104" rx="5" fill="${c}" ${O} transform="rotate(8 136 98)"/>
      <path d="M118 70 h30 M118 80 h20" stroke="${INK}" stroke-width="2.5" stroke-linecap="round" transform="rotate(8 136 98)"/>`,

    traveler: ({ c = "#8e4a22" }) => `
      ${shadow()}
      <rect x="50" y="34" width="104" height="132" rx="12" fill="${c}" ${O}/>
      <rect x="60" y="44" width="84" height="112" rx="8" fill="none" stroke="#f6e4cb" stroke-width="2" stroke-dasharray="5 5" opacity=".7"/>
      <line x1="102" y1="34" x2="102" y2="166" stroke="#3b2a20" stroke-width="5"/>
      <path d="M154 100 h22" stroke="#3b2a20" stroke-width="5" stroke-linecap="round"/>
      <circle cx="180" cy="100" r="6" fill="#d9b26a" ${O}/>`,

    pen: ({ c = "#b8672e", a = "#d9b26a" }) => `
      ${shadow(100, 170, 70)}
      <g transform="rotate(-38 100 100)">
        <rect x="26" y="86" width="112" height="28" rx="14" fill="${c}" ${O}/>
        <rect x="26" y="84" width="52" height="32" rx="14" fill="#000" opacity=".18"/>
        <rect x="26" y="84" width="52" height="32" rx="14" fill="none" ${O}/>
        <rect x="36" y="78" width="34" height="7" rx="3" fill="${a}" ${O}/>
        <rect x="80" y="86" width="6" height="28" fill="${a}"/>
        <path d="M138 90 L180 100 L138 110 Z" fill="${a}" ${O}/>
        <path d="M150 100 h22" stroke="${INK}" stroke-width="2"/>
      </g>`,

    ink: ({ c = "#8e4a22" }) => `
      ${shadow()}
      <rect x="60" y="72" width="80" height="94" rx="16" fill="#eef3f0" ${O}/>
      <rect x="66" y="98" width="68" height="62" rx="11" fill="${c}"/>
      <rect x="84" y="54" width="32" height="22" fill="#eef3f0" ${O}/>
      <rect x="78" y="32" width="44" height="26" rx="6" fill="${INK}"/>
      <path d="M84 40 h32" stroke="#fffaf1" stroke-width="2" opacity=".4"/>
      <rect x="74" y="108" width="52" height="34" rx="4" fill="#fffaf1" ${O}/>
      <path d="M82 120 h36 M82 130 h24" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M156 128 c-10 14 -10 22 0 22 c10 0 10 -8 0 -22 Z" fill="${c}" ${O}/>`,

    pencils: ({ cs = ["#7f8f6f", "#b8672e", "#e3b04b"] }) => {
      const p = (x, col, r) => `
        <g transform="rotate(${r} 100 120)">
          <rect x="${x}" y="40" width="22" height="104" fill="${col}" ${O}/>
          <rect x="${x}" y="28" width="22" height="14" rx="3" fill="#f2a7a0" ${O}/>
          <rect x="${x}" y="40" width="22" height="7" fill="#d9b26a" ${O}/>
          <path d="M${x} 144 L${x + 22} 144 L${x + 11} 174 Z" fill="#f3d3a6" ${O}/>
          <path d="M${x + 7} 162 L${x + 15} 162 L${x + 11} 174 Z" fill="${INK}"/>
        </g>`;
      return shadow(100, 178, 54) + p(58, cs[0], -14) + p(89, cs[1], 0) + p(120, cs[2], 14);
    },

    brushpens: ({ cs = ["#b8672e", "#7f8f6f", "#6a8caf", "#e3b04b", "#c76b8a"] }) => {
      const p = (col, r) => `
        <g transform="rotate(${r} 100 168)">
          <rect x="91" y="56" width="18" height="98" rx="4" fill="#fffaf1" ${O}/>
          <rect x="91" y="124" width="18" height="30" rx="4" fill="${col}" ${O}/>
          <path d="M93 56 Q100 22 107 56 Z" fill="${col}" ${O}/>
        </g>`;
      return shadow(100, 176, 56) + cs.map((c, i) => p(c, -36 + i * 18)).join("");
    },

    envelope: ({ c = "#f6e4cb", a = "#b8672e" }) => `
      ${shadow(100, 160, 74)}
      <rect x="40" y="40" width="120" height="86" rx="6" fill="#fffaf1" ${O} transform="rotate(-8 100 83)"/>
      <rect x="30" y="62" width="140" height="92" rx="6" fill="${c}" ${O}/>
      <path d="M30 66 L100 116 L170 66" fill="none" ${O}/>
      <path d="M30 150 L82 104 M170 150 L118 104" ${O} opacity=".35"/>
      <circle cx="100" cy="116" r="15" fill="${a}" ${O}/>
      <circle cx="100" cy="116" r="8" fill="none" stroke="#fffaf1" stroke-width="2" opacity=".6"/>`,

    cards: ({ c = "#f2cfbf", a = "#7f8f6f" }) => `
      ${shadow(100, 170, 66)}
      <rect x="40" y="44" width="90" height="120" rx="4" fill="${c}" ${O} transform="rotate(-9 85 104)"/>
      <rect x="78" y="34" width="90" height="124" rx="4" fill="#fffaf1" ${O} transform="rotate(5 123 96)"/>
      <g transform="rotate(5 123 96)">
        <path d="M122 140 C122 110 126 84 136 62" fill="none" stroke="${a}" stroke-width="3" stroke-linecap="round"/>
        <ellipse cx="114" cy="112" rx="10" ry="5" fill="${a}" transform="rotate(30 114 112)"/>
        <ellipse cx="134" cy="96" rx="10" ry="5" fill="${a}" transform="rotate(-30 134 96)"/>
        <ellipse cx="120" cy="88" rx="9" ry="4.5" fill="${a}" transform="rotate(35 120 88)"/>
        <ellipse cx="140" cy="72" rx="8" ry="4" fill="${a}" transform="rotate(-35 140 72)"/>
        <path d="M98 150 c0 -4 8 -4 8 0" stroke="#b8672e" stroke-width="2" fill="none"/>
      </g>`,

    postcards: ({ cs = ["#7f8f6f", "#e3b04b", "#b8672e"] }) => `
      ${shadow(100, 168, 72)}
      ${cs.map((c, i) => `
        <g transform="rotate(${-12 + i * 10} 100 104)">
          <rect x="36" y="${56 + i * 6}" width="128" height="86" rx="4" fill="#fffaf1" ${O}/>
          <rect x="44" y="${64 + i * 6}" width="62" height="70" rx="2" fill="${c}"/>
          <path d="M44 ${120 + i * 6} l16 -18 l14 12 l12 -10 l20 16 v14 h-62 Z" fill="#000" opacity=".15"/>
          <circle cx="90" cy="${80 + i * 6}" r="6" fill="#fbe9a6"/>
          <rect x="138" y="${62 + i * 6}" width="18" height="22" fill="none" stroke="${INK}" stroke-width="2" stroke-dasharray="3 2"/>
          <path d="M116 ${108 + i * 6} h36 M116 ${118 + i * 6} h30" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>
        </g>`).join("")}`,

    waxseal: ({ c = "#a3342f" }) => `
      ${shadow(100, 170, 64)}
      <g transform="rotate(32 140 70)">
        <rect x="128" y="10" width="24" height="70" rx="6" fill="#c9a77c" ${O}/>
        <rect x="124" y="76" width="32" height="16" rx="3" fill="#d9b26a" ${O}/>
      </g>
      <path d="M58 122 C42 102 56 76 80 74 C96 62 122 68 130 86 C150 94 152 126 136 140 C130 160 100 168 84 156 C62 158 46 140 58 122 Z" fill="${c}" ${O}/>
      <circle cx="96" cy="116" r="30" fill="none" stroke="#000" stroke-width="3" opacity=".2"/>
      <g opacity=".5">${pupFace(96, 120, .8)}</g>`,

    planner: ({ c = "#7f8f6f", tabs = ["#b8672e", "#e3b04b", "#f2cfbf"] }) => `
      ${shadow()}
      ${tabs.map((t, i) => `<rect x="138" y="${50 + i * 26}" width="22" height="20" rx="4" fill="${t}" ${O}/>`).join("")}
      <rect x="52" y="30" width="96" height="136" rx="8" fill="${c}" ${O}/>
      ${[0, 1, 2, 3, 4, 5].map(i => `<circle cx="64" cy="${48 + i * 20}" r="5" fill="#d9b26a" ${O}/>`).join("")}
      <rect x="80" y="56" width="54" height="34" rx="4" fill="#fffaf1" ${O}/>
      <text x="107" y="80" text-anchor="middle" font-family="Georgia, serif" font-size="16" font-weight="700" fill="${INK}">2027</text>`,

    calendar: ({ c = "#b8672e" }) => `
      ${shadow(100, 170, 70)}
      <path d="M50 164 L80 44 L120 44 L150 164 Z" fill="#c9a77c" ${O}/>
      <rect x="44" y="50" width="112" height="112" rx="6" fill="#fffaf1" ${O}/>
      <rect x="44" y="50" width="112" height="28" rx="6" fill="${c}" ${O}/>
      <circle cx="70" cy="50" r="4" fill="${INK}"/><circle cx="130" cy="50" r="4" fill="${INK}"/>
      ${Array.from({ length: 20 }, (_, i) => `<rect x="${54 + (i % 5) * 19}" y="${88 + Math.floor(i / 5) * 17}" width="12" height="10" rx="2" fill="${INK}" opacity=".18"/>`).join("")}
      <circle cx="98" cy="110" r="11" fill="none" stroke="${c}" stroke-width="3"/>`,

    notepad: ({ c = "#e3b04b" }) => `
      ${shadow()}
      <rect x="54" y="38" width="92" height="128" rx="4" fill="#fffaf1" ${O}/>
      <rect x="54" y="32" width="92" height="20" rx="4" fill="${c}" ${O}/>
      ${[0, 1, 2, 3, 4].map(i => `
        <rect x="66" y="${66 + i * 20}" width="10" height="10" rx="2" fill="none" stroke="${INK}" stroke-width="2.5"/>
        <path d="M84 ${71 + i * 20} h${48 - (i % 2) * 14}" stroke="${INK}" stroke-width="2.5" stroke-linecap="round" opacity=".55"/>`).join("")}
      <path d="M67 70 l3 4 l7 -8 M67 90 l3 4 l7 -8" stroke="#b8672e" stroke-width="3" fill="none" stroke-linecap="round"/>`,

    palette: ({ cs = ["#b8672e", "#e3b04b", "#7f8f6f", "#6a8caf", "#c76b8a", "#3b2a20", "#f2cfbf", "#a3342f", "#5e6d50", "#d9a86a", "#8e4a22", "#9fb6c9"] }) => `
      ${shadow(100, 158, 76)}
      <rect x="26" y="58" width="148" height="92" rx="12" fill="#e2e7d6" ${O}/>
      ${cs.map((c, i) => `<rect x="${38 + (i % 6) * 21}" y="${70 + Math.floor(i / 6) * 34}" width="16" height="26" rx="4" fill="${c}" ${O} stroke-width="2.5"/>`).join("")}
      <g transform="rotate(-20 120 40)">
        <rect x="70" y="34" width="100" height="8" rx="4" fill="#c9a77c" ${O}/>
        <path d="M70 38 l-18 -6 q-8 6 0 12 Z" fill="${INK}"/>
      </g>`,

    sketchbook: ({ c = "#3b2a20" }) => `
      ${shadow()}
      <rect x="44" y="48" width="112" height="116" rx="6" fill="${c}" ${O}/>
      ${Array.from({ length: 8 }, (_, i) => `<path d="M${56 + i * 13} 56 v-14 a5 5 0 0 1 10 0 v14" fill="none" stroke="#c9b28a" stroke-width="3"/>`).join("")}
      <rect x="62" y="80" width="76" height="64" rx="4" fill="#fffaf1" ${O}/>
      <path d="M70 132 c10 -24 18 -30 26 -12 c6 12 12 -18 22 -20 c8 -2 10 14 12 18" fill="none" stroke="#b8672e" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="122" cy="96" r="6" fill="#e3b04b"/>`,

    washi: ({ cs = ["#f2cfbf", "#e2e7d6", "#b8672e"] }) => {
      const roll = (x, y, c, pat) => `
        <circle cx="${x}" cy="${y}" r="34" fill="${c}" ${O}/>
        <circle cx="${x}" cy="${y}" r="27" fill="none" stroke="#fffaf1" stroke-width="2" stroke-dasharray="${pat}" opacity=".9"/>
        <circle cx="${x}" cy="${y}" r="15" fill="#fffaf1" ${O}/>`;
      return shadow(100, 168, 76) +
        `<path d="M130 132 L182 150 L176 164 L124 146 Z" fill="${cs[2]}" ${O} opacity=".9"/>` +
        roll(64, 120, cs[0], "4 4") + roll(136, 120, cs[2], "2 6") + roll(100, 74, cs[1], "8 4");
    },

    stickers: () => `
      ${shadow(100, 172, 64)}
      <rect x="44" y="30" width="112" height="140" rx="8" fill="#fffaf1" ${O}/>
      ${pupFace(74, 70, .6)}${pupFace(124, 72, .6, "open")}
      <circle cx="74" cy="122" r="14" fill="#e3b04b" ${O}/>
      <path d="M118 108 l6 12 l13 2 l-10 9 l3 13 l-12 -7 l-12 7 l3 -13 l-10 -9 l13 -2 Z" fill="#7f8f6f" ${O}/>
      <rect x="58" y="146" width="40" height="12" rx="6" fill="#f2cfbf" ${O}/>
      <path d="M110 152 c6 -8 12 -8 18 0 c6 8 12 8 18 0" fill="none" stroke="#b8672e" stroke-width="3" stroke-linecap="round"/>`,

    labels: ({ c = "#d9a86a" }) => {
      const tag = (x, y, r) => `
        <g transform="rotate(${r} ${x + 40} ${y + 24})">
          <path d="M${x} ${y} h70 l14 24 l-14 24 h-70 Z" fill="${c}" ${O}/>
          <circle cx="${x + 70}" cy="${y + 24}" r="5" fill="#fffaf1" ${O}/>
          <path d="M${x + 12} ${y + 18} h40 M${x + 12} ${y + 30} h28" stroke="${INK}" stroke-width="2.5" stroke-linecap="round" opacity=".6"/>
        </g>`;
      return shadow(100, 172, 66) + tag(40, 40, -10) + tag(56, 84, 4) + tag(44, 124, -4);
    },

    bookmark: ({ c = "#d9b26a" }) => `
      ${shadow(100, 176, 40)}
      <path d="M82 22 h36 v130 l-18 -14 l-18 14 Z" fill="${c}" ${O}/>
      <circle cx="100" cy="40" r="6" fill="#fffaf1" ${O}/>
      <path d="M100 46 c0 30 0 70 0 90" stroke="#000" stroke-width="2" opacity=".15"/>
      <path d="M100 34 C120 10 140 20 138 40" fill="none" stroke="#b8672e" stroke-width="3"/>
      <path d="M134 40 l-6 34 h20 Z" fill="#b8672e" ${O}/>`,

    candle: ({ c = "#c9a77c" }) => `
      ${shadow()}
      <path d="M100 32 c-12 16 -12 30 0 32 c12 -2 12 -16 0 -32 Z" fill="#f3a03d" ${O}/>
      <path d="M100 46 c-4 6 -4 12 0 14 c4 -2 4 -8 0 -14 Z" fill="#fbe9a6"/>
      <path d="M100 64 v12" stroke="${INK}" stroke-width="3"/>
      <rect x="58" y="70" width="84" height="98" rx="14" fill="${c}" ${O}/>
      <ellipse cx="100" cy="80" rx="36" ry="8" fill="#fffaf1" opacity=".7"/>
      <rect x="70" y="104" width="60" height="40" rx="4" fill="#fffaf1" ${O}/>
      <text x="100" y="128" text-anchor="middle" font-family="Georgia, serif" font-size="12" font-style="italic" fill="${INK}">old paper</text>`,

    tote: ({ c = "#f6e4cb" }) => `
      ${shadow(100, 178, 60)}
      <path d="M74 66 C74 22 126 22 126 66" fill="none" ${O} stroke-width="6"/>
      <path d="M50 62 h100 l8 112 h-116 Z" fill="${c}" ${O}/>
      ${pupFace(100, 112, 1)}
      <text x="100" y="158" text-anchor="middle" font-family="Georgia, serif" font-size="13" font-style="italic" fill="${INK}">nap club</text>`,

    giftcard: ({ c = "#b8672e" }) => `
      ${shadow(100, 160, 74)}
      <rect x="30" y="52" width="140" height="96" rx="12" fill="${c}" ${O}/>
      <rect x="30" y="92" width="140" height="14" fill="#fbe9a6" ${O}/>
      <rect x="112" y="52" width="14" height="96" fill="#fbe9a6" ${O}/>
      <path d="M119 92 c-20 -26 -40 -6 -20 4 Z M119 92 c20 -26 40 -6 20 4 Z" fill="#fbe9a6" ${O}/>
      <text x="44" y="78" font-family="Georgia, serif" font-size="15" font-weight="700" fill="#fffaf1">Commonplace</text>
      <text x="44" y="134" font-family="Georgia, serif" font-size="13" font-style="italic" fill="#fffaf1">a little something</text>`,

    kit: () => `
      ${shadow(100, 172, 74)}
      <rect x="28" y="72" width="144" height="94" rx="8" fill="#c9a77c" ${O}/>
      <rect x="44" y="44" width="52" height="74" rx="5" fill="#7f8f6f" ${O} transform="rotate(-8 70 80)"/>
      <rect x="88" y="40" width="54" height="78" rx="5" fill="#b8672e" ${O} transform="rotate(6 115 80)"/>
      <g transform="rotate(-30 140 60)"><rect x="120" y="54" width="60" height="12" rx="6" fill="#3b2a20"/><path d="M180 54 l14 6 l-14 6 Z" fill="#d9b26a"/></g>
      <rect x="28" y="96" width="144" height="70" rx="8" fill="#d9a86a" ${O}/>
      <rect x="72" y="116" width="56" height="26" rx="4" fill="#fffaf1" ${O}/>
      <path d="M82 129 h36" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>`
  };

  function art(kind, opts = {}, bg = "#f6dfca") {
    const body = (ART[kind] || ART.notebook)(opts);
    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" preserveAspectRatio="xMidYMid slice"><rect width="200" height="200" fill="${bg}"/><circle cx="160" cy="36" r="46" fill="#fff" opacity=".22"/><circle cx="30" cy="190" r="40" fill="#fff" opacity=".18"/>${body}</svg>`;
  }

  const CATEGORIES = [
    { id: "notebooks", name: "Notebooks & Journals", blurb: "Dot grid, lined, blank & beautiful", art: ["notebook", { c: "#7f8f6f", a: "#b8672e" }], bg: "#f6dfca" },
    { id: "pens", name: "Pens, Pencils & Ink", blurb: "Fountain pens, fineliners & bottled ink", art: ["pen", { c: "#3b2a20" }], bg: "#e2e7d6" },
    { id: "letters", name: "Cards & Letter Writing", blurb: "For the art of the handwritten note", art: ["envelope", {}], bg: "#f2cfbf" },
    { id: "planners", name: "Planners & Calendars", blurb: "Gentle structure for your days", art: ["planner", {}], bg: "#fbe9a6" },
    { id: "art", name: "Art & Sketch", blurb: "Watercolors, brush pens & sketchbooks", art: ["palette", {}], bg: "#dfe6ef" },
    { id: "washi", name: "Washi & Stickers", blurb: "Little things that make pages sing", art: ["washi", {}], bg: "#f6e4cb" },
    { id: "desk", name: "Desk & Gifts", blurb: "Candles, bookmarks & cozy extras", art: ["candle", {}], bg: "#e2e7d6" },
    { id: "gifts", name: "Gift Cards", blurb: "When you can't decide (we get it)", art: ["giftcard", {}], bg: "#f2cfbf" }
  ];

  const P = (o) => Object.assign({ rating: 4.8, reviews: 24, badge: null, options: null, details: [] }, o);

  const PRODUCTS = [
    P({ id: "commonplace-cloth-journal", name: "Commonplace Cloth Journal", cat: "notebooks", price: 28, badge: "pup",
        art: ["notebook", { c: "#b8672e", a: "#7f8f6f", dots: true }], bg: "#f6dfca", featured: true, rating: 4.9, reviews: 128,
        short: "Our signature A5 linen-bound journal with 192 pages of creamy 100gsm paper.",
        desc: "The notebook we built the shop around. Bound in rust-colored linen (the exact shade of our shop dog, naturally), it lays flat, takes fountain pen ink without a whisper of bleed, and has two ribbon markers for keeping your place in more than one story.",
        options: { label: "Ruling", values: ["Dot grid", "Lined", "Blank"] },
        details: ["A5 (148 × 210 mm), 192 numbered pages", "100gsm acid-free cream paper", "Lay-flat sewn binding", "Two ribbon markers + back pocket", "Indexed contents pages"] }),
    P({ id: "pocket-field-notes", name: "Pocket Field Notebooks, 3-pack", cat: "notebooks", price: 14, badge: "new",
        art: ["pocket", {}], bg: "#e2e7d6", featured: true, rating: 4.7, reviews: 56,
        short: "Kraft-covered pocket notebooks for lists, sketches & stray thoughts.",
        desc: "Three saddle-stitched notebooks that live happily in a back pocket or tote. Grid inside, kraft outside, and plenty of room for grocery lists, overheard poetry and the names of good dogs you meet.",
        options: { label: "Ruling", values: ["Graph", "Lined", "Blank"] },
        details: ["3.5 × 5.5 in, 48 pages each", "70gsm paper, recycled kraft cover", "Rounded corners"] }),
    P({ id: "leather-traveler", name: "Leather Traveler's Notebook", cat: "notebooks", price: 48, badge: "staff",
        art: ["traveler", {}], bg: "#f6e4cb", rating: 4.9, reviews: 41,
        short: "Full-grain leather cover with refillable inserts that ages beautifully.",
        desc: "A soft leather cover held together with an elastic band and brass charm. Slip in up to four inserts and it becomes whatever you need: a travel log, sketchbook or planner. It'll only get better with every scuff.",
        options: { label: "Leather", values: ["Chestnut", "Tobacco", "Black"] },
        details: ["Full-grain vegetable-tanned leather", "Includes 1 lined insert", "Regular size: 4.3 × 8.3 in"] }),
    P({ id: "kraft-sketch-notebook", name: "Scribble & Sketch Kraft Notebook", cat: "notebooks", price: 12,
        art: ["notebook", { c: "#c9a77c", a: "#b8672e" }], bg: "#dfe6ef", rating: 4.6, reviews: 33,
        short: "An everyday notebook that's happy to be scribbled in.",
        desc: "Not every notebook needs to be precious. This one's for messy brainstorms, half-formed ideas and doodles in the margins.",
        options: { label: "Size", values: ["A5", "A6"] },
        details: ["80 pages, blank", "120gsm smooth paper", "Kraft board cover"] }),

    P({ id: "brass-fountain-pen", name: "Brass Pocket Fountain Pen", cat: "pens", price: 42, badge: "staff",
        art: ["pen", { c: "#d9b26a", a: "#b8672e" }], bg: "#e2e7d6", featured: true, rating: 4.9, reviews: 87,
        short: "A solid brass pocket pen that develops a lovely patina over time.",
        desc: "Weighty, smooth, and small enough to tuck in a shirt pocket. It takes standard international cartridges and converters, and you're welcome to test-drive it at our pen bar before you take it home.",
        options: { label: "Nib", values: ["Extra fine", "Fine", "Medium"] },
        details: ["Raw brass body, steel nib", "Takes short international cartridges", "Includes 2 cartridges (black)"] }),
    P({ id: "ink-rust-ember", name: "Bottled Ink — Rust & Ember", cat: "pens", price: 18, badge: "pup",
        art: ["ink", { c: "#a8582a" }], bg: "#f6dfca", featured: true, rating: 4.8, reviews: 64,
        short: "A warm, shading brown-orange inspired by a certain sleepy pup.",
        desc: "Our house ink: a toasty rust that shades from amber to deep chestnut. Well behaved, quick-ish drying, and a joy in a broad nib.",
        options: { label: "Color", values: ["Rust & Ember", "Sage Garden", "Midnight Library"] },
        details: ["50 ml glass bottle", "Water-based, non-permanent", "Safe for all fountain pens"] }),
    P({ id: "walnut-pencil-set", name: "Walnut Pencil Set", cat: "pens", price: 16,
        art: ["pencils", {}], bg: "#fbe9a6", rating: 4.7, reviews: 29,
        short: "Six HB pencils with a little brass sharpener.",
        desc: "Smooth graphite, cedar barrels, and pink erasers that actually erase. Comes with a solid brass wedge sharpener in a recycled tin.",
        details: ["6 HB pencils", "Brass wedge sharpener", "Recycled tin case"] }),
    P({ id: "fineliner-set", name: "Archival Fineliner Set", cat: "pens", price: 15, badge: "new",
        art: ["brushpens", { cs: ["#3b2a20", "#3b2a20", "#3b2a20", "#3b2a20", "#3b2a20"] }], bg: "#dfe6ef", rating: 4.6, reviews: 18,
        short: "Five pigment fineliners from 0.05 to 0.8 mm.",
        desc: "Waterproof, fade-resistant pigment ink in five tip sizes, ideal for journaling, line art and tiny handwriting.",
        details: ["Sizes 0.05, 0.1, 0.3, 0.5, 0.8 mm", "Archival pigment ink", "Won't smear under watercolor"] }),

    P({ id: "cotton-letter-set", name: "Cotton Letter Writing Set", cat: "letters", price: 22, badge: "staff",
        art: ["envelope", { c: "#f6e4cb", a: "#b8672e" }], bg: "#f2cfbf", featured: true, rating: 4.9, reviews: 52,
        short: "20 sheets of cotton paper & 10 lined envelopes for long letters.",
        desc: "Heavy cotton paper with a soft deckle edge, and envelopes lined in a tiny quilt-pattern print. Made for letters that get kept in shoeboxes for decades.",
        details: ["20 A5 sheets, 120gsm cotton", "10 lined C5 envelopes", "Fountain pen friendly"] }),
    P({ id: "deckle-notecards", name: "Deckle-Edge Notecards, Set of 8", cat: "letters", price: 16,
        art: ["cards", {}], bg: "#e2e7d6", rating: 4.8, reviews: 37,
        short: "Hand-torn edges and a little botanical sprig on each card.",
        desc: "Blank inside so you can say exactly what you mean. Printed on soft handmade paper with kraft envelopes.",
        details: ["8 folded cards + envelopes", "A2 size (4.25 × 5.5 in)", "Blank inside"] }),
    P({ id: "pup-wax-seal", name: "Sleeping Pup Wax Seal Kit", cat: "letters", price: 26, badge: "pup",
        art: ["waxseal", {}], bg: "#f6e4cb", featured: true, rating: 5.0, reviews: 43,
        short: "A brass stamp featuring our napping shop dog, plus wax sticks.",
        desc: "Seal your letters with a tiny curled-up pup. Includes a wooden-handled brass stamp and three sticks of wax in rust, sage and cream.",
        details: ["25 mm brass stamp, beech handle", "3 sealing wax sticks", "Gift box included"] }),
    P({ id: "postcard-pack", name: "Little Town Postcard Pack", cat: "letters", price: 12,
        art: ["postcards", {}], bg: "#dfe6ef", rating: 4.7, reviews: 21,
        short: "Twelve illustrated postcards for sending hellos.",
        desc: "Twelve original illustrations of reading nooks, rainy windows and corner shops. Postcard-weight and ready for stamps.",
        details: ["12 postcards, 4 × 6 in", "350gsm uncoated stock", "Printed locally"] }),

    P({ id: "undated-planner", name: "Undated Weekly Planner", cat: "planners", price: 30, badge: "new",
        art: ["planner", {}], bg: "#fbe9a6", featured: true, rating: 4.8, reviews: 74,
        short: "Start any week, any time. No guilt over blank pages.",
        desc: "Fifty-two undated week-on-two-pages spreads, monthly overviews and a few pages for reflection. Gentle structure, plenty of breathing room.",
        options: { label: "Cover", values: ["Sage", "Rust", "Oat"] },
        details: ["A5, 176 pages", "Week-on-two-pages layout", "Index tabs & pocket"] }),
    P({ id: "desk-calendar", name: "2027 Easel Desk Calendar", cat: "planners", price: 20,
        art: ["calendar", {}], bg: "#f6dfca", rating: 4.6, reviews: 15,
        short: "A month at a glance on a stand-up kraft easel.",
        desc: "Thirteen illustrated months (one bonus December) on a sturdy kraft easel that folds flat.",
        details: ["13 months, Dec 2026 – Dec 2027", "6 × 6 in", "Recyclable easel"] }),
    P({ id: "to-do-notepad", name: "Little Lists Notepad", cat: "planners", price: 10,
        art: ["notepad", {}], bg: "#e2e7d6", rating: 4.7, reviews: 48,
        short: "Tear-off checklists for the everyday.",
        desc: "Fifty tear-off sheets with checkboxes for to-dos, groceries or things-that-made-you-smile.",
        details: ["50 sheets", "4 × 6 in", "Glue-bound top"] }),

    P({ id: "watercolor-palette", name: "Pocket Watercolor Palette", cat: "art", price: 34, badge: "staff",
        art: ["palette", {}], bg: "#dfe6ef", featured: true, rating: 4.9, reviews: 39,
        short: "12 handmade half-pans in a pocket-sized tin with a travel brush.",
        desc: "Hand-poured artist-grade watercolors in a sage tin, curated for cozy landscapes, botanicals and the occasional sleeping dog.",
        details: ["12 half-pans", "Travel brush included", "Mixing tray in lid"] }),
    P({ id: "brush-pen-set", name: "Dual Brush Pen Set", cat: "art", price: 18,
        art: ["brushpens", {}], bg: "#f2cfbf", rating: 4.6, reviews: 27,
        short: "Five blendable brush pens in a warm autumn palette.",
        desc: "Flexible brush tips on one end, fine bullet tips on the other. Perfect for hand-lettering and color washes.",
        details: ["5 dual-tip pens", "Water-based, blendable", "Autumn palette"] }),
    P({ id: "hardcover-sketchbook", name: "Hardcover Spiral Sketchbook", cat: "art", price: 22,
        art: ["sketchbook", {}], bg: "#f6e4cb", rating: 4.7, reviews: 22,
        short: "Mixed-media paper that handles pencil, ink and light washes.",
        desc: "A sturdy wire-bound sketchbook that folds back on itself, so you can draw anywhere: in your lap, at the cafe, on the floor beside the dog.",
        options: { label: "Size", values: ["A5", "A4"] },
        details: ["60 sheets, 160gsm mixed-media", "Black linen hardcover", "Wire-bound"] }),

    P({ id: "quilt-washi-trio", name: "Patchwork Quilt Washi Trio", cat: "washi", price: 12, badge: "new",
        art: ["washi", {}], bg: "#f6e4cb", featured: true, rating: 4.8, reviews: 46,
        short: "Three rolls inspired by a well-loved floral quilt.",
        desc: "Peachy florals, sage gingham and a rust stripe: soft, tearable and repositionable. (Yes, it's the same quilt our shop dog naps on.)",
        details: ["3 rolls, 15 mm × 10 m", "Repositionable", "Japanese washi paper"] }),
    P({ id: "pup-sticker-sheet", name: "Sleepy Pup Sticker Sheet", cat: "washi", price: 5, badge: "pup",
        art: ["stickers", {}], bg: "#e2e7d6", rating: 5.0, reviews: 91,
        short: "Our shop dog in sticker form, plus tiny stars & squiggles.",
        desc: "Matte vinyl stickers starring our resident napper. Waterproof enough for water bottles; cute enough for your best journal spread.",
        details: ["1 A6 sheet, 14 stickers", "Matte, waterproof vinyl"] }),
    P({ id: "library-labels", name: "Vintage Library Labels", cat: "washi", price: 7,
        art: ["labels", {}], bg: "#dfe6ef", rating: 4.6, reviews: 19,
        short: "Kraft tags and label stickers for organizing your shelves.",
        desc: "Sixty kraft label stickers in classic library shapes, for book spines, jars and gift tags.",
        details: ["60 stickers, 3 shapes", "Writable kraft paper"] }),

    P({ id: "brass-bookmark", name: "Brass Tassel Bookmark", cat: "desk", price: 14,
        art: ["bookmark", {}], bg: "#f2cfbf", rating: 4.8, reviews: 34,
        short: "A slim brass bookmark with a rust silk tassel.",
        desc: "Thin enough to never crack a spine, pretty enough to leave peeking out on purpose.",
        details: ["Solid brass, 5 in", "Silk tassel"] }),
    P({ id: "old-paper-candle", name: "Old Paper & Cedar Candle", cat: "desk", price: 24, badge: "staff",
        art: ["candle", {}], bg: "#fbe9a6", featured: true, rating: 4.9, reviews: 58,
        short: "Smells like a secondhand bookshop on a rainy afternoon.",
        desc: "Notes of aged paper, cedarwood, a whisper of vanilla and black tea. Hand-poured soy wax in an amber jar. Our most-asked-about scent in the shop.",
        details: ["8 oz soy wax, cotton wick", "~45 hour burn time", "Reusable amber jar"] }),
    P({ id: "nap-club-tote", name: "“Nap Club” Canvas Tote", cat: "desk", price: 22, badge: "pup",
        art: ["tote", {}], bg: "#e2e7d6", rating: 4.9, reviews: 67,
        short: "Heavyweight canvas tote with our sleeping pup on the front.",
        desc: "Fits a laptop, three notebooks, and a baguette. Printed with our club mascot, who has never once been late for a nap.",
        details: ["12 oz natural cotton canvas", "15 × 16 in, inner pocket"] }),
    P({ id: "commonplace-starter-kit", name: "Commonplace Book Starter Kit", cat: "desk", price: 58, compare: 66, badge: "staff",
        art: ["kit", {}], bg: "#f6dfca", featured: true, rating: 4.9, reviews: 31,
        short: "Everything you need to begin a commonplace book.",
        desc: "Our cloth journal, a brass pocket pen, a bottle of house ink and a little booklet on keeping a commonplace book: collecting quotes, recipes, ideas and small joys in one place. Gift-wrapped in kraft and twine.",
        details: ["Commonplace Cloth Journal", "Brass Pocket Fountain Pen", "Rust & Ember ink, 50 ml", "How-to booklet + gift wrap"] }),

    P({ id: "gift-card", name: "Commonplace Gift Card", cat: "gifts", price: 25,
        art: ["giftcard", {}], bg: "#f2cfbf", rating: 5.0, reviews: 12,
        short: "Redeemable in the shop or online. Never expires.",
        desc: "For the friend who has everything except the perfect notebook. Delivered by email with a note from you, or picked up in the shop in a little envelope.",
        options: { label: "Amount", values: ["$25", "$50", "$75", "$100"] },
        details: ["Never expires", "Use in-store or online", "Personal message included"] })
  ];

  window.Commonplace = { CATEGORIES, PRODUCTS, art, pupFace };
})();
