import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 16060,
  },
  resolve: {
    alias: {
      'jsmediatags': resolve(__dirname, 'node_modules/jsmediatags/build2/jsmediatags.js'),
      'react-native-fs': resolve(__dirname, 'src/lib/shims/react-native-fs.ts'),
    },
  },
})
