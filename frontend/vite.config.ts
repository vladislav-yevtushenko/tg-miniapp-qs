import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  console.log(`Running Vite in ${mode} mode (${command})`);
  const env = loadEnv(mode, process.cwd(), "");
  console.log("Environment Variables:", env);
  return {
    plugins: [react()],
    server: {
      allowedHosts: [".audiohookserver.uk", "localhost"],
      port: 8765,
      proxy: {
        "/health": {
          target: env.VITE_APP_API_URL + "/api/v1/",
          changeOrigin: false,
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
