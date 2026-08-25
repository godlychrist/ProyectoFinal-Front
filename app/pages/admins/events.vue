<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

definePageMeta({
  middleware: 'auth'
})

const { getEvents, deleteEvent, getCategories, loading, error } = useEvents()

const events = ref<any[]>([])
const categories = ref<any[]>([])
const searchQuery = ref('')
const selectedCategory = ref('all')
const selectedStatus = ref('all')
const actionMessage = ref<string | null>(null)

const fetchAll = async () => {
  const [eventsRes, catsRes] = await Promise.all([
    getEvents(),
    getCategories()
  ])

  if (eventsRes.ok) events.value = eventsRes.data
  if (catsRes.ok) categories.value = catsRes.data
}

onMounted(() => {
  fetchAll()
})

// Métricas
const totalEvents = computed(() => events.value.length)
const publishedCount = computed(() => events.value.filter(e => e.status === 'published').length)
const draftCount = computed(() => events.value.filter(e => e.status === 'draft').length)
const totalAttendees = computed(() => events.value.reduce((acc, ev) => acc + (ev.registeredCount || 0), 0))

// Filtro de búsqueda, categoría y estado
const filteredEvents = computed(() => {
  let list = [...events.value]

  if (selectedStatus.value !== 'all') {
    list = list.filter(e => e.status === selectedStatus.value)
  }

  if (selectedCategory.value !== 'all') {
    list = list.filter(e => {
      const catId = typeof e.category === 'object' ? e.category?._id : e.category
      return catId === selectedCategory.value
    })
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim()
    list = list.filter(e =>
      e.title?.toLowerCase().includes(q) ||
      e.description?.toLowerCase().includes(q) ||
      e.location?.toLowerCase().includes(q) ||
      e.organizer?.name?.toLowerCase().includes(q)
    )
  }

  return list
})

// Eliminar / Moderar evento como Admin
const handleDelete = async (ev: any) => {
  if (confirm(`¿Estás seguro de eliminar permanentemente la actividad "${ev.title}"? Esta acción no se puede deshacer.`)) {
    const res = await deleteEvent(ev._id)
    if (res.ok) {
      actionMessage.value = `✓ Actividad "${ev.title}" eliminada del sistema`
      await fetchAll()
      setTimeout(() => { actionMessage.value = null }, 3000)
    } else {
      alert('Error al eliminar la actividad')
    }
  }
}

// Formatear fechas
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
  <div class="admin-events-page">
    <div class="bg-glow"></div>

    <div class="container events-container">
      <!-- 1. Header / Navegación Superior -->
      <nav class="admin-nav">
        <NuxtLink to="/admins" class="btn-back">
          <span>←</span>
          <span>Volver al Panel General</span>
        </NuxtLink>

        <div class="admin-badge-top">
          <span class="shield-icon">🛡️</span>
          <span>Módulo de Moderación de Eventos</span>
        </div>
      </nav>

      <!-- Mensaje de confirmación temporal -->
      <transition name="fade">
        <div v-if="actionMessage" class="toast-success">
          {{ actionMessage }}
        </div>
      </transition>

      <!-- 2. Header Hero de Eventos -->
      <header class="events-hero">
        <div class="hero-left">
          <h1 class="page-title">Gestión y Moderación de <span class="text-gradient">Actividades</span></h1>
          <p class="page-subtitle">Supervisa todas las actividades publicadas en la comunidad, modera contenido inapropiado y gestiona cupos.</p>
        </div>

        <div class="hero-right-actions">
          <NuxtLink to="/managers/create" class="btn-create-admin">
            <span>+ Crear Actividad Oficial</span>
          </NuxtLink>
          <button class="btn-refresh" @click="fetchAll" title="Recargar lista">
            <span>🔄</span>
          </button>
        </div>
      </header>

      <!-- 3. KPIs de Actividades -->
      <section class="kpi-grid">
        <div class="kpi-card" @click="selectedStatus = 'all'" :class="{ active: selectedStatus === 'all' }">
          <div class="kpi-icon-wrap icon-indigo">📅</div>
          <div class="kpi-content">
            <span class="kpi-value">{{ totalEvents }}</span>
            <span class="kpi-label">Actividades Totales</span>
            <span class="kpi-sub">En toda la plataforma</span>
          </div>
        </div>

        <div class="kpi-card" @click="selectedStatus = 'published'" :class="{ active: selectedStatus === 'published' }">
          <div class="kpi-icon-wrap icon-emerald">🟢</div>
          <div class="kpi-content">
            <span class="kpi-value">{{ publishedCount }}</span>
            <span class="kpi-label">Publicadas</span>
            <span class="kpi-sub positive">Inscripciones abiertas</span>
          </div>
        </div>

        <div class="kpi-card" @click="selectedStatus = 'draft'" :class="{ active: selectedStatus === 'draft' }">
          <div class="kpi-icon-wrap icon-amber">📝</div>
          <div class="kpi-content">
            <span class="kpi-value">{{ draftCount }}</span>
            <span class="kpi-label">Borradores</span>
            <span class="kpi-sub">En preparación</span>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon-wrap icon-purple">👥</div>
          <div class="kpi-content">
            <span class="kpi-value">{{ totalAttendees }}</span>
            <span class="kpi-label">Inscripciones Globales</span>
            <span class="kpi-sub positive">Participantes acumulados</span>
          </div>
        </div>
      </section>

      <!-- 4. Barra de Búsqueda y Filtros -->
      <div class="toolbar-wrapper">
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input 
            v-model="searchQuery" 
            type="text" 
            class="search-input" 
            placeholder="Buscar por título, temática, organizador o lugar..."
          />
          <button v-if="searchQuery" class="clear-btn" @click="searchQuery = ''">✕</button>
        </div>

        <div class="filter-controls-row">
          <!-- Filtro Categoría -->
          <select v-model="selectedCategory" class="filter-select">
            <option value="all">🏷️ Todas las Categorías</option>
            <option v-for="cat in categories" :key="cat._id" :value="cat._id">
              {{ cat.name }}
            </option>
          </select>

          <!-- Filtro Estado -->
          <select v-model="selectedStatus" class="filter-select">
            <option value="all">⚡ Todos los Estados</option>
            <option value="published">🟢 Solo Publicadas</option>
            <option value="draft">📝 Solo Borradores</option>
          </select>
        </div>
      </div>

      <!-- 5. Tabla Principal de Actividades -->
      <section class="table-card">
        <div class="table-card-header">
          <h2 class="table-title">Actividades en la Plataforma ({{ filteredEvents.length }})</h2>
          <span class="table-hint">Como Administrador puedes moderar o eliminar cualquier actividad del sistema.</span>
        </div>

        <!-- Estado de Carga -->
        <div v-if="loading && events.length === 0" class="loading-state">
          <span class="spinner">⏳</span>
          <p>Cargando actividades de MongoDB...</p>
        </div>

        <!-- Tabla -->
        <div v-else-if="filteredEvents.length > 0" class="table-wrapper">
          <table class="events-table">
            <thead>
              <tr>
                <th>Actividad</th>
                <th>Organizador</th>
                <th>Fecha & Lugar</th>
                <th>Ocupación</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="ev in filteredEvents" :key="ev._id">
                <td class="col-main">
                  <div class="event-title-cell">
                    <strong class="event-name">{{ ev.title }}</strong>
                    <span class="badge-cat">{{ ev.category?.name || 'Comunidad' }}</span>
                  </div>
                </td>

                <td class="col-org">
                  <div class="org-cell">
                    <span class="org-icon">👤</span>
                    <span class="org-name">{{ ev.organizer?.name || 'Comunidad' }}</span>
                  </div>
                </td>

                <td class="col-date">
                  <div class="date-loc-cell">
                    <span class="date-val">📅 {{ formatDate(ev.startDate) }}</span>
                    <span class="loc-val">📍 {{ ev.location }}</span>
                  </div>
                </td>

                <td class="col-capacity">
                  <div class="capacity-mini-cell">
                    <span class="cap-text">{{ ev.registeredCount || 0 }} / {{ ev.capacity }}</span>
                    <div class="cap-bar-track">
                      <div 
                        class="cap-bar-fill"
                        :style="{ width: `${Math.min(100, Math.round(((ev.registeredCount || 0) / (ev.capacity || 1)) * 100))}%` }"
                      ></div>
                    </div>
                  </div>
                </td>

                <td class="col-status">
                  <span 
                    class="status-pill"
                    :class="ev.status === 'published' ? 'pill-published' : 'pill-draft'"
                  >
                    {{ ev.status === 'published' ? '● Publicado' : '📝 Borrador' }}
                  </span>
                </td>

                <td class="col-actions">
                  <div class="action-buttons-group">
                    <NuxtLink :to="`/activities/${ev._id}`" class="btn-action-view" title="Ver ficha pública">
                      👁️
                    </NuxtLink>
                    <NuxtLink :to="`/managers/edit?id=${ev._id}`" class="btn-action-edit" title="Editar actividad">
                      ✏️
                    </NuxtLink>
                    <button 
                      class="btn-action-delete"
                      title="Eliminar permanentemente"
                      @click="handleDelete(ev)"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-else class="empty-state">
          <span class="empty-icon">🔍</span>
          <h3>No se encontraron actividades</h3>
          <p>No hay eventos que coincidan con los filtros seleccionados.</p>
          <button class="btn-clear-filters" @click="searchQuery = ''; selectedCategory = 'all'; selectedStatus = 'all'">
            Restablecer Filtros
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.admin-events-page {
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
  background: radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(244, 63, 94, 0.08) 50%, transparent 70%);
  filter: blur(80px);
  pointer-events: none;
  z-index: 0;
}

.events-container {
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
  background: rgba(99, 102, 241, 0.12);
  border: 1px solid rgba(99, 102, 241, 0.3);
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 700;
  color: #a5b4fc;
}

/* Toast */
.toast-success {
  background: rgba(52, 211, 153, 0.2);
  border: 1px solid rgba(52, 211, 153, 0.4);
  color: #34d399;
  padding: 0.75rem 1.25rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  font-weight: 600;
  backdrop-filter: blur(12px);
}

/* 2. Hero */
.events-hero {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 2rem;
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
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.page-subtitle {
  color: #94a3b8;
  font-size: 1rem;
  max-width: 650px;
}

.hero-right-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.btn-create-admin {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  color: white;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 700;
  padding: 0.65rem 1.25rem;
  border-radius: 10px;
  transition: all 0.2s;
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.35);
}

.btn-create-admin:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.45);
}

.btn-refresh {
  background: rgba(22, 30, 49, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #cbd5e1;
  font-size: 1rem;
  padding: 0.6rem 0.85rem;
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
  margin-bottom: 2rem;
}

.kpi-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(22, 30, 49, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 1.25rem;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(12px);
}

.kpi-card:hover, .kpi-card.active {
  border-color: rgba(99, 102, 241, 0.4);
  background: rgba(22, 30, 49, 0.95);
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
}

.kpi-card.active {
  border-color: #6366f1;
  box-shadow: 0 0 20px rgba(99, 102, 241, 0.2);
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
.icon-emerald { background: rgba(52, 211, 153, 0.15); color: #34d399; }
.icon-amber { background: rgba(251, 191, 36, 0.15); color: #fbbf24; }
.icon-purple { background: rgba(168, 85, 247, 0.15); color: #c084fc; }

.kpi-content {
  display: flex;
  flex-direction: column;
}

.kpi-value {
  font-size: 1.6rem;
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

/* 4. Toolbar */
.toolbar-wrapper {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.75rem;
  flex-wrap: wrap;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(22, 30, 49, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 0.65rem 1.25rem;
  flex: 1;
  min-width: 280px;
  transition: all 0.2s;
}

.search-box:focus-within {
  border-color: rgba(99, 102, 241, 0.5);
  box-shadow: 0 0 15px rgba(99, 102, 241, 0.2);
}

.search-icon {
  font-size: 1.1rem;
  color: #818cf8;
}

.search-input {
  background: transparent;
  border: none;
  color: #f8fafc;
  font-size: 0.95rem;
  width: 100%;
  outline: none;
}

.clear-btn {
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 0.85rem;
  cursor: pointer;
}

.filter-controls-row {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.filter-select {
  background: rgba(22, 30, 49, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #cbd5e1;
  font-size: 0.875rem;
  padding: 0.65rem 1.25rem;
  border-radius: 12px;
  outline: none;
  cursor: pointer;
}

.filter-select option {
  background: #111827;
  color: #f8fafc;
}

/* 5. Tabla */
.table-card {
  background: rgba(22, 30, 49, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 1.75rem;
  backdrop-filter: blur(16px);
  box-shadow: 0 15px 35px -10px rgba(0, 0, 0, 0.5);
}

.table-card-header {
  margin-bottom: 1.5rem;
}

.table-title {
  font-size: 1.35rem;
  font-weight: 800;
  color: #f8fafc;
  margin-bottom: 0.25rem;
}

.table-hint {
  font-size: 0.85rem;
  color: #94a3b8;
}

.table-wrapper {
  overflow-x: auto;
}

.events-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.events-table th {
  padding: 0.85rem 1rem;
  background: rgba(11, 15, 25, 0.5);
  color: #94a3b8;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.events-table td {
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  font-size: 0.9rem;
}

.events-table tr:hover td {
  background: rgba(255, 255, 255, 0.02);
}

.event-title-cell {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.event-name {
  color: #f8fafc;
  font-weight: 700;
  font-size: 0.95rem;
}

.badge-cat {
  display: inline-block;
  width: fit-content;
  background: rgba(99, 102, 241, 0.15);
  color: #a5b4fc;
  font-size: 0.725rem;
  font-weight: 700;
  padding: 0.15rem 0.55rem;
  border-radius: 4px;
}

.org-cell {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: #cbd5e1;
  font-size: 0.875rem;
}

.date-loc-cell {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  font-size: 0.825rem;
  color: #94a3b8;
}

.capacity-mini-cell {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.cap-text {
  font-size: 0.8rem;
  font-weight: 700;
  color: #f8fafc;
}

.cap-bar-track {
  width: 90px;
  height: 5px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 999px;
  overflow: hidden;
}

.cap-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #6366f1 0%, #a855f7 100%);
  border-radius: 999px;
}

.status-pill {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 0.65rem;
  border-radius: 999px;
}

.pill-published {
  background: rgba(52, 211, 153, 0.15);
  color: #34d399;
  border: 1px solid rgba(52, 211, 153, 0.3);
}

.pill-draft {
  background: rgba(148, 163, 184, 0.15);
  color: #94a3b8;
  border: 1px solid rgba(148, 163, 184, 0.3);
}

.action-buttons-group {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.btn-action-view, .btn-action-edit, .btn-action-delete {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-action-view {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #cbd5e1;
}

.btn-action-view:hover {
  background: rgba(255, 255, 255, 0.15);
  color: white;
}

.btn-action-edit {
  background: rgba(99, 102, 241, 0.15);
  border: 1px solid rgba(99, 102, 241, 0.3);
  color: #a5b4fc;
}

.btn-action-edit:hover {
  background: #6366f1;
  color: white;
}

.btn-action-delete {
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #f87171;
}

.btn-action-delete:hover {
  background: rgba(239, 68, 68, 0.25);
  color: #fca5a5;
}

.empty-state, .loading-state {
  text-align: center;
  padding: 3.5rem 1rem;
  color: #94a3b8;
}

.empty-icon, .spinner {
  font-size: 2.5rem;
  display: block;
  margin-bottom: 1rem;
}

.btn-clear-filters {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  margin-top: 1rem;
  cursor: pointer;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
