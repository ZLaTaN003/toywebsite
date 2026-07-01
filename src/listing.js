import "./style.css";
import { supabase } from "./supabase.js";
import { addToCart } from "./cart.js";

const toyGrid = document.getElementById("toy-grid");
console.log("listing.js loaded");

let allToys = [];

let toysById = {};
let searchParams = new URLSearchParams(window.location.search);

function makeToyCard(toy) {
  return (toyGrid.innerHTML += `
      <div class="group flex flex-col">
        <div class="relative">

          <div class="aspect-4/4 overflow-hidden rounded-2xl">
            <img
              src="${toy.toyimage}"
              alt="${toy.productname}"
              class="size-full object-cover rounded-2xl"
            >
          </div>

          <div class="pt-4">
            <p class="font-medium md:text-lg">
              ${toy.productname}
            </p>

            <p class="mt-2 font-semibold">
              ₹${toy.price}
            </p>

            <p class="mt-2 text-sm ${
              toy.instock ? "text-green-600" : "text-red-600"
            }">
              ${toy.instock ? "In Stock" : "Out of Stock"}
            </p>
          </div>

          <a href="detail.html?id=${toy.id}"
             class="after:absolute after:inset-0"></a>
        </div>

        <div class="mt-auto pt-4 flex gap-2">
          <a
            href="detail.html?id=${toy.id}"
            class="py-2 px-3 flex-1 inline-flex justify-center items-center rounded-xl border border-line text-foreground hover:bg-blue-50 transition"
          >
            View Details
          </a>

          <button
            type="button"
            class="add-to-cart-btn py-2 px-3 flex-1 inline-flex justify-center gap-2 items-center rounded-xl border border-line text-foreground hover:bg-blue-50 transition disabled:pointer-events-none "
            data-id="${toy.id}"
            
          >
            <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="8" cy="21" r="1" />
            <circle cx="19" cy="21" r="1" />
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
          </svg>

            Add to Cart
          </button>
        </div>
      </div>
    `);
}
function applySearchFilter() {
  if (!searchParams.get("q")) {
    return allToys;
  }
  const q = searchParams.get("q")?.toLowerCase() || "";
  return allToys.filter((toy) => toy.productname.toLowerCase().includes(q));
}

async function loadToys(limit = null) {
  let { data, error } = await supabase
    .from("Toy")
    .select("id, productname, price, instock, toyimage")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    toyGrid.innerHTML = "<p>Failed to load toys.</p>";
    return;
  }

  if (limit) {
    data = data.slice(0, limit);
  }

  allToys = data;
  const searchInput = document.getElementById("search-input");
  if (searchInput && searchParams.get("q")) {
    searchInput.value = searchParams.get("q");
  }

  const toysToRender = applySearchFilter();

  toyGrid.innerHTML = "";

  toysToRender.forEach((toy) => {
    toysById[toy.id] = toy;
    makeToyCard(toy);
  });

  console.log("Toys loaded:", data);
}

toyGrid.addEventListener("click", (e) => {
  const btn = e.target.closest(".add-to-cart-btn");
  if (!btn) return;

  const toy = toysById[btn.dataset.id];
  if (!toy) return;

  addToCart({
    id: toy.id,
    productname: toy.productname,
    price: toy.price,
    toyimage: toy.toyimage,
  });

  const originalText = btn.textContent;
  btn.textContent = "Added ✓";
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = originalText;
    btn.disabled = false;
  }, 1200);
});

document.querySelectorAll("#search-input").forEach((input) => {
  let timer;
  input.addEventListener("input", () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      const q = input.value.trim();
      if (q.length > 1) {
        window.location.href = `/listing.html?q=${encodeURIComponent(q)}`;
      }
      else if (q.length == 0){
        window.location.href =  "/listing.html";
      }
    }, 500);
  });
});

// load top 5 for detail page
if (
  window.location.pathname.endsWith("index.html") ||
  window.location.pathname === "/"
) {
  loadToys(5);
}
if (window.location.pathname.endsWith("listing.html")) {
  loadToys();
}
