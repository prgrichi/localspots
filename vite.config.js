/// <reference types="vitest/config" />

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Localspots',
        short_name: 'Localspots',
        description: 'Localspots-App für Freunde',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        navigateFallback: '/index.html',
      },
      devOptions: {
        enabled: false, // verhindert Cache-Chaos lokal
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    exclude: ['e2e/**', 'node_modules/**', 'dist/**'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (
            id.includes('node_modules/vue') ||
            id.includes('node_modules/vue-router') ||
            id.includes('node_modules/pinia') ||
            id.includes('node_modules/naive-ui') ||
            id.includes('node_modules/vooks')
          ) {
            return 'vendor-core';
          }

          if (id.includes('node_modules/leaflet') || id.includes('node_modules/@vue-leaflet')) {
            return 'vendor-map';
          }

          if (id.includes('node_modules/pocketbase')) {
            return 'vendor-backend';
          }

          return undefined;
        },
      },
    },
  },
});
