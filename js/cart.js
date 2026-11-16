/* =========================================================
   ODDAWURLD — Cart (localStorage, synced across pages & tabs)
   ========================================================= */
const Cart = (() => {
  const KEY = "oddawurld_cart";
  const FREE_SHIPPING = 50;
  const SHIPPING_FEE = 9.99;
  let items = load();

  function load() {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || [];
    } catch (e) {
      return [];
    }
  }
  function save() {
    localStorage.setItem(KEY, JSON.stringify(items));
    document.dispatchEvent(new CustomEvent("cart:change"));
  }
  const lineKey = (id, color) => id + "|" + (color || "");

  function add(id, qty = 1, color) {
    const p = getProduct(id);
    if (!p) return;
    color = color || p.colors[0];
    const found = items.find(
      (i) => lineKey(i.id, i.color) === lineKey(id, color),
    );
    if (found) found.qty = Math.min(found.qty + qty, 99);
    else items.push({ id, qty, color });
    save();
  }
  function setQty(key, qty) {
    const it = items.find((i) => lineKey(i.id, i.color) === key);
    if (!it) return;
    if (qty <= 0) items = items.filter((i) => i !== it);
    else it.qty = Math.min(qty, 99);
    save();
  }
  function remove(key) {
    items = items.filter((i) => lineKey(i.id, i.color) !== key);
    save();
  }
  function clear() {
    items = [];
    save();
  }
  function count() {
    return items.reduce((s, i) => s + i.qty, 0);
  }
  function subtotal() {
    return items.reduce(
      (s, i) => s + (getProduct(i.id)?.price || 0) * i.qty,
      0,
    );
  }
  function shipping() {
    const st = subtotal();
    return st === 0 || st >= FREE_SHIPPING ? 0 : SHIPPING_FEE;
  }
  function total() {
    return subtotal() + shipping();
  }

  function render() {
    document.querySelectorAll("[data-cart-count]").forEach((el) => {
      const c = count();
      el.textContent = c;
      el.classList.toggle("is-empty", c === 0);
      el.classList.remove("bump");
      void el.offsetWidth;
      el.classList.add("bump");
    });

    const list = document.getElementById("cartItems");
    if (!list) return;
    if (!items.length) {
      list.innerHTML = `
        <div class="drawer-empty">
          <div class="drawer-empty-icon"><i class="bi bi-bag"></i></div>
          <h6>Your cart is empty</h6>
          <p>Discover gadgets that keep you ahead.</p>
          <a href="shop.html" class="btn btn-lime btn-sm">Start shopping <i class="bi bi-arrow-right"></i></a>
        </div>`;
    } else {
      list.innerHTML = items
        .map((i) => {
          const p = getProduct(i.id);
          if (!p) return "";
          const k = lineKey(i.id, i.color);
          const col = COLORS[i.color];
          return `
        <div class="drawer-item">
          <a href="product.html?id=${p.id}" class="drawer-thumb"><img src="${p.image}" alt="${p.name}"></a>
          <div class="drawer-info">
            <a href="product.html?id=${p.id}" class="drawer-name">${p.name}</a>
            <span class="drawer-meta">${col ? `<i class="swatch-dot" style="--c:${col.hex}"></i>${col.name}` : ""}</span>
            <div class="d-flex align-items-center justify-content-between mt-2">
              <div class="qty-mini">
                <button data-cart-dec="${k}" aria-label="Decrease"><i class="bi bi-dash"></i></button>
                <span>${i.qty}</span>
                <button data-cart-inc="${k}" aria-label="Increase"><i class="bi bi-plus"></i></button>
              </div>
              <strong class="text-lime">${formatPrice(p.price * i.qty)}</strong>
            </div>
          </div>
          <button class="drawer-remove" data-cart-remove="${k}" aria-label="Remove"><i class="bi bi-x-lg"></i></button>
        </div>`;
        })
        .join("");
    }
    const st = subtotal();
    const set = (id, v) => {
      const el = document.getElementById(id);
      if (el) el.textContent = v;
    };
    set("cartSubtotal", formatPrice(st));
    set(
      "cartShipping",
      shipping() === 0 ? (st ? "Free" : "—") : formatPrice(shipping()),
    );
    set("cartTotal", formatPrice(total()));
    const bar = document.getElementById("shipProgress");
    const note = document.getElementById("shipNote");
    if (bar && note) {
      const pct = Math.min(100, (st / FREE_SHIPPING) * 100);
      bar.style.width = pct + "%";
      note.innerHTML =
        st >= FREE_SHIPPING
          ? '<i class="bi bi-truck"></i> You unlocked <strong>free shipping</strong>!'
          : `Add <strong>${formatPrice(FREE_SHIPPING - st)}</strong> more for free shipping`;
    }
    const checkout = document.getElementById("checkoutBtn");
    if (checkout) checkout.disabled = !items.length;
  }

  window.addEventListener("storage", (e) => {
    if (e.key === KEY) {
      items = load();
      render();
    }
  });
  document.addEventListener("cart:change", render);

  return {
    add,
    setQty,
    remove,
    clear,
    count,
    subtotal,
    shipping,
    total,
    render,
    get items() {
      return items;
    },
  };
})();
