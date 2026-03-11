import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  // This changes the out put dir from dist to build
  // comment this out if that isn't relevant for your project
  build: {
    outDir: "build",
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks: {
          // TF.js core — largest chunk, changes rarely, cache aggressively
          tfjs: [
            "@tensorflow/tfjs",
          ],
          // Firebase SDK
          firebase: [
            "firebase/app",
            "firebase/firestore",
            "firebase/storage",
          ],
          // React ecosystem
          react: ["react", "react-dom", "react-router-dom"],
          // UI utilities
          vendor: ["lucide-react", "date-fns", "uuid", "clsx", "tailwind-merge"],
        },
      },
    },
  },
  plugins: [tsconfigPaths(), react()],
  server: {
    port: "4028",
    host: "0.0.0.0",
    strictPort: true,
    allowedHosts: ['.amazonaws.com', '.builtwithrocket.new']
  }
});