import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  base: '/API-Pages/', 
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        fruits: resolve(__dirname, 'src/pages/fruits/fruits.html'),
        holidays: resolve(__dirname, 'src/pages/holidays/holidays.html'),
        wizards: resolve(__dirname, 'src/pages/wizards/wizards.html'),
      },
    },
  },
})
