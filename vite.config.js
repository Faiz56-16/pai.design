import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        chapter1: 'chapter1.html',
        chapter2: 'chapter2.html',
        chapter3: 'chapter3.html',
        chapter4: 'chapter4.html',
        chapter5: 'chapter5.html',
        kelompok: 'kelompok.html',
      },
    },
  },
})