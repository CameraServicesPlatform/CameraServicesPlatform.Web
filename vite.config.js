// vite.config.js
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ["react-qr-scanner"],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return "vendor"; // Creates a separate chunk for dependencies in node_modules
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Adjust chunk size limit if necessary
  },
});
