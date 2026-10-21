import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Local dev me /api calls backend (port 5000) pe forward ho jayengi
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: { "/api": "http://localhost:5000" },
  },
});
