import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        listing: resolve(__dirname, "listing.html"),
        detail: resolve(__dirname, "detail.html"),
        cart: resolve(__dirname, "cart.html"),
      },
    },
  },
});