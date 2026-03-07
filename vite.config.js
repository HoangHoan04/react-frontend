import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";

// https://vite.dev/config/
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      onwarn(warning, warn) {
        // Ignore eval warnings from lottie-web
        if (warning.code === "EVAL" && warning.id?.includes("lottie")) {
          return;
        }
        warn(warning);
      },
      output: {
        manualChunks: {
          // React core
          vendor: ["react", "react-dom", "react-router-dom"],
          // Charts library
          charts: ["recharts"],
          // Animations
          animations: ["lottie-react", "lottie-web"],
          // UI libraries
          ui: ["@tanstack/react-query", "date-fns", "react-date-range"],
          // State management
          state: ["zustand"],
          // DnD
          dnd: ["@dnd-kit/core", "@dnd-kit/sortable"],
        },
      },
    },
  },
});
