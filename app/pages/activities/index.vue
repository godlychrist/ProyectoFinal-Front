<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'

const { logout } = useAuth()
const { getEvents, getFilteredEvents, loading, error, getCategories } = useEvents()

const categories = ref<any[]>([])
const events = ref<any[]>([])
const allOrganizers = ref<any[]>([])

// Variables de filtros
const searchQuery = ref('')
const selectedCategory = ref('all')
const sortBy = ref('date-asc')
const selectedDate = ref('')         
const selectedAvailability = ref('all') 
const selectedOrganizer = ref('all')

const organizers = computed(() => allOrganizers.value)

// Función para solicitar al Backend los eventos filtrados
let searchTimeout: any = null

const applyBackendFilters = async () => {
  const res = await getFilteredEvents({
    category: selectedCategory.value,
    organizer: selectedOrganizer.value,
    search: searchQuery.value,
    date: selectedDate.value,
    available: selectedAvailability.value
  })

  if (res.ok) {
    events.value = res.data
  }
}

// Escuchar cambios en los selectores para llamar al backend
watch([selectedCategory, selectedOrganizer, selectedDate, selectedAvailability], () => {
  applyBackendFilters()
})

// Debounce para la búsqueda de texto hacia el backend
watch(searchQuery, () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    applyBackendFilters()
  }, 350)
})

// Ordenamiento sobre los datos devueltos por el backend
const displayedEvents = computed(() => {
  let list = [...events.value]

  if (sortBy.value === 'date-asc') {
    list.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
  } else if (sortBy.value === 'newest') {
    list.sort((a, b) => new Date(b.createdAt || b.startDate).getTime() - new Date(a.createdAt || a.startDate).getTime())
  } else if (sortBy.value === 'capacity') {
    list.sort((a, b) => (b.capacity || 0) - (a.capacity || 0))
  }

  return list
})

onMounted(async () => {
  const [eventsRes, catsRes] = await Promise.all([
    getEvents(),
    getCategories()
  ])

  if (eventsRes.ok) {
    events.value = eventsRes.data
    // Extraer lista de organizadores disponibles
    const map = new Map<string, string>()
    eventsRes.data.forEach((e: any) => {
      if (e.organizer?._id && e.organizer?.name) {
        map.set(e.organizer._id, e.organizer.name)
      }
    })
    allOrganizers.value = Array.from(map.entries()).map(([id, name]) => ({ id, name }))
  }

  if (catsRes.ok) categories.value = catsRes.data
})

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
  <div class="catalog-page">
    <!-- Luz ambiental de fondo -->
    <div class="bg-glow"></div>

    <div class="container catalog-container">
      <!-- 1. Header / Hero del Catálogo -->
      <header class="catalog-hero">
        <div class="hero-badge">
          <span class="badge-icon">🌐</span>
          <span>Catálogo Público de la Comunidad</span>
        </div>
        <h1 class="hero-title">
          Explora y Participa en <span class="text-gradient">Actividades Increíbles</span>
        </h1>
        <p class="hero-subtitle">
          Descubre talleres de tecnología, iniciativas de voluntariado, eventos deportivos y cultura organizados por miembros de la comunidad.
        </p>

        <!-- Barra de Búsqueda y Filtros Premium -->
        <div class="search-filter-wrapper">
          <!-- 1. Fila Superior: Buscador Principal -->
          <div class="search-input-box">
            <span class="search-icon">🔍</span>
            <input 
              v-model="searchQuery"
              type="text" 
              class="search-input" 
              placeholder="Buscar por título, temática, lugar o palabras clave..."
            />
            <button v-if="searchQuery" class="btn-clear" @click="searchQuery = ''">✕</button>
          </div>

          <!-- 2. Fila Inferior: Barra de Herramientas de Filtros -->
          <div class="filter-controls-bar">
            <!-- Filtro Fecha -->
            <div class="filter-group">
              <span class="filter-group-icon">📅</span>
              <input 
                v-model="selectedDate" 
                type="date" 
                class="filter-select-custom date-input"
                title="Filtrar por fecha específica"
              />
            </div>

            <!-- Filtro Disponibilidad -->
            <div class="filter-group">
              <span class="filter-group-icon">🎟️</span>
              <select v-model="selectedAvailability" class="filter-select-custom">
                <option value="all">Todos los Cupos</option>
                <option value="available">🟢 Solo Disponibles</option>
                <option value="full">🔴 Cupos Agotados</option>
              </select>
            </div>

            <!-- Filtro Organizador -->
            <div class="filter-group">
              <span class="filter-group-icon">👤</span>
              <select v-model="selectedOrganizer" class="filter-select-custom">
                <option value="all">Todos los Organizadores</option>
                <option v-for="org in organizers" :key="org.id" :value="org.id">
                  {{ org.name }}
                </option>
              </select>
            </div>

            <!-- Ordenar por -->
            <div class="filter-group">
              <span class="filter-group-icon">📊</span>
              <select v-model="sortBy" class="filter-select-custom">
                <option value="date-asc">Próximos a iniciar</option>
                <option value="newest">Más recientes</option>
                <option value="capacity">Mayor capacidad</option>
              </select>
            </div>

            <!-- Botón Limpiar Filtros -->
            <button 
              v-if="searchQuery || selectedCategory !== 'all' || selectedDate || selectedAvailability !== 'all' || selectedOrganizer !== 'all'"
              class="btn-reset-filters-inline"
              @click="searchQuery = ''; selectedCategory = 'all'; selectedDate = ''; selectedAvailability = 'all'; selectedOrganizer = 'all'"
              title="Restablecer todos los filtros"
            >
              <span>↺</span>
              <span>Limpiar Filtros</span>
            </button>
          </div>
        </div>

        <!-- Chips de Categorías Rápidas -->
        <div class="category-chips-row">
          <button
          :class="['chip-item', { active: selectedCategory === 'all' }]"
          @click="selectedCategory = 'all'"
          >
          ✨ Todos ({{ events.length }})
          </button>
          <button 
            v-for="cat in categories" 
            :key="cat._id"
            :class="['chip-item', { active: selectedCategory === cat._id }]"
            @click="selectedCategory = cat._id"
          >
            {{ cat.name }}
          </button>
        </div>
      </header>

      <!-- 2. Grid de Actividades -->
      <section class="events-grid-section">
        <div class="section-meta-row">
          <span class="results-count">Mostrando <strong>{{ displayedEvents.length }} actividades disponibles</strong></span>
          <span class="live-indicator">● Actualizado en tiempo real</span>
        </div>

        <div v-if="displayedEvents.length > 0" class="catalog-grid">
          <article v-for="ev in displayedEvents" :key="ev._id" class="catalog-card">
              <div class="card-glow-bar"></div>
              <div v-if="ev.image" class="card-img-banner" style="height: 140px; overflow: hidden; border-radius: 12px 12px 0 0; margin: 0 0 0.5rem 0;">
                <img :src="ev.image" :alt="ev.title" style="width: 100%; height: 100%; object-fit: cover;" />
              </div>
              <div class="card-content">

                <div class="card-top">
                  <span class="card-category cat-tech">{{ ev.category?.name || 'Comunidad' }}</span>
                  <span 
                    class="card-status-badge"
                    :class="(ev.registeredCount || 0) >= ev.capacity ? 'badge-full' : 'badge-open'"
                  >
                    {{ (ev.registeredCount || 0) >= ev.capacity ? '🔴 Cupos Agotados' : '🟢 Cupos Abiertos' }}
                  </span>
                </div>

                <h3 class="card-title">{{ ev.title }}</h3>
                <p class="card-description">{{ ev.description }}</p>

                <!-- Datos del Evento -->
                <div class="card-info-list">
                  <div class="info-row">
                    <span class="info-icon">📅</span>
                    <span>{{ formatDate(ev.startDate) }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-icon">📍</span>
                    <span>{{ ev.location }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-icon">👤</span>
                    <span>Organiza: {{ ev.organizer?.name || 'Comunidad' }}</span>
                  </div>
                </div>

                <!-- Barra de Cupos / Capacidad en la Tarjeta -->
                <div class="card-capacity-box">
                  <div class="card-capacity-labels">
                    <span>Cupos</span>
                    <strong>{{ ev.registeredCount || 0 }} / {{ ev.capacity }} inscritos</strong>
                  </div>
                  <div class="card-capacity-track">
                    <div 
                      class="card-capacity-fill"
                      :style="{ width: `${Math.min(100, Math.round(((ev.registeredCount || 0) / (ev.capacity || 1)) * 100))}%` }"
                    ></div>
                  </div>
                </div>

                <div class="card-actions">
                  <NuxtLink :to="`/activities/${ev._id}`" class="btn-card-details">
                    Ver Detalles →
                  </NuxtLink>
                </div>

              </div>
          </article>
        </div>
        <div v-else class="empty-state">
          <p>No se encontraron actividades disponibles.</p>
        </div>

      </section>   
        
        </div>
    </div>
</template>

<style scoped>
.catalog-page {
  position: relative;
  min-height: calc(100vh - 72px);
  padding: 3rem 0 6rem;
}

/* Efecto de luz ambiental */
.bg-glow {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 800px;
  height: 400px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.18) 0%, rgba(168, 85, 247, 0.08) 45%, transparent 70%);
  filter: blur(70px);
  pointer-events: none;
  z-index: 0;
}

.catalog-container {
  position: relative;
  z-index: 1;
}

/* 1. Hero del Catálogo */
.catalog-hero {
  text-align: center;
  max-width: 860px;
  margin: 0 auto 3.5rem;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 1rem;
  background: rgba(99, 102, 241, 0.12);
  border: 1px solid rgba(99, 102, 241, 0.3);
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #a5b4fc;
  margin-bottom: 1.5rem;
}

.hero-title {
  font-size: 2.75rem;
  font-weight: 800;
  line-height: 1.2;
  color: #f8fafc;
  margin-bottom: 1rem;
}

.hero-subtitle {
  font-size: 1.1rem;
  color: #94a3b8;
  line-height: 1.6;
  margin-bottom: 2.2rem;
}

/* Barra de Búsqueda y Filtros Premium */
.search-filter-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: rgba(22, 30, 49, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 1.25rem;
  backdrop-filter: blur(20px);
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.5), 0 0 20px -5px rgba(99, 102, 241, 0.15);
  margin-bottom: 1.75rem;
}

.search-input-box {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  background: rgba(11, 15, 25, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 0.85rem 1.25rem;
  transition: all 0.2s ease;
}

.search-input-box:focus-within {
  border-color: rgba(99, 102, 241, 0.5);
  box-shadow: 0 0 15px rgba(99, 102, 241, 0.25);
  background: rgba(11, 15, 25, 0.85);
}

.search-icon {
  font-size: 1.2rem;
  color: #818cf8;
}

.search-input {
  width: 100%;
  background: transparent;
  border: none;
  color: #f8fafc;
  font-size: 1rem;
  outline: none;
}

.search-input::placeholder {
  color: #64748b;
}

/* Fila de Herramientas de Filtros */
.filter-controls-bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(11, 15, 25, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 0.4rem 0.75rem;
  transition: all 0.2s ease;
  flex: 1;
  min-width: 160px;
}

.filter-group:hover, .filter-group:focus-within {
  border-color: rgba(99, 102, 241, 0.4);
  background: rgba(11, 15, 25, 0.85);
}

.filter-group-icon {
  font-size: 1rem;
  flex-shrink: 0;
}

.filter-select-custom {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background: transparent;
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
  color: #cbd5e1;
  font-size: 0.875rem;
  font-weight: 500;
  width: 100%;
  cursor: pointer;
  padding: 0.4rem 1.6rem 0.4rem 0.25rem;
  /* Flechita SVG sutil moderna en vez del feo borde nativo */
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.2rem center;
}

.filter-select-custom:focus {
  outline: none !important;
  border: none !important;
  box-shadow: none !important;
}

.filter-select-custom option {
  background: #111827;
  color: #f8fafc;
  padding: 0.5rem;
}

.date-input {
  background-image: none !important;
  padding-right: 0.25rem !important;
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
  color-scheme: dark;
}

.date-input::-webkit-calendar-picker-indicator {
  filter: invert(0.8);
  opacity: 0.7;
  cursor: pointer;
}

/* Fila de Chips de Categorías */
.category-chips-row {
  display: flex;
  justify-content: center;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.chip-item {
  background: rgba(22, 30, 49, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #94a3b8;
  font-size: 0.85rem;
  font-weight: 600;
  padding: 0.5rem 1.1rem;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.chip-item:hover {
  background: rgba(99, 102, 241, 0.15);
  color: #cbd5e1;
  border-color: rgba(99, 102, 241, 0.3);
  transform: translateY(-1px);
}

.chip-item.active {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(168, 85, 247, 0.25) 100%);
  border-color: rgba(99, 102, 241, 0.6);
  color: #f8fafc;
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.2);
}

/* 2. Grid de Actividades */
.events-grid-section {
  margin-top: 2rem;
}

.section-meta-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  color: #94a3b8;
}

.section-meta-row strong {
  color: #f8fafc;
}

.live-indicator {
  color: #34d399;
  font-size: 0.8rem;
  font-weight: 600;
}

.catalog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 1.75rem;
}

/* Tarjeta del Catálogo */
.catalog-card {
  position: relative;
  background: rgba(22, 30, 49, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  overflow: hidden;
  backdrop-filter: blur(16px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
}

.catalog-card:hover {
  transform: translateY(-5px);
  border-color: rgba(99, 102, 241, 0.4);
  box-shadow: 0 20px 35px -10px rgba(0, 0, 0, 0.6), 0 0 25px -5px rgba(99, 102, 241, 0.2);
}

.card-glow-bar {
  height: 4px;
  background: linear-gradient(90deg, #6366f1 0%, #a855f7 50%, #ec4899 100%);
}

.card-content {
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.card-category {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.cat-tech { background: rgba(99, 102, 241, 0.15); color: #a5b4fc; border: 1px solid rgba(99, 102, 241, 0.3); }
.cat-social { background: rgba(20, 184, 166, 0.15); color: #5eead4; border: 1px solid rgba(20, 184, 166, 0.3); }
.cat-edu { background: rgba(245, 158, 11, 0.15); color: #fcd34d; border: 1px solid rgba(245, 158, 11, 0.3); }

.card-status-badge {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
}

.badge-open {
  background: rgba(16, 185, 129, 0.12);
  color: #34d399;
}

.badge-full {
  background: rgba(239, 68, 68, 0.15);
  color: #f87171;
}

.card-capacity-box {
  background: rgba(11, 15, 25, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 0.6rem 0.85rem;
  margin-bottom: 1.25rem;
}

.card-capacity-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.775rem;
  color: #94a3b8;
  margin-bottom: 0.35rem;
}

.card-capacity-labels strong {
  color: #f8fafc;
}

.card-capacity-track {
  height: 5px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 999px;
  overflow: hidden;
}

.card-capacity-fill {
  height: 100%;
  background: linear-gradient(90deg, #6366f1 0%, #a855f7 100%);
  border-radius: 999px;
  transition: width 0.3s ease;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 800;
  color: #f8fafc;
  margin-bottom: 0.6rem;
  line-height: 1.35;
}

.card-description {
  font-size: 0.875rem;
  color: #94a3b8;
  line-height: 1.55;
  margin-bottom: 1.25rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
}

.card-info-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #cbd5e1;
}

.info-icon {
  font-size: 0.95rem;
}

.organizer-row strong {
  color: #f8fafc;
}

/* Bloque de Capacidad */
.capacity-block {
  margin-bottom: 1.5rem;
  background: rgba(11, 15, 25, 0.4);
  padding: 0.75rem 1rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.capacity-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #94a3b8;
  margin-bottom: 0.4rem;
}

.capacity-labels strong {
  color: #f8fafc;
}

.capacity-bar-track {
  height: 6px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 999px;
  overflow: hidden;
}

.capacity-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #6366f1 0%, #a855f7 100%);
  border-radius: 999px;
  transition: width 0.3s ease;
}

.capacity-bar-fill.fill-warn {
  background: linear-gradient(90deg, #f59e0b 0%, #ef4444 100%);
}

/* Botones de Acción */
.card-actions {
  display: flex;
  gap: 0.75rem;
}

.btn-card-details {
  flex: 1;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #cbd5e1;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.65rem 1rem;
  border-radius: 10px;
  text-align: center;
  transition: all 0.2s;
}

.btn-card-details:hover {
  background: rgba(255, 255, 255, 0.12);
  color: white;
  border-color: rgba(255, 255, 255, 0.25);
  transform: translateY(-1px);
}

.btn-card-register {
  flex: 1;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border: none;
  color: white;
  font-size: 0.875rem;
  font-weight: 700;
  padding: 0.65rem 1rem;
  border-radius: 10px;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.35);
  transition: all 0.2s;
}

.btn-card-register:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.55);
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

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.15rem;
  }
  .search-filter-wrapper {
    flex-direction: column;
  }
  .filter-controls {
    width: 100%;
  }
  .filter-select {
    flex: 1;
  }
}

/* Botoncito '✕' para limpiar el texto del buscador */
.btn-clear {
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-clear:hover {
  background: rgba(239, 68, 68, 0.15);
  color: #f87171;
}

/* Botón '↺ Limpiar' filtros activos en la barra */
.btn-reset-filters-inline {
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #f87171;
  font-size: 0.85rem;
  font-weight: 700;
  padding: 0.65rem 1rem;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-reset-filters-inline:hover {
  background: rgba(239, 68, 68, 0.25);
  border-color: rgba(239, 68, 68, 0.5);
  color: #fca5a5;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
}

/* Estilo para el selector de Fecha en modo oscuro */
.date-input {
  color-scheme: dark;
  font-family: inherit;
}

</style>
