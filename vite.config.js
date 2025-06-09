import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
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
  build: {
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
  },
});
