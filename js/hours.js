// Store hours: [open, close] in 24-hour time, indexed Sunday (0) to Saturday (6).
// Keep in sync with the table in index.html. Use null for a closed day.
const HOURS = [[11, 17], [10, 18], [10, 18], [10, 18], [10, 20], [10, 20], [9, 18]];

(function () {
  const now = new Date();
  const day = now.getDay();
  const row = document.querySelector(`.hours-table tr[data-day="${day}"]`);
  if (row) row.classList.add("today");

  const status = document.getElementById("open-status");
  const h = HOURS[day];
  const t = now.getHours() + now.getMinutes() / 60;
  const open = h && t >= h[0] && t < h[1];
  status.textContent = open ? "Open now" : "Closed now";
  status.classList.toggle("is-open", Boolean(open));
  status.hidden = false;
})();
