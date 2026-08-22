<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'

// 1. Traemos la ruta actual y las funciones del composable
const route = useRoute()
const { getEventById, updateEvent, getCategories, loading, error } = useEvents()

// 2. Leemos el ID que viene en la URL (ej: /managers/edit?id=66c5a...)
const eventId = route.query.id as string

const categories = ref<any[]>([])

const form = reactive({
    title: '',
    description: '',
    category: '',
    location: '',
    startDate: '',
    endDate: '',
    capacity: 50,
    status: 'published'
})

// Cargamos categorías y los datos actuales del evento
onMounted(async () => {
    // A) Cargamos categorías
    const catRes = await getCategories()
    if (catRes.ok) categories.value = catRes.data

    // B) Cargamos el evento actual por su ID si existe
    if (eventId) {
        const res = await getEventById(eventId)
        if (res.ok && res.data) {
            const ev = res.data
            form.title = ev.title
            form.description = ev.description
            form.category = ev.category?._id || ev.category
            form.location = ev.location
            form.capacity = ev.capacity
            form.status = ev.status
            
            // Formateamos las fechas al formato de datetime-local (YYYY-MM-DDTHH:mm):
            if (ev.startDate) form.startDate = new Date(ev.startDate).toISOString().slice(0, 16)
            if (ev.endDate) form.endDate = new Date(ev.endDate).toISOString().slice(0, 16)
        }
    }
})

const handleUpdateEvent = async () => {
    const result = await updateEvent(eventId, {
        title: form.title,
        description: form.description,
        category: form.category,
        location: form.location,
        startDate: form.startDate,
        endDate: form.endDate,
        capacity: Number(form.capacity),
        status: form.status
    })

    if (result.ok) {
        navigateTo('/managers') // 👈 Vuelve al panel
    }
}
</script>


<template>
  <div class="edit-event-page">
    <!-- Luz ambiental de fondo -->
    <div class="bg-glow"></div>

    <div class="container edit-container">
      <!-- Navegación de retorno -->
      <div class="back-nav">
        <NuxtLink to="/managers" class="back-link">
          <span>←</span> Volver al Panel de Organizador
        </NuxtLink>
      </div>

      <div class="form-card">
        <!-- Encabezado de Edición -->
        <header class="card-header">
          <div class="badge-edit">
            <span>✏️ Modo Edición</span>
          </div>
          <h1 class="card-title">Editar Actividad Comunitaria</h1>
          <p class="card-subtitle">
            Modifica la información, fechas o capacidad de tu evento publicado.
          </p>
        </header>

        <!-- Formulario -->
        <form class="event-form" @submit.prevent="handleUpdateEvent">
          <!-- Sección 1: Información General -->
          <fieldset class="form-section">
            <legend class="section-legend">1. Información Principal</legend>

            <!-- Título -->
            <div class="form-group">
              <label class="form-label" for="title">Título de la actividad *</label>
              <div class="input-wrapper">
                <span class="input-icon">🎯</span>
                <input
                  v-model="form.title"
                  id="title"
                  type="text"
                  class="form-input"
                  placeholder="Ej. Workshop de Nuxt 4 & Vue 3 Full-Stack"
                  required
                />
              </div>
            </div>

            <!-- Categoría -->
            <div class="form-group">
              <label class="form-label" for="category">Categoría *</label>
              <div class="input-wrapper">
                <span class="input-icon">🏷️</span>
                <select id="category" class="form-input form-select" v-model="form.category" required>
                  <option value="" disabled selected>Selecciona una categoría</option>
                  <option v-for="cat in categories" :key="cat._id" :value="cat._id">
                    {{ cat.name }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Descripción -->
            <div class="form-group">
              <label class="form-label" for="description">Descripción detallada *</label>
              <textarea
                id="description"
                rows="4"
                class="form-input form-textarea"
                placeholder="Modifica el detalle de la actividad..."
                v-model="form.description"
                required
              ></textarea>
            </div>
          </fieldset>

          <!-- Sección 2: Fechas y Ubicación -->
          <fieldset class="form-section">
            <legend class="section-legend">2. Horarios y Locación</legend>

            <div class="grid-two-cols">
              <!-- Fecha de Inicio -->
              <div class="form-group">
                <label class="form-label" for="startDate">Fecha y hora de inicio *</label>
                <div class="input-wrapper">
                  <span class="input-icon">📅</span>
                  <input
                    id="startDate"
                    type="datetime-local"
                    class="form-input"
                    v-model="form.startDate"
                    required
                  />
                </div>
              </div>

              <!-- Fecha de Fin -->
              <div class="form-group">
                <label class="form-label" for="endDate">Fecha y hora de finalización *</label>
                <div class="input-wrapper">
                  <span class="input-icon">⏰</span>
                  <input
                    id="endDate"
                    type="datetime-local"
                    class="form-input"
                    v-model="form.endDate"
                    required
                  />
                </div>
              </div>
            </div>

            <!-- Ubicación -->
            <div class="form-group">
              <label class="form-label" for="location">Ubicación o enlace virtual *</label>
              <div class="input-wrapper">
                <span class="input-icon">📍</span>
                <input
                  id="location"
                  type="text"
                  class="form-input"
                  placeholder="Ej. Auditorio Central / Google Meet"
                  v-model="form.location"
                  required
                />
              </div>
            </div>
          </fieldset>

          <!-- Sección 3: Cupo y Publicación -->
          <fieldset class="form-section">
            <legend class="section-legend">3. Cupo y Publicación</legend>

            <div class="grid-two-cols">
              <!-- Capacidad -->
              <div class="form-group">
                <label class="form-label" for="capacity">Capacidad máxima (Cupos) *</label>
                <div class="input-wrapper">
                  <span class="input-icon">👥</span>
                  <input
                    id="capacity"
                    type="number"
                    min="1"
                    max="10000"
                    class="form-input"
                    placeholder="50"
                    v-model="form.capacity"
                    required
                  />
                </div>
              </div>

              <!-- Estado -->
              <div class="form-group">
                <label class="form-label" for="status">Estado de la actividad</label>
                <div class="input-wrapper">
                  <span class="input-icon">⚡</span>
                  <select id="status" class="form-input form-select" v-model="form.status">
                    <option value="published">🚀 Publicada</option>
                    <option value="draft">📝 Guardar como borrador</option>
                  </select>
                </div>
              </div>
            </div>
          </fieldset>

          <!-- Alerta de Error -->
          <div v-if="error" class="alert-error">
            ⚠️ {{ error }}
          </div>

          <!-- Botones de Acción -->
          <div class="form-actions">
            <NuxtLink to="/managers" class="btn-cancel-link">
              Cancelar
            </NuxtLink>
            <button type="submit" class="btn-save-event" :disabled="loading">
              <span v-if="loading">Guardando cambios... ⏳</span>
              <span v-else>Guardar Cambios ✓</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.edit-event-page {
  position: relative;
  min-height: calc(100vh - 72px);
  padding: 2.5rem 1.5rem 5rem;
}

/* Luz ambiental */
.bg-glow {
  position: absolute;
  top: 5%;
  left: 50%;
  transform: translateX(-50%);
  width: 700px;
  height: 450px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.1) 40%, transparent 70%);
  filter: blur(70px);
  pointer-events: none;
  z-index: 0;
}

.edit-container {
  position: relative;
  z-index: 1;
  max-width: 760px;
}

/* Back navigation */
.back-nav {
  margin-bottom: 1.5rem;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #94a3b8;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 600;
  transition: color 0.2s;
}

.back-link:hover {
  color: #a5b4fc;
}

/* Form Card */
.form-card {
  background: rgba(22, 30, 49, 0.85);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 2.5rem 3rem;
  box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.6);
}

.card-header {
  margin-bottom: 2.25rem;
  text-align: center;
}

.badge-edit {
  display: inline-flex;
  background: rgba(99, 102, 241, 0.15);
  border: 1px solid rgba(99, 102, 241, 0.3);
  padding: 0.3rem 0.85rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 700;
  color: #a5b4fc;
  margin-bottom: 0.75rem;
}

.card-title {
  font-size: 1.85rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: #f8fafc;
  margin-bottom: 0.5rem;
}

.card-subtitle {
  color: #94a3b8;
  font-size: 0.95rem;
  max-width: 580px;
  margin: 0 auto;
}

/* Secciones del formulario */
.event-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-section {
  border: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding-top: 1.5rem;
}

.section-legend {
  font-size: 0.95rem;
  font-weight: 800;
  color: #818cf8;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 0.5rem;
}

.grid-two-cols {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #cbd5e1;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 1rem;
  font-size: 1rem;
  pointer-events: none;
  opacity: 0.7;
}

.form-input {
  width: 100%;
  background: rgba(11, 15, 25, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 0.75rem 1rem 0.75rem 2.75rem;
  color: #f8fafc;
  font-family: inherit;
  font-size: 0.95rem;
  outline: none;
  transition: all 0.2s ease;
}

.form-input:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
  background: rgba(11, 15, 25, 0.9);
}

.form-input::placeholder {
  color: #64748b;
  font-size: 0.9rem;
}

.form-select {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1.2em;
}

.form-select option {
  background: #0f172a;
  color: white;
}

.form-textarea {
  padding-left: 1rem;
  resize: vertical;
  min-height: 100px;
}

/* Botones de acción */
.form-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1.25rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding-top: 1.75rem;
}

.btn-cancel-link {
  color: #94a3b8;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
  transition: color 0.2s;
}

.btn-cancel-link:hover {
  color: #f8fafc;
}

.btn-save-event {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 0.85rem 1.75rem;
  font-family: inherit;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(99, 102, 241, 0.35);
  transition: all 0.2s ease;
}

.btn-save-event:hover {
  opacity: 0.95;
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(99, 102, 241, 0.45);
}

.btn-save-event:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Alerta de Error */
.alert-error {
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.35);
  color: #fca5a5;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 500;
  margin-top: 1rem;
  text-align: center;
}

@media (max-width: 640px) {
  .form-card {
    padding: 2rem 1.25rem;
  }
  .grid-two-cols {
    grid-template-columns: 1fr;
  }
}
</style>