import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['favicon.ico', 'logo.png', 'apple-touch-icon.png'],
      manifest: {
        name: 'CAUCE WEB',
        short_name: 'CAUCE',
        description: 'Plataforma oficial de capacitación y seguimiento del programa CAUCE - Centro Autónomo Universitario de Capacitación y Extensión para la protección hídrica y el desarrollo comunitario.',
        theme_color: '#2d5a27',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/?pwa=true',
        id: '/?pwa=true',
        orientation: 'portrait-primary',
        categories: ['education', 'environment', 'social'],
        icons: [
          {
            src: '/logo.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/logo.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: '/logo.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/logo.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ],
        screenshots: [
          {
            src: '/screenshot-2.png',
            sizes: '1280x720',
            type: 'image/png',
            form_factor: 'wide',
            label: 'Landing de CAUCE'
          },
          {
            src: '/screenshot-1.png',
            sizes: '720x1280',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'Registro en la Plataforma'
          }
        ]
      }
    })
  ],
})
