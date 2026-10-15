/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// GitHub Pages publica em https://<usuario>.github.io/<repositorio>/.
// O workflow define VITE_BASE=/<repositorio>/ automaticamente; localmente usa o nome padrão.
const base = process.env.VITE_BASE ?? '/Viagens/'

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
  build: {
    chunkSizeWarningLimit: 700,
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.test.{ts,tsx}'],
  },
})
