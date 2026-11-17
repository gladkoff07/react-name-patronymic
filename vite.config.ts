import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // На GitHub Pages проект живёт в /<repo>/, локально — в корне.
  base: command === 'build' ? '/react-name-patronymic/' : '/',
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    // Компонентные тесты в jsdom на медленных машинах иногда не укладываются в 5 секунд.
    testTimeout: 15_000,
  },
}))
