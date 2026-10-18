import { resolve } from 'path'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        chapter1: resolve(import.meta.dirname, 'chapter1.html'),
        chapter2: resolve(import.meta.dirname, 'chapter2.html'),
        chapter3: resolve(import.meta.dirname, 'chapter3.html'),
        chapter4: resolve(import.meta.dirname, 'chapter4.html'),
        chapter5: resolve(import.meta.dirname, 'chapter5.html'),
        kelompok: resolve(import.meta.dirname, 'kelompok.html'),
      },
    },
  },
})