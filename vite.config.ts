import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    define: {
      // Define process.env.API_KEY for the Google GenAI SDK using the VITE_ prefixed variable
      'process.env.API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY || '')
    },
    server: {
      port: 3000,
      host: true,
      open: true
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true
    }
  };
});