import "./style.css";
import "preline";
import { supabase } from "./supabase.js";


window.addEventListener("load", () => {
  window.HSStaticMethods?.autoInit();
});

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

  document.querySelector("#whatsapp").onclick = () => {
    const message = `Hi! I'm interested in this toy.

 Product: ${toy.productname}
 Price: ₹${toy.price}

Is it available?`;

    window.open(
      `https://wa.me/917012844975?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };
}