<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const tokenCookie = useCookie('auth_token')
const route = useRoute()
const { getEventById, loading, error,
  registerForEvent,
  cancelRegistration,
  getMyRegistrations,
  addFavorite,
  removeFavorite,
  getMyFavorites,

 } = useEvents()
const { userId, getMe } = useAuth()

const favorites = useCookie<string[]>('user_favorites', { default: () => [] })
const registeredEvents = useCookie<string[]>('user_registered_events', { default: () => [] })

const eventId = route.params.id as string
const event = ref<any>(null)

const isOwner = computed(() => {
  if (!event.value || !userId.value) return false
  const orgId = event.value.organizer?._id || event.value.organizer
  return orgId?.toString() === userId.value?.toString()
})

// 1. Cargar evento por ID
onMounted(async () => {
  if (eventId) {
    const res = await getEventById(eventId)
    if (res.ok) {
      event.value = res.data
    }
  }


  if(tokenCookie.value) { // Si esta logueado trae los registros/inscripciones y favs
    const [regsRes, favsRes] = await Promise.all([
      getMyRegistrations(),
      getMyFavorites()
    ])
    if (regsRes.ok && Array.isArray(regsRes.data)) {
      registeredEvents.value = regsRes.data.map((r: any) => r.event?._id || r.event)
    }
    if (favsRes.ok && Array.isArray(favsRes.data)) {
      favorites.value = favsRes.data.map((f: any) => f.event?._id || f.event)
    }
  }
  
})
definePageMeta({
  middleware: 'auth'
})


// 2. Toggle Favoritos
const toggleFavorite = async () => {
  if (!event.value?._id) return
  const id = event.value._id

  if (!tokenCookie.value) {
    navigateTo('/auth/login')
    return
  }

  const isFav = favorites.value.includes(id)
  if (isFav) {
    const res = await removeFavorite(id)
    if (res.ok) {
      const idx = favorites.value.indexOf(id)
      if (idx !== -1) favorites.value.splice(idx, 1)
    }
  } else {
    const res = await addFavorite(id)
    if (res.ok) {
      favorites.value.push(id)
    }
  }
}

// 3. Toggle Inscripción
const toggleRegistration = async () => {
  if (!event.value?._id) return
  const id = event.value._id

  if (!tokenCookie.value) {
    navigateTo('/auth/login')
    return
  }

  const isRegistered = registeredEvents.value.includes(id)
  if (isRegistered) {
    const res = await cancelRegistration(id)
    if (res.ok) {
      const idx = registeredEvents.value.indexOf(id)
      if (idx !== -1) registeredEvents.value.splice(idx, 1)
      if (event.value.registeredCount > 0) event.value.registeredCount--
    } else {
      alert(res.error || 'Error al cancelar la inscripción')
    }
  } else {
    const res = await registerForEvent(id)
    if (res.ok) {
      registeredEvents.value.push(id)
      event.value.registeredCount = (event.value.registeredCount || 0) + 1
    } else {
      alert(res.error || 'Error al inscribirse a este evento')
    }
  }
}


// 4. Formateadores de fecha y hora
const formatDate = (dateStr: string) => {
  if (!dateStr) return 'Fecha por confirmar'
  const d = new Date(dateStr)
  return d.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const formatTime = (startStr: string, endStr: string) => {
  if (!startStr) return 'Horario por confirmar'
  const start = new Date(startStr).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
  if (!endStr) return `${start} CST`
  const end = new Date(endStr).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
  return `${start} - ${end} CST`
}



</script>

<template>
  <div class="event-detail-page">
    <!-- Efecto de luz ambiental de fondo -->
    <div class="bg-glow"></div>

    <!-- Contenido cuando el evento cargó exitosamente -->
    <div v-if="event" class="container detail-container">
      <!-- 1. Barra de Navegación Superior / Breadcrumbs -->
      <nav class="detail-nav">
        <NuxtLink to="/activities" class="btn-back">
          <span>←</span>
          <span>Volver al Catálogo</span>
        </NuxtLink>

        <div class="nav-right-actions">
          <span class="badge-category cat-tech">
            {{ event.category?.name || 'Comunidad' }}
          </span>
          <span 
            class="badge-status"
            :class="event.status === 'published' ? 'status-open' : 'status-draft'"
          >
            {{ event.status === 'published' ? '● Inscripciones Abiertas' : '📝 Borrador' }}
          </span>
          <button 
            class="fav-icon-btn" 
            :class="{ 'is-fav': favorites.includes(event._id) }"
            title="Guardar en favoritos"
            @click="toggleFavorite"
          >
            {{ favorites.includes(event._id) ? '❤️' : '🤍' }}
          </button>
        </div>
      </nav>

      <!-- 2. Encabezado Principal del Evento -->
      <header class="event-hero-header">
        <!-- Banner de Imagen del Evento si existe -->
        <div v-if="event.image" class="event-hero-banner" style="max-height: 320px; border-radius: 16px; overflow: hidden; margin-bottom: 1.75rem; border: 1px solid rgba(255, 255, 255, 0.08); box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);">
          <img :src="event.image" :alt="event.title" style="width: 100%; height: 100%; max-height: 320px; object-fit: cover;" />
        </div>

        <h1 class="event-hero-title">
          {{ event.title }}
        </h1>
        <p class="event-hero-subtitle">
          {{ event.description }}
        </p>

        <div class="hero-meta-strip">
          <div class="meta-item">
            <span class="meta-icon">👤</span>
            <div>
              <span class="meta-label">Organizado por</span>
              <strong class="meta-val">{{ event.organizer?.name || 'Comunidad Abierta' }}</strong>
            </div>
          </div>

          <div class="meta-divider"></div>

          <div class="meta-item">
            <span class="meta-icon">📅</span>
            <div>
              <span class="meta-label">Fecha</span>
              <strong class="meta-val capitalize">{{ formatDate(event.startDate) }}</strong>
            </div>
          </div>

          <div class="meta-divider"></div>

          <div class="meta-item">
            <span class="meta-icon">⏰</span>
            <div>
              <span class="meta-label">Horario</span>
              <strong class="meta-val">{{ formatTime(event.startDate, event.endDate) }}</strong>
            </div>
          </div>

          <div class="meta-divider"></div>

          <div class="meta-item">
            <span class="meta-icon">📍</span>
            <div>
              <span class="meta-label">Ubicación</span>
              <strong class="meta-val">{{ event.location }}</strong>
            </div>
          </div>
        </div>
      </header>

      <!-- 3. Layout Principal: 2 Columnas -->
      <div class="detail-grid-layout">
        <!-- Columna Izquierda: Información Detallada -->
        <main class="content-column">
          <!-- Sección: Sobre esta Actividad -->
          <section class="detail-card-box">
            <h2 class="box-heading">
              <span class="heading-icon">📖</span>
              <span>Descripción de la Actividad</span>
            </h2>
            <div class="box-text-content">
              <p class="description-full-text">{{ event.description }}</p>
            </div>
          </section>

          <!-- Sección: Información del Organizador -->
          <section class="detail-card-box">
            <h2 class="box-heading">
              <span class="heading-icon">🤝</span>
              <span>Sobre el Organizador</span>
            </h2>
            <div class="organizer-box-profile">
              <div class="org-avatar">
                {{ event.organizer?.name ? event.organizer.name.charAt(0).toUpperCase() : 'C' }}
              </div>
              <div class="org-details">
                <h3>{{ event.organizer?.name || 'Comunidad Abierta' }}</h3>
                <p>Gestor de actividades comunitarias en CommunityHub</p>
                <span class="badge-role-org">✓ Organizador Verificado</span>
              </div>
            </div>
          </section>

          <!-- Sección: Ubicación y Modalidad -->
          <section class="detail-card-box">
            <h2 class="box-heading">
              <span class="heading-icon">📍</span>
              <span>Lugar y Acceso</span>
            </h2>
            <div class="location-banner">
              <div class="loc-badge">Sede / Modalidad</div>
              <p class="loc-address">{{ event.location }}</p>
              <p class="loc-note">Se recomienda llegar 10 minutos antes del inicio con tu boleto digital sincronizado.</p>
            </div>
          </section>
        </main>

        <!-- Columna Derecha: Tarjeta Flotante de Inscripción / Boleto -->
        <aside class="sidebar-column">
          <div class="sticky-booking-card">
            <!-- Barra de estado superior -->
            <div class="booking-status-bar"></div>

            <div class="booking-card-body">
              <div class="price-row">
                <span class="free-badge">Entrada Libre</span>
              </div>

              <!-- Capacidad y Barra de Ocupación Real -->
              <div class="capacity-section">
                <div class="capacity-text-row">
                  <span>Ocupación de Cupos</span>
                  <strong>{{ event.registeredCount || 0 }} de {{ event.capacity }} inscritos</strong>
                </div>
                <div class="capacity-track">
                  <div 
                    class="capacity-fill" 
                    :style="{ width: `${Math.min(100, Math.round(((event.registeredCount || 0) / (event.capacity || 1)) * 100))}%` }"
                    :class="{ 'fill-full': (event.registeredCount || 0) >= event.capacity }"
                  ></div>
                </div>
                <span class="capacity-hint" :class="{ 'hint-full': (event.registeredCount || 0) >= event.capacity }">
                  {{ (event.registeredCount || 0) >= event.capacity 
                    ? '🔴 ¡Cupos agotados para esta actividad!' 
                    : `🟢 Quedan ${Math.max(0, event.capacity - (event.registeredCount || 0))} cupos disponibles` }}
                </span>
              </div>

              <!-- Botón Principal de Acción -->
              <div class="booking-actions">
                <div v-if="isOwner" class="owner-badge-box" style="padding: 1.1rem; background: rgba(56, 189, 248, 0.1); border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 12px; text-align: center; color: #38bdf8; font-weight: 600;">
                  🎯 Eres el organizador de este evento
                  <div style="font-size: 0.85rem; font-weight: normal; margin-top: 0.3rem; opacity: 0.85; color: #94a3b8;">
                    No es necesario inscribirte a tus propias actividades comunitarias.
                  </div>
                </div>
                <button 
                  v-else
                  :disabled="!registeredEvents.includes(event._id) && (event.registeredCount || 0) >= event.capacity"
                  :class="registeredEvents.includes(event._id) ? 'btn-cancel-action' : 'btn-register-action'"
                  @click="toggleRegistration"
                >
                  <span v-if="registeredEvents.includes(event._id)">❌ Cancelar mi Inscripción</span>
                  <span v-else-if="(event.registeredCount || 0) >= event.capacity">🚫 Cupo Lleno</span>
                  <span v-else>🎟️ Inscribirme a este Evento</span>
                </button>
              </div>

              <!-- Mensaje / Boleto Digital Confirmado -->
              <div 
                class="ticket-status-box"
                :class="{ confirmed: registeredEvents.includes(event._id) }"
              >
                <div class="ticket-icon">
                  {{ registeredEvents.includes(event._id) ? '✅' : '📱' }}
                </div>
                <div class="ticket-info">
                  <strong>
                    {{ registeredEvents.includes(event._id) ? '¡Inscripción Confirmada!' : 'Boleto Digital PWA' }}
                  </strong>
                  <p>
                    {{ registeredEvents.includes(event._id) 
                      ? 'Tienes tu cupo reservado. Tu pase está guardado en tu dispositivo para acceso offline.' 
                      : 'Al inscribirte, tu acceso se sincroniza en tu dispositivo para ingresar sin internet.' }}
                  </p>
                </div>
              </div>

              <!-- Botón de Imprimir / Compartir -->
              <button class="btn-print-ticket" onclick="window.print()">
                <span>🖨️ Imprimir Ficha del Evento</span>
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>

    <!-- Estado de Carga -->
    <div v-else-if="loading" class="empty-state container">
      <span class="empty-icon">⏳</span>
      <h3>Cargando detalles de la actividad...</h3>
    </div>

    <!-- Estado de Error / No Encontrado -->
    <div v-else class="empty-state container">
      <span class="empty-icon">🔍</span>
      <h3>Actividad no encontrada</h3>
      <p>No pudimos encontrar la información de este evento o ya no está disponible.</p>
      <NuxtLink to="/activities" class="btn-back-home">
        ← Volver al Catálogo
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.event-detail-page {
  position: relative;
  min-height: calc(100vh - 72px);
  padding: 2.5rem 0 6rem;
}

/* Luz ambiental */
.bg-glow {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 900px;
  height: 400px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.08) 45%, transparent 70%);
  filter: blur(75px);
  pointer-events: none;
  z-index: 0;
}

.detail-container {
  position: relative;
  z-index: 1;
}

/* 1. Barra de Navegación Superior */
.detail-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.btn-back {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(22, 30, 49, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  color: #cbd5e1;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-back:hover {
  background: rgba(99, 102, 241, 0.15);
  border-color: rgba(99, 102, 241, 0.3);
  color: #f8fafc;
  transform: translateX(-3px);
}

.nav-right-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.badge-category {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.3rem 0.8rem;
  border-radius: 999px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: rgba(99, 102, 241, 0.15);
  color: #a5b4fc;
  border: 1px solid rgba(99, 102, 241, 0.3);
}

.badge-status {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.3rem 0.75rem;
  border-radius: 999px;
}

.status-open {
  background: rgba(16, 185, 129, 0.12);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.25);
}

.status-draft {
  background: rgba(245, 158, 11, 0.15);
  color: #fcd34d;
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.fav-icon-btn {
  background: rgba(22, 30, 49, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.15rem;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.fav-icon-btn:hover {
  transform: scale(1.18);
  background: rgba(236, 72, 153, 0.15);
  border-color: rgba(236, 72, 153, 0.4);
}

/* 2. Hero Header */
.event-hero-header {
  background: rgba(22, 30, 49, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 2.5rem 3rem;
  backdrop-filter: blur(16px);
  margin-bottom: 2rem;
  box-shadow: 0 15px 35px -10px rgba(0, 0, 0, 0.5);
}

.event-hero-title {
  font-size: 2.35rem;
  font-weight: 800;
  color: #f8fafc;
  line-height: 1.25;
  margin-bottom: 1rem;
}

.event-hero-subtitle {
  font-size: 1.05rem;
  color: #94a3b8;
  line-height: 1.6;
  margin-bottom: 2rem;
  max-width: 900px;
}

.hero-meta-strip {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.75rem;
  background: rgba(11, 15, 25, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.06);
  padding: 1.25rem 1.75rem;
  border-radius: 14px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.meta-icon {
  font-size: 1.35rem;
}

.meta-label {
  display: block;
  font-size: 0.75rem;
  color: #64748b;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.04em;
}

.meta-val {
  font-size: 0.95rem;
  color: #f8fafc;
}

.capitalize {
  text-transform: capitalize;
}

.meta-divider {
  width: 1px;
  height: 32px;
  background: rgba(255, 255, 255, 0.08);
}

/* 3. Grid de 2 Columnas */
.detail-grid-layout {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 2rem;
  align-items: start;
}

.content-column {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.detail-card-box {
  background: rgba(22, 30, 49, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  padding: 2rem;
  backdrop-filter: blur(14px);
}

.box-heading {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: #f8fafc;
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.heading-icon {
  font-size: 1.2rem;
}

.box-text-content {
  font-size: 0.95rem;
  color: #cbd5e1;
  line-height: 1.7;
}

.description-full-text {
  font-size: 1rem;
  color: #cbd5e1;
  line-height: 1.8;
  white-space: pre-line;
}

/* Perfil del Organizador */
.organizer-box-profile {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.org-avatar {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  color: white;
  font-size: 1.5rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.35);
}

.org-details h3 {
  font-size: 1.15rem;
  font-weight: 700;
  color: #f8fafc;
  margin-bottom: 0.2rem;
}

.org-details p {
  font-size: 0.85rem;
  color: #94a3b8;
  margin-bottom: 0.4rem;
}

.badge-role-org {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 600;
  color: #34d399;
  background: rgba(16, 185, 129, 0.12);
  padding: 0.15rem 0.55rem;
  border-radius: 6px;
}

.location-banner {
  background: rgba(11, 15, 25, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.06);
  padding: 1.25rem;
  border-radius: 12px;
}

.loc-badge {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 700;
  color: #60a5fa;
  background: rgba(59, 130, 246, 0.15);
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
  margin-bottom: 0.5rem;
}

.loc-address {
  font-size: 1rem;
  font-weight: 700;
  color: #f8fafc;
  margin-bottom: 0.4rem;
}

.loc-note {
  font-size: 0.85rem;
  color: #94a3b8;
}

/* Columna Derecha (Tarjeta Flotante de Reserva) */
.sticky-booking-card {
  position: sticky;
  top: 100px;
  background: rgba(22, 30, 49, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  overflow: hidden;
  backdrop-filter: blur(20px);
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.6);
}

.booking-status-bar {
  height: 5px;
  background: linear-gradient(90deg, #6366f1 0%, #a855f7 50%, #ec4899 100%);
}

.booking-card-body {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.free-badge {
  font-size: 1.25rem;
  font-weight: 800;
  color: #34d399;
}

.access-type {
  font-size: 0.8rem;
  color: #94a3b8;
  background: rgba(255, 255, 255, 0.06);
  padding: 0.25rem 0.65rem;
  border-radius: 6px;
}

.capacity-section {
  background: rgba(11, 15, 25, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.06);
  padding: 1rem;
  border-radius: 12px;
}

.capacity-text-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: #cbd5e1;
  margin-bottom: 0.5rem;
}

.capacity-text-row strong {
  color: #f8fafc;
}

.capacity-track {
  height: 8px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 999px;
  overflow: hidden;
  margin-bottom: 0.4rem;
}

.capacity-fill {
  height: 100%;
  background: linear-gradient(90deg, #6366f1 0%, #a855f7 100%);
  border-radius: 999px;
  transition: width 0.4s ease;
}

.fill-full {
  background: linear-gradient(90deg, #f59e0b 0%, #ef4444 100%);
}

.capacity-hint {
  font-size: 0.78rem;
  color: #34d399;
  font-weight: 600;
}

.hint-full {
  color: #f87171 !important;
}

.booking-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.btn-register-action {
  width: 100%;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border: none;
  color: white;
  font-size: 1rem;
  font-weight: 700;
  padding: 0.9rem 1.5rem;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4);
  transition: all 0.2s;
}

.btn-register-action:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(99, 102, 241, 0.6);
}

.btn-cancel-action {
  width: 100%;
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.35);
  color: #f87171;
  font-size: 0.95rem;
  font-weight: 700;
  padding: 0.85rem 1.5rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel-action:hover {
  background: rgba(239, 68, 68, 0.25);
  color: #fca5a5;
}

.ticket-status-box {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  background: rgba(99, 102, 241, 0.08);
  border: 1px solid rgba(99, 102, 241, 0.2);
  padding: 0.85rem 1rem;
  border-radius: 12px;
  transition: all 0.2s;
}

.ticket-status-box.confirmed {
  background: rgba(16, 185, 129, 0.1);
  border-color: rgba(16, 185, 129, 0.3);
}

.ticket-icon {
  font-size: 1.5rem;
}

.ticket-info strong {
  display: block;
  font-size: 0.85rem;
  color: #f8fafc;
}

.ticket-info p {
  font-size: 0.78rem;
  color: #94a3b8;
  line-height: 1.4;
  margin: 0;
}

.btn-print-ticket {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #cbd5e1;
  font-size: 0.85rem;
  font-weight: 600;
  padding: 0.65rem 1rem;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-print-ticket:hover {
  background: rgba(255, 255, 255, 0.06);
  color: white;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem 2rem;
  text-align: center;
  color: #94a3b8;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.btn-back-home {
  margin-top: 1.5rem;
  display: inline-block;
  background: rgba(99, 102, 241, 0.2);
  border: 1px solid rgba(99, 102, 241, 0.4);
  color: #a5b4fc;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 600;
}

@media (max-width: 968px) {
  .detail-grid-layout {
    grid-template-columns: 1fr;
  }
  .sticky-booking-card {
    position: static;
  }
  .event-hero-header {
    padding: 1.75rem;
  }
  .event-hero-title {
    font-size: 1.85rem;
  }
}
</style>
