import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/",
  worker: {
    format: "es",
  },
  optimizeDeps: {
    exclude: ["@xmtp/browser-sdk"],
    include: ["protobufjs/minimal"],
  },
  define: {
    global: "globalThis",
  },
  server: {
    allowedHosts: "all",
    host: "0.0.0.0",
    port: 5173,
  },
  build: {
    outDir: "dist",
    sourcemap: process.env.NODE_ENV === "development",
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          router: ["react-router-dom"],
          xmtp: ["@xmtp/browser-sdk"],
        },
      },
    },
  },
});
