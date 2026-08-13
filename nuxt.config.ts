// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  // * Registra el modulo de PWA
  modules: [
    '@vite-pwa/nuxt',
  ],


  // * Configura el Manifest y el Service Worker (Ni idea que son)
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'My Awesome App',
      short_name: 'MyApp',
      description: 'An awesome app using Vite PWA',
      display: 'standalone',
      orientation: 'portrait',
      scope: '/',
      start_url: '/',
      theme_color: '#ffffff',
      icons: [
        {
          src: '/pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable'
        }
      ],
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
