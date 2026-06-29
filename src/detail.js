import { supabase } from "./supabase.js";

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
  document.querySelector("#name").textContent = toy.name;
  document.querySelector("#price").textContent = `₹${toy.price}`;
  document.querySelector("#description").textContent = toy.description;
  document.querySelector("#age").textContent = `${toy.agegroup}+ Years`;
  document.querySelector("#image").src = toy.toyimage;

  document.querySelector("#whatsapp").onclick = () => {
    const message = `Hi! I'm interested in this toy.

 Product: ${toy.name}
 Price: ₹${toy.price}

Is it available?`;

    window.open(
      `https://wa.me/917012844975?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };
}