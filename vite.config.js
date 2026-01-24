import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks - split large libraries
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['react-icons', 'react-toastify'],
          'utils-vendor': ['axios'],
        },
      },
    },
    // Increase chunk size warning limit to 600KB (or remove warning if acceptable)
    chunkSizeWarningLimit: 600,
  },
});
