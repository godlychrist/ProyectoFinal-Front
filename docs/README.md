# 🎨 Documentación Técnica del Frontend — CommunityHub

Guía técnica de la arquitectura de la interfaz de usuario desarrollada con **Nuxt 4 + Vue 3**.

---

## 📂 Estructura del Código Fuente

```text
ProyectoFinal-Front/
├── app/
│   ├── assets/               # Hojas de estilo globales (main.css)
│   ├── components/           # Componentes reutilizables de Vue
│   │   ├── navbar.vue        # Barra de navegación con indicador de red y botón de instalación
│   │   ├── footer.vue        # Pie de página con enlaces y metadatos
│   │   └── PwaInstallButton  # Botón inteligente para instalar la PWA
│   ├── composables/          # Lógica reactiva reutilizable
│   │   ├── useAuth.ts        # Manejo de tokens JWT, roles, cookies y perfiles
│   │   ├── useEvents.ts      # Comunicación con la API de eventos, inscripciones y caché offline
│   │   ├── useNetworkStatus  # Detección de conexión (Online / Offline)
│   │   └── useImageCompressor# Compresión de imágenes en el cliente (HTML5 Canvas)
│   ├── middleware/           # Middlewares de enrutamiento
│   │   ├── auth.ts           # Protección de rutas privadas para usuarios autenticados
│   │   └── admin.ts          # Restricción exclusiva para rol de administrador
│   └── pages/                # Enrutamiento basado en archivos
│       ├── index.vue         # Landing page principal
│       ├── activities/       # Catálogo público y vista detallada por ID
│       ├── users/            # Dashboard del usuario y boletos digitales
│       ├── managers/         # Panel de gestión de actividades y borradores para organizadores
│       ├── admins/           # Panel de control de usuarios, categorías y métricas
│       └── auth/             # Vistas de inicio de sesión y registro
├── public/                   # Recursos estáticos servidos directamente (íconos PWA, manifest)
└── nuxt.config.ts            # Configuración de módulos, PWA y Workbox
```

---

## ⚙️ Composables Principales

### 1. `useAuth.ts`
* Gestiona el estado de la sesión mediante cookies reactivas de Nuxt (`auth_token`, `user_id`, `user_name`, `user_role`, `user_avatar`).
* Provee métodos para `loginUser`, `registerUser`, `getMe` y `logout`.
* Mantiene la persistencia de datos del usuario incluso cuando el dispositivo se queda sin conexión a internet.

### 2. `useEvents.ts`
* Maneja todas las interacciones con los endpoints de eventos: `getEvents`, `getEventById`, `createEvent`, `updateEvent`, `deleteEvent`.
* **Caché Offline Inteligente:**
  * Almacena automáticamente las actividades consultadas en `localStorage` (`communityhub_cached_events`).
  * En caso de pérdida de red, extrae los eventos, categorías e inscripciones directamente del almacenamiento local, garantizando navegación ininterrumpida.
* Gestiona inscripciones (`registerForEvent`, `cancelRegistration`) y favoritos (`addFavorite`, `removeFavorite`, `getMyFavorites`).
* Provee las métricas para el dashboard del administrador (`getAdminDashboardStats`).

### 3. `useImageCompressor.ts`
* Permite subir imágenes de hasta **50MB** (como fotos tomadas directamente con cámaras de alta resolución).
* Utiliza la API de **HTML5 Canvas** en el navegador para escalar la imagen a dimensiones óptimas (1600x1200 máx.) y comprimirla a WebP/JPEG con calidad visual del 85%, reduciendo el peso de 50MB a menos de 200KB sin pérdida perceptible.

### 4. `useNetworkStatus.ts`
* Escucha los eventos nativos `window.addEventListener('online')` y `'offline'`.
* Provee la variable reactiva `isOnline` que activa las alertas visuales en la interfaz cuando el usuario pierde o recupera la conexión.
