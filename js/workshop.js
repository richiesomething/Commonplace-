// Workshop sign-up. Demo only for now: entries are not saved or sent anywhere.
(function () {
  const dialog = document.getElementById("signup-dialog");
  const form = document.getElementById("signup-form");
  const done = document.getElementById("signup-done");
  const error = document.getElementById("signup-error");

  function open() {
    form.reset();
    form.hidden = false;
    done.hidden = true;
    error.hidden = true;
    dialog.showModal();
    document.getElementById("signup-name").focus();
  }

  document.getElementById("workshop-signup").addEventListener("click", open);
  document.getElementById("signup-cancel").addEventListener("click", () => dialog.close());
  document.getElementById("signup-close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (e) => { if (e.target === dialog) dialog.close(); });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.elements.name.value.trim();
    const email = form.elements.email;
    if (!name) return showError("Add your name so we know who's coming.", form.elements.name);
    if (!email.value.trim() || !email.validity.valid) return showError("Add an email address like you@example.com.", email);
    form.hidden = true;
    done.hidden = false;
    document.getElementById("signup-close").focus();
  });

  function showError(msg, field) {
    error.textContent = msg;
    error.hidden = false;
    field.focus();
  }
})();
