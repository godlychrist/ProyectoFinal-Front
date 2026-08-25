<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

definePageMeta({
  middleware: 'auth'
})

const { getCategories, createCategory, updateCategory, deleteCategory, loading, error } = useEvents()

const categories = ref<any[]>([])
const searchQuery = ref('')
const isEditing = ref(false)
const editingId = ref<string | null>(null)
const formName = ref('')
const formDescription = ref('')
const actionMessage = ref<string | null>(null)
const formLoading = ref(false)

const fetchCategories = async () => {
  const res = await getCategories()
  if (res.ok) {
    categories.value = res.data
  }
}

onMounted(() => {
  fetchCategories()
})

// Filtrado de categorías
const filteredCategories = computed(() => {
  if (!searchQuery.value.trim()) return categories.value
  const q = searchQuery.value.toLowerCase().trim()
  return categories.value.filter(c =>
    c.name?.toLowerCase().includes(q) ||
    c.description?.toLowerCase().includes(q)
  )
})

// Iniciar edición
const startEdit = (cat: any) => {
  isEditing.value = true
  editingId.value = cat._id
  formName.value = cat.name
  formDescription.value = cat.description
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Cancelar edición
const cancelEdit = () => {
  isEditing.value = false
  editingId.value = null
  formName.value = ''
  formDescription.value = ''
}

// Guardar / Crear categoría
const handleSubmit = async () => {
  if (!formName.value.trim() || !formDescription.value.trim()) {
    alert('Por favor completa el nombre y la descripción de la categoría.')
    return
  }

  formLoading.value = true

  if (isEditing.value && editingId.value) {
    // Actualizar
    const res = await updateCategory(editingId.value, {
      name: formName.value.trim(),
      description: formDescription.value.trim()
    })

    if (res.ok) {
      actionMessage.value = `✓ Categoría "${formName.value}" actualizada correctamente`
      cancelEdit()
      await fetchCategories()
      setTimeout(() => { actionMessage.value = null }, 3000)
    } else {
      alert(error.value || 'Error al actualizar la categoría')
    }
  } else {
    // Crear nueva
    const res = await createCategory({
      name: formName.value.trim(),
      description: formDescription.value.trim()
    })

    if (res.ok) {
      actionMessage.value = `✓ Categoría "${formName.value}" creada exitosamente`
      formName.value = ''
      formDescription.value = ''
      await fetchCategories()
      setTimeout(() => { actionMessage.value = null }, 3000)
    } else {
      alert(error.value || 'Error al crear la categoría')
    }
  }

  formLoading.value = false
}

// Eliminar categoría
const handleDelete = async (cat: any) => {
  if (confirm(`¿Estás seguro de desactivar la categoría "${cat.name}"? Los organizadores ya no podrán clasificar nuevos eventos en ella.`)) {
    const res = await deleteCategory(cat._id)
    if (res.ok) {
      actionMessage.value = `✓ Categoría "${cat.name}" eliminada correctamente`
      await fetchCategories()
      setTimeout(() => { actionMessage.value = null }, 3000)
    } else {
      alert(error.value || 'Error al eliminar la categoría')
    }
  }
}
</script>

<template>
  <div class="admin-categories-page">
    <div class="bg-glow"></div>

    <div class="container categories-container">
      <!-- 1. Header / Navegación Superior -->
      <nav class="admin-nav">
        <NuxtLink to="/admins" class="btn-back">
          <span>←</span>
          <span>Volver al Panel General</span>
        </NuxtLink>

        <div class="admin-badge-top">
          <span class="shield-icon">🛡️</span>
          <span>Módulo de Taxonomía y Categorías</span>
        </div>
      </nav>

      <!-- Mensaje de confirmación temporal -->
      <transition name="fade">
        <div v-if="actionMessage" class="toast-success">
          {{ actionMessage }}
        </div>
      </transition>

      <!-- 2. Header Hero -->
      <header class="categories-hero">
        <div class="hero-left">
          <h1 class="page-title">Administrar <span class="text-gradient">Categorías</span></h1>
          <p class="page-subtitle">Crea, edita y organiza las categorías temáticas oficiales para clasificar todas las actividades de la plataforma.</p>
        </div>

        <button class="btn-refresh" @click="fetchCategories" title="Recargar lista">
          <span>🔄</span>
          <span>Actualizar</span>
        </button>
      </header>

      <!-- 3. Formulario para Crear / Editar Categoría -->
      <section class="form-card">
        <div class="form-header">
          <div class="form-title-group">
            <span class="form-icon">{{ isEditing ? '✏️' : '✨' }}</span>
            <h3>{{ isEditing ? 'Editar Categoría' : 'Nueva Categoría Oficial' }}</h3>
          </div>
          <span v-if="isEditing" class="editing-badge">Modo Edición Activo</span>
        </div>

        <form @submit.prevent="handleSubmit" class="category-form">
          <div class="form-grid">
            <div class="form-group">
              <label for="cat-name">Nombre de la Categoría *</label>
              <input 
                id="cat-name"
                v-model="formName" 
                type="text" 
                class="form-input" 
                placeholder="Ej. Tecnología e Innovación, Música, Deportes..."
                required
              />
            </div>

            <div class="form-group">
              <label for="cat-desc">Descripción Breve *</label>
              <input 
                id="cat-desc"
                v-model="formDescription" 
                type="text" 
                class="form-input" 
                placeholder="Ej. Talleres, conferencias y hackathones tecnológicos..."
                required
              />
            </div>
          </div>

          <div class="form-actions-row">
            <button 
              type="submit" 
              class="btn-submit"
              :disabled="formLoading"
            >
              <span>{{ formLoading ? '⏳ Procesando...' : isEditing ? '💾 Guardar Cambios' : '➕ Crear Categoría' }}</span>
            </button>

            <button 
              v-if="isEditing" 
              type="button" 
              class="btn-cancel-edit"
              @click="cancelEdit"
            >
              ✕ Cancelar
            </button>
          </div>
        </form>
      </section>

      <!-- 4. Barra de Búsqueda de Categorías -->
      <div class="toolbar-wrapper">
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input 
            v-model="searchQuery" 
            type="text" 
            class="search-input" 
            placeholder="Buscar categoría por nombre o descripción..."
          />
          <button v-if="searchQuery" class="clear-btn" @click="searchQuery = ''">✕</button>
        </div>

        <span class="count-pill">
          🏷️ {{ filteredCategories.length }} Categorías disponibles
        </span>
      </div>

      <!-- 5. Grid de Categorías -->
      <section class="categories-section">
        <!-- Estado de Carga -->
        <div v-if="loading && categories.length === 0" class="loading-state">
          <span class="spinner">⏳</span>
          <p>Cargando categorías de MongoDB...</p>
        </div>

        <!-- Grid de Cards de Categoría -->
        <div v-else-if="filteredCategories.length > 0" class="categories-grid">
          <article 
            v-for="cat in filteredCategories" 
            :key="cat._id" 
            class="cat-card"
            :class="{ 'card-editing': isEditing && editingId === cat._id }"
          >
            <div class="cat-card-top">
              <div class="cat-icon-badge">🏷️</div>
              <div class="cat-badge-slug">{{ cat.slug || 'oficial' }}</div>
            </div>

            <h3 class="cat-title">{{ cat.name }}</h3>
            <p class="cat-description">{{ cat.description }}</p>

            <div class="cat-footer">
              <span class="cat-status-dot">● Activa en Catálogo</span>
              <div class="cat-actions">
                <button 
                  class="btn-cat-edit" 
                  title="Editar categoría"
                  @click="startEdit(cat)"
                >
                  ✏️ Editar
                </button>
                <button 
                  class="btn-cat-delete" 
                  title="Eliminar categoría"
                  @click="handleDelete(cat)"
                >
                  🗑️
                </button>
              </div>
            </div>
          </article>
        </div>

        <!-- Empty State -->
        <div v-else class="empty-state">
          <span class="empty-icon">🏷️</span>
          <h3>No se encontraron categorías</h3>
          <p>No hay categorías que coincidan con "{{ searchQuery }}".</p>
          <button class="btn-clear-filters" @click="searchQuery = ''">
            Restablecer Búsqueda
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.admin-categories-page {
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
  background: radial-gradient(circle, rgba(251, 191, 36, 0.12) 0%, rgba(99, 102, 241, 0.08) 50%, transparent 70%);
  filter: blur(80px);
  pointer-events: none;
  z-index: 0;
}

.categories-container {
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
  background: rgba(251, 191, 36, 0.12);
  border: 1px solid rgba(251, 191, 36, 0.3);
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 700;
  color: #fcd34d;
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
.categories-hero {
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
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #f43f5e 100%);
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

/* 3. Form Card */
.form-card {
  background: rgba(22, 30, 49, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 1.75rem 2rem;
  backdrop-filter: blur(16px);
  margin-bottom: 2.5rem;
  box-shadow: 0 15px 35px -10px rgba(0, 0, 0, 0.5);
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
}

.form-title-group {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.form-title-group h3 {
  font-size: 1.2rem;
  font-weight: 800;
  color: #f8fafc;
}

.editing-badge {
  background: rgba(251, 191, 36, 0.15);
  border: 1px solid rgba(251, 191, 36, 0.3);
  color: #fcd34d;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.25rem;
  margin-bottom: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.form-group label {
  font-size: 0.825rem;
  font-weight: 700;
  color: #cbd5e1;
}

.form-input {
  background: rgba(11, 15, 25, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #f8fafc;
  font-size: 0.9rem;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  outline: none;
  transition: all 0.2s;
}

.form-input:focus {
  border-color: rgba(251, 191, 36, 0.6);
  box-shadow: 0 0 15px rgba(251, 191, 36, 0.2);
}

.form-actions-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.btn-submit {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: #0b0f19;
  border: none;
  font-size: 0.9rem;
  font-weight: 800;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 15px rgba(251, 191, 36, 0.3);
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(251, 191, 36, 0.4);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-cancel-edit {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #cbd5e1;
  font-size: 0.85rem;
  font-weight: 600;
  padding: 0.75rem 1.25rem;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel-edit:hover {
  background: rgba(255, 255, 255, 0.15);
  color: white;
}

/* 4. Toolbar */
.toolbar-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
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
  max-width: 480px;
}

.search-icon {
  font-size: 1.1rem;
  color: #fbbf24;
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

.count-pill {
  font-size: 0.85rem;
  color: #cbd5e1;
  font-weight: 600;
  background: rgba(22, 30, 49, 0.7);
  padding: 0.5rem 1rem;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

/* 5. Grid de Categorías */
.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.cat-card {
  background: rgba(22, 30, 49, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 1.5rem;
  backdrop-filter: blur(16px);
  display: flex;
  flex-direction: column;
  transition: all 0.3s;
}

.cat-card:hover {
  transform: translateY(-3px);
  border-color: rgba(251, 191, 36, 0.4);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
}

.card-editing {
  border-color: #fbbf24 !important;
  box-shadow: 0 0 20px rgba(251, 191, 36, 0.25) !important;
}

.cat-card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.cat-icon-badge {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(251, 191, 36, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.cat-badge-slug {
  font-size: 0.7rem;
  color: #94a3b8;
  font-family: monospace;
  background: rgba(11, 15, 25, 0.6);
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
}

.cat-title {
  font-size: 1.15rem;
  font-weight: 800;
  color: #f8fafc;
  margin-bottom: 0.4rem;
}

.cat-description {
  font-size: 0.875rem;
  color: #94a3b8;
  line-height: 1.5;
  margin-bottom: 1.5rem;
  flex: 1;
}

.cat-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.cat-status-dot {
  font-size: 0.75rem;
  color: #34d399;
  font-weight: 600;
}

.cat-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-cat-edit {
  background: rgba(251, 191, 36, 0.12);
  border: 1px solid rgba(251, 191, 36, 0.25);
  color: #fcd34d;
  font-size: 0.775rem;
  font-weight: 700;
  padding: 0.35rem 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cat-edit:hover {
  background: rgba(251, 191, 36, 0.25);
  color: white;
}

.btn-cat-delete {
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.25);
  color: #f87171;
  font-size: 0.8rem;
  padding: 0.35rem 0.65rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cat-delete:hover {
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
