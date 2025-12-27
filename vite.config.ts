
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Tarayıcı tarafında process.env hatasını engeller ve anahtarı geçer
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || '')
  },
  publicDir: '.', // Kök dizindeki sw.js ve manifest.json'ı public varlık olarak kabul et
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 2000, 
    rollupOptions: {
      // sw.js'in build klasörüne kopyalanmasını garanti altına al
      input: {
        main: './index.html',
      },
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'vendor-react';
            if (id.includes('recharts')) return 'vendor-recharts';
            if (id.includes('lucide-react')) return 'vendor-icons';
            if (id.includes('firebase')) return 'vendor-firebase';
            return 'vendor-libs';
          }
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    },
    minify: 'esbuild', 
    cssMinify: true,
  },
  server: {
    port: 3000
  }
});
