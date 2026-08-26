<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'

definePageMeta({
  middleware: 'auth'
})

const { createEvent, getCategories, loading, error } = useEvents()

const categories = ref<any[]>([])

const form = reactive({
    title: '', 
    description: '', 
    category: '', 
    location: '', 
    startDate: '', 
    endDate: '', 
    capacity: 50, 
    status: 'published',
    image: ''
})

const handleImageChange = (e: any) => {
  const file = e.target.files?.[0]
  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen no debe superar los 5MB')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      form.image = reader.result as string
    }
    reader.readAsDataURL(file)
  }
}

onMounted(async () => {
    const res = await getCategories()
    if (res.ok) {
        categories.value = res.data
    }
})

const handleCreateEvent = async() => {
    const result = await createEvent({
        title: form.title,
        description: form.description,
        category: form.category,
        location: form.location,
        startDate: form.startDate,
        endDate: form.endDate,
        capacity: Number(form.capacity),
        status: form.status || 'published',
        image: form.image
    })

    if(result.ok) {
        navigateTo('/managers')
    }
}
</script>

<template>
  <div class="create-event-page">
    <!-- Luz ambiental de fondo -->
    <div class="bg-glow"></div>

    <div class="container create-container">
      <!-- Navegación de retorno -->
      <div class="back-nav">
        <NuxtLink to="/managers" class="back-link">
          <span>←</span> Volver al Panel de Organizador
        </NuxtLink>
      </div>

      <div class="form-card">
        <!-- Encabezado -->
        <header class="card-header">
          <div class="badge-create">
            <span>✨ Nueva Publicación</span>
          </div>
          <h1 class="card-title">Crear Nueva Actividad Comunitaria</h1>
          <p class="card-subtitle">
            Completa la información para publicar un taller, evento o iniciativa en la plataforma.
          </p>
        </header>

        <!-- Formulario -->
        <form class="event-form" @submit.prevent="handleCreateEvent">
          <!-- Sección 1: Información General -->
          <fieldset class="form-section">
            <legend class="section-legend">1. Información Principal</legend>

            <!-- Título -->
            <div class="form-group">
              <label class="form-label" for="title">Título de la actividad *</label>
              <div class="input-wrapper">
                <span class="input-icon">🎯</span>
                <input
                  id="title"
                  type="text"
                  class="form-input"
                  placeholder="Ej. Workshop de Nuxt 4 & Vue 3 Full-Stack"
                  v-model="form.title"
                  required
                />
              </div>
            </div>

            <!-- Categoría Dinámica -->
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
                v-model="form.description"
                id="description"
                rows="4"
                class="form-input form-textarea"
                placeholder="Explica de qué trata la actividad, qué aprenderán los asistentes y qué deben traer..."
              ></textarea>
            </div>

            <!-- Imagen / Banner del Evento -->
            <div class="form-group">
              <label class="form-label" for="event-image">Imagen de la actividad (Opcional)</label>
              <div style="display: flex; gap: 1rem; align-items: center; margin-top: 0.5rem;">
                <div v-if="form.image" style="width: 100px; height: 60px; border-radius: 8px; overflow: hidden; border: 1px solid #38bdf8; flex-shrink: 0;">
                  <img :src="form.image" alt="Preview" style="width: 100%; height: 100%; object-fit: cover;" />
                </div>
                <div style="flex: 1;">
                  <input
                    id="event-image"
                    type="file"
                    accept="image/*"
                    class="form-input"
                    style="padding: 0.4rem; font-size: 0.85rem;"
                    @change="handleImageChange"
                  />
                  <small style="color: #94a3b8; font-size: 0.75rem; display: block; margin-top: 0.25rem;">
                    Sube una foto o banner para ilustrar tu actividad (PNG, JPG o WebP)
                  </small>
                </div>
              </div>
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
                    v-model="form.startDate"
                    id="startDate"
                    type="datetime-local"
                    class="form-input"
                  />
                </div>
              </div>

              <!-- Fecha de Fin -->
              <div class="form-group">
                <label class="form-label" for="endDate">Fecha y hora de finalización *</label>
                <div class="input-wrapper">
                  <span class="input-icon">⏰</span>
                  <input
                    v-model="form.endDate"
                    id="endDate"
                    type="datetime-local"
                    class="form-input"
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
                  v-model="form.location"
                  id="location"
                  type="text"
                  class="form-input"
                  placeholder="Ej. Auditorio Central / Google Meet"
                />
              </div>
            </div>
          </fieldset>

          <!-- Sección 3: Capacidad y Estado -->
          <fieldset class="form-section">
            <legend class="section-legend">3. Cupo y Publicación</legend>

            <div class="grid-two-cols">
              <!-- Capacidad -->
              <div class="form-group">
                <label class="form-label" for="capacity">Capacidad máxima (Cupos) *</label>
                <div class="input-wrapper">
                  <span class="input-icon">👥</span>
                  <input
                    v-model="form.capacity"
                    id="capacity"
                    type="number"
                    min="1"
                    max="10000"
                    class="form-input"
                    placeholder="Ej. 50"
                  />
                </div>
              </div>

              <!-- Estado Inicial -->
              <div class="form-group">
                <label class="form-label" for="status">Estado inicial de la actividad</label>
                <div class="input-wrapper">
                  <span class="input-icon">⚡</span>
                  <select id="status" class="form-input form-select" v-model="form.status">
                    <option value="published">🚀 Publicar inmediatamente</option>
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
            <button type="submit" class="btn-submit-event" :disabled="loading">
              <span v-if="loading">Publicando Actividad... ⏳</span>
              <span v-else>Publicar Actividad →</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.create-event-page {
  position: relative;
  min-height: calc(100vh - 72px);
  padding: 2.5rem 1.5rem 5rem;
}

/* Efecto de luz difuminada */
.bg-glow {
  position: absolute;
  top: 5%;
  left: 50%;
  transform: translateX(-50%);
  width: 700px;
  height: 450px;
  background: radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, rgba(99, 102, 241, 0.1) 40%, transparent 70%);
  filter: blur(70px);
  pointer-events: none;
  z-index: 0;
}

.create-container {
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

.badge-create {
  display: inline-flex;
  background: rgba(168, 85, 247, 0.15);
  border: 1px solid rgba(168, 85, 247, 0.3);
  padding: 0.3rem 0.85rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 700;
  color: #d8b4fe;
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
  color: #c084fc;
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
  border-color: #a855f7;
  box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.2);
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

.btn-submit-event {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #a855f7 0%, #6366f1 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 0.85rem 1.75rem;
  font-family: inherit;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(168, 85, 247, 0.35);
  transition: all 0.2s ease;
}

.btn-submit-event:hover {
  opacity: 0.95;
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(168, 85, 247, 0.45);
}

.btn-submit-event:disabled {
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
