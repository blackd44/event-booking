import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import Fonts from "unplugin-fonts/vite";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    Fonts({
      google: { families: [{ name: "Inter", styles: "wght@400;500;700" }] },
    }),
  ],
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
});
