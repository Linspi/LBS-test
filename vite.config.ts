import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import Sitemap from "vite-plugin-sitemap";
import path from "path";
import { destinations } from "./src/data/destinations";

/* ── Routes statiques de l'application (/ est ajouté automatiquement par le plugin) ── */
const staticRoutes = [
  "/trajets",
  "/mise-a-disposition",
  "/excursions",
  "/evenements",
  "/location",
  "/entreprise",
  "/reservation",
  "/reservation-experience",
];

/* ── Routes dynamiques générées depuis les landing pages SEO ── */
const landingRoutes = destinations
  .filter((d) => d.slug)
  .map((d) => `/trajets/${d.slug}`);

// TODO: Remplacer par le vrai nom de domaine avant la mise en production
const HOSTNAME = "https://www.VOTRE-DOMAINE-ICI.com";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    Sitemap({
      hostname: HOSTNAME,
      dynamicRoutes: [...staticRoutes, ...landingRoutes],
      readable: true,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
