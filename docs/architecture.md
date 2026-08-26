# 🏛️ Arquitectura Frontend & Progressive Web App (PWA)

Documento explicativo de la arquitectura de software, ciclo de vida de la PWA y estrategia de caché offline en **CommunityHub**.

---

## 1. Diagrama de Arquitectura Frontend

```text
┌─────────────────────────────────────────────────────────────┐
│                    Navegador Web / Dispositivo              │
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │             Nuxt 4 / Vue 3 Components               │   │
│   │       (Navbar, Catalog, Dashboards, Modals)         │   │
│   └──────────┬──────────────────────────────▲───────────┘   │
│              │ Invocación                   │ Estado        │
│   ┌──────────▼──────────────────────────────┴───────────┐   │
│   │           Composables (useEvents, useAuth)          │   │
│   └──────────┬──────────────────────────────▲───────────┘   │
│              │ Fallback                     │ Datos locales │
│   ┌──────────▼──────────┐         ┌─────────┴───────────┐   │
│   │ LocalStorage Cache  │         │ Service Worker (PWA)│   │
│   │ (Events, Tickets)   │         │ (Workbox Assets)    │   │
│   └─────────────────────┘         └─────────▲───────────┘   │
└─────────────────────────────────────────────┼───────────────┘
                                              │ HTTP / Fetch
                                    ┌─────────▼───────────┐
                                    │    Backend API      │
                                    │ (Express :4000)     │
                                    └─────────────────────┘
```

---

## 2. Estrategia de Progressive Web App (PWA)

### A. Web App Manifest
Configurado en `nuxt.config.ts` mediante el módulo `@vite-pwa/nuxt`:
* **Nombre:** `CommunityHub — Gestión de Actividades Comunitarias`
* **Short Name:** `CommunityHub`
* **Display:** `standalone` (se ejecuta en ventana propia sin barra de URL del navegador).
* **Theme & Background Color:** `#0b0f19` (diseño coherente con el Dark Mode).
* **Iconos:**
  * `pwa-192x192.png`: Icono estándar para pantallas móviles de densidad media.
  * `pwa-512x512.png`: Icono de alta definición con soporte `any` y `maskable` (adaptable a iconos circulares o cuadrados en Android).

### B. Service Worker y Precaching con Workbox
* El Service Worker intercepta las solicitudes de red para precachear recursos estáticos:
  * Archivos JavaScript compilados.
  * Hojas de estilo CSS.
  * Documentos HTML y fuentes tipográficas.
  * Iconos y gráficos de la interfaz.
* Si el usuario pierde la conexión o apaga el Wi-Fi, el Service Worker sirve los archivos directamente desde el almacenamiento del dispositivo, **evitando la pantalla de error del navegador**.

### C. Estrategia de Caché de Datos (Stale-While-Revalidate / Fallback)
1. **Petición con Red:** Cuando hay conexión a internet, los composables (`useEvents.ts`, `useAuth.ts`) solicitan los datos frescos a la API en `http://localhost:4000`. Al recibirlos, actualizan la interfaz y guardan una copia serializada en `localStorage`.
2. **Petición sin Red (Offline):** Si la solicitud de red falla por falta de conectividad:
   * El composable captura la excepción silenciosamente.
   * Lee la última copia válida guardada en `localStorage`.
   * Entrega los datos con la bandera `fromCache: true`.
   * La interfaz muestra los eventos y boletos sin interrumpir la experiencia de usuario.

---

## 3. Seguridad en el Cliente

* **Tokens JWT:** Se almacenan en cookies reactivas de Nuxt con tiempos de expiración controlados.
* **Control de Rutas:** Middlewares de navegación (`middleware/auth.ts` y `middleware/admin.ts`) verifican los permisos antes de renderizar cualquier vista sensible. Si un usuario sin privilegios intenta acceder a `/admins`, es redirigido automáticamente.
* **Manejo de Errores Amigable:** Los errores de servidor no exponen trazas de pila (stack traces), sino mensajes claros y entendibles para el usuario final.
