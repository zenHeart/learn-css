import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { playgroundLoader } from './src/plugins/playground-loader'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    playgroundLoader(),
  ],
  base: '/learn-css/',
})
