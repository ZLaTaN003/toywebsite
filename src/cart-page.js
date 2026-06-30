import "./style.css";
import {
  getCart,
  removeFromCart,
  setQty,
  getCartTotal,
} from "./cart.js";

const cartItemsEl = document.getElementById("cart-items");
const cartEmptyEl = document.getElementById("cart-empty");
const cartSummaryEl = document.getElementById("cart-summary");
const cartTotalEl = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-whatsapp");

function renderCart() {
  const cart = getCart();

  if (cart.length === 0) {
    cartItemsEl.innerHTML = "";
    cartEmptyEl.classList.remove("hidden");
    cartSummaryEl.classList.add("hidden");
    return;
  }

  cartEmptyEl.classList.add("hidden");
  cartSummaryEl.classList.remove("hidden");

  cartItemsEl.innerHTML = cart
    .map(
      (item) => `
      <div class="flex gap-4 py-5 border-b border-line last:border-b-0" data-id="${item.id}">
        <img
          src="${item.toyimage}"
          alt="${item.productname}"
          class="size-24 object-cover rounded-xl border border-line shrink-0"
        >

        <div class="flex-1 min-w-0">
          <p class="font-medium text-foreground truncate">${item.productname}</p>
          <p class="mt-1 text-sm text-muted-foreground">₹${item.price} each</p>

          <div class="mt-3 flex items-center gap-3">
            <div class="inline-flex items-center rounded-xl border border-line">
              <button type="button" class="qty-decrease size-8 flex items-center justify-center text-lg leading-none hover:bg-layer rounded-l-xl">−</button>
              <span class="w-8 text-center text-sm">${item.qty}</span>
              <button type="button" class="qty-increase size-8 flex items-center justify-center text-lg leading-none hover:bg-layer rounded-r-xl">+</button>
            </div>

            <button type="button" class="remove-item text-sm text-red-600 hover:text-red-700">
              Remove
            </button>
          </div>
        </div>

        <p class="font-semibold text-foreground shrink-0">₹${item.price * item.qty}</p>
      </div>
    `
    )
    .join("");

  cartTotalEl.textContent = `₹${getCartTotal()}`;
}

cartItemsEl.addEventListener("click", (e) => {
  const row = e.target.closest("[data-id]");
  if (!row) return;

  const id = row.dataset.id;
  const cart = getCart();
  const item = cart.find((i) => i.id === id);
  if (!item) return;

  if (e.target.classList.contains("qty-increase")) {
    setQty(item.id, item.qty + 1);
    renderCart();
  } else if (e.target.classList.contains("qty-decrease")) {
    setQty(item.id, item.qty - 1);
    renderCart();
  } else if (e.target.classList.contains("remove-item")) {
    removeFromCart(item.id);
    renderCart();
  }
});

checkoutBtn.addEventListener("click", () => {
  const cart = getCart();
  if (cart.length === 0) return;

  const lines = cart.map(
    (item) => `Product: ${item.productname}\nQuantity: ${item.qty}\nPrice: ₹${item.price * item.qty}\nProduct Link: ${window.location.origin}/detail.html?id=${item.id}\n`
               
  );

  const message = `Hi! I'd like to order the following items:

${lines.join("\n")}

Total: ₹${getCartTotal()}

Please let me know availability and how to proceed.`;

  window.open(
    `https://wa.me/917012844975?text=${encodeURIComponent(message)}`,
    "_blank"
  );
});

renderCart();