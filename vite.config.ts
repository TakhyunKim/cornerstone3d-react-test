import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      /**
       * esm 빌드 시 에러가 발생하여 아래 링크 참고하여 해결
       * https://github.com/cornerstonejs/cornerstone3D/issues/1071#issuecomment-1937372101
       */
      "@cornerstonejs/tools": "@cornerstonejs/tools/dist/umd/index.js",
    },
  },
});
