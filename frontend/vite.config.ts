import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  console.log(`Running Vite in ${mode} mode (${command})`);
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react(), tsconfigPaths()],
    server: {
      allowedHosts: [".audiohookserver.uk", "localhost"],
      port: env.VITE_APP_PORT ? parseInt(env.VITE_APP_PORT) : 8080,
      proxy: {
        "/health": {
          target: env.VITE_APP_API_URL + "/api/v1/",
          changeOrigin: true,
          secure: false,
        },
        "/listings": {
          target: env.VITE_APP_API_URL + "/api/v1/",
          changeOrigin: true,
          secure: false,
        },
      },
    },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  };
});
