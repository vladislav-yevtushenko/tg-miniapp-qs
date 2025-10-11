import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  console.log(`Running Vite in ${mode} mode (${command})`);
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react()],
    server: {
      allowedHosts: [".ngrok-free.dev"],
      proxy: {
        "/api/v1/": {
          target: env.VITE_APP_API_URL,
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
