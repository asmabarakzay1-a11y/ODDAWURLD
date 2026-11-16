/* =========================================================
   ODDAWURLD — Product details page (reads ?id= from the URL)
   ========================================================= */
(() => {
  const root = document.getElementById("productDetail");
  if (!root) return;

  const id = new URLSearchParams(location.search).get("id");
  const p = getProduct(id) || PRODUCTS[0];
  const cat = getCategory(p.category);
  const off = discountOf(p);

  document.title = `${p.name} — ODDAWURLD`;
  document
    .querySelector('meta[name="description"]')
    ?.setAttribute("content", p.short);
  document.getElementById("crumbCat").innerHTML =
    `<a href="shop.html?cat=${cat.key}">${cat.name}</a>`;
  document.getElementById("crumbName").textContent = p.name;

  // Gallery views: hero shot, close-up, mirrored angle and detail crop of the product photo
  const VIEWS = [
    { cls: "view-main", label: "Front" },
    { cls: "view-close", label: "Close-up" },
    { cls: "view-angle", label: "Angle" },
    { cls: "view-detail", label: "Detail" },
  ];

  const reviewsData = [
    {
      name: "Daniel R.",
      rating: 5,
      date: "Oct 28, 2026",
      title: "Absolutely premium",
      text: `The build quality of the ${p.name} is outstanding. Feels like a flagship in every way and the finish looks even better in person.`,
    },
    {
      name: "Sofia M.",
      rating: 5,
      date: "Oct 12, 2026",
      title: "Worth every penny",
      text: "Fast delivery, beautiful packaging and the performance is exactly as advertised. Already recommended it to friends.",
    },
    {
      name: "Karim A.",
      rating: 4,
      date: "Sep 30, 2026",
      title: "Great, tiny nitpick",
      text: "Excellent product overall. I wish it came with a few more accessories in the box, but the quality more than makes up for it.",
    },
  ];
  const dist = [78, 15, 5, 1, 1];

  root.innerHTML = `
  <div class="row g-4 g-xl-5">
    <div class="col-lg-6 reveal">
      <div class="gallery">
        <div class="gallery-main" id="galleryMain">
          ${off ? `<span class="badge-x badge-off gallery-badge">-${off}%</span>` : ""}
          <div class="gallery-frame view-main" id="galleryFrame"><img src="${p.image}" alt="${p.name}" id="galleryImg"></div>
          <span class="gallery-hint"><i class="bi bi-zoom-in"></i> Hover to zoom</span>
          <button class="gallery-nav prev" data-gal="-1" aria-label="Previous image"><i class="bi bi-chevron-left"></i></button>
          <button class="gallery-nav next" data-gal="1" aria-label="Next image"><i class="bi bi-chevron-right"></i></button>
        </div>
        <div class="gallery-thumbs">
          ${VIEWS.map((v, i) => `<button class="thumb ${i === 0 ? "active" : ""}" data-view-idx="${i}" aria-label="${v.label} view"><span class="thumb-frame ${v.cls}"><img src="${p.image}" alt=""></span><small>${v.label}</small></button>`).join("")}
        </div>
      </div>
    </div>

    <div class="col-lg-6 reveal">
      <div class="pd-info">
        <div class="d-flex flex-wrap gap-2 mb-3">
          <span class="chip chip-soft"><i class="bi ${cat.icon}"></i> ${cat.name}</span>
          <span class="chip chip-soft">${p.brand}</span>
          ${p.badge ? `<span class="chip chip-lime">${p.badge}</span>` : ""}
        </div>
        <h1 class="pd-title">${p.name}</h1>
        <div class="pc-rating mb-3">${ODDA.stars(p.rating)}<span>${p.rating} <em>· ${p.reviews} verified reviews</em></span></div>
        <div class="price price-xl mb-3"><strong>${formatPrice(p.price)}</strong>${p.oldPrice ? `<del>${formatPrice(p.oldPrice)}</del><span class="save-tag">Save ${off}%</span>` : ""}</div>
        <p class="pd-lead">${p.short}</p>

        <div class="pd-option">
          <span class="opt-label">Color: <strong id="colorName">${COLORS[p.colors[0]].name}</strong></span>
          <div class="swatches swatches-lg" id="pdColors">
            ${p.colors.map((c, i) => `<button class="swatch ${i === 0 ? "active" : ""}" data-color="${c}" style="--c:${COLORS[c].hex}" aria-label="${COLORS[c].name}"></button>`).join("")}
          </div>
        </div>

        <div class="pd-option">
          <span class="opt-label">Quantity <span class="stock ${p.stock < 15 ? "low" : ""}"><i class="bi bi-circle-fill"></i> ${p.stock < 15 ? `Only ${p.stock} left` : "In stock"}</span></span>
          <div class="d-flex flex-wrap gap-2 align-items-center">
            <div class="qty qty-lg"><button id="qtyDec" aria-label="Decrease"><i class="bi bi-dash"></i></button><input type="number" id="qtyInput" value="1" min="1" max="${p.stock}" aria-label="Quantity"><button id="qtyInc" aria-label="Increase"><i class="bi bi-plus"></i></button></div>
            <button class="btn btn-lime btn-lg flex-grow-1 magnetic" id="pdAdd"><i class="bi bi-bag-plus"></i> Add to Cart · <span id="pdLineTotal">${formatPrice(p.price)}</span></button>
            <button class="icon-btn icon-btn-lg ${Wishlist.has(p.id) ? "active" : ""}" data-wish="${p.id}" aria-label="Add to wishlist"><i class="bi ${Wishlist.has(p.id) ? "bi-heart-fill" : "bi-heart"}"></i></button>
          </div>
          <button class="btn btn-ghost w-100 mt-2" id="pdBuy"><i class="bi bi-lightning-charge"></i> Buy it now</button>
        </div>

        <div class="pd-perks">
          <div><i class="bi bi-truck"></i><span><strong>Free shipping</strong> on orders over $50</span></div>
          <div><i class="bi bi-shield-check"></i><span><strong>1-year warranty</strong> included</span></div>
          <div><i class="bi bi-arrow-repeat"></i><span><strong>30-day</strong> easy returns</span></div>
        </div>

        <ul class="pd-quickspecs">
          ${Object.entries(p.specs)
            .slice(0, 4)
            .map(([k, v]) => `<li><span>${k}</span><strong>${v}</strong></li>`)
            .join("")}
        </ul>
      </div>
    </div>
  </div>

  <div class="pd-tabs reveal">
    <ul class="nav tabs-x" role="tablist">
      <li><button class="active" data-bs-toggle="tab" data-bs-target="#tabDesc" type="button" role="tab">Description</button></li>
      <li><button data-bs-toggle="tab" data-bs-target="#tabSpecs" type="button" role="tab">Specifications</button></li>
      <li><button data-bs-toggle="tab" data-bs-target="#tabReviews" type="button" role="tab">Reviews (${p.reviews})</button></li>
    </ul>
    <div class="tab-content glass-panel">
      <div class="tab-pane fade show active" id="tabDesc" role="tabpanel">
        <div class="row g-4 align-items-center">
          <div class="col-md-7">
            <h4>Designed to keep you ahead</h4>
            <p class="text-muted-x">${p.description}</p>
            <ul class="tick-list">
              <li>Premium materials with a refined matte finish</li>
              <li>Seamless pairing across all your devices</li>
              <li>Backed by ODDAWURLD 1-year warranty and 24/7 support</li>
            </ul>
          </div>
          <div class="col-md-5"><div class="desc-visual"><img src="${p.image}" alt="${p.name} detail" loading="lazy"></div></div>
        </div>
      </div>
      <div class="tab-pane fade" id="tabSpecs" role="tabpanel">
        <table class="spec-table">
          <tbody>
            <tr><th>Brand</th><td>${p.brand}</td></tr>
            <tr><th>Category</th><td>${cat.name}</td></tr>
            ${Object.entries(p.specs)
              .map(([k, v]) => `<tr><th>${k}</th><td>${v}</td></tr>`)
              .join("")}
            <tr><th>Colors</th><td>${p.colors.map((c) => COLORS[c].name).join(", ")}</td></tr>
            <tr><th>Warranty</th><td>1 year limited</td></tr>
          </tbody>
        </table>
      </div>
      <div class="tab-pane fade" id="tabReviews" role="tabpanel">
        <div class="row g-4">
          <div class="col-md-4">
            <div class="review-summary">
              <div class="big-rating">${p.rating}</div>
              ${ODDA.stars(p.rating)}
              <p class="text-muted-x small mt-1">Based on ${p.reviews} reviews</p>
              ${dist.map((d, i) => `<div class="dist-row"><span>${5 - i}★</span><div class="dist-bar"><i style="width:${d}%"></i></div><em>${d}%</em></div>`).join("")}
            </div>
          </div>
          <div class="col-md-8">
            <div id="reviewList">
              ${reviewsData.map((r) => reviewHTML(r)).join("")}
            </div>
            <form id="reviewForm" class="review-form" novalidate>
              <h6>Write a review</h6>
              <div class="star-input" id="starInput">${[1, 2, 3, 4, 5].map((n) => `<button type="button" data-star="${n}" aria-label="${n} stars"><i class="bi bi-star"></i></button>`).join("")}</div>
              <div class="row g-2">
                <div class="col-sm-6"><input class="form-control" id="revName" placeholder="Your name" required minlength="2"><div class="invalid-feedback">Please add your name.</div></div>
                <div class="col-sm-6"><input class="form-control" id="revTitle" placeholder="Review title" required minlength="3"><div class="invalid-feedback">Please add a title.</div></div>
                <div class="col-12"><textarea class="form-control" id="revText" rows="3" placeholder="Share your experience…" required minlength="10"></textarea><div class="invalid-feedback">Please write at least 10 characters.</div></div>
              </div>
              <button class="btn btn-lime mt-3" type="submit">Submit review</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>`;

  function reviewHTML(r) {
    return `<div class="review">
      <div class="review-head"><span class="avatar">${r.name[0]}</span><div><strong>${r.name}</strong><small>${r.date} · Verified buyer</small></div>${ODDA.stars(r.rating)}</div>
      <h6>${r.title}</h6><p>${r.text}</p></div>`;
  }

  /* ----- Gallery ----- */
  const frame = document.getElementById("galleryFrame");
  const main = document.getElementById("galleryMain");
  const img = document.getElementById("galleryImg");
  const thumbs = root.querySelectorAll(".thumb");
  let current = 0;
  function show(i) {
    current = (i + VIEWS.length) % VIEWS.length;
    thumbs.forEach((t, k) => t.classList.toggle("active", k === current));
    frame.classList.add("swap");
    setTimeout(() => {
      frame.className = "gallery-frame " + VIEWS[current].cls;
      requestAnimationFrame(() => frame.classList.remove("swap"));
    }, 220);
  }
  thumbs.forEach((t) =>
    t.addEventListener("click", () => show(+t.dataset.viewIdx)),
  );
  root
    .querySelectorAll("[data-gal]")
    .forEach((b) =>
      b.addEventListener("click", () => show(current + +b.dataset.gal)),
    );
  main.addEventListener("pointermove", (e) => {
    const r = main.getBoundingClientRect();
    img.style.transformOrigin = `${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`;
    main.classList.add("zooming");
  });
  main.addEventListener("pointerleave", () => main.classList.remove("zooming"));
  // swipe on touch
  let sx = null;
  main.addEventListener("touchstart", (e) => (sx = e.touches[0].clientX), {
    passive: true,
  });
  main.addEventListener("touchend", (e) => {
    if (sx === null) return;
    const dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 40) show(current + (dx < 0 ? 1 : -1));
    sx = null;
  });

  /* ----- Options ----- */
  let color = p.colors[0];
  const qty = document.getElementById("qtyInput");
  const lineTotal = document.getElementById("pdLineTotal");
  const clampQty = () => {
    qty.value = Math.max(1, Math.min(p.stock, parseInt(qty.value, 10) || 1));
    lineTotal.textContent = formatPrice(p.price * qty.value);
  };
  document.getElementById("pdColors").addEventListener("click", (e) => {
    const s = e.target.closest(".swatch");
    if (!s) return;
    document
      .querySelectorAll("#pdColors .swatch")
      .forEach((x) => x.classList.remove("active"));
    s.classList.add("active");
    color = s.dataset.color;
    document.getElementById("colorName").textContent = COLORS[color].name;
    main.style.setProperty("--tint", COLORS[color].hex);
  });
  document.getElementById("qtyDec").addEventListener("click", () => {
    qty.value = +qty.value - 1;
    clampQty();
  });
  document.getElementById("qtyInc").addEventListener("click", () => {
    qty.value = +qty.value + 1;
    clampQty();
  });
  qty.addEventListener("change", clampQty);
  document.getElementById("pdAdd").addEventListener("click", (e) => {
    Cart.add(p.id, +qty.value, color);
    e.currentTarget.classList.add("added");
    setTimeout(() => e.currentTarget?.classList?.remove("added"), 900);
    ODDA.toast(
      `${qty.value} × <strong>${p.name}</strong> (${COLORS[color].name}) added to cart`,
      "bi-bag-check-fill",
    );
  });
  document.getElementById("pdBuy").addEventListener("click", () => {
    Cart.add(p.id, +qty.value, color);
    bootstrap.Offcanvas.getOrCreateInstance(
      document.getElementById("cartDrawer"),
    ).show();
  });

  /* ----- Review form ----- */
  let starVal = 0;
  const starInput = document.getElementById("starInput");
  const paintStars = (n) =>
    starInput.querySelectorAll("button").forEach((b, i) => {
      b.querySelector("i").className = i < n ? "bi bi-star-fill" : "bi bi-star";
    });
  starInput.addEventListener("click", (e) => {
    const b = e.target.closest("[data-star]");
    if (b) {
      starVal = +b.dataset.star;
      paintStars(starVal);
      starInput.classList.remove("invalid");
    }
  });
  starInput.addEventListener("mouseover", (e) => {
    const b = e.target.closest("[data-star]");
    if (b) paintStars(+b.dataset.star);
  });
  starInput.addEventListener("mouseleave", () => paintStars(starVal));
  document.getElementById("reviewForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const f = e.currentTarget;
    let ok = true;
    f.querySelectorAll(".form-control").forEach((i) => {
      const v = i.value.trim().length >= +i.getAttribute("minlength");
      i.classList.toggle("is-invalid", !v);
      if (!v) ok = false;
    });
    if (!starVal) {
      starInput.classList.add("invalid");
      ok = false;
    }
    if (!ok) return;
    const r = {
      name: document.getElementById("revName").value.trim(),
      rating: starVal,
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      title: document.getElementById("revTitle").value.trim(),
      text: document.getElementById("revText").value.trim(),
    };
    const list = document.getElementById("reviewList");
    list.insertAdjacentHTML("afterbegin", reviewHTML(r));
    list.firstElementChild.classList.add("pop-in");
    f.reset();
    starVal = 0;
    paintStars(0);
    ODDA.toast("Thanks! Your review has been posted.", "bi-chat-heart-fill");
  });

  /* ----- Related ----- */
  const related = PRODUCTS.filter(
    (x) => x.id !== p.id && x.category === p.category,
  );
  const fill = PRODUCTS.filter(
    (x) => x.id !== p.id && x.category !== p.category && x.featured,
  );
  document.getElementById("relatedGrid").innerHTML = [...related, ...fill]
    .slice(0, 4)
    .map((x) => `<div class="col-6 col-lg-3">${ODDA.productCard(x)}</div>`)
    .join("");

  ODDA.observe(document);
})();
