import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Allow external connections
    port: 3012,
    strictPort: false, // Try next available port if 5173 is taken
    proxy: {
      // Proxy API calls to backend
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        // Don't rewrite - keep /api prefix as backend routes expect it
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
});
