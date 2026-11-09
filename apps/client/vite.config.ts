import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

const server = process.env.AGM_SERVER_URL ?? "http://127.0.0.1:3000";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icon.svg"],
      manifest: {
        name: "Adventure Guild Manager",
        short_name: "Guild Manager",
        description: "Run a Guild of Adventurers in a Dungeon shared by every Guild.",
        theme_color: "#1f1a14",
        background_color: "#1f1a14",
        display: "standalone",
        icons: [{ src: "icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
      },
    }),
  ],
  server: {
    port: 5173,
    proxy: {
      "/api": { target: server, changeOrigin: false },
      "/ws": { target: server.replace(/^http/, "ws"), ws: true },
    },
  },
});
