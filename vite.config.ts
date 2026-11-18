import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  // На GitHub Pages проект живёт в /<repo>/, локально и в тестах — в корне.
  base: mode === 'development' || mode === 'test' ? '/' : '/react-name-patronymic/',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      disable: mode === 'test',
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      manifest: {
        name: 'Отчество по имени отца',
        short_name: 'Отчество',
        description:
          'Отчество по имени отца, обратный поиск и правила словообразования. Словарь популярных имён.',
        lang: 'ru',
        dir: 'ltr',
        theme_color: '#4f46e5',
        background_color: '#f8fafc',
        display: 'standalone',
        orientation: 'portrait-primary',
        categories: ['utilities', 'education'],
        icons: [
          {
            src: 'icons/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'icons/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'icons/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: 'icons/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,ico,webmanifest}'],
        navigateFallback: 'index.html',
        cleanupOutdatedCaches: true,
      },
    }),
  ],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    // Меньше параллельных воркеров: на медленных дисках форки с jsdom не успевают стартовать.
    pool: 'threads',
    maxWorkers: 2,
    // Компонентные тесты в jsdom на медленных машинах иногда не укладываются в 5 секунд.
    testTimeout: 15_000,
  },
}))
