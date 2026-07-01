import "./style.css";

document.querySelectorAll("input[name='q']").forEach((input) => {
  input.addEventListener("input", (e) => {
    if (e.target.value === "") {
      window.location.href = "/listing.html";
    }
  });
});

const q = new URLSearchParams(window.location.search).get("q") || "";

if (q) {
  const searchInput = document.getElementById("search-input");
  const inputSearch = document.getElementById("input-search");
  if (searchInput) searchInput.value = q;
  if (inputSearch) inputSearch.value = q;

  const heading = document.getElementById("search-heading");
  const querySpan = document.getElementById("search-query");
  if (heading && querySpan) {
    querySpan.textContent = q;
    heading.classList.remove("hidden");
  }
}


