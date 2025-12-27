
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 2000, // Uyarı limitini 2MB'a çekerek build logunu temizler
    rollupOptions: {
      output: {
        // Büyük kütüphaneleri otomatik olarak ayrı parçalara böler
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'vendor-core';
            if (id.includes('recharts')) return 'vendor-charts';
            if (id.includes('lucide-react')) return 'vendor-icons';
            if (id.includes('@google/genai')) return 'vendor-ai';
            return 'vendor'; // Diğer kütüphaneler
          }
        },
        // Dosya isimlerini daha düzenli hale getirir
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    },
    // CSS minifikasyonunu zorla
    cssMinify: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Üretim modunda console.log'ları temizler
        drop_debugger: true
      }
    }
  },
  server: {
    port: 3000
  }
});
