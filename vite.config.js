import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Kindred - Therian Connect',
        short_name: 'Kindred',
        description: 'La primera app de conexiones diseñada para la comunidad therian',
        theme_color: '#C8A96E',
        background_color: '#0F0F12',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/'
      }
    })
  ],
})
