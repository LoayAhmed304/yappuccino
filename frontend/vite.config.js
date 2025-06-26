import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), tailwindcss()],
    server: {
      host: true,
      port: Number(env.VITE_PORT) || 5173,
      watch: {
        usePolling: true,
      },
	    allowedHosts: ['yappuccino.loay.work']
    },
  };
});
