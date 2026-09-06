import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/Aplicativo-fitness/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'BJJ Treinos',
        short_name: 'BJJ Treinos',
        description: 'Treinos de musculação e condicionamento físico para jiu jitsu',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        lang: 'pt-BR',
        start_url: '/Aplicativo-fitness/',
        scope: '/Aplicativo-fitness/',
        icons: [
          { src: 'icon-192.svg', sizes: '192x192', type: 'image/svg+xml', purpose: 'any maskable' },
          { src: 'icon-512.svg', sizes: '512x512', type: 'image/svg+xml', purpose: 'any maskable' },
        ],
      },
    }),
  ],
})
