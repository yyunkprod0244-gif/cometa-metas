import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// base './' gera caminhos relativos no build, então o site funciona
// no GitHub Pages (https://usuario.github.io/nome-do-repo/) sem
// precisar escrever o nome do repositório aqui.
export default defineConfig({
  plugins: [react()],
  base: './',
  test: {
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    css: false,
  },
})
