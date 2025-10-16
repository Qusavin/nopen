import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

const rootDir = fileURLToPath(new URL('.', import.meta.url))

const rendererAliases = {
  '@/components': resolve(rootDir, 'src/renderer/components'),
  '@/overlay': resolve(rootDir, 'src/renderer/overlay'),
  '@/settings': resolve(rootDir, 'src/renderer/settings'),
  '@/lib': resolve(rootDir, 'src/renderer/lib'),
  '@/src': resolve(rootDir, 'src/renderer/src'),
  '@/globals.css': resolve(rootDir, 'src/renderer/globals.css'),
  '@shared': resolve(rootDir, 'src/shared'),
  '@types': resolve(rootDir, 'src/types')
}

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    plugins: [react()],
    resolve: {
      alias: rendererAliases
    }
  }
})
