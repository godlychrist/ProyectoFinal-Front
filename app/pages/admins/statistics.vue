<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

definePageMeta({
  middleware: 'auth'
})

const { getEvents, getCategories } = useEvents()
const { getUsers } = useUsers()

const users = ref<any[]>([])
const events = ref<any[]>([])
const categories = ref<any[]>([])
const pageLoading = ref(true)

const fetchStats = async () => {
  pageLoading.value = true

  try {
    const [usersRes, eventsRes, catsRes] = await Promise.all([
      getUsers(),
      getEvents(),
      getCategories()
    ])

    if (usersRes.ok && Array.isArray(usersRes.data)) {
      users.value = usersRes.data
    }
    if (eventsRes.ok && Array.isArray(eventsRes.data)) {
      events.value = eventsRes.data
    }
    if (catsRes.ok && Array.isArray(catsRes.data)) {
      categories.value = catsRes.data
    }
  } catch (err) {
    console.error('Error al cargar datos del dashboard:', err)
  } finally {
    pageLoading.value = false
  }
}

onMounted(() => {
  fetchStats()
})

// 1. Métricas de Usuarios
const totalUsers = computed(() => users.value.length)
const totalOrganizers = computed(() => users.value.filter(u => u.role === 'organizer').length)
const totalParticipants = computed(() => users.value.filter(u => u.role === 'user').length)
const totalAdmins = computed(() => users.value.filter(u => u.role === 'admin').length)

// 2. Métricas de Actividades
const totalEvents = computed(() => events.value.length)
const activeEventsCount = computed(() => events.value.filter(e => e.status === 'published').length)
const draftEventsCount = computed(() => events.value.filter(e => e.status === 'draft').length)
const completedEventsCount = computed(() => events.value.filter(e => e.status === 'completed').length)

// 3. Métricas de Inscripciones y Cupos
const totalRegistrations = computed(() => events.value.reduce((acc, ev) => acc + (ev.registeredCount || 0), 0))
const totalCapacity = computed(() => events.value.reduce((acc, ev) => acc + (ev.capacity || 0), 0))
const globalOccupancy = computed(() => {
  const cap = totalCapacity.value || 1
  const reg = totalRegistrations.value || 0
  return Math.min(100, Math.round((reg / cap) * 100))
})

// 4. Actividades Recientes
const recentEvents = computed(() => events.value.slice(0, 6))

const formatDate = (dateStr: string) => {
  if (!dateStr) return 'Sin fecha'
  return new Date(dateStr).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}
</script>

<template>
  <div class="admin-stats-page">
    <div class="bg-glow"></div>

    <div class="container stats-container">
      <!-- 1. Navegación Superior -->
      <nav class="admin-nav">
        <NuxtLink to="/admins" class="btn-back">
          <span>←</span>
          <span>Volver al Panel General</span>
        </NuxtLink>

        <div class="admin-badge-top">
          <span class="shield-icon">🛡️</span>
          <span>Dashboard Analítico del Sistema</span>
        </div>
      </nav>

      <!-- 2. Header Hero -->
      <header class="stats-hero">
        <div class="hero-left">
          <h1 class="page-title">Dashboard & <span class="text-gradient">Estadísticas Globales</span></h1>
          <p class="page-subtitle">Monitorea el crecimiento, volumen de usuarios, tasa de ocupación de actividades e inscripciones en tiempo real.</p>
        </div>

        <button class="btn-refresh" @click="fetchStats" title="Recargar estadísticas">
          <span>🔄</span>
          <span>Actualizar Datos</span>
        </button>
      </header>

      <!-- Contenido Principal -->
      <div class="stats-content">
        <!-- 3. Los 6 KPIs Requeridos del Administrador -->
        <section class="kpi-grid">
          <!-- KPI 1: Usuarios Registrados -->
          <div class="kpi-card">
            <div class="kpi-icon-wrap icon-indigo">👥</div>
            <div class="kpi-content">
              <span class="kpi-value">{{ pageLoading ? '...' : totalUsers }}</span>
              <span class="kpi-label">Usuarios Registrados</span>
              <span class="kpi-sub positive">Cuentas activas en la BD</span>
            </div>
          </div>

          <!-- KPI 2: Organizadores -->
          <div class="kpi-card">
            <div class="kpi-icon-wrap icon-purple">🎯</div>
            <div class="kpi-content">
              <span class="kpi-value">{{ pageLoading ? '...' : totalOrganizers }}</span>
              <span class="kpi-label">Organizadores</span>
              <span class="kpi-sub">Creadores con permisos</span>
            </div>
          </div>

          <!-- KPI 3: Actividades Totales -->
          <div class="kpi-card">
            <div class="kpi-icon-wrap icon-blue">📅</div>
            <div class="kpi-content">
              <span class="kpi-value">{{ pageLoading ? '...' : totalEvents }}</span>
              <span class="kpi-label">Actividades Totales</span>
              <span class="kpi-sub">Catálogo completo</span>
            </div>
          </div>

          <!-- KPI 4: Inscripciones Globales -->
          <div class="kpi-card">
            <div class="kpi-icon-wrap icon-emerald">🎟️</div>
            <div class="kpi-content">
              <span class="kpi-value">{{ pageLoading ? '...' : totalRegistrations }}</span>
              <span class="kpi-label">Inscripciones Totales</span>
              <span class="kpi-sub positive">Registros de asistencia</span>
            </div>
          </div>

          <!-- KPI 5: Actividades Activas -->
          <div class="kpi-card">
            <div class="kpi-icon-wrap icon-green">🟢</div>
            <div class="kpi-content">
              <span class="kpi-value">{{ pageLoading ? '...' : activeEventsCount }}</span>
              <span class="kpi-label">Actividades Activas</span>
              <span class="kpi-sub positive">Inscripciones abiertas</span>
            </div>
          </div>

          <!-- KPI 6: Actividades Finalizadas -->
          <div class="kpi-card">
            <div class="kpi-icon-wrap icon-amber">🏁</div>
            <div class="kpi-content">
              <span class="kpi-value">{{ pageLoading ? '...' : completedEventsCount }}</span>
              <span class="kpi-label">Actividades Finalizadas</span>
              <span class="kpi-sub">Eventos concluidos</span>
            </div>
          </div>
        </section>

        <!-- 4. Paneles de Análisis Visual y Ocupación -->
        <div class="analytics-layout">
          <!-- Tarjeta 1: Desglose de Usuarios & Roles -->
          <section class="analytics-card">
            <h3 class="card-heading">
              <span>👥</span>
              <span>Distribución de Usuarios por Rol</span>
            </h3>
            <p class="card-subheading">Estructura de permisos de la comunidad</p>

            <div class="breakdown-list">
              <div class="breakdown-item">
                <div class="breakdown-labels">
                  <span>🙋‍♂️ Participantes Estándar</span>
                  <strong>{{ totalParticipants }} ({{ totalUsers > 0 ? Math.round((totalParticipants / totalUsers) * 100) : 0 }}%)</strong>
                </div>
                <div class="breakdown-track">
                  <div class="breakdown-fill fill-emerald" :style="{ width: `${totalUsers > 0 ? Math.round((totalParticipants / totalUsers) * 100) : 0}%` }"></div>
                </div>
              </div>

              <div class="breakdown-item">
                <div class="breakdown-labels">
                  <span>🎯 Organizadores de Actividades</span>
                  <strong>{{ totalOrganizers }} ({{ totalUsers > 0 ? Math.round((totalOrganizers / totalUsers) * 100) : 0 }}%)</strong>
                </div>
                <div class="breakdown-track">
                  <div class="breakdown-fill fill-purple" :style="{ width: `${totalUsers > 0 ? Math.round((totalOrganizers / totalUsers) * 100) : 0}%` }"></div>
                </div>
              </div>

              <div class="breakdown-item">
                <div class="breakdown-labels">
                  <span>👑 Administradores Globales</span>
                  <strong>{{ totalAdmins }} ({{ totalUsers > 0 ? Math.round((totalAdmins / totalUsers) * 100) : 0 }}%)</strong>
                </div>
                <div class="breakdown-track">
                  <div class="breakdown-fill fill-rose" :style="{ width: `${totalUsers > 0 ? Math.round((totalAdmins / totalUsers) * 100) : 0}%` }"></div>
                </div>
              </div>
            </div>

            <NuxtLink to="/admins/users" class="card-action-link">
              Gestionar Cuentas de Usuario →
            </NuxtLink>
          </section>

          <!-- Tarjeta 2: Capacidad y Ocupación Global -->
          <section class="analytics-card">
            <h3 class="card-heading">
              <span>📊</span>
              <span>Ocupación Global de Cupos</span>
            </h3>
            <p class="card-subheading">Rendimiento de asistencia en eventos</p>

            <div class="gauge-box">
              <div class="gauge-number">{{ globalOccupancy }}%</div>
              <div class="gauge-details">
                <strong>{{ totalRegistrations }} participantes</strong>
                <span>de {{ totalCapacity }} cupos totales habilitados</span>
              </div>
            </div>

            <div class="large-track">
              <div class="large-fill" :style="{ width: `${globalOccupancy}%` }"></div>
            </div>

            <div class="status-indicator-box">
              <div class="indicator-chip">
                <span>🟢 Activas: <strong>{{ activeEventsCount }}</strong></span>
              </div>
              <div class="indicator-chip">
                <span>🏁 Finalizadas: <strong>{{ completedEventsCount }}</strong></span>
              </div>
              <div class="indicator-chip">
                <span>📝 Borradores: <strong>{{ draftEventsCount }}</strong></span>
              </div>
            </div>

            <NuxtLink to="/admins/events" class="card-action-link">
              Supervisar Catálogo de Actividades →
            </NuxtLink>
          </section>
        </div>

        <!-- 5. Actividades Recientes en Plataforma -->
        <section class="recent-events-card">
          <div class="recent-header">
            <div>
              <h3 class="card-heading">
                <span>⚡</span>
                <span>Últimas Actividades Creadas en la Plataforma</span>
              </h3>
              <p class="card-subheading">Supervisa los eventos recién registrados por los organizadores</p>
            </div>
            <NuxtLink to="/admins/events" class="btn-see-all">
              Ver Todas las Actividades →
            </NuxtLink>
          </div>

          <div v-if="recentEvents.length > 0" class="recent-list">
            <div v-for="ev in recentEvents" :key="ev._id" class="recent-item">
              <div class="recent-main">
                <span class="badge-cat">{{ ev.category?.name || 'Comunidad' }}</span>
                <strong class="recent-title">{{ ev.title }}</strong>
                <span class="recent-org">👤 Por: {{ ev.organizer?.name || 'Comunidad' }}</span>
              </div>
              <div class="recent-meta">
                <span class="recent-date">📅 {{ formatDate(ev.startDate) }}</span>
                <span class="recent-cap">👥 {{ ev.registeredCount || 0 }} / {{ ev.capacity }} inscritos</span>
                <span class="badge-status" :class="ev.status === 'published' ? 'status-pub' : 'status-dft'">
                  {{ ev.status === 'published' ? '● Publicada' : '📝 Borrador' }}
                </span>
              </div>
            </div>
          </div>
          <div v-else class="empty-recent">
            <p>No hay actividades registradas aún.</p>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-stats-page {
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
  width: 1000px;
  height: 450px;
  background: radial-gradient(circle, rgba(52, 211, 153, 0.12) 0%, rgba(99, 102, 241, 0.08) 50%, transparent 70%);
  filter: blur(80px);
  pointer-events: none;
  z-index: 0;
}

.stats-container {
  max-width: 1100px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

/* 1. Nav */
.admin-nav {
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

.admin-badge-top {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.9rem;
  background: rgba(52, 211, 153, 0.12);
  border: 1px solid rgba(52, 211, 153, 0.3);
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 700;
  color: #6ee7b7;
}

/* 2. Hero */
.stats-hero {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.page-title {
  font-size: 2.25rem;
  font-weight: 800;
  line-height: 1.2;
  color: #f8fafc;
  margin-bottom: 0.5rem;
}

.text-gradient {
  background: linear-gradient(135deg, #34d399 0%, #38bdf8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.page-subtitle {
  color: #94a3b8;
  font-size: 1rem;
  max-width: 650px;
}

.btn-refresh {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(22, 30, 49, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #cbd5e1;
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.6rem 1.1rem;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-refresh:hover {
  background: rgba(255, 255, 255, 0.12);
  color: white;
}

/* 3. KPIs */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.25rem;
  margin-bottom: 2.5rem;
}

.kpi-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(22, 30, 49, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 1.25rem;
  backdrop-filter: blur(12px);
}

.kpi-icon-wrap {
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
.icon-blue { background: rgba(56, 189, 248, 0.15); color: #38bdf8; }
.icon-emerald { background: rgba(52, 211, 153, 0.15); color: #34d399; }
.icon-green { background: rgba(16, 185, 129, 0.15); color: #10b981; }
.icon-amber { background: rgba(251, 191, 36, 0.15); color: #fbbf24; }

.kpi-content {
  display: flex;
  flex-direction: column;
}

.kpi-value {
  font-size: 1.65rem;
  font-weight: 800;
  color: #f8fafc;
  line-height: 1.1;
}

.kpi-label {
  font-size: 0.825rem;
  color: #94a3b8;
  font-weight: 600;
  margin-top: 0.2rem;
}

.kpi-sub {
  font-size: 0.725rem;
  color: #64748b;
  margin-top: 0.15rem;
}

.kpi-sub.positive { color: #34d399; font-weight: 600; }

/* 4. Analytics Layout */
.analytics-layout {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.analytics-card {
  background: rgba(22, 30, 49, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 1.75rem;
  backdrop-filter: blur(16px);
  display: flex;
  flex-direction: column;
}

.card-heading {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 1.15rem;
  font-weight: 800;
  color: #f8fafc;
  margin-bottom: 0.25rem;
}

.card-subheading {
  font-size: 0.85rem;
  color: #94a3b8;
  margin-bottom: 1.5rem;
}

.breakdown-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-bottom: 1.5rem;
  flex: 1;
}

.breakdown-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: #cbd5e1;
  margin-bottom: 0.4rem;
}

.breakdown-labels strong {
  color: #f8fafc;
}

.breakdown-track {
  height: 8px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 999px;
  overflow: hidden;
}

.breakdown-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.4s ease;
}

.fill-emerald { background: linear-gradient(90deg, #10b981 0%, #34d399 100%); }
.fill-purple { background: linear-gradient(90deg, #8b5cf6 0%, #c084fc 100%); }
.fill-rose { background: linear-gradient(90deg, #f43f5e 0%, #fb7185 100%); }

.card-action-link {
  display: inline-block;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  font-size: 0.85rem;
  font-weight: 700;
  color: #818cf8;
  text-decoration: none;
  transition: all 0.2s;
}

.card-action-link:hover {
  color: #a5b4fc;
  transform: translateX(4px);
}

.gauge-box {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.gauge-number {
  font-size: 2.75rem;
  font-weight: 900;
  color: #34d399;
  line-height: 1;
}

.gauge-details {
  display: flex;
  flex-direction: column;
}

.gauge-details strong {
  font-size: 1rem;
  color: #f8fafc;
}

.gauge-details span {
  font-size: 0.8rem;
  color: #94a3b8;
}

.large-track {
  height: 12px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 999px;
  overflow: hidden;
  margin-bottom: 1.5rem;
}

.large-fill {
  height: 100%;
  background: linear-gradient(90deg, #6366f1 0%, #34d399 100%);
  border-radius: 999px;
  transition: width 0.5s ease;
}

.status-indicator-box {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
  flex: 1;
}

.indicator-chip {
  background: rgba(11, 15, 25, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  font-size: 0.8rem;
  color: #cbd5e1;
}

/* 5. Recent Events */
.recent-events-card {
  background: rgba(22, 30, 49, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 1.75rem;
  backdrop-filter: blur(16px);
}

.recent-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.btn-see-all {
  color: #818cf8;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 700;
}

.btn-see-all:hover {
  text-decoration: underline;
}

.recent-list {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.recent-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(11, 15, 25, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1rem 1.25rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.recent-main {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  flex-wrap: wrap;
}

.badge-cat {
  background: rgba(99, 102, 241, 0.15);
  color: #a5b4fc;
  font-size: 0.725rem;
  font-weight: 700;
  padding: 0.2rem 0.55rem;
  border-radius: 6px;
}

.recent-title {
  color: #f8fafc;
  font-size: 0.95rem;
}

.recent-org {
  font-size: 0.8rem;
  color: #94a3b8;
}

.recent-meta {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  font-size: 0.85rem;
}

.recent-date { color: #94a3b8; }
.recent-cap { color: #cbd5e1; font-weight: 600; }

.badge-status {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
}

.status-pub {
  background: rgba(52, 211, 153, 0.15);
  color: #34d399;
}

.status-dft {
  background: rgba(148, 163, 184, 0.15);
  color: #94a3b8;
}

.empty-recent {
  text-align: center;
  padding: 2rem;
  color: #94a3b8;
  font-size: 0.9rem;
}
</style>
