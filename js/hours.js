// Store hours: [open, close] in 24-hour time, indexed Sunday (0) to Saturday (6).
// Keep in sync with the table in index.html. Use null for a closed day.
const HOURS = [[10, 18], [9, 18], [9, 18], [9, 18], [9, 18], [9, 18], [9, 18]];

(function () {
  const now = new Date();
  const day = now.getDay();
  document.querySelectorAll(".hours-table tr[data-days]").forEach((tr) => {
    if (tr.dataset.days.split(" ").includes(String(day))) tr.classList.add("today");
  });

  const status = document.getElementById("open-status");
  const h = HOURS[day];
  const t = now.getHours() + now.getMinutes() / 60;
  const open = h && t >= h[0] && t < h[1];
  status.textContent = open ? "Open now" : "Closed now";
  status.classList.toggle("is-open", Boolean(open));
  status.hidden = false;
})();
