<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

const { logout, userName, userEmail, getMe } = useAuth()
const { getMyRegistrations, getMyFavorites, getMyNotifications, markNotificationAsRead, loading, error } = useEvents()
const { isOnline } = useNetworkStatus()

const registeredEvents = ref<any[]>([])
const favoriteEvents = ref<any[]>([])
const notifications = ref<any[]>([])

// 1. Estado de la pestaña activa ('registered' = Mis Inscripciones, 'favorites' = Guardadas)
const selectedTab = ref('registered')

// 2. Cargar datos del usuario
const loadUserData = async () => {
  await getMe()
  const [regsRes, favsRes, notifsRes] = await Promise.all([
    getMyRegistrations(),
    getMyFavorites(),
    getMyNotifications()
  ])

  if (regsRes.ok && Array.isArray(regsRes.data)) {
    registeredEvents.value = regsRes.data.map((r: any) => r.event).filter(Boolean)
  }
  if (favsRes.ok && Array.isArray(favsRes.data)) {
    favoriteEvents.value = favsRes.data.map((f: any) => f.event).filter(Boolean)
  }
  if (notifsRes.ok && Array.isArray(notifsRes.data)) {
    notifications.value = notifsRes.data
  }
}

onMounted(async () => {
  await loadUserData()
})

// 3. Lista filtrada: Solo actividades a las que está inscrito o favoritos
const displayedEvents = computed(() => {
  if (selectedTab.value === 'favorites') {
    return favoriteEvents.value
  }
  return registeredEvents.value
})

// 4. Formatear fechas
const formatDate = (dateStr: string) => {
  if (!dateStr) return 'Sin fecha'
  return new Date(dateStr).toLocaleDateString('es-ES', { 
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' 
  })
}

definePageMeta({
  middleware: 'auth'
})


</script>

<template>
  <div class="user-dashboard">
    <!-- Luz ambiental de fondo -->
    <div class="bg-glow"></div>

    <div class="container dashboard-container">
      <!-- 1. Header / Perfil del Usuario -->
      <header class="profile-hero">
        <div class="profile-main">
          <div class="profile-avatar">
            <span class="avatar-letter">C</span>
            <span class="online-indicator" title="En línea"></span>
          </div>

          <div class="profile-info">
            <div class="role-badge-wrap">
              <span class="role-pill">🙋‍♂️ Participante</span>
              <span class="status-pill">Cuenta Activa</span>
            </div>
            <h1 class="user-name">¡Hola de nuevo, <span class="text-gradient">{{ userName || 'Participante' }}</span>! 👋</h1>
            <p class="user-email">{{ userEmail || 'usuario@correo.com' }}</p>
          </div>
        </div>

        <div class="profile-actions">
          <NuxtLink to="/activities" class="btn-primary-action">
            <span>Explorar Catálogo</span>
            <span>→</span>
          </NuxtLink>
          <button class="btn-secondary-action" @click="logout">
            🚪 Cerrar Sesión
          </button>
        </div>
      </header>

      <!-- 2. Tarjetas de Resumen / Estadísticas -->
      <section class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon-wrap icon-purple">
            <span>🎟️</span>
          </div>
          <div class="stat-data">
            <span class="stat-value">{{ registeredEvents.length }}</span>
            <span class="stat-label">Inscripciones Activas</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon-wrap icon-pink">
            <span>❤️</span>
          </div>
          <div class="stat-data">
            <span class="stat-value">{{ favoriteEvents.length }}</span>
            <span class="stat-label">Eventos Favoritos</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon-wrap icon-blue">
            <span>🔔</span>
          </div>
          <div class="stat-data">
            <span class="stat-value">{{ notifications.length }}</span>
            <span class="stat-label">Avisos y Notificaciones</span>
          </div>
        </div>
      </section>

      <!-- 3. Contenido Principal: Actividades y Sidebar -->
      <div class="dashboard-layout">
        <!-- Columna Izquierda: Actividades Inscritas -->
        <main class="main-column">
          <div class="section-title-bar">
            <div>
              <span class="sub-tag">Tu Agenda</span>
              <h2 class="block-title">Mis Actividades Comunitarias</h2>
            </div>
          <div class="filter-tabs">
              <button :class="['tab-btn', { active: selectedTab === 'registered' }]" @click="selectedTab = 'registered'">
                🎟️ Mis Inscripciones ({{ registeredEvents.length }})
              </button>
              <button :class="['tab-btn', { active: selectedTab === 'favorites' }]" @click="selectedTab = 'favorites'">
                ❤️ Favoritos ({{ favoriteEvents.length }})
              </button>
          </div>
          </div>


          <!-- Lista de Actividades -->
          <div v-if="displayedEvents.length > 0" class="events-list">
            <article v-for="ev in displayedEvents" :key="ev._id" class="ticket-card">
              <div class="ticket-status-line"></div>
              <div class="ticket-body">
                <div class="ticket-top">
                  <span class="badge-category">{{ ev.category?.name || 'Comunidad' }}</span>
                  
                  <!-- Botón de Favorito ❤️ -->
                  <button class="fav-icon-btn" @click="toggleFavorite(ev._id)">
                    {{ favorites.includes(ev._id) ? '❤️' : '🤍' }}
                  </button>
                </div>
                <h3 class="event-title">{{ ev.title }}</h3>
                <p class="event-desc-short">{{ ev.description }}</p>
                <div class="event-details">
                  <div class="detail-row">
                    <span class="detail-icon">📅</span>
                    <span>{{ formatDate(ev.startDate) }}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-icon">📍</span>
                    <span>{{ ev.location }}</span>
                  </div>
                </div>
              </div>
              <!-- Botones de Acción -->
              <div class="card-side-actions">
                <NuxtLink :to="`/activities/${ev._id}`" class="btn-view-ticket">
                  Ver Detalle →
                </NuxtLink>
              </div>
            </article>
          </div>
          <!-- Si no hay actividades en esa pestaña -->
          <div v-else class="empty-state" style="text-align: center; padding: 3rem 1.5rem; background: rgba(255, 255, 255, 0.02); border: 1px dashed rgba(255, 255, 255, 0.1); border-radius: 16px;">
            <div style="font-size: 2.8rem; margin-bottom: 0.75rem;">
              {{ selectedTab === 'registered' ? '🎟️' : '❤️' }}
            </div>
            <h3 style="font-size: 1.25rem; font-weight: 600; color: #f8fafc; margin-bottom: 0.5rem;">
              {{ selectedTab === 'registered' ? 'No tienes actividades inscritas aún' : 'No tienes favoritos guardados' }}
            </h3>
            <p style="color: #94a3b8; max-width: 420px; margin: 0 auto 1.5rem; font-size: 0.95rem;">
              {{ selectedTab === 'registered' 
                ? 'Explora las actividades comunitarias disponibles e inscríbete para ver tus boletos y recordatorios aquí.' 
                : 'Marca actividades con el corazón para tenerlas siempre a mano en esta sección.' }}
            </p>
            <NuxtLink to="/activities" class="btn-primary-action" style="display: inline-flex; align-items: center; gap: 0.5rem;">
              <span>Explorar Catálogo de Actividades</span>
              <span>→</span>
            </NuxtLink>
          </div>

        </main>

        <!-- Columna Derecha: Sidebar con Avisos y Accesos Rápidos -->
        <aside class="sidebar-column">
          <!-- Tarjeta de Notificaciones / Avisos -->
          <div class="sidebar-card">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
              <h3 class="sidebar-card-title" style="margin-bottom: 0;">🔔 Avisos y Recordatorios</h3>
              <span v-if="notifications.length > 0" class="badge-status-pwa pwa-online">
                {{ notifications.length }}
              </span>
            </div>
            <div v-if="notifications.length > 0" class="notice-list">
              <div v-for="notif in notifications" :key="notif._id" class="notice-item" :class="{ 'unread': !notif.read }">
                <div class="notice-bullet" :style="{ background: notif.read ? '#64748b' : '#38bdf8' }"></div>
                <div class="notice-body">
                  <p class="notice-text">{{ notif.message }}</p>
                  <span class="notice-time">⚡ Generado por AWS Lambda</span>
                </div>
              </div>
            </div>
            <div v-else class="notice-list">
              <div class="notice-item">
                <div class="notice-bullet" style="background: #10b981;"></div>
                <div class="notice-body">
                  <p class="notice-text">¡Estás al día! No tienes recordatorios pendientes por ahora.</p>
                  <span class="notice-time">Todo en orden</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Acciones Rápidas -->
          <div class="sidebar-card">
            <h3 class="sidebar-card-title">🚀 Accesos Rápidos</h3>
            <div class="quick-links">
              <NuxtLink to="/activities" class="quick-link-item">
                <span>🔍 Explorar Catálogo</span>
                <span>→</span>
              </NuxtLink>
              <NuxtLink to="/" class="quick-link-item">
                <span>🏠 Ir al Inicio</span>
                <span>→</span>
              </NuxtLink>
              <button class="quick-link-item logout-link" @click="logout">
                <span>🚪 Cerrar Sesión</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<style scoped>
.user-dashboard {
  position: relative;
  min-height: calc(100vh - 72px);
  padding: 2.5rem 0 5rem;
}

/* Efecto de luz ambiental */
.bg-glow {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 700px;
  height: 350px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.08) 40%, transparent 70%);
  filter: blur(60px);
  pointer-events: none;
  z-index: 0;
}

.dashboard-container {
  position: relative;
  z-index: 1;
}

/* 1. Hero del Perfil */
.profile-hero {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(22, 30, 49, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 2rem 2.5rem;
  backdrop-filter: blur(16px);
  margin-bottom: 2rem;
  box-shadow: 0 15px 35px -10px rgba(0, 0, 0, 0.5);
  flex-wrap: wrap;
  gap: 1.5rem;
}

.profile-main {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.profile-avatar {
  position: relative;
  width: 68px;
  height: 68px;
  border-radius: 18px;
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 20px rgba(99, 102, 241, 0.4);
}

.avatar-letter {
  font-size: 1.85rem;
  font-weight: 800;
  color: white;
}

.online-indicator {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #10b981;
  border: 3px solid #161e31;
}

.role-badge-wrap {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.35rem;
}

.role-pill {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.2rem 0.65rem;
  border-radius: 999px;
  background: rgba(99, 102, 241, 0.15);
  border: 1px solid rgba(99, 102, 241, 0.3);
  color: #a5b4fc;
}

.status-pill {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.2rem 0.65rem;
  border-radius: 999px;
  background: rgba(16, 185, 129, 0.12);
  border: 1px solid rgba(16, 185, 129, 0.3);
  color: #6ee7b7;
}

.user-name {
  font-size: 1.65rem;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.user-email {
  font-size: 0.9rem;
  color: #94a3b8;
}

.profile-actions {
  display: flex;
  gap: 0.75rem;
}

.btn-primary-action {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 700;
  padding: 0.7rem 1.35rem;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(99, 102, 241, 0.35);
  transition: all 0.2s;
}

.btn-primary-action:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 22px rgba(99, 102, 241, 0.45);
}

.btn-secondary-action {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #f8fafc;
  font-size: 0.9rem;
  font-weight: 600;
  padding: 0.7rem 1.2rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary-action:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* 2. Grid de Estadísticas */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.25rem;
  margin-bottom: 2.5rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(22, 30, 49, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 1.25rem 1.5rem;
  backdrop-filter: blur(12px);
}

.stat-icon-wrap {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.35rem;
}

.icon-purple { background: rgba(99, 102, 241, 0.15); border: 1px solid rgba(99, 102, 241, 0.3); }
.icon-pink { background: rgba(236, 72, 153, 0.15); border: 1px solid rgba(236, 72, 153, 0.3); }
.icon-blue { background: rgba(59, 130, 246, 0.15); border: 1px solid rgba(59, 130, 246, 0.3); }
.icon-emerald { background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.3); }

.stat-data {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 800;
  color: #f8fafc;
  line-height: 1.2;
}

.stat-label {
  font-size: 0.825rem;
  color: #94a3b8;
  font-weight: 500;
}

/* 3. Layout Principal */
.dashboard-layout {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 2rem;
  align-items: start;
}

/* Columna Izquierda */
.section-title-bar {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.sub-tag {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 700;
  color: #818cf8;
}

.block-title {
  font-size: 1.45rem;
  font-weight: 800;
}

.filter-tabs {
  display: flex;
  gap: 0.4rem;
  background: rgba(11, 15, 25, 0.6);
  padding: 0.3rem;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.tab-btn {
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 0.825rem;
  font-weight: 600;
  padding: 0.4rem 0.85rem;
  border-radius: 7px;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-btn.active {
  background: rgba(99, 102, 241, 0.2);
  color: #a5b4fc;
}

.events-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Card de Actividad / Ticket */
.ticket-card {
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  background: rgba(22, 30, 49, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  overflow: hidden;
  position: relative;
  backdrop-filter: blur(16px);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.ticket-card:hover {
  border-color: rgba(99, 102, 241, 0.35);
  transform: translateY(-3px);
  box-shadow: 0 14px 30px -10px rgba(0, 0, 0, 0.5), 0 0 20px -5px rgba(99, 102, 241, 0.2);
}

.ticket-status-line {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 5px;
  background: linear-gradient(180deg, #6366f1 0%, #a855f7 100%);
}

.ticket-body {
  padding: 1.5rem 1.75rem 1.5rem 2rem;
  flex: 1;
  min-width: 0;
}

.ticket-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.badge-category {
  font-size: 0.75rem;
  font-weight: 700;
  color: #a5b4fc;
  background: rgba(99, 102, 241, 0.15);
  border: 1px solid rgba(99, 102, 241, 0.3);
  padding: 0.2rem 0.7rem;
  border-radius: 999px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.fav-icon-btn {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
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
  background: rgba(236, 72, 153, 0.18);
  border-color: rgba(236, 72, 153, 0.4);
}

.event-title {
  font-size: 1.25rem;
  font-weight: 800;
  color: #f8fafc;
  margin-bottom: 0.5rem;
  line-height: 1.35;
}

.event-desc-short {
  font-size: 0.875rem;
  color: #94a3b8;
  line-height: 1.55;
  margin-bottom: 1.1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.event-details {
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
  align-items: center;
}

.detail-row {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.85rem;
  color: #cbd5e1;
}

.detail-icon {
  font-size: 0.95rem;
}

.card-side-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.5rem 1.75rem;
  border-left: 1px dashed rgba(255, 255, 255, 0.08);
  align-items: stretch;
  justify-content: center;
  min-width: 180px;
  background: rgba(15, 23, 42, 0.3);
}

.btn-view-ticket {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #cbd5e1;
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 600;
  padding: 0.65rem 1rem;
  border-radius: 10px;
  text-align: center;
  transition: all 0.2s;
}

.btn-view-ticket:hover {
  background: rgba(255, 255, 255, 0.12);
  color: white;
  border-color: rgba(255, 255, 255, 0.25);
  transform: translateY(-1px);
}

.btn-toggle-reg {
  border: none;
  font-size: 0.85rem;
  font-weight: 700;
  padding: 0.65rem 1rem;
  border-radius: 10px;
  cursor: pointer;
  text-align: center;
  transition: all 0.2s;
}

.btn-register-ticket {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.35);
}

.btn-register-ticket:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.55);
}

.btn-cancel-ticket {
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #f87171;
}

.btn-cancel-ticket:hover {
  background: rgba(239, 68, 68, 0.22);
  border-color: rgba(239, 68, 68, 0.5);
  color: #fca5a5;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3.5rem 2rem;
  background: rgba(22, 30, 49, 0.5);
  border: 2px dashed rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  text-align: center;
  color: #94a3b8;
  font-size: 0.95rem;
}

/* Columna Derecha (Sidebar) */
.sidebar-column {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.sidebar-card {
  background: rgba(22, 30, 49, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 1.5rem;
  backdrop-filter: blur(12px);
}

.sidebar-card-title {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #f8fafc;
}

.notice-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.notice-item {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
}

.notice-bullet {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #6366f1;
  margin-top: 0.4rem;
  flex-shrink: 0;
}

.bullet-blue {
  background: #3b82f6;
}

.notice-text {
  font-size: 0.85rem;
  color: #cbd5e1;
  line-height: 1.4;
}

.notice-text strong {
  color: #f8fafc;
}

.notice-time {
  font-size: 0.75rem;
  color: #64748b;
  display: block;
  margin-top: 0.2rem;
}

/* Offline PWA Card */
.offline-card {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(168, 85, 247, 0.08) 100%);
  border-color: rgba(99, 102, 241, 0.25);
}

.offline-header {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  margin-bottom: 0.75rem;
}

.offline-icon {
  font-size: 1.5rem;
}

.offline-header h4 {
  font-size: 0.95rem;
  font-weight: 700;
}

.offline-header p {
  font-size: 0.8rem;
  color: #94a3b8;
}

.offline-badge {
  font-size: 0.75rem;
  font-weight: 600;
  color: #34d399;
}

/* Accesos Rápidos */
.quick-links {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.quick-link-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.65rem 0.85rem;
  background: rgba(11, 15, 25, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 10px;
  color: #cbd5e1;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;
  cursor: pointer;
}

.quick-link-item:hover {
  background: rgba(99, 102, 241, 0.15);
  border-color: rgba(99, 102, 241, 0.3);
  color: #f8fafc;
}

.logout-link {
  border-color: rgba(239, 68, 68, 0.2);
  color: #fca5a5;
  background: rgba(239, 68, 68, 0.06);
}

.logout-link:hover {
  background: rgba(239, 68, 68, 0.15);
  border-color: rgba(239, 68, 68, 0.4);
  color: #f87171;
}

.badge-wip {
  display: inline-block;
  font-size: 0.65rem;
  font-weight: 800;
  text-transform: uppercase;
  background: rgba(234, 179, 8, 0.2);
  color: #facc15;
  border: 1px solid rgba(234, 179, 8, 0.4);
  padding: 0.15rem 0.45rem;
  border-radius: 6px;
  vertical-align: middle;
}

@media (max-width: 968px) {
  .dashboard-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .profile-hero {
    flex-direction: column;
    align-items: flex-start;
  }
  .ticket-card {
    flex-direction: column;
  }
  .card-side-actions {
    flex-direction: row;
    width: 100%;
    border-left: none;
    border-top: 1px dashed rgba(255, 255, 255, 0.08);
  }
  .btn-view-ticket, .btn-toggle-reg {
    flex: 1;
  }
}
</style>