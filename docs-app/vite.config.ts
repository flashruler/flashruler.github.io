import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Tells Vite where the index.html is for this project
  root: "./", 
  // Ensures assets load from the docs subpath
  base: "/docs/", 
  build: {
    // Output to a temporary folder for the Action to pick up
    outDir: "dist", 
    emptyOutDir: true,
  },
});