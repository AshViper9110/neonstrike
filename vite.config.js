import { defineConfig } from 'vite';
import path from 'node:path';

const ROOT = import.meta.dirname;

export default defineConfig({
  base: './',
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    open: '/dev.html',
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
    strictPort: true,
  },
  build: {
    target: 'es2022',
    outDir: 'dist',
    emptyOutDir: true,
    // Bundle everything (Three.js, PeerJS, game code, fonts) into game.js and
    // styles.css. Library mode emits a classic IIFE that works from file://.
    lib: {
      entry: path.resolve(ROOT, 'src/main.js'),
      formats: ['iife'],
      name: 'NeonStrike',
      fileName: () => 'game.js',
      cssFileName: 'styles',
    },
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          const names = assetInfo.names || [assetInfo.name || ''];
          if (names.some((name) => name.endsWith('.css'))) return 'styles.css';
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
    chunkSizeWarningLimit: 1600,
  },
});
