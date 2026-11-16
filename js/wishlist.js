/* =========================================================
   ODDAWURLD — Wishlist (localStorage, synced across pages & tabs)
   ========================================================= */
const Wishlist = (() => {
  const KEY = "oddawurld_wishlist";
  let ids = load();

  function load() {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || [];
    } catch (e) {
      return [];
    }
  }
  function save() {
    localStorage.setItem(KEY, JSON.stringify(ids));
    document.dispatchEvent(new CustomEvent("wishlist:change"));
  }
  const has = (id) => ids.includes(id);
  function toggle(id) {
    if (has(id)) ids = ids.filter((x) => x !== id);
    else ids.push(id);
    save();
    return has(id);
  }
  function remove(id) {
    ids = ids.filter((x) => x !== id);
    save();
  }

  function render() {
    document.querySelectorAll("[data-wish-count]").forEach((el) => {
      el.textContent = ids.length;
      el.classList.toggle("is-empty", ids.length === 0);
    });
    document.querySelectorAll("[data-wish]").forEach((btn) => {
      const on = has(btn.dataset.wish);
      btn.classList.toggle("active", on);
      const icon = btn.querySelector("i");
      if (icon) icon.className = on ? "bi bi-heart-fill" : "bi bi-heart";
      btn.setAttribute("aria-pressed", on);
    });

    const list = document.getElementById("wishItems");
    if (!list) return;
    if (!ids.length) {
      list.innerHTML = `
        <div class="drawer-empty">
          <div class="drawer-empty-icon"><i class="bi bi-heart"></i></div>
          <h6>No favourites yet</h6>
          <p>Tap the heart on any product to save it here.</p>
          <a href="shop.html" class="btn btn-lime btn-sm">Browse gadgets <i class="bi bi-arrow-right"></i></a>
        </div>`;
      return;
    }
    list.innerHTML = ids
      .map((id) => {
        const p = getProduct(id);
        if (!p) return "";
        return `
      <div class="drawer-item">
        <a href="product.html?id=${p.id}" class="drawer-thumb"><img src="${p.image}" alt="${p.name}"></a>
        <div class="drawer-info">
          <a href="product.html?id=${p.id}" class="drawer-name">${p.name}</a>
          <span class="drawer-meta">${formatPrice(p.price)} ${p.oldPrice ? `<del>${formatPrice(p.oldPrice)}</del>` : ""}</span>
          <button class="btn btn-lime btn-xs mt-2" data-wish-to-cart="${p.id}"><i class="bi bi-bag-plus"></i> Move to cart</button>
        </div>
        <button class="drawer-remove" data-wish-remove="${p.id}" aria-label="Remove"><i class="bi bi-x-lg"></i></button>
      </div>`;
      })
      .join("");
  }

  window.addEventListener("storage", (e) => {
    if (e.key === KEY) {
      ids = load();
      render();
    }
  });
  document.addEventListener("wishlist:change", render);

  return {
    has,
    toggle,
    remove,
    render,
    get ids() {
      return ids;
    },
  };
})();
