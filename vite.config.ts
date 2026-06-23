import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

// The frontend talks to the bonus Express API at /api/* and Vite proxies
// it to the backend during development. See server/index.js.
// svgr lets us import *.svg?react as themeable React components.
export default defineConfig({
  plugins: [react(), svgr()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
});
