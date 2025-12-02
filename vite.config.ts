import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Bundle analysis tool (opens after build)
    visualizer({
      open: false, // Set to true to auto-open after build
      gzipSize: true,
      brotliSize: true,
      filename: "./dist/stats.html",
    }),
  ],
  base: "./",

  build: {
    target: "es2020",
    // minify: "terser", // Removed as terser is not installed
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          // React vendor bundle
          "react-vendor": ["react", "react-dom"],
          // Animation library
          animation: ["framer-motion"],
          // Validation library
          validation: ["zod"],
        },
        // Optimize chunk file names
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js",
        assetFileNames: "assets/[ext]/[name]-[hash].[ext]",
      },
    },
    // Chunk size warning limit
    chunkSizeWarningLimit: 500,
    // Disable source maps in production for smaller bundle
    sourcemap: false,
    // Report compressed size
    reportCompressedSize: true,
    // Inline small assets as base64
    assetsInlineLimit: 4096, // 4kb
  },

  // Optimize dependencies
  optimizeDeps: {
    include: ["react", "react-dom", "framer-motion"],
    exclude: [],
  },
});
