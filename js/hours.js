// Store hours: [open, close] in 24-hour time, indexed Sunday (0) to Saturday (6).
// Keep in sync with the table in index.html. Use null for a closed day.
const HOURS = [[10, 16], [9, 18], [9, 18], [9, 18], [9, 18], [9, 18], [9, 18]];

// The day the shop opens, as "YYYY-MM-DD". Until then the badge says
// "Opening Soon" instead of Open now / Closed now. Leave null if not set yet.
const OPENS_ON = null;

(function () {
  const now = new Date();
  const day = now.getDay();
  document.querySelectorAll(".hours-table tr[data-days]").forEach((tr) => {
    if (tr.dataset.days.split(" ").includes(String(day))) tr.classList.add("today");
  });

  const status = document.getElementById("open-status");
  status.hidden = false;
  if (!OPENS_ON || now < new Date(OPENS_ON + "T00:00:00")) {
    status.textContent = "Opening Soon";
    status.classList.add("is-soon");
    return;
  }

  const h = HOURS[day];
  const t = now.getHours() + now.getMinutes() / 60;
  const open = h && t >= h[0] && t < h[1];
  status.textContent = open ? "Open now" : "Closed now";
  status.classList.toggle("is-open", Boolean(open));
})();
