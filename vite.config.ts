import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      /**
       * An error when building ESM, follow the link below to resolve it.
       *
       * Reference: https://github.com/cornerstonejs/cornerstone3D/issues/1071#issuecomment-1937372101
       */
      "@cornerstonejs/tools": "@cornerstonejs/tools/dist/umd/index.js",
    },
  },
  build: {
    /**
     * When executing RenderingEngine getInstance,
     * an error occurred due to a top level await call, so we applied.
     *
     * Reference: https://stackoverflow.com/questions/76616620/vite-refuses-to-use-the-correct-build-target-in-my-svelte-ts-project
     */
    target: "esnext",
  },
});
