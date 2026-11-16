/* =========================================================
   ODDAWURLD — Shop page: search, filters, sort, views, pagination
   ========================================================= */
(() => {
  const grid = document.getElementById("shopGrid");
  if (!grid) return;

  const MAX_PRICE =
    Math.ceil(Math.max(...PRODUCTS.map((p) => p.price)) / 50) * 50;
  const BRANDS = [...new Set(PRODUCTS.map((p) => p.brand))].sort();
  const params = new URLSearchParams(location.search);

  const state = {
    q: params.get("q") || "",
    cats: new Set(params.get("cat") ? [params.get("cat")] : []),
    brands: new Set(),
    minRating: 0,
    maxPrice: MAX_PRICE,
    sort: "featured",
    view: localStorage.getItem("oddawurld_view") || "grid",
    page: 1,
    perPage: 9,
  };

  const $ = (id) => document.getElementById(id);
  const els = {
    search: $("shopSearch"),
    sort: $("shopSort"),
    count: $("shopCount"),
    cats: $("filterCats"),
    brands: $("filterBrands"),
    ratings: $("filterRatings"),
    price: $("priceRange"),
    priceVal: $("priceValue"),
    chips: $("activeChips"),
    pager: $("shopPager"),
    empty: $("shopEmpty"),
    reset: document.querySelectorAll("[data-reset-filters]"),
    views: document.querySelectorAll("[data-view]"),
  };

  /* ----- Build sidebar ----- */
  els.cats.innerHTML =
    `
    <label class="check-row"><input type="checkbox" value="all" ${state.cats.size === 0 ? "checked" : ""}><span class="check-box"></span><i class="bi bi-grid"></i> All products <em>${PRODUCTS.length}</em></label>` +
    CATEGORIES.map(
      (c) => `
    <label class="check-row"><input type="checkbox" value="${c.key}" ${state.cats.has(c.key) ? "checked" : ""}><span class="check-box"></span><i class="bi ${c.icon}"></i> ${c.name} <em>${PRODUCTS.filter((p) => p.category === c.key).length}</em></label>`,
    ).join("");

  els.brands.innerHTML = BRANDS.map(
    (b) => `
    <label class="check-row"><input type="checkbox" value="${b}"><span class="check-box"></span> ${b} <em>${PRODUCTS.filter((p) => p.brand === b).length}</em></label>`,
  ).join("");

  els.ratings.innerHTML = [0, 4.5, 4.7, 4.8]
    .map(
      (r, i) => `
    <label class="check-row radio"><input type="radio" name="rating" value="${r}" ${i === 0 ? "checked" : ""}><span class="check-box"></span>
      ${r === 0 ? "Any rating" : `${ODDA.stars(r)} <small>${r}+</small>`}</label>`,
    )
    .join("");

  els.price.max = MAX_PRICE;
  els.price.value = MAX_PRICE;
  els.search.value = state.q;

  /* ----- Filtering ----- */
  function filtered() {
    const q = state.q.trim().toLowerCase();
    let list = PRODUCTS.filter(
      (p) =>
        (!q ||
          (p.name + " " + p.brand + " " + p.category + " " + p.short)
            .toLowerCase()
            .includes(q)) &&
        (state.cats.size === 0 || state.cats.has(p.category)) &&
        (state.brands.size === 0 || state.brands.has(p.brand)) &&
        p.rating >= state.minRating &&
        p.price <= state.maxPrice,
    );
    const sorters = {
      featured: (a, b) => b.featured - a.featured || b.reviews - a.reviews,
      "price-asc": (a, b) => a.price - b.price,
      "price-desc": (a, b) => b.price - a.price,
      rating: (a, b) => b.rating - a.rating,
      discount: (a, b) => discountOf(b) - discountOf(a),
      name: (a, b) => a.name.localeCompare(b.name),
    };
    return list.sort(sorters[state.sort]);
  }

  function updatePriceFill() {
    const pct = (els.price.value / MAX_PRICE) * 100;
    els.price.style.setProperty("--fill", pct + "%");
    els.priceVal.textContent = formatPrice(els.price.value).replace(".00", "");
  }

  function chips() {
    const list = [];
    if (state.q)
      list.push({
        label: `“${state.q}”`,
        clear: () => {
          state.q = "";
          els.search.value = "";
        },
      });
    state.cats.forEach((c) =>
      list.push({
        label: getCategory(c).name,
        clear: () => {
          state.cats.delete(c);
          syncChecks();
        },
      }),
    );
    state.brands.forEach((b) =>
      list.push({
        label: b,
        clear: () => {
          state.brands.delete(b);
          syncChecks();
        },
      }),
    );
    if (state.minRating)
      list.push({
        label: state.minRating + "★ & up",
        clear: () => {
          state.minRating = 0;
          els.ratings.querySelector('input[value="0"]').checked = true;
        },
      });
    if (state.maxPrice < MAX_PRICE)
      list.push({
        label: "Under " + formatPrice(state.maxPrice).replace(".00", ""),
        clear: () => {
          state.maxPrice = MAX_PRICE;
          els.price.value = MAX_PRICE;
          updatePriceFill();
        },
      });
    els.chips.innerHTML =
      list
        .map(
          (c, i) =>
            `<button class="chip chip-x" data-chip="${i}">${c.label} <i class="bi bi-x"></i></button>`,
        )
        .join("") +
      (list.length
        ? '<button class="chip chip-clear" data-reset-filters>Clear all</button>'
        : "");
    els.chips.querySelectorAll("[data-chip]").forEach((btn) =>
      btn.addEventListener("click", () => {
        list[btn.dataset.chip].clear();
        state.page = 1;
        render();
      }),
    );
    els.chips
      .querySelector("[data-reset-filters]")
      ?.addEventListener("click", resetAll);
  }

  function syncChecks() {
    els.cats.querySelectorAll("input").forEach((i) => {
      i.checked =
        i.value === "all" ? state.cats.size === 0 : state.cats.has(i.value);
    });
    els.brands.querySelectorAll("input").forEach((i) => {
      i.checked = state.brands.has(i.value);
    });
  }

  function pager(totalPages) {
    if (totalPages <= 1) {
      els.pager.innerHTML = "";
      return;
    }
    let html = `<button class="page-btn" data-page="${state.page - 1}" ${state.page === 1 ? "disabled" : ""} aria-label="Previous"><i class="bi bi-chevron-left"></i></button>`;
    for (let i = 1; i <= totalPages; i++)
      html += `<button class="page-btn ${i === state.page ? "active" : ""}" data-page="${i}">${i}</button>`;
    html += `<button class="page-btn" data-page="${state.page + 1}" ${state.page === totalPages ? "disabled" : ""} aria-label="Next"><i class="bi bi-chevron-right"></i></button>`;
    els.pager.innerHTML = html;
  }

  function render() {
    const list = filtered();
    const totalPages = Math.max(1, Math.ceil(list.length / state.perPage));
    state.page = Math.min(state.page, totalPages);
    const start = (state.page - 1) * state.perPage;
    const pageItems = list.slice(start, start + state.perPage);

    grid.classList.toggle("is-list", state.view === "list");
    els.views.forEach((v) =>
      v.classList.toggle("active", v.dataset.view === state.view),
    );
    grid.innerHTML = pageItems
      .map((p) => `<div class="shop-col">${ODDA.productCard(p)}</div>`)
      .join("");
    els.empty.classList.toggle("d-none", list.length > 0);
    els.count.innerHTML = list.length
      ? `Showing <strong>${start + 1}–${start + pageItems.length}</strong> of <strong>${list.length}</strong> products`
      : "No products found";
    pager(totalPages);
    chips();
    ODDA.observe(grid);

    // keep URL shareable
    const u = new URLSearchParams();
    if (state.q) u.set("q", state.q);
    if (state.cats.size === 1) u.set("cat", [...state.cats][0]);
    history.replaceState(
      null,
      "",
      location.pathname + (u.toString() ? "?" + u : ""),
    );
  }

  function resetAll() {
    state.q = "";
    state.cats.clear();
    state.brands.clear();
    state.minRating = 0;
    state.maxPrice = MAX_PRICE;
    state.page = 1;
    els.search.value = "";
    els.price.value = MAX_PRICE;
    updatePriceFill();
    els.ratings.querySelector('input[value="0"]').checked = true;
    syncChecks();
    render();
  }

  /* ----- Events ----- */
  let t;
  els.search.addEventListener("input", () => {
    clearTimeout(t);
    t = setTimeout(() => {
      state.q = els.search.value;
      state.page = 1;
      render();
    }, 200);
  });
  els.search
    .closest("form")
    ?.addEventListener("submit", (e) => e.preventDefault());
  els.sort.addEventListener("change", () => {
    state.sort = els.sort.value;
    state.page = 1;
    render();
  });
  els.cats.addEventListener("change", (e) => {
    const v = e.target.value;
    if (v === "all") state.cats.clear();
    else e.target.checked ? state.cats.add(v) : state.cats.delete(v);
    syncChecks();
    state.page = 1;
    render();
  });
  els.brands.addEventListener("change", (e) => {
    e.target.checked
      ? state.brands.add(e.target.value)
      : state.brands.delete(e.target.value);
    state.page = 1;
    render();
  });
  els.ratings.addEventListener("change", (e) => {
    state.minRating = parseFloat(e.target.value);
    state.page = 1;
    render();
  });
  els.price.addEventListener("input", () => {
    updatePriceFill();
    state.maxPrice = +els.price.value;
    state.page = 1;
    clearTimeout(t);
    t = setTimeout(render, 120);
  });
  els.views.forEach((v) =>
    v.addEventListener("click", () => {
      state.view = v.dataset.view;
      localStorage.setItem("oddawurld_view", state.view);
      render();
    }),
  );
  els.pager.addEventListener("click", (e) => {
    const b = e.target.closest("[data-page]");
    if (!b || b.disabled) return;
    state.page = +b.dataset.page;
    render();
    document
      .getElementById("shopTop")
      .scrollIntoView({ behavior: "smooth", block: "start" });
  });
  els.reset.forEach((b) => b.addEventListener("click", resetAll));

  updatePriceFill();
  render();
})();
