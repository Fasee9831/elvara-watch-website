import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  server: {
    watch: {
      ignored: ['**/*.crdownload', '**/*.jpg', '**/*.png', '**/*.jpeg', '**/*.webp', '**/*.mp4', '**/*.webm', '**/*.ogg', '**/images/**', '**/videos/**'],
    },
  },
})
