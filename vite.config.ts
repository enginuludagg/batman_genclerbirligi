
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // API Key ve diğer env değişkenlerini derleme sırasında tanımlar
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || '')
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    emptyOutDir: true,
    rollupOptions: {
      output: {
        // Kütüphaneleri ayrı dosyalara bölerek yükleme hızını artırır
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-ui': ['lucide-react', 'recharts']
        }
      }
    }
  },
  server: {
    port: 3000,
    strictPort: true
  }
});
