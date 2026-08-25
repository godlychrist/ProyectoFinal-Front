// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  // * Configuración global del Head (Título e Ícono de Barra / Favicon)
  app: {
    head: {
      title: 'CommunityHub — Gestión de Actividades Comunitarias',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#0b0f19' },
        { name: 'description', content: 'Plataforma comunitaria para explorar actividades, inscribirse y gestionar boletos digitales.' }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/pwa-192x192.png?v=2' },
        { rel: 'shortcut icon', type: 'image/x-icon', href: '/favicon.ico?v=2' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png?v=2' }
      ]
    }
  },

  // * Registra el modulo de PWA
  modules: [
    '@vite-pwa/nuxt',
  ],


  // * Configuración Oficial del Web App Manifest y Service Worker PWA
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'CommunityHub — Gestión de Actividades Comunitarias',
      short_name: 'CommunityHub',
      description: 'Plataforma comunitaria para explorar actividades, inscribirse y gestionar boletos digitales con soporte offline.',
      start_url: '/',
      display: 'standalone',
      orientation: 'portrait',
      scope: '/',
      theme_color: '#0b0f19',
      background_color: '#0b0f19',
      icons: [
        {
          src: '/pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: '/pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: '/pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable'
        }
      ],
      screenshots: [
        {
          src: '/pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          form_factor: 'wide',
          label: 'CommunityHub en Escritorio'
        },
        {
          src: '/pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          form_factor: 'narrow',
          label: 'CommunityHub en Móvil'
        }
      ]
    },
    workbox: {
      navigateFallback: '/'
    },
    devOptions: {
      enabled: true,
      type: 'module'
    },


  }
})
