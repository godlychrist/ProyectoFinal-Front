<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const eventId = route.params.id as string

const { getEventById, loading, error } = useEvents()

const event = ref<any>(null)

onMounted(async () => {
  if (eventId) {
    const res = await getEventById(eventId)
    if (res.ok) {
      event.value = res.data
    }
  }
})

// Cálculos de ocupación y cupos
const occupancyRate = computed(() => {
  if (!event.value?.capacity) return 0
  const count = event.value.registeredCount || 0
  return Math.min(100, Math.round((count / event.value.capacity) * 100))
})

const remainingSpots = computed(() => {
  if (!event.value?.capacity) return 0
  const count = event.value.registeredCount || 0
  return Math.max(0, event.value.capacity - count)
})

// Formateadores de fecha
const formatDate = (dateStr: string) => {
  if (!dateStr) return 'Sin fecha'
  return new Date(dateStr).toLocaleDateString('es-ES', {
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
  <div class="manager-detail-page">
    <div class="bg-glow"></div>

    <div class="container detail-container">
      <!-- 1. Navegación Superior -->
      <nav class="detail-nav no-print">
        <NuxtLink to="/managers" class="btn-back">
          <span>←</span>
          <span>Volver al Panel de Gestión</span>
        </NuxtLink>

        <div class="nav-actions">
          <NuxtLink :to="`/activities/${eventId}`" class="btn-secondary-action">
            👁️ Ver Vista Pública
          </NuxtLink>
          <NuxtLink :to="`/managers/edit?id=${eventId}`" class="btn-edit-action">
            ✏️ Editar Actividad
          </NuxtLink>
        </div>
      </nav>

      <!-- Estado de carga -->
      <div v-if="loading && !event" class="loading-state">
        <span class="spinner-icon">⏳</span>
        <p>Cargando información del evento...</p>
      </div>

      <!-- Error -->
      <div v-else-if="error && !event" class="error-box">
        <p>⚠️ {{ error }}</p>
        <NuxtLink to="/managers" class="btn-back-error">Volver al panel</NuxtLink>
      </div>

      <!-- Detalle del Evento para el Organizador -->
      <div v-else-if="event" class="event-manage-content">
        <!-- 2. Header / Banner Principal -->
        <header class="event-hero-card">
          <div class="card-top-tags">
            <span class="badge-category">{{ event.category?.name || 'Comunidad' }}</span>
            <span 
              class="badge-status"
              :class="event.status === 'published' ? 'status-active' : 'status-draft'"
            >
              {{ event.status === 'published' ? '● Publicado' : '📝 Borrador' }}
            </span>
          </div>

          <h1 class="event-title">{{ event.title }}</h1>
          <p class="event-description">{{ event.description }}</p>

          <div class="meta-strip">
            <div class="meta-item">
              <span class="meta-icon">📅</span>
              <div>
                <span class="meta-label">Fecha del Evento</span>
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
                <span class="meta-label">Ubicación / Sede</span>
                <strong class="meta-val">{{ event.location }}</strong>
              </div>
            </div>
          </div>
        </header>

        <!-- 3. Métricas de Capacidad y Asistencia en Tiempo Real -->
        <section class="metrics-grid">
          <div class="metric-card">
            <div class="metric-icon icon-indigo">👥</div>
            <div class="metric-data">
              <span class="metric-num">{{ event.registeredCount || 0 }}</span>
              <span class="metric-label">Participantes Inscritos</span>
              <span class="metric-sub">Contador en tiempo real</span>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon icon-purple">🎯</div>
            <div class="metric-data">
              <span class="metric-num">{{ event.capacity }}</span>
              <span class="metric-label">Capacidad Máxima</span>
              <span class="metric-sub">Cupo configurado</span>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon icon-emerald">📊</div>
            <div class="metric-data">
              <span class="metric-num">{{ occupancyRate }}%</span>
              <span class="metric-label">Tasa de Ocupación</span>
              <div class="progress-bar-wrap">
                <div class="progress-bar-fill" :style="{ width: `${occupancyRate}%` }"></div>
              </div>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon icon-amber">🎟️</div>
            <div class="metric-data">
              <span class="metric-num">{{ remainingSpots }}</span>
              <span class="metric-label">Cupos Restantes</span>
              <span class="metric-sub" :class="remainingSpots === 0 ? 'text-danger' : 'text-success'">
                {{ remainingSpots === 0 ? '🔴 Cupo Lleno' : '🟢 Disponibles' }}
              </span>
            </div>
          </div>
        </section>

        <!-- 4. Resumen de Estado y Acciones Rápidas -->
        <section class="summary-section">
          <div class="summary-card">
            <h2 class="summary-heading">⚡ Estado de Inscripciones</h2>
            <p class="summary-desc">
              Esta actividad tiene <strong>{{ event.registeredCount || 0 }}</strong> personas inscritas de una capacidad total de <strong>{{ event.capacity }}</strong> cupos.
            </p>

            <div class="summary-progress-box">
              <div class="summary-labels">
                <span>Progreso de llenado</span>
                <strong>{{ occupancyRate }}% completado</strong>
              </div>
              <div class="large-progress-track">
                <div 
                  class="large-progress-fill" 
                  :style="{ width: `${occupancyRate}%` }"
                  :class="{ 'fill-full': remainingSpots === 0 }"
                ></div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
.manager-detail-page {
  min-height: 100vh;
  padding: 2.5rem 1rem 5rem;
  background-color: #0b0f19;
  color: #f8fafc;
  position: relative;
  overflow-x: hidden;
}

.bg-glow {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 900px;
  height: 450px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.08) 50%, transparent 70%);
  filter: blur(80px);
  pointer-events: none;
  z-index: 0;
}

.detail-container {
  max-width: 1000px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

/* 1. Top Nav */
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
  color: #94a3b8;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 600;
  padding: 0.5rem 1rem;
  background: rgba(22, 30, 49, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  transition: all 0.2s;
}

.btn-back:hover {
  color: #f8fafc;
  background: rgba(22, 30, 49, 0.9);
  border-color: rgba(99, 102, 241, 0.4);
  transform: translateX(-2px);
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.btn-secondary-action {
  color: #cbd5e1;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.55rem 1.1rem;
  background: rgba(22, 30, 49, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  transition: all 0.2s;
}

.btn-secondary-action:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.btn-edit-action {
  color: white;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 700;
  padding: 0.55rem 1.25rem;
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  border-radius: 10px;
  transition: all 0.2s;
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
}

.btn-edit-action:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
}

/* 2. Hero Card */
.event-hero-card {
  background: rgba(22, 30, 49, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2.25rem;
  backdrop-filter: blur(16px);
  margin-bottom: 2rem;
  box-shadow: 0 15px 35px -10px rgba(0, 0, 0, 0.5);
}

.card-top-tags {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}

.badge-category {
  background: rgba(99, 102, 241, 0.15);
  border: 1px solid rgba(99, 102, 241, 0.3);
  color: #a5b4fc;
  font-size: 0.8rem;
  font-weight: 700;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
}

.badge-status {
  font-size: 0.8rem;
  font-weight: 700;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
}

.status-active {
  background: rgba(52, 211, 153, 0.15);
  border: 1px solid rgba(52, 211, 153, 0.3);
  color: #34d399;
}

.status-draft {
  background: rgba(148, 163, 184, 0.15);
  border: 1px solid rgba(148, 163, 184, 0.3);
  color: #94a3b8;
}

.event-title {
  font-size: 2.25rem;
  font-weight: 800;
  line-height: 1.25;
  color: #f8fafc;
  margin-bottom: 0.85rem;
}

.event-description {
  font-size: 1.05rem;
  color: #94a3b8;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.meta-strip {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.25rem 1.5rem;
  background: rgba(11, 15, 25, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  flex-wrap: wrap;
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
  font-weight: 700;
  letter-spacing: 0.05em;
}

.meta-val {
  font-size: 0.95rem;
  color: #f8fafc;
}

.meta-divider {
  width: 1px;
  height: 35px;
  background: rgba(255, 255, 255, 0.08);
}

/* 3. Metrics Grid */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.25rem;
  margin-bottom: 2rem;
}

.metric-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(22, 30, 49, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 1.25rem;
  backdrop-filter: blur(12px);
}

.metric-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.35rem;
  flex-shrink: 0;
}

.icon-indigo { background: rgba(99, 102, 241, 0.15); color: #818cf8; }
.icon-purple { background: rgba(168, 85, 247, 0.15); color: #c084fc; }
.icon-emerald { background: rgba(52, 211, 153, 0.15); color: #34d399; }
.icon-amber { background: rgba(251, 191, 36, 0.15); color: #fbbf24; }

.metric-data {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.metric-num {
  font-size: 1.6rem;
  font-weight: 800;
  color: #f8fafc;
  line-height: 1.1;
}

.metric-label {
  font-size: 0.825rem;
  color: #94a3b8;
  font-weight: 600;
  margin-top: 0.2rem;
}

.metric-sub {
  font-size: 0.75rem;
  color: #64748b;
  margin-top: 0.15rem;
}

.text-danger { color: #f87171 !important; font-weight: 700; }
.text-success { color: #34d399 !important; font-weight: 700; }

.progress-bar-wrap {
  height: 6px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 999px;
  overflow: hidden;
  margin-top: 0.4rem;
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #34d399 0%, #a855f7 100%);
  border-radius: 999px;
  transition: width 0.3s;
}

/* 4. Summary Section */
.summary-card {
  background: rgba(22, 30, 49, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2rem;
  backdrop-filter: blur(16px);
}

.summary-heading {
  font-size: 1.35rem;
  font-weight: 800;
  color: #f8fafc;
  margin-bottom: 0.5rem;
}

.summary-desc {
  font-size: 0.95rem;
  color: #94a3b8;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.summary-desc strong {
  color: #f8fafc;
}

.summary-progress-box {
  background: rgba(11, 15, 25, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 14px;
  padding: 1.25rem;
}

.summary-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: #94a3b8;
  margin-bottom: 0.6rem;
}

.summary-labels strong {
  color: #34d399;
}

.large-progress-track {
  height: 12px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 999px;
  overflow: hidden;
}

.large-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #6366f1 0%, #34d399 100%);
  border-radius: 999px;
  transition: width 0.4s ease;
}

.fill-full {
  background: linear-gradient(90deg, #f59e0b 0%, #ef4444 100%);
}

.loading-state, .error-box {
  text-align: center;
  padding: 4rem 1rem;
  color: #94a3b8;
}

.spinner-icon {
  font-size: 2.5rem;
  display: block;
  margin-bottom: 1rem;
}

.capitalize {
  text-transform: capitalize;
}
</style>