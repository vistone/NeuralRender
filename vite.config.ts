import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        proxy: {
          '/api': {
            target: 'http://localhost:3001',
            changeOrigin: true,
          },
        },
      },
      plugins: [react()],
      define: {
        // Keep these for backward compatibility with client-side mode
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.DEEPSEEK_API_KEY': JSON.stringify(env.DEEPSEEK_API_KEY),
        'process.env.KIMI_API_KEY': JSON.stringify(env.KIMI_API_KEY),
        // Server mode configuration
        'import.meta.env.VITE_USE_SERVER': JSON.stringify(env.VITE_USE_SERVER !== 'false'),
        'import.meta.env.VITE_SERVER_URL': JSON.stringify(env.VITE_SERVER_URL || 'http://localhost:3001')
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
