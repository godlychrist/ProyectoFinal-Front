# 📱 CommunityHub Frontend — Progressive Web App (PWA)

Interfaz de usuario moderna, reactiva e instalable para la plataforma **CommunityHub**, construida con **Nuxt 4, Vue 3, TypeScript y CSS Vanilla** con soporte nativo de **Progressive Web App (PWA)** y capacidades **offline**.

---

## ✨ Características Principales

* 📲 **Progressive Web App (PWA) & Modo Offline:**
  * **Web App Manifest** completo con iconos adaptativos (`192x192` y `512x512`, estándar y maskable).
  * **Service Worker con Workbox** para precaching de recursos estáticos (HTML, CSS, JS, fuentes e imágenes).
  * **Botón de Instalación Nativa:** Permite agregar la aplicación a la pantalla de inicio en Android/iOS o como app de escritorio en Windows/macOS.
  * **Resiliencia sin conexión:** Detección de conectividad en tiempo real (`useNetworkStatus`) y fallback offline para consultar actividades, boletos e inscripciones previamente cargadas mediante `localStorage`.

* 🎨 **Diseño y Experiencia de Usuario (UI/UX):**
  * Paleta de colores dark mode moderna, estética de cristal (**Glassmorphism**) y microanimaciones fluidas.
  * Diseño 100% responsivo adaptable a dispositivos móviles, tablets y monitores de alta resolución.
  * Optimización de rendimiento y compresión automática de imágenes en el cliente con HTML5 Canvas (`useImageCompressor.ts`) para soportar fotos de hasta 50MB sin sobrecargar el servidor.

* 👥 **Paneles y Funcionalidades por Rol:**
  * 🌐 **Público / Visitantes:**
    * Exploración de catálogo con búsqueda en tiempo real y filtros avanzados (categorías, organizador, fechas y disponibilidad de cupos).
    * Ficha detallada de actividad con banner visual y métricas de cupos.
  * 🎟️ **Usuarios Registrados (`user`):**
    * Dashboard personal con avatar, boletos digitales y opción de cancelación de cupo.
    * Gestión de favoritos (guardar y desmarcar eventos).
  * ⚡ **Organizadores (`organizer`):**
    * Panel de control con métricas de ocupación e inscritos totales.
    * Gestión del ciclo de vida de actividades: creación y edición de **borradores**, publicación directa y cancelación.
    * Soporte para subir imágenes y banners a las actividades.
  * 🛡️ **Administradores (`admin`):**
    * Métricas consolidadas del sistema (usuarios, actividades, cupos).
    * Gestión integral de usuarios: asignación de roles (`user`, `organizer`, `admin`) y deshabilitación de cuentas.
    * Gestión de categorías: creación, edición y desactivación lógica.

---

## 🛠️ Tecnologías Utilizadas

* **Framework Principal:** Nuxt 4 (Vue 3 + Composition API + `<script setup>`)
* **Lenguaje:** TypeScript / JavaScript Moderno
* **Módulo PWA:** `@vite-pwa/nuxt` + Workbox
* **Estilos:** Vanilla CSS con variables de diseño globales (`main.css`)
* **Cliente HTTP:** `$fetch` / ofetch nativo de Nuxt
* **Iconografía & Assets:** Favicons, Manifest Icons y banners de alta definición

---

## 📦 Instalación y Configuración

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/godlychrist/ProyectoFinal-Front.git
   cd ProyectoFinal-Front
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Variables de entorno (Opcional):**
   Copia el archivo de ejemplo si requieres personalizar la URL del backend:
   ```bash
   cp .env.example .env
   ```
   Por defecto, el frontend se comunica con el backend en `http://localhost:4000`.

---

## 💻 Ejecución

* **Servidor de desarrollo:**
  ```bash
  npm run dev
  ```
  Abre tu navegador en `http://localhost:3000`.

* **Compilar para producción:**
  ```bash
  npm run build
  ```

* **Vista previa de la versión de producción:**
  ```bash
  npm run preview
  ```

---

## 🧪 Cómo Probar la PWA y el Modo Offline

1. Abre la aplicación en Google Chrome o Microsoft Edge (`http://localhost:3000`).
2. En la barra superior, haz clic en **`📲 Instalar App`** para instalar CommunityHub como aplicación independiente en tu sistema operativo.
3. Para probar la resiliencia offline:
   * Navega por el catálogo (`/activities`) o tu dashboard (`/users`) para que los datos queden en la caché local.
   * Abre las herramientas de desarrollo (**F12**), ve a la pestaña **Network** y selecciona la opción **`Offline`**.
   * Verás cómo la aplicación muestra el indicador `📡 Modo Sin Conexión` y te permite continuar consultando tus boletos y actividades sin mostrar pantallas de error.

---

## 📚 Documentación Adicional

* 📖 [Guía de Arquitectura Frontend & PWA](docs/architecture.md)
* 📑 [Resumen de Componentes y Páginas](docs/README.md)
