import "./style.css";
import "preline";
import { supabase } from "./supabase.js";


window.addEventListener("load", () => {
  window.HSStaticMethods?.autoInit();
});

const toyGrid = document.getElementById("toy-grid");
console.log("listing.js loaded");

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

  toyGrid.innerHTML = "";

  data.forEach((toy) => {
    toyGrid.innerHTML += `
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

        <div class="mt-auto pt-4">
          <a
            href="detail.html?id=${toy.id}"
            class="py-2 px-3 w-full inline-flex justify-center items-center rounded-xl bg-primary text-white"
          >
            View Details
          </a>
        </div>
      </div>
    `;
  });

  console.log("Toys loaded:", data);
}

// load top 5 for detail page
if (window.location.pathname.endsWith("index.html") || window.location.pathname === "/") {
  loadToys(5);
}
if (window.location.pathname.endsWith("listing.html")) {
    loadToys();
    
}