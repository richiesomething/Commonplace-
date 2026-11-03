// Event sign-up. Sends each sign-up to a Google Sheet through a Google Apps
// Script web app (see google-apps-script/Code.gs and js/config.js).
(function () {
  const cfg = window.COMMONPLACE || {};
  const url = cfg.SIGNUP_URL || "";
  const contact = cfg.CONTACT_EMAIL || "";

  const dialog = document.getElementById("signup-dialog");
  const form = document.getElementById("signup-form");
  const done = document.getElementById("signup-done");
  const error = document.getElementById("signup-error");
  const submit = form.querySelector('button[type="submit"]');
  const seatsSelect = document.getElementById("signup-seats");
  const seatOptions = Array.from(seatsSelect.options).map((o) => o.value);

  let current = null;   // the event being signed up for
  let spotsLeft = {};   // eventId -> spots left, for events with a limit

  // Buttons carry the event: data-signup (date), data-event (name), data-event-id.
  function open(e) {
    const d = e.currentTarget.dataset;
    current = { id: d.eventId || "", name: d.event || "Workshop", date: d.signup || "" };
    document.getElementById("signup-title").textContent = d.event || "Workshop Sign-Up";
    document.getElementById("signup-when").textContent = current.date;
    document.getElementById("signup-done-when").textContent = current.date;
    form.reset();
    limitSeats(spotsLeft[current.id]);
    form.hidden = false;
    done.hidden = true;
    error.hidden = true;
    setBusy(false);
    dialog.showModal();
    document.getElementById("signup-name").focus();
  }

  // Don't offer more seats than are left.
  function limitSeats(left) {
    seatsSelect.innerHTML = "";
    const max = typeof left === "number" ? Math.max(1, Math.min(left, seatOptions.length)) : seatOptions.length;
    seatOptions.slice(0, max).forEach((v) => seatsSelect.add(new Option(v, v)));
  }

  function setBusy(busy) {
    submit.disabled = busy;
    submit.textContent = busy ? "Saving…" : "Save My Seat";
  }

  function showError(msg, field) {
    error.textContent = msg;
    error.hidden = false;
    if (field) field.focus();
  }

  // Buttons start as "Sign Ups Will Be Open Soon". Once SIGNUP_URL is set they
  // switch to their real label (data-open-label) and open the form.
  document.querySelectorAll("[data-signup]").forEach((btn) => {
    if (url) {
      btn.textContent = btn.dataset.openLabel || "Sign Up";
      btn.disabled = false;
    }
    btn.addEventListener("click", open);
  });
  document.getElementById("signup-cancel").addEventListener("click", () => dialog.close());
  document.getElementById("signup-close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (e) => { if (e.target === dialog) dialog.close(); });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = form.elements.name.value.trim();
    const email = form.elements.email;
    if (!name) return showError("Add your name so we know who's coming.", form.elements.name);
    if (!email.value.trim() || !email.validity.valid) return showError("Add an email address like you@example.com.", email);

    if (!url) {
      return showError(`Online sign-up isn't open yet. To save a seat, email us at ${contact}.`);
    }

    setBusy(true);
    error.hidden = true;
    try {
      const res = await fetch(url, {
        method: "POST",
        // text/plain keeps this a "simple" request that Apps Script accepts
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          eventId: current.id, event: current.name, date: current.date,
          name, email: email.value.trim(), seats: seatsSelect.value,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        if (typeof data.spotsLeft === "number") updateSpots(current.id, data.spotsLeft);
        form.hidden = true;
        done.hidden = false;
        document.getElementById("signup-close").focus();
      } else if (data.error === "full") {
        updateSpots(current.id, 0);
        showError("Sorry, this event just filled up.");
      } else if (data.error === "not_enough") {
        updateSpots(current.id, data.spotsLeft);
        limitSeats(data.spotsLeft);
        showError(`Only ${data.spotsLeft} ${data.spotsLeft === 1 ? "spot is" : "spots are"} left. Choose fewer seats.`, seatsSelect);
      } else {
        showError("Check your name and email, then try again.");
      }
    } catch (err) {
      showError(`We couldn't save your seat. Check your connection and try again, or email us at ${contact}.`);
    } finally {
      setBusy(false);
    }
  });

  // Show spots left next to events that have a limit, and close full ones.
  function updateSpots(id, left) {
    spotsLeft[id] = left;
    document.querySelectorAll(`[data-spots-for="${id}"]`).forEach((el) => {
      el.textContent = left > 0 ? `Only ${left} ${left === 1 ? "spot" : "spots"} left!` : "This event is full.";
      el.classList.toggle("is-full", left <= 0);
    });
    document.querySelectorAll(`[data-event-id="${id}"]`).forEach((btn) => {
      btn.disabled = left <= 0;
      if (left <= 0) btn.textContent = "Full";
    });
  }

  if (url) {
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        if (data && data.spotsLeft) Object.entries(data.spotsLeft).forEach(([id, n]) => updateSpots(id, n));
      })
      .catch(() => {}); // keep the default "Limited spots" text if this fails
  }
})();
