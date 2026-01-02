
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Vercel veya yerel ortamdaki API_KEY'i process.env.API_KEY olarak koda enjekte eder
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || '')
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    target: 'esnext'
  },
  server: {
    port: 3000,
    host: true
  }
});
