import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { docScannerPlugin } from './src/plugins/doc-scanner-plugin'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    docScannerPlugin(),
  ],
  base: '/learn-css/',
})
