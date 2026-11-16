/* =========================================================
   ODDAWURLD — Form validation (newsletter, contact, account)
   No backend: everything is validated & confirmed in the browser.
   ========================================================= */
(() => {
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  /* ----- Newsletter forms (home + footer) ----- */
  document.querySelectorAll(".newsletter-form").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const msg = form.querySelector(".form-msg");
      const ok = EMAIL_RE.test(input.value.trim());
      input.classList.toggle("is-invalid", !ok);
      if (!ok) {
        msg.className = "form-msg error";
        msg.innerHTML =
          '<i class="bi bi-exclamation-circle"></i> Please enter a valid email address.';
        input.focus();
        return;
      }
      const list = JSON.parse(
        localStorage.getItem("oddawurld_subscribers") || "[]",
      );
      const email = input.value.trim().toLowerCase();
      const already = list.includes(email);
      if (!already) {
        list.push(email);
        localStorage.setItem("oddawurld_subscribers", JSON.stringify(list));
      }
      msg.className = "form-msg success";
      msg.innerHTML = already
        ? '<i class="bi bi-check-circle"></i> You are already on the list — thanks!'
        : '<i class="bi bi-check-circle"></i> Welcome aboard! Use code <strong>ODDA10</strong> for 10% off.';
      input.value = "";
      ODDA.toast(
        already
          ? "You are already subscribed"
          : "Subscribed! Check your inbox 💌",
        "bi-envelope-check-fill",
      );
    });
    form
      .querySelector("input")
      ?.addEventListener("input", (e) =>
        e.target.classList.remove("is-invalid"),
      );
  });

  /* ----- Contact form ----- */
  const contact = document.getElementById("contactForm");
  if (contact) {
    const rules = {
      cName: (v) => v.trim().length >= 2 || "Please enter your full name.",
      cEmail: (v) =>
        EMAIL_RE.test(v.trim()) || "Please enter a valid email address.",
      cSubject: (v) =>
        v.trim().length >= 3 || "Please add a subject (at least 3 characters).",
      cMessage: (v) =>
        v.trim().length >= 10 ||
        "Your message should be at least 10 characters.",
    };
    const check = (id) => {
      const field = document.getElementById(id);
      const res = rules[id](field.value);
      const fb = field.parentElement.querySelector(".invalid-feedback");
      field.classList.toggle("is-invalid", res !== true);
      field.classList.toggle("is-valid", res === true);
      if (fb && res !== true) fb.textContent = res;
      return res === true;
    };
    Object.keys(rules).forEach((id) => {
      const f = document.getElementById(id);
      f.addEventListener("blur", () => check(id));
      f.addEventListener("input", () => {
        if (f.classList.contains("is-invalid")) check(id);
      });
    });
    const counter = document.getElementById("msgCount");
    document.getElementById("cMessage").addEventListener("input", (e) => {
      if (counter) counter.textContent = e.target.value.length + " / 500";
    });

    contact.addEventListener("submit", (e) => {
      e.preventDefault();
      const ok = Object.keys(rules).map(check).every(Boolean);
      if (!ok) {
        contact.querySelector(".is-invalid")?.focus();
        return;
      }
      const btn = contact.querySelector('[type="submit"]');
      btn.disabled = true;
      btn.innerHTML =
        '<span class="spinner-border spinner-border-sm"></span> Sending…';
      setTimeout(() => {
        const name = document
          .getElementById("cName")
          .value.trim()
          .split(" ")[0];
        const msgs = JSON.parse(
          localStorage.getItem("oddawurld_messages") || "[]",
        );
        msgs.push({
          name: document.getElementById("cName").value,
          email: document.getElementById("cEmail").value,
          subject: document.getElementById("cSubject").value,
          message: document.getElementById("cMessage").value,
          at: new Date().toISOString(),
        });
        localStorage.setItem("oddawurld_messages", JSON.stringify(msgs));
        document.getElementById("successName").textContent = name;
        contact.classList.add("d-none");
        document.getElementById("contactSuccess").classList.remove("d-none");
        contact.reset();
        contact
          .querySelectorAll(".is-valid")
          .forEach((f) => f.classList.remove("is-valid"));
        if (counter) counter.textContent = "0 / 500";
        btn.disabled = false;
        btn.innerHTML = 'Send Message <i class="bi bi-send"></i>';
        ODDA.toast(
          "Message sent — we will reply within 24 hours",
          "bi-send-check-fill",
        );
      }, 900);
    });
    document.getElementById("sendAnother")?.addEventListener("click", () => {
      document.getElementById("contactSuccess").classList.add("d-none");
      contact.classList.remove("d-none");
    });
  }

  /* ----- Account (demo sign-in) ----- */
  const acc = document.getElementById("accountForm");
  if (acc) {
    acc.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("accEmail");
      const pass = document.getElementById("accPass");
      const okE = EMAIL_RE.test(email.value.trim());
      const okP = pass.value.length >= 6;
      email.classList.toggle("is-invalid", !okE);
      pass.classList.toggle("is-invalid", !okP);
      if (!okE || !okP) return;
      localStorage.setItem("oddawurld_user", email.value.trim());
      acc.reset();
      ODDA.syncAccountUI();
      bootstrap.Modal.getInstance(
        document.getElementById("accountModal"),
      )?.hide();
      ODDA.toast(
        "Signed in successfully. Welcome back!",
        "bi-person-check-fill",
      );
    });
  }
})();
