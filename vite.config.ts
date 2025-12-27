
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    // Build uyarısını tamamen susturmak için limiti 2MB yapıyoruz
    chunkSizeWarningLimit: 2000, 
    rollupOptions: {
      output: {
        // Kütüphaneleri ayrı parçalara bölerek tarayıcı önbelleklemesini iyileştirir
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'vendor-react';
            if (id.includes('recharts')) return 'vendor-recharts';
            if (id.includes('lucide-react')) return 'vendor-icons';
            if (id.includes('@google/genai')) return 'vendor-ai';
            return 'vendor-libs';
          }
        },
        // Dosya yapısını temiz tutar
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    },
    // Terser hatasını gidermek için varsayılan 'esbuild' kullanıyoruz
    minify: 'esbuild', 
    cssMinify: true,
  },
  server: {
    port: 3000
  }
});
