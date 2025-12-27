import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || '')
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 2000, // Uyarı limitini 2MB'a çıkarıyoruz (Gereksiz uyarıları engeller)
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Büyük kütüphaneleri ayrı paketleyerek açılış hızını artır
          if (id.includes('node_modules')) {
            if (id.includes('firebase')) {
              return 'firebase'; // Firebase'i ayrı paketle
            }
            if (id.includes('react')) {
              return 'vendor-react'; // React'i ayrı paketle
            }
            return 'vendor'; // Diğerlerini vendor paketine koy
          }
        }
      }
    }
  },
  server: {
    port: 3000
  }
});