/* =========================================================
   ODDAWURLD — Shared layout, UI helpers & interactions
   ========================================================= */
const ODDA = (() => {
  const PAGE = document.body.dataset.page || "home";
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  /* ---------------- Shared layout ---------------- */
  const NAV = [
    { href: "index.html", label: "Home", key: "home" },
    { href: "shop.html", label: "Shop", key: "shop" },
    {
      href: "index.html#collections",
      label: "Collections",
      key: "collections",
    },
    { href: "about.html", label: "About", key: "about" },
    { href: "about.html#contact", label: "Contact", key: "contact" },
  ];
  const activeKey = PAGE === "product" ? "shop" : PAGE;

  function headerHTML() {
    const links = NAV.map(
      (n) =>
        `<a href="${n.href}" class="nav-link-x ${n.key === activeKey ? "active" : ""}">${n.label}</a>`,
    ).join("");
    return `
    <header class="site-header" id="siteHeader">
      <div class="container-xl header-inner">
        <a class="brand" href="index.html" aria-label="ODDAWURLD home">
          <img src="assets/icons/logo-mark.svg" alt="" class="brand-mark" width="34" height="34">
          <span class="brand-name">ODDAWURLD</span>
        </a>
        <nav class="nav-pill d-none d-lg-flex" aria-label="Main">
          <a href="index.html" class="nav-home ${activeKey === "home" ? "active" : ""}" aria-label="Home"><i class="bi bi-house-door"></i></a>
          ${links}
        </nav>
        <div class="header-actions">
          <button class="icon-btn" data-bs-toggle="modal" data-bs-target="#searchModal" aria-label="Search"><i class="bi bi-search"></i></button>
          <button class="icon-btn" data-bs-toggle="offcanvas" data-bs-target="#wishDrawer" aria-label="Wishlist"><i class="bi bi-heart"></i><span class="count-badge is-empty" data-wish-count>0</span></button>
          <button class="icon-btn" data-bs-toggle="offcanvas" data-bs-target="#cartDrawer" aria-label="Cart"><i class="bi bi-bag"></i><span class="count-badge is-empty" data-cart-count>0</span></button>
          <button class="icon-btn d-none d-sm-inline-flex" data-bs-toggle="modal" data-bs-target="#accountModal" aria-label="Account"><i class="bi bi-person"></i></button>
          <button class="icon-btn d-lg-none" data-bs-toggle="offcanvas" data-bs-target="#mobileMenu" aria-label="Menu"><i class="bi bi-list"></i></button>
        </div>
      </div>
    </header>

    <div class="offcanvas offcanvas-start odda-offcanvas" tabindex="-1" id="mobileMenu" aria-labelledby="mobileMenuLabel">
      <div class="offcanvas-header">
        <a class="brand" href="index.html"><img src="assets/icons/logo-mark.svg" alt="" class="brand-mark" width="30" height="30"><span class="brand-name" id="mobileMenuLabel">ODDAWURLD</span></a>
        <button type="button" class="icon-btn" data-bs-dismiss="offcanvas" aria-label="Close"><i class="bi bi-x-lg"></i></button>
      </div>
      <div class="offcanvas-body d-flex flex-column">
        <nav class="mobile-nav">
          ${NAV.map((n, i) => `<a href="${n.href}" class="${n.key === activeKey ? "active" : ""}" style="--i:${i}"><span>${n.label}</span><i class="bi bi-arrow-up-right"></i></a>`).join("")}
        </nav>
        <div class="mt-auto pt-4">
          <button class="btn btn-ghost w-100 mb-2" data-bs-toggle="modal" data-bs-target="#accountModal"><i class="bi bi-person"></i> My account</button>
          <div class="social-row justify-content-center">${socialHTML()}</div>
        </div>
      </div>
    </div>`;
  }

  function socialHTML() {
    return [
      ["instagram", "Instagram"],
      ["twitter-x", "X"],
      ["facebook", "Facebook"],
      ["youtube", "YouTube"],
      ["tiktok", "TikTok"],
    ]
      .map(
        ([i, l]) =>
          `<a href="https://www.${i === "twitter-x" ? "x" : i}.com" target="_blank" rel="noopener" class="social-btn" aria-label="${l}"><i class="bi bi-${i}"></i></a>`,
      )
      .join("");
  }

  function footerHTML() {
    const cats = CATEGORIES.map(
      (c) => `<li><a href="shop.html?cat=${c.key}">${c.name}</a></li>`,
    ).join("");
    return `
    <footer class="site-footer">
      <div class="footer-glow"></div>
      <div class="container-xl position-relative">
        <div class="row g-5">
          <div class="col-lg-4">
            <a class="brand mb-3" href="index.html"><img src="assets/icons/logo-mark.svg" alt="" class="brand-mark" width="34" height="34"><span class="brand-name">ODDAWURLD</span></a>
            <p class="footer-text">Premium gadgets engineered for people who live one step ahead. Smart, sleek and built to last — delivered to your door.</p>
            <div class="social-row">${socialHTML()}</div>
          </div>
          <div class="col-6 col-md-4 col-lg-2">
            <h6 class="footer-title">Quick Links</h6>
            <ul class="footer-links">
              <li><a href="index.html">Home</a></li><li><a href="shop.html">Shop</a></li>
              <li><a href="index.html#collections">Collections</a></li><li><a href="about.html">About Us</a></li>
              <li><a href="about.html#contact">Contact</a></li>
            </ul>
          </div>
          <div class="col-6 col-md-4 col-lg-2">
            <h6 class="footer-title">Categories</h6>
            <ul class="footer-links">${cats}</ul>
          </div>
          <div class="col-md-4 col-lg-4">
            <h6 class="footer-title">Get in Touch</h6>
            <ul class="footer-contact">
              <li><i class="bi bi-geo-alt"></i> 221 Neon Avenue, Suite 9, San Francisco, CA</li>
              <li><i class="bi bi-telephone"></i> <a href="tel:+14155550199">+1 (415) 555-0199</a></li>
              <li><i class="bi bi-envelope"></i> <a href="mailto:hello@oddawurld.com">hello@oddawurld.com</a></li>
              <li><i class="bi bi-clock"></i> Mon – Sat, 9:00 – 19:00</li>
            </ul>
            <form class="newsletter-form footer-news" novalidate>
              <div class="input-glass">
                <input type="email" class="form-control" placeholder="Your email for 10% off" aria-label="Email address" required>
                <button class="btn btn-lime btn-sm" type="submit" aria-label="Subscribe"><i class="bi bi-send"></i></button>
              </div>
              <div class="form-msg"></div>
            </form>
          </div>
        </div>
        <div class="footer-bottom">
          <p>© ${new Date().getFullYear()} ODDAWURLD. All rights reserved.</p>
          <div class="pay-icons" aria-label="Accepted payments">
            <span title="Visa"><i class="bi bi-credit-card-2-front"></i> Visa</span>
            <span title="Mastercard"><i class="bi bi-credit-card"></i> MC</span>
            <span title="PayPal"><i class="bi bi-paypal"></i></span>
            <span title="Apple Pay"><i class="bi bi-apple"></i> Pay</span>
            <span title="Google Pay"><i class="bi bi-google"></i> Pay</span>
            <span title="Stripe"><i class="bi bi-stripe"></i></span>
          </div>
        </div>
      </div>
    </footer>`;
  }

  function overlaysHTML() {
    return `
    <!-- Cart drawer -->
    <div class="offcanvas offcanvas-end odda-offcanvas drawer" tabindex="-1" id="cartDrawer" aria-labelledby="cartDrawerLabel">
      <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="cartDrawerLabel"><i class="bi bi-bag text-lime"></i> Your Cart <span class="count-pill" data-cart-count>0</span></h5>
        <button type="button" class="icon-btn" data-bs-dismiss="offcanvas" aria-label="Close"><i class="bi bi-x-lg"></i></button>
      </div>
      <div class="ship-meter"><p id="shipNote"></p><div class="ship-track"><span id="shipProgress"></span></div></div>
      <div class="offcanvas-body" id="cartItems"></div>
      <div class="drawer-footer">
        <div class="sum-row"><span>Subtotal</span><span id="cartSubtotal">$0.00</span></div>
        <div class="sum-row"><span>Shipping</span><span id="cartShipping">—</span></div>
        <div class="sum-row total"><span>Total</span><span id="cartTotal">$0.00</span></div>
        <button class="btn btn-lime w-100 btn-lg magnetic" id="checkoutBtn"><i class="bi bi-lock"></i> Secure Checkout</button>
        <a href="shop.html" class="btn btn-link-muted w-100 mt-1">Continue shopping</a>
      </div>
    </div>

    <!-- Wishlist drawer -->
    <div class="offcanvas offcanvas-end odda-offcanvas drawer" tabindex="-1" id="wishDrawer" aria-labelledby="wishDrawerLabel">
      <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="wishDrawerLabel"><i class="bi bi-heart text-lime"></i> Wishlist <span class="count-pill" data-wish-count>0</span></h5>
        <button type="button" class="icon-btn" data-bs-dismiss="offcanvas" aria-label="Close"><i class="bi bi-x-lg"></i></button>
      </div>
      <div class="offcanvas-body" id="wishItems"></div>
    </div>

    <!-- Quick view -->
    <div class="modal fade odda-modal" id="quickViewModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-xl">
        <div class="modal-content">
          <button type="button" class="icon-btn modal-close" data-bs-dismiss="modal" aria-label="Close"><i class="bi bi-x-lg"></i></button>
          <div class="modal-body p-0" id="quickViewBody"></div>
        </div>
      </div>
    </div>

    <!-- Search -->
    <div class="modal fade odda-modal search-modal" id="searchModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-body">
            <form class="search-field" id="searchForm" role="search">
              <i class="bi bi-search"></i>
              <input type="search" id="searchInput" class="form-control" placeholder="Search headphones, watches, gaming…" autocomplete="off" aria-label="Search products">
              <button type="button" class="icon-btn" data-bs-dismiss="modal" aria-label="Close"><i class="bi bi-x-lg"></i></button>
            </form>
            <div class="search-tags">
              ${CATEGORIES.map((c) => `<a href="shop.html?cat=${c.key}" class="chip"><i class="bi ${c.icon}"></i> ${c.name}</a>`).join("")}
            </div>
            <div id="searchResults" class="search-results"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Account -->
    <div class="modal fade odda-modal" id="accountModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content p-4 p-md-5">
          <button type="button" class="icon-btn modal-close" data-bs-dismiss="modal" aria-label="Close"><i class="bi bi-x-lg"></i></button>
          <div class="text-center mb-4">
            <img src="assets/icons/logo-mark.svg" alt="" width="48" height="48" class="mb-3">
            <h4 class="mb-1" id="accountTitle">Welcome back</h4>
            <p class="text-muted-x small mb-0" id="accountSub">Sign in to track orders and sync your wishlist.</p>
          </div>
          <form id="accountForm" novalidate>
            <div class="mb-3">
              <label class="form-label" for="accEmail">Email</label>
              <input type="email" class="form-control" id="accEmail" placeholder="you@example.com" required>
              <div class="invalid-feedback">Please enter a valid email.</div>
            </div>
            <div class="mb-3">
              <label class="form-label" for="accPass">Password</label>
              <input type="password" class="form-control" id="accPass" placeholder="••••••••" minlength="6" required>
              <div class="invalid-feedback">Password must be at least 6 characters.</div>
            </div>
            <button class="btn btn-lime w-100 btn-lg" type="submit">Sign in <i class="bi bi-arrow-right"></i></button>
          </form>
          <div id="accountSigned" class="text-center d-none">
            <button class="btn btn-ghost w-100" id="signOutBtn"><i class="bi bi-box-arrow-right"></i> Sign out</button>
          </div>
        </div>
      </div>
    </div>

    <div class="toast-stack" id="toastStack" aria-live="polite"></div>
    <button class="scroll-top" id="scrollTop" aria-label="Back to top"><i class="bi bi-arrow-up"></i></button>`;
  }

  function mountLayout() {
    const h = document.getElementById("site-header");
    const f = document.getElementById("site-footer");
    if (h) h.outerHTML = headerHTML();
    if (f) f.outerHTML = footerHTML();
    document.body.insertAdjacentHTML("beforeend", overlaysHTML());
  }

  /* ---------------- Templates ---------------- */
  function stars(r) {
    let out = "";
    for (let i = 1; i <= 5; i++) {
      out +=
        r >= i
          ? '<i class="bi bi-star-fill"></i>'
          : r >= i - 0.5
            ? '<i class="bi bi-star-half"></i>'
            : '<i class="bi bi-star"></i>';
    }
    return `<span class="stars" aria-label="${r} out of 5">${out}</span>`;
  }

  function productCard(p) {
    const off = discountOf(p);
    const cat = getCategory(p.category);
    const badges = [
      off ? `<span class="badge-x badge-off">-${off}%</span>` : "",
      p.badge ? `<span class="badge-x badge-tag">${p.badge}</span>` : "",
    ].join("");
    return `
    <article class="product-card tilt" data-id="${p.id}">
      <div class="pc-media">
        <div class="pc-badges">${badges}</div>
        <button class="pc-wish ${Wishlist.has(p.id) ? "active" : ""}" data-wish="${p.id}" aria-label="Add to wishlist"><i class="bi ${Wishlist.has(p.id) ? "bi-heart-fill" : "bi-heart"}"></i></button>
        <a href="product.html?id=${p.id}" class="pc-img" aria-label="${p.name}"><img src="${p.image}" alt="${p.name}" loading="lazy" width="900" height="900"></a>
        <button class="pc-quick" data-quick="${p.id}"><i class="bi bi-eye"></i> Quick View</button>
      </div>
      <div class="pc-body">
        <div class="pc-top"><span class="pc-cat">${cat ? cat.name : ""}</span><span class="pc-brand">${p.brand}</span></div>
        <h3 class="pc-title"><a href="product.html?id=${p.id}">${p.name}</a></h3>
        <p class="pc-desc">${p.short}</p>
        <div class="pc-rating">${stars(p.rating)}<span>${p.rating} <em>(${p.reviews})</em></span></div>
        <div class="pc-foot">
          <div class="price"><strong>${formatPrice(p.price)}</strong>${p.oldPrice ? `<del>${formatPrice(p.oldPrice)}</del>` : ""}</div>
          <button class="btn-cart" data-add-cart="${p.id}" aria-label="Add ${p.name} to cart"><i class="bi bi-bag-plus"></i><span>Add to Cart</span></button>
        </div>
      </div>
    </article>`;
  }

  function quickViewHTML(p) {
    const off = discountOf(p);
    return `
    <div class="row g-0 qv">
      <div class="col-lg-6"><div class="qv-media"><img src="${p.image}" alt="${p.name}">${off ? `<span class="badge-x badge-off qv-badge">-${off}%</span>` : ""}</div></div>
      <div class="col-lg-6">
        <div class="qv-info">
          <span class="eyebrow">${getCategory(p.category).name} · ${p.brand}</span>
          <h3 class="qv-title">${p.name}</h3>
          <div class="pc-rating mb-3">${stars(p.rating)}<span>${p.rating} <em>(${p.reviews} reviews)</em></span></div>
          <div class="price price-lg mb-3"><strong>${formatPrice(p.price)}</strong>${p.oldPrice ? `<del>${formatPrice(p.oldPrice)}</del><span class="save-tag">Save ${formatPrice(p.oldPrice - p.price)}</span>` : ""}</div>
          <p class="text-muted-x">${p.description}</p>
          <div class="mb-3">
            <span class="opt-label">Color: <strong data-qv-color-name>${COLORS[p.colors[0]].name}</strong></span>
            <div class="swatches" data-qv-colors>
              ${p.colors.map((c, i) => `<button class="swatch ${i === 0 ? "active" : ""}" data-color="${c}" style="--c:${COLORS[c].hex}" aria-label="${COLORS[c].name}"></button>`).join("")}
            </div>
          </div>
          <div class="d-flex flex-wrap gap-2 align-items-center">
            <div class="qty"><button data-qv-dec aria-label="Decrease"><i class="bi bi-dash"></i></button><input type="number" value="1" min="1" max="99" data-qv-qty aria-label="Quantity"><button data-qv-inc aria-label="Increase"><i class="bi bi-plus"></i></button></div>
            <button class="btn btn-lime btn-lg flex-grow-1" data-qv-add="${p.id}"><i class="bi bi-bag-plus"></i> Add to Cart</button>
            <button class="icon-btn icon-btn-lg ${Wishlist.has(p.id) ? "active" : ""}" data-wish="${p.id}" aria-label="Wishlist"><i class="bi ${Wishlist.has(p.id) ? "bi-heart-fill" : "bi-heart"}"></i></button>
          </div>
          <a href="product.html?id=${p.id}" class="link-arrow mt-4 d-inline-flex">View full details <i class="bi bi-arrow-right"></i></a>
        </div>
      </div>
    </div>`;
  }

  /* ---------------- Toasts ---------------- */
  function toast(msg, icon = "bi-check-circle-fill") {
    const stack = document.getElementById("toastStack");
    if (!stack) return;
    const el = document.createElement("div");
    el.className = "odda-toast";
    el.innerHTML = `<i class="bi ${icon}"></i><span>${msg}</span>`;
    stack.appendChild(el);
    requestAnimationFrame(() => el.classList.add("show"));
    setTimeout(() => {
      el.classList.remove("show");
      setTimeout(() => el.remove(), 400);
    }, 2800);
  }

  /* ---------------- Quick view ---------------- */
  let qvModal;
  function openQuickView(id) {
    const p = getProduct(id);
    if (!p) return;
    document.getElementById("quickViewBody").innerHTML = quickViewHTML(p);
    qvModal =
      qvModal || new bootstrap.Modal(document.getElementById("quickViewModal"));
    qvModal.show();
  }

  /* ---------------- Global click delegation ---------------- */
  function bindGlobalActions() {
    document.addEventListener("click", (e) => {
      const t = e.target;
      let el;
      if ((el = t.closest("[data-add-cart]"))) {
        e.preventDefault();
        const p = getProduct(el.dataset.addCart);
        Cart.add(p.id, 1);
        el.classList.add("added");
        setTimeout(() => el.classList.remove("added"), 900);
        toast(`<strong>${p.name}</strong> added to cart`, "bi-bag-check-fill");
      } else if ((el = t.closest("[data-wish]"))) {
        e.preventDefault();
        const p = getProduct(el.dataset.wish);
        const on = Wishlist.toggle(p.id);
        toast(
          on
            ? `Saved <strong>${p.name}</strong> to wishlist`
            : `Removed from wishlist`,
          on ? "bi-heart-fill" : "bi-heart",
        );
      } else if ((el = t.closest("[data-quick]"))) {
        e.preventDefault();
        openQuickView(el.dataset.quick);
      } else if ((el = t.closest("[data-cart-inc]"))) {
        const it = Cart.items.find(
          (i) => i.id + "|" + i.color === el.dataset.cartInc,
        );
        if (it) Cart.setQty(el.dataset.cartInc, it.qty + 1);
      } else if ((el = t.closest("[data-cart-dec]"))) {
        const it = Cart.items.find(
          (i) => i.id + "|" + i.color === el.dataset.cartDec,
        );
        if (it) Cart.setQty(el.dataset.cartDec, it.qty - 1);
      } else if ((el = t.closest("[data-cart-remove]"))) {
        Cart.remove(el.dataset.cartRemove);
        toast("Item removed from cart", "bi-trash3");
      } else if ((el = t.closest("[data-wish-remove]"))) {
        Wishlist.remove(el.dataset.wishRemove);
      } else if ((el = t.closest("[data-wish-to-cart]"))) {
        const id = el.dataset.wishToCart;
        Cart.add(id, 1);
        Wishlist.remove(id);
        toast("Moved to cart", "bi-bag-check-fill");
      } else if (t.closest("#checkoutBtn")) {
        const total = formatPrice(Cart.total());
        Cart.clear();
        bootstrap.Offcanvas.getInstance(
          document.getElementById("cartDrawer"),
        )?.hide();
        toast(
          `Order confirmed! Total charged: <strong>${total}</strong>. Thank you 💚`,
          "bi-patch-check-fill",
        );
      } else if ((el = t.closest("[data-qv-colors] .swatch"))) {
        el.parentElement
          .querySelectorAll(".swatch")
          .forEach((s) => s.classList.remove("active"));
        el.classList.add("active");
        const name = document.querySelector("[data-qv-color-name]");
        if (name) name.textContent = COLORS[el.dataset.color].name;
      } else if (t.closest("[data-qv-inc]") || t.closest("[data-qv-dec]")) {
        const input = document.querySelector("[data-qv-qty]");
        const v =
          (parseInt(input.value, 10) || 1) +
          (t.closest("[data-qv-inc]") ? 1 : -1);
        input.value = Math.max(1, Math.min(99, v));
      } else if ((el = t.closest("[data-qv-add]"))) {
        const qty =
          parseInt(document.querySelector("[data-qv-qty]").value, 10) || 1;
        const color = document.querySelector("[data-qv-colors] .swatch.active")
          ?.dataset.color;
        Cart.add(el.dataset.qvAdd, qty, color);
        qvModal && qvModal.hide();
        toast(
          `${qty} × <strong>${getProduct(el.dataset.qvAdd).name}</strong> added to cart`,
          "bi-bag-check-fill",
        );
      }
    });
  }

  /* ---------------- Search ---------------- */
  function bindSearch() {
    const modal = document.getElementById("searchModal");
    const input = document.getElementById("searchInput");
    const results = document.getElementById("searchResults");
    const form = document.getElementById("searchForm");
    const draw = () => {
      const q = input.value.trim().toLowerCase();
      if (!q) {
        results.innerHTML =
          '<p class="search-hint">Popular: <em>headphones</em>, <em>smartwatch</em>, <em>controller</em></p>';
        return;
      }
      const hits = PRODUCTS.filter((p) =>
        (p.name + " " + p.brand + " " + p.category + " " + p.short)
          .toLowerCase()
          .includes(q),
      ).slice(0, 6);
      results.innerHTML = hits.length
        ? hits
            .map(
              (p) => `
        <a href="product.html?id=${p.id}" class="search-hit">
          <img src="${p.image}" alt="">
          <div><strong>${p.name}</strong><span>${getCategory(p.category).name} · ${p.brand}</span></div>
          <b>${formatPrice(p.price)}</b>
        </a>`,
            )
            .join("") +
          `<a href="shop.html?q=${encodeURIComponent(q)}" class="link-arrow mt-2">See all results <i class="bi bi-arrow-right"></i></a>`
        : `<p class="search-hint">No gadgets match “${input.value}”. Try another keyword.</p>`;
    };
    input.addEventListener("input", draw);
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const q = input.value.trim();
      window.location.href =
        "shop.html" + (q ? "?q=" + encodeURIComponent(q) : "");
    });
    modal.addEventListener("shown.bs.modal", () => {
      input.focus();
      draw();
    });
    results.addEventListener("click", (e) => {
      if (e.target.closest("em")) {
        input.value = e.target.textContent;
        draw();
      }
    });
  }

  /* ---------------- Motion & effects ---------------- */
  let revealObserver;
  function observe(root = document) {
    const els = root.querySelectorAll(
      ".reveal:not(.in), .stagger > *:not(.in)",
    );
    if (!("IntersectionObserver" in window) || reduceMotion) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }
    if (!revealObserver) {
      revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (en.isIntersecting) {
              en.target.classList.add("in");
              revealObserver.unobserve(en.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
      );
    }
    els.forEach((el) => {
      if (el.parentElement && el.parentElement.classList.contains("stagger")) {
        const idx = Array.prototype.indexOf.call(el.parentElement.children, el);
        el.style.setProperty("--d", (idx % 8) * 80 + "ms");
      }
      revealObserver.observe(el);
    });
    bindTilt(root);
    bindMagnetic(root);
  }

  function bindTilt(root = document) {
    if (reduceMotion || window.matchMedia("(hover: none)").matches) return;
    root.querySelectorAll(".tilt:not([data-tilt])").forEach((card) => {
      card.dataset.tilt = "1";
      let raf;
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          card.style.setProperty("--rx", (-y * 8).toFixed(2) + "deg");
          card.style.setProperty("--ry", (x * 10).toFixed(2) + "deg");
          card.style.setProperty("--mx", ((x + 0.5) * 100).toFixed(1) + "%");
          card.style.setProperty("--my", ((y + 0.5) * 100).toFixed(1) + "%");
        });
      });
      card.addEventListener("pointerleave", () => {
        cancelAnimationFrame(raf);
        card.style.setProperty("--rx", "0deg");
        card.style.setProperty("--ry", "0deg");
      });
    });
  }

  function bindMagnetic(root = document) {
    if (reduceMotion || window.matchMedia("(hover: none)").matches) return;
    root.querySelectorAll(".magnetic:not([data-mag])").forEach((btn) => {
      btn.dataset.mag = "1";
      btn.addEventListener("pointermove", (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * 0.18}px, ${y * 0.28}px)`;
      });
      btn.addEventListener("pointerleave", () => {
        btn.style.transform = "";
      });
    });
  }

  function bindCounters() {
    const els = document.querySelectorAll("[data-count]");
    if (!els.length) return;
    const run = (el) => {
      const target = parseFloat(el.dataset.count);
      const dec = (el.dataset.count.split(".")[1] || "").length;
      const suffix = el.dataset.suffix || "";
      const dur = 1800;
      const start = performance.now();
      const tick = (now) => {
        const k = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - k, 3);
        el.textContent =
          (target * eased).toLocaleString("en-US", {
            minimumFractionDigits: dec,
            maximumFractionDigits: dec,
          }) + suffix;
        if (k < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(
      (en) =>
        en.forEach((x) => {
          if (x.isIntersecting) {
            run(x.target);
            io.unobserve(x.target);
          }
        }),
      { threshold: 0.5 },
    );
    els.forEach((el) => io.observe(el));
  }

  function bindScroll() {
    const header = document.getElementById("siteHeader");
    const topBtn = document.getElementById("scrollTop");
    const parallax = document.querySelectorAll("[data-parallax]");
    let ticking = false;
    const onScroll = () => {
      const y = window.scrollY;
      header && header.classList.toggle("scrolled", y > 20);
      topBtn && topBtn.classList.toggle("show", y > 600);
      if (!reduceMotion)
        parallax.forEach((el) => {
          el.style.setProperty(
            "--py",
            (y * parseFloat(el.dataset.parallax)).toFixed(1) + "px",
          );
        });
      ticking = false;
    };
    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          requestAnimationFrame(onScroll);
          ticking = true;
        }
      },
      { passive: true },
    );
    onScroll();
    topBtn &&
      topBtn.addEventListener("click", () =>
        window.scrollTo({ top: 0, behavior: "smooth" }),
      );

    // Mouse parallax for hero
    const hero = document.querySelector("[data-mouse-parallax]");
    if (hero && !reduceMotion) {
      hero.addEventListener("pointermove", (e) => {
        const r = hero.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        hero.style.setProperty("--hx", x.toFixed(3));
        hero.style.setProperty("--hy", y.toFixed(3));
      });
    }
  }

  function hideLoader() {
    const loader = document.getElementById("pageLoader");
    if (!loader) return;
    const done = () => {
      loader.classList.add("hide");
      document.body.classList.add("loaded");
      setTimeout(() => loader.remove(), 700);
    };
    if (document.readyState === "complete") setTimeout(done, 350);
    else window.addEventListener("load", () => setTimeout(done, 350));
    setTimeout(done, 3000); // safety
  }

  /* ---------------- Home page ---------------- */
  function initHome() {
    const featured = document.getElementById("featuredGrid");
    if (featured) {
      const tabs = document.querySelectorAll("[data-feat-filter]");
      const draw = (cat) => {
        const list = PRODUCTS.filter(
          (p) => p.featured && (cat === "all" || p.category === cat),
        ).slice(0, 8);
        featured.innerHTML = list
          .map(
            (p) =>
              `<div class="col-6 col-md-4 col-xl-3">${productCard(p)}</div>`,
          )
          .join("");
        observe(featured);
      };
      tabs.forEach((t) =>
        t.addEventListener("click", () => {
          tabs.forEach((x) => x.classList.remove("active"));
          t.classList.add("active");
          draw(t.dataset.featFilter);
        }),
      );
      draw("all");
    }

    const track = document.getElementById("trendingTrack");
    if (track) {
      track.innerHTML = PRODUCTS.filter((p) => p.trending)
        .map((p) => `<div class="carousel-cell">${productCard(p)}</div>`)
        .join("");
      observe(track);
      const step = () =>
        (track.querySelector(".carousel-cell")?.offsetWidth || 300) + 24;
      const prev = document.getElementById("trendPrev");
      const next = document.getElementById("trendNext");
      const bar = document.getElementById("trendProgress");
      const update = () => {
        const max = track.scrollWidth - track.clientWidth;
        const k = max > 0 ? track.scrollLeft / max : 0;
        if (bar) bar.style.width = Math.max(12, k * 100) + "%";
        prev.disabled = track.scrollLeft < 5;
        next.disabled = track.scrollLeft > max - 5;
      };
      prev.addEventListener("click", () =>
        track.scrollBy({ left: -step(), behavior: "smooth" }),
      );
      next.addEventListener("click", () =>
        track.scrollBy({ left: step(), behavior: "smooth" }),
      );
      track.addEventListener("scroll", update, { passive: true });
      window.addEventListener("resize", update);
      update();
      // gentle autoplay, pauses on hover
      let paused = false;
      track.addEventListener("pointerenter", () => (paused = true));
      track.addEventListener("pointerleave", () => (paused = false));
      setInterval(() => {
        if (paused || document.hidden) return;
        const max = track.scrollWidth - track.clientWidth;
        if (track.scrollLeft >= max - 5)
          track.scrollTo({ left: 0, behavior: "smooth" });
        else track.scrollBy({ left: step(), behavior: "smooth" });
      }, 4500);
    }
  }

  /* ---------------- Account ---------------- */
  function syncAccountUI() {
    const user = localStorage.getItem("oddawurld_user");
    const form = document.getElementById("accountForm");
    const signed = document.getElementById("accountSigned");
    if (!form) return;
    form.classList.toggle("d-none", !!user);
    signed.classList.toggle("d-none", !user);
    document.getElementById("accountTitle").textContent = user
      ? "Hello, " + user.split("@")[0]
      : "Welcome back";
    document.getElementById("accountSub").textContent = user
      ? "Signed in as " + user
      : "Sign in to track orders and sync your wishlist.";
  }

  /* ---------------- Boot ---------------- */
  function init() {
    mountLayout();
    Cart.render();
    Wishlist.render();
    bindGlobalActions();
    bindSearch();
    bindScroll();
    bindCounters();
    syncAccountUI();
    document.getElementById("signOutBtn")?.addEventListener("click", () => {
      localStorage.removeItem("oddawurld_user");
      syncAccountUI();
      toast("You have been signed out", "bi-box-arrow-right");
    });
    if (PAGE === "home") initHome();
    observe();
    hideLoader();
  }

  return {
    init,
    productCard,
    stars,
    toast,
    observe,
    openQuickView,
    syncAccountUI,
    PAGE,
  };
})();

ODDA.init();
/*  */
