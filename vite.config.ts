import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Allow external access
    allowedHosts: ["3b33-2601-249-1902-b560-a521-20c1-178b-9dc3.ngrok-free.app"], // Allow all hosts
  },
});