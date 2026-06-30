const CART_KEY = "toyshop_cart";

export function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  renderCartBadge();
}

export function addToCart(toy, qty = 1) {
  const id = String(toy.id);
  const cart = getCart();
  const existing = cart.find((item) => item.id === id);

  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({
      id,
      productname: toy.productname,
      price: toy.price,
      toyimage: toy.toyimage,
      qty,
    });
  }

  saveCart(cart);
}

export function removeFromCart(id) {
  const cart = getCart().filter((item) => item.id !== String(id));
  saveCart(cart);
}

export function setQty(id, qty) {
  const cart = getCart();
  const item = cart.find((item) => item.id === String(id));
  if (!item) return;

  if (qty <= 0) {
    removeFromCart(id);
    return;
  }

  item.qty = qty;
  saveCart(cart);
}

export function clearCart() {
  saveCart([]);
}

export function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}

export function getCartTotal() {
  return getCart().reduce((sum, item) => sum + item.qty * item.price, 0);
}

// Updates every element marked data-cart-count on the page (header badge)
export function renderCartBadge() {
  const count = getCartCount();
  document.querySelectorAll("[data-cart-count]").forEach((el) => {
    el.textContent = count;
    el.classList.toggle("hidden", count === 0);
  });
}

window.addEventListener("load", renderCartBadge);

// Keep badge in sync across tabs
window.addEventListener("storage", (e) => {
  if (e.key === CART_KEY) renderCartBadge();
});