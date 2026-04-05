import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/graphql": {
        target: "http://localhost:4000",
        changeOrigin: true,
      },
      "/subscriptions": {
        target: "ws://localhost:4000",
        ws: true,
      },
    },
  },
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              test: /node_modules/,
              name: (moduleId) =>
                moduleId.includes("node_modules")
                  ? moduleId
                      .toString()
                      .split("node_modules/")[1]
                      .split("/")[0]
                      .toString()
                  : "vendor",
            },
          ],
        },
      },
    },
  },
  resolve: {
    conditions: ["mui-modern", "module", "browser", "development|production"],
  },
});
