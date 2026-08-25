<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

definePageMeta({
  middleware: 'auth'
})

const { getEvents, deleteEvent, loading } = useEvents()
const { logout } = useAuth()

const events = ref<any[]>([])
const selectedFilter = ref('all')

const fetchEvents = async () => {
  const res = await getEvents()
  if (res.ok) {
    events.value = res.data
  }
}

onMounted(() => {
  fetchEvents()
})

const filteredEvents = computed(() => {
  if (selectedFilter.value === 'all') return events.value
  if (selectedFilter.value === 'active') return events.value.filter(e => e.status === 'published')
  if (selectedFilter.value === 'draft') return events.value.filter(e => e.status === 'draft')
  return events.value
})

const publishedCount = computed(() => events.value.filter(e => e.status === 'published').length)
const draftCount = computed(() => events.value.filter(e => e.status === 'draft').length)
const totalRegistrations = computed(() => events.value.reduce((acc, ev) => acc + (ev.registeredCount || 0), 0))

const handleDelete = async (id: string) => {
  if (confirm('¿Estás seguro de que deseas eliminar esta actividad? Esta acción no se puede deshacer.')) {
    const res = await deleteEvent(id)
    if (res.ok) {
      await fetchEvents()
    }
  }
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return 'Sin fecha definida'
  const d = new Date(dateStr)
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}


</script>   

<template>
  <div class="manager-dashboard">
    <!-- Luz ambiental de fondo -->
    <div class="bg-glow"></div>

    <div class="container dashboard-container">
      <!-- 1. Header / Perfil del Organizador -->
      <header class="manager-hero">
        <div class="profile-main">
          <div class="manager-avatar">
            <span class="avatar-icon">🎯</span>
            <span class="verified-badge" title="Organizador Verificado">✓</span>
          </div>

          <div class="profile-info">
            <div class="role-badge-wrap">
              <span class="role-pill">⚡ Panel de Organizador</span>
              <span class="status-pill">Verificado</span>
            </div>
            <h1 class="manager-name">Panel de Gestión: <span class="text-gradient">Mis Actividades</span></h1>
            <p class="manager-desc">Administra tus talleres, iniciativas comunitarias y participantes inscritos.</p>
          </div>
        </div>

        <div class="hero-actions">
          <NuxtLink to="/managers/create" class="btn-create-event">
            <span>+ Crear Nueva Actividad</span>
          </NuxtLink>
          <button class="btn-secondary-action" @click="logout">
            🚪 Cerrar Sesión
          </button>
        </div>
      </header>

      <!-- 2. KPIs / Métricas del Organizador -->
      <section class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-icon-wrap icon-indigo">
            <span>📅</span>
          </div>
          <div class="kpi-content">
            <span class="kpi-value">{{ events.length }}</span>
            <span class="kpi-label">Actividades Totales</span>
            <span class="kpi-sub positive">{{ publishedCount }} publicadas</span>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon-wrap icon-purple">
            <span>👥</span>
          </div>
          <div class="kpi-content">
            <span class="kpi-value">{{ totalRegistrations }}</span>
            <span class="kpi-label">Inscritos Totales</span>
            <span class="kpi-sub positive">Participantes confirmados</span>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon-wrap icon-emerald">
            <span>⭐</span>
          </div>
          <div class="kpi-content">
            <span class="kpi-value">100%</span>
            <span class="kpi-label">Estado del Servidor</span>
            <span class="kpi-sub positive">Conectado a MongoDB</span>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon-wrap icon-amber">
            <span>⚡</span>
          </div>
          <div class="kpi-content">
            <span class="kpi-value">{{ draftCount }}</span>
            <span class="kpi-label">Borradores Pendientes</span>
            <span class="kpi-sub">En edición</span>
          </div>
        </div>
      </section>

      <!-- 3. Contenido Principal: Gestión de Eventos y Sidebar -->
      <div class="dashboard-layout">
        <!-- Columna Izquierda: Mis Actividades Creadas -->
        <main class="main-column">
          <div class="section-title-bar">
            <div>
              <span class="sub-tag">Catálogo de Eventos</span>
              <h2 class="block-title">Mis Actividades Gestionadas</h2>
            </div>

            <!-- Filtros rápidos -->
            <div class="filter-tabs">
              <button
                class="tab-btn"
                :class="{ active: selectedFilter === 'all' }"
                @click="selectedFilter = 'all'"
              >
                Todas ({{ events.length }})
              </button>
              <button
                class="tab-btn"
                :class="{ active: selectedFilter === 'active' }"
                @click="selectedFilter = 'active'"
              >
                Publicadas ({{ publishedCount }})
              </button>
              <button
                class="tab-btn"
                :class="{ active: selectedFilter === 'draft' }"
                @click="selectedFilter = 'draft'"
              >
                Borradores ({{ draftCount }})
              </button>
            </div>
          </div>

          <!-- Estado de carga -->
          <div v-if="loading" class="empty-state">
            <span>⏳</span>
            <p>Cargando actividades...</p>
          </div>

          <!-- Lista de Eventos del Manager -->
          <div v-else-if="filteredEvents.length > 0" class="manager-events-list">
            <article
              v-for="ev in filteredEvents"
              :key="ev._id"
              class="event-manage-card"
              :class="{ 'draft-card': ev.status === 'draft' }"
            >
              <div
                class="card-status-bar"
                :class="ev.status === 'published' ? 'status-active' : 'status-draft'"
              ></div>

              <div class="card-body">
                <div class="card-top-row">
                  <div class="badges-row">
                    <span class="badge-pill badge-tech">
                      {{ ev.category?.name || 'Comunidad' }}
                    </span>
                    <span
                      class="badge-status"
                      :class="ev.status === 'published' ? 'badge-published' : 'badge-draft'"
                    >
                      {{ ev.status === 'published' ? '● Publicado' : '📝 Borrador' }}
                    </span>
                  </div>
                  <span class="event-date">📅 {{ formatDate(ev.startDate) }}</span>
                </div>

                <h3 class="event-title">{{ ev.title }}</h3>
                <p class="event-loc">📍 {{ ev.location }}</p>

                <!-- Barra de Cupos / Capacidad Real -->
                <div class="capacity-box">
                  <div class="capacity-info">
                    <span>Ocupación de Cupos</span>
                    <strong>{{ ev.registeredCount || 0 }} / {{ ev.capacity }} inscritos</strong>
                  </div>
                  <div class="capacity-track">
                    <div 
                      class="capacity-fill" 
                      :style="{ width: `${Math.min(100, Math.round(((ev.registeredCount || 0) / (ev.capacity || 1)) * 100))}%` }"
                    ></div>
                  </div>
                </div>

                <div class="card-actions-row">
                  <NuxtLink :to="`/managers/${ev._id}`" class="action-btn btn-view" title="Ver métricas y estado del evento">
                    📊 Gestión & Cupos
                  </NuxtLink>
                  <NuxtLink :to="`/activities/${ev._id}`" class="action-btn btn-view">
                    👁️ Ver Público
                  </NuxtLink>
                  <NuxtLink :to="`/managers/edit?id=${ev._id}`" class="action-btn btn-edit">
                    ✏️ Editar
                  </NuxtLink>
                  <button
                    class="action-btn btn-danger"
                    title="Eliminar actividad"
                    @click="handleDelete(ev._id)"
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
            </article>
          </div>

          <!-- Empty State -->
          <div v-else class="empty-state">
            <span class="empty-icon">📂</span>
            <h3>No se encontraron actividades</h3>
            <p>Aún no has creado actividades con este estado. ¡Comienza publicando una!</p>
            <NuxtLink to="/managers/create" class="btn-create-event" style="margin-top: 1rem;">
              + Crear Primera Actividad
            </NuxtLink>
          </div>
        </main>

        <!-- Columna Derecha: Sidebar de Gestión y Acciones -->
        <aside class="sidebar-column">
          <!-- Automatización Serverless AWS -->
          <div class="sidebar-card serverless-box">
            <div class="serverless-header">
              <span class="cloud-icon">☁️</span>
              <div>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                  <h4>AWS Lambda</h4>
                  <span class="badge-status-pwa pwa-online">Active</span>
                </div>
                <p>Automatizaciones Serverless en la Nube</p>
              </div>
            </div>
            <ul class="serverless-features">
              <li>✅ Recordatorios automáticos 24h antes</li>
              <li>✅ Sincronización continua de inscripciones</li>
            </ul>
          </div>

          <!-- Acciones Rápidas del Manager -->
          <div class="sidebar-card">
            <h3 class="sidebar-title">⚙️ Herramientas de Gestor</h3>
            <div class="quick-links">
              <NuxtLink to="/managers/create" class="quick-link-item link-highlight">
                <span>➕ Publicar Nueva Actividad</span>
                <span>→</span>
              </NuxtLink>
              <NuxtLink to="/activities" class="quick-link-item">
                <span>🌐 Ver Portal Público</span>
                <span>→</span>
              </NuxtLink>
              <NuxtLink to="/" class="quick-link-item">
                <span>🏠 Ir al Inicio</span>
                <span>→</span>
              </NuxtLink>
              <button class="quick-link-item logout-btn" @click="logout">
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
.manager-dashboard {
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
  width: 750px;
  height: 400px;
  background: radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, rgba(99, 102, 241, 0.1) 40%, transparent 70%);
  filter: blur(60px);
  pointer-events: none;
  z-index: 0;
}

.dashboard-container {
  position: relative;
  z-index: 1;
}

/* 1. Hero del Organizador */
.manager-hero {
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

.manager-avatar {
  position: relative;
  width: 68px;
  height: 68px;
  border-radius: 18px;
  background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 20px rgba(168, 85, 247, 0.4);
}

.avatar-icon {
  font-size: 2rem;
}

.verified-badge {
  position: absolute;
  bottom: -4px;
  right: -4px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #3b82f6;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 800;
  border: 2px solid #161e31;
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
  background: rgba(168, 85, 247, 0.15);
  border: 1px solid rgba(168, 85, 247, 0.3);
  color: #d8b4fe;
}

.status-pill {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.2rem 0.65rem;
  border-radius: 999px;
  background: rgba(59, 130, 246, 0.12);
  border: 1px solid rgba(59, 130, 246, 0.3);
  color: #93c5fd;
}

.manager-name {
  font-size: 1.65rem;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.manager-desc {
  font-size: 0.9rem;
  color: #94a3b8;
}

.hero-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.btn-logout-manager {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.4);
  color: #fca5a5;
  font-family: inherit;
  font-size: 0.925rem;
  font-weight: 700;
  padding: 0.75rem 1.25rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-logout-manager:hover {
  background: rgba(239, 68, 68, 0.3);
  color: #ffffff;
  border-color: #ef4444;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(239, 68, 68, 0.3);
}

.btn-create-event {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #a855f7 0%, #6366f1 100%);
  color: white;
  text-decoration: none;
  font-size: 0.925rem;
  font-weight: 700;
  padding: 0.75rem 1.4rem;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(168, 85, 247, 0.35);
  transition: all 0.2s;
}

.btn-create-event:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(168, 85, 247, 0.5);
}

.btn-secondary-action {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #f8fafc;
  font-size: 0.9rem;
  font-weight: 600;
  padding: 0.75rem 1.2rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary-action:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* 2. Grid de KPIs */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.25rem;
  margin-bottom: 2.5rem;
}

.kpi-card {
  display: flex;
  align-items: center;
  gap: 1.15rem;
  background: rgba(22, 30, 49, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 1.25rem 1.5rem;
  backdrop-filter: blur(12px);
}

.kpi-icon-wrap {
  width: 50px;
  height: 50px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  flex-shrink: 0;
}

.icon-indigo { background: rgba(99, 102, 241, 0.15); border: 1px solid rgba(99, 102, 241, 0.3); }
.icon-purple { background: rgba(168, 85, 247, 0.15); border: 1px solid rgba(168, 85, 247, 0.3); }
.icon-emerald { background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.3); }
.icon-amber { background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.3); }

.kpi-content {
  display: flex;
  flex-direction: column;
}

.kpi-value {
  font-size: 1.55rem;
  font-weight: 800;
  color: #f8fafc;
  line-height: 1.15;
}

.kpi-label {
  font-size: 0.825rem;
  color: #94a3b8;
  font-weight: 500;
  margin-top: 0.15rem;
}

.kpi-sub {
  font-size: 0.75rem;
  color: #64748b;
  margin-top: 0.25rem;
}

.kpi-sub.positive {
  color: #34d399;
  font-weight: 600;
}

.status-on {
  color: #fbbf24;
  font-weight: 600;
}

/* 3. Layout Principal */
.dashboard-layout {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 2rem;
  align-items: start;
}

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
  color: #c084fc;
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
  background: rgba(168, 85, 247, 0.25);
  color: #e9d5ff;
}

/* Lista de Eventos */
.manager-events-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.event-manage-card {
  position: relative;
  background: rgba(22, 30, 49, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  backdrop-filter: blur(12px);
  transition: all 0.2s;
}

.event-manage-card:hover {
  border-color: rgba(168, 85, 247, 0.35);
  transform: translateY(-2px);
}

.card-status-bar {
  width: 6px;
}

.status-active {
  background: linear-gradient(180deg, #10b981 0%, #059669 100%);
}

.status-draft {
  background: linear-gradient(180deg, #f59e0b 0%, #d97706 100%);
}

.card-body {
  padding: 1.5rem;
  flex: 1;
}

.card-top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.badges-row {
  display: flex;
  gap: 0.5rem;
}

.badge-pill {
  font-size: 0.72rem;
  font-weight: 700;
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
  text-transform: uppercase;
}

.badge-tech { background: rgba(99, 102, 241, 0.15); color: #a5b4fc; }
.badge-edu { background: rgba(59, 130, 246, 0.15); color: #93c5fd; }

.badge-status {
  font-size: 0.72rem;
  font-weight: 600;
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
}

.badge-published { background: rgba(16, 185, 129, 0.12); color: #6ee7b7; }
.badge-draft { background: rgba(245, 158, 11, 0.12); color: #fde68a; }

.event-date {
  font-size: 0.85rem;
  color: #94a3b8;
  font-weight: 500;
}

.event-title {
  font-size: 1.2rem;
  font-weight: 800;
  color: #f8fafc;
  margin-bottom: 0.35rem;
}

.event-loc {
  font-size: 0.85rem;
  color: #94a3b8;
  margin-bottom: 1rem;
}

/* Barra de Capacidad */
.capacity-box {
  background: rgba(11, 15, 25, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 0.75rem 1rem;
  border-radius: 10px;
  margin-bottom: 1.25rem;
}

.capacity-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.825rem;
  margin-bottom: 0.4rem;
  color: #94a3b8;
}

.capacity-info strong {
  color: #f8fafc;
}

.capacity-track {
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 999px;
  overflow: hidden;
}

.capacity-fill {
  height: 100%;
  background: linear-gradient(90deg, #6366f1 0%, #a855f7 100%);
  border-radius: 999px;
}

.draft-fill {
  background: #64748b;
}

/* Acciones */
.card-actions-row {
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.action-btn {
  font-size: 0.825rem;
  font-weight: 600;
  padding: 0.5rem 0.9rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.btn-view {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #cbd5e1;
}

.btn-view:hover {
  background: rgba(255, 255, 255, 0.12);
  color: white;
}

.btn-attendees {
  background: rgba(168, 85, 247, 0.15);
  border: 1px solid rgba(168, 85, 247, 0.3);
  color: #d8b4fe;
}

.btn-attendees:hover {
  background: #a855f7;
  color: white;
}

.btn-edit {
  background: rgba(99, 102, 241, 0.15);
  border: 1px solid rgba(99, 102, 241, 0.3);
  color: #a5b4fc;
}

.btn-edit:hover {
  background: #6366f1;
  color: white;
}

.btn-primary-small {
  background: linear-gradient(135deg, #a855f7 0%, #6366f1 100%);
  color: white;
  border: none;
}

.btn-primary-small:hover {
  opacity: 0.95;
}

.btn-danger {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.25);
  color: #f87171;
  margin-left: auto;
}

.btn-danger:hover {
  background: #ef4444;
  color: white;
}

/* Sidebar */
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

.sidebar-title {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #f8fafc;
}

.activity-stream {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.stream-item {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
}

.user-avatar-mini {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: #6366f1;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  flex-shrink: 0;
}

.mini-pink { background: #ec4899; }
.mini-blue { background: #3b82f6; }

.stream-text {
  font-size: 0.825rem;
  color: #cbd5e1;
  line-height: 1.35;
}

.stream-text strong {
  color: #f8fafc;
}

.stream-time {
  font-size: 0.72rem;
  color: #64748b;
  display: block;
  margin-top: 0.15rem;
}

/* Serverless Box */
.serverless-box {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(168, 85, 247, 0.08) 100%);
  border-color: rgba(245, 158, 11, 0.25);
}

.serverless-header {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  margin-bottom: 0.75rem;
}

.cloud-icon {
  font-size: 1.5rem;
}

.serverless-header h4 {
  font-size: 0.95rem;
  font-weight: 700;
}

.serverless-header p {
  font-size: 0.8rem;
  color: #94a3b8;
}

.serverless-features {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  font-size: 0.8rem;
  color: #cbd5e1;
}

/* Quick Links */
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
  background: rgba(168, 85, 247, 0.15);
  border-color: rgba(168, 85, 247, 0.3);
  color: #f8fafc;
}

.link-highlight {
  background: rgba(168, 85, 247, 0.12);
  border-color: rgba(168, 85, 247, 0.3);
  color: #e9d5ff;
  font-weight: 600;
}

.logout-btn {
  border-color: rgba(239, 68, 68, 0.2);
  color: #fca5a5;
  background: rgba(239, 68, 68, 0.06);
}

.logout-btn:hover {
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
  .manager-hero {
    flex-direction: column;
    align-items: flex-start;
  }
  .card-actions-row {
    flex-direction: column;
  }
  .action-btn {
    width: 100%;
    justify-content: center;
  }
  .btn-danger {
    margin-left: 0;
  }
}
</style>
