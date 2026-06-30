import "./style.css";
import { supabase } from "./supabase.js";
import { addToCart } from "./cart.js";



const params = new URLSearchParams(window.location.search);
const id = params.get("id");
console.log("Detail page loaded with id:", id);
const { data: toy, error } = await supabase
  .from("Toy")
  .select("*")
  .eq("id", id)
  .single();

if (error) {
  console.error(error);
} else {
  console.log("Toy data:", toy);
  document.querySelector("#name").textContent = toy.productname;
  document.querySelector("#price").textContent = `₹${toy.price}`;
  document.querySelector("#description").textContent = toy.description;
  document.querySelector("#age").textContent = `${toy.agegroup}+ Years`;
  document.querySelector("#image").src = toy.toyimage;
  document.querySelector("#category").textContent = toy.category;

  const addToCartBtn = document.querySelector("#add-to-cart");
 
  addToCartBtn.addEventListener("click", () => {
    addToCart({
      id: toy.id,
      productname: toy.productname,
      price: toy.price,
      toyimage: toy.toyimage,
    });
 
    const originalText = addToCartBtn.textContent;
    addToCartBtn.textContent = "Added to Cart ✓";
    setTimeout(() => {
      addToCartBtn.textContent = originalText;
    }, 1500);
  });

  document.querySelector("#whatsapp").onclick = () => {
    const message = `Hi! I'm interested in this item.

 Product: ${toy.productname}
 Price: ₹${toy.price}
 Product Link: ${window.location.href}

Is it available?`;

    window.open(
      `https://wa.me/917012844975?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };
}