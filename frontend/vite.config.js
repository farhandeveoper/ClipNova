import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({ plugins: [react()], server: { port: 5173, hmr: true, watch: { usePolling: true }, proxy: { "/api": "http://localhost:5000" } } });
