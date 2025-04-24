import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Allow external access
    allowedHosts: ["5fa9-2601-249-1902-b560-bd17-a3b7-16f3-cd3e.ngrok-free.app"], // Allow all hosts
  },
});